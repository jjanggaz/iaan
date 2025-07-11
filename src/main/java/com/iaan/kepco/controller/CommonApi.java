package com.iaan.kepco.controller;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.ComCodeDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.service.AtchFileService;
import com.iaan.kepco.service.CheckService;
import com.iaan.kepco.service.HierarchyService;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.utils.FileUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "공통API", description = "AutoCAD, AR, VR, HoloLens에서 공통으로 사용하는 API.")
@RestController
@RequiredArgsConstructor
public class CommonApi {

	@Autowired
	private HierarchyService hierarchyService;

	@Autowired
	private AtchFileService atchFileService;
	
	@Autowired
	private CheckService checkService;


	// 공통. 계층구조 SelectBox의 데이터
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = ComCodeDTO.class)))
	})
	@Operation(summary = "도면 목록 select box", hidden = false, description = "도면목록 셀렉트 박스 데이터 plan 는 부모키 012 하위는 선택된 상위 cdId , 4 level 사용시 lvlCode : PBS, LVL 로 구분자 줄것  ")
	@PostMapping("/common/hierarchySelectbox")
	public Object selectHierarchySelectboxList(@RequestBody SearchDTO searchDTO){
		Map<String,String> param = new HashMap<String,String> ();
		param.put("parentId", searchDTO.getParentId());
		param.put("lvlCode", searchDTO.getLvlCode());
		List<ComCodeDTO> comcode  = checkService.selectComCodeList(param);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(comcode)
				.build();
	}
	
	
	// 공통. 첨부파일 목록      
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = AtchFileDTO.class)))
	})
	@Operation(summary = "공통. 첨부파일 목록 ", hidden = false, description = "공통. 첨부파일 목록")
	@PostMapping("/common/atchFileList")
	public Object selectAtchFileList(@RequestBody AtchFileDTO atchFileDTO){
		//return atchFileService.selectAtchFileList(atchFileDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(atchFileService.selectAtchFileList(atchFileDTO))
				.build();
	}
	// 공통. 첨부파일 목록      
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = AtchFileDTO.class)))
	})
	@Operation(summary = "issue. 첨부파일 목록 ", hidden = false, description = "issue 첨부파일 목록")
	@PostMapping("/common/atchFileIssueList")
	public Object atchFileIssueList(@RequestBody AtchFileDTO atchFileDTO,HttpServletRequest request){
		
        String serUrl = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/kepcoenc/ISSUE_IMG";
        
        List<AtchFileDTO> rtn =	atchFileService.selectAtchIssueFileList(atchFileDTO);
		List<AtchFileDTO> rtn2 =  new ArrayList<AtchFileDTO>(); 
		
		for(AtchFileDTO ad :rtn) {
			AtchFileDTO  afd = new AtchFileDTO();
			afd.setRownum(ad.getRownum());
			afd.setFileId(ad.getFileId());
			afd.setFileSeq(ad.getFileSeq());
			afd.setFileType(ad.getFileType());
			afd.setFilePath(ad.getFilePath());
			afd.setFileNmOri(ad.getFileNmOri());
			afd.setFileNm(ad.getFileNm());
			afd.setFileLength(ad.getFileLength());
			afd.setFileStatus(ad.getFileStatus());
			afd.setRegId(ad.getRegId());
			afd.setRegDate(ad.getRegDate());
			afd.setModId(ad.getModId());
			afd.setModDate(ad.getModDate());
			afd.setFileUrl(serUrl+"/"+ad.getFileNm() );
			rtn2.add(afd);
		}
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(rtn2)
				.build();
	}
	
	
	// svg파일 읽기
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = AtchFileDTO.class)))
	})
	@Operation(summary = "svg 파일 string 조회  ", hidden = false, description = "svg 파일 string 조회 ")
	@PostMapping("/common/svgread")
	public Object svgread(@RequestBody AtchFileDTO atchFileDTO) throws Exception{
		List<AtchFileDTO> svgFile = atchFileService.selectAtchFilePath(atchFileDTO);
		Map<String,String> param = new HashMap<String,String> ();
		String filePath = svgFile.get(0).getFilePath()+svgFile.get(0).getFileNm(); // Specify the file path
		StringBuffer rtn = new StringBuffer();
		try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
                
                rtn.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
		param.put("svgfile",rtn.toString());
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(param)
				.build();
	}
		
	// svg파일 읽기
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = AtchFileDTO.class)))
	})
	@Operation(summary = "svg 파일 string 조회  ", hidden = false, description = "svg 파일 string 조회 ")
	@PostMapping("/common/svgtagread")
	public Object svgTagread(@RequestBody AtchFileDTO atchFileDTO) throws Exception{
		List<AtchFileDTO> svgFile = atchFileService.selectAtchFileTagPath(atchFileDTO);
		Map<String,String> param = new HashMap<String,String> ();
		String filePath = svgFile.get(0).getFilePath()+svgFile.get(0).getFileNm(); // Specify the file path
		StringBuffer rtn = new StringBuffer();
		try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
                rtn.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
		param.put("svgfile",rtn.toString());
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(param)
				.build();
	}
}
