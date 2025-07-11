package com.iaan.kepco.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class CheckDwgDTO {

	private int rownum;
	private int dwgSeq;
	private int version;
	private String status;
	private String dwgFileNm;
	private String svgFileNm;
	private String jsonFileNm;
	private String checkDate;
	private String checkYn;
	private String actionDeadline;
	private String actionDate;
	private String completeDate;
	private String actionDeadline3;
	private String actionDate3;
	private String completeDate3;
	private String examinationOpinion;
	private String actionOpinion;
	private String examinationOpinion3;
	private String actionOpinion3;
	private String xyzPoint;

	private String regId;
	private String regDate;
	private String modId;
	private String modDate;

	private String dwgNum;
	private String plantNm;
	private String unitNm;
	private String buildingNm;
	private String levelNm;
	private String rootValveNm;
	private String wCdNm;
	private String statusNm;
	private String itemCheck;
	private String tagSeq;

	private String checkResult;
	
	private Integer fileAe;
	private Integer fileDwg;
	private Integer fileJson;
	private Integer fileDtdx;
	private Integer fileSvg;

	private List<CheckFileDTO> fileDto;



}
