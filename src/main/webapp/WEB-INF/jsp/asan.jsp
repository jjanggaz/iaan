<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<!-- start::Head -->
<head>

	<meta charset="utf-8">
	<meta name="Author" content="john" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>monitoring</title>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>

	<!-- jstree -->
	<script src="../lib/jstree/jstree.js"></script>
	<link rel="stylesheet" type="text/css" href="../lib/jstree/theme/default.css">

	<script src="../js/condition.js"></script>
	<script src="../js/basicCustom.js"></script>
	<script src="../js/addition.js"></script>
	
	<link rel="stylesheet" type="text/css" href="../css/initial.css" />
	<link rel="stylesheet" type="text/css" href="../lib/jquery/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="../css/pop.css" />
	<link rel="stylesheet" type="text/css" href="../css/table.css" />
	<link rel="stylesheet" type="text/css" href="../css/button.css" />
	<link rel="stylesheet" type="text/css" href="../css/form.css" />
	<link rel="stylesheet" type="text/css" href="../css/basicCustom.css" />
	<link rel="stylesheet" type="text/css" href="../css/left.css" />
	<link rel="stylesheet" type="text/css" href="../lib/jstree/tree.css">
	<link rel="stylesheet" type="text/css" href="../css/addition.css">
	
</head>
<body>
	<div id="wrap-page">
		<nav>
			<button class="btn-ctrl"></button>
			<div class="area-lnb">
				<ul class="list-lnb">
					<li class="on">
						<button>3D 모델</button>
						<ul>
							<li>
								<button class="btn-view" onclick="fnOpenDtdx()">보기</button>
								<div id="tree1" class="tree custom"></div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</nav>
		
		<main>
			<section class="floor-conts" style="flex:1; display: flex; flex-direction: column;">
				<article style="flex:1;">
					<div class="wrap-webGl">
						<dtd-player id="unity-container" class="container" onload="OnLoadDTDPlayer(this);" tabindex="0" onfocusin='OnDTDFocus(true)' onfocusout='OnDTDFocus(false)'></dtd-player>
					</div>
				</article>
			</section>
		</main>
	</div>
</body>

<script src="/Build/DTDWeb.loader.js"></script>
<script src="/js/DTDPlayer.js"></script>

