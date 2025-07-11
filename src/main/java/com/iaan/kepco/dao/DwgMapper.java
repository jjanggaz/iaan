package com.iaan.kepco.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.BookMarkDTO;
import com.iaan.kepco.dto.BookMarkDescDTO;
import com.iaan.kepco.dto.DtdxFileDTO;
import com.iaan.kepco.dto.DwgDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.HierarchyDTO;
import com.iaan.kepco.dto.MarkupDTO;
import com.iaan.kepco.dto.PassTagDTO;
import com.iaan.kepco.dto.QualityDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.SymbolDTO;

@Mapper
public interface DwgMapper {

	public List<HierarchyDTO> selectDwgLoad(SearchDTO searchDTO);
	public List<DwgDTO> selectDwgFileList(DwgDTO dwgDTO);
	
	public int insertDwg(DwgDTO dwgDTO);
	public void updateDwg(DwgDTO dwgDTO);
	
	public List<DwgMstDTO> selectAutoCadDwgList(Map<String,String> param);
	public List<DwgMstDTO> selectArVrDwgList(Map<String,String> param);
	
	
	public List<DtdxFileDTO> selectDtdxFileList(Map<String,String> param);
	public List<DtdxFileDTO> selectHololensDtdxFileList(Map<String,String> param);
	
	
	
	
	public List<PassTagDTO> selectPassTag(Map<String,String> param);
	
	
	public List<QualityDTO> selectQualityList(Map<String,String> param);
	
	public List<SymbolDTO> selectSysmbolList(Map<String,String> param);
	
	public List<DwgMstDTO> selectActualList(Map<String,String> param);
	public void insertActual(Map<String,String> param);
	
	
	
	public List<BookMarkDTO> selectBookMarkMstList(BookMarkDTO param);
	public void insertBookMarkMst(BookMarkDTO bookMarkDTO);
	
	public void insertBookMarkTag(BookMarkDTO bookMarkDTO);
	
	
	
	public List<BookMarkDTO> selectBookMarkDescList(BookMarkDTO param);
	public void insertBookMarkDesc(BookMarkDTO bookMarkDTO);
	
		
	public List<DwgMstDTO> selectHandleList(Map<String,String> param);
	
	
	public List<MarkupDTO> selectMarkUpList(Map<String,String> param);
	
	//public List<SymbolDTO> selectSymbolMstList(Map<String,String> param);
	
	public List<BookMarkDescDTO> selectBookMarkLoadDescList(BookMarkDTO param);
	
	
	public void deleteBookMarkMst(String bookmarkSeq);
	   
	
	public int selectHandleForTagCnt(Map<String,String> param);
	
	public int deleteMarkUp(Map<String,String> param);
	public int deleteBookMarkdesc(Map<String,String> param);
	
	
	
	public List<SymbolDTO> selectSymbolMstALLList(Map<String,String> param);
	
	
	public List<SymbolDTO> selectSymbolMstList(SearchDTO param);
	public SearchDTO selectSymbolMstListCnt(SearchDTO param);
	
	
	public int insertSymbolMst(SymbolDTO param);
	
	public int deleteSymbolMst(SymbolDTO param);
	public int updateSymbolMst(SymbolDTO param);
	
	
	
	
	
	
}
