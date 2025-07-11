
package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class WbsDTO {

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
	private Integer tagSeq;
	private Integer actualSeq;
	private String handle;
	
}
