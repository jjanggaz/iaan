package com.iaan.kepco.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DtdxFileDTO {

    private String fileNm;
    private String fileId;
    
    private String tagSeq;
    private String dwgSeq;
    private String tagNm;
    //private MultipartFile file;



}
