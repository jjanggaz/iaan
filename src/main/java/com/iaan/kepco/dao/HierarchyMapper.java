package com.iaan.kepco.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.DwgDTO;
import com.iaan.kepco.dto.HierarchyDTO;
import com.iaan.kepco.dto.MarkupDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.TreeDTO;

@Mapper
public interface HierarchyMapper {
    public List<TreeDTO> selectHierarchyTree();
   
    public List<CheckDwgDTO> selectHierarchySearchResultList(SearchDTO searchDTO);

    public void insertHierarchy(HierarchyDTO hierarchyDTO);
    public void updateHierarchy(HierarchyDTO hierarchyDTO);
    public void deleteHierarchy(HierarchyDTO hierarchyDTO);

    public void insertHierarchyFromDwgGroup(HierarchyDTO hierarchyDTO);
    public void insertHierarchyFromDwg(HierarchyDTO hierarchyDTO);
    public void deleteHierarchyParent(DwgDTO dwgDTO);

    public void insertMarkUp(MarkupDTO markupDTO);
    public List<MarkupDTO> selectMarkupList(MarkupDTO markupDTO);


}



