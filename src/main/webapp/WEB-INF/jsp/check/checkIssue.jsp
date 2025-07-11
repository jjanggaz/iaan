<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<body>
      	<main class="area-conts ">
	       	<section class="sect-pageTitle">
	        	<h3>현장설계점검</h3>
	       	</section>
			<section class="sect-cont">
				<jsp:include page="/layout/fragments/search.jsp" flush="true" />
				<div class="line-table">
					<table id="grid-issuelist"></table>
				</div>
			</section>

			<div class="wrap-pagination"></div>
      	</main>

</body>
<script type="text/javascript">

document.addEventListener('DOMContentLoaded', function() {
	//changeSearchLevel(-1);
	//fnSearchList(1);
});

$(window).resize(function() {
	$("#grid-issuelist").setGridWidth($(".sect-cont .line-table").width());
});

function initGridListCheckIssue(gridData)	{
	$("#grid-issuelist").jqGrid('GridUnload');
	$("#grid-issuelist").jqGrid({
	    colNames: ["번호", "제목", "댓글", "Plant", "Unit", "Building", "Level", "루트밸브", "등록일", "등록자", "삭제",""],
	    colModel: [
	    	{ name: "rownum", width: "50px", sortable: false },
	        { name: "issueTitle", width: "150px", sortable: false },
	        { name: "commentCnt", width: "150px", sortable: false },
	        { name: "plantNm", width: "50px", sortable: false },
	        { name: "unitNm", width: "150px", sortable: false },
	        { name: "buildingNm", width: "100px", sortable: false },
	        { name: "levelNm", width: "100px", sortable: false },
	        { name: "rootValveNm", width: "100px", sortable: false },
	        { name: "regDate", width: "120px", sortable: false },
	        { name: "regId", width: "120px", sortable: false },
	        { name: "", index: "btn2", width: "50px", formatter:formatOptissue, sortable: false},
	        { name: "issueSeq", hidden:true },
	    ],
	    autowidth:true,
	    data: gridData,
	    onSelectRow : function(index, status,e) {
	    	
	    	var columnIndex = $.jgrid.getCellIndex($(e.target).closest('td')[0]);
	    	
	    	if(columnIndex != 10){
		    	if (index) {
					var selRowData = $("#grid-issuelist").jqGrid('getRowData',index);
					
					fnCheckIssuePopup(selRowData.issueSeq);
				}
		    }
		},
		gridComplete: function(){ //현재 그리드 마우스커서 변경
	        var rowIds = $("#grid-issuelist").getDataIDs();
	        var rowData = $("#grid-issuelist").getRowData();
	        $.each(rowData, function(idx, rowId){
	        	$("#grid-issuelist").jqGrid('setRowData', rowIds[idx], false, {cursor:'pointer'});
	        });
	    }
	});

	if(gridData.length == 0){
        $("#grid-issuelist").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    }
}

function formatOptissue(cellvalue, options, rowObject){
	
	return "<button onclick=\"javascript:issueDelete('" + rowObject.issueSeq + "', '" + rowObject.issueTitle + "');\" title=\"DEL DWG\">DEL</button>";
}
function issueDelete(issueSeq,issueTitle){

	if(issueSeq == "null" || issueSeq == ""){
		alert("삭제할 설계점검 데이타가 없습니다.");
		//return false;
	}
	if(confirm("["+issueTitle+"]" +" 설계점검 데이타를 삭제 하시겠습니까?")){
		
		var params =  {issueSeq:issueSeq};

		$.ajax({
			url : "/admin/issuedelete",
			type : 'POST',
			contentType:"application/json; charset=UTF-8",
			async: false,
			data : JSON.stringify(params) , 
			success : function(data) {
				alert("삭제 하였습니다.");
				fnSearchList(1);
			},
			error : function(err) {
				alert("Error : 오류코드 [ " + err.status + " ]");
			}
		});
		
	}
}
</script>

<jsp:include page="/layout/fragments/footer.jsp" flush="true" />


