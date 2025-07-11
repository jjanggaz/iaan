<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body>
	<main class="area-conts">
		<section class="sect-pageTitle">
			<h3>제작현황</h3>
		</section>
		<section class="sect-cont">
			<jsp:include page="/layout/fragments/search.jsp" flush="true" />
			<div class="line-table">
				<table id="grid-stateOfProd"></table>
			</div>
		</section>
		<div class="wrap-pagination"></div>
	</main>
</body>

<script>
document.addEventListener('DOMContentLoaded', function() {
	//fnSearchList(1);
});

$(window).resize(function() {
	$("#grid-stateOfProd").setGridWidth($(".sect-cont .line-table").width());
});

function initGridListPlan(gridData)	{
	$("#grid-stateOfProd").jqGrid('GridUnload');
	$("#grid-stateOfProd").jqGrid({
		colNames: ["Plant", "Unit", "Building", "Level", "루트밸브", "공종명", "시작일", "종료일", "계획물량", "실적물량", "시공사", "시공내역","공사계획",""],
        colModel: [
        	
            { name: "plantNm", width: "60px", sortable: false },
            { name: "unitNm", width: "60px", sortable: false },
            { name: "buildingNm", width: "120px", sortable: false },
            { name: "levelNm", width: "70px", sortable: false },
            { name: "rootValveNm", width: "70px", sortable: false },
            { name: "workCdNm", width: "80px", sortable: false },
            { name: "startDate", width: "80px", sortable: false },
	        { name: "endDate", width: "80px", sortable: false },
            { name: "planQuantity", width: "60px", sortable: false },
	        { name: "actualQuantity", width: "60px", sortable: false },
            { name: "builder", width: "100px", sortable: false },
            { name: "buildContents", width: "200px", sortable: false },
            
            { name: "btn1", index: "btn1", width: "50px",formatter:formatPlanOpt1, sortable: false},
	        { name: "tagSeq", hidden:true },
	        
        ],
        autowidth:true,
        data: gridData,
	});

	//
	if(gridData.length == 0){
        $("#grid-stateOfProd").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    }
}
/* grid에서 버튼 처리 */
function formatPlanOpt1(cellvalue, options, rowObject){
	return "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='View Image' onclick=\"fnConstUpdate('" + rowObject.tagSeq + "', '" + rowObject.builder + "', '" + rowObject.startDate + "', '" + rowObject.endDate + "', '" + rowObject.wcd + "')\" />";
}

function fnConstUpdate(tagSeq,builder,startDate,endDate,wcd){
	$("#txtTagSeq").val(tagSeq);
	$("#txtBuilder").val(builder);
	$("#txtStartDate").val(startDate);
	$("#txtEndDate").val(endDate);
	$("#txtWCd").val(wcd);
	openPop('pop-plan');
}

function fnBuilderSave(){
	
	
	var lBuilder = $("#txtBuilder").val();
	
	if(lBuilder == ""){
		alert("공사업체를 입력해 주세요.");
	   	return;
	}
	
	if($("#txtStartDate").val() == ""){
		alert("공사 시작일 을 입력해 주세요.");
	   	return;
	}
	if($("#txtEndDate").val() == ""){
		alert("공사 종료일 을 입력해 주세요.");
	   	return;
	}
	
	
	var params = {tagSeq : $("#txtTagSeq").val() ,wcd : $("#txtWCd").val(), builder : $("#txtBuilder").val(),startDate :$("#txtStartDate").val() , endDate : $("#txtEndDate").val() };
	$.ajax({
	      url : "/wbs/update",
	      type : 'POST',
	      contentType:"application/json; charset=UTF-8",
	      async: false,
	      data : JSON.stringify(params),
	      success : function(success) {
	    	  closePopAbsolute("pop-plan"); 
	    	  fnSearchList(1);
	      },
	      error : function(err) {
	        alert("Error : 오류코드 [ " + err.status + " ]");
	      }
	 });
	
	
	
}
function onClickUpload() {
	let uploadExcelInput = document.getElementById("uploadExcelInput");
    uploadExcelInput.click();
}

function fnFileNameSet(obj)	{
	var fileNm = $('#uploadExcelInput')[0].files[0].name;
	$('#viewfileNm').val(fileNm);
}

/* 업로드 */
function fnWbsExcelUpload() {
	const file = $("#uploadExcelInput")[0];

	if(file.files.length === 0){
		alert("No files");
	   	return;
	}

	const formData = new FormData();
	formData.append("file", file.files[0]);

	$.ajax({
	   type:"POST",
	   url: "/wbs/excelUpload",
	   processData: false,
	   contentType: false,
	   data: formData,
	   success: function(data){
		   initGridExcelList(data);
	   },
	   err: function(err){
	     console.log("err:", err)
	   }
	})
}

function initGridExcelList(gridData)	{
	$("#grid-excel").jqGrid('GridUnload');
	$("#grid-excel").jqGrid({
		colNames: ["Plant", "Unit", "Building", "Level", "루트밸브", "공종명", "시작일", "종료일", "계획물량", "실적물량", "시공사", "시공내역", "결과", "", ""],
        colModel: [
            { name: "plantNm", width: "80px", sortable: false },
            { name: "unitNm", width: "70px", sortable: false },
            { name: "buildingNm", width: "150px", sortable: false },
            { name: "levelNm", width: "70px", sortable: false },
            { name: "rootValveNm", width: "70px", sortable: false },
            { name: "wCdNm", width: "80px", sortable: false },
            { name: "startDate", width: "80px", sortable: false },
	        { name: "endDate", width: "80px", sortable: false },
            { name: "planQuantity", width: "60px", sortable: false },
	        { name: "actualQuantity", width: "60px", sortable: false },
            { name: "builder", width: "150px", sortable: false },
            { name: "buildContents", width: "200px", sortable: false },
            { name: "errMsg", width: "180px", sortable: false },
            { name: "tagSeq", width: "180px", hidden: true },
            { name: "WCd", width: "180px", hidden: true },
        ],
	    autowidth:true,
	    data: gridData,
	});
}

function fnWbsExcelSave()	{

	var rtn = 0;
	var params = [];

	var ids = $('#grid-excel').jqGrid('getDataIDs');
    for(var i =0; i< ids.length; i++){
        var ret = $('#grid-excel').jqGrid('getRowData', ids[i]);
        params.push(ret);

        if(ret.errMsg != ""){
        	rtn++;
        	continue;
        }
    }
    if(ids.length == 0){
    	alert("데이터가 없습니다.");
    	return false;
    }

    if(rtn > 0){
    	alert("데이터에 오류가 있습니다.");
    	return false;
    }
    
    

    const formData = new FormData();
	formData.append("upExcelData", JSON.stringify(params));

    $.ajax({
    	type:"POST",
 	   	url: "/wbs/excelSave",
 	   	processData: false,
 	   	contentType: false,
 	   	data: formData,
 	   	success: function(data){
	 	   	alert("저장하였습니다.");
			closePop('pop-view-1');
			fnPopupReset();
			fnSearchList(1);
 	   	},
 	   	err: function(err){
	 	   	alert(request.status);
			alert(request.responseText);
 	   	}
	});
}

function fnWbsExcelDownload()	{
	location.href = "/plan/excelDownload";
}

function fnPopupReset()	{
	$("#grid-excel").jqGrid('GridUnload');
	$('#viewfileNm').val("");
}
</script>

<jsp:include page="/layout/fragments/footer.jsp" flush="true" />
