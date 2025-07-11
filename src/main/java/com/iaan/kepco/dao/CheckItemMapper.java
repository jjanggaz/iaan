package com.iaan.kepco.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.CheckItemDTO;
import com.iaan.kepco.dto.DwgTagDTO;
import com.iaan.kepco.dto.SearchDTO;

@Mapper
public interface CheckItemMapper {
	public List<CheckItemDTO> selectCheckItemList(SearchDTO searchDTO);
	public void insertDwgItem(CheckItemDTO checkItemDTO);
	
	public void insertDwgItemDesc(CheckItemDTO checkItemDTO);
	
	public List<CheckItemDTO> selectCheckItemDescList(SearchDTO searchDTO);
	public void delDwgItemDesc(int dwgSeq);
	
	public void insertWbs(Map<String,String> param);
	
	public List<DwgTagDTO> selectTagList(int dwgSeq);
}
