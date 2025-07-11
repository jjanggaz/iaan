
package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class DwgMngDTO {

	private Integer wbsSeq;
	private Integer hSeq;
	private String wCd;
	private String startDate;
	private String endDate;
	private Integer planQuantity;
	private Integer actualQuantity;
    private String builder;
    private String buildContents;
    private String useYn;
    private String regId;
    private String regDate;
    private String modId;
    private String modDate;

	private String plantNm;
	private String unitNm;
	private String buildingNm;
	private String levelNm;
	private String rootValveNm;
	private String workCdNm;
	private String wCdNm;

	private String length;
	private String thdOd;
	private String expense;
	private String quantity;
	private String cdId;
	private String tagSeq;
	
	private Integer fileAe;
	private Integer fileDwg;
	private String  aeName;
	private String dwgName;

	private String dwgSeq; 
	
	private String dwgPlant; 
	private String dwgUnit; 
	private String dwgBuilding; 
	private String dwgLevel; 
	private String mSeq;
	
	
	private String passSeq;
	private String passTag;
	
	private String dwgFileNm;
	private String aeFileNm;
	
	
	
}
