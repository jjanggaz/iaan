package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class CheckFileDTO {

	private int dwgSeq;
	private String meshi1Id;
	private String meshi2Id;
	private String fileNm;
	private int fileId;
	private int fileSeq;
	private String fileBase64;
	



}
