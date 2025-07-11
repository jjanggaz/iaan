package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class AtchFileDTO {

	private int rownum;
	private int fileId;
	private int fileSeq;
	
	private String fileType;
	private String filePath;

	private String fileNmOri;
	private String fileNm;
	private long fileLength;
	private String fileStatus;

	private String regId;
	private String regDate;
	private String modId;
	private String modDate;

	private String fileUrl;
	private String issueSeq;
	private String tagNm;
}
