<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body>

      	<main class="area-conts">
	       	<section class="sect-pageTitle">
	        	<h3>2D 도면관리</h3>
	       	</section>

       		<section class="sect-cont">
       			<jsp:include page="/layout/fragments/search.jsp" flush="true" />
				<div class="line-table">
					<table id="grid-dwglist"></table>
				</div>
			</section>

			<div class="wrap-pagination"></div>
    	</main>
 
</body>


<script>

	$(".dropdown dt a").on('click', function() {
		$(".dropdown dd ul").slideToggle('fast');
	});
	$(".dropdown dd ul li a").on('click', function() {
		$(".dropdown dd ul").hide();
	});
	function getSelectedValue(id) {
		return $("#" + id).find("dt a span.value").html();
	}
	
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
	});
	$(document).on('click', '.mutliSelect input[type="checkbox"]', function() {
		var title = $(this).closest('li').text() + ",";
		//  title = $(this).closest('li').text() + ",";
		if ($(this).is(':checked')) {
			var html = '<span title="' + title + '">' + title + '</span>';
		    $('.multiSel').append(html);
		    $(".hida").hide();
		} else {
		    $('span[title="' + title + '"]').remove();
		    var ret = $(".hida");
		    $('.dropdown dt a').append(ret);
	
		}
	});
</script>



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
	
	$(document).on("click",".box-passmoveDoc .btn-moveRight", function(){
		let txtpassInput = $(this).closest(".box-passmoveDoc").find("input.input-text");
		if(txtpassInput.val() != "") {
			$(this).closest(".box-passmoveDoc").find("ul.list-passdocs").append("<li>"+ txtpassInput.val() +"<button class='btn-close'></button></li>");
			txtpassInput.val("");
		}
	});
	$(document).on("click",".box-passmoveDoc > ul.list-passdocs > li .btn-close", function(){
		$(this).closest("li").remove();
	});
});

</script>

<script>
document.addEventListener('DOMContentLoaded', function() {
	changeSearchLevel(-1);
	//fnSearchList(1);
	changeSearchDwgLevelPop(-1);
	
	constcode(3);
});

$(window).resize(function() {
	$("#grid-dwglist").setGridWidth($(".sect-cont .line-table").width());
});

