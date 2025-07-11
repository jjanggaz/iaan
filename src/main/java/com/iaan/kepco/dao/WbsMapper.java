package com.iaan.kepco.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.WbsDTO;

@Mapper
public interface WbsMapper {
	public List<WbsDTO> selectWbsPlanList(SearchDTO searchDTO);
	public SearchDTO selectWbsPlanCnt(SearchDTO searchDTO);
	public List<WbsDTO> selectWbsPlanExcelList(SearchDTO searchDTO);

	public List<WbsDTO> selectWbsCalcList(SearchDTO searchDTO);
	public SearchDTO selectWbsCalcCnt(SearchDTO searchDTO);

	public WbsDTO selectWbsCheck(WbsDTO wbsDTO);
	public int insertWbs(WbsDTO wbsDTO);
	
	public int insertWbsActual(WbsDTO wbsDTO);
	
	
	public void deleteWbs(WbsDTO wbsDTO);
	
	public void updateWbs(WbsDTO wbsDTO);
	
	
	
	
}
