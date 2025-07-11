package com.iaan.kepco.dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.iaan.kepco.dto.ModelDTO;

@Mapper
public interface ModelMapper {
	 public List<ModelDTO> selectModelFile(ModelDTO microstation);
}
