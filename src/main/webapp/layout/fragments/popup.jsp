<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>

<style>
	.bigPictureWrapper {
		position: absolute;
		display: none;
		justify-content: center;
		align-items: center;
		top:0%;
		width:100%;
		height:100%;
		background-color: gray;
		z-index: 10000;
		background:rgba(255,255,255,0.5);
	}
	.bigPicture {
		position: relative;
		display:flex;
		justify-content: center;
		align-items: center;
	}

</style>

	<div class="wrap-pop">

	  <div class="pop-basic" id="pop-info-2d">
	  	<div class="floor-title">
	  	  <div class="line-title">
		  		<h3 class="title">안내</h3>
	        <button class="btn-close" onclick="closePop('pop-info-2d')"></button>
        </div>
	  	</div>
      <div class="floor-conts">
        <div class="area-conts">
          <p>AutoCad 를 실행하여 2D 설계점검을 진행하세요.</p>
        </div>
      </div>
      <div class="floor-footer">
	      <div class="area-footer">
          <button class="btn-close" onclick="closePop('pop-info-2d')">닫기</button>
	        </div>
	    </div>
	  </div>


		<div class="pop-basic" id="pop-markUp-1">
			<div class="floor-title">
		 		<div class="line-title">
		 			<h3 class="title">알림</h3>
		 			<button class="btn-close" onclick="closePop('pop-markUp-1')"></button>
		 		</div>
			</div>
			<div class="floor-conts customScrollbar">
		    	<div class="area-conts markupSave">
	            	<label for="">마크업 제목을 작성하세요.</label>
	               	<input type="text"  placeholder="마크업제목" />
		        </div>
		        <div class="line-table">
					<table id="grid-excel"></table>
				</div>
		    </div>
		    <div class="floor-footer">
				<div class="area-footer">
				<button class="btn-save" onclick="">저장</button>
		        	<button class="btn-close" onclick="closePop('pop-markUp-1')">취소</button>
		    	</div>
			</div>
		</div>

		<div class="pop-basic " id="pop-view-check">
			<div class="floor-title">
				<div class="line-title">
					<h3 class="title">2-3D 설계점검</h3><button class="btn-close" onclick="closePopAbsolute('pop-view-check')"></button>
			  	</div>
		   	</div>
		   	<div class="floor-conts ">
				<div class="area-conts customScrollbar">
					<section>
						<div class="grid-pop column2">
							<dl>
								<dt>상태:</dt>
								<dd class="collapseCell" id="statusNm">설계점검</dd>
								<dt>Plant:</dt>
								<dd id="plantNm">새울2발</dd>
								<dt>Unit:</dt>
								<dd id="unitNm">5호기</dd>
								<dt>Building:</dt>
								<dd id="buildingNm">Reactor Containment BLDG</dd>
								<dt>Level:</dt>
								<dd id="levelNm">2Level</dd>
								<dt>루트밸브:</dt>
								<dd id="rootValveNm">V0220</dd>
								<dt>등록일:</dt>
								<dd id="regDate">2024-06-20</dd>
								<input type="hidden" id="dwgSeq" value="" />
								<input type="hidden" id="version" value="" />
						  	</dl>
					    </div>
					</section>
					<div class="pop-devideLine" id="check2dDiv"></div>
					<section id="check2dSection">
				<div>
                <dl class="grid-pop column2" id="check2dDL"></dl>
                <dl class="grid-pop column2" id="checkinterference">
                 <!--  <dt>간섭체크 결과 :</dt>
                  <dd class="collapseCell">
                    <table id="grid-3dFilelist"></table>
                  </dd> -->
                </dl>
				   </div>
					</section>
					
					<div class="pop-devideLine" id="check3dDiv"></div>
					<section id="check3dSection">
					    <div>
						  	<dl class="grid-pop column2" id="check3dDL"></dl>
					    </div>
					</section>
			  	</div>
		    </div>
		    <div class="floor-footer">
			  	<div class="area-footer">
			  		<button class="btn-close" onclick="fnCheckSave()" id="btnPopSave">저장</button>
					<button class="btn-close" onclick="closePopAbsolute('pop-view-check')">닫기</button>
			  	</div>
		    </div>
		</div>


    <div class="pop-basic" id="pop-checkPhoto" style="min-width: 300px;">
      <div class="floor-title">
        <div class="line-title">
          <h3 class="title">간섭체크 사진</h3>
          <button class="btn-close" onclick="closePop('pop-checkPhoto')"></button>
        </div>
      </div>
      <div class="floor-conts">
        <div class="area-conts customScrollbar">
          <section>
             <div class="img-view">
               <img id="myimg" />
             </div>
          </section>
        </div>
      </div>
      <div class="floor-footer">
        <div class="area-footer">
          <div class="area-footer">
            <!-- <button class="btn-save" onclick="">저장</button> -->
            <button class="btn-close" onclick="closePop('pop-checkPhoto')">닫기</button>
          </div>
        </div>
      </div>
    </div>


    <!-- 심볼등록 S -->
    <div class="pop-basic" id="pop-regist-symbol" style="min-width: 300px;">
      <div class="floor-title">
        <div class="line-title">
          <h3 class="title">수정</h3>
          <button class="btn-close" onclick="closePop('pop-regist-symbol')"></button>
        </div>
      </div>
      <div class="floor-conts">
        <div class="area-conts customScrollbar">
          <section>
            <dl class="column-regist">
              <dt>3D Type</dt>
              <dd>
                <input type="hidden" id="txtSymbolSeq" name="txtSymbolSeq" class="kind-regist" />
                <select name="selSymbolType" id="selSymbolType" >
                	 <option value="" selected="selected">선택하세요</option>
                	 <option value="ROOT_VALVE">ROOT_VALVE</option>
					  <option value="UnionTee">UnionTee</option>
					  <option value="TEE" >TEE</option>
					  <option value="UNION" >UNION</option>
					  <option value="INST_VALVE">INST_VALVE</option>
					  <option value="CLAMP2D" >CLAMP2D</option>
					  <option value="CLAMP3D">CLAMP3D</option>
					  <option value="PLATE" >PLATE</option>
                </select>
              </dd>
              <dt>OD</dt>
              <dd>
                <input type="text" id="txtSymbolOd" name="txtSymbolOd" class="kind-regist" value="" />
              </dd>
              <dt>파일</dt>
              <dd>
                <input type="file" id="filesymbol" name="filesymbol"  />
              </dd>
            </dl>
          </section>
        </div>
      </div>
      <div class="floor-footer">
        <div class="area-footer">
          <div class="area-footer">
            <button class="btn-save" onclick="fnSymbolInsert()">저장</button>
            <button class="btn-close" onclick="fnSymbolClose()">닫기</button>
          </div>
        </div>
      </div>
    </div>

		<!-- 2D도면VIEW--S -->
		<div class="pop-basic" id="pop-view-2" style="width:931px">
			<div class="floor-title">
				<div class="line-title">
					<h3 class="title">2D 도면 뷰어</h3><button class="btn-close" onclick="closePopAbsolute('pop-view-2')"></button>
				</div>
			</div>
			<div class="floor-conts ">
				<div class="area-conts customScrollbar">
					<section>
					   <div class="img-view" id="svgView"></div>
					</section>
				</div>
			</div>
			<div class="floor-footer">
				<div class="area-footer">
					<button class="btn-close" onclick="closePopAbsolute('pop-view-2')">닫기</button>
				</div>
			</div>
	    </div>
	<!-- 2D 도면VIEW--E -->


		<!-- 2D 설계점검현황 -->
		<div class="pop-basic check2d" id="pop-view-item" style="width:631px">
			<div class="floor-title">
				<div class="line-title">
					<h3 class="title">2D 설계점검현황</h3><button class="btn-close" onclick="closePopAbsolute('pop-view-item')"></button>
				</div>
			</div>
			<div class="floor-conts ">
				<div class="area-conts customScrollbar">
					<section>
						<div class="line-table">
							<table id="grid-check"></table>
						</div>
					</section>
				</div>
			</div>
			<div class="floor-footer">
				<div class="area-footer">
					<button class="btn-close" onclick="closePopAbsolute('pop-view-item')">닫기</button>
				</div>
			</div>
		</div>

		<div class="pop-basic checkIssue" id="pop-view-issue">
		    <div class="floor-title">
			  <div class="line-title">
				<h3 class="title">현장 설계점검</h3><button class="btn-close" onclick="closePopAbsolute('pop-view-issue')"></button>
			  </div>
		    </div>
		    <div class="floor-conts ">
			  	<div class="area-conts customScrollbar">
					<section>
					    <div class="grid-pop column2">
						  	<dl>
								<dt>제목:</dt>
								<dd class="collapseCell" id="issueTitle">설계점검</dd>
								<dt>Plant:</dt>
								<dd id="plantNmIssue">새울2발</dd>
								<dt>Unit:</dt>
								<dd id="unitNmIssue">5호기</dd>
								<dt>Building:</dt>
								<dd id="buildingNmIssue">Reactor Containment BLDG</dd>
								<dt>Level:</dt>
								<dd id="levelNmIssue">2Level</dd>
								<dt>루트밸브:</dt>
								<dd id="rootValveNmIssue">V0220</dd>
								<dt>등록일:</dt>
								<dd id="regDateIssue"></dd>
								
						  	</dl>
					    </div>
					</section>
					<div class="pop-devideLine"></div>
					<section class="wrap-issueInfo">
						<dl class="grid-pop issueInfo">
							<dt>이슈내용:</dt>
							<dd>
								<span id="issueConts">이슈내용<br>이슈내용<br>이슈내용</span>
							</dd>
							<dt>첨부파일:</dt>
							<dd class="wrap-imgBox" id="issueAtchFileList">
							</dd>
						</dl>
						<div class="pop-devideLine"></div>
						<dl class="grid-pop issueInfo">
							<dt>댓글</dt>
							<dd>
								<ul class="list-comment" id="issueCommentList">
								</ul>
							</dd>
							<dt>댓글 작성</dt>
							<dd>
								<div class="comment" >
									<textarea class="customScrollbar" id="commentConts"></textarea>
									<button class="btn-submit" onclick="fnIssueCommentReg(0);">작성</button>
								</div>
							</dd>
						</dl>
			     	</section>
			  	</div>
		    </div>
		    <div class="floor-footer">
			  	<div class="area-footer">
					<button class="btn-close" onclick="closePopAbsolute('pop-view-issue')">닫기</button>
			  	</div>
		    </div>
		</div>
		
		
    <!-- 불일치 상세--S -->
    <div class="pop-basic" id="pop-inconsistency" style="width:401px">
      <div class="floor-title">
        <div class="line-title">
          <h3 class="title">불일치 상세</h3><button class="btn-close" onclick="closePop('pop-inconsistency')"></button>
        </div>
      </div>
      <div class="floor-conts ">
        <div class="area-conts customScrollbar">

             <table id="grid-inconsistency"></table>

        </div>
      </div>
      <div class="floor-footer">
        <div class="area-footer">
          <button class="btn-close" onclick="closePop('pop-inconsistency')">닫기</button>
        </div>
      </div>
      </div>
  <!-- 불일치 상세--E -->



    <div class="pop-basic" id="pop-plan">
      <div class="floor-title">
        <div class="line-title">
          <h3 class="title">공사 계획</h3>
          <button class="btn-close" onclick="closePop('pop-view-1');"></button>
        </div>
      </div>

	    <div class="floor-conts customScrollbar">
	      <div class="area-conts">

          <dl class="column-regist">
            <dt>공사</dt>
            <dd>
              <input type="hidden" name="txtTagSeq" id="txtTagSeq" />
              <input type="hidden" name="txtWCd" id="txtWCd" />
              <input type="text" name="txtBuilder" id="txtBuilder" />
            </dd>
            <dt>시작일</dt>
            <dd>
              <input type="date" name="txtStartDate" id="txtStartDate" class="customDate" />
            </dd>
            <dt>종료일</dt>
            <dd>
              <input type="date" name="txtEndDate" id="txtEndDate" class="customDate" />
            </dd>
           </dl>
	      </div>
	    </div>

      <div class="floor-footer">
        <div class="area-footer">
          <button class="btn-save" onclick="fnBuilderSave();">저장</button>
          <button class="btn-close" onclick="closePopAbsolute('pop-plan');">닫기</button>
        </div>
      </div>
    </div>

	<!-- 2d등록 -->
	<div class="pop-basic" id="pop-dwginsert">
      <div class="floor-title">
        <div class="line-title">
          <h3 class="title">2D 도면등록</h3>
          <button class="btn-close" onclick="closePopAbsolute('pop-dwginsert');clearData2D();"></button>
          <input type="hidden" id="dwgSeq2d" />
        </div>
      </div>

	      <div class="floor-conts customScrollbar">
          <div class="area-conts">
            <section>
              <dl class="column-regist">
                <dt>Plant:</dt>
                <dd>
                  <select name="searchPlantDwgPop" id="searchPlantDwgPop" onchange="changeSearchDwgLevelPop(0);"></select>
                </dd>
                <dt>Unit:</dt>
                <dd>
                  <select name="searchUnitDwgPop" id="searchUnitDwgPop" onchange="changeSearchDwgLevelPop(1);"></select>
                </dd>
                <dt>Building:</dt>
                <dd>
                  <select name="searchBuildingDwgPop" id="searchBuildingDwgPop" onchange="changeSearchDwgLevelPop(2);"></select>
                </dd>
                <dt>Level</dt>
                <dd>
                  <select name="searchLevelDwgPop" id="searchLevelDwgPop" onchange="modelList();"></select>
                </dd>
                <dt>공종</dt>
                <dd>
                  <select name="searchConstDwgPop" id="searchConstDwgPop" ></select>
                </dd>
                <dt>3D Model 선택:</dt>
                <dd>  

					<dl class="dropdown"> 
					    <dt>
					    <a href="#">
					      
					      <p class="multiSel"><span class="hida">선택하세요</span></p>  
					    </a>
					    </dt>
					    <dd>
				        <div class="mutliSelect" id="constDiv">
			           
			           
				        </div>
					    </dd>
					</dl>

                </dd>
                <dt>루트밸브</dt>
                <dd>
                  <div class="box-moveDoc">
                  	<input type="text" class="input-text"  id="txttagText" name="txttagText"/>
                  	<div class="btns-move">
                  	 <button class="btn-moveRight" id="btndwgRight"></button>
                  	</div>
                  	
                  	<ul class="list-docs" >
                      
                  	</ul>
                  	
                  </div>
                </dd>
                <dt>관통테그</dt>
                <dd>
                  <div class="box-passmoveDoc">
                  	<input type="text" class="input-text" id="txtpassText" name="txtpassText" />
                  	<div class="btns-move">
                  	 <button class="btn-moveRight" id="btnpassRight"></button>
                  	</div>
                  	<ul class="list-passdocs">
                      
                  	</ul>
                  </div>
                </dd>
                <dt>AE 파일:</dt>
                <dd>
                  <input type="file" name="aeInput" id="aeInput" />
                  <input type="text" name="txtaeInput" id="txtaeInput" />
                </dd>
                <dt>시공사 파일:</dt>
                <dd>
                  <input type="file" name="dwgInput" id="dwgInput"/>
                  <input type="text" name="txtdwgInput" id="txtdwgInput"/>
                </dd>
              </dl>
            </section>

         </div>
       </div>

       <div class="floor-footer">
         <div class="area-footer">
           <button class="btn-save" onclick="dwgInsert();">저장</button>
           <button class="btn-close" onclick="closePopAbsolute('pop-dwginsert');clearData2D();">닫기</button>
          </div>
      </div>
    </div>
    
    <!-- 3d등록 -->
    <div class="pop-basic" id="pop-modelinsert">
      <div class="floor-title">
        <div class="line-title">
          <h3 class="title">3D 도면등록</h3>
          <button class="btn-close" onclick="closePopAbsolute('pop-modelinsert');clearData3Dmodel();"></button>
          <input type="hidden" id="modelSeq3d" />
        </div>
      </div>
      	
	  	<div class="floor-conts customScrollbar">
          <div class="area-conts">
            <section>
              <dl class="column-regist">
                <dt>Plant:</dt>
                <dd>
                  <select name="searchPlantPop" id="searchPlantPop" onchange="changeSearchLevelPop(0);"></select>
                </dd>
                <dt>Unit:</dt>
                <dd>
                  <select name="searchUnitPop" id="searchUnitPop" onchange="changeSearchLevelPop(1);"></select>
                </dd>
                <dt>Building:</dt>
                <dd>
                  <select name="searchBuildingPop" id="searchBuildingPop" onchange="changeSearchLevelPop(2);"></select>
                </dd>
                <dt>Level</dt>
                <dd>
                  <select name="searchLevelPop" id="searchLevelPop" onchange="changeSearchLevelPop(3);"></select>
                </dd>
                
                <dt>DGN파일:</dt>
                <dd>
                  <input type="file" name="dgnInput" id="dgnInput" />
                  <input type="text" name="txtdgnInput" id="txtaeInput" />
                </dd>
                <dt>DTDX파일:</dt>
                <dd>
                  <input type="file" name="dtdxInput" id="dtdxInput"/>
                  <input type="text" name="txtdtdxInput" id="txtdtdxInput" />
                </dd>
                <dt>HOLOLENS DTDX파일:</dt>
                <dd>
                  <input type="file" name="hdtdxInput" id="hdtdxInput"/>
                  <input type="text" name="txthdtdxInput" id="txthdtdxInput" />
                </dd>
                <dt>좌표파일:</dt>
                <dd>
                  <input type="file" name="csvInput" id="csvInput"/>
                  <input type="text" name="txtcsvInput" id="txtcsvInput" />
                </dd>
                
              </dl>
            </section>
         </div>
       </div>
       
       
       <div class="floor-footer">
         <div class="area-footer">
           <button class="btn-save" onclick="modelIns();">저장</button>
           <button class="btn-close" onclick="closePopAbsolute('pop-modelinsert');clearData3Dmodel();">닫기</button>
          </div>
      </div>
    </div>
    
