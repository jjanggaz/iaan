package com.iaan.kepco.service;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class RestResponse<T> {
	private String resultCode;
	private String resultMessage;
	private T data;


	@Builder
	public RestResponse(String resultCode, String message, T data) {
		this.resultCode = resultCode;
		this.resultMessage = message;
		this.data = data;
	}
	
	@Builder(builderClassName = "CodeWithData", builderMethodName = "CodeWithData")
	public RestResponse(String resultCode, T data) {
		this.resultCode = resultCode;
		if (resultCode == "40000") {
			this.resultMessage = ResponseEnum.SUCCESS.getResultMessage();
		}
		else {
			this.resultMessage = ResponseEnum.SUCCESS.getResultMessage();
		}
		this.data = data;
	}

}
