package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class CheckItemDTO {

	private int dwgSeq;
	private int version;
	private int item;
	private int checkCnt;

	private int rownum;
	private String cdNm;
	private String checkValue1;
	private String checkValue2;
	private String handle;
	private String name;
	private Integer itemDescSeq;
	private String useYn;
	private Integer handleCnt;

}