<script>
	var arrFileListA1=[];
	var arrFileListA2=[];
	var arrFileListA3=[];
	var arrFileListA4=[];
	var arrFileListA5=[];
	var arrFileListA6=[];
	
	arrFileListA1.push("S3F_FCB_AXX_ALL_Central_1");
	arrFileListA1.push("S3F_FCB_EXX_ALL_Central_1");
	arrFileListA1.push("S3F_FCB_SXX_ALL_Central_1");
	
	arrFileListA2.push("S3F_FCB_AXX_ALL_Central_1");
	
	arrFileListA3.push("S3F_FCB_EXX_ALL_Central_1");
	
	arrFileListA4.push("S3F_FCB_SXX_ALL_Central_1");
	
	arrFileListA5.push("S3F_FCB_AXX_ALL_Central_1");
	arrFileListA5.push("S3F_FCB_EXX_ALL_Central_1");
	
	arrFileListA6.push("S3F_FCB_EXX_ALL_Central_1");
	arrFileListA6.push("S3F_FCB_SXX_ALL_Central_1");

	var dtdPlayer;
	$(function(){
		makeLocationTree1();
	});
	
	// DTDX파일을 로드 옵션
	var openOption = {
		octreeDepth: 2,
		octreeSquare: false,
		useMeshCombine: true,
		useMeshCombineConcurrent: false,
		ignoreMeshVertexCount: 8192,
		maxIndicesCount: -1,
		dynamicSubOctree: true,
		dynamicSubOctreeElementCount: 8192
	};
	
	function makeLocationTree1(treeData){
		/*
		let locationData1=[
			{"id":"site","parent":"#", "text":"사이트"},
			{"id":"fac-1","parent":"site", "text":"1공장"},
			{"id":"fac-1-floor-1","parent":"fac-1", "text":"1층"},
			{"id":"fac-1-floor-2","parent":"fac-1", "text":"2층"},
			{"id":"fac-2","parent":"site", "text":"2공장"},
			{"id":"fac-2-floor-1","parent":"fac-2", "text":"1층"},
			{"id":"fac-2-floor-2","parent":"fac-2", "text":"2층"},
		];
		*/
		let locationData1=[
			{"id":"site","parent":"#", "text":"A4-2L 1F"},
			{"id":"A1","parent":"site", "text":"Zone A-1"},
			{"id":"A2","parent":"site", "text":"Zone A-2"},
			{"id":"A3","parent":"site", "text":"Zone A-3"},
			{"id":"A4","parent":"site", "text":"Zone A-4"},
			{"id":"A5","parent":"site", "text":"Zone A-5"},
			{"id":"A6","parent":"site", "text":"Zone A-6"},
		];
		
		$tree1 = $('#tree1').jstree({
			'plugins' : [
				"themes", "html_data", "checkbox", "sort", "ui","real_checkboxes", "changed", "sort"
			],
			'checkbox' : {
				three_state : false, 
				//whole_node : true,
				tie_selection : false,
				cascade_to_disabled: false,
			},
			'core' : {
				"themes" : {
					"icons": false,
					"check_callback": true,
				},
				'data' : locationData1,
			}
		}).on("loaded.jstree", function(e) {
			$('#tree1').jstree("select_node", "site");
		}).on("check_node.jstree", function(e, data) {
			var level=data.node.parents.length;
			let node_id = data.node.id;
			getAttr(node_id);
			
			var currentNode = data.node;
			var children = $("#tree1").jstree("get_children_dom", currentNode);
			var childrens = $("#tree1").jstree("get_children_dom", children);

			var v = $('#tree1').jstree(true).get_checked("#", {flat:true})

			$(data.node.parents).each(function() {
				$(".jstree").jstree('uncheck_node', this);
			});
			$(children).each(function() {
				$(".jstree").jstree('uncheck_node', this);
			});
			$(children).find("li").each(function() {
				$(".jstree").jstree('uncheck_node', this);
			});
		}).on('ready.jstree', function(){ $(this).jstree('open_all') });

		
		var getAttr = (node_id) =>  {
			let arrDwg = [];
	
			let cntParChk = $("#"+node_id).parents("[aria-selected=true]").length;
	
			let cntChk = $("#"+node_id).parent().find(".jstree-anchor").length;
			let cntChkd = $("#"+node_id).parent().find(".jstree-checked").find("i.jstree-checkbox").length;
	
			if(cntChk == cntChkd) {
				$("#"+node_id).parents("[aria-selected=true]").each(function(){
				arrDwg.push($(this).attr("dwg"));
				});
			}
	
			$("#"+node_id).find(".jstree-checked").find("i.jstree-checkbox").each(function(){
				arrDwg.push($(this).closest("li").children("li").attr("dwg"));
			});
		};
	}

	
</script>

