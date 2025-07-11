package com.iaan.kepco.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TestDTO {

    private String dwgId;
    private String dwgNum;
    private String dwgCd;
}
