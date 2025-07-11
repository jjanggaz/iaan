<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
<%
    // 세션 객체 가져오기
    HttpSession sessionSSS = request.getSession();
	String loginUserId = "";
	String loginUserNm = "";
	if(null ==  sessionSSS.getAttribute("UserId")){
		response.sendRedirect("/login");
	}else{
	 	loginUserId = sessionSSS.getAttribute("UserId").toString();
	 	loginUserNm = sessionSSS.getAttribute("UserNm").toString();
	}
%>

<jsp:include page="/layout/fragments/head.jsp" flush="true" />
<link rel="stylesheet" href="/css/screenshot.css" />
<body>
<jsp:include page="/layout/fragments/popup.jsp" flush="true" />
  <div id="wrap-page">
    <jsp:include page="/layout/fragments/header.jsp" flush="true" />
    <main class="area-main off-panel-userList">
      <nav class="panel-nav">
        <input class="btn-navBar" type="button" value="" />
        <div class="line-topBar"></div>
        <ul class="list-tabBtns">
          <li class="on">
            <button>도면목록 <img src="/img/ico_reload.png" /></button>
          </li>
          <li><button>검색</button></li>
        </ul>
        <ul class="list-tabConts">
          <li class="customScrollbar on">
            <button class="btn-view" onclick="fnOpenTreeToModel('tree', 0);">불러오기</button>
            <div id="tree1" class="tree custom"></div>
          </li>
          <li class="">
            <div class="area-searchCond">
              <div class="set-form">
                <label for="">Plant :</label>
                <select name="searchPlantMain" id="searchPlantMain" onchange="changesearchLevelMain(0);"></select>
              </div>
              <div class="set-form">
                <label for="">Unit :</label>
                <select name="searchUnitMain" id="searchUnitMain" onchange="changesearchLevelMain(1);"></select>
              </div>
              <div class="set-form">
                <label for="">Building :</label>
                <select name="searchBuildingMain" id="searchBuildingMain" onchange="changesearchLevelMain(2);"></select>
              </div>
              <div class="set-form">
                <label for="">Level :</label>
                <select name="searchLevelMain" id="searchLevelMain" onchange="changesearchLevelMain(3);"></select>
              </div>
              <div class="set-form">
                <label for="">루트밸브 :</label>
                <div class="unit-form">
                  <input type="text" name="searchTagMain" id="searchTagMain">
                </div>
              </div>

              <button class="btn-search" onclick="fnSearchMainList();">검색</button>
            </div>

            <div class="area-searchResult">
              <table id="grid-searchResult"></table>
            </div>
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </nav>
      <section class="panel-userList" >
        <button class="btn-fold"></button>
        <div id ="top-user-container"></div>
      </section>
      <section class="sect-view">
        <ul class="list-tabPageConts">
          <!-- webGl S -->
        	<li id="cont-webGl" class="customScrollbar on">
	        	<div id="container" style="width: 100%; height: 100%">
	            <dtd-player id="dtd-player-container" createfileselector="false" onload="onLoadDTDPlayer(this);"></dtd-player>
	          </div>
        	</li>
          <!-- 공사계획 S -->
          <li id="cont-plan" class="customScrollbar">
           <jsp:include page="/WEB-INF/jsp/plan.jsp" flush="true" />
          </li>
		   <!-- 제작현황 S -->
		   <li id="cont-stateOfProd" class="customScrollbar">
		    <jsp:include page="/WEB-INF/jsp/stateOfProd.jsp" flush="true" />
		   </li>
          <!-- 비용정산 S -->
          <li id="cont-calc" class="customScrollbar">
           <jsp:include page="/WEB-INF/jsp/calc.jsp" flush="true" />
          </li>
          <!-- 2D 설계 점검 S -->
          <li id="cont-check2d" class="customScrollbar">
           <jsp:include page="/WEB-INF/jsp/check/check2d.jsp" flush="true" /> 
          </li>
          <!-- 3D 설계 점검 S -->
          <li id="cont-check3d" class="customScrollbar">
            <jsp:include page="/WEB-INF/jsp/check/check3d.jsp" flush="true" /> 
          </li>
          <!-- 현장 설계 점검 S -->
          <li id="cont-checkIssue" class="customScrollbar">
           <jsp:include page="/WEB-INF/jsp/check/checkIssue.jsp" flush="true" /> 
          </li>
          <!-- 3d model 관리 S -->
          <li id="cont-3dModel" class="customScrollbar">
           <jsp:include page="/WEB-INF/jsp/admin/modelmng.jsp" flush="true" />
          </li>
          <!-- 2d 도면 관리 S -->
          <li id="cont-2dDwg" class="customScrollbar">
            <jsp:include page="/WEB-INF/jsp/admin/dwgmng.jsp" flush="true" /> 
          </li>
          <!-- 심볼 형상관리 S -->
          <li id="cont-symbol" class="customScrollbar">
            <jsp:include page="/WEB-INF/jsp/admin/symbolmng.jsp" flush="true" /> 
          </li>
        </ul>
        <div class="box-view">
          <!-- <button class="btn-toggleSize"></button> -->
          <!-- DTD END -->
        </div>
        <div class="paletteTitle-ticon">
          <ul class="list-palette">
            <li class="btn-init on" onclick="fnPageInit();">초기화</li>
            <!-- <li class="btn-search">검색</li> -->
            <!-- <li class="btn-filterview">필터뷰</li> -->
          <!--   <li class="btn-specific" onclick="fnProperty();">속성뷰</li> -->
            
            <li class="btn-markup btn-specific" onclick="fnMarkup();" id="liMarkup" linked-idx="1">마크업</li>
          <!--   <li class="btn-specific" onclick="fnLibrary();">라이브러리</li>  -->
            <li class="btn-bookmark btn-specific" onclick="fnBookMark();" linked-idx="2">점검목록</li>
            <li class="btn-interference" 
            onclick="fnInterferenceIcon();" id="liInterference" linked-idx="3">간섭체크</li>
          </ul>
          <!-- <button class="btn-dwg">ISO 도면</button> -->
        </div>
        <!-- <div class="view-onCallUser">
        <img src="/img/ico_userselfvideo.png" alt="" />
        <div class="btn-onCallUser"></div>
        </div> -->

        <div class="context-1" id="context-1">
          <ul class="list-context1">
            <li class="menu-highlight">
              <button>하이라이트</button>
            </li>
            <li class="menu-xray">
              <button>X-Ray</button>
              <ul>
                <li>X-Ray 적용</li>
                <li>주변항목 모두 적용</li>
              </ul>
            </li>
            <li class="menu-hide">
              <button>감추기</button>
            </li>
          </ul>
          <button class="btn-init">모든 버튼 초기화</button>
          <!-- <img src="/img/img_contextmenu.png" alt="" /> -->
        </div>
        <!-- <div class="pop-subMenu"><img src="/img/img_contextmenusub.png" alt="" /></div> -->
      </section>

      <aside class="panel-right" id="aside-panel">
        <input class="btn-navBar" type="button" value="" />
        <div class="line-topBar"></div>
        <ul class="list-tabBtns">
          <li id="tab_talk" onclick="fnTalk()">
            <button>대화내용</button>
          </li>
          <li class=""  id="tab_webgl">
            <button id="btnWebgl">마크업</button>
          </li>
          <li class="tab-information on" id="tab_propwebgl"  onclick="fnInfomation()">
            <button id="btn_webgl">속성정보</button>
          </li>
        </ul>

        <ul class="list-tabConts" id="ul-Interference">
	        <li>
	          <div id ="right-chat-container"></div>
			    </li>
          <!-- 속성뷰 
          <li class="cont-specific">
            <div class="line-selectList">
              <label for="">매개변수:</label>
              <select name="selprop" id="selprop">
                <option value=""></option>
              </select>
            </div>
            <div class="box-tree">
              <div id="tree-viewProps"></div>
            </div>
          </li>
		-->
          <!-- 마크업 -->
          <li class="cont-specific memory">
          
            <div class="line-selectList">
              <select name="selmarkUp" id="selmarkUp" onchange="fnMarupImg();">
                <option value=""></option>
              </select>
              <button class="btn-del" onclick="fnMarkUpDel();"></button>
            </div>
            <ul class="list-panelModule list-panelBtns">
              <li class="draw skill on"  onclick="fnMarkupLine();">
                <i></i>
                <h6>그리기</h6>
              </li>
              <li class="text skill" onclick="fnMarkupText();">
                <i></i>
                <h6>글자입력</h6>
              </li>
              <li class="clipart skill" onclick="fnClipArt()">
                <i></i>
                <h6>클립아트</h6>
              </li>
              <li class="undo" onclick="fn_Undo()">
                <i></i>
                <h6>이전작업</h6>
              </li>
              <li class="redo" onclick="fn_next()">
                <i></i>
                <h6>다음작업</h6>
              </li>
              <li class="deleteAll" onclick="fnDeleteMarkUp()">
                <i></i>
                <h6>모두제거</h6>
              </li>
              <li class="save" onclick="fnMarkupSave()" >
                <i></i>
                <h6>저장</h6>
              </li>
              <li class="import" onclick="fnMarupImg()">
                <i></i>
                <h6>가져오기</h6>
              </li>
            </ul>
          
          
            <dl class="column-panelModule column-fontSize">
              <dt>Font Size</dt>
              <dd>
                <div class="kit-rangeSlider">
                  <input type="range" min="10" max="20" name="slider" id="slider" value="12"  onchange="fnMarkupTextSize();" />
                  <input type="text"  disabled  />
                </div>
              </dd>
            </dl>
            
            <dl class="column-panelModule column-pickColor on">
              <dt>Color</dt>
              <dd>
                <ul class="list-colors">
                  <li class="red on" onclick="fnMarkupTextColor('#FF0000');"></li>
                  <li class="orange" onclick="fnMarkupTextColor('#FF7F27');"></li>
                  <li class="yellow" onclick="fnMarkupTextColor('#FFF200');"></li>
                  <li class="lime" onclick="fnMarkupTextColor('#B5E61D');"></li>
                  <li class="green" onclick="fnMarkupTextColor('#22B14C');"></li>
                  <li class="sky" onclick="fnMarkupTextColor('#99D9EA');"></li>
                  <li class="blue" onclick="fnMarkupTextColor('#3F48CC');"></li>
                  <li class="violet" onclick="fnMarkupTextColor('#A349A4');"></li>
                  <li class="white" onclick="fnMarkupTextColor('#FFFFFF');"></li>
                  <li class="black " onclick="fnMarkupTextColor('#000000');"></li>
                </ul>
              </dd>
            </dl>
          
            <dl class="column-panelModule column-pickThick on">
              <dt>Thickness</dt>
              <dd>
                <ul class="list-thickness">
                  <li>
                    <dl class="kit-thickness" onclick="fnMarkupLing(0.5);">
                      <dt>0.5</dt>
                      <dd class="on"></dd>
                    </dl>
                  </li>
                  <li>
                    <dl class="kit-thickness"  onclick="fnMarkupLing(1);">
                      <dt>1</dt>
                      <dd></dd>
                    </dl>
                  </li>
                  <li>
                    <dl class="kit-thickness" onclick="fnMarkupLing(2);">
                      <dt>2</dt>
                      <dd></dd>
                    </dl>
                  </li>
                  <li class="on">
                    <dl class="kit-thickness" onclick="fnMarkupLing(3);">
                      <dt>3</dt>
                      <dd></dd>
                    </dl>
                  </li>
                  <li>
                    <dl class="kit-thickness" onclick="fnMarkupLing(4);">
                      <dt>4</dt>
                      <dd></dd>
                    </dl>
                  </li>
                  <li>
                    <dl class="kit-thickness" onclick="fnMarkupLing(5);">
                      <dt>5</dt>
                      <dd></dd>
                    </dl>
                  </li>
                </ul>
              </dd>
            </dl>
          
            <dl class="column-panelModule column-clipArt" >
              <dt>클립아트</dt>
              <dd>
                <ul class="list-clipArt">
                </ul>
              </dd>
            </dl>
          </li>


           <!-- 라이브러리 
          <li class="cont-specific">
            <div class="line-selectList">
              <select name="" id="">
                <option value=""></option>
              </select>
            </div>
            
            <ul class="list-panelModule list-panelBtns">
              <li class="undo" onclick="libundo();">
                <i></i>
                <h6>이전작업</h6>
              </li>
              <li class="redo" disabled  onclick="libredo();">
                <i></i>
                <h6>다음작업</h6>
              </li>
              <li class="move skill" onclick="libmove();">
                <i></i>
                <h6>이동</h6>
              </li>
              <li class="rotate skill" onclick="librotate();">
                <i></i>
                <h6>회전</h6>
              </li>
              <li class="scale skill"  onclick="libscale();">
                <i></i>
                <h6>크기</h6>
              </li>
              <li class="rectScale skill" onclick="librectScale();">
                <i></i>
                <h6>사각크기</h6>
              </li>
              <li class="planeMove skill textSmall" onclick="libplaneMove();">
                <i></i>
                <h6>Plane Move</h6>
              </li>
              <li class="reflectX skill textSmall" onclick="libreflectX();">
                <i></i>
                <h6>좌우반전(X)</h6>
              </li>
              <li class="reflectZ skill textSmall" onclick="libreflectZ();">
                <i></i>
                <h6>좌우반전(Z)</h6>
              </li>
              <li class="reflectY skill textSmall" onclick="libreflectY();">
                <i></i>
                <h6>상하반전(Y)</h6>
              </li>
              <li class="delete" onclick="libdelete();">
                <i></i>
                <h6>삭제</h6>
              </li>
              <li class="duplicate" onclick="libduplicate();">
                <i></i>
                <h6>복제</h6>
              </li>
              <li class="deleteAll" onclick="libdeleteAll()">
                <i></i>
                <h6>모두 제거</h6>
              </li>
              <li class="import" onclick="libimport()">
                <i></i>
                <h6>가져오기</h6>
              </li>
              <li class="save" onclick="libsave()">
                <i></i>
                <h6>저장</h6>
              </li>
            </ul>
            
            <div class="box-options">
              <ul>
                <li>
                  <input class="checkBox" type="checkbox" id="checkSnap">
                  <label for="checkSnap">Snap On</label>
                </li>
                <li>
                  <input class="checkBox" type="checkbox" id="checkCollision">
                  <label for="checkCollision">Collision Prevention</label>
                </li>
                
                <li>
                  <label for="">Snap Distance(cm)</label>
                  <input type="text" value="12" />
                </li>
              </ul>
            </div>
            
            <div class="line-btns">
              <button class="btn-block">파일 리스트 열기</button>
            </div>
            
            <ul class="list-panelTabBtns">
              <li class="on">인테리어</li>
              <li>안전</li>
              <li>시공</li>
              <li>전기</li>
              <li>설비</li>
            </ul>
            <ul class="list-panelTabConts">
              <li class="on">
                <ul class="list-thumbs">
                  <li><img src="/img/ico_fileimg01.png" alt="" /></li>
                  <li><img src="/img/ico_fileimg02.png" alt="" /></li>
                  <li><img src="/img/ico_fileimg03.png" alt="" /></li>
                  <li><img src="/img/ico_fileimg04.png" alt="" /></li>
                </ul>
              </li>
            </ul>
            
          </li>

		-->
          <!-- 북마크 -->
          <li class="cont-specific">
            <div class="line-smallBtns">
              <div class="left">
                <button class="btn-addGroup" onclick="fnBookmarkGroup();"></button>
                <button class="btn-delete" onclick="fnBookmarkGroupDel();"></button>
              </div>
              <div class="right">
               <!--  <button class="btn-save" ></button> -->
              </div>
            </div>
            <div class="line-selectList">
              <select name="selbookmark" id="selbookmark" onchange="fnBookMarDescSearch()">
              
              </select>
              <button class="btn-add" onclick="fnBookmartadd();"></button>
            </div>
            <div class="line-middleBtns">
              <button class="btn-play on" onclick="fnBookMarkPlay()"></button>
              <button class="btn-rewind"  onclick="fnBookMarkRewindPlay()"></button><!-- 역재생 -->
              <button class="btn-stop"  onclick="fnBookMarkStop()"></button><!-- 중지 -->
              <button class="btn-refresh"  onclick="fnBookMarkRefresh()"></button><!-- 반복재생 -->
            </div>
            <div class="box-options">
              <ul>
                <li>
                  <label for="">재생속도</label>
                  <input type="text" id="txtplayspeed" value="2" onblur="fnSpeed()" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                  <label for="">재생간격</label>
                  <input type="text" id="txtplayspace" value="2" onblur="fnSpace()" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');">
                </li>
              </ul>
            </div>

            <div class="box-playList" id="bookmarkList">
              <ul class="list-playList">
                
              </ul>
            </div>
          </li>

          <!-- 간섭체크 -->
          <li class="cont-specific">
            <div class="wrap-intersect">
              <section class="sect-intersectLeft">
                <h6>대상1(센싱라인)</h6>
                <div class="devideLine"></div>
                <ul id="ulInterJson"></ul>
              </section>

              <section class="sect-intersectRight">
                <h6>대상2(구조)</h6>
                  <div class="devideLine"></div>
                <ul id="ulInterDtdx"></ul>
              </section>
            </div>

            <div class="wrap-intersectCheck">
              <button class="btn-intersetCheck">
                <span onclick="fnIntersetCheckStart()">간섭검사 시작</span>
              </button>

              <section class="sect-intersectGrid customScrollbar">
                <div class="line-table">
                  <table id="grid-interference"></table>
                </div>
                <dl class="column-write">
                  
                  <dt>조치기한</dt>
                  <dd>
                    <input type="date" id="dateInterference" />
                  </dd>
                  <dt>검토의견</dt>
                  <dd>
                    <textarea name="txtInterference" id="txtInterference" rows="10"></textarea>
                  </dd>
                </dl>
                <div class="line-btns">
                  <button class="btn-save" onclick="fnInterferenceCheck()">저장</button>
                </div>
              </section>
            </div>

            <div class="box-options">
              <h6>Option</h6>
              <ul>
                <!-- li>
                  <input class="checkBox" type="checkbox" id="checkFocus">
                  <label for="checkFocus"></label>
                  <p>선택항목 포커스</p>
                </li -->
                <li>
                  <input class="checkBox" type="checkbox" id="checkXray">
                  <label for="checkXray">대상 요소 제외 X-ray</label>
                </li>
                <li>
                  <input class="checkBox" type="checkbox" id="checkColor">
                  <label for="checkColor">선택항목 색상 적용</label>
                </li>
              </ul>
            </div>
            </li>
          <!-- 속성정보 -->
          <li class="cont-information on">
            <h4>Element명</h4>
            <dl class="column-props">
              <dt>기본정보</dt>
              <dd>
                <table class="tbl-basic tbl-props" id="table_prop">
                <colgroup>
                  <col style="width: 120px;" />
                </colgroup>
                <tbody>
             
                </tbody>
                </table>
              </dd>
            </dl>
      
          </li>
        </ul>
      </aside>
    </main>
  </div>
