package com.iaan.kepco.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iaan.kepco.dto.BookMarkDTO;
import com.iaan.kepco.dto.BookMarkDescDTO;
import com.iaan.kepco.dto.BookMarkDescRtnDTO;
import com.iaan.kepco.dto.BookMarkLoad;
import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.ComCodeDTO;
import com.iaan.kepco.dto.DwgDTO;
import com.iaan.kepco.dto.DwgFileDTO;
import com.iaan.kepco.dto.HierarchyDTO;
import com.iaan.kepco.dto.MarkupDTO;
import com.iaan.kepco.dto.ModelDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.SymbolDTO;
import com.iaan.kepco.dto.cameraDTO;
import com.iaan.kepco.dto.cameraDTO2;
import com.iaan.kepco.dto.idLvlDTO;
import com.iaan.kepco.service.DwgService;
import com.iaan.kepco.service.FileService;
import com.iaan.kepco.service.HierarchyService;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.utils.FileUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
public class ModelApi {
	private final Logger logger = LoggerFactory.getLogger(ModelApi.class);

	@Autowired
	private HierarchyService hierarchyService;
	
	@Autowired
	private FileService fileService;
	
	@Autowired
	private DwgService dwgService;

	@Value("${dwg.filePath}")
	private String dwgfolder;

	@Value("${dtdx.filePath}")
	private String dtdxfolder;
	
	@Value("${json.filePath}")
	private String jsonfolder;
	
	@Value("${symbol.filePath}")
	private String symbolPath;
	


	@ResponseBody
	@PostMapping("/d3api/hierarchyTree")
	public RestResponse<?> selectHierarchyTree(){

		return RestResponse.CodeWithData()
			.data(hierarchyService.selectHierarchyTree())
			.build();
	}

	@ResponseBody
	@PostMapping("/d3api/modelFile")
	public List<ModelDTO> selectModelFile(@RequestBody ModelDTO modelDTO, HttpServletRequest request){
		String path = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+dtdxfolder;
		List<ModelDTO> modelList = hierarchyService.selectModelFile(modelDTO);
		for(int i = 0; i < modelList.size(); i++) {
			modelList.get(i).setFileNm(path + modelList.get(i).getFileNm());
		}
		return modelList;
	}

	// 트리에서 선택된 경로들을 기준으로 실제 선택된 루트밸브의 목록을 가져옴
	// 빌딩이나 레벨을 선택한 경우 트리에서 실제 선택된 루트밸브를 찾기 어려워 DB로 처리
	@ResponseBody
	@PostMapping("/d3api/dwgLoad")
	public List<HierarchyDTO> selectDwgLoad(@RequestBody SearchDTO searchDTO, HttpServletRequest request){
		idLvlDTO[] id = searchDTO.getIdLvlList();
		List<HierarchyDTO> hierarchyList = hierarchyService.selectDwgLoad(searchDTO);
		return hierarchyList;
	}
	
	@ResponseBody
	@PostMapping("/d3api/markupdel")
	public Object deleteMakrup(@RequestBody SearchDTO searchDTO){
		Map<String, String> param = new HashMap<>();
		param.put("base", searchDTO.getBase());
		
		dwgService.deleteMarkUp(param);
		return null;
	}
	
	@ResponseBody
	@PostMapping("/d3api/bookmarkdescdel")
	public Object deleteBookMarkdesc(@RequestBody SearchDTO searchDTO){
		Map<String, String> param = new HashMap<>();
		param.put("bookmarkSeq", searchDTO.getBookmarkSeq());
		param.put("sequenceId", searchDTO.getSequenceId());
		dwgService.deleteBookMarkdesc(param);
		return null;
	}
	
	
	
	
	// 초기화면 로그인 사용자 마크업 데이터 가져오기 
	@ResponseBody
	@PostMapping("/d3api/markupRegList")
	public List<MarkupDTO> selectmarkuplist(HttpServletRequest request){
		HttpSession session = request.getSession();
		String loginUserId = "";
		if(session.getAttribute("UserId") == null) {
			loginUserId = "admin";
		}else {
			loginUserId = session.getAttribute("UserId").toString();
		}
		
		Map<String, String> param = new HashMap<>();
		param.put("regId", loginUserId);
		List<MarkupDTO>  markupDTOList = dwgService.selectMarkUpList(param);
		return markupDTOList;
	}
	

