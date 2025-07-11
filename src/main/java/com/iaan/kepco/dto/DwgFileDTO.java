package com.iaan.kepco.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DwgFileDTO {

    private String fileId;
    private String fileSeq;
    private String fileType;
    private String fileNmOri;
    private String fileNm;
    private String filePath;
    



}
