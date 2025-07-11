package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class RootValveFileDTO {

	private String dwgSeq;
	private String tagSeq;
	private String tagNm ;
	private String dwgFileNm;
	private String svgFileNm;
	private String jsonFileNm;
	private String fileDwg;
	private String fileSvg;
	private String fileJson;
	private String dwgFileId;
	private String dwgFileOri;
	private String dwgFilePath;
	private String svgFileId;
	private String svgFileOri;
	private String svgFilePath;
	private String jsonFileId;
	private String jsonFileOri;
	private String jsonFilePath;
}