	// 트리에서 선택된 경로들을 기준으로 실제 선택된 루트밸브의 Json파일 목록을 가져옴
	// 하나의 Json파일이 여러 루트밸브에 나오는 경우때문에 실제 파일 단위로 파일을 가져오기 위한 처리.
	@ResponseBody
	@PostMapping("/d3api/dwgFile")
	public List<DwgDTO> selectDwgFileList(@RequestBody DwgDTO dwgDTO, HttpServletRequest request){

		String path = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+dwgfolder;

		List<DwgDTO> dwgList = hierarchyService.selectDwgFileList(dwgDTO); 

		for(int i = 0; i < dwgList.size(); i++) {
			dwgList.get(i).setDwgNum(path + dwgList.get(i).getJsonFileNm());
		}

		return dwgList;
	}

	@ResponseBody
	@PostMapping("/d3api/hierarchySearchResult")
	public List<CheckDwgDTO> selectHierarchySearchResultList(@RequestBody SearchDTO searchDTO){
		List<CheckDwgDTO> hierarchyList = hierarchyService.selectHierarchySearchResultList(searchDTO);
		return hierarchyList;
	}

	
	// 트리에서 선택된 경로들을 기준으로 실제 선택된 루트밸브의 목록을 가져옴
	// 빌딩이나 레벨을 선택한 경우 트리에서 실제 선택된 루트밸브를 찾기 어려워 DB로 처리
	@ResponseBody
	@PostMapping("/d3api/markupsave")
	public RestResponse<?> markupsave(@RequestBody MarkupDTO markupDTO, HttpServletRequest request){
	//public RestResponse<?> markupsave(@RequestParam String base64Screenshot ,String title){
			
		HttpSession session = request.getSession();
		String loginUserId = "";
		if(session.getAttribute("UserId") == null) {
			loginUserId = "admin";
		}else {
			loginUserId = session.getAttribute("UserId").toString();
		}
	
		markupDTO.setRegId(loginUserId);
		
		hierarchyService.insertMarkUp(markupDTO);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(null)
				.build();
	}


