package com.iaan.kepco.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.CheckIssueDTO;
import com.iaan.kepco.dto.FileDTO;
import com.iaan.kepco.dto.SearchDTO;

@Mapper
public interface IssueMapper {
	public List<CheckIssueDTO> selectIssueList(SearchDTO searchDTO);
	public SearchDTO selectIssueCnt(SearchDTO searchDTO);
	public CheckIssueDTO selectIssueOne(SearchDTO searchDTO);
	public int insertIssue(CheckIssueDTO checkIssueDTO);

	public void updateIssue(CheckIssueDTO checkIssueDTO);
	public void deleteIssue(CheckIssueDTO checkIssueDTO);
	
	
	public List<FileDTO> selectIssueFile(SearchDTO searchDTO);
	
	
}
