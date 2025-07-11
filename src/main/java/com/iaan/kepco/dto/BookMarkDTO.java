package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class BookMarkDTO {

	private Integer bookmarkSeq;
	private Integer descSeq;
	private String bookmarkId;
	private String title;
	private String regId;
	private String regDate;
	private Integer tagSeq;
	private String tagNum;
	
	private Integer sequenceId  ;           
	private Integer animateDelay ;          
	private Integer animateSpeed  ;         
	private String cameraPosition ;        
	private String cameraRotation ;        
	private String cameraTarget  ;         
	private String[] hiSeqList;
	private String[] tagList;

	private idLvlDTO[] idLvlList;

}
