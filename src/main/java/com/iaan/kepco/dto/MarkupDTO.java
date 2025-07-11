package com.iaan.kepco.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class MarkupDTO {

	private Integer titleSeq;
    private String title;
    private String base64screenshot;
    private String regId;
    private String screenshot;

}
