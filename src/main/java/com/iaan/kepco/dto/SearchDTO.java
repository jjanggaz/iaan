package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class SearchDTO {

    private String hSeq;
    private String hierarchyNm;

    private int searchSeq;
    private String searchText;
    private String searchParentId;

    private int dwgSeq;
    private int version;

    private int issueSeq;

    private int startRowNum;
    private int pageSize;
    private int totalDataCnt;

    private String[] hiSeqList;
    
    private idLvlDTO[] idLvlList;
    
    private String parentId;
    private String lvlCode;
    private String item;
    
    
    private String dwgPlant;
	private String dwgUnit  ;
	private String dwgBuilding  ;
	private String dwgLevel  ;
	private String tagNm;
	
	private String actionDeadline3;
	private String examinationOpinion3;
	private String fileId;
	private String base;
	private String bookmarkSeq;
	private String sequenceId;
	
	private String symbolType;
	private String symbolSeq;
	private String handle;
	private int modelSeq;
}
