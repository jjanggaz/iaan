package com.iaan.kepco.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Data
@Getter
@Setter
public class ModelDTO {

	private Integer mSeq;     
	private String modelSeq;   
	private Integer fileDgn ;            
	private Integer fileDtdx ;      
	private Integer fileHdtdx ;   
	private Integer fileCsv  ;           
	private String fileDgnNm ;            
	private String fileDtdxNm ; 
	private String fileHdtdxNm ; 
	private String fileCsvNm  ;   
	private String dwgPlant  ;          
	private String dwgUnit    ;         
	private String dwgBuilding;        
	private String dwgLevel   ;         
	private String plantNm  ;          
	private String unitNm    ;         
	private String buildingNm;        
	private String levelNm   ;  
	private String useYn     ;          
	private String regId      ;         
	private String regDate     ;        
	private String modId       ;        
	private String modDate    ;     

	private String fileNm;
	private String fileNmOri;
	private idLvlDTO[] idLvlList;

}
