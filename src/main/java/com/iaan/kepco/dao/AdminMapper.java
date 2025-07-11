package com.iaan.kepco.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.DwgMngDTO;
import com.iaan.kepco.dto.DwgModelDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.DwgTagDTO;
import com.iaan.kepco.dto.ModelDTO;
import com.iaan.kepco.dto.SearchDTO;

@Mapper
public interface AdminMapper {
	public List<DwgMngDTO> selectDwgMngList(SearchDTO searchDTO);
	public SearchDTO selectDwgMngCnt(SearchDTO searchDTO);
	public int deleteDwgMst(String dwgSeq);
	public int insertDwgMst(DwgMstDTO  dwgMstDTO);
	public int insertDwgTag(DwgTagDTO  dwgTagDTO);
	public int updateDwgTag(DwgTagDTO  dwgTagDTO);
	
	
	
	
	public List<DwgMngDTO> selectDwgMngOne(SearchDTO searchDTO);
	
	
	
	public List<ModelDTO> selectModelMngList(SearchDTO searchDTO);
	public SearchDTO selectModelMngCnt(SearchDTO searchDTO);
	public int deleteModelMst(String dwgSeq);
	public int deleteIssueMst(String issueSeq);
	
	public List<ModelDTO> selectModelMngOne(SearchDTO searchDTO);
	
	public int insertModel(ModelDTO  modelDTO);
	public List<ModelDTO> selectModelCodeList(SearchDTO searchDTO);
	
	
	public int insertDwgModel(DwgModelDTO  dwgModelDTO);
	public int insertDwgPassTag(DwgModelDTO  dwgModelDTO);
	
	
	public int deleteDwgModel(String dwgSeq);
	
	
	
}
