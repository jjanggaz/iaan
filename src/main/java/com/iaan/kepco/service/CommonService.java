package com.iaan.kepco.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.AtchFileMapper;
import com.iaan.kepco.dao.UserMapper;
import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.UserDTO;

@Service
//@RequiredArgsConstructor
public class CommonService {

	@Autowired
	private UserMapper userMapper;

	public UserDTO selectLoginCheck(UserDTO userDTO) {
		
		
		
		
		return userMapper.selectLoginCheck(userDTO);
	}

}
