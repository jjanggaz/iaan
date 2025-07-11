package com.iaan.kepco.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@NoArgsConstructor
public class BookMarkLoad {
	
	private Integer sequenceId  ;           
	private String groupTitle ;       
	
	private List<BookMarkDescRtnDTO> bookmarks;
	
	

}
