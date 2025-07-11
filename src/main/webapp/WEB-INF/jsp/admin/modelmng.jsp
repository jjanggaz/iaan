<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body>
   	<main class="area-conts customScrollbar">
       	<section class="sect-pageTitle">
        	<h3>3D 도면관리</h3>
       	</section>

		<section class="sect-cont">
			<jsp:include page="/layout/fragments/search.jsp" flush="true" />
			<div class="line-table">
				<table id="grid-modellist"></table>
			</div>
		</section>
		<div class="wrap-pagination"></div>
 	</main>
</body>




<script>
$(function(){
	$(document).on("click",".box-moveDoc .btn-moveRight", function(){
		let txtInput = $(this).closest(".box-moveDoc").find("input.input-text");
		if(txtInput.val() != "") {
			$(this).closest(".box-moveDoc").find("ul.list-docs").append("<li>"+ txtInput.val() +"<button class='btn-close'></button></li>");
			txtInput.val("");
		}
	});
	$(document).on("click",".box-moveDoc > ul.list-docs > li .btn-close", function(){
		$(this).closest("li").remove();
	});
});

</script>

<script>
document.addEventListener('DOMContentLoaded', function() {
	
	changeSearchLevel(-1);
	//fnSearchList(1);
	changeSearchLevelPop(-1);
});

$(window).resize(function() {
	$("#grid-modellist").setGridWidth($(".sect-cont .line-table").width());
});

