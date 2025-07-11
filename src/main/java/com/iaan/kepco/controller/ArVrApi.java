package com.iaan.kepco.controller;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections4.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.session.Session;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.CheckIssueCommentDTO;
import com.iaan.kepco.dto.CheckIssueDTO;
import com.iaan.kepco.dto.ComCodeDTO;
import com.iaan.kepco.dto.DtdxFileDTO;
import com.iaan.kepco.dto.DwgFileDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.FileDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.SymbolDTO;
import com.iaan.kepco.dto.UserDTO;
import com.iaan.kepco.dto.WbsDTO;
import com.iaan.kepco.service.AtchFileService;
import com.iaan.kepco.service.CheckService;
import com.iaan.kepco.service.CommonService;
import com.iaan.kepco.service.DwgService;
import com.iaan.kepco.service.FileService;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.service.WbsService;
import com.iaan.kepco.utils.FileUtil;
import com.iaan.kepco.utils.SHA256Util;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "ArVr API", description = "ArVr 에 사용하는 API.")
@RestController
@RequiredArgsConstructor
public class ArVrApi {
	private final Logger logger = LoggerFactory.getLogger(ArVrApi.class);

	
	@Autowired
	private AtchFileService atchFileService;

	@Autowired
	private CommonService commonService;

	@Autowired
	private DwgService dwgService;

	@Autowired
	private FileService fileService;

	@Autowired
	private CheckService checkService;

	
	@Autowired
	private WbsService wbsService;

	
	@Value("${drive.path}")
	private String drivePath;

	@Value("${root.Path}")
	private String rootPath;

	@Value("${ae.filePath}")
	private String aeFolder;

	@Value("${dwg.filePath}")
	private String dwgFolder;

	@Value("${dgn.filePath}")
	private String dgnFolder;

	@Value("${issue.filePath}")
	private String issuePath;

	@Value("${drive.path}" + "${root.Path}"+ "${issue.filePath}")
	private String issueFolder;

	
	Session session;

