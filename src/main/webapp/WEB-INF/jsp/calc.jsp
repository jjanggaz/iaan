<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body>
	<main class="area-conts">
		<section class="sect-pageTitle">
			<h3>비용정산</h3>
		</section>

      	<section class="sect-cont">
        	<jsp:include page="/layout/fragments/search.jsp" flush="true" />
			<div class="line-table">
				<table id="grid-calcList"></table>
			</div>
		</section>
		<div class="wrap-pagination"></div>
    </main>
</body>
<script>
document.addEventListener('DOMContentLoaded', function() {
	//changeSearchLevel(-1);
	//fnSearchList(1);
});

$(window).resize(function() {
	$("#grid-calcList").setGridWidth($(".sect-cont .line-table").width());
});

function initGridListCalc(gridData)	{
	$("#grid-calcList").jqGrid('GridUnload');
	$("#grid-calcList").jqGrid({
		colNames: ["Plant", "Unit", "Building", "Level", "태그", "공종명", "길이(inch)", "OD(inch)", "비용(원)"],
        colModel: [
            { name: "plantNm", width: "55px", sortable: false },
            { name: "unitNm", width: "50px", sortable: false },
            { name: "buildingNm", width: "55px", sortable: false },
            { name: "levelNm", width: "50px", sortable: false },
            { name: "rootValveNm", width: "50px", sortable: false },
            { name: "workCdNm", width: "50px", sortable: false },
            { name: "length", width: "50px", sortable: false },
            { name: "thdOd", width: "50px", sortable: false },
            { name: "expense", width: "50px",align:"right", sortable: false },
        ],
        autowidth:true,
        data: gridData,
	});

	if(gridData.length == 0){
        $("#grid-calcList").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    }
}

</script>
<jsp:include page="/layout/fragments/footer.jsp" flush="true" />