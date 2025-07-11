package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class SymbolDTO {

	private int seqNo;
	private Integer symbolSeq;
	private String symbolType;
	private String dwgFileNm;
	private String tagNm;
	private String symbolOd;
	private String fileNm;
	private String fileUrl;
	private String regId;
	private String regDate;
	private String filePath;

}
