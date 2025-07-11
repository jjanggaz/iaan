package com.iaan.kepco.dao;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.UserDTO;

@Mapper
public interface UserMapper {
	public UserDTO selectLoginCheck(UserDTO userDTO);
}