</body>

<script src="/dtdon/js/DTDonPlayer.js"></script>
<script src="/dtd/js/DTDPlayer.js"></script>

<script src="/js/common.js"></script>
<script src="/js/html2canvas.js"></script>
<script src="/js/html2canvas.min.js"></script>
<script>
    
	let bimplayer;
	function onLoadDTDPlayer(dtdPlayerElement) {
		bimplayer = dtdPlayerElement.dtdPlayer;
  		if (bimplayer === undefined) {
	        return;
    	}
    	bimplayer.OnInterferenceCheckEnd = (result) => {
      		initGridInterference(result);
  		}
    	bimplayer.OnPathTrackingEnd = (result) => {
  	}
    bimplayer.OnSelected = (parameters) => {
	   	if(parameters == undefined){
	   		return false;
	   	}
	   	property_init(parameters);
	};
    bimplayer.OnAddMarkupSuccess = (markupType) => {
    	if (markupType === 'Line') {
    	}
    	else if (markupType === 'Text') {
    	}
    	else if (markupType.includes('Clipart_')) {
    	}
    };
    bimplayer.On2DView=(tag) => {
    	var json = JSON.stringify(tag);
    	var obj =  JSON.parse(json);
    	view2d(obj.TAG);
    };
    bimplayer.On2DDesignCheckResult=(tag) => {
    	var json = JSON.stringify(tag);
    	var obj =  JSON.parse(json);
    	view2dChecked(obj.TAG);
    };
    bimplayer.On3DDesignCheckResult=(tag) => {
    	var json = JSON.stringify(tag);
    	var obj =  JSON.parse(json);
    	view3dChecked(obj.TAG);
    };
    bimplayer.OnFieldDesignCheckResult=(tag) => {
    	var json = JSON.stringify(tag);
    	var obj =  JSON.parse(json);
    	viewissueChecked(obj.TAG);
    };
    const userContainer = document.getElementById('top-user-container');
    const chatContainer = document.getElementById('right-chat-container');
    const dtdonPlayer = new DTDonPlayer(bimplayer);
    dtdonPlayer.InitializeDTDon({
        colyseusServerHost: '${colyseusServer}',
    	rtcSignalServerHost: '${rtcSignalServer}',
    	userContainer,
        chatContainer
    }).then(() => {
        dtdonPlayer.SetUserProfile({
    		name: '<%=loginUserId%>',
            nickname: '<%=loginUserNm%>',
            company: '한국전력기술',
        });
        dtdonPlayer.ConnectToColyseusServer();
    });
}
function property_init(parameters){
	const prop =JSON.stringify(parameters) ; 
	const jsonobj = JSON.parse(prop);
   	const table = document.getElementById("table_prop");
   	$("#table_prop tr").remove(); 
   	var keys = Object.keys(parameters); //키를 가져옵니다. 이때, keys 는 반복가능한 객체가 됩니다.
    for (var i=0; i<keys.length; i++) {
       	var key = keys[i];
       	const newRow = table.insertRow();
       	const newCell1 = newRow.insertCell(0);
       	const newCell2 = newRow.insertCell(1);
       	newCell1.innerText = key;
       	newCell2.innerText = parameters[key];
    }
    fnInfomation();
}
</script>
<script>
let dwgLoadList = [];
let HierarchySelectMainList = ["searchPlantMain", "searchUnitMain", "searchBuildingMain", "searchLevelMain", "searchTagMain"];
document.addEventListener('DOMContentLoaded', function() {
	makeLocationTree1();
	changesearchLevelMain(-1);
  	initGridSearchResult();
  	//마크업 리스트 
  	fnSearchMarkupList();
});
function changesearchLevelMain(selectLevel)  {
	

  var searchParentMainId;
  var lvlCode = "";
  for(var i = selectLevel + 1; i < 5; i++)  {
	if(i == 4){
		$("#"+HierarchySelectMainList[i]).val("");
	}else{
		$("#"+HierarchySelectMainList[i]).empty();
	}
  }
  if(selectLevel == 2){
	lvlCode = "LVL";
  }
  (selectLevel == -1) ? searchParentMainId = "012" : searchParentMainId = $('#' + HierarchySelectMainList[selectLevel] + ' option:selected').val();
  if(searchParentMainId != undefined && searchParentMainId != "")  {
    var params = {parentId : searchParentMainId ,lvlCode : lvlCode};
    $.ajax({
      url : "/common/hierarchySelectbox",
      type : 'POST',
      contentType:"application/json; charset=UTF-8",
      async: false,
      data : JSON.stringify(params),
      success : function(success) {
        $("#" + HierarchySelectMainList[selectLevel + 1]).append("<option value=''>선택하세요</option>");
		for(var i = 0; i < success.data.length; i++)	{
			$("#" + HierarchySelectMainList[selectLevel + 1]).append("<option value='" + success.data[i].cdId + "'>" + success.data[i].cdNm + "</option>");
		}
      },
      error : function(err) {
        alert("Error : 오류코드 [ " + err.status + " ]");
      }
    });
  }
}

