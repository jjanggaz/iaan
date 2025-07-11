package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class JsonSymbolDTO {

	private int dwgSeq;
	private int version;
	private String handle;
	private String gubun;
	private String tag;
	private String lineGroup;
	private String lineSeq;
	private String symbol;
	private String length;
	private String thdOd;
	private String rootPlate;

}
