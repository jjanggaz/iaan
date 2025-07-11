
package com.iaan.kepco.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class HierarchyDTO {

	private Integer hseq;
	private Integer parentSeq;
	private String hierarchyNm;
	private String webglId;
	private Integer hierarchyLv;
    private String hierarchyPath;
    private String orderPath;
    private Integer sortSeq;
    private String useYn;
    private String regId;
    private String regDate;
    private String modId;
    private String modDate;

    private String plantNm;
	private String unitNm;
	private String buildingNm;
	private String levelNm;
	private String rootValveNm;

}
