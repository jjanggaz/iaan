<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body>
  	<main class="area-conts customScrollbar">
       	<section class="sect-pageTitle">
        	<h3>3D설계점검</h3>
       	</section>

		<section class="sect-cont">
			<jsp:include page="/layout/fragments/search.jsp" flush="true" />
			<div class="line-table">
				<table id="grid-3dlist"></table>
			</div>
		</section>

		<div class="wrap-pagination"></div>
    </main>
    
</body>
<script>

document.addEventListener('DOMContentLoaded', function() {
	//changeSearchLevel(-1);
	//initGridListCheck3d();
	//fnSearchList(1);
});

$(window).resize(function() {
	$("#grid-3dlist").setGridWidth($(".sect-cont .line-table").width());
});

function initGridListCheck3d(gridData)	{

	$("#grid-3dlist").jqGrid('GridUnload');
	$("#grid-3dlist").jqGrid({
		//colNames: ["번호", "DWG", "루트밸브", "Ver", "도면등록일", "완료일", "조치기한", "조치일자", "상태", "점검", "도면", ""],
		colNames: ["번호", "DWG", "루트밸브", "도면등록일", "완료일", "조치기한",  "상태", "점검", "도면", ""],
	    colModel: [
	    	{ name: "rownum", width: "50px", sortable: false },
	        { name: "dwgNum", width: "150px", sortable: false },
	        { name: "rootValveNm", width: "150px", sortable: false },
	      /*  { name: "version", width: "50px", sortable: false }, */
	        { name: "regDate", width: "150px", sortable: false },
	        { name: "completeDate3", width: "100px", sortable: false },
	        { name: "actionDate3", width: "100px", sortable: false },
	      /*  { name: "actionDeadline", width: "100px", sortable: false },*/
	        { name: "statusNm", width: "120px", sortable: false },
	        { name: "btn1", index: "btn1", width: "50px",formatter:formatOpt31, sortable: false},
	        { name: "btn2", index: "btn2", width: "50px", formatter:formatOpt332, sortable: false},
	        { name: "dwgSeq", hidden:true, key:true },
	    ],
	    autowidth:true,
	    data: gridData,
	    /*
	    //shrinkToFit:false,
	    //multiselect: true,
	    */
	});

	if(gridData.length == 0){
        $("#grid-list").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    }
}

/* grid에서 버튼 처리 */
function formatOpt31(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:fnPopCheck('" + rowObject.dwgSeq + "', '" + rowObject.version + "');\" title=\"View Popup\">VIEW</button>";
}
/* grid에서 버튼 처리 */
function formatOpt41(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:fnImgDwon('" + rowObject.fileBase64 + "', '" + rowObject.fileId + "');\" title=\"View Popup\">VIEW</button>";
}

