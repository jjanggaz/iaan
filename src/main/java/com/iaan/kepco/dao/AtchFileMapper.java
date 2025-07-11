package com.iaan.kepco.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.RootValveFileDTO;

@Mapper
public interface AtchFileMapper {
	public List<AtchFileDTO> selectAtchFileList(AtchFileDTO atchFileDTO);
	
	public List<AtchFileDTO> selectAtchIssueFileList(AtchFileDTO atchFileDTO);
	public int insertAtchFile(AtchFileDTO atchFileDTO);
	public void updateAtchFile(AtchFileDTO atchFileDTO);
	public void updateAtchFileVersion(AtchFileDTO atchFileDTO);
	public int selectAtchFileMaxVersion(AtchFileDTO atchFileDTO);
	public void updateAtchFileSetVersion(AtchFileDTO atchFileDTO);
	public void deleteAtchFile(AtchFileDTO atchFileDTO);
	
	public List<RootValveFileDTO> selectrootvalvefileList(String tag);
	
	public int selectAtchFileId();
	public void insertMultiAtchFile(AtchFileDTO atchFileDTO);
	
	public List<AtchFileDTO> selectAtchFilePath(AtchFileDTO atchFileDTO);
	
	public List<AtchFileDTO> selectAtchFileTagPath(AtchFileDTO atchFileDTO);
	
	public int insertMultiAtchFileSeq(AtchFileDTO atchFileDTO);
	
	
	
}
