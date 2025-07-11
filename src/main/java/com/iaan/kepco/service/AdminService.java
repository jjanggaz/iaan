package com.iaan.kepco.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.AdminMapper;
import com.iaan.kepco.dto.DwgMngDTO;
import com.iaan.kepco.dto.DwgModelDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.DwgTagDTO;
import com.iaan.kepco.dto.ModelDTO;
import com.iaan.kepco.dto.SearchDTO;

@Service
//@RequiredArgsConstructor
public class AdminService {

	@Autowired
	private AdminMapper adminMapper;

	/* 2d */
	public List<DwgMngDTO> selectDwgMngList(SearchDTO searchDTO) {
		return adminMapper.selectDwgMngList(searchDTO);
	}

	public SearchDTO selectDwgMngCnt(SearchDTO searchDTO) {
		return adminMapper.selectDwgMngCnt(searchDTO);
	}
	
	public int deleteDwgMst(String dwgSeq) {
		return adminMapper.deleteDwgMst(dwgSeq);
	}
	public int insertDwgMst(DwgMstDTO  dwgMstDTO){
		return adminMapper.insertDwgMst(dwgMstDTO);
	}
	
	public int insertDwgTag(DwgTagDTO  dwgTagDTO){
		return adminMapper.insertDwgTag(dwgTagDTO);
	}
	
	public int updateDwgTag(DwgTagDTO  dwgTagDTO){
		return adminMapper.updateDwgTag(dwgTagDTO);
	}
	
	
	
	public int insertDwgModel(DwgModelDTO  dwgModelDTO){
		return adminMapper.insertDwgModel(dwgModelDTO);
	}
	
	/* 3d */
	public List<ModelDTO> selectModelMngList(SearchDTO searchDTO) {
		return adminMapper.selectModelMngList(searchDTO);
	}

	public List<ModelDTO> selectModelMngOne(SearchDTO searchDTO) {
		return adminMapper.selectModelMngOne(searchDTO);
	}

	
	
	
	public SearchDTO selectModelMngCnt(SearchDTO searchDTO) {
		return adminMapper.selectModelMngCnt(searchDTO);
	}
	
	public int deleteModelMst(String dwgSeq) {
		return adminMapper.deleteModelMst(dwgSeq);
	}
	public int deleteIssueMst(String issueSeq) {
		return adminMapper.deleteIssueMst(issueSeq);
	}

	
	
	public int insertModel(ModelDTO modelDTO) {
		return adminMapper.insertModel(modelDTO);
	}
	
	public List<ModelDTO> selectModelCodeList(SearchDTO searchDTO) {
		return adminMapper.selectModelCodeList(searchDTO);
	}
	public int insertDwgPassTag(DwgModelDTO dwgModelDTO) {
		return adminMapper.insertDwgPassTag(dwgModelDTO);
	}
	
	public List<DwgMngDTO> selectDwgMngOne(SearchDTO searchDTO) {
		return adminMapper.selectDwgMngOne(searchDTO);
	}
	
	public int deleteDwgModel(String dwgSeq) {
		return adminMapper.deleteDwgModel(dwgSeq);
	}
	
}
