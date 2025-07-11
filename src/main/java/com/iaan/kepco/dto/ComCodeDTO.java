package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class ComCodeDTO {

	
	private String cdGroup;
	private String cdId;
	private String parentId;
	private String sortSeq;
	private String cdNm;
	private String cdDesc1;
	private String cdDesc2;
	private String cdDesc3;
}