function fnSearchMainList()  {
  	var searchIdx = 3, searchSeq = 0, searchText = "";
  	while (searchSeq == 0 && searchIdx >= 0)  {
    	if ($("#" + HierarchySelectMainList[searchIdx]).val() != "" && $("#" + HierarchySelectMainList[searchIdx]).val() > 0)  {
      		searchSeq = $("#" + HierarchySelectMainList[searchIdx]).val();
   		}
   		searchIdx--;
  	}
	var dwgLevel   =$("#searchLevelMain").val();
	var tagNm  =$("#searchTagMain").val();		
	if((dwgLevel == null || dwgLevel == "") && tagNm == "")  {
	    alert("검색할 계층을 선택하거나 루트밸브를 입력하세요");
	}
	else{
		var dwgPlant =$(".panel-nav #searchPlant").val();
		var dwgUnit  =$(".panel-nav #searchUnitMain").val();
		var dwgBuilding   =$(".panel-nav #searchBuildingMain").val();
		var dwgLevel   =$(".panel-nav #searchLevelMain").val();
		var tagNm  =$(".panel-nav #searchTagMain").val();
		var params = {dwgPlant : dwgPlant,dwgUnit : dwgUnit,dwgBuilding : dwgBuilding,dwgLevel : dwgLevel,tagNm : tagNm};
	    $.ajax({
	      url : "/d3api/hierarchySearchResult",
	      type : 'POST',
	      contentType:"application/json; charset=UTF-8",
	      async: false,
	      data : JSON.stringify(params),
	      success : function(success) {
	        initGridSearchResult(success);
	      },
	      error : function(err) {
	        alert("Error : 오류코드 [ " + err.status + " ]");
	      }
	    });
	}
}
//로그인 사용자 마크업 데이터 가져오기 
function fnSearchMarkupList(){
	var params = {};
    $.ajax({
      url : "/d3api/markupRegList",
      type : 'POST',
      contentType:"application/json; charset=UTF-8",
      async: false,
      data : JSON.stringify(params),
      success : function(success) {
        $("select#selmarkUp option").remove();
		$("#selmarkUp").append("<option value=''>선택하세요</option>");
		for(var i = 0; i < success.length; i++)	{
			$("#selmarkUp").append("<option value='" + success[i].base64screenshot + "'>" + success[i].title + "</option>");        
		}	
      },
      error : function(err) {
        alert("Error : 오류코드 [ " + err.status + " ]");
      }
    });
}

