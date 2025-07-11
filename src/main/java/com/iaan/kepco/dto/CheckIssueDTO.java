package com.iaan.kepco.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class CheckIssueDTO {

	private int rownum;
	private int issueSeq;
	private int hSeq;
	private int tagSeq;
	private String issueTitle;
	private String issueConts;
	private String status;
	private int commentCnt;
    private Integer fileId;
    private Integer fileSeq;
	private String regId;
	private String regDate;
	private String modId;
	private String modDate;

	private String plantNm;
	private String unitNm;
	private String buildingNm;
	private String levelNm;
	private String rootValveNm;
	private String statusNm;
	
	private List<FileDTO> files;



}
