package com.iaan.kepco.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.CheckIssueCommentDTO;
import com.iaan.kepco.dto.CheckIssueDTO;
import com.iaan.kepco.dto.SearchDTO;

@Mapper
public interface IssueCommentMapper {
	public List<CheckIssueCommentDTO> selectIssueCommentList(SearchDTO searchDTO);
	public int insertIssueComment(CheckIssueCommentDTO checkIssueCommentDTO);
}
