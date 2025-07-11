package com.iaan.kepco.service;

import lombok.Getter;

@Getter
public enum ResponseEnum {
	 FAIL(004,"FAIL")
	, SUCCESS(40000,"SUCCESS")
	, LOGIN_FAIL(43000, "로그인 실패")
	, LOGIN_FAIL_EMPTY_LOGIN_INFO(43100, "아이디 또는 패스워드가 존재하지 않습니다.")
	, FILE_NOT_FOUND_EXCEPTION(44000,"FILE_NOT_FOUND_EXCEPTION")
	, HANDLE_NOT_FOUND_EXCEPTION(45000,"HANDLE_NOT_FOUND_EXCEPTION")
	;
	
	String resultCode;
	String resultMessage;
	
	ResponseEnum(int resultCode){
		this.resultCode = String.valueOf(resultCode);
	}

	ResponseEnum(int resultCode, String resultMessage){
		this.resultCode = String.valueOf(resultCode);
		this.resultMessage = resultMessage;
	}

}
