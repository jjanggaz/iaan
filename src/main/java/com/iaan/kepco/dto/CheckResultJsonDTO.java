package com.iaan.kepco.dto;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class CheckResultJsonDTO {
	private List<CheckResultDTO> checkResultDTOJson;
}
