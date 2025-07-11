package com.iaan.kepco.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

	@Value("${webFile.Path}")
	private String webfilePath;

	
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		//WebMvcConfigurer.super.addViewControllers(registry);
		registry.addViewController("/").setViewName("index");
		registry.addViewController("/home").setViewName("home");
		registry.addViewController("/login").setViewName("login");
		registry.addViewController("/admin").setViewName("admin/index");
		registry.addViewController("/login-success").setViewName("login-success");
		registry.addViewController("/denied").setViewName("denied");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/kepcoenc/**")
			    .addResourceLocations(webfilePath);
	}
}