	//마크업 조회 
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = ComCodeDTO.class)))
	})
	@Operation(summary = "", hidden = false, description = " ")
	@PostMapping("/d3api/markuplist")
	public Object selectComCodeList(@RequestBody  MarkupDTO markupDTO) throws IOException ,Exception {
		
		
		List<MarkupDTO>  markuplist = hierarchyService.selectMarkupList(markupDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(markuplist)
				.build();
	}
		
	
	
	
	@Operation(summary = "북마크 그룹 저장", hidden = false, description = "")
	@PostMapping("/d3api/bookmarksave")
	public Object insertBookMarkMst1(@RequestBody  BookMarkDTO bookMarkDTO) throws IOException ,Exception {
		
		dwgService.insertBookMarkMst(bookMarkDTO);
		
	
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(bookMarkDTO)
				.build();
	}
	//북마크 저장 
	
	@Operation(summary = "북마크 그룹 저장", hidden = false, description = "")
	@PostMapping("/d3api/bookmarksave2")
	public Object insertBookMarkMst(@RequestBody  BookMarkDTO bookMarkDTO) throws IOException ,Exception {
		
		// 북마크 연결 tag 정보 확인하기  
		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setIdLvlList(bookMarkDTO.getIdLvlList());
		searchDTO.setHiSeqList(bookMarkDTO.getHiSeqList());
		List<HierarchyDTO> hierarchyList = hierarchyService.selectDwgLoad(searchDTO);
		
		dwgService.insertBookMarkMst(bookMarkDTO);
		
		for(HierarchyDTO hd :hierarchyList) {
			BookMarkDTO bmd = new BookMarkDTO();
			bmd.setBookmarkSeq(bookMarkDTO.getBookmarkSeq());
			bmd.setTagSeq(hd.getHseq());
			bmd.setRegId(bookMarkDTO.getRegId());
			dwgService.insertBookMarkTag(bmd);
		}
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(bookMarkDTO)
				.build();
	}
	//북마크 삭제 
	@Operation(summary = "북마크 그룹 삭제", hidden = false, description = "")
	@PostMapping("/d3api/bookmarkdel")
	public Object deleteBookMarkMst(@RequestParam  String  bookmarkSeq) throws IOException ,Exception {
		
		
		dwgService.deleteBookMarkMst(bookmarkSeq);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(null)
				.build();
	}
	
	
	
	
	
	
	//북마크 그룹 목록
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = BookMarkDTO.class)))
	})
	@Operation(summary = "북마크 그룹 목록", hidden = false, description = "")
	@PostMapping("/d3api/bookmarkfind")
	public Object selectBookMarkMst(@RequestBody  BookMarkDTO bookMarkSearch) throws IOException ,Exception {
		
		
		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setIdLvlList(bookMarkSearch.getIdLvlList());
		searchDTO.setHiSeqList(bookMarkSearch.getHiSeqList());
		List<HierarchyDTO> hierarchyList = hierarchyService.selectDwgLoad(searchDTO);
		
		String[] taglist = new String[hierarchyList.size()];
		int i = 0;
		for( HierarchyDTO hd : hierarchyList) {
			taglist[i] = hd.getHseq().toString();
			i++;
		}
		String result = String.join(",", taglist);
		bookMarkSearch.setTagList(taglist);
		bookMarkSearch.setTagNum(result);
		List<BookMarkDTO> bookmark = dwgService.selectBookMarkMstList(bookMarkSearch);
		List<BookMarkLoad> bml = new ArrayList<BookMarkLoad>();
		for(BookMarkDTO  bmd: bookmark) {
			BookMarkDTO bookMarkDTO = new BookMarkDTO();
			bookMarkDTO.setBookmarkSeq(bmd.getBookmarkSeq());
			List<BookMarkDescDTO> bookmardesc = dwgService.selectBookMarkLoadDescList(bookMarkDTO);
			
			BookMarkLoad bookMarkLoad = new BookMarkLoad();
			bookMarkLoad.setGroupTitle(bmd.getTitle());
			bookMarkLoad.setSequenceId(bmd.getBookmarkSeq());
			
			List<BookMarkDescRtnDTO> rtnList = new ArrayList<BookMarkDescRtnDTO>();
			for(BookMarkDescDTO dmkdt :bookmardesc) {
				BookMarkDescRtnDTO bmdrd = new BookMarkDescRtnDTO();
				bmdrd.setSequenceId(dmkdt.getSequenceId());
				bmdrd.setAnimateDelay(dmkdt.getAnimateDelay());
				bmdrd.setAnimateSpeed(dmkdt.getAnimateSpeed());
					
				JSONObject jsonObject = new JSONObject(dmkdt.getCameraPosition());
				cameraDTO cd = new cameraDTO();
				BigDecimal xValue = jsonObject.getBigDecimal("x");
				BigDecimal yValue = jsonObject.getBigDecimal("y");
				BigDecimal zValue = jsonObject.getBigDecimal("z");
				BigDecimal wValue = null;
				
				cd.setX(xValue);
				cd.setY(yValue);
				cd.setZ(zValue);
				bmdrd.setCameraPosition(cd);
				
				jsonObject = new JSONObject(dmkdt.getCameraRotation());
				cameraDTO2 cd2 = new cameraDTO2();
				 xValue = jsonObject.getBigDecimal("x");
				 yValue = jsonObject.getBigDecimal("y");
				 zValue = jsonObject.getBigDecimal("z");
				 wValue = jsonObject.getBigDecimal("w");
				
				 cd2.setX(xValue);
				 cd2.setY(yValue);
				 cd2.setZ(zValue);
				 cd2.setW(wValue);
				bmdrd.setCameraRotation(cd2);
				
				
				jsonObject = new JSONObject(dmkdt.getCameraTarget());
				cd = new cameraDTO();
				 xValue = jsonObject.getBigDecimal("x");
				 yValue = jsonObject.getBigDecimal("y");
				 zValue = jsonObject.getBigDecimal("z");
				
				cd.setX(xValue);
				cd.setY(yValue);
				cd.setZ(zValue);
				
				bmdrd.setCameraTarget(cd);
				
				rtnList.add(bmdrd);
				
			}
			bookMarkLoad.setBookmarks(rtnList);
			bml.add(bookMarkLoad);
			
			
			
		}
		
		
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(bml)
				.build();
	}
	
	//북마크 
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = BookMarkDTO.class)))
	})
	@Operation(summary = "북마크 상세 목록", hidden = false, description = "")
	@PostMapping("/d3api/bookmarkdescfind")
	public Object selectBookMarkdesc(@RequestBody  BookMarkDTO bookMarkDTO) throws IOException ,Exception {
		
		
		List<BookMarkDTO> bookmardesc = dwgService.selectBookMarkDescList(bookMarkDTO);
		
	
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(bookmardesc)
				.build();
	}
	
	 
	//북마크 저장 
	@Operation(summary = "북마크 저장", hidden = false, description = "")
	@PostMapping("/d3api/bookmarkdescsave")
	public Object insertBookMarkDesc(@RequestBody  BookMarkDTO bookMarkDTO) throws IOException ,Exception {
		
		
		dwgService.insertBookMarkDesc(bookMarkDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(null)
				.build();
	}
		
	

	
	//심볼데이터 조회 
	@Operation(summary = "심볼데이터 조회", hidden = false, description = "")
	@PostMapping("/d3api/symbollist")
	public Map<String, Object> selectsymbollist(@RequestBody SearchDTO searchDTO) throws IOException ,Exception {
		
		
		Map<String, Object> param = new HashMap<String, Object>();
		
		//List<SymbolDTO> symbolDTO = dwgService.selectSymbolMstList(map);
		
		param.put("list", dwgService.selectSymbolMstList(searchDTO));
		param.put("totalDataCnt", dwgService.selectSymbolMstListCnt(searchDTO).getTotalDataCnt());
	
		return param;
		
	}
	
	
	
	//심볼  파일다운로드 
	@Operation(summary = "심볼 파일 다운로드 ", hidden = false, description = "")
	@GetMapping("/d3api/symbolfiledown")
	public Object symbolfiledown(@RequestParam("symbolSeq") String symbolSeq ) {

		try {
			SearchDTO searchDTO = new SearchDTO();
			
			searchDTO.setSymbolSeq(symbolSeq);
			searchDTO.setPageSize(1);
			
			
			List<SymbolDTO> symbolDTO = dwgService.selectSymbolMstList(searchDTO);
			
			if(symbolDTO.size() == 0) {
				return null;
			}else {
			
			String fileName =  symbolDTO.get(0).getFilePath()+symbolDTO.get(0).getFileNm();
			File file = new File(fileName);
			
			if (!file.exists()) {
				System.out.println("파일없음");
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        }
			// InputStreamResource를 사용하여 파일을 읽어들임
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName());
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
            headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(file.length()));

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
			}
		} catch (IOException ex) {
			//System.out.println("ddddddddddddddddddddd"+ex.)
			System.out.println(ex.getMessage());
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}
		return null;
	}
	
	@Operation(summary = "심볼저장 ", hidden = false, description = "")
	@PostMapping("/d3api/symbolinsert")
	public Object symbolinsert( @RequestParam("symbolType") String symbolType, @RequestParam("symbolOd") String symbolOd, @RequestParam("symbolSeq") String symbolSeq
			, @RequestParam("filesymbol") MultipartFile filesymbol,HttpServletRequest request) throws IOException {
		//파일 저장 
	
		HttpSession session = request.getSession();
		String loginUserId = "";
		if(session.getAttribute("UserId") == null) {
			loginUserId = "admin";
		}else {
			loginUserId = session.getAttribute("UserId").toString();
		}
		
		String oriFilename = filesymbol.getOriginalFilename();
		String newFileName = oriFilename;
		FileUtil.fileUpload(symbolPath, filesymbol, newFileName);
	
		//데이터 저장 
		SymbolDTO symbolDTO = new SymbolDTO();
		
		symbolDTO.setSymbolType(symbolType);
		if(symbolSeq.equals("")) {
			symbolDTO.setSymbolSeq(null);
		}else {
			symbolDTO.setSymbolSeq(Integer.parseInt(symbolSeq));   
		}
		
		symbolDTO.setSymbolOd(symbolOd);
		symbolDTO.setRegId(loginUserId);
		symbolDTO.setFileNm(newFileName);
		symbolDTO.setFilePath(symbolPath);
		
		dwgService.insertSymbolMst(symbolDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(null)
				.build();
	}
	
	//심볼데이터 조회 
	@Operation(summary = "심볼데이터 조회", hidden = false, description = "")
	@PostMapping("/d3api/symboldelete")
	public Object deletesymbollist(@RequestBody SymbolDTO searchDTO) throws IOException ,Exception {
		
		
		dwgService.deleteSymbolMst(searchDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(null)
				.build();
		
	}
	//심볼데이터 조회 
	@Operation(summary = "심볼데이터 조회", hidden = false, description = "")
	@PostMapping("/d3api/handlefind")
	public Object selectHandleForTagCnt(@RequestBody SearchDTO searchDTO) throws IOException ,Exception {
		
		Map<String, String> param = new HashMap<String, String>();
		param.put("dwgSeq", searchDTO.getDwgSeq()+"");
		param.put("handle", searchDTO.getHandle());
		
		
		int handcnt = dwgService.selectHandleForTagCnt(param);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(handcnt)
				.build();
		
	}
	
	
	
	
	
	

}
