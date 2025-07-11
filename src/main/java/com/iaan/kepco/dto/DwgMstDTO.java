package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class DwgMstDTO {

	private int dwgSeq;
	private String dwgPlant;
	private String dwgPlantNm;
	private String dwgUnit  ;
	private String  dwgUnitNm;
	private String dwgBuilding  ;
	private String  dwgLevelNm;
	private String dwgLevel  ;
	private String dwgBuildingNm;
	private String tagNm;
	private String regDate;
	private String status;
	private String statusNm;
	private String actionDeadline;
	private Integer fileDwg;
	private Integer fileAe;
	private Integer fileSvg;
	private Integer fileJson;
	
	private String dwgFileNm;
	private String dwgFileAeNm;
	private String svgFileNm;
	private String jsonFileNm;
	
	private String checkDate;

	private String checkYn;
	private String wCd;
	private String wCdNm;
	private String fileDtdx;
	private String regId;

	private String actionDate;
	private String actionDate3;
	private String actionOpinion;
	private String examinationOpinion;
	private String actionOpinion3;
	private String examinationOpinion3;
	private String fileNmOri;
	private String tagSeq;
	private String handle;
	
}
