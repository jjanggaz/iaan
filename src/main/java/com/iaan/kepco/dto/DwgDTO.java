package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class DwgDTO {

	private int dwgSeq;
	private String dwgNum;
	private String wCd;
	private String aeFileNm;
	private String useYn;
	private String regId;
	private String regDate;
	private String modId;
	private String modDate;

	private String dwgFileNm;
	private String svgFileNm;
	private String jsonFileNm;

	private String hierarchyNm;

	private String[] hiSeqList;

	private idLvlDTO[] idLvlList;
	
	private String jsonFileNmOri;
	
}
