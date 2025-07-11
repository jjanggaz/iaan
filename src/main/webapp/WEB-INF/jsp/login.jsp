<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<!-- start::Head -->
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>설계점검시스템</title>
	<link rel="stylesheet" href="/lib/jquery/jquery-ui.css" />
	<link rel="stylesheet" href="/lib/materialdesignicons/materialdesignicons.min.css" />
	<link rel="stylesheet" href="/css/init.css" />
	<link rel="stylesheet" href="/css/login.css" />
	<script src="/lib/jquery/jquery.min.js"></script>
</head>

<body>
   	<div id="wrap-page " class="loginPage">
	 	<main class="line-searchCond">

			<section class="sect-left">
				<img class="img-loginLogo" src="../img/logo_dtdon.svg" style="width: 130px;" alt="" />
		 		<!-- img src="/img/login.png" alt="" / -->
			</section>

			<section class="sect-right">
				<div class="wrap-sectRight">
					<div class="line-title">
						<span>로그인</span>
						<span>한전기술 다자간 협업시스템</span>
					</div>

					<div class="loginForm"><input type="text" class="login-ID" id="userId" placeholder="User ID"></div>
					<div class="loginForm"><input type="password" class="login-PW" id="userPw" placeholder="Password"></div>

					<ul class="list-checkBox">
						<li><input class="checkBox" type="checkbox" id="check1" checked><label for="check1"></label><p>아이디 기억하기</p></li>
						<!-- li><input class="checkBox" type="checkbox" id="check2" ><label for="check2"></label><p>SSO</p></li -->
					</ul>
					<button class="btn-login" onclick="fnLogin()"><p>로그인</p></button>
					<!-- button class="btn-refresh">비밀번호초기화</button -->
				</div>
			</section>
		</main>
	</div>
</body>
<script>
$(document).ready(function(){
	var key = getCookie("iaanUserId"); //user1
	if(key!=""){
		$("#userId").val(key);
	}

	if($("#userId").val() != ""){
		$("#check1").attr("checked", true);
	}

	$("#check1").change(function(){
		if($("#check1").is(":checked")){
			setCookie("iaanUserId", $("#userId").val(), 7);
		}else{
			deleteCookie("iaanUserId");
		}
	});

	$("#userId").keyup(function(){
		if($("#check1").is(":checked")){
			setCookie("iaanUserId", $("#userId").val(), 7);
		}
	});
});

function setCookie(cookieName, value, exdays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
    document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName){
	var expireDate = new Date();
	expireDate.setDate(expireDate.getDate() - 1);
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function getCookie(cookieName) {
	cookieName = cookieName + '=';
	var cookieData = document.cookie;
	var start = cookieData.indexOf(cookieName);
	var cookieValue = '';
	if(start != -1){
		start += cookieName.length;
		var end = cookieData.indexOf(';', start);
		if(end == -1)end = cookieData.length;
		cookieValue = cookieData.substring(start, end);
	}
	return unescape(cookieValue);
}


document.getElementById("userId").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fnLogin()
  }
});

document.getElementById("userPw").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fnLogin()
  }
});

function fnLogin()	{

	const formData = new FormData();
	formData.append("userId", $("#userId").val());
	formData.append("userPw", $("#userPw").val());

  	$.ajax({
	  	type:"POST",
	  	url: "/user/login",
	  	processData: false,
	  	contentType: false,
	  	data: formData,
	  	success: function(data){
	  		if(data.resultCode == "40000")	{
	  			location.href = "/index";
	  		}
	  		else	{
	  			alert("아이디 또는 패스워드가 잘못되었습니다.");
	  		}
	  	},
	  	err: function(err){
		  	console.log("err:", err)
	  	}
  	})
}

</script>
</html>