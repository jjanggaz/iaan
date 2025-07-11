package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class DwgTagDTO {

	private Integer dwgSeq;
	private Integer tagSeq;
	private String tagNm;
	private String mSeq;
	private String regId;
	private String regDate;
	private String tagPx;
	private String tagPy;
	private String tagPz;

}
