package com.iaan.kepco.controller;

import java.security.NoSuchAlgorithmException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.UserDTO;
import com.iaan.kepco.service.CommonService;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.utils.SHA256Util;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
public class LoginApi {

	@Autowired
	private CommonService commonService;

	// Post 샘플
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = UserDTO.class)))
	})
	@Operation(summary = "로그인", hidden = false, description = "로그인")
	@PostMapping("/user/login")
	public RestResponse<?> userLoginCheck(@RequestParam("userId") String userId
			, @RequestParam("userPw") String userPw
			, HttpServletRequest request) throws NoSuchAlgorithmException {

		String result = "900";
		SHA256Util sha = new SHA256Util();
		userPw = sha.encrypt(userPw);

		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(userId);
		userDTO.setPwd(userPw);

		userDTO = commonService.selectLoginCheck(userDTO);

		if(userDTO != null)	{
			result = "100";
			HttpSession session = request.getSession(true);

			session.setMaxInactiveInterval(3 * 60 * 60);
			session.setAttribute("UserId", userDTO.getUserId());
			session.setAttribute("UserNm", userDTO.getUserNm());
		}

		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(userDTO)
				.build();
		
		//return RestResponse.CodeWithData()				.data(result)				.build();
	}

	// Post 샘플
	@Operation(summary = "로그아웃", hidden = false, description = "로그아웃")
	@PostMapping("/user/logout")
	public void userLogout(HttpServletRequest request) throws NoSuchAlgorithmException {
		HttpSession session = request.getSession(true);

		session.removeAttribute("UserId");
		session.removeAttribute("UserNm");
		session.invalidate();

	}



}