function fnImgDwon(dwgSeq,fileId){
	$(".line-title .title").text("간섭체크 사진");
	$('#myimg').attr('src', dwgSeq);
	openPop('pop-checkPhoto');
}
function fnPopCheck(dwgSeq, version)	{
	
	$(".line-title .title").text("3D 설계점검");
	

	$("#checkinterference").empty();
	var interferenceText ='<dt>간섭체크 결과 :</dt>'
						+' <dd class="collapseCell">'
						+' <table id="grid-3dFilelist"></table>'
						+'  </dd>';
  
	$("#checkinterference").append(interferenceText);
	
	var params = {"dwgSeq" : dwgSeq, "version" : version};

		$.ajax({
			url : "/check/checkInfo",
			type : 'POST',
			contentType:"application/json; charset=UTF-8",
			async: false,
			data : JSON.stringify(params),
			success : function(data) {
				var checkStatus = data.status;
				var fileDto = data.fileDto;
				$("#grid-3dFilelist").jqGrid('GridUnload');
				$("#grid-3dFilelist").jqGrid({
					//colNames: ["번호", "DWG", "루트밸브", "Ver", "도면등록일", "완료일", "조치기한", "조치일자", "상태", "점검", "도면", ""],
					colNames: ["파일이름", "MESH1", "MESH2", "다운로드","",""],
				    colModel: [
				    	{ name: "fileNm", width: "150px", sortable: false },
				        { name: "mesh1Id", width: "50px", sortable: false },
				        { name: "mesh2Id", width: "50px", sortable: false },
				        { name: "btn1", index: "btn1", width: "80px",formatter:formatOpt41, sortable: false},
				        { name: "fileId", hidden:true, key:true },
				        { name: "fileBase64", hidden:true, key:true },
				    ],
				    autowidth:true,
				    data: data.fileDto,
				    /*
				    //shrinkToFit:false,
				    //multiselect: true,
				    */
				});
				
				
				
				
				$("#statusNm").text(data.statusNm);
				$("#plantNm").text(data.plantNm);
				$("#unitNm").text(data.unitNm);
				$("#buildingNm").text(data.buildingNm);
				$("#levelNm").text(data.levelNm);
				$("#rootValveNm").text(data.rootValveNm);
				$("#regDate").text(data.regDate);


				var appendData = "";
				var check2dDL = $("#check2dDL");
				check2dDL.empty();

				var check3dDL = $("#check3dDL");
				check3dDL.empty();

				$("#check2dDiv").css("display", "none");
				$("#check2dSection").css("display", "none");
				$("#check3dDiv").css("display", "none");
				$("#check3dSection").css("display", "none");

				
				$("#dwgSeq").val(data.dwgSeq);
				$("#version").val(data.version);
				
		
				if(checkStatus >= 300)	{
					$("#check2dDiv").css("display", "block");
					$("#check2dSection").css("display", "block");

					var strCheckResult = "";
					if(data.checkResult == "-"){
						strCheckResult = "점검결과 미등록";
					}
					else if(data.checkResult == "0"){
						strCheckResult = "점검이상 없음";
					}
					else	{
						strCheckResult = "점검이상(" + data.checkResult + ")";
					}

					var checkStatusText = "완료";
					var actionDateText = data.actionDate;
				
					var examinationOpinionText = data.examinationOpinion;
					var actionOpinionText = data.actionOpinion;
					if(checkStatus < 500){
						checkStatusText = '		    <label for="radio2">'
										+ '			  	<input type="radio" id="radio2" name="checkStatus" value="400" checked />'
										+ '			  	<span>조치지시</span>'
										+ '		    </label>'
										+ '		    <label for="radio1">'
										+ '			  	<input type="radio" id="radio1" name="checkStatus" value="500" />'
										+ '			  	<span>완료</span>'
										+ '		    </label>';
						actionDateText = '<input type="date" id="actionDate" value="'+data.actionDate+'"class="customDate" />';
            examinationOpinionText = '<textarea name="examinationOpinion" id="examinationOpinion" cols="10" rows="10"  placeholder="검토의견을 입력하세요">' + data.examinationOpinion + '</textarea>';
						actionOpinionText = '<textarea name="actionOpinion" id="actionOpinion" cols="10" rows="10"  placeholder="조치내용을 입력하세요">' + data.actionOpinion + '</textarea>';
					}

				
					appendData =  '	<dt class="verticalMargin">점검결과:</dt>'
								+ '		<dd><span id="checkResult">' + strCheckResult + '</span></dd>'
								+ '		<dt id="checkDateDT">점검일자:</dt>'
								+ '		<dd id="checkDateDD">' + data.checkDate + '</dd>'
								+ '		<dt class="verticalMargin">처리:</dt>'
								+ '		<dd class="collapseCell">'
								+ '		    ' + checkStatusText
								+ '		</dd>'
              + '   <dt class="verticalMargin">조치기한</dt>'
              + '   <dd class="verticalMargin" for="calendar">'
              + '       ' + actionDateText
              + '   </dd>'
              + '   <dt class="verticalMargin">조치일자</dt>'
              + '   <dd class="" for="calendar">'
              + '       ' + data.actionDate3
              + '   </dd>'
								+ '		<dt>검토의견:</dt>'
								+ '		<dd class="collapseCell">'
								+ '		    ' + examinationOpinionText
								+ '		</dd>'
                + '   <dt>조치내용:</dt>'
                + '   <dd class="collapseCell">'
                + '       ' + actionOpinionText
                + '   </dd>';

							//	+ '		<input type="hidden" id="dwgSeq" value="' + data.dwgSeq + '" />'
							//	+ '		<input type="hidden" id="version" value="' + data.version + '" />';
								
					check2dDL.append(appendData);
				}

				if(checkStatus >= 500)	{
					$("#check3dDiv").css("display", "block");
					$("#check3dSection").css("display", "block");

					var checkStatusText = "완료";
					var actionDateText = data.actionDate3;
					var actionedDateText = "";
					var examinationOpinionText = data.examinationOpinion3;
					var actionOpinionText = data.actionOpinion3;

					if(checkStatus < 700){
						checkStatusText = '		    <label for="radio2">'
										+ '			  	<input type="radio" id="radio2" name="checkStatus" value="600" checked />'
										+ '			  	<span>조치지시</span>'
										+ '		    </label>'
										+ '		    <label for="radio1">'
										+ '			  	<input type="radio" id="radio1" name="checkStatus" value="700" />'
										+ '			  	<span>완료</span>'
										+ '		    </label>';
            actionDateText = '<input type="date" id="actionDate3" value="'+data.actionDeadline3+'" class="customDate" />';
            actionedDateText = '<input type="date" id="actionDate3" value="" class="customDate" />';
						examinationOpinionText = '<textarea name="examinationOpinion3" id="examinationOpinion3" cols="10" rows="10"  placeholder="검토의견을 입력하세요">' + examinationOpinionText + '</textarea>';
						actionOpinionText = '<textarea name="actionOpinion" id="actionOpinion" cols="10" rows="10"  placeholder="조치내용을 입력하세요">' + actionOpinionText + '</textarea>';
					}

					appendData =  '	<dt class="verticalMargin">점검결과:</dt>'
								+ '		<dd><span id="checkResult">' + strCheckResult + '</span></dd>'
								+ '		<dt id="checkDateDT">점검일자:</dt>'
								+ '		<dd id="checkDateDD">' + data.checkDate + '</dd>'
								+ '		<dt class="verticalMargin">처리:</dt>'
								+ '		<dd class="collapseCell">'
								+ '		    ' + checkStatusText
								+ '		</dd>'
								+ '   <dt class="">3D 조치기한</dt>'
								+ '   <dd class="collapseCell" for="calendar">'
								+ '       ' + actionDateText
								+ '   </dd>'
                + '   <dt>3D 검토의견:</dt>'
                + '   <dd class="collapseCell">'
                + '       ' + examinationOpinionText
                + '   </dd>'
                + '   <dt>3D 조치내용:</dt>'
                + '   <dd class="collapseCell">'
                + '       ' + actionOpinionText
                + '   </dd>';
					check3dDL.append(appendData);
				}

				openPop('pop-view-check');
			},
			error : function(err) {
				alert("Error : 오류코드 [ " + err.status + " ]");
			}
		});
	}

/* grid에서 버튼 처리 */
function formatOpt332(cellvalue, options, rowObject){
	return "<button onclick=\"javascript:fnPopSvgView('" + rowObject.dwgSeq + "', '" + rowObject.fileSvg + "');\" title=\"View SVG\">SVG</button>";
}
</script>

<jsp:include page="/layout/fragments/footer.jsp" flush="true" />