</div>

<div class='bigPictureWrapper'>
	<div class='bigPicture'></div>
</div>

<script type="text/javascript">
/*
 * 2D 설계점검 팝업
 */

function fnCheckSave(){
	var checkDtdx = $("input[name='checkDtdx']");
	var dwgSeq  =  $("#dwgSeq").val();
	var version  = $("#version").val();
//	alert( $("input[name='checkStatus']:checked").val());
	var params = {
					"dwgSeq" : dwgSeq
					, "version" : version
					, "status" : $("input[name='checkStatus']:checked").val()
					, "examinationOpinion" : $("#examinationOpinion").val()
					, "actionOpinion" : $("#actionOpinion").val()
					, "actionDate" : $("#actionDate").val()
					, "actionDate3" : $("#actionDate3").val()
					, "examinationOpinion3" : $("#examinationOpinion3").val()
				};
	
	
//	alert(JSON.stringify(params));
	$.ajax({
		url : "/check/checkUpdate",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			alert("저장되었습니다.");
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});

	closePopAbsolute('pop-view-check');
	fnSearchList();
}


/*
 * 2D 설계점검표
 */
function fnCheckItemList(dwgSeq, version)	{

	
	

	$(".line-title .title").text("시공사 Q-ISO 도면 점검표");
	var params = {"dwgSeq" : dwgSeq, "version" : version};

	$.ajax({
		url : "/check/checkItem",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			initGridCheckItemList(data);
			openPop('pop-view-item');
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

/* grid에서 버튼 처리 */
function formatOptMove(){
  return "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='' onclick=\"\" />";
}
function initGridCheckItemList(gridData)	{
	
	$("#grid-check").jqGrid('GridUnload');
	$("#grid-check").jqGrid({
	    colNames: ["점검번호","점검항목", "불일치갯수","상세",""],
	    colModel: [
	    	{ name: "rownum", width: "50px", align:"center", sortable: false 
	    		,cellattr: function(rowId, cellValue, rowObject, colModel, rowData) {
	        	if (rowData.useYn == 'N') {
		    		return 'style="color: gray;"';
		        } else {
		        	return '';
		        }
		    }},
	    	{ name: "cdNm", width: "400px", align:"left",  formatter: 'html' ,sortable: false,cellattr: function(rowId, cellValue, rowObject, colModel, rowData) {
	        	if (rowData.useYn == 'N') {
		    		return 'style="color: gray;"';
		        } else {
		        	return '';
		        }
		    } },
		  	{ name: "checkCnt", width: "90px", formatter:formatDisCode,sortable: false,cellattr: function(rowId, cellValue, rowObject, colModel, rowData) {
	        	if (rowData.useYn == 'N') {
		    		return 'style="color: gray;"';
		        } else {
		        	return '';
		        }
		    } },
		  	{ name: "btn1", index: "btn1", width: "50px",formatter:formatOpt7, sortable: false},
		  	{ name: "useYn", hidden:true },
		  	
		  ],
	    autowidth: true,
	    data: gridData,
	    rowattr: function(rowData, currentObj) {
	    //	console.log(rowData.useYn);
	        if (rowData.useYn == 'N') {
	        	 return {"style": "font-color: green;"};
	        	
	        } else {
	        	 return {"style": "font-color: red;"};
	        }
	    }
	});
	
}

function initGridCheckItemdescList(gridDatadesc)	{
	$("#grid-inconsistency").jqGrid('GridUnload');
	$("#grid-inconsistency").jqGrid({
	    colNames: ["Object ID", "Object Name","이동",""],
	    colModel: [
	    	{ name: "handle", width: "100px", align:"left", sortable: false },
		  	{ name: "name", width: "150px", sortable: false },
		  	{ name: "itemDescSeq", index: "btn1", width: "50px",formatter:formatOpt8, sortable: false},
		  	{ name: "handleCnt", hidden:true },
		  ],
	    autowidth: true,
	    data: gridDatadesc
	});
	
	
}



function formatDisCode(cellvalue, options, rowObject){
	
	var rtn  = rowObject.checkCnt;
	if(rowObject.useYn == "N"){
		rtn = "-";
	}
	return rtn ;
	//return "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='View Image' onclick=\"fnPopCheckItemDesc('" + rowObject.dwgSeq + "', '" + rowObject.item + "')\" />";
}

/* grid에서 버튼 처리 */
function formatOpt7(cellvalue, options, rowObject){
	
	var rtn  =  "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='View Image' onclick=\"fnPopCheckItemDesc('" + rowObject.dwgSeq + "', '" + rowObject.item + "')\" />";
	if(rowObject.useYn == "N"){
		rtn = "";
	}
	return rtn ;
	//return "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='View Image' onclick=\"fnPopCheckItemDesc('" + rowObject.dwgSeq + "', '" + rowObject.item + "')\" />";
}
/* grid에서 버튼 처리 */
function formatOpt8(cellvalue, options, rowObject){
	
	var rtn  =  "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='View Image' onclick=\"fn3dModel('" + rowObject.dwgSeq + "', '" + rowObject.handle + "')\" />";
	if(rowObject.handleCnt == 0){
		rtn = "";
	}
	return rtn ;
	//return "<img src='/img/ico_readglass.svg' style='cursor:pointer;' alt='View Image' onclick=\"fn3dModel('" + rowObject.dwgSeq + "', '" + rowObject.handle + "')\" />";
}

function fn3dModel(dwgSeq,handle){
	
	
	var params = {"dwgSeq" : dwgSeq, "handle" : handle};

	$.ajax({
		url : "/d3api/handlefind",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			//console.log(data);
			if(data.data == 0){
				alert("센싱라인이 없습니다. ");
				return false;
			}else{
				fnSensingLine(dwgSeq,handle);
			}
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}
function fnSensingLine(dwgSeq,handle){
	
	if(dwgLoadList.indexOf(dwgSeq) >= 0){
		closePop('pop-inconsistency');
		closePopAbsolute('pop-view-item');
		fnPageTab('cont-webGl');
		
		
		var keyValueJson = [[{"key": "id", "value" : handle}]];
	    var propertyInfo = bimplayer.GetElementDataList(keyValueJson);
	  
	    bimplayer.SelectAndFit(keyValueJson);
    	
    }
    else  {
    	dwg2dcheck = handle;
        fnOpenTreeToModel("chk2d", dwgSeq);
    }
}
function fnPopCheckItemDesc(dwgSeq, item) {

	var params = {"dwgSeq" : dwgSeq, "item" : item};

	$.ajax({
		url : "/check/checkItemDesc",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			
			initGridCheckItemdescList(data);
			
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
	openPop('pop-inconsistency');
	

  $("#grid-inconsistency").jqGrid({
      colNames: ["Object ID", "Object Name","이동"],
      colModel: [
        { name: "handle", width: "100px", align:"left", sortable: false },
        { name: "name", width: "150px", sortable: false },
        { name: "itemDescSeq", index: "btn1", width: "50px",formatter:formatOpt7, sortable: false},
      
      ],
      autowidth: true,
      data: [{objId:"",objNm:"",move:""}],
  });
}

/*
 * 2D 보기 팝업
 */
function fnPopSvgView(dwgSeq,fileSvg)	{
	
	
	if(fileSvg == "null"){
		alert("SVG 파일이 없습니다.");
		return; 
	}
	
	var params = {"fileId" : fileSvg};

	$.ajax({
		url : "/common/svgread",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			
			const element = document.getElementById('svgView');
			element.innerHTML = data.data.svgfile;
			openPop('pop-view-2');
			
			document.body.innerHTML = document.body.innerHTML.replace(/\uFEFF/g, '');
			
			
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
	//svgView
	//
}

/*
 * 현장설계점검 팝업
 */
 var selIssueSeq;
function fnCheckIssuePopup(issueSeq)	{
	
	$(".line-title .title").text("현장설계점검");
	selIssueSeq = issueSeq;
	var params = {"issueSeq" : issueSeq};

	$.ajax({
		url : "/check/checkIssueView",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			$("#issueTitle").html(data.issueTitle);
			$("#plantNmIssue").html(data.plantNm);
			$("#unitNmIssue").html(data.unitNm);
			$("#buildingNmIssue").html(data.buildingNm);
			$("#levelNmIssue").html(data.levelNm);
			$("#rootValveNmIssue").html(data.rootValveNm);
			$("#regDateIssue").html(data.regDate);
			$("#issueConts").html(data.issueConts.replace(/(?:\r\n|\r|\n)/g, '<br>'));

		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});

	fnCommentList();
	fnAtchFileList();

	openPop('pop-view-issue');
}

// 현장설계점검 - 댓글 리스트
function fnCommentList()	{
	var params = {"issueSeq" : selIssueSeq};

	var commentList = $("#issueCommentList");
	commentList.empty();

	$.ajax({
		url : "/check/checkIssueCommentList",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			for(var i=0; i < data.length; i++)	{

				var commentLevel = data[i].orderPath.split('/').length - 1;

				var viewLevel = "";
				if(commentLevel > 2)	{
					viewLevel = " view-recomment_2";
				}
				else if(commentLevel == 1)	{
					viewLevel = "";
				}
				else	{
					viewLevel = " view-recomment_" + commentLevel;
				}

				var viewComment = '	<li class="view-comment' + viewLevel + '">'
								+ '		<div class="name">' + data[i].regId + '</div>'
								+ '		<div class="cont">' + data[i].commentConts + '</div>'
								+ '		<div class="commentInfo">'
								+ '			<div class="date">' + data[i].regDate + '</div>'
								+ ' 		<button class="btn-submit" onclick="fnIssueCommentView(' + data[i].icSeq + ')">답글달기</button>'
								+ ' 	</div>'
								+ ' 	<div id="issueComment_' + data[i].icSeq + '"></div>'
								+ '	</li>';

				commentList.append(viewComment);
			}
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

//현장설계점검 - 첨부이미지 리스트
function fnAtchFileList()	{
	var params = {"issueSeq" : selIssueSeq};

	var atchFileList = $("#issueAtchFileList");
	atchFileList.empty();

	$.ajax({
		url : "/common/atchFileIssueList",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			
			for(var i=0; i < data.data.length; i++)	{
				
				var addImg = '<img src="' + data.data[i].fileUrl + '" alt="' + data.data[i].fileNmOri + '" width="100%" onclick="fnShowImage(this);" style="cursor:pointer" />';
				atchFileList.append(addImg);
			}
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

var icSeqOld = 0;
function fnIssueCommentView(icSeq)	{

	var params = {"tableNm" : "issue", "refSeq" : selIssueSeq};
	if (icSeqOld != 0 || icSeq == icSeqOld)	{
		var issueCommentOld = $("#issueComment_" + icSeqOld);
		issueCommentOld.removeClass("re-comment");
		issueCommentOld.empty();

		if (icSeq == icSeqOld){
			icSeqOld = 0;
			icSeq = 0;
		}
	}

	if (icSeq != 0)	{
		var issueComment = $("#issueComment_" + icSeq);

		issueCommentForm = '		<textarea class="customScrollbar" id="recomment"></textarea>'
						+ '			<button class="btn-submit" onclick="fnIssueCommentReg(' + icSeq + ');">작성</button>';

		issueComment.addClass("re-comment");
		issueComment.append(issueCommentForm);

		icSeqOld = icSeq;
	}
}

function fnIssueCommentReg(icSeq)	{
	var commentConts;
	if(icSeq == 0 )	{
		commentConts = $("#commentConts").val();
		$("#commentConts").val("");
	}
	else	{
		commentConts = $("#recomment").val();
	}

	var params = {"issueSeq" : selIssueSeq, "parentIcSeq" : icSeq, "commentConts" : commentConts};

	$.ajax({
		url : "/check/checkIssueCommentInsert",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			fnCommentList();
			icSeqOld = 0;
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

function fnShowImage(obj)	{
	var path = $(obj).attr('src');
	$(".bigPictureWrapper").css("display","flex").show();
    $(".bigPicture").html("<img src='" + path + "' style='width:1024px' >");
    //$(".bigPicture").animate({width:'100%', height: '100%'}, 1000);
}

$(".bigPictureWrapper").on("click", function(e){
	//$(".bigPicture").animate({width:'0%', height: '0%'}, 1000);
	//setTimeout(function(){
	$('.bigPictureWrapper').hide();
	//}, 1000);
});
</script>
