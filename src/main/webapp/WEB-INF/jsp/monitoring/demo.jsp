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

	<link rel="stylesheet" type="text/css" href="../css/initial.css" />
	<link rel="stylesheet" href="../lib/jquery/jquery-ui.css">
	
	<link rel="stylesheet" type="text/css" href="../css/pop.css" />
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
	<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.js"></script>
	
	
	<!-- jstree -->
	<script src="../lib/jstree/jstree.js"></script>
	<!-- <script src="../lib/jstree/tree.js"></script> -->
	<link rel="stylesheet" href="../lib/jstree/theme/default.css">
	
	<!-- jqgrid -->
	<script src="../lib/jqgrid/js/jquery.jqGrid.min.js"></script>
	<link rel="stylesheet" href="../lib/jqgrid/css/ui.jqgrid.css">
	<link rel="stylesheet" href="../lib/jqgrid/css/custom.css">

	<script src="../js/condition.js"></script>
	
	<script src="../js/basicCustom.js"></script>
	
	<link rel="stylesheet" type="text/css" href="../css/table.css" />
	<link rel="stylesheet" type="text/css" href="../css/button.css" />
	<link rel="stylesheet" type="text/css" href="../css/form.css" />
	<link rel="stylesheet" type="text/css" href="../css/basicCustom.css" />
	
	<link rel="stylesheet" href="../css/left.css" />
	
	<link rel="stylesheet" href="../lib/jstree/tree.css">
	
	<!-- 추가 -->
	<link rel="stylesheet" href="../css/addition.css">
	<script src="../js/addition.js"></script>
</head>
<body>

	<div class="wrap-pop">

		<div class="pop-cctv">
			<div class="btn-close"></div>
			<div class="floor-title">
				<div class="area-title">
					<div class="title"><span>1</span>층 CCTV</div>
				</div>
				<div class="area-conts area-padding">
					<ul class="list-cctv">
						<li>1층 1구역 장비1 CCTV #1</li>
						<li>1층 1구역 장비1 CCTV #1</li>
						<li>1층 1구역 장비1 CCTV #1</li>
						<li>1층 1구역 장비1 CCTV #1</li>
						<li>1층 1구역 장비1 CCTV #1</li>
					</ul>
				</div>

				<div class="floor-footer">
					<div class="area-footer">
						<div class="btns">
							<button>확인</button>
							<button class="btn-cancel">닫기</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="pop-top pop-heatmap">
			<div class="floor-conts">
				<div class="area-conts">
					<div class="btns">
						<div class="set-form">
							<input type="radio" name="status-heatmap" id="heatmap-temp" checked>
							<label for="heatmap-temp">온도</label>
						</div>
						<div class="set-form">
							<input type="radio" name="status-heatmap" id="heatmap-hum">
							<label for="heatmap-hum">습도</label>
						</div>
						<div class="set-form">
							<input type="radio" name="status-heatmap" id="heatmap-particle">
							<label for="heatmap-particle">파티클</label>
						</div>
						<button class="btn-setting" id="callPop-heatmapSetting">설정</button>
					</div>

					<div class="legend-heatmap">
						<div class="range"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="pop-heatmapSetting">
			<div class="btn-close"></div>
			<div class="floor-title">
				<div class="area-title">
					<div class="title">히트맵 설정</div>
				</div>
				<div class="area-conts area-form">
					<div class="line-form">
						<div class="title">센서</div>
						<div class="group-form">
							<div class="set-form">
								<select name="" id="">
									<option value="">센서종류</option>
								</select>
							</div>
						</div>
					</div>
					<div class="line-form">
						<div class="title">상한</div>
						<div class="group-form">
							<div class="set-form">
								<input type="text" placeholder="상한 입력">
							</div>
						</div>
					</div>
					<div class="line-form">
						<div class="title">하한</div>
						<div class="group-form">
							<div class="set-form">
								<input type="text" placeholder="하한 입력">
							</div>
						</div>
					</div>
				</div>

				<div class="floor-footer">
					<div class="area-footer">
						<div class="btns">
							<button>확인</button>
							<button class="btn-cancel">닫기</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="pop-setting" id="pop-setting">
			<div class="btn-close"></div>
			<div class="floor-title">
				<div class="area-title">
					<div class="title">WEBGL 환경설정</div>
				</div>
				<div class="area-conts area-form">
					<div class="line-form">
						<div class="title">언어</div>
						<div class="group-form">
							<div class="set-form">
								<select name="dtdLanguage" id="dtdLanguage">
                                    <option value="Korean">한국어</option>
                                    <option value="English">영어</option>
                                    <option value="Chinese">중국어</option>
                                    <option value="Vietnamese">Vietnam</option>
                                </select>
							</div>
						</div>
					</div>

					<div class="line-form">
						<div class="title">FPS 설정</div>
						<div class="group-form">
							<div class="set-form">
                                <input type="radio" name="dtdShowFPS" id="dtdShowFPS-on" value="true" checked>
                                <label for="dtdShowFPS-on">ON</label>
                            </div>
                            <div class="set-form">
                                <input type="radio" name="dtdShowFPS" id="dtdShowFPS-off" value="false">
                                <label for="dtdShowFPS-off">OFF</label>
                            </div>
						</div>
					</div>
					
					<div class="line-form">
						<div class="title">검색 도구 사용</div>
						<div class="group-form">
							<div class="set-form">
                                <input type="radio" name="dtdSearchTool" id="dtdSearchTool-on" value="true" checked>
                                <label for="dtdSearchTool-on">ON</label>
                            </div>
                            <div class="set-form">
                                <input type="radio" name="dtdSearchTool" id="dtdSearchTool-off" value="false">
                                <label for="dtdSearchTool-off">OFF</label>
                            </div>
						</div>
					</div>
					
					<div class="line-form">
						<div class="title">백그라운드 실행</div>
						<div class="group-form">
							<div class="set-form">
                                <input type="radio" name="dtdRunInBackground" id="dtdRunInBackground-on" value="true" checked>
                                <label for="dtdRunInBackground-on">ON</label>
                            </div>
                            <div class="set-form">
                                <input type="radio" name="dtdRunInBackground" id="dtdRunInBackground-off" value="false">
                                <label for="dtdRunInBackground-off">OFF</label>
                            </div>
						</div>
					</div>
					
					<div class="line-form">
						<div class="title">홈버튼 동작전 모든 효과 리셋</div>
						<div class="group-form">
							<div class="set-form">
                                <input type="radio" name="dtdResetBeforeGoHome" id="dtdResetBeforeGoHome-on" value="true" checked>
                                <label for="dtdResetBeforeGoHome-on">ON</label>
                            </div>
                            <div class="set-form">
                                <input type="radio" name="dtdResetBeforeGoHome" id="dtdResetBeforeGoHome-off" value="false">
                                <label for="dtdResetBeforeGoHome-off">OFF</label>
                            </div>
						</div>
					</div>
					
					<div class="line-form">
						<div class="title">부재 선택시 인스펙터 창 자동 노출</div>
						<div class="group-form">
							<div class="set-form">
                                <input type="radio" name="dtdAutoShowInspectorPanel" id="dtdAutoShowInspectorPanel-on" value="true" checked>
                                <label for="dtdAutoShowInspectorPanel-on">ON</label>
                            </div>
                            <div class="set-form">
                                <input type="radio" name="dtdAutoShowInspectorPanel" id="dtdAutoShowInspectorPanel-off" value="false">
                                <label for="dtdAutoShowInspectorPanel-off">OFF</label>
                            </div>
						</div>
					</div>
					
					<div class="line-form">
						<div class="title">선택아웃라인</div>
						<div class="group-form">
							<div class="set-form">
                                <input type="radio" name="dtdUseBoxOutline" id="dtdUseBoxOutline-on" value="true" checked>
                                <label for="dtdUseBoxOutline-on">박스</label>
                            </div>
                            <div class="set-form">
                                <input type="radio" name="dtdUseBoxOutline" id="dtdUseBoxOutline-off" value="false">
                                <label for="dtdUseBoxOutline-off">설비형태</label>
                            </div>
						</div>
					</div>
					
					
					<div class="line-form">
						<div class="title">XRay효과</div>
						<div class="group-form">
							<div class="set-form">
								<input type="text" id="dtdXRayAlpha" placeholder="범위 : 0~1">
							</div>
						</div>
					</div>
				</div>

				<div class="floor-footer">
					<div class="area-footer">
						<div class="btns">
							<button onclick="fnWebglSettingChange()">확인</button>
							<button class="btn-cancel">닫기</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="wrap-page">
		<nav>
			<button class="btn-ctrl"></button>
			<div class="area-lnb">
				<ul class="list-lnb">
					<li>
						<button>3D 모델</button>
						<ul>
							<li>
								<button class="btn-view" onclick="fnDtdxFileOpen('tree')">보기</button>
								<div id="tree1" class="tree custom"></div>
							</li>
						</ul>
					</li>
					<li class="on">
						<button>
							대시보드
						</button>
						<span class="btn-setting" id="callPop-setting"></span>
						<ul>
							<li>
								<dl class="column-num vertical list">
									<dd>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnCameraMove" onclick="fnDtdCameraMove()"> - Camera 시점 변경</button>
											</div>
										</div>
										
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnCameraHomeSetting" onclick="fnDtdCameraHomeSetting()"> - Home Camera 좌표 변경</button>
											</div>
										</div>
										
										
										
										
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnVisible" onclick="fnDtdVisible()"> - 숨기기/보이기(벽, 지붕)</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnMaterialColor" onclick="fnDtdMaterialColor()"> - 색상 변경/초기화(숨김객체가 안나옴)</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnColor" onclick="fnDtdColor()"> - 색상 변경/초기화(숨김객체가 나옴)</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnFit" onclick="fnDtdFit()"> - 오토포커스</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnSelectAndFit" onclick="fnDtdSelectAndFit()"> - 오토포커스&선택</button>
											</div>
										</div>
										
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnSelectAndFit" onclick="fnResetEffect()"> - 모든 상태 초기화</button>
											</div>
										</div>
										
										
										
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnFind" onclick="fnDtdFind()"> - 검색</button>
											</div>
										</div>
										
										
										
										<!-- 속성 관련 기능 시작 -->
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnAttribute" onclick="fnDtdAttribute()"> - 속성창 ON/OFF</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnAttribute" onclick="fnDtdAttribute()"> - 속성추가/제거</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnGroupAttribute" onclick="fnDtdGroupAttribute()"> - 그룹속성추가/제거(다시 선택)</button>
											</div>
										</div>
										<!-- 속성 관련 기능 끝 -->
										
										<!-- 판넬 처리 기능 시작 -->
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnMeasure" onclick="fnDtdMeasure()"> - 치수재기 ON/OFF</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnBookmark" onclick="fnDtdBookmark()"> - 북마크 ON/OFF</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnMinimap" onclick="fnDtdMinimap()"> - 미니맵 ON/OFF</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnFilter" onclick="fnDtdFilter()"> - 필터뷰 ON/OFF</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnHierarchy" onclick="fnDtdHierarchy()"> - 속성뷰 ON/OFF</button>
											</div>
										</div>
										<!-- 판넬 처리 기능 끝 -->
										
										<!-- 히트맵 기능 시작 -->
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnDtdHitmap" onclick="fnDtdHitmap()"> - 히트맵 ON/OFF</button>
											</div>
										</div>
										<!-- 히트맵 기능 끝 -->
										
										<!-- 패스 트래킹 기능 시작 -->
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnDtdPathTracking" onclick="fnDtdPathTracking()"> - 패스 트래킹(수동)</button>
											</div>
										</div>
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnDtdPathTracking" onclick="fnDtdTrackingPath()"> - 패스 트래킹(자동)</button>
											</div>
										</div>
										<!-- 패스 트래킹 기능 끝 -->
										
										<!-- 스퀘어 실행 시작 -->
										<div class="line-info">
											<div class="btns">
												<button class="btn-default" id="btnDtdSquare" onclick="fnDtdSquare()"> - 스퀘어 실행</button>
											</div>
										</div>
										<!-- 스퀘어 실행 끝 -->
									</dd>
								</dl>
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
<script src="/js/custom-protocol-check.min.js"></script>
<script>
	/* DTD 관련 변수 시작 */
	var webGL;
	
	// WebGL 환경설정에 대한 변수. 환경 설정이 있는 경우 설정창에 값을 세팅하기 위하여 사용.
	var dtdLanguage = "Korean";	//다국어 설정. Korean : 한국어, English : 영어, Chinese : 중국어, Vietnamese : 베트남어
	var dtdShowFPS = true;	// FPS 설정. true : 사용, false : 미사용
	var dtdSearchTool = true;	// 검색 도구 사용 여부. true : 사용, false : 미사용 
	var dtdRunInBackground = true;		// 백그라운드 실행 허용 여부. 백그라운드 실행하면 메모리가 많이 사용됨. 실행 안하면 다른 창에 갔다오면 FPS가 떨어짐. true : 사용, false : 미사용
	var dtdResetBeforeGoHome = false;	// 홈버튼 동작전 모든 효과 리셋
	var dtdXRayAlpha = 0.3;		// XRay효과 투명도 : 0~1. 0에 가까울수록 형체가 안보임
	var dtdUseBoxOutline = false;       // 선택아웃라인을 박스형태로 사용. true : 사용(네모로 보임), false : 미사용(설비 형태대로 보임)
	var dtdAutoShowInspectorPanel = false;       // 부재 선택시 인스펙터 창 자동 노출. true : 사용, false : 미사용
	
	// WebGL 내부에서 사용하는 판넬, 기능 등의 반전 처리( ON <-> OFF)를 위한 상태값 저장 변수.
	// 버튼으로 활성화 처리가 가능하다면 css를 읽어서 반전 처리하면 됨.
	var dtdPanelFilter = false;	// 판넬 필터뷰 표시 상태 
	var dtdPanelAttrHierarchy = false;	// 판넬 속성뷰 표시 상태
	var dtdPanelMeasure = false;	// 판넬 치수재기 표시 상태
	var dtdPanelMinimap = false;	// 판넬 미니맵 표시 상태
	var dtdPanelBookmark = false;	// 판넬 북마크 표시 상태
	var dtdHideHitmap = false;	// 히트맵 상태
	var dtdPanelPathTracking = false;	// 패스 트래킹 상태
	
	/* DTD 관련 변수 끝 */
	
	var arrEesEqpId = new Array();
	var arrEesSubEqpId = new Array();
	var arrParamId = new Array();
	var arrSnsrId = new Array();
	var arrmdmEqpId = new Array();