	// 로그인
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = UserDTO.class)))
	})
	@Operation(summary = "로그인", hidden = false, description = "login")
	@PostMapping("/arvr/login")
	public RestResponse<?> loginCheck(@RequestParam("userId") String userId
			, @RequestParam("userPw") String userPw ) throws NoSuchAlgorithmException {
		// USER  ID, PW 입력 확인 
		if(userId ==  null || userId.equals("") || userPw == null || userPw.equals("") ) {
			return RestResponse.builder()
					.resultCode(ResponseEnum.LOGIN_FAIL_EMPTY_LOGIN_INFO.getResultCode()).message(ResponseEnum.LOGIN_FAIL_EMPTY_LOGIN_INFO.getResultMessage())
					.data(null)
					.build();
		}
		SHA256Util sha = new SHA256Util();
		userPw = sha.encrypt(userPw);

		UserDTO userDTO = new UserDTO();
		userDTO.setUserId(userId);
		userDTO.setPwd(userPw);
		
		UserDTO rtn =  commonService.selectLoginCheck(userDTO);
		//로그인 성공 실패 처리 
		if(rtn == null ) {
			return RestResponse.builder()
					.resultCode(ResponseEnum.LOGIN_FAIL.getResultCode()).message(ResponseEnum.LOGIN_FAIL.getResultMessage())
					.data(null)
					.build();
		}else {
			
			
			return RestResponse.builder()
					.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
					.data(commonService.selectLoginCheck(userDTO))
					.build();
		}
		
	}	
	
	//도면 조회조건  최상위는   012    level  = 013
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = ComCodeDTO.class)))
	})
	@Operation(summary = "도면 목록 select box", hidden = false, description = "도면목록 셀렉트 박스 데이터 plan 는 부모키 012 하위는 선택된 상위 cdId , 4 level 사용시 lvlCode : PBS, LVL 로 구분자 줄것  ")
	@GetMapping("/arvr/codelist")
	public Object selectComCodeList(@RequestParam("parentId") String parentId,String lvlCode) throws IOException ,Exception {
		Map<String,String> param = new HashMap<String,String> ();
		param.put("parentId", parentId);
		param.put("lvlCode", lvlCode);
		List<ComCodeDTO> comcode  = checkService.selectComCodeList(param);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(comcode)
				.build();
	}
	
	
	
	//도면 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = DwgMstDTO.class)))
	})
	@Operation(summary = "도면 목록 데이터", hidden = false, description = "input param 은 다줄것 값은 비어 있음 전제 데이터")
	@GetMapping("/arvr/dwglist")
	public Object selectDwgList(@RequestParam("dwgPlant") String dwgPlant,@RequestParam("dwgUnit") String dwgUnit,@RequestParam("dwgBuilding") String dwgBuilding,@RequestParam("dwgLevel") String dwgLevel,String tagNm) throws IOException ,Exception {

		Map<String,String> param = new HashMap<String,String>();
		
		param.put("dwgPlant", dwgPlant);
		param.put("dwgUnit", dwgUnit);
		param.put("dwgLevel", dwgLevel);
		param.put("dwgBuilding", dwgBuilding);
		param.put("tagNm", tagNm);
		
		List<DwgMstDTO> dwgmstlist = dwgService.selectArVrDwgList(param);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dwgmstlist)
				.build();
	}
	 
	//dtdx 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = DtdxFileDTO.class)))
	})
	@Operation(summary = "dtdx file id  데이터", hidden = false, description = "  ")
	@GetMapping("/arvr/dtdxlist")
	public Object selectdtdxList(@RequestParam("dwgPlant") String dwgPlant,@RequestParam("dwgUnit") String dwgUnit,@RequestParam("dwgBuilding") String dwgBuilding,@RequestParam("dwgLevel") String dwgLevel,String tagNm) throws IOException ,Exception {

		Map<String,String> param = new HashMap<String,String>();
		
		param.put("dwgPlant", dwgPlant);
		param.put("dwgUnit", dwgUnit);
		param.put("dwgLevel", dwgLevel);
		param.put("dwgBuilding", dwgBuilding);
		param.put("tagNm", tagNm);
		
		List<DtdxFileDTO> dtdxlist = dwgService.selectDtdxFileList(param);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dtdxlist)
				.build();
	}
		
	
	
	//비용정산 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = WbsDTO.class)))
	})
	@Operation(summary = "비용정산 목록 데이터", hidden = false, description = " input : tagNm ")
	@GetMapping("/arvr/costlist")
	public Object selectWbsCalcList(@RequestParam String tagNm ){
		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setTagNm(tagNm);
		
		//웹과 api 에서 사용함으로 강제로 페이징 넘거 줌  
		searchDTO.setStartRowNum(0);
		searchDTO.setPageSize(1000);
		
		List<WbsDTO> wbsDto =  wbsService.selectWbsCalcList(searchDTO);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(wbsDto)
				.build();
	}
	
	
	//공사현황 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = WbsDTO.class)))
	})
	@Operation(summary = "공사현황 목록 데이터", hidden = false, description = " input : 조회조건")
	@GetMapping("/arvr/planlist")
	public Object selectConstList(@RequestParam("dwgPlant") String dwgPlant,@RequestParam("dwgUnit") String dwgUnit,@RequestParam("dwgBuilding") String dwgBuilding,@RequestParam("dwgLevel") String dwgLevel,String tagNm) throws IOException ,Exception {
		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setDwgPlant(dwgPlant);
		searchDTO.setDwgUnit(dwgUnit);
		searchDTO.setDwgBuilding(dwgBuilding);
		searchDTO.setDwgLevel(dwgLevel);
		searchDTO.setTagNm(tagNm);
		//웹과 api 에서 사용함으로 강제로 페이징 넘거 줌  
		searchDTO.setStartRowNum(0);
		searchDTO.setPageSize(1000);
		
		List<WbsDTO> wbsDto =  wbsService.selectWbsPlanList(searchDTO);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(wbsDto)
				.build();
	}
	
	
	
	
	//arvr 도면다운로드 
	@Operation(summary = "ARVR 도면다운로드 ", hidden = false, description = "ARVR 도면다운로드 ")
	@GetMapping("/arvr/filedown")
	public Object arvrfiledown(@RequestParam("fileId") String fileId) {

		try {
			Map<String, String> param = new HashMap<String, String>();
			param.put("fileId", fileId);
			param.put("fileSeq", "0");  // 도면 파일은 파일 순번이 무조건 0 임 
			DwgFileDTO dfd = checkService.selectFileInfo(param);
			String fileName =  dfd.getFilePath() +dfd.getFileNm();
			Resource resource = fileService.getDwgFileResource(fileName);
			File file = new File(String.format("%s%s%s", dfd.getFilePath(), File.separator, resource.getFilename()));
			String contentType = "application/octet-stream";
			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
					.header("Content-Disposition",
							"attachment; filename=\"" + URLEncoder.encode(file.getName(), "utf-8") + "\"")
					.body(resource);
		} catch (IOException ex) {
			logger.info(ex.getMessage());
		} catch (Exception ex) {
			logger.info(ex.getMessage());
		}
		return null;
	}

	//issue 파일다운로드 
	@Operation(summary = "issue 파일 다운로드 ", hidden = false, description = "")
	@GetMapping("/arvr/issuefiledown")
	public Object issuefiledown(@RequestParam("fileId") String fileId ,  String fileSeq) {

		try {
		
			Map<String, String> param = new HashMap<String, String>();
			param.put("fileId", fileId);
			param.put("fileSeq", fileSeq);  // 도면 파일은 파일 순번이 무조건 0 임 
			DwgFileDTO dfd = checkService.selectFileInfo(param);
			String fileName =  dfd.getFilePath() +dfd.getFileNm();
			
			
			Resource resource = fileService.getDwgFileResource(fileName);
			
			
		
			File file = new File(String.format("%s%s%s", dfd.getFilePath(), File.separator, resource.getFilename()));
			String contentType = "application/octet-stream";
			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
					.header("Content-Disposition",
							"attachment; filename=\"" + URLEncoder.encode(file.getName(), "utf-8") + "\"")
					.body(resource);
		} catch (IOException ex) {
			logger.info(ex.getMessage());
		} catch (Exception ex) {
			logger.info(ex.getMessage());
		}
		return null;
	}

	


	// 현장설계점검 리스트
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = CheckIssueDTO.class)))
	})
	@Operation(summary = "현장설계점검 리스트", hidden = false, description = "현장설계점검 리스트 ")
	@GetMapping("/arvr/checkIssueList")
	public Object selectIssueList(@RequestParam("dwgPlant") String dwgPlant,@RequestParam("dwgUnit") String dwgUnit,@RequestParam("dwgBuilding") String dwgBuilding,@RequestParam("dwgLevel") String dwgLevel,String tagNm) throws IOException ,Exception {
		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setDwgPlant(dwgPlant);
		searchDTO.setDwgUnit(dwgUnit);
		searchDTO.setDwgBuilding(dwgBuilding);
		searchDTO.setDwgLevel(dwgLevel);
		searchDTO.setTagNm(tagNm);
		
		//웹과 api 에서 사용함으로 강제로 페이징 넘거 줌  
		searchDTO.setStartRowNum(0);
		searchDTO.setPageSize(1000);

		List<CheckIssueDTO> cilist = checkService.selectIssueList(searchDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(cilist)
				.build();
	}

	// 현장설계점검  상세 조회
	// 현장설계점검 리스트
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = CheckIssueDTO.class)))
	})
	@Operation(summary = "현장설계점검  상세 조회", hidden = false, description = "현장설계점검  상세 조회")
	@GetMapping("/arvr/checkIssueView")
	public RestResponse<?> selectIssueOne(@RequestParam("issueSeq") int issueSeq) throws IOException ,Exception {
		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setIssueSeq(issueSeq);
		
		CheckIssueDTO cidata = checkService.selectIssueOne(searchDTO);
		List<FileDTO> fileDto = checkService.selectIssueFile(searchDTO);
		cidata.setFiles(fileDto);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(cidata)
				.build();
		
	}

	// 현장설계점검 등록
	@Operation(summary = "현장설계점검 등록", hidden = false, description = "현장설계점검 등록")
	@PostMapping("/arvr/checkIssueInsert")
	public RestResponse<?> checkIssueInsert(@RequestParam("tagSeq") int tagSeq
											, @RequestParam("issueTitle") String issueTitle
											, @RequestParam("issueConts") String issueConts
											, @RequestParam("regId") String regId             
											, @RequestParam("file") List<MultipartFile> file   //필수 아님
			) throws IOException ,Exception {
		
        int fileId  = 0;
     
 		int i = 0;
		if (!CollectionUtils.isEmpty(file)) {
			fileId  = atchFileService.selectAtchFileId();
			
		
			for(MultipartFile mfile : file ) {
				String oriFilename = mfile.getOriginalFilename();
				String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );
				//String extension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
	
				UUID uuid = UUID.randomUUID();
				String newFileName = uuid.toString() + extension;
				
				FileUtil.fileUpload(issueFolder, mfile, newFileName);
	
				AtchFileDTO atchFileDTO = new AtchFileDTO();
				
				atchFileDTO.setFileId(fileId);
				
				
				atchFileDTO.setFileSeq(i);
				atchFileDTO.setFileType(null);
				atchFileDTO.setFilePath(issueFolder);
				atchFileDTO.setFileNmOri(mfile.getOriginalFilename());
				
				atchFileDTO.setFileNm(newFileName);
				atchFileDTO.setFileLength(mfile.getSize());
				atchFileDTO.setFileStatus("U");
				atchFileDTO.setRegId(regId);
				atchFileDTO.setModId(regId);
				
				atchFileService.insertMultiAtchFile(atchFileDTO);
				
				i++;
			}
		}
		
		// 이슈 데이터 등록
 		CheckIssueDTO checkIssueDTO = new CheckIssueDTO();
 		checkIssueDTO.setTagSeq(tagSeq);
 		checkIssueDTO.setIssueTitle(issueTitle);
 		checkIssueDTO.setIssueConts(issueConts);
 		
 		if(fileId != 0) {
 			checkIssueDTO.setFileId(fileId);
 		}else {
 			checkIssueDTO.setFileId(null);
 		}
 		
 		checkIssueDTO.setRegId(regId);
 		checkIssueDTO.setModId(regId);
 		checkService.insertIssue(checkIssueDTO);
 		int issueSeq = checkIssueDTO.getIssueSeq();
		
 		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(issueSeq)
				.build();
	}

	// 현장설계점검 댓글 리스트
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = CheckIssueCommentDTO.class)))
	})
	@Operation(summary = "현장설계점검 댓글 리스트", hidden = false, description = "현장설계점검 댓글 리스트")
	@GetMapping("/arvr/checkIssueCommentList")
	public RestResponse<?> selectIssueCommentList(@RequestParam("issueSeq") int issueSeq) throws IOException ,Exception {

		SearchDTO searchDTO = new SearchDTO();
		searchDTO.setIssueSeq(issueSeq);

		List<CheckIssueCommentDTO> cicList  = checkService.selectIssueCommentList(searchDTO);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(cicList)
				.build();
	}


	// 현장설계점검 댓글 등록
	@ResponseBody
	@PostMapping("/arvr/checkIssueCommentInsert")
	public RestResponse<?> checkIssueCommentInsert(@RequestParam("issueSeq") int issueSeq
											, @RequestParam("parentIcSeq") int parentIcSeq
											, @RequestParam("commentConts") String commentConts
											, @RequestParam("regId") String regId
			) throws IOException ,Exception {

		CheckIssueCommentDTO checkIssueCommentDTO = new CheckIssueCommentDTO();
		checkIssueCommentDTO.setIssueSeq(issueSeq);
		checkIssueCommentDTO.setParentIcSeq(parentIcSeq);
		checkIssueCommentDTO.setCommentConts(commentConts);
		checkIssueCommentDTO.setRegId(regId);


		return RestResponse.CodeWithData()
				.data(checkService.insertIssueComment(checkIssueCommentDTO))
				.build();
	}
	
	
	// 실적 입력 
	
	@ResponseBody
	@Operation(summary = "공사 실적 입력", hidden = false, description = "")
	@PostMapping("/arvr/insertactual")
	@Transactional
	public RestResponse<?> insertwbsActual(@RequestParam("dwgSeq") int dwgSeq
											, @RequestParam("buildContents") String buildContents
											, @RequestParam("handle") String handle
											, @RequestParam("regId") String regId
			) throws IOException ,Exception {

		try {
		String[] handleList = handle.toString().split(",");
		
		for(int i=0;i<handleList.length;i++) {
			Map<String, String> param = new HashMap<String, String>();
			param.put("dwgSeq", dwgSeq+"");
			param.put("buildContents", buildContents);
			param.put("handle", handleList[i]);   //핸들값 여러개 들어옴 , 쉼표 구
			param.put("regId", regId);
			dwgService.insertActual(param);
		}
		
		 return RestResponse.builder()
		 .resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.
		 SUCCESS.getResultMessage()) .data(null) .build();
		}catch(Exception e) {
			return RestResponse.builder().resultCode("45000").message("HANDLE NOT FOUND") .data(null)
					  .build();
			
		}
		
	}
	
	
	
	
	
	
	
	
	//실적 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = DwgMstDTO.class)))
	})
	@Operation(summary = "실적 목록 데이터", hidden = false, description = "")
	@GetMapping("/arvr/actuallist")
	public Object selectActualList(@RequestParam("dwgPlant") String dwgPlant,@RequestParam("dwgUnit") String dwgUnit,@RequestParam("dwgBuilding") String dwgBuilding,@RequestParam("dwgLevel") String dwgLevel,String tagNm) throws IOException ,Exception {

		Map<String,String> param = new HashMap<String,String>();
		
		param.put("dwgPlant", dwgPlant);
		param.put("dwgUnit", dwgUnit);
		param.put("dwgLevel", dwgLevel);
		param.put("dwgBuilding", dwgBuilding);
		param.put("tagNm", tagNm);
		
		List<DwgMstDTO> dwgmstlist = dwgService.selectActualList(param);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dwgmstlist)
				.build();
	}
	
	
	//handle 조회   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = DwgMstDTO.class)))
	})
	@Operation(summary = "실적 목록 데이터", hidden = false, description = "")
	@GetMapping("/arvr/handlelist")
	public Object selecthandlelist(@RequestParam("dwgSeq") String dwgSeq) throws IOException ,Exception {

		Map<String,String> param = new HashMap<String,String>();
		
		param.put("dwgSeq", dwgSeq);
		
		List<DwgMstDTO> handlelist = dwgService.selectHandleList(param);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(handlelist)
				.build();
	}
	
	
	
	//SYMBOL 데이터 조회    private int symbolSeq;
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = DwgMstDTO.class)))
	})
	@Operation(summary = "심볼 목록 데이터", hidden = false, description = "ex = symbolSeq : 1,symbolType :ROOT_VALVE , symbolOd : 1/2 , fileNm :Y-GLOBE VALVE_1_2.dtdx ,fileUrl :http://localhost:8090/kepcoenc/SYMBOL/Y-GLOBE_VALVE_1_2.dtdx  ")
	@GetMapping("/arvr/symbollist")
	public Object selectsymbollist(HttpServletRequest request) throws IOException ,Exception {

		String path = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/kepcoenc/SYMBOL/";
		Map<String,String> param = new HashMap<String,String>();
		
		List<SymbolDTO> symBollist = dwgService.selectSymbolMstALLList(param);
		
		for(int i = 0; i < symBollist.size(); i++) {
			symBollist.get(i).setFileUrl(path + symBollist.get(i).getFileNm());
		}

		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(symBollist)
				.build();
	}
	
	
	
	
	
}
