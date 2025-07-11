package com.iaan.kepco.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.CheckFileDTO;
import com.iaan.kepco.dto.ComCodeDTO;
import com.iaan.kepco.dto.DwgFileDTO;
import com.iaan.kepco.dto.SearchDTO;

@Mapper
public interface CheckMapper {
	public List<CheckDwgDTO> selectCheck2dList(SearchDTO searchDTO);
	public SearchDTO selectCheck2dCnt(SearchDTO searchDTO);
	public List<CheckDwgDTO> selectCheck3dList(SearchDTO searchDTO);
	public SearchDTO selectCheck3dCnt(SearchDTO searchDTO);
	public int updateCheckVersion(CheckDwgDTO checkDwgDTO);
	public int insertCheck(CheckDwgDTO checkDwgDTO);
	public void insertDwgMst(CheckDwgDTO checkDwgDTO);
	public void updateCheck(CheckDwgDTO checkDwgDTO);
	public CheckDwgDTO selectCheckInfo(SearchDTO searchDTO);
	
	public List<ComCodeDTO> selectComCodeList(Map<String, String> param);
	public DwgFileDTO selectFileInfo(Map<String, String> param);

	public String selectJsonFileDwgSeq(Map<String, String> param);
	public void inserttbkcdwgmst3dfile(Map<String, String> param);

	
	public List<CheckFileDTO> select3DFileList(SearchDTO searchDTO);
	
	
	
	
}