function initGridListDwg(gridData)	{

	$("#grid-dwglist").jqGrid('GridUnload');
	$("#grid-dwglist").jqGrid({
		colNames: ["Plant", "Unit", "Building", "Level", "태그", "공종","AE도면", "시공사도면","등록일",  "삭제","수정"],
        colModel: [
            { name: "plantNm", width: "55px", sortable: false },
            { name: "unitNm", width: "50px", sortable: false },
            { name: "buildingNm", width: "55px", sortable: false },
            { name: "levelNm", width: "50px", sortable: false },
            { name: "rootValveNm", width: "50px", sortable: false },
            { name: "wcdNm", width: "50px", sortable: false },
            
            { name: "aeName", width: "50px", sortable: false },
            { name: "dwgName", width: "50px", sortable: false },
            { name: "regDate", width: "50px", sortable: false },
            { name: "dwgSeq", index: "btn2", width: "50px", formatter:formatOptDwgDel, sortable: false},
            { name: "dwgSeq", index: "btn3", width: "50px", formatter:formatOptDwgUp, sortable: false},
	      
        ],
        autowidth:true,
        data: gridData,
	});

	if(gridData.length == 0){
        $("#grid-dwglist").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    }
}
/* grid에서 버튼 처리 */
function formatOptDwgDel(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:dwgDelete('" + rowObject.dwgSeq + "', '" + rowObject.dwgName + "');\" title=\"DEL DWG\">DEL</button>";
}
/* grid에서 버튼 처리 */
function formatOptDwgUp(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:dwgUpdate('" + rowObject.dwgSeq + "', '" + rowObject.dwgName + "');\" title=\"DEL DWG\">수정</button>";
}
function dwgDelete(dwgSeq,dwgName){
	
/*	if(dwgName == "null" || dwgName == ""){
		alert("삭제할 도면이 없습니다.");
		return false;
	} */
	if(confirm("["+dwgName+"]" +" 도면을 삭제 하시겠습니까?")){
		
		var params =  dwgSeq;

		$.ajax({
			url : "/admin/dwgdelete",
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

//수정
function dwgUpdate(dwgSeq,dwgName){
	openPop('pop-dwginsert','update');
	
	
	var params = {"dwgSeq" : dwgSeq};

	$.ajax({
		url : "/admin/dwgone",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params), 
		success : function(data) {
			//alert(JSON.stringify(data.list[0]));
			
			 $("#searchPlantDwgPop").val(data.list[0].dwgPlant);
			 $("#searchUnitDwgPop").append("<option value=''>"+data.list[0].dwgUnit+"</option>");
			 $("#searchBuildingDwgPop").append("<option value=''>"+data.list[0].dwgBuilding+"</option>");
			 $("#searchLevelDwgPop").append("<option value=''>"+data.list[0].dwgLevel+"</option>");
			 
			 $("#searchConstDwgPop").val(data.list[0].wcd);
			 
			 $("select[name=searchPlantDwgPop]").attr("disabled", true);
			 $("select[name=searchUnitDwgPop]").attr("disabled", true);
			 $("select[name=searchBuildingDwgPop]").attr("disabled", true);
			 $("select[name=searchLevelDwgPop]").attr("disabled", true);
			 $("select[name=searchConstDwgPop]").attr("disabled", true);
			 
			 
			 $("#dwgSeq2d").val(data.list[0].dwgSeq);
			 
			 updatemodelList(data.list[0].dwgPlant,data.list[0].dwgUnit,data.list[0].dwgBuilding,data.list[0].dwgLevel, data.list[0].mseq,data.list[0].rootValveNm,data.list[0].tagSeq,data.list[0].passSeq,data.list[0].passTag,data.list[0].dwgFileNm,data.list[0].aeFileNm);
			 
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
	

}
function dwgUpdateData(){
	var modelVal = [];
	$("input[name=model3d]:checked").each(function(){
		var chk = $(this).val();
		modelVal.push(chk);
	
	})
	
	const modelData1 = new FormData();
    
    modelData1.append("dwgSeq",  $("#dwgSeq2d").val());
    modelData1.append("modelVal",  modelVal);
    
    $.ajax({
        cache : false,
        url : "/admin/dwgupdate", // 요기에
        type : 'POST', 
        data: modelData1,
        contentType: false,
        processData: false,
        enctype: "multipart/form-data",
        success : function(data) {
         	alert("저장하였습니다.");
         	closePopAbsolute('pop-dwginsert');
        	clearData2D();
        	fnSearchList(1);
        }, // success 

        error : function(xhr, status) {
            alert(xhr + " : " + status);
        }
    }); 
    
 
}
function dwgInsert(){

	var popId ="pop-dwginsert";
	if( $("#"+popId + " .line-title .title").text() == "2D 수정"){
		dwgUpdateData();
		return; 
	}
	
	var formData = $("#form1").serialize();
	
	
	//const aeFileInput = document.getElementById("aeInput");
	//const aeFile = aeFileInput.files;
	//const dwgFileInput = document.getElementById("dwgInput");
	//const dwgFile = dwgFileInput.files;
	  
    const aeFile = $("#aeInput")[0].files[0];
    const dwgFile = $("#dwgInput")[0].files[0];
   
    
 // 3d모델 선택된 거 가져오기 
    var modelVal = [];
	$("input[name=model3d]:checked").each(function(){
		var chk = $(this).val();
		modelVal.push(chk);
	
	})
	
    // 루트 밸브 값 가져오기 
    var rootVal = [];
	$(".list-docs li").each(function( index, element ) {
	    
	    rootVal.push($(this).text());
	  
	});
	var passVal = [];
	$(".list-passdocs li").each(function( index, element ) {
		passVal.push($(this).text());
	});
	
	
    const modelData = new FormData();
    modelData.append("aeFile", aeFile);
    modelData.append("dwgFile", dwgFile);
 	
    modelData.append("plant",  $("#searchPlantDwgPop").val());
    modelData.append("unit",  $("#searchUnitDwgPop").val());
    modelData.append("build",  $("#searchBuildingDwgPop").val());
    modelData.append("level",  $("#searchLevelDwgPop").val());
    modelData.append("wCd",  $("#searchConstDwgPop").val());
    modelData.append("modelVal",  modelVal);
    modelData.append("rootVal", rootVal);
    
    modelData.append("passVal", passVal);
    
    if($("#searchPlantDwgPop").val() == ""){
    	alert("Plant 를 선택해 주세요. ");
    	return false;
    }else if($("#searchUnitDwgPop").val() == ""){
    	alert("Unit 를 선택해 주세요. ");
    	return false;
    }else if($("#searchBuildingDwgPop").val() == ""){
    	alert("Building 를 선택해 주세요. ");
    	return false;
    }else if($("#searchLevelDwgPop").val() == ""){
    	alert("Level 를 선택해 주세요. ");
    	return false;
    }
    if(dwgFile == null){
    	alert("시공사 파일을 선택해 주세요. ");
    	return false;
    }
  
    $.ajax({
        cache : false,
        url : "/admin/dwginsert", // 요기에
        type : 'POST', 
        data: modelData,
        contentType: false,
        processData: false,
        enctype: "multipart/form-data",
        success : function(data) {
         	alert("저장하였습니다.");
         	closePopAbsolute('pop-dwginsert');
         	clearData2D();
        	fnSearchList(1);
        }, // success 

        error : function(xhr, status) {
            alert(xhr + " : " + status);
        }
    }); 
    
}

function clearData2D(){
	changeSearchDwgLevelPop(-1);
	$("#searchConstDwgPop").val("");
	$("#txttagText").val("");
	$("#txtpassText").val("");
	$("#constDiv").empty();
	$(".list-docs li").remove();
	$(".list-passdocs li").remove();
	$('.multiSel').html('<span class="hida">선택하세요</span> ');
	let file= $("input[type=file]");
	file.val("");
	
}

function constcode(selectLevel){
	
	var params = {parentId : "011" ,lvlCode : ""};
	$.ajax({
		url : "/common/hierarchySelectbox",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(success) {
		
			$("#searchConstDwgPop").append("<option value=''>선택하세요</option>");
			for(var i = 0; i < success.data.length; i++)	{
				$("#searchConstDwgPop").append("<option value='" + success.data[i].cdId + "'>" + success.data[i].cdNm + "</option>");
			}
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

//모델선택 값
function modelList(){

	var dwgPlant 	=$("#searchPlantDwgPop").val();
	var dwgUnit  	=$("#searchUnitDwgPop").val();
	var dwgBuilding =$("#searchBuildingDwgPop").val();
	var dwgLevel   	=$("#searchLevelDwgPop").val();
	
	var params = {dwgPlant : dwgPlant,dwgUnit : dwgUnit,dwgBuilding : dwgBuilding,dwgLevel : dwgLevel};

	$.ajax({
		url : "/admin/modelcode",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(success) {
			
			for(var i = 0; i < success.data.length; i++)	{
				var plusUl = document.createElement('ul');
	            plusUl.innerHTML =  "<li><input type='checkbox' name='model3d' value ='"+success.data[i].modelSeq+"'  />"+success.data[i].fileDtdxNm+"</li>";   
	            document.getElementById('constDiv').appendChild(plusUl);
			}
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

//모델선택 값
function updatemodelList(dwgPlant,dwgUnit,dwgBuilding,dwgLevel,mSeq ,tagNm,tagSeq,passSeq,passTag,dwgFileNm,aeFileNm){
	var dwgPlant 	=dwgPlant ;//$("#searchPlantDwgPop").val();
	var dwgUnit  	=dwgUnit;//$("#searchUnitDwgPop").val();
	var dwgBuilding =dwgBuilding;//$("#searchBuildingDwgPop").val();
	var dwgLevel   	=dwgLevel;//$("#searchLevelDwgPop").val();
	var params = {dwgPlant : dwgPlant,dwgUnit : dwgUnit,dwgBuilding : dwgBuilding,dwgLevel : dwgLevel};
    var model = ""; //mSeq.split(",");
    
    if(mSeq != null && mSeq != "null"){
    	 model = mSeq.split(",");
    }
    var tag = tagNm.split(",");
    
    var pass = "";
    if(passTag != null && passTag != "null" && passTag != ""){
    	var pass =  passTag.split(",");
    }
   
	$.ajax({
		url : "/admin/modelcode",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(success) {
			
			for(var i = 0; i < success.data.length; i++)	{
				var plusUl = document.createElement('ul');
	            plusUl.innerHTML =  "<li><input type='checkbox' name='model3d' value ='"+success.data[i].modelSeq+"'  />"+success.data[i].fileDtdxNm+"</li>";   
	            document.getElementById('constDiv').appendChild(plusUl);
			}
			
			
			const checkboxes = document.querySelectorAll('input[name=model3d]');
		    
		    // 각 체크박스의 value를 확인하고, 일치하면 체크
		      var title = "";
		    checkboxes.forEach(checkbox => {
		    	
		    	for(var i=0 ; i< model.length;i++){
		    	//	alert(model[i] +"=="+checkbox.value);
		            if (checkbox.value === model[i]) {
			            checkbox.checked = true;
			        }
		    	}
		    });
		    
		    const checkboxes2 = document.querySelectorAll('input[name=model3d]:checked');
		    var title ="";
		    checkboxes2.forEach(checkbox => {
		        const label = checkbox.parentNode;
		        
		        title =  title+label.textContent.trim()+",";
		    });
		   	var html = '<span title="' + title + '">' + title + '</span>';
			  $('.multiSel').append(html);
			  $(".hida").hide();
		
			//tag 정보 입력 
			for(var i = 0; i < tag.length; i++)	{
			   $("ul.list-docs").append("<li>"+tag[i]+"</li>");
		    }
			//pass 정보 입력 
			for(var i = 0; i < pass.length; i++)	{
		        $("ul.list-passdocs").append("<li>"+pass[i]+"</li>");
			}

			
			 $("#aeInput").attr("disabled", true);
			 $("#dwgInput").attr("disabled", true);
			 $("#txtaeInput").attr("readonly", true);
			 $("#txtdwgInput").attr("readonly", true);
			
			/*  $("#txtpassText").attr("readonly", true);
			 $("#txttagText").attr("readonly", true);
			 */	
			 
			$("#txtaeInput").val(aeFileNm);
			$("#txtdwgInput").val(dwgFileNm);
		
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}


function fnDwgInit(){
	
	 $("#aeInput").attr("disabled", false);
	 $("#dwgInput").attr("disabled", false);
	 $("#txtaeInput").attr("readonly", false);
	 $("#txtdwgInput").attr("readonly", false);
	
	/*  $("#txtpassText").attr("readonly", false);
	 $("#txttagText").attr("readonly", false);
	 */	
	 $("select[name=searchPlantDwgPop]").attr("disabled", false);
	 $("select[name=searchUnitDwgPop]").attr("disabled", false);
	 $("select[name=searchBuildingDwgPop]").attr("disabled", false);
	 $("select[name=searchLevelDwgPop]").attr("disabled", false);
	 $("select[name=searchConstDwgPop]").attr("disabled", false);
	 
	 
	$("#txtaeInput").val("");
	$("#txtdwgInput").val("");
}
<!--  등록팝업 조건절  -->
<!--  등록팝업 조건절 4444 -->
let HierarchySelectListDwgPop = ["searchPlantDwgPop", "searchUnitDwgPop", "searchBuildingDwgPop", "searchLevelDwgPop"];

//changeSearchLevelDwgPop(0);
function changeSearchDwgLevelPop(selectLevel)	{

	var searchParentId;
	var lvlCode = "";
	for(var i = selectLevel + 1; i < 5; i++)	{
		$("#" + HierarchySelectListDwgPop[i]).empty();
	}
	
     if(selectLevel == 2){
		lvlCode = "LVL";
	 }
	
	(selectLevel == -1) ? searchParentId = "012" : searchParentId = $('#' + HierarchySelectListDwgPop[selectLevel] + ' option:selected').val();

	if(searchParentId != undefined && searchParentId != "")	{
		var params = {parentId : searchParentId ,lvlCode : lvlCode};
      
		$.ajax({
			url : "/common/hierarchySelectbox",
			type : 'POST',
			contentType:"application/json; charset=UTF-8",
			async: false,
			data : JSON.stringify(params),
			success : function(success) {
				$("#" + HierarchySelectListDwgPop[selectLevel + 1]).append("<option value=''>선택하세요</option>");
				for(var i = 0; i < success.data.length; i++)	{
					$("#" + HierarchySelectListDwgPop[selectLevel + 1]).append("<option value='" + success.data[i].cdId + "'>" + success.data[i].cdNm + "</option>");
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