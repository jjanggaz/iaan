package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class PassTagDTO {

	private int dwgSeq;
	
	private String dwgFileNm;
	private String passTag;

}
