package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class CheckIssueCommentDTO {

	private int icSeq;
	private int issueSeq;
	private int parentIcSeq;
	private int sortSeq;
	private String commentConts;
	private String regId;
	private String regDate;
	private String orderPath;

}
