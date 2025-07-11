package com.iaan.kepco.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.DwgMapper;
import com.iaan.kepco.dto.BookMarkDTO;
import com.iaan.kepco.dto.BookMarkDescDTO;
import com.iaan.kepco.dto.DtdxFileDTO;
import com.iaan.kepco.dto.DwgDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.MarkupDTO;
import com.iaan.kepco.dto.PassTagDTO;
import com.iaan.kepco.dto.QualityDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.SymbolDTO;

@Service
//@RequiredArgsConstructor
public class DwgService {

	@Autowired
	private DwgMapper dwgMapper;

	public List<DwgDTO> selectDwgFileList(DwgDTO dwgDTO) {
		return dwgMapper.selectDwgFileList(dwgDTO);
	}

	public int insertDwg(DwgDTO dwgDTO) {
		return dwgMapper.insertDwg(dwgDTO);
	}

	public void updateDwg(DwgDTO dwgDTO) {
		dwgMapper.updateDwg(dwgDTO);
	}
    //autocad 목록 조회
	public List<DwgMstDTO> selectAutoCadDwgList(Map<String,String> param) {
		return dwgMapper.selectAutoCadDwgList(param);
	}
	
	
	public List<DwgMstDTO> selectArVrDwgList(Map<String,String> param) {
		return dwgMapper.selectArVrDwgList(param);
	}
	
	
	public List<DtdxFileDTO> selectDtdxFileList(Map<String,String> param) {
		return dwgMapper.selectDtdxFileList(param);
	}
	public List<DtdxFileDTO> selectHololensDtdxFileList(Map<String,String> param) {
		return dwgMapper.selectHololensDtdxFileList(param);
	}
	
	
	
	public List<PassTagDTO> selectPassTag(Map<String,String> param) {
		return dwgMapper.selectPassTag(param);
	}
	
	public List<QualityDTO> selectQualityList(Map<String,String> param) {
		return dwgMapper.selectQualityList(param);
	}
	public List<SymbolDTO> selectSysmbolList(Map<String,String> param) {
		return dwgMapper.selectSysmbolList(param);
	}

	public List<DwgMstDTO> selectActualList(Map<String,String> param) {
		return dwgMapper.selectActualList(param);
	}
	
	public void insertActual(Map<String,String> param) {
		 dwgMapper.insertActual(param);
	}
	
	
	
	public List<BookMarkDTO> selectBookMarkMstList(BookMarkDTO param) {
		return dwgMapper.selectBookMarkMstList(param);
	}
	
	public void insertBookMarkMst(BookMarkDTO bookMarkDTO) {
		 dwgMapper.insertBookMarkMst(bookMarkDTO);
	}
	
	public List<BookMarkDTO> selectBookMarkDescList(BookMarkDTO param) {
		return dwgMapper.selectBookMarkDescList(param);
	}
	
	public void insertBookMarkDesc(BookMarkDTO bookMarkDTO) {
		 dwgMapper.insertBookMarkDesc(bookMarkDTO);
	}
	

	public List<DwgMstDTO> selectHandleList(Map<String,String> param){
		return dwgMapper.selectHandleList(param);
	};
	public List<MarkupDTO> selectMarkUpList(Map<String,String> param){
		return dwgMapper.selectMarkUpList(param);
	};
	
	public List<SymbolDTO> selectSymbolMstList(SearchDTO param){
		return dwgMapper.selectSymbolMstList(param);
	};
	
	public  List<SymbolDTO>  selectSymbolMstALLList(Map<String,String> param) {
		
		return dwgMapper.selectSymbolMstALLList( param);
	};
	public SearchDTO selectSymbolMstListCnt(SearchDTO param) {
		
		return dwgMapper.selectSymbolMstListCnt(param);
	};
	
	
	public int insertSymbolMst(SymbolDTO param) {
		return dwgMapper.insertSymbolMst(param);
	}
	public int deleteSymbolMst(SymbolDTO param) {
		return dwgMapper.deleteSymbolMst(param);
	}
	
	public int updateSymbolMst(SymbolDTO param) {
		return dwgMapper.updateSymbolMst(param);
	}

	
	public List<BookMarkDescDTO> selectBookMarkLoadDescList(BookMarkDTO param) {
		return dwgMapper.selectBookMarkLoadDescList(param);
	}
	
	
	public void deleteBookMarkMst(String bookmarkSeq) {
		 dwgMapper.deleteBookMarkMst(bookmarkSeq);
		
	}
	
	public int selectHandleForTagCnt(Map<String,String> param) {
		return dwgMapper.selectHandleForTagCnt(param);
	}
	
	public void deleteMarkUp(Map<String,String> param) {
		 dwgMapper.deleteMarkUp(param);
	}
	public int deleteBookMarkdesc(Map<String,String> param) {
		
		return dwgMapper.deleteBookMarkdesc(param);
	}
	
	
	public void insertBookMarkTag(BookMarkDTO bookMarkDTO) {
		 dwgMapper.insertBookMarkTag(bookMarkDTO);
	}
	
	
}


