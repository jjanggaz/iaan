package com.iaan.kepco.config;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginCheckConfig implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // 1. 세션에서 회원 정보 조회
        HttpSession session = request.getSession();
        String loginUserId = session.getAttribute("UserId").toString();

        // 2. 회원 정보 체크
        if (loginUserId == null) {
            response.sendRedirect("/login.do");
            return false;
        }

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

}

