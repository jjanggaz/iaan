package com.iaan.kepco.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.WbsMapper;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.WbsDTO;

@Service
//@RequiredArgsConstructor
public class WbsService {

	@Autowired
	private WbsMapper wbsMapper;

	public List<WbsDTO> selectWbsPlanList(SearchDTO searchDTO) {
		return wbsMapper.selectWbsPlanList(searchDTO);
	}

	public SearchDTO selectWbsPlanCnt(SearchDTO searchDTO) {
		return wbsMapper.selectWbsPlanCnt(searchDTO);
	}

	public List<WbsDTO> selectWbsPlanExcelList(SearchDTO searchDTO) {
		return wbsMapper.selectWbsPlanExcelList(searchDTO);
	}

	public List<WbsDTO> selectWbsCalcList(SearchDTO searchDTO) {
		return wbsMapper.selectWbsCalcList(searchDTO);
	}

	public SearchDTO selectWbsCalcCnt(SearchDTO searchDTO) {
		return wbsMapper.selectWbsCalcCnt(searchDTO);
	}

	public WbsDTO selectWbsCheck(WbsDTO wbsDTO) {
		return wbsMapper.selectWbsCheck(wbsDTO);
	}

	public void insertWbs(WbsDTO WbsDTO) {
		wbsMapper.insertWbs(WbsDTO);
	}
	
	public void insertWbsActual(WbsDTO WbsDTO) {
		wbsMapper.insertWbsActual(WbsDTO);
	}
	
	

	public void deleteWbs(WbsDTO WbsDTO) {
		wbsMapper.deleteWbs(WbsDTO);
	}
	public void updateWbs(WbsDTO WbsDTO) {
		wbsMapper.updateWbs(WbsDTO);
	}
	
	
	
}
