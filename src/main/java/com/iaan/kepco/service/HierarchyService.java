package com.iaan.kepco.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.iaan.kepco.dao.DwgMapper;
import com.iaan.kepco.dao.HierarchyMapper;
import com.iaan.kepco.dao.ModelMapper;
import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.DwgDTO;
import com.iaan.kepco.dto.HierarchyDTO;
import com.iaan.kepco.dto.MarkupDTO;
import com.iaan.kepco.dto.ModelDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.TreeDTO;

@Service
//@RequiredArgsConstructor
public class HierarchyService {

	@Autowired
	private HierarchyMapper hierarchyMapper;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private DwgMapper dwgMapper;

	// 트리
	public List<TreeDTO> selectHierarchyTree() {
		return hierarchyMapper.selectHierarchyTree();
	}

	// 3D모델파일
	public List<ModelDTO> selectModelFile(ModelDTO modelDTO) {
		return modelMapper.selectModelFile(modelDTO);
	}

	// dwg파일
	public List<DwgDTO> selectDwgFileList(DwgDTO dwgDTO) {
		return dwgMapper.selectDwgFileList(dwgDTO);
	}

	// dwg파일
	public List<HierarchyDTO> selectDwgLoad(SearchDTO searchDTO) {
		return dwgMapper.selectDwgLoad(searchDTO);
	}

	

	// 검색 selectbox 공통 처리
	public List<CheckDwgDTO> selectHierarchySearchResultList(SearchDTO searchDTO) {
		return hierarchyMapper.selectHierarchySearchResultList(searchDTO);
	}

	// Hierarchy Insert
	public void insertHierarchy(HierarchyDTO hierarchyDTO) {
		hierarchyMapper.insertHierarchy(hierarchyDTO);
	}

	// Hierarchy update
	public void updateHierarchy(HierarchyDTO hierarchyDTO) {
		hierarchyMapper.updateHierarchy(hierarchyDTO);
	}

	// Hierarchy 키 기준으로 삭제(Use_Flag = 'N')
	public void deleteHierarchy(HierarchyDTO hierarchyDTO) {
		hierarchyMapper.deleteHierarchy(hierarchyDTO);
	}

	// Hierarchy Insert
	public void insertHierarchyFromDwgGroup(HierarchyDTO hierarchyDTO) {
		hierarchyMapper.insertHierarchyFromDwgGroup(hierarchyDTO);
	}

	// Hierarchy Insert
	public void insertHierarchyFromDwg(HierarchyDTO hierarchyDTO) {
		hierarchyMapper.insertHierarchyFromDwg(hierarchyDTO);
	}

	// Hierarchy 상위 기준으로 삭제(Use_Flag = 'N')
	public void deleteHierarchyParent(DwgDTO dwgDTO) {
		hierarchyMapper.deleteHierarchyParent(dwgDTO);
	}
	
	
	public void insertMarkUp(MarkupDTO markupDTO) {
		hierarchyMapper.insertMarkUp(markupDTO);
	}
	
	public List<MarkupDTO> selectMarkupList(MarkupDTO markupDTO) {
		return hierarchyMapper.selectMarkupList(markupDTO);
	}
	

}