<script>
	// WEBGL 기본 기능(필수)
	// Canvas의 포커스가 있을때 키보드 캡춰 기능 허용
	// cavas내부에 input이 있으면 키보드 캡춰불가(InputField입력중으로 이떄는 IME문제로 사용하지 않음)
	function OnDTDFocus(isFocus) {
		let container = document.getElementById('unity-container');
		let input = container.querySelector('input');
		
		if(input == undefined)	{
			container.dtd.Setting({CaptureKeyboardInput: isFocus});
		}
		else	{
			container.dtd.Setting({CaptureKeyboardInput: false});
		}
	}
	
	function OnLoadDTDPlayer(player) {
		if (undefined == player.dtd)
			return;
		dtdPlayer = player;
		var dtd = player.dtd;

		// DTDWeb엔진이 초기화 되면 호출되는 콜백입니다.
		dtd.OnInit(function () {

			// 설정을 셋팅합니다. (로그, FPS 출력, 조명 강도, 콘텍스트 메뉴 스타일, 키보드입력캡춰, 클릭 이벤트 Delay, 배경생상)
			// 메뉴스타일은 classic, circleA, circleB 중 하나를 선택할 수 있습니다.
			dtd.Setting({
				Language: "Korean",         // 사용 언어
				EnableLog: false,           // 로그  표시
				ShowFPS: true,             // FPS표시 
				LightIntensity: 1.0,		// 조명 강도
				ContextMenuType: "classic",	// 콘텍스트 메뉴 스타일
				CaptureKeyboardInput: false,	// 키보드 입력 캡춰
				DelayLazyClickEvent: 0.3,	// 더블클릭 인식 Delay
				DblClickCameraFit: true,	// 더블 클릭시 카메라 핏 줌인
				SearchTool: false,			// 검색 도구 사용 여부
				NavigateTool: "view,walk,home,help",	// 네비게이션 도구 사용 여부
				GizmoTool: true,			// 카메라 기즈모 도구 사용 여부
				background: "#3C3C3C",		// 배경 색상
				RunInBackground: true,		// 백그라운드 실행 허용 여부
				ResetBeforeGoHome: false,	// 홈버튼 동작전 모든 효과 리셋
				UsePBRShader: false,		// PBR쉐이더 사용 여부
				UseGridPlain: true,         // 바닥 그리드 표시 여부
				XRayAlpha: 0.14,            // XRay효과 투명도
				UseBoxOutline: false,       // 선택아웃라인을 박스형태로 사용
				AutoShowInspectorPanel: true   // 부재 선택시 인스펙터 창 자동 노출
			});
		}); // OnInit

		// dtdx파일 로드가 완료되면 호출되는 콜백입니다.
		dtd.OnContentsAllLoaded(function () {
			
			// 3D에서 특정 부재가 선택되면 호출됩니다.
			// list : 선택된 부재 목록
			// position : 선택 위치 좌표
			// params : 선택 부재의 속성정보
			dtd.OnSelected(function (list, position, params) {

				var contextMenuStr = "[context_refresh:#26a6d1]Reset All States";

				if (0 < list.length) {
					contextMenuStr =
						"[context_category_select:#26a6d1]동일 카테고리 전체 선택," +
						"[context_connet_select:#26a6d1]연결요소 전체 선택,-," +
						"[context_lighlight:#efc75e]Highlight|[적용:#efc75e]하이라이트 적용|[반전 적용:#efc75e]선택항목 제외하고 전체 하이라이트|[카테고리 적용:#efc75e]동일 카테고리 전체 하이라이트," +
						"[context_xray:#efc75e]X-Ray|[적용:#efc75e]X-Ray 적용|[반전 적용:#efc75e]선택항목 제외하고 전체 X-Ray|[카테고리 적용:#efc75e]동일 카테고리 전체 X-Ray," +
						"[context_hidden:#efc75e]Hide|[적용:#efc75e]감추기 적용|[반전 적용:#efc75e]선택항목 제외하고 전체 감추기|[카테고리 적용:#efc75e]동일 카테고리 전체 감추기," +
						"[context_refresh:#efc75e]모든 상태 초기화,-," +
						"[context_visibility:#7F56C1]필터뷰," +
						"[context_hierarchy:#7F56C1]속성뷰," +
						"[context_measure:#7F56C1]치수재기," +
						"[context_minimap:#7F56C1]미니맵," +
						"[context_bookmark:#7F56C1]북마크," +
						"[context_pathtracking:#7F56C1]패스 트래킹,-," +
						"[context_property:#26a6d1]속성보기";
				}
				// 콘텍스트 메뉴구성을 변경합니다.
				dtd.SetContextMenu(contextMenuStr, OnSelectedContextMenu);

			});

		}); // OnContentsAllLoaded

		// 콘텐스트 메뉴에서 특정 메뉴를 선택했을때 호출됩니다.
		// menuName : 선택 메뉴의 이름, ex) 속성보기
		// ids : 선택 부재 ID목록(,문자로 구분된 문자열), ex)  [sample.dtdx(1)]1159581,[sample.dtdx(1)]1159582
		// lastID : 여러 부재 선택시 마지막 선택된 부재의 아이디, ex) [sample.dtdx(1)]1159581
		// params : 마지막 선택 부재의 속성정보
		function OnSelectedContextMenu(menuName, ids, lastID, params) {
			//console.log("OnSelectedContextMenu: menuName(" + menuName + "), ids(" + JSON.stringify(ids) + "), lastID(" + lastID + "), params(" + JSON.stringify(params) + ")");

			switch (menuName) {
				case "동일 카테고리 전체 선택":
					dtd.GetElementParameter(lastID, function (id, parameter) {
						dtd.Select('카테고리', parameter["카테고리"]);
					});
					break;

				case "연결요소 전체 선택":
					dtd.SelectNeighbours('id', lastID);
					break;

				case "하이라이트 적용":
					dtd.ToggleHighlight('id', ids);
					break;

				case "선택항목 제외하고 전체 하이라이트":
					dtd.HighlightOthers('id', ids);
					break;

				case "동일 카테고리 전체 하이라이트":
					dtd.GetElementParameter(ids, function (id, parameter) {

						dtd.ToggleHighlight("카테고리", parameter["카테고리"]);
					});
					break;

				case "X-Ray 적용":
					dtd.XRayOthers('id', ids);
					break;

				case "선택항목 제외하고 전체 X-Ray":
					dtd.ToggleXRay('id', ids);
					break;

				case "동일 카테고리 전체 X-Ray":
					dtd.GetElementParameter(ids, function (id, parameter) {

						dtd.ToggleXRay("카테고리", parameter["카테고리"]);
					});
					break;

				case "감추기 적용":
					dtd.SetInvisible('id', ids);
					break;

				case "선택항목 제외하고 전체 감추기":
					dtd.InvisibleOthers('id', ids);
					break;

				case "동일 카테고리 전체 감추기":
					dtd.GetElementParameter(ids, function (id, parameter) {

						dtd.SetInvisible("카테고리", parameter["카테고리"]);
					});
					break;

				case "모든 상태 초기화":
					dtd.ResetEffect('', '');
					break;

				case "필터뷰":
					dtd.ShowPanel('PanelFilter', { title:'Filter', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', 
									filter:'카테고리|카테고리,패밀리|패밀리 이름' });
					break;
					
				case "속성뷰":
					dtd.ShowPanel('PanelAttrHierarchy', { title:'Hierarchy', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', 
									filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
					break;
					
				case "치수재기":
					dtd.ShowPanel('PanelMeasure', { title:'Measure', minWidth:250, minHeight:250, direction:'right', dockType:'addtab' });
					break;

				case "미니맵":
					dtd.ShowPanel('PanelMinimap', { title:'Minimap', minWidth:350, minHeight:250, direction:'none', dockType:'inside' });
					break;

				case "북마크":
					dtd.ShowPanel('PanelBookmark', { title:'Bookmark', minWidth:250, minHeight:250, direction:'right', dockType:'addtab' });
					break;

				case "패스 트래킹":
					//dtd.TrackingPath('id', ids);
					dtd.ShowPanel('PanelPathTracking');                    
					break;

				case "속성보기":
					// case "속성보기":
					dtd.ShowAttribute('id', ids);
					break;

			} // switch
		} // function OnSelectedContextMenu(menuName, ids, lastID, params)
	}
	
	function fnOpenDtdx()	{

		var url = "";
		var checked_ids1 = [];
		var checkedNodes1 = $('#tree1').jstree("get_checked", true);
		$.each(checkedNodes1, function () {
	      	checked_ids1.push(this.id);
	    });
		
		var firstCheck = true;
		
		for(var i=0; i<checked_ids1.length; i++)	{
			var arrFileList;
			if(checked_ids1[i] == "A1")
				arrFileList = arrFileListA1;
			else if(checked_ids1[i] == "A2")
				arrFileList = arrFileListA2;
			else if(checked_ids1[i] == "A3")
				arrFileList = arrFileListA3;
			else if(checked_ids1[i] == "A4")
				arrFileList = arrFileListA4;
			else if(checked_ids1[i] == "A5")
				arrFileList = arrFileListA5;
			else if(checked_ids1[i] == "A6")
				arrFileList = arrFileListA6;
			
			for (var j=0; j < arrFileList.length; j++)	{
				if(firstCheck)	{
					url += location.origin + "/DTDX/ASAN/" + arrFileList[j] + ".dtdx";
					firstCheck = false;
				}
				else	{
					url += "||" + location.origin + "/DTDX/ASAN/" + arrFileList[j] + ".dtdx";
				}
			}
		}
		
		let dtd = dtdPlayer.dtd;
		dtd.OpenURL(url, true, '', openOption);
	}	
</script>

</html>