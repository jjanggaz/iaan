<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
		<header>
			<div class="area-header">
				<div class="logoBox">
					<a href="/index">
						<img src="/img/logo_dtdon.svg" alt="" />
					</a>
				</div>

				<div class="group-headerList">
					<ul class="list-category">
						<li onclick="fnPageTab('cont-web2Gl')" id="header2DModel" class="off">2D모델</li>
						
						<li onclick="fnPageTab('cont-webGl')" id="header3DModel" class="on">3D모델</li>
						<li onclick="fnPageTab('cont-webGl2')" id="header3DModel">현장점검</li>
						<li id="headerCheck2d">
							<span>설계점검</span>
					    	 <ul>
							    <li onclick="fnPageTab('cont-check2d')">2D 설계점검</li>
						    	<li onclick="fnPageTab('cont-check3d')">3D 설계점검</li>
							   	<li onclick="fnPageTab('cont-checkIssue')">현장 설계점검</li>
						     </ul>
						</li>
						<li onclick="fnPageTab('cont-plan')" id="headerPlan">공사계획</li>
						<li onclick="fnPageTab('cont-calc')" id="headerCalc">비용정산</li>
						<li onclick="fnPageTab('cont-stateOfProd')" id="headerStateOfProd">제작현황</li>
						
						
						
						<li id="headerCheck3d">
							<span>관리자</span>
								<ul>
									<li onclick="fnPageTab('cont-3dModel')">3D 도면관리</li>
                  <li onclick="fnPageTab('cont-2dDwg')">2D 도면관리</li>
                  <li onclick="fnPageTab('cont-symbol');">심볼 형상관리</li>

								</ul>
						</li>
						
					    <!-- li onclick="location.href='/chat'" id="headerChat">채팅방개설</i -->
					</ul>

					<ul class="list-accountInfo">
						<li class="userInfo">
							  <!--   <img src="/img/ico_user.png" alt="" /> -->
							${name} (${id})
						</li>
						<li class="btn-log" onclick="fnLogout()" style="cursor: pointer;"></li>
					</ul>
			  	</div>
			</div>
		</header>

<script type="text/javascript">
	var pageNm = $(location).attr('pathname');
	if (pageNm == "/index")	{
		$("#header3DModel").addClass("on");
	}
	else if (pageNm == "/check/check2d" || pageNm == "/check/check3d" || pageNm == "/check/checkIssue")	{
		$("#headerCheck2d").addClass("on");
	}
	else if (pageNm == "/admin/modelmng" || pageNm == "/admin/dwgmng")	{
		$("#headerCheck3d").addClass("on");
	}
	else if (pageNm == "/plan")	{
		$("#headerPlan").addClass("on");
	}
	else if (pageNm == "/calc")	{
		$("#headerCalc").addClass("on");
	}
	else if (pageNm == "/stateOfProd")	{
		$("#headerStateOfProd").addClass("on");
	}

	function fnLogout()	{
		$.ajax({
		  	type:"POST",
		  	url: "/user/logout",
		  	success: function(data){
		  		location.href = "/login";
		  	},
		  	err: function(err){
			  	console.log("err:", err)
		  	}
	  	})
	}

</script>