function fnMarupImg(){
	$(".line-title .title").text("마크업 사진");
	if($("#selmarkUp").val() != ""){
		const base64String = $("#selmarkUp").val(); // 저장된 Base64 String 변수로
		bimplayer.LoadMarkupByBase64String(base64String);
	}
}
//저장된 마크업 삭제 
function fnMarkUpDel(){
	var base = $("#selmarkUp").val(); 
	var params = {base : base};
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		url : "/d3api/markupdel",
		type : 'POST',
		data : JSON.stringify(params),
		async: false,
		success : function(data) {
			fnSearchMarkupList();
			alert("삭제 하였습니다.");
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}
function initGridSearchResult(gridData)  {
  //console.log(JSON.stringify(gridData));
  $("#grid-searchResult").jqGrid('GridUnload');
  $("#grid-searchResult").jqGrid({
    colNames: ["", "Plant", "Unit", "Building", "Level", "루트밸브"],
    colModel: [
      { name: "tagSeq", hidden:true, key:true },
        { name: "plantNm", width: "55px" },
        { name: "unitNm", width: "50px" },
        { name: "buildingNm", width: "55px" },
        { name: "levelNm", width: "50px" },
        { name: "rootValveNm", width: "50px" },
    ],
    autowidth:true,
    data: gridData,
    onCellSelect: function(rowid, index, contents, event) {
      var selRowData = $("#grid-searchResult").jqGrid("getRowData",rowid);
      
      if(dwgLoadList.indexOf(selRowData.tagSeq) >= 0){
        	
          bimplayer.MoveCameraToRootValvePosition(selRowData.rootValveNm);
      }else  {
          fnOpenTreeToModel("list", selRowData.tagSeq);
          
          dwgRootvalve = selRowData.rootValveNm;
         
      }
    },
    gridComplete: function(){ //현재 그리드 마우스커서 변경
        var rowIds = $("#grid-searchResult").getDataIDs();
        var rowData = $("#grid-searchResult").getRowData();
        $.each(rowData, function(idx, rowId){
        	$("#grid-searchResult").jqGrid('setRowData', rowIds[idx], false, {cursor:'pointer'});
        });
    }
  });
}

function makeLocationTree1(treeData) {
  let locationData = [];

  $.ajax({
    url : "/d3api/hierarchyTree",
    type : 'POST',
    contentType:"application/json; charset=UTF-8",
    async: false,
    success : function(success) {
      locationData1 = success.data;
      
      locationData1.map(e => {
        e.a_attr = JSON.parse(e.a_attr);
      });
    },
    error : function(err) {
      alert("Error : 오류코드 [ " + err.status + " ]");
    }
  });
 
  $tree1 = $("#tree1")
    .jstree({
      plugins: ["themes", "html_data", "checkbox", "sort", "ui", "real_checkboxes", "changed"],
      checkbox: {
        three_state: false,
        tie_selection: false,
        cascade_to_disabled: false,
        whole_node : false,
        
      },
      core: {
        themes: {
          "icons": false,
          check_callback: true,
        },
        data: locationData1,
      },
      "changed" : {

      },
      "sort" : function (a, b) { return (parseInt(a) < parseInt(b)) ? -1 : 1; },
    })
    .on("select_node.jstree", function (e, data) {
		var level = data.node.parents.length;
		var nodeId = data.node.id;
		var nodeIcon = data.node.icon;
       
        
        if(level == 5 &&  dwgLoadList.indexOf(nodeIcon.toString()) >= 0 )  {
			
            var rootvalveId = data.node.text;
           
            if(data.node.text.indexOf(" (") > 0)  {
              	rootvalveId = data.node.text.split(" (")[0];
        	}
			
            if(rootvalveId == "V1234"){  //이태희 부장의 요청으로 하드코딩 
            	var keyValueJson = [[{"key": "id", "value" : "16691"}]];
                bimplayer.SelectAndFit(keyValueJson,true);
            }else{
            	bimplayer.MoveCameraToRootValvePosition(rootvalveId);
        	}
      	}else if(level == 6)  {
      		
			/* var nodeIcon = data.node.icon;
            var parent = $("#tree1").jstree(true).get_node(($("#tree1").jstree(true).get_node(nodeId)).parent);
            var parentIcon = parent.icon;
            var parentId = parent.icon;

            if(dwgLoadList.indexOf(parentId.toString()) >= 0)  {
              var keyValueJson = [[{"key": "id", "value" : nodeIcon}]];

              console.log(JSON.stringify(keyValueJson));
              bimplayer.SelectAndFit(keyValueJson,true);
            } */
       	}else if(level == 7)  {  
      		var nodeIcon = data.node.icon;
       		var keyValueJson = [[{"key": "id", "value" : nodeIcon}]];
            bimplayer.SelectAndFit(keyValueJson,true);
          
       	}
    })
    .on("loaded.jstree", function (e) {
      $tree1.jstree("select_node", "fac-2-floor-1");
    })
    .on("check_node.jstree", function (e, data) {
      var level = data.node.parents.length;
      let node_id = data.node.id;
      getAttr(node_id);
      var currentNode = data.node;
      var children = $("#tree1").jstree("get_children_dom", currentNode);
      var childrens = $("#tree1").jstree("get_children_dom", children);
      var v = $("#tree1").jstree(true).get_checked("#", { flat: true });

      $(data.node.parents).each(function () {
        $(".jstree").jstree("uncheck_node", this);
      });
      $(children).each(function () {
        $(".jstree").jstree("uncheck_node", this);
      });
      $(children)
      .find("li")
      .each(function () {
        $(".jstree").jstree("uncheck_node", this);
      });
    })
    .on("ready.jstree", function () {
      $(this).jstree("open_all");

      $('#tree1 li').each( function() {
        var cNode = $("#tree1").jstree().get_node(this.id);
        var level = cNode.parents.length;
        if(level>=5){
          $('#tree1').jstree("close_node",cNode.id);
        }
      });
    });

  var getAttr = (node_id) => {
    let arrDwg = [];
    let cntParChk = $("#" + node_id).parents("[aria-selected=true]").length;
  };
}

let dtdxList = [];
let dtdxNmList = [];
let fileList = [];
let dwg2dcheck  = "";
let dwgRootvalve = "";

let hSeqList = [];
let idLvlList = [];
function fnOpenTreeToModel(openType, openSeq) {
	hSeqList = [];
  	idLvlList = [];
  	dtdxList = [];
  	dtdxNmList = [];
  	dwgLoadList = [];
  	if(openType == "tree")  {
    	let checkedNodes = $("#tree1").jstree("get_checked", true);
	    $.each(checkedNodes, function () {
    		var idlList = new Object();
		    hSeqList.push(this.id);
      		idlList.id = this.original.id;
      		idlList.lvl = this.original.lvl;
      		idLvlList.push(idlList);
      		if(this.original.lvl == 5){
      			idlList.id = this.original.icon;
      		}
      	});
 	}else if(openType == "list") {
    	var idlList = new Object();
		hSeqList.push(openSeq);
    	idlList.id = openSeq;
    	idlList.lvl = 5;
    	idLvlList.push(idlList);
  	}else{
  		var idlList = new Object();
		hSeqList.push(openSeq);
    	idlList.id = openSeq;
    	idlList.lvl = 999; // tag가 아닌 도면 번호로 조회시 갈제로 lvl = 999 로 변경 함 
    	idLvlList.push(idlList);
  	}
	if (hSeqList.length > 0) {
	    // 모델을 성공적으로 가지고 왔다면 아래 콜백 호출됨
	    bimplayer.OnContentsAllLoaded = () => {
	      if(dwg2dcheck != ""){
	    	  check2d_dwgview(dwg2dcheck);
	    	  dwg2dcheck = "";
	      }
	      if(dwgRootvalve != ""){
	    	  rootvalue_dwgview(dwgRootvalve);
	    	  dwgRootvalve = "";
	      }
	    };
	   	var params = {hiSeqList : hSeqList , idLvlList : idLvlList};
		$.ajax({
			contentType : "application/json; charset=UTF-8",
			url : "/d3api/dwgLoad",
			type : 'POST',
			data : JSON.stringify(params),
			async: false,
			success : function(data) {
				for(var i = 0; i < data.length; i++)	{
					dwgLoadList.push(data[i].hseq.toString());
					fileList.push(data[i].hseq.toString());
				}
			},
			error : function(err) {
				alert("Error : 오류코드 [ " + err.status + " ]");
			}
		});
	
	    $.ajax({
	      contentType : "application/json; charset=UTF-8",
	      url : "/d3api/dwgFile",
	      type : 'POST',
	      data : JSON.stringify(params),
	      async: false,
	      success : function(data) {
	        for(var i = 0; i < data.length; i++)  {
	          dtdxList.push(data[i].dwgNum);
	          dtdxNmList.push(data[i].jsonFileNmOri);
	          fileList.push(data[i].dwgNum);
	        }
	      },
	      error : function(err) {
	        alert("Error : 오류코드 [ " + err.status + " ]");
	      }
	    });
	    params = {idLvlList : idLvlList};
	    $.ajax({
	      contentType : "application/json; charset=UTF-8",
	      url : "/d3api/modelFile",
	      type : 'POST',
	      data : JSON.stringify(params),
	      async: false,
	      success : function(data) {
	        for(var i = 0; i < data.length; i++)  {
	          dtdxList.push(data[i].fileNm);
	          dtdxNmList.push(data[i].fileNmOri);
	        }
	      },
	      error : function(err) {
	        alert("Error : 오류코드 [ " + err.status + " ]");
	      }
	    });

	    if (dtdxList.length == 0)  {
	      alert("선택한 계층의 모델이 없습니다.1");
	    }
	    else  {
	      bimplayer.CloseAll();
	      bimplayer.OpenURL(dtdxList);
	    }
	    fnBookMarkSearch();
	} else {
	    alert("트리에서 모델을 선택해주세요.");
	    return false;
	}
	if($(".panel-right ul.list-tabBtns > li").length == 3 
			&& $(".panel-right ul#ul-Interference > li").length == 5){
		fnInterferenceIcon();
	}
	
}

function check2d_dwgview(handle){
    closePop('pop-inconsistency');
	closePopAbsolute('pop-view-item');
	fnPageTab('cont-webGl');
	var keyValueJson = [[{"key": "id", "value" : handle}]];
    var propertyInfo = bimplayer.GetElementDataList(keyValueJson);
    if(JSON.stringify(propertyInfo) == "[]"){
    	alert("해당 센싱라인이 없습니다.");
    }else{
    	property_init(propertyInfo[0]);
    	bimplayer.SelectAndFit(keyValueJson,true);
    }
}
function rootvalue_dwgview(tagNm){
	bimplayer.MoveCameraToRootValvePosition(tagNm);
}

/**
*  판넬 영역 처리
*/

/**
*  간섭체크
*/
var oldInterferencePointIndex = "";
// 하단 Icon메뉴바 간섭체크 클릭. 로드된 모델을 기준으로 대상1, 대상2의 라디오, 체크박스 데이터 생성
function fnInterferenceIcon()  {
	bimplayer.StopMarkup();
  	$("#btnWebgl").html = "간섭검사";
  	$("#grid-interference").jqGrid('GridUnload');
  	var arrJson = [], arrDtdx = [];
    if(dtdxList.length == 0)  {
      alert("모델파일이 없습니다2");
    }
    else  {
      var ulInterJson = $("#ulInterJson");
      var ulInterDtdx = $("#ulInterDtdx");
      ulInterJson.empty();
      ulInterDtdx.empty();
      for(var i=0; i < dtdxList.length; i++)  {
        var fileNm = dtdxList[i].split("/").reverse()[0];
        var fileNmOri = dtdxNmList[i].split("/").reverse()[0];
        const dotIndex = fileNmOri.lastIndexOf('.');
        // 점이 존재하고 그것이 첫 번째 문자가 아닌 경우 확장자를 제거
        if (dotIndex !== -1) {
        	fileNmOri = fileNmOri.substring(0, dotIndex);
        }
        if(fileNm.split(".").reverse()[0].toUpperCase() == "JSON")  {
          ulInterJson.append("<li><input type='radio' name='radioJson' value='" + fileNm + "' onclick='fnInterferenceJsonClick(this);'/><label>" + fileNmOri + "</label></li>");
        }
        ulInterDtdx.append("<li><input type='checkbox' class='checkBox' name='checkDtdx' id='check_" + fileNm + "' value='" + fileNm + "'/><label for='" + fileNm + "'>" + fileNmOri + "</label></li>");
      }
    }
}

//간섭체크 대상1 라디오버튼 선택
function fnInterferenceJsonClick(obj)  {
  $('input:checkbox[id="check_' + obj.value + '"]').prop("checked", false);
  var checkDtdx = $("input[name='checkDtdx']");
  $(checkDtdx).each(function() {
    if(obj.value == $(this).val()){
      $(this).prop("disabled", true);
    }
    else  {
      $(this).prop("disabled", false);
    }
    });
}
// 간섭체크 간섭검사 시작버튼. 라디오, 체크박스 선택항목 확인
function fnIntersetCheckStart()  {
  const arrCheckDtdx = [];
  const arrCheckJson = [];
  var radioJson = $("input[name='radioJson']:checked").val();
    // 체크한 항목만 취득
    var checkDtdx = $("input[name='checkDtdx']:checked");
    $(checkDtdx).each(function() {
      arrCheckDtdx.push([{key:'파일명', value:$(this).val()}]);
    });
    if(radioJson == undefined)  {
      alert("대상1(센싱라인) 을 선택하세요");
    }
    else if(arrCheckDtdx.length == 0)  {
      alert("대상2(구조) 를 선택하세요");
    }
    else  {
      bimplayer.StartInterferenceCheck([[{key:'파일명', value:radioJson}]], arrCheckDtdx);
    }
}

/* grid에서 버튼 처리 */  
function formatOpt1(cellvalue, options, rowObject){
  //return "<button onclick=\"fnCaptureSave('"+rowObject.mesh1Id+"','"+rowObject.mesh2Id+"');\" title='capture'><img src='/img/ico_cam.svg' /></button>";
  return "<button  title='capture'><img src='/img/ico_cam.svg' /></button>";
}
// webGL에서 간섭체크 결과를 받아서 그리드에 데이터 생성
function initGridInterference(data)  {
	var clickedColumnName = null;
  	for(var i=0; i < data.length; i++)  {
    	data[i].resultText = data[i].mesh1Id + " <-> " + data[i].mesh2Id;
  	}
  	$("#grid-interference").jqGrid('GridUnload');
  	$("#grid-interference").jqGrid({
    	colNames: ["간섭결과", "", "", "", "", "", ""],
      	colModel: [
	        { name: "resultText", width: "200px" },
	        { name: "btncapture", index: "btn1", width: "50px",formatter:formatOpt1, sortable: false},
	        { name: "pointIndex", hidden:true },
	        { name: "mesh1Id", hidden:true },
	        { name: "mesh2Id", hidden:true },
	        { name: "mesh1FileName", hidden:true },
	        { name: "mesh2FileName", hidden:true },
	      ],
      	autowidth:true,
      	data: data,
      	multiselect: true,
      	multiselectWidth: 24,
      	onCellSelect: function(rowid, iCol, cellcontent, e) {
          // colModel에서 클릭된 컬럼의 이름을 가져오기
        	var colModel = $("#grid-interference").jqGrid('getGridParam', 'colModel');
          	clickedColumnName = colModel[iCol].name;
      	},
      	onSelectRow : function(rowid, status) {
	        var rowData = $("#grid-interference").jqGrid('getRowData',rowid);
	        oldInterferencePointIndex = rowData.pointIndex;
	 		if(clickedColumnName == "btncapture"){
	 			if(status == false){
	 				$("#grid-interference").jqGrid('setSelection', rowid, true);
	 			}else{
	 				$("#grid-interference").jqGrid('setSelection', rowid, false);
	 			}
	 	    }else{
	        	bimplayer.MoveCameraToInterferencePoint(rowData.pointIndex, () => { 
		        }); 
	        }
	        if(clickedColumnName == "btncapture" && status == false){
	        	$("#grid-interference").jqGrid('setSelection', rowid, false);
	        	fnCaptureSave(rowData.mesh1Id, rowData.mesh2Id);
			}
		}
	});
}
function fnCaptureSave(mesh1Id,mesh2Id){
	const target = document.getElementById("container");
    if (!target) {
      return alert("사진 저장에 실패했습니다.");
    }
    html2canvas(target).then((canvas) => {
        var radiovalue = $('input[name=radioJson]:checked').val();
    	var myImg = canvas.toDataURL("image/png");
		$.ajax({
			type : "POST",
			data : {
				"imgSrc" : myImg 
				,"mesh1Id" : mesh1Id
				,"mesh2Id" : mesh2Id
				,"radiovalue" : radiovalue
			},
			dataType : "text",
			url :"/check/imgsave",
			success : function(data) {
				alert("화면 캡쳐 이미지 저장하였습니다.");
			},
			error : function(a, b, c) {
				alert("화면 캡쳐 이미지 저장 error");
			}
		});
      
    });
}
function fnInterferenceCheck(){
	if( $("#dateInterference").val() == ""){
		alert("조치기한을 입력해주세요.");
		return;
	}
	if( $("#txtInterference").val() == ""){
		alert("검토의견을 입력해 주세요.");
		return;
	}
    var model3dId = $('input[name=radioJson]:checked').val();
    if(model3dId == undefined || model3dId =="undefined"){
    	alert("대상1(센싱라인) 을 선택해 주세요.");
    	return false;
    }
	var params = {fileId : model3dId , actionDeadline3 : $("#dateInterference").val() , examinationOpinion3 : $("#txtInterference").val()};
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		url : "/check/interference",
		type : 'POST',
		data : JSON.stringify(params),
		async: false,
		success : function(data) {
			alert("3D 검토의견을 저장하였습니다. ");
			$("#dateInterference").val(""); 
			$("#txtInterference").val(""); 
			
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

// webgl 하단 버튼 모음 
function fnProperty(){
	// 마크업 헤재 
	bimplayer.StopMarkup();
	const allitem = bimplayer.GetClassificatedElementDataList();
    var json = JSON.stringify(allitem);
    var obj = JSON.parse(json);
    var obj2 = JSON.parse(JSON.stringify(obj.카테고리) );
    //카테고리 구조 만들기 
    var arrPipeData = new Array();
    var obj3 = JSON.parse(JSON.stringify(obj2.배관) );
   
    arrPipeData[0]= {"id" : "카테고리" , "parent" : "#",  "text" :"카테고리",  "lvl":"1"};
    arrPipeData[1]= {"id" : "배관" , "parent" : "카테고리",  "text" :"배관",  "lvl":"2"};
    var num = 2;
    for(var i in obj3) {
    	 arrPipeData[num]= {"id" : obj3[i].아이디 , "parent" : "배관",  "text" :obj3[i].아이디 ,  "lvl":"3"};
        num++;
    } 
    var obj4 = JSON.parse(JSON.stringify(obj2.Clamp) );
    arrPipeData[num]= {"id" : "Clamp" , "parent" : "카테고리",  "text" :"Clamp",  "lvl":"2"};
    num++;
    for(var i in obj4) {
   	 arrPipeData[num]= {"id" : obj4[i].아이디 , "parent" : "Clamp",  "text" :obj4[i].이름 ,  "lvl":"3"};
      
       num++;
    }
    $("#tree-viewProps").jstree({
       plugins: ["themes", "html_data", "checkbox", "sort", "ui", "real_checkboxes", "changed"],
      
       core: {
         themes: {
           "icons": false,
            check_callback: true,
         },
         data: arrPipeData,
       },
      
 	})   ;
}
function fnLibrary(){
	bimplayer.StopMarkup();
}
function fnBookMark(){
	bimplayer.StopMarkup();
	bimplayer.SetBookmarkGlobalAnimateSpeed ($("#txtplayspeed").val());
	bimplayer.SetBookmarkGlobalAnimateDelay($("#txtplayspace").val());
}
function fnTalk(){
	bimplayer.StopMarkup();
}
function fnPageInit(){
	bimplayer.StopMarkup();
}
function fnInfomation(){
	bimplayer.StopMarkup();
	const tabindexCnt = $(".panel-right ul.list-tabBtns > li").length;
	const contIndexCnt = $(".panel-right ul#ul-Interference > li").length;
	
	$(".panel-right ul.list-tabBtns > li").removeClass("on");
	$(".panel-right ul#ul-Interference > li").removeClass("on");
	$(".panel-right ul.list-tabBtns > li").eq(tabindexCnt - 1).addClass("on");
	$(".panel-right ul#ul-Interference > li").eq(contIndexCnt - 1).addClass("on");
	$("ul.list-palette > li").removeClass("on");
	
}

// 마크업 관련 모음 
var colorGubun="LINE";
function fnMarkup(){
	bimplayer.StartMarkup();
}
var lineColor="";
var lineSize="";
function fnMarkupLine(){
	colorGubun = "LINE";
	if(lineColor == ""){
		lineColor = "#FF0000"
	}
	bimplayer.SetMarkupPenColor(lineColor);	
	if(lineSize == ""){
		lineSize = "3";
	}
	bimplayer.SetMarkupPenThickness(lineSize);
	
}
//마크업 선색상 변경 
function fnMarkupTextColor(color){
	lineColor = color;
	if(colorGubun == "LINE"){
		bimplayer.SetMarkupPenColor(color);
	}else if(colorGubun == "TEXT"){
		bimplayer.SetMarkupFontColor(color);
	}
	
}
//마크업 선투깨 변경 
function fnMarkupLing(line){
	textSize =line;
	bimplayer.SetMarkupPenThickness(line);
}

//마크업 텍스트 
var textSize="";
function fnMarkupText(){
	colorGubun = "TEXT";
	if(lineColor == ""){
		lineColor = "#FF0000"
	}
	bimplayer.SetMarkupFontColor(lineColor);	
	if(textSize == ""){
		textSize = "12";
	}
	bimplayer.SetMarkupFontSize(textSize);
}

function fnMarkupTextSize(){
	textSize = $("#slider").val();
	bimplayer.SetMarkupFontSize(textSize);	
	
}
//UNDO
function fn_Undo(){
	bimplayer.UndoMarkup();
}
function fn_next(){
	bimplayer.RedoMarkup();
}
function fnDeleteMarkUp(){
	bimplayer.ClearAllMarkups();	
}

//z클립아트 
function fnClipArt(){
	const arrImg = bimplayer.GetMarkupClipartImageUrls();
	let imgHtml = "";
	for(var i = 0 + 1; i < arrImg.length; i++)  {
		imgHtml += `<li><img src="`+ arrImg[i] +`" id="`+ i +`"  onclick="fnImgchenge(this.id)" /></li>`
	}
	$("ul.list-clipArt").append(imgHtml);
}
function fnImgchenge(id){
	bimplayer.SetMarkupClipartIndex(id); 
}
function fnMarkupSave(){
	bimplayer.SaveMarkup((title, base64Screenshot) => {
		var paramsmarkup = { base64screenshot:base64Screenshot,title : title };
		$.ajax({
			contentType : "application/json; charset=UTF-8",
			url : "/d3api/markupsave",
			type : 'POST',
			data : JSON.stringify(paramsmarkup),
			async: false,
			success : function(data) {
				fnSearchMarkupList();
			},
			error : function(err) {
				alert("Error : 오류코드 [ " + err.status + " ]");
			}
		});
	});

}

// 라이브러리 관련 모음 
function libundo(){
    //bimplayer.
}
function libredo(){
    //bimplayer.
}
function libmove(){
	bimplayer.MoveCameraToUp();
}
function librotate(){
    //bimplayer.
}
function libscale(){
    //bimplayer.
}
function librectScale(){
    //bimplayer.
}
function libplaneMove(){
    //bimplayer.
}
function libreflectX(){
   // bimplayer.
}
function libreflectZ(){
    //bimplayer.
}
function libreflectY(){
    //bimplayer.
}
function libdelete(){
    //bimplayer.
}
function libduplicate(){
    //bimplayer.
}
function libdeleteAll(){
    //bimplayer.
}
function libimport(){
    //bimplayer.
}
function libsave(){
    //bimplayer.
}
function fnBookmarkGroup(){
	var params = {"title" : ""	};
	var dwg_ling ="";
	$.ajax({
		url : "/d3api/bookmarksave",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(success) {
			bimplayer.AddBookmarkGroup(success.data.bookmarkSeq, (bookmarkGroup) => { 
				fngroupcall(bookmarkGroup) 
			});
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}

function fnBookmarkGroupDel(){
	// 북마크 시퀀스 만들어올것 
	var bookmarkSeq  = $("#selbookmark").val();
	const params = new FormData();
	params.append("bookmarkSeq", bookmarkSeq);
	$.ajax({
		url : "/d3api/bookmarkdel",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : params,
		contentType: false,
	    processData: false,
	    enctype: "multipart/form-data",
		success : function(success) {
			alert("삭제 되었습니다.");
			fnBookMarkSearch();
			fnBookMarDescSearch();
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
}
function fngroupcall(data){
	var bgroup = JSON.stringify(data);
	const obj = JSON.parse(bgroup);
	fnBookMarkSave(obj.groupTitle ,obj.sequenceId);
}
function fnBookMarkSave(title ,bookmarkSeq){
	var params = {hiSeqList : hSeqList , idLvlList : idLvlList , title: title ,bookmarkSeq : bookmarkSeq };
	$.ajax({
		url : "/d3api/bookmarksave2",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			alert("저장되었습니다.");
			$("#selbookmark").append("<option value='" + bookmarkSeq + "'>" + title + "</option>");    
			$("#selbookmark").val(bookmarkSeq);
			fnBookMarDescSearch();
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
}
function fnBookMarkSearch(bookmarkSeq){
	var params = {hiSeqList : hSeqList , idLvlList : idLvlList };
	$.ajax({
		url : "/d3api/bookmarkfind",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(success) {
			$("select#selbookmark option").remove();
			$("#selbookmark").append("<option value=''>선택하세요</option>");
			for(var i = 0; i < success.data.length; i++)	{
				$("#selbookmark").append("<option value='" + success.data[i].sequenceId + "'>" + success.data[i].groupTitle + "</option>");        
			}	
			// 북마크 데이터 로드 
			if(bookmarkSeq != null && bookmarkSeq != "null" && bookmarkSeq != ""){
				$("#selbookmark").val(bookmarkSeq);
				fnBookMarDescSearch();
			}
			bimplayer.LoadBookmark(success.data );
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}
	
//화면 조회	
function fnBookMarDescSearch(){
	var bookmarkSeq  =  parseInt($("#selbookmark").val());
	var params = {"bookmarkSeq" : bookmarkSeq};
	$.ajax({
		url : "/d3api/bookmarkdescfind",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(success) {
			var bookmarkList = $("#bookmarkList .list-playList");
			bookmarkList.empty();
		    for(var i=0; i < success.data.length; i++)  {
		        bookmarkList.append('<li><i></i><div class="title">'+success.data[i].sequenceId+'</div> <button class="btn-delete" onclick="fnbookmartDel('+success.data[i].bookmarkSeq+','+success.data[i].sequenceId+')"></button></li>');
		    }  
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}
function fnbookmartDel(bookmartSeq,sequenceId){
	var params = {bookmarkSeq : bookmartSeq,sequenceId:sequenceId};
	$.ajax({
		contentType : "application/json; charset=UTF-8",
		url : "/d3api/bookmarkdescdel",
		type : 'POST',
		data : JSON.stringify(params),
		async: false,
		success : function(data) {
			fnBookMarDescSearch();
			alert("삭제 하였습니다.");
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
}
function fnBookmartadd(){
	if($("#selbookmark").val() != ""){
		var sequenc_id =  parseInt($("#selbookmark").val());
		bimplayer.AddBookmark(sequenc_id, fnbookmartaddCall );
	}
}
function fnbookmartaddCall(data){
	const bookmarkdesc = JSON.stringify(data);
	const obj = JSON.parse(bookmarkdesc);
	fnBookMarkDescSave(obj);
}
function fnBookMarkDescSave(obj){
    var bookmarkSeq  = parseInt($("#selbookmark").val());  
    var sequenceId  =  obj.sequenceId ;            
    var animateDelay = obj.animateDelay ;          
    var animateSpeed = obj.animateSpeed  ;          
    var cameraPosition = obj.cameraPosition   ;       
    var cameraRotation  = obj.cameraRotation ;        
    var cameraTarget = obj.cameraTarget ;
	var params = {
			bookmarkSeq : bookmarkSeq
			,bookmarkSeq  :  bookmarkSeq        
			,sequenceId  :  sequenceId         
			,animateDelay : animateDelay        
			,animateSpeed  :  animateSpeed      
			,cameraPosition  :   JSON.stringify(cameraPosition)    
			,cameraRotation :    JSON.stringify(cameraRotation)    
			,cameraTarget  :    JSON.stringify(cameraTarget)     
			,regId   : 'ADMIN'
			};
	
	$.ajax({
		url : "/d3api/bookmarkdescsave",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			alert("저장되었습니다.1");
			fnBookMarkSearch(bookmarkSeq);
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	
}
//북마크 플레이어
function fnBookMarkPlay(){
	if($("#txtplayspeed").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateSpeed ($("#txtplayspeed").val());
	}
	if($("#txtplayspace").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateDelay($("#txtplayspace").val());
	}
	var bookmarkSeq  =  parseInt($("#selbookmark").val());
	bimplayer.PlayBookmarkAnimation(bookmarkSeq, false, (bookmarkIndex) => { console.log(bookmarkIndex); }) ;
}
//북마크 역재생
function fnBookMarkRewindPlay(){
	if($("#txtplayspeed").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateSpeed ($("#txtplayspeed").val());
	}
	if($("#txtplayspace").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateDelay($("#txtplayspace").val());
	}
	var bookmarkSeq  =  parseInt($("#selbookmark").val());
	bimplayer.PlayBookmarkAnimation(bookmarkSeq, true, (bookmarkIndex) => { console.log(bookmarkIndex); }) ;
}
//북마크 중지
function fnBookMarkStop(){
	bimplayer.StopBookmarkAnimation();
}

//북마크 반복재생
let timerId;
let toggle = "Y";
function fnBookMarkRefresh(){
	if($("#txtplayspeed").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateSpeed ($("#txtplayspeed").val());
	}
	if($("#txtplayspace").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateDelay($("#txtplayspace").val());
	}
	var bookmarkSeq  =  parseInt($("#selbookmark").val());
	bimplayer.PlayRepeatBookmarkAnimation(bookmarkSeq, false, (index, state) => { console.log(index, state); });
}

//2d보기
function view2d(tagNm){
	if(tagNm == ""){
		alert("SVG 파일이 없습니다.");
		return; 
	}
	var params = {"tagNm" : tagNm};
	$.ajax({
		url : "/common/svgtagread",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params),
		success : function(data) {
			const element = document.getElementById('svgView');
			element.innerHTML = data.data.svgfile;
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	openPop('pop-view-2');
} 
//2d설계점검결과
function view2dChecked(tagSeq){
	fnPageTab('cont-check2d');
	$("#header3DModel").removeClass("on");
	$("#headerCheck2d").addClass("on");
	$("ul.list-tabPageConts > li.on #searchTag").val(tagSeq);
	fnSearchList(1);
}
//3d설계점검결과
function view3dChecked(tagSeq){
	fnPageTab('cont-check3d');
	$("#header3DModel").removeClass("on");
	$("#headerCheck2d").addClass("on");
	$("ul.list-tabPageConts > li.on #searchTag").val(tagSeq);
	
	fnSearchList(1);
}
//현장설계점검결과
function viewissueChecked(tagSeq){
	fnPageTab('cont-checkIssue');
	$("#header3DModel").removeClass("on");
	$("#headerCheck2d").addClass("on");
	$("ul.list-tabPageConts > li.on #searchTag").val(tagSeq);
	
	fnSearchList(1);
}
function fnSpeed(){
	if($("#txtplayspeed").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateSpeed ($("#txtplayspeed").val());
	}
}
function fnSpace(){
	if($("#txtplayspace").val() != ""){
		bimplayer.SetBookmarkGlobalAnimateDelay($("#txtplayspace").val());
	}
}

function screenshot(e){
	var startX, startY;
	var height = window.innerHeight;
	var width = window.innerWidth;
	
	// 배경을 어둡게 깔아주기 위한 div 객체 생성
	var $screenBg = document.createElement("div");
	$screenBg.id = "screenshot_background";
	$screenBg.style.borderWidth = "0 0 " + height + "px 0";

	// 마우스 이동하면서 선택한 영역의 크기를 보여주기 위한 div 객체 생성
	var $screenshot = document.createElement("div");
	$screenshot.id = "screenshot";
	
	document.querySelector("body").appendChild($screenBg);
	document.querySelector("body").appendChild($screenshot);
	
	var selectArea = false;
	var body = document.querySelector('body');

	// 마우스 누르는 이벤트 함수
	var mousedown = function(e) {
		e.preventDefault();
		selectArea = true;
		startX = e.clientX;
		startY = e.clientY;
		// 이벤트를 실행하면서 이벤트 삭제 (한번만 동작하도록)
		body.removeEventListener("mousedown", mousedown);
	}
	// 마우스 누르는 이벤트 등록
	body.addEventListener("mousedown", mousedown);

	// 클릭한 마우스 떼는 이벤트 함수
	var mouseup = function(e) {
		selectArea = false;
		// (초기화) 마우스 떼면서 마우스무브 이벤트 삭제
		body.removeEventListener("mousemove", mousemove);
		// (초기화) 스크린샷을 위해 생성한 객체 삭제
		$screenshot.parentNode.removeChild($screenshot);
		$screenBg.parentNode.removeChild($screenBg);
		var x = e.clientX;
		var y = e.clientY;
		var top = Math.min(y, startY);
		var left = Math.min(x, startX);
		var width = Math.max(x, startX) - left;
		var height = Math.max(y, startY) - top;
		html2canvas(document.body).then(
			function(canvas) { //전체 화면 캡쳐
				 // 선택 영역만큼 crop
				var img = canvas.getContext('2d').getImageData(left, top, width, height);
				var c = document.createElement("canvas");
				c.width = width;
				c.height = height;
				c.getContext('2d').putImageData(img, 0, 0);
				save(c); // crop한 이미지 저장
			}
		);
		body.removeEventListener("mouseup", mouseup);
        // 마우스 커서 기본으로 변경
		document.querySelector("body").classList.remove("edit_cursor");
	}
	body.addEventListener("mouseup", mouseup);

	// 마우스무브 이벤트 함수
	function mousemove(e) {
		var x = e.clientX;
		var y = e.clientY;
		$screenshot.style.left = x;
		$screenshot.style.top = y;
		if (selectArea) { //캡쳐 영역 선택 그림
			var top = Math.min(y, startY);
			var right = width - Math.max(x, startX);
			var bottom = height - Math.max(y, startY);
			var left = Math.min(x, startX);
			$screenBg.style.borderWidth = top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px';
		}
	}
	body.addEventListener("mousemove", mousemove);
    
    // 캡쳐한 이미지 저장
	function save(canvas) { 
		if (navigator.msSaveBlob) {
			var blob = canvas.msToBlob();
			return navigator.msSaveBlob(blob, '파일명.jpg');
		} else {
			var el = document.getElementById("target");
			el.href = canvas.toDataURL("image/jpeg");
			el.download = '파일명.jpg';
			el.click();
		}
	}
}
</script>

<jsp:include page="/layout/fragments/footer.jsp" flush="true" />
