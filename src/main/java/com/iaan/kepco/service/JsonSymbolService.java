package com.iaan.kepco.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.JsonSymbolMapper;
import com.iaan.kepco.dto.JsonSymbolDTO;

@Service
//@RequiredArgsConstructor
public class JsonSymbolService {
	@Autowired
	private JsonSymbolMapper jsonSymbolMapper;

	public void updateJsonSymbolStatus(JsonSymbolDTO jsonSymbolDTO) {
		jsonSymbolMapper.updateJsonSymbolStatus(jsonSymbolDTO);
	}

	public void insertJsonSymbol(JsonSymbolDTO jsonSymbolDTO) {
		jsonSymbolMapper.insertJsonSymbol(jsonSymbolDTO);
	}

	public void updateJsonSymbolHSeq(JsonSymbolDTO jsonSymbolDTO) {
		jsonSymbolMapper.updateJsonSymbolHSeq(jsonSymbolDTO);
	}

	public void updateJsonSymbolGubun(JsonSymbolDTO jsonSymbolDTO) {
		jsonSymbolMapper.updateJsonSymbolGubun(jsonSymbolDTO);
	}
	
	public void deleteJsonSymbolStatus(JsonSymbolDTO jsonSymbolDTO) {
		jsonSymbolMapper.deleteJsonSymbolStatus(jsonSymbolDTO);
	}

}