function initGridListModel(gridData)	{
	$("#grid-modellist").jqGrid('GridUnload');
	$("#grid-modellist").jqGrid({
		colNames: ["Plant", "Unit", "Building", "Level", "Dgn파일", "Dtdx파일","홀로렌즈 Dtdx파일","삭제"], //,"수정"],  개발 완료 안됨 .
        colModel: [
            { name: "plantNm", width: "55px", sortable: false },
            { name: "unitNm", width: "50px", sortable: false },
            { name: "buildingNm", width: "55px", sortable: false },
            { name: "levelNm", width: "50px", sortable: false },
            
            { name: "fileDgnNm", width: "50px", sortable: false },
          //  { name: "modelSeq", width: "50px", sortable: false },
            { name: "fileDtdxNm", width: "50px", sortable: false },
            { name: "fileHdtdxNm", width: "50px", sortable: false },
            { name: "modelSeq", index: "btn2", width: "50px", formatter:formatOpt32, sortable: false},
          //  { name: "modelSeq", index: "btn3", width: "50px", formatter:formatOptModelUp, sortable: false},
	      
        ],
        autowidth:true,
        data: gridData,
	});

	if(gridData.length == 0){
        $("#grid-modellist").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    }
}
/* grid에서 버튼 처리 */
function formatOpt32(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:modelDelete('" + rowObject.modelSeq + "', '" + rowObject.fileDgnNm + "');\" title=\"DEL DWG\">DEL</button>";
}
/* grid에서 버튼 처리 */
function formatOptModelUp(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:modelUpdate('" + rowObject.modelSeq + "', '" + rowObject.fileDgnNm + "');\" title=\"DEL DWG\">수정</button>";
}
//수정
function modelUpdate(modelSeq,dwgName){
	openPop('pop-modelinsert','update');
	
	
	var params = {"modelSeq" : modelSeq};

	$.ajax({
		url : "/admin/modelone",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params), 
		success : function(data) {
			//alert(JSON.stringify(data.list[0]));
			
			// $("#searchPlantPop").val(data.list[0].dwgPlant);
			$("#searchPlantPop").empty(); 
			
			 $("select[name=searchPlantPop]").attr("disabled", true);
			 $("select[name=searchUnitPop]").attr("disabled", true);
			 $("select[name=searchBuildingPop]").attr("disabled", true);
			 $("select[name=searchLevelPop]").attr("disabled", true);
			 
			 $("#searchPlantPop").append("<option value=''>"+data.list[0].plantNm+"</option>");
			 $("#searchUnitPop").append("<option value=''>"+data.list[0].unitNm+"</option>");
			 $("#searchBuildingPop").append("<option value=''>"+data.list[0].buildingNm+"</option>");
			 $("#searchLevelPop").append("<option value=''>"+data.list[0].levelNm+"</option>");
			 
			
			 
			 
			 
			 
			 $("#modeSeq3d").val(data.list[0].mSeq);
			 
			 updatemodelList(data.list[0].dwgPlant,data.list[0].dwgUnit,data.list[0].dwgBuilding,data.list[0].dwgLevel, data.list[0].mseq,data.list[0].rootValveNm,data.list[0].tagSeq,data.list[0].passSeq,data.list[0].passTag,data.list[0].dwgFileNm,data.list[0].aeFileNm);
			 
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
	

}
function modelIns(){
	var formData = $("#form1").serialize();

    const dgnFile = $("#dgnInput")[0].files[0];
    const dtdxFile = $("#dtdxInput")[0].files[0];
    const ncsvFile = $("#csvInput")[0].files[0];
    const hdtdxFile = $("#hdtdxInput")[0].files[0];
    
    const modelData = new FormData();
    modelData.append("dgnFile", dgnFile);
    modelData.append("dtdxFile", dtdxFile);
    modelData.append("hdtdxFile", hdtdxFile);
    modelData.append("csvFile", ncsvFile);
    
    modelData.append("plant",  $("#searchPlantPop").val());
    modelData.append("unit",  $("#searchUnitPop").val());
    modelData.append("build",  $("#searchBuildingPop").val());
    modelData.append("level",  $("#searchLevelPop").val());
    
    
    if($("#searchPlantPop").val() == ""){
    	alert("Plant 를 선택해 주세요. ");
    	return false;
    }else if($("#searchUnitPop").val() == ""){
    	alert("Unit 를 선택해 주세요. ");
    	return false;
    }else if($("#searchBuildingPop").val() == ""){
    	alert("Building 를 선택해 주세요. ");
    	return false;
    }else if($("#searchLevelPop").val() == ""){
    	alert("Level 를 선택해 주세요. ");
    	return false;
    }
    if(dgnFile == null){
    	alert("Dgn 파일을 선택해 주세요. ");
    	return false;
    }
   
    $.ajax({
        cache : false,
        url : "/admin/modelinsert", // 요기에
        type : 'POST', 
        data: modelData,
        contentType: false,
        processData: false,
        enctype: "multipart/form-data",
        success : function(data) {
            //var jsonObj = JSON.parse(data);
            
        	alert("저장하였습니다.");
        	closePopAbsolute('pop-modelinsert');
        	clearData3Dmodel();
        	fnSearchList(1);
        }, // success 

        error : function(xhr, status) {
            alert(xhr + " : " + status);
        }
    }); 
    
}


function fnModelInit(){
	
	 $("#dgnInput").attr("disabled", false);
	 $("#dtdxInput").attr("disabled", false);
	 $("#hdtdxInput").attr("disabled", false);
	 $("#csvInput").attr("disabled", false);
	 
	 $("#txtdgnInput").attr("readonly", false);
	 $("#txtdtdxInput").attr("readonly", false);
	 $("#txthdtdxInput").attr("readonly", false);
	 $("#txtcsvInput").attr("readonly", false);
	 
	 $("select[name=searchPlantPop]").attr("disabled", false);
	 $("select[name=searchUnitPop]").attr("disabled", false);
	 $("select[name=searchBuildingPop]").attr("disabled", false);
	 $("select[name=searchLevelPop]").attr("disabled", false);
	 
	 
	 $("#txtdgnInput").val("");
	 $("#txtdtdxInput").val("");
	 $("#txthdtdxInput").val("");
	 $("#txtcsvInput").val("");
}
function clearData3Dmodel(){
	changeSearchLevelPop(-1);
	
	let file= $("input[type=file]");
	file.val("");
	
	
}
function modelDelete(dwgSeq,dwgName){

	if(dwgName == "null" || dwgName == ""){
		alert("삭제할 도면이 없습니다.");
		//return false;
	}
	if(confirm("["+dwgName+"]" +" 도면을 삭제 하시겠습니까?")){
		
		var params =  dwgSeq;

		$.ajax({
			url : "/admin/modeldelete",
			type : 'POST',
			contentType:"application/json; charset=UTF-8",
			async: false,
			data : params , 
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

<!--  등록팝업 조건절 aaaa  -->
 let HierarchySelectListModelPop = ["searchPlantPop", "searchUnitPop", "searchBuildingPop", "searchLevelPop", "searchTag"];
function changeSearchLevelPop(selectLevel)	{

	var searchParentId;
	var lvlCode = "";
	for(var i = selectLevel + 1; i < 5; i++)	{
		$("#" + HierarchySelectListModelPop[i]).empty();
	}
	
     if(selectLevel == 2){
		lvlCode = "LVL";
	 }
	
	(selectLevel == -1) ? searchParentId = "012" : searchParentId = $('#' + HierarchySelectListModelPop[selectLevel] + ' option:selected').val();

	if(searchParentId != undefined && searchParentId != "")	{
		var params = {parentId : searchParentId ,lvlCode : lvlCode};
      
		$.ajax({
			url : "/common/hierarchySelectbox",
			type : 'POST',
			contentType:"application/json; charset=UTF-8",
			async: false,
			data : JSON.stringify(params),
			success : function(success) {
				$("#" + HierarchySelectListModelPop[selectLevel + 1]).append("<option value=''>선택하세요</option>");
				for(var i = 0; i < success.data.length; i++)	{
					$("#" + HierarchySelectListModelPop[selectLevel + 1]).append("<option value='" + success.data[i].cdId + "'>" + success.data[i].cdNm + "</option>");
				}
			},
			error : function(err) {
				alert("Error : 오류코드 [ " + err.status + " ]");
			}
		});
	}
} 
</script>




<jsp:include page="/layout/fragments/footer.jsp" flush="true" />