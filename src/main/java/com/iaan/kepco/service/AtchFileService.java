package com.iaan.kepco.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.AtchFileMapper;
import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.RootValveFileDTO;

@Service
//@RequiredArgsConstructor
public class AtchFileService {

	@Autowired
	private AtchFileMapper atchFileMapper;

	public List<AtchFileDTO> selectAtchFileList(AtchFileDTO atchFileDTO) {
		return atchFileMapper.selectAtchFileList(atchFileDTO);
	}
	public List<AtchFileDTO> selectAtchIssueFileList(AtchFileDTO atchFileDTO) {
		return atchFileMapper.selectAtchIssueFileList(atchFileDTO);
	}

	public int insertAtchFile(AtchFileDTO atchFileDTO) {
		return atchFileMapper.insertAtchFile(atchFileDTO);
	}

	public void updateAtchFile(AtchFileDTO atchFileDTO) {
		atchFileMapper.updateAtchFile(atchFileDTO);
	}

	public void updateAtchFileVersion(AtchFileDTO atchFileDTO) {
		atchFileMapper.updateAtchFileVersion(atchFileDTO);
	}

	public int selectAtchFileMaxVersion(AtchFileDTO atchFileDTO) {
		return atchFileMapper.selectAtchFileMaxVersion(atchFileDTO);
	}

	public void updateAtchFileSetVersion(AtchFileDTO atchFileDTO) {
		atchFileMapper.updateAtchFileSetVersion(atchFileDTO);
	}

	public void deleteAtchFile(AtchFileDTO atchFileDTO) {
		atchFileMapper.deleteAtchFile(atchFileDTO);
	}
	public List<RootValveFileDTO> selectrootvalvefileList(String tag) {
		return atchFileMapper.selectrootvalvefileList(tag);
	}
	//public List<RootValveFileDTO> selectrootvalvefileList(String tag);
	
	public int selectAtchFileId() {
		return atchFileMapper.selectAtchFileId();
	}
	
	
	public void insertMultiAtchFile(AtchFileDTO atchFileDTO) {
		atchFileMapper.insertMultiAtchFile(atchFileDTO);
	}
	
	public List<AtchFileDTO> selectAtchFilePath (AtchFileDTO atchFileDTO) {
		return atchFileMapper.selectAtchFilePath(atchFileDTO);
	}
	
	public List<AtchFileDTO> selectAtchFileTagPath(AtchFileDTO atchFileDTO) {
		return atchFileMapper.selectAtchFileTagPath(atchFileDTO);
	}
	
	public int insertMultiAtchFileSeq(AtchFileDTO atchFileDTO) {
		return atchFileMapper.insertMultiAtchFileSeq(atchFileDTO);
	}
}
