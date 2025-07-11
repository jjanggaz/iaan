package com.iaan.kepco.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.CheckItemMapper;
import com.iaan.kepco.dao.CheckMapper;
import com.iaan.kepco.dao.IssueCommentMapper;
import com.iaan.kepco.dao.IssueMapper;
import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.CheckFileDTO;
import com.iaan.kepco.dto.CheckIssueCommentDTO;
import com.iaan.kepco.dto.CheckIssueDTO;
import com.iaan.kepco.dto.CheckItemDTO;
import com.iaan.kepco.dto.ComCodeDTO;
import com.iaan.kepco.dto.DwgFileDTO;
import com.iaan.kepco.dto.DwgTagDTO;
import com.iaan.kepco.dto.FileDTO;
import com.iaan.kepco.dto.SearchDTO;

@Service
//@RequiredArgsConstructor
public class CheckService {

	@Autowired
	private CheckMapper checkMapper;

	@Autowired
	private IssueMapper issueMapper;

	@Autowired
	private CheckItemMapper checkItemMapper;

	@Autowired
	private IssueCommentMapper issueCommentMapper;

	// 2D설계점검 리스트
	public List<CheckDwgDTO> selectCheck2dList(SearchDTO searchDTO) {
		return checkMapper.selectCheck2dList(searchDTO);
	}

	// 2D설계점검 COUNT
	public SearchDTO selectCheck2dCnt(SearchDTO searchDTO) {
		return checkMapper.selectCheck2dCnt(searchDTO);
	}

	// 3D설계점검 리스트
	public List<CheckDwgDTO> selectCheck3dList(SearchDTO searchDTO) {
		return checkMapper.selectCheck3dList(searchDTO);
	}

	// 3D설계점검 COUNT
	public SearchDTO selectCheck3dCnt(SearchDTO searchDTO) {
		return checkMapper.selectCheck3dCnt(searchDTO);
	}

	public int updateCheckVersion(CheckDwgDTO checkDwgDTO) {
		return checkMapper.updateCheckVersion(checkDwgDTO);
	}

	public int insertCheck(CheckDwgDTO checkDwgDTO) {
		return checkMapper.insertCheck(checkDwgDTO);
	}

	public void insertDwgMst(CheckDwgDTO checkDwgDTO) {
		checkMapper.insertDwgMst(checkDwgDTO);
	}
	
	public void updateCheck(CheckDwgDTO checkDwgDTO) {
		checkMapper.updateCheck(checkDwgDTO);
	}

	// 설계점검
	public CheckDwgDTO selectCheckInfo(SearchDTO searchDTO) {
		return checkMapper.selectCheckInfo(searchDTO);
	}

	// 2D설계점검표 리스트
	public List<CheckItemDTO> selectCheckItemList(SearchDTO searchDTO) {
		return checkItemMapper.selectCheckItemList(searchDTO);
	}

	// 2D설계점검표 insert
	public void insertDwgItem(CheckItemDTO checkItemDTO) {
		checkItemMapper.insertDwgItem(checkItemDTO);
	}
	
	public void insertDwgItemDesc(CheckItemDTO checkItemDTO) {
		checkItemMapper.insertDwgItemDesc(checkItemDTO);
	}
	
	public void delDwgItemDesc(int dwgSeq) {
		checkItemMapper.delDwgItemDesc(dwgSeq);
	}
	
	
	public List<CheckItemDTO> selectCheckItemDescList(SearchDTO searchDTO) {
		return checkItemMapper.selectCheckItemDescList(searchDTO);
	}

	public void insertWbs(Map<String,String> param) {
		checkItemMapper.insertWbs(param);
	}

	public List<DwgTagDTO> selectTagList(int dwgSeq) {
		return checkItemMapper.selectTagList(dwgSeq);
	}

	// 현장설계점검 리스트
	public List<CheckIssueDTO> selectIssueList(SearchDTO searchDTO) {
		return issueMapper.selectIssueList(searchDTO);
	}

	// 현장설계점검 COUNT
	public SearchDTO selectIssueCnt(SearchDTO searchDTO) {
		return issueMapper.selectIssueCnt(searchDTO);
	}

	// 현장설계점검 조회
	public CheckIssueDTO selectIssueOne(SearchDTO searchDTO) {
		return issueMapper.selectIssueOne(searchDTO);
	}

	// 현장설계점검 등록
	public int insertIssue(CheckIssueDTO checkIssueDTO) {
		return issueMapper.insertIssue(checkIssueDTO);
	}

	// 현장설계점검 댓글 리스트
	public List<CheckIssueCommentDTO> selectIssueCommentList(SearchDTO searchDTO) {
		return issueCommentMapper.selectIssueCommentList(searchDTO);
	}

	// 현장설계점검 댓글 등록
	public int insertIssueComment(CheckIssueCommentDTO checkIssueCommentDTO) {
		return issueCommentMapper.insertIssueComment(checkIssueCommentDTO);
	}
	
	// 공통코드
	public List<ComCodeDTO> selectComCodeList(Map<String, String> param) {
		return checkMapper.selectComCodeList(param);
	}
	
	// autocad 파일 다운로드 
	public DwgFileDTO selectFileInfo(Map<String, String> param) {
		return checkMapper.selectFileInfo(param);
	}
	
	
	
	public List<FileDTO> selectIssueFile(SearchDTO searchDTO){
		return issueMapper.selectIssueFile(searchDTO);
	}
	
	public String selectJsonFileDwgSeq(Map<String, String> param){
		return checkMapper.selectJsonFileDwgSeq(param);
	}
	public  void inserttbkcdwgmst3dfile(Map<String, String> param){
		 checkMapper.inserttbkcdwgmst3dfile(param);
	}
	
	
	public List<CheckFileDTO> select3DFileList(SearchDTO searchDTO){
		return checkMapper.select3DFileList(searchDTO);
	}
	
	

}
