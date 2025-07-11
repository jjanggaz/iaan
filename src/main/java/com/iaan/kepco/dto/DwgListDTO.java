package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class DwgListDTO {

	private int dwgSeq;
	private String dwgNum;
	private int version;
	private String plantNm;
	private String unitNm;
	private String buildingNm;
	private String levelNm;
	private String rootValveNm;
	private String wCdNm;
	private String statusNm;
	private String actionDeadline;

	private String useYn;
	private String regId;
	private String regDate;
	private String modId;
	private String modDate;

}
