package com.iaan.kepco.dao;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.JsonSymbolDTO;

@Mapper
public interface JsonSymbolMapper {
	// 작업순서대로 쿼리문 정렬
	public void updateJsonSymbolStatus(JsonSymbolDTO jsonSymbolDTO);
	public void insertJsonSymbol(JsonSymbolDTO jsonSymbolDTO);
	public void updateJsonSymbolHSeq(JsonSymbolDTO jsonSymbolDTO);
	public void updateJsonSymbolGubun(JsonSymbolDTO jsonSymbolDTO);
	public void deleteJsonSymbolStatus(JsonSymbolDTO jsonSymbolDTO);
}