</script>

<script>

	
	
	// Camera 시점 변경 : CameraMove(13.3097, 2.2593, -18.3508, 25, 315, 51.6514, 0.0)
	function fnDtdCameraMove()	{
		// FPS Pos, Rot, Distance 의 수치를 순서대로 입력
		webGL.CameraMove(13.3097, 2.2593, -18.3508, 25, 315, 51.6514, 0.0);
	}
	
	// Home Camera 좌표 변경 : CameraHomeSetting({ distance:168.4368, distanceMargin:0, rotate:{x:9.8128, y:6.3281, z:-5.2711}, delay:0 })
	function fnDtdCameraHomeSetting()	{
		/* GetCameraPos로 좌표를 가져오는 기능이 필요하나 현재 구동을 안함*/
		/*
		webGL.GetCameraPos(function (coordinate)	{
			alert(coordinate);
		});
		*/
		
		setting = { distance:168.4368, distanceMargin:0, rotate:{x:9.8128, y:6.3281, z:-5.2711}, delay:0 }; 
		
		webGL.CameraHomeSetting(setting);

	}
		
	/*
		*** 보이기 숨기기
		보이기 : SetVisible(key, value)
		숨기기 : SetInvisible(key, value)
	*/
	function fnDtdVisible()	{
		if($("#btnVisible").hasClass("on"))	{
			$("#btnVisible").removeClass("on");
			webGL.SetVisible("카테고리", "지붕");
			webGL.SetVisible("카테고리", "벽");
			webGL.SetVisible("EES_EQP_ID", "E221103");
		}
		else	{
			$("#btnVisible").addClass("on");
			webGL.SetInvisible("카테고리", "지붕");
			webGL.SetInvisible("카테고리", "벽");
			webGL.SetInvisible("EES_EQP_ID", "E221103");
		}
	}

	/*
		*** 색상 변경/초기화(숨김객체가 나옴)
		색상변경 : SetEQPStatusMaterialColor(key, value, colorData)
		색상초기화 : ResetEQPStatusMaterialColor(key, value)
	*/
	function fnDtdMaterialColor()	{
		if($("#btnMaterialColor").hasClass("on"))	{
			$("#btnMaterialColor").removeClass("on");
			webGL.ResetEQPStatusMaterialColor("카테고리", "Electrical Fixtures");
		}
		else	{
			$("#btnMaterialColor").addClass("on");
			webGL.SetEQPStatusMaterialColor("카테고리", "Electrical Fixtures", fnDTDColorSetNew('ff', 'ff', '00'));
		}
	}
	/*
	*** 색상 변경/초기화(숨김객체가 나옴)
		색상변경 : SetColor(key, value, colorData)
		색상초기화 : ResetColor(key, value)
	*/
	// 색상 변경/초기화
	function fnDtdColor()	{
		if($("#btnColor").hasClass("on"))	{
			$("#btnColor").removeClass("on");
			webGL.ResetColor("카테고리", "Electrical Fixtures");
		}
		else	{
			$("#btnColor").addClass("on");
			webGL.SetColor("카테고리", "Electrical Fixtures", fnDTDColorSetOld(0, 255, 0));
		}
	}
	

	// 오토포커스 : Fit(key, value)
	function fnDtdFit()	{
		webGL.Fit("id", "378920");
	}
	
	// 오토포커스&선택(OnSelected 이벤트가 발생 함.) : SelectAndFit(key, value)
	function fnDtdSelectAndFit()	{
		webGL.SelectAndFit("id", "378920");
	}
	
	
	// 모든 상태 초기화 : ResetEffect('', '')
	function fnResetEffect()	{
		webGL.ResetEffect('', '');
	}
	
	// 검색(검색창이 열림) : Find("id", "378920")
	function fnDtdFind()	{
		webGL.Find("id", "378920");
	}
	
	/*
	*** 속성추가/제거, 그룹속성 추가/제거. ***
	사용함수 : 속성추가1 : AddAttribute("id", "380084", "그룹", [{key:"키1", value:"값1"}, {key:"키2",value:"값2"}])
			속성추가2 : AddAttribute("id", "380084", [{group:"그룹1", key:"키1", value:"값1"}, {group:"그룹2", key:"키2",value:"값2"}])
			속성추가3 : AddAttribute("EES_EQP_ID", "", "<b><color=#FFFF00>[EES_INFO]", [{key:"키1", value:"값1"}, {key:"키2",value:"값2"}]);
			
			속성제거1 : 특정한 값만 지우는 경우
				RemoveAttribute("id", "380084", "그룹", [{key:"키1"}, {key:"키2"} ])
			속성제거2 : 해당 설비의 속성 중 그룹을 일괄 삭제
				RemoveAttribute("id", "380084", "그룹")
			
			** 속성제거3 : 그룹 단위로 속성을 제거하는 경우(대량 처리 시 가장 빠름)
				let json = [{filterGroup: "Text"},{filterGroup: "문자"}];
				RemoveGroupAttributes(JSON.stringify(json))
	*/
	// 속성추가 버튼
	var groupName = "<color=#FFFF00>추가속성";
	function fnDtdAttribute()	{
		if($("#btnAttribute").hasClass("on"))	{
			$("#btnAttribute").removeClass("on");
			webGL.RemoveAttribute("id", "378920", groupName);	// 개별속성제거
		}
		else	{
			$("#btnAttribute").addClass("on");
			webGL.AddAttribute("id", "378920", groupName, [{key:"키1", value:"값1"}, {key:"키2",value:"값2"}]);
			
			// 아래는 추가된 속성을 확인하기 위한 부가 기능. 속성추가와는 별개.
			webGL.SelectAndFit("id", "378920");
			webGL.HidePanel("PanelInspector");
			webGL.ShowAttribute('id', "378920");
		}
	}
	
	// 그룹속성추가 버튼
	function fnDtdGroupAttribute()	{
		if($("#btnGroupAttribute").hasClass("on"))	{
			$("#btnGroupAttribute").removeClass("on");

			let json = [{filterGroup: groupName}];
			webGL.RemoveGroupAttributes(JSON.stringify(json));	// 전체에 대해 그룹을 일괄 삭제
		}
		else	{
			$("#btnGroupAttribute").addClass("on");
			webGL.AddAttribute("EES_EQP_ID", "", groupName, [{key:"키1", value:"값1"}, {key:"키2",value:"값2"}]);
		}
	}

	/*
	치수재기
	사용함수 : ShowPanel('PanelMeasure', { title:'Measure', minWidth:250, minHeight:250, direction:'right', dockType:'addtab' })
			HidePanel('PanelMeasure')
	*/
	// 치수재기 버튼
	function fnDtdMeasure()	{
		if(dtdPanelMeasure)	{
			fnDtdMeasureOff(true);
		}
		else	{
			fnDtdMeasureOn();
		}
	}
	
	// 치수재기 판넬 ON 처리
	function fnDtdMeasureOn()	{
		$("#btnMeasure").addClass("on");
		dtdPanelMeasure = true;
		webGL.ShowPanel('PanelMeasure', { title:'Measure', minWidth:250, minHeight:250, direction:'right', dockType:'addtab' });
	}
	
	// 치수재기 판넬 OFF 처리
	function fnDtdMeasureOff(actionType)	{
		$("#btnMeasure").removeClass("on");
		dtdPanelMeasure = false;
		if(actionType)	{
			webGL.HidePanel('PanelMeasure');
		}
	}
	
	
	/*
	북마크
	북마크 판넬 ON : ShowPanel('PanelBookmark', { title:'Bookmark', minWidth:250, minHeight:250, direction:'right', dockType:'addtab' });
	북마크 판넬 OFF : HidePanel('PanelBookmark')
	북마크 Load : BookmarkLoad(dataArray)
	북마크 저장 이벤트 : webGL.OnBookmarkSave(function(seqID, title, base64) {})
	*/
	// 북마크 버튼
	function fnDtdBookmark()	{
		fnDtdBookmarkLoad();

		if(dtdPanelBookmark)	{
			fnDtdBookmarkOff(true);
		}
		else	{
			fnDtdBookmarkOn();
		}
	}
	
	// 북마크 판넬 ON 처리
	function fnDtdBookmarkOn()	{
		
		$("#btnBookmark").addClass("on");
		dtdPanelBookmark = true;
		webGL.ShowPanel('PanelBookmark', { title:'Bookmark', minWidth:250, minHeight:250, direction:'right', dockType:'addtab' });
	}
	
	// 북마크 판넬 OFF 처리
	function fnDtdBookmarkOff(actionType)	{
		$("#btnBookmark").removeClass("on");
		dtdPanelBookmark = false;
		if(actionType)	{
			webGL.HidePanel('PanelBookmark');
		}
	}
	
	// 북마크 Load 데이터 처리
	function fnDtdBookmarkLoad()	{
		var dataArray = [{
		      "scenarioSeqNo":3,
		      "pjtCd":"001",
		      "scenarioTitle":"이안~",
		      "scenarioContents":"eyJzZXFJRCI6MywidGl0bGUiOiLsnbTslYh+IiwiYm9va21hcmtMaXN0Ijp7ImRhdGEiOlt7InBvc2l0aW9uTW92ZSI6eyJ4Ijo3LjUxNTUzNzI2MTk2Mjg5MSwieSI6OS45MDAwMDA1NzIyMDQ1OSwieiI6MTUuOTk2MjczMDQwNzcxNDg0fSwicm90YXRpb24iOnsieCI6MC4xOTk5NjQxMzU4ODUyMzg2NSwieSI6LTAuMzczNjEyMzQ0MjY0OTg0MTMsInoiOjAuMDgyODI3ODY2MDc3NDIzMSwidyI6MC45MDE5Nzk5MjMyNDgyOTF9LCJwb3NpdGlvbmNhbWVyYSI6eyJ4IjotNi4wMjM5NjM5MjgyMjI2NTYsInkiOi05LjI4NDA0MjM1ODM5ODQzOCwieiI6LTE3Ni45MTkzNDIwNDEwMTU2Mn0sInBvc2l0aW9uQ2FtZXJhV29ybGQiOnsieCI6MTE5LjQxMDI2MzA2MTUyMzQ0LCJ5Ijo3Ni4yNTUxNDk4NDEzMDg2LCJ6IjotMTA0LjQxNzYwMjUzOTA2MjV9fSx7InBvc2l0aW9uTW92ZSI6eyJ4IjoyMy42ODM5NTQyMzg4OTE2LCJ5Ijo1LjE1MDAwMDA5NTM2NzQzMiwieiI6Ni45ODcyOTQ2NzM5MTk2Nzh9LCJyb3RhdGlvbiI6eyJ4IjowLjE5OTk2NDEzNTg4NTIzODY1LCJ5IjotMC4zNzM2MTIzNDQyNjQ5ODQxMywieiI6MC4wODI4Mjc4NjYwNzc0MjMxLCJ3IjowLjkwMTk3OTkyMzI0ODI5MX0sInBvc2l0aW9uY2FtZXJhIjp7IngiOi0zLjYzMjQ2MzQ1NTIwMDE5NTMsInkiOjAuODMzOTgzNDIxMzI1NjgzNiwieiI6LTUzLjM0MzM2ODUzMDI3MzQ0fSwicG9zaXRpb25DYW1lcmFXb3JsZCI6eyJ4Ijo1NS4wNTE2MjgxMTI3OTI5NywieSI6MjguNDQ5NzI4MDEyMDg0OTYsInoiOi0yOS41MTc0NTQxNDczMzg4Njd9fSx7InBvc2l0aW9uTW92ZSI6eyJ4IjozOS44ODYyNDE5MTI4NDE4LCJ5Ijo1Ljg5MTAxODg2NzQ5MjY3NiwieiI6MjAuNzI4OTE2MTY4MjEyODl9LCJyb3RhdGlvbiI6eyJ4IjowLjE5OTk2NDEzNTg4NTIzODY1LCJ5IjotMC4zNzM2MTIzNDQyNjQ5ODQxMywieiI6MC4wODI4Mjc4NjYwNzc0MjMxLCJ3IjowLjkwMTk3OTkyMzI0ODI5MX0sInBvc2l0aW9uY2FtZXJhIjp7IngiOjYuMDAyNjg5MzYxNTcyMjY2LCJ5IjotNS42Mjk2OTc3OTk2ODI2MTcsInoiOi01MS40NTMzMjcxNzg5NTUwOH0sInBvc2l0aW9uQ2FtZXJhV29ybGQiOnsieCI6NzguNzg3MzM4MjU2ODM1OTQsInkiOjIyLjUzMzg5NzM5OTkwMjM0NCwieiI6LTkuNjgzMDkwMjA5OTYwOTM4fX0seyJwb3NpdGlvbk1vdmUiOnsieCI6NDEuMTIxNTY2NzcyNDYwOTQsInkiOjUuMzY0MTExNDIzNDkyNDMyLCJ6IjoyMi40NDAxOTg4OTgzMTU0M30sInJvdGF0aW9uIjp7IngiOjAuMTk5OTY0MTM1ODg1MjM4NjUsInkiOi0wLjM3MzYxMjM0NDI2NDk4NDEzLCJ6IjowLjA4MjgyNzg2NjA3NzQyMzEsInciOjAuOTAxOTc5OTIzMjQ4MjkxfSwicG9zaXRpb25jYW1lcmEiOnsieCI6MS4yOTY0NDM5MzkyMDg5ODQ0LCJ5IjotMS42NTc3NjE4MTIyMTAwODMsInoiOi0xNy4wNTU2MDg3NDkzODk2NX0sInBvc2l0aW9uQ2FtZXJhV29ybGQiOnsieCI6NTMuNDYzODg2MjYwOTg2MzMsInkiOjExLjA2OTY4MTE2NzYwMjUzOSwieiI6MTEuOTMxMzI5NzI3MTcyODUyfX1dfX0=",
		      "hierarchyIds":"0000000001,0000000002",
		      "useYn":"Y",
		      "createUserId":"safddsf",
		      "createDate":"2023-10-13 09:06:16",
		      "updateUserId":"safddsf",
		      "updateDate":"2023-10-13 09:06:51"
		   }, {
		      "scenarioSeqNo":4,
		      "pjtCd":"001",
		      "scenarioTitle":"새로입력",
		      "scenarioContents":"eyJzZXFJRCI6MywidGl0bGUiOiLsnbTslYh+IiwiYm9va21hcmtMaXN0Ijp7ImRhdGEiOlt7InBvc2l0aW9uTW92ZSI6eyJ4Ijo3LjUxNTUzNzI2MTk2Mjg5MSwieSI6OS45MDAwMDA1NzIyMDQ1OSwieiI6MTUuOTk2MjczMDQwNzcxNDg0fSwicm90YXRpb24iOnsieCI6MC4xOTk5NjQxMzU4ODUyMzg2NSwieSI6LTAuMzczNjEyMzQ0MjY0OTg0MTMsInoiOjAuMDgyODI3ODY2MDc3NDIzMSwidyI6MC45MDE5Nzk5MjMyNDgyOTF9LCJwb3NpdGlvbmNhbWVyYSI6eyJ4IjotNi4wMjM5NjM5MjgyMjI2NTYsInkiOi05LjI4NDA0MjM1ODM5ODQzOCwieiI6LTE3Ni45MTkzNDIwNDEwMTU2Mn0sInBvc2l0aW9uQ2FtZXJhV29ybGQiOnsieCI6MTE5LjQxMDI2MzA2MTUyMzQ0LCJ5Ijo3Ni4yNTUxNDk4NDEzMDg2LCJ6IjotMTA0LjQxNzYwMjUzOTA2MjV9fSx7InBvc2l0aW9uTW92ZSI6eyJ4IjoyMy42ODM5NTQyMzg4OTE2LCJ5Ijo1LjE1MDAwMDA5NTM2NzQzMiwieiI6Ni45ODcyOTQ2NzM5MTk2Nzh9LCJyb3RhdGlvbiI6eyJ4IjowLjE5OTk2NDEzNTg4NTIzODY1LCJ5IjotMC4zNzM2MTIzNDQyNjQ5ODQxMywieiI6MC4wODI4Mjc4NjYwNzc0MjMxLCJ3IjowLjkwMTk3OTkyMzI0ODI5MX0sInBvc2l0aW9uY2FtZXJhIjp7IngiOi0zLjYzMjQ2MzQ1NTIwMDE5NTMsInkiOjAuODMzOTgzNDIxMzI1NjgzNiwieiI6LTUzLjM0MzM2ODUzMDI3MzQ0fSwicG9zaXRpb25DYW1lcmFXb3JsZCI6eyJ4Ijo1NS4wNTE2MjgxMTI3OTI5NywieSI6MjguNDQ5NzI4MDEyMDg0OTYsInoiOi0yOS41MTc0NTQxNDczMzg4Njd9fSx7InBvc2l0aW9uTW92ZSI6eyJ4IjozOS44ODYyNDE5MTI4NDE4LCJ5Ijo1Ljg5MTAxODg2NzQ5MjY3NiwieiI6MjAuNzI4OTE2MTY4MjEyODl9LCJyb3RhdGlvbiI6eyJ4IjowLjE5OTk2NDEzNTg4NTIzODY1LCJ5IjotMC4zNzM2MTIzNDQyNjQ5ODQxMywieiI6MC4wODI4Mjc4NjYwNzc0MjMxLCJ3IjowLjkwMTk3OTkyMzI0ODI5MX0sInBvc2l0aW9uY2FtZXJhIjp7IngiOjYuMDAyNjg5MzYxNTcyMjY2LCJ5IjotNS42Mjk2OTc3OTk2ODI2MTcsInoiOi01MS40NTMzMjcxNzg5NTUwOH0sInBvc2l0aW9uQ2FtZXJhV29ybGQiOnsieCI6NzguNzg3MzM4MjU2ODM1OTQsInkiOjIyLjUzMzg5NzM5OTkwMjM0NCwieiI6LTkuNjgzMDkwMjA5OTYwOTM4fX0seyJwb3NpdGlvbk1vdmUiOnsieCI6NDEuMTIxNTY2NzcyNDYwOTQsInkiOjUuMzY0MTExNDIzNDkyNDMyLCJ6IjoyMi40NDAxOTg4OTgzMTU0M30sInJvdGF0aW9uIjp7IngiOjAuMTk5OTY0MTM1ODg1MjM4NjUsInkiOi0wLjM3MzYxMjM0NDI2NDk4NDEzLCJ6IjowLjA4MjgyNzg2NjA3NzQyMzEsInciOjAuOTAxOTc5OTIzMjQ4MjkxfSwicG9zaXRpb25jYW1lcmEiOnsieCI6MS4yOTY0NDM5MzkyMDg5ODQ0LCJ5IjotMS42NTc3NjE4MTIyMTAwODMsInoiOi0xNy4wNTU2MDg3NDkzODk2NX0sInBvc2l0aW9uQ2FtZXJhV29ybGQiOnsieCI6NTMuNDYzODg2MjYwOTg2MzMsInkiOjExLjA2OTY4MTE2NzYwMjUzOSwieiI6MTEuOTMxMzI5NzI3MTcyODUyfX1dfX0=",
		      "hierarchyIds":"0000000001,0000000002",
		      "useYn":"Y",
		      "createUserId":"safddsf",
		      "createDate":"2023-10-13 09:06:16",
		      "updateUserId":"safddsf",
		      "updateDate":"2023-10-13 09:06:51"
		   }];
		webGL.BookmarkLoad(dataArray);
	}
	// 북마크 저장 처리
	function fnDtdBookmarkSave(seqID, title, base64)	{
		
		alert("AJAX 저장처리");
	}

	/*
	미니맵
	미니맵 판넬 ON : ShowPanel('PanelMinimap', { title:'Minimap', minWidth:350, minHeight:250, direction:'none', dockType:'inside' });
	미니맵 판넬 OFF : HidePanel('PanelMinimap')
	*/
	// 미니맵 버튼
	function fnDtdMinimap()	{
		if(dtdPanelMinimap)	{
			fnDtdMinimapOff(true);
		}
		else	{
			fnDtdMinimapOn();
		}
	}
	
	// 미니맵 판넬 ON 처리
	function fnDtdMinimapOn()	{
		$("#btnMinimap").addClass("on");
		dtdPanelMinimap = true;
		webGL.ShowPanel('PanelMinimap', { title:'Minimap', minWidth:350, minHeight:250, direction:'none', dockType:'inside' });
	}
	
	// 미니맵 판넬 OFF 처리
	function fnDtdMinimapOff(actionType)	{
		$("#btnMinimap").removeClass("on");
		dtdPanelMinimap = false;
		if(actionType)	{
			webGL.HidePanel('PanelMinimap');
		}
	}
	
	/*
	필터뷰
	필터뷰 판넬 ON : ShowPanel('PanelFilter', { title:'Filter', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리|카테고리,패밀리|패밀리 이름' });
	필터뷰 판넬 OFF : HidePanel('PanelFilter')
	*/
	// 필터뷰 버튼
	function fnDtdFilter()	{
		if(dtdPanelFilter)	{
			fnDtdFilterOff(true);
		}
		else	{
			fnDtdFilterOn();
		}
	}
	
	// 필터뷰 판넬 ON 처리
	function fnDtdFilterOn()	{
		$("#btnFilter").addClass("on");
		dtdPanelFilter = true;
		webGL.ShowPanel('PanelFilter', { title:'Filter', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리|카테고리,패밀리|패밀리 이름' });
	}
	
	// 필터뷰 판넬 OFF 처리
	function fnDtdFilterOff(actionType)	{
		$("#btnFilter").removeClass("on");
		dtdPanelFilter = false;
		if(actionType)	{
			webGL.HidePanel('PanelFilter');
		}
	}
	
	/*
	속성뷰
	속성뷰 판넬 ON : ShowPanel('PanelAttrHierarchy', { title:'Hierarchy', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
	속성뷰 판넬 OFF : HidePanel('PanelAttrHierarchy')
	*/
	// 속성뷰 버튼
	function fnDtdHierarchy()	{
		if(dtdPanelAttrHierarchy)	{
			fnDtdHierarchyOff(true);
		}
		else	{
			fnDtdHierarchyOn();
		}
	}
	
	// 속성뷰 판넬 ON 처리
	function fnDtdHierarchyOn()	{
		$("#btnHierarchy").addClass("on");
		dtdPanelAttrHierarchy = true;
		webGL.ShowPanel('PanelAttrHierarchy', { title:'Hierarchy', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
	}
	
	// 속성뷰 판넬 OFF 처리
	function fnDtdHierarchyOff(actionType)	{
		$("#btnHierarchy").removeClass("on");
		dtdPanelAttrHierarchy = false;
		if(actionType)	{
			webGL.HidePanel('PanelAttrHierarchy');
		}
	}
	
	/*
	속성뷰 판넬 ON : ShowPanel('PanelAttrHierarchy', { title:'Hierarchy', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
	속성뷰 판넬 OFF : HidePanel('PanelAttrHierarchy')
	*/
	// 속성뷰 버튼
	function fnDtdHierarchy()	{
		if(dtdPanelAttrHierarchy)	{
			fnDtdHierarchyOff(true);
		}
		else	{
			fnDtdHierarchyOn();
		}
	}
	
	// 속성뷰 판넬 ON 처리
	function fnDtdHierarchyOn()	{
		$("#btnHierarchy").addClass("on");
		dtdPanelAttrHierarchy = true;
		webGL.ShowPanel('PanelAttrHierarchy', { title:'Hierarchy', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
	}
	
	// 속성뷰 판넬 OFF 처리
	function fnDtdHierarchyOff(actionType)	{
		$("#btnHierarchy").removeClass("on");
		dtdPanelAttrHierarchy = false;
		if(actionType)	{
			webGL.HidePanel('PanelAttrHierarchy');
		}
	}
	
	/*
	히트맵 : ShowHitmap(hitmapData, hitmapAttr)
		let hitmapAttr = {TYPE:"T", ALPHA:1.0};
		let hitmapData = [
		    {SNSR_ID:"1", MEASM_RESULT_VALUE:100, MIN:0, MAX:1000, RADIUS:10, Y_OFFSET:0}
		];
	*/
	function fnDtdHitmap()	{
		alert("매칭되는 센서가 없습니다");
		/*
		if (dtdHideHitmap)	{
			webGL.HideHitmap();
			dtdHideHitmap = false;
		}
		else	{
			// SNSR_ID의 값이 일치하는 부재를 찾아 히트맵을 적용합니다.
			let hitmapData = [
			    {SNSR_ID:"1", MEASM_RESULT_VALUE:100, MIN:0, MAX:1000, RADIUS:10, Y_OFFSET:0}
			];

			// TYPE는 센서 타입으로 'T'이면 온도, 'H'이면 습도, 'P'이면 파티클입니다.(실제 온도와 습도는 같은 컬러 테이블을 사용합니다.)
			// ALPHA는 알파값입니다. 기본은 1.0으로 숫자가 작을수록 투명해집니다.
			let hitmapAttr = {TYPE:"T", ALPHA:1.0};

			// 히트맵 보기를 호출합니다. 위 2개의 데이터를 인자로 전달합니다.
			webGL.ShowHitmap(hitmapData, hitmapAttr);
			
			dtdHideHitmap = true;
		}
		*/
	}
			
	/*
	패스 트래킹(수동) 판넬 ON : ShowPanel('PanelPathTracking', { title:'PathTracking', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
	패스 트래킹(수동) 판넬 OFF : HidePanel('PanelAttrPathTracking')
	*/
	// 패스 트래킹 버튼
	function fnDtdPathTracking()	{
		if(dtdPanelPathTracking)	{
			fnDtdPathTrackingOff(true);
		}
		else	{
			fnDtdPathTrackingOn();
		}
	}

	// 패스 트래킹 판넬 ON 처리
	function fnDtdPathTrackingOn()	{
		$("#btnPathTracking").addClass("on");
		dtdPanelPathTracking = true;
		webGL.ShowPanel('PanelPathTracking');
	}
	
	// 패스 트래킹 판넬 OFF 처리
	function fnDtdPathTrackingOff(actionType)	{
		$("#btnPathTracking").removeClass("on");
		dtdPanelPathTracking = false;
		if(actionType)	{
			webGL.HidePanel('PanelPathTracking');
		}
	}
	
	/*
	패스 트래킹(자동) 판넬 ON : ShowPanel('PanelPathTracking', { title:'PathTracking', minWidth:250, minHeight:250, direction:'right', dockType:'addtab', filter:'카테고리$|패밀리 이름|패밀리 유형|Category$|Family Name|Family Type|[A-Z,a-z,0-9]+_[A-Z,a-z,0-9,_]+' });
	패스 트래킹(자동) 판넬 OFF : HidePanel('PanelAttrPathTracking')
	패스 트래킹 정지 : StopTrackingPath()
	*/
	// 패스 트래킹 버튼
	function fnDtdTrackingPath()	{
		if(dtdPanelPathTracking)	{
			fnDtdTrackingPathOff(true);
		}
		else	{
			fnDtdTrackingPathOn();
		}
	}

	// 패스 트래킹 판넬 ON 처리
	function fnDtdTrackingPathOn()	{
		$("#btnTrackingPath").addClass("on");
		dtdPanelPathTracking = true;
		
		// 패스트래킹 자동 분기를 위한 Pass Element 추가
		// 지정 키,값으로 부재를 검색한뒤 패스트래킹중 해당 부재를 경유하도록 처리
		var key, value;
		for(var i = 1; i <= 10; i++)	{
			key = "key_" + i;
			value = "value_" + i;
			webGL.AddTrackingPath_PassElement(key, "#(?<=^|,)" + value + "(?=$|,)");
		}

		let trackingData = {
			startKey:startKey,
			startValue:startValue,
			endKey:endKey,
			endValue:endValue,
			speed:-1,
			distance:-1,
			showColor:false,
			followCamera:true
		};

		webGL.TrackingPath(trackingData);
	}
	
	// 패스 트래킹 판넬 OFF 처리
	function fnDtdTrackingPathOff(actionType)	{
		$("#btnTrackingPath").removeClass("on");
		dtdPanelPathTracking = false;
		if(actionType)	{
			webGL.StopTrackingPath();
		}
	}
	
	// 패스 트래킹 정지
	function fnDtdTrackingPath()	{
		webGL.StopTrackingPath();
	}
	
	// 패스트래킹 진행
	// startKey, startValue : 시작 지점 부재의 검색 정보
	// endKey, endValue : 종료 지점 부재의 검색 정보
	function StartPathTracking(startKey, startValue, endKey, endValue)	{

	}
	
	// DTDSquare가 설치된 경우 DTDSquare 실행. 없으면 install.exe 다운로드 받아서 설치
	// /js/custom-protocol-check.min.js 스크립트가 같이 있어야 함.
	function fnDtdSquare() {
	    window.customProtocolCheck(
	        'dtdsquare://',
	        () => {
	            // 프로토콜이 존재하지 않을 경우
	           // console.log('DTDSquare가 설치되어 있지 않습니다.');
	            download('http://localhost:8080/DTDSquare.exe', 'install.exe'); // 설치 파일 다운로드
	        },
	        () => {
	            // 프로토콜이 존재할 경우
	            //console.log('DTDSquare가 실행됩니다.');
	        },
	        5000 // (Timeout Default 2000)
	    );
	}
	
	function download(uri, fileName) {
        var link = document.createElement("a");
        link.download = fileName;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        delete link;
    }

	// 모델에서 특정 key, value가 있는 대상 List : GetElementListParameter("EES_EQP_ID", "", function(list) {});
	function fnDtdElementFind()	{
		// 모델에서 찾는 대상(EES_EQP_ID, SNSR_ID, MDM_EQP_ID 등)의 목록을 검색
		webGL.GetElementListParameter("EES_EQP_ID", "", function(list) {
			for(var i=0; i<list.length; i++)	{
				if(list[i].EES_EQP_ID != "" && list[i].EES_EQP_ID != null && arrEesEqpId.indexOf(list[i].EES_EQP_ID) < 0)	{
					arrEesEqpId.push(list[i].EES_EQP_ID);
				}
				
				if(list[i].EES_SUB_EQP_ID != "" && list[i].EES_SUB_EQP_ID != null && arrEesSubEqpId.indexOf(list[i].EES_SUB_EQP_ID) < 0)	{
					arrEesSubEqpId.push(list[i].EES_SUB_EQP_ID);
				}
				
				if(list[i].PARAM_ID != "" && list[i].PARAM_ID != null && arrParamId.indexOf(list[i].PARAM_ID) < 0)	{
					arrParamId.push(list[i].PARAM_ID);
				}
			}
		});
		
		webGL.GetElementListParameter("SNSR_ID", "", function(list) {
			for(var i=0; i<list.length; i++)	{
				if(list[i].SNSR_ID != "" && list[i].SNSR_ID != null && arrSnsrId.indexOf(list[i].SNSR_ID) < 0)	{
					arrSnsrId.push(list[i].SNSR_ID);
				}
			}
		});
		
		webGL.GetElementListParameter("MDM_EQP_ID", "", function(list) {
			for(var i=0; i<list.length; i++)	{
				if(list[i].MDM_EQP_ID != "" && list[i].MDM_EQP_ID != null && arrmdmEqpId.indexOf(list[i].MDM_EQP_ID) < 0)	{
					arrmdmEqpId.push(list[i].MDM_EQP_ID);
				}
			}
		});
	}
</script>

<script>
	
	// Canvas의 포커스가 있을때 키보드 캡춰 기능 허용
	// Canvas 내부에 input이 있으면 키보드 캡춰불가(InputField입력중으로 이떄는 IME문제로 사용하지 않음)
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
	
	/*
	DTDWeb엔진 초기화 콜백  : OnInit(function() { })
	DTD 환경 설정(세부 옵션은 하단 함수 참고) : Setting(json)
	dtdx파일 로드 완료 콜백 : OnContentsAllLoaded(function() {})
	특정 부재 선택 콜백 : OnSelected(function(list, position, params) {})
		
	부재 더블클릭 콜백 : OnDoubleClick(function(list, position, params) {
	패널 Show 콜백 : OnShowPanel((function(panelName) {})
	패널 OnHidePanel 콜백 : OnShowPanel((function(panelName) {})
	북마크 저장 요청 콜백 : OnBookmarkSave(function(seqID, title, base64) {})
	부재 마우스 오버 콜백 : OnHover(function(position, params) {})
	속성창 클릭 콜백 : OnClickParameter(function(data) {})
	
	** 컨텍스트 메뉴
	선택된 부재의 컨텍스트 메뉴(WebGL에서 우클릭 시 자동 동작) : SetContextMenu(contextMenuStr, OnSelectedContextMenu)
	contextMenuStr : 메뉴 구성. OnSelectedContextMenu : 선택한 메뉴의 동작 처리 함수
	컨텍스트 메뉴 Show : ShowContextMenu()
	선택된 부재의 정보 콜백 : GetElementParameter(lastID, function (id, parameter) {})
	선택 : Select(key, value)
	연결요소 전체 선택 : SelectNeighbours(key, value)
	하이라이트 적용 : ToggleHighlight(key, value)
	선택항목 제외하고 전체 하이라이트 : HighlightOthers(key, value)

	** 삼성전기 특화
	차트 데이터 세팅 : SetChartData(json)
	차트 데이터 요청 콜백 : OnShowChart(function (eesEqpId, eesSubEqpId, paramId) {})
	차트에서 특정 동작 요청 콜백 : OnClickChartButton(function (eesEqpId, eesSubEqpId, paramId) {})

	바로 확인 모드 팝업창 : PlayAlarmView('FDC', eesEqpId, eesSubEqpId, paramId, alarmLevel, targetName, paramName);
	단계별 확인 모드 팝업창 : PlayAlarmStepView('FDC', stepAlarmJson)
	팝업 확인 모드 팝업창 : PlayAlarmPopupView(alarmType, eesEqpId, json)
	팝업 확인 모드 팝업창에서 특정 부재 선택 : PlayAlarmPopupViewTarget(key, value)
	팝업 확인 모드 팝업창 ON 콜백 : OnShowAlarmPopup(function () {})
	팝업 확인 모드 팝업창 OFF 콜백 : OnHideAlarmPopup(function () {})
	
	말풍선과는 다른 Text 표시 : ShowLOTCount(Json)
	말풍선과는 다른 Text 변경(기존 데이터와 비교하여 동작) : UpdateLOTCount(Json)
	말풍선과는 다른 Text 숨기기 : HideLOTCount()
	
	알람별 아이콘 표시 : ShowAlarmIcon(Json)
	알람별 아이콘 숨기기 : HideAlarmIcon()
	
	알람 메시지 표시 : ShowAlarmText(eesEqpId, eesSubEqpId, paramId, alarmLevel, paramName)
	알람 메시지 숨기기 : HideAlarmText()
	*/
	// WebGL이 정상적으로 웹에 적용 되면 실행. 
	function OnLoadDTDPlayer(player) {
		if (undefined == player.dtd)
			return;
		webGL = player.dtd;	// 전역으로 선언한 webGL에 player.dtd를 입력

		// DTDWeb엔진이 초기화 되면 호출되는 콜백입니다.
		webGL.OnInit(function () {

			// 설정을 셋팅합니다. (로그, FPS 출력, 조명 강도, 콘텍스트 메뉴 스타일, 키보드입력캡춰, 클릭 이벤트 Delay, 배경생상)
			// 메뉴스타일은 classic, circleA, circleB 중 하나를 선택할 수 있습니다.
			webGL.Setting({
				Language: dtdLanguage,         // 사용 언어
				EnableLog: false,           // 로그  표시
				ShowFPS: dtdShowFPS,             // FPS표시 
				LightIntensity: 1.0,		// 조명 강도
				ContextMenuType: "classic",	// 콘텍스트 메뉴 스타일
				CaptureKeyboardInput: false,	// 키보드 입력 캡춰
				DelayLazyClickEvent: 0.3,	// 더블클릭 인식 Delay
				DblClickCameraFit: true,	// 더블 클릭시 카메라 핏 줌인
				SearchTool: dtdSearchTool,			// 검색 도구 사용 여부
				NavigateTool: "view,walk,home,help",	// 네비게이션 도구 사용 여부
				GizmoTool: true,			// 카메라 기즈모 도구 사용 여부
				background: "#3C3C3C",		// 배경 색상
				RunInBackground: dtdRunInBackground,		// 백그라운드 실행 허용 여부
				ResetBeforeGoHome: dtdResetBeforeGoHome,	// 홈버튼 동작전 모든 효과 리셋
				UsePBRShader: false,		// PBR쉐이더 사용 여부
				UseGridPlain: true,         // 바닥 그리드 표시 여부
				XRayAlpha: dtdXRayAlpha,            // XRay효과 투명도
				UseBoxOutline: dtdUseBoxOutline,       // 선택아웃라인을 박스형태로 사용
				AutoShowInspectorPanel: dtdAutoShowInspectorPanel   // 부재 선택시 인스펙터 창 자동 노출
			});
			
			fnDtdxFileOpen('fix');

		}); // OnInit

		// dtdx파일 로드가 완료되면 호출되는 콜백입니다.
		webGL.OnContentsAllLoaded(function () {
			fnDtdElementFind();
			
			// 3D에서 특정 부재가 선택되면 호출됩니다.
			// list : 선택된 부재 목록
			// position : 선택 위치 좌표
			// params : 선택 부재의 속성정보
			webGL.OnSelected(function (list, position, params) {

				var contextMenuStr = "[context_refresh:#26a6d1]모든 상태 초기화";

				if (0 < list.length) {
					contextMenuStr =
						"[context_category_select:#26a6d1]동일 카테고리 전체 선택," +
						"[context_connet_select:#26a6d1]연결요소 전체 선택,-," +
						"[context_lighlight:#efc75e]Highlight|[적용:#efc75e]하이라이트 적용|[반전 적용:#efc75e]선택항목 제외하고 전체 하이라이트|[카테고리 적용:#efc75e]동일 카테고리 전체 하이라이트," +
						"[context_xray:#efc75e]X-Ray|[적용:#efc75e]X-Ray 적용|[반전 적용:#efc75e]선택항목 제외하고 전체 X-Ray|[카테고리 적용:#efc75e]동일 카테고리 전체 X-Ray," +
						"[context_hidden:#efc75e]Hide|[적용:#efc75e]감추기 적용|[반전 적용:#efc75e]선택항목 제외하고 전체 감추기|[카테고리 적용:#efc75e]동일 카테고리 전체 감추기," +
						"[context_refresh:#efc75e]모든 상태 초기화,-," +
						"[context_pathtracking:#7F56C1]패스 트래킹,-," +
						"[context_property:#26a6d1]속성보기";
				}

				// 콘텍스트 메뉴구성을 변경합니다.
				webGL.SetContextMenu(contextMenuStr, OnSelectedContextMenu);
			});
			
            // 3D에서 특정 부재가 더블클릭되면 호출됩니다.
            webGL.OnDoubleClick(function (list, position, params) {
            	alert("DoubleClick");
                //console.log("DoubleClick!");
            });
            
         	// 패널 보여기 이벤트
            webGL.OnShowPanel(function(panelName) {
                console.log('OnShowPanel : ' + panelName);
            });

            // 패널 감추기 이벤트
            webGL.OnHidePanel(function(panelName) {
            	if(panelName == "PanelMeasure")
            		fnDtdMeasureOff(false);
            	if(panelName == "PanelBookmark")
            		fnDtdBookmarkOff(false);
            	if(panelName == "PanelMinimap")
            		fnDtdMinimapOff(false);
            });

            // 북마크 저장 요청 이벤트
            webGL.OnBookmarkSave(function(seqID, title, base64) {
            	fnDtdBookmarkSave(seqID, title, base64);
            });  

            // 3D에서 특정 부재가 마우스 오버되면 호출됩니다.
            webGL.OnHover(function (position, params) {
            	alert("OnHover");
                console.log('OnHover: position(' + JSON.stringify(position) + '), params(' + JSON.stringify(params) + ')');
            });

            webGL.OnClickParameter(function (data) {
                //console.log(JSON.stringify(data));

                // 콘텍스트 메뉴 호출
                if (data.button == "Right") {
                    let menuStr = "구글 검색,네이버 검색";
                    webGL.SetContextMenu(menuStr, function (menuName) {
                        switch (menuName) {
                            case "구글 검색":
                                window.open('https://www.google.com/search?q=' + data.value);
                                break;
                            case "네이버 검색":
                                window.open('https://search.naver.com/search.naver?query=' + data.value);
                                break;
                        }
                    });
                    webGL.ShowContextMenu();
                } // if
            }); // OnClickParameter

            webGL.OnClickChartButton(function (eesEqpId, eesSubEqpId, paramId) {
                console.log(`OnClickChartButton EES_EQP_ID:${eesEqpId}, EES_SUB_EQP_ID:${eesSubEqpId}, PARAM_ID:${paramId}`);
            });

            // 차트 콜백
            webGL.OnShowChart(function (eesEqpId, eesSubEqpId, paramId) {
                console.log(`OnShowChart EES_EQP_ID:${eesEqpId}, EES_SUB_EQP_ID:${eesSubEqpId}, PARAM_ID:${paramId}`);

                let chartJson = [
                    {
                        "eventDttm": "2024-01-17 00:00:01.0101010",
                        "resultValue": 1.1
                    },
                    {
                        "eventDttm": "2024-01-17 00:01:01.0101010",
                        "resultValue": 5.5
                    },
                    {
                        "eventDttm": "2024-01-17 00:02:01.0101010",
                        "resultValue": 3.4
                    },
                    {
                        "eventDttm": "2024-01-17 00:03:01.0101010",
                        "resultValue": 3.2
                    },
                    {
                        "eventDttm": "2024-01-17 00:04:01.0101010",
                        "resultValue": 5.1
                    },
                    {
                        "eventDttm": "2024-01-17 00:05:01.0101010",
                        "resultValue": 6.6
                    },
                    {
                        "eventDttm": "2024-01-17 00:06:01.0101010",
                        "resultValue": 3.2
                    },
                    {
                        "eventDttm": "2024-01-17 00:07:01.0101010",
                        "resultValue": 1.1
                    },
                    {
                        "eventDttm": "2024-01-17 00:08:01.0101010",
                        "resultValue": 2.3
                    },
                    {
                        "eventDttm": "2024-01-17 00:09:01.0101010",
                        "resultValue": 4.5
                    }
                ];

                webGL.SetChartData(chartJson);
            });

            webGL.OnShowAlarmPopup(function () {
                console.log('OnShowAlarmPopup');
            });

            webGL.OnHideAlarmPopup(function () {
                console.log('OnHideAlarmPopup');
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
					webGL.GetElementParameter(lastID, function (id, parameter) {
						webGL.Select('카테고리', parameter["카테고리"]);
					});
					break;

				case "연결요소 전체 선택":
					webGL.SelectNeighbours('id', lastID);
					break;

				case "하이라이트 적용":
					webGL.ToggleHighlight('id', ids);
					break;

				case "선택항목 제외하고 전체 하이라이트":
					webGL.HighlightOthers('id', ids);
					break;

				case "동일 카테고리 전체 하이라이트":
					webGL.GetElementParameter(ids, function (id, parameter) {

						webGL.ToggleHighlight("카테고리", parameter["카테고리"]);
					});
					break;

				case "X-Ray 적용":
					webGL.XRayOthers('id', ids);
					break;

				case "선택항목 제외하고 전체 X-Ray":
					webGL.ToggleXRay('id', ids);
					break;

				case "동일 카테고리 전체 X-Ray":
					webGL.GetElementParameter(ids, function (id, parameter) {

						webGL.ToggleXRay("카테고리", parameter["카테고리"]);
					});
					break;

				case "감추기 적용":
					webGL.SetInvisible('id', ids);
					break;

				case "선택항목 제외하고 전체 감추기":
					webGL.InvisibleOthers('id', ids);
					break;

				case "동일 카테고리 전체 감추기":
					webGL.GetElementParameter(ids, function (id, parameter) {

						webGL.SetInvisible("카테고리", parameter["카테고리"]);
					});
					break;

				case "모든 상태 초기화":
					webGL.ResetEffect('', '');
					break;

				case "패스 트래킹":
					//webGL.TrackingPath('id', ids);
					webGL.ShowPanel('PanelPathTracking');                    
					break;

				case "속성보기":
					webGL.ShowAttribute('id', ids);
					break;

			} // switch
		} // function OnSelectedContextMenu(menuName, ids, lastID, params)
	}
	
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
	
	var arrFileListA1=[];
	var arrFileListA2=[];
	var arrFileListA3=[];
	
	arrFileListA1.push("S3F_FCB_AXX_ALL_Central_1");
	arrFileListA2.push("S3F_FCB_EXX_ALL_Central_1");
	arrFileListA3.push("S3F_FCB_SXX_ALL_Central_1");

	// DTDX 파일 오픈
	function fnDtdxFileOpen(opotion)	{

		var url = "";
		var firstCheck = true;
		
		if(opotion == "tree")	{
			
			var checked_ids1 = [];
			var checkedNodes1 = $('#tree1').jstree("get_checked", true);
			$.each(checkedNodes1, function () {
		      	checked_ids1.push(this.id);
		    });

			for(var i=0; i<checked_ids1.length; i++)	{
				var arrFileList;
				if(checked_ids1[i] == "A1")
					arrFileList = arrFileListA1;
				else if(checked_ids1[i] == "A2")
					arrFileList = arrFileListA2;
				else if(checked_ids1[i] == "A3")
					arrFileList = arrFileListA3;
				
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
		}
		else if(opotion == "fix")	{
			url = location.origin + "/DTDX/ASAN/S3F_FCB_AXX_ALL_Central_1.dtdx";
            url += "||" + location.origin + "/DTDX/ASAN/S3F_FCB_EXX_ALL_Central_1.dtdx";
            url += "||" + location.origin + "/DTDX/ASAN/S3F_FCB_SXX_ALL_Central_1.dtdx";
		}

		webGL.OpenURL(url, true, '', openOption);
	}
	
	// OLD. RGB를 받아서 WebGL 내부에서 사용하는 컬러 값 형식으로 변경.
	function fnDTDColorSetOld(colorRed, colorGreen, colorBlur)	{
		var colorData = {
			colorStart:{r:colorRed,g:colorGreen,b:colorBlur,a:1}, 
			colorEnd:{r:colorRed,g:colorGreen,b:colorBlur,a:1},
	        delay: -1,
	        loop: false
	    };
		return colorData;
	}
	
	// NEW. RGB를 받아서 WebGL 내부에서 사용하는 컬러 값 형식으로 변경.
	function fnDTDColorSetNew(colorRed, colorGreen, colorBlur)	{
		var colorData = {
	        colorHexStart: { rgba: colorRed + colorGreen + colorBlur + 'ff' },
	        colorHexEnd: { rgba: colorRed + colorGreen + colorBlur + 'ff' },
	        delay: -1,
	        loop: false
	    };
		return colorData;
	}
</script>

<script>
	/* WebGL 환경설정 */
	// WebGL 환경설정 창에 기본 값 처리
	function fnWebglSettingSet()	{
		$("#dtdLanguage").val(dtdLanguage).prop("selected", true);
		$('[name="dtdShowFPS"][value="' + dtdShowFPS + '"]').prop("checked",true);
		$('[name="dtdSearchTool"][value="' + dtdSearchTool + '"]').prop("checked",true);
		$('[name="dtdRunInBackground"][value="' + dtdRunInBackground + '"]').prop("checked",true);
		$('[name="dtdResetBeforeGoHome"][value="' + dtdResetBeforeGoHome + '"]').prop("checked",true);
		$('[name="dtdAutoShowInspectorPanel"][value="' + dtdAutoShowInspectorPanel + '"]').prop("checked",true);
		$('[name="dtdUseBoxOutline"][value="' + dtdUseBoxOutline + '"]').prop("checked",true);
		$("#dtdXRayAlpha").val(dtdXRayAlpha);
	}

	// WebGL 환경설정 창의 설정을 읽어서 실제 WebGL에 적용
	function fnWebglSettingChange()	{
		
		dtdLanguage = $("#dtdLanguage option:selected").val();
		dtdShowFPS = $("input[name='dtdShowFPS']:checked").val();
		dtdSearchTool = $("input[name='dtdSearchTool']:checked").val();
		dtdRunInBackground = $("input[name='dtdRunInBackground']:checked").val();
		dtdResetBeforeGoHome = $("input[name='dtdResetBeforeGoHome']:checked").val();
		dtdAutoShowInspectorPanel = $("input[name='dtdAutoShowInspectorPanel']:checked").val();
		dtdUseBoxOutline = $("input[name='dtdUseBoxOutline']:checked").val();
		dtdXRayAlpha = $("#dtdXRayAlpha").val();
		
		if(!jQuery.isNumeric(dtdXRayAlpha))
			dtdXRayAlpha = 0.3;
		if (dtdXRayAlpha < 0)
			dtdXRayAlpha = 0;
		if (dtdXRayAlpha > 0)
			dtdXRayAlpha = 1;
		
		webGL.Setting({
			Language : dtdLanguage,
			ShowFPS : dtdShowFPS,
			SearchTool : dtdSearchTool,
			RunInBackground : dtdRunInBackground,
			ResetBeforeGoHome : dtdResetBeforeGoHome,
			AutoShowInspectorPanel : dtdAutoShowInspectorPanel,
			UseBoxOutline : dtdUseBoxOutline,
			XRayAlpha : dtdXRayAlpha
		}); 
		
		$("#pop-setting").removeClass("on");
	}
</script>
	
<script>
	
	$(function(){
		makeLocationTree1();
		fnWebglSettingSet();
	});

	function makeLocationTree1(treeData){
		let locationData1=[
			{"id":"site","parent":"#", "text":"사이트"},
			{"id":"A1","parent":"site", "text":"바닥"},
			{"id":"A2","parent":"site", "text":"설비"},
			{"id":"A3","parent":"site", "text":"외벽"},
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


</html>