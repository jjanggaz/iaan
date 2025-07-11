package com.iaan.kepco.controller;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.session.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.CheckIssueCommentDTO;
import com.iaan.kepco.dto.CheckIssueDTO;
import com.iaan.kepco.dto.DtdxFileDTO;
import com.iaan.kepco.dto.DwgFileDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.FileDTO;
import com.iaan.kepco.dto.SearchDTO;
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

@Tag(name = "HoloLens API", description = "HoloLens 에 사용하는 API.")
@RestController
@RequiredArgsConstructor
public class HoloLensApi {
	private final Logger logger = LoggerFactory.getLogger(HoloLensApi.class);

	
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

	@Value("${drive.path}" + "${root.Path}" + "${issue.filePath}")
	private String issueFolder;

	
	Session session;

	// 로그인
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = UserDTO.class)))
	})
	@Operation(summary = "로그인", hidden = false, description = "login")
	@PostMapping("/hololens/login")
	public RestResponse<?> loginCheck(@RequestParam("userId") String userId
			, @RequestParam("userPw") String userPw) throws NoSuchAlgorithmException {
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
	/*
	//도면 조회조건  최상위는   012    level  = 013
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = ComCodeDTO.class)))
	})
	@Operation(summary = "도면 목록 select box", hidden = false, description = "도면목록 셀렉트 박스 데이터 plan 는 부모키 012 하위는 선택된 상위 cdId , 4 level 사용시 lvlCode : PBS, LVL 로 구분자 줄것  ")
	@GetMapping("/hololens/codelist")
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
	
	
	*/
	//도면 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = DwgMstDTO.class)))
	})
	@Operation(summary = "센싱라인 데이터 목록", hidden = false, description = "input : dwgPbs (321)")
	@GetMapping("/hololens/dwglist")
	public Object selectDwgList(@RequestParam("dwgPbs") String dwgPbs) throws IOException ,Exception {

		Map<String,String> param = new HashMap<String,String>();
		
		param.put("dwgPbs", dwgPbs);
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
	@Operation(summary = "센싱라인에 포함된 dtdx file 목록 2D , 3D 데이터", hidden = false, description = "input : tagNm (rootvalve) ")
	@GetMapping("/hololens/dtdxlist")
	public Object selectdtdxList(@RequestParam("tagNm") String tagNm) throws IOException ,Exception {

		Map<String,String> param = new HashMap<String,String>();

		param.put("tagNm", tagNm);
		
		//3D MODEL 데이타 추가 해야함 . 
		
		List<DtdxFileDTO> dtdxlist = dwgService.selectHololensDtdxFileList(param);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dtdxlist)
				.build();
	}
		

	
	//hololens 도면다운로드 
	@Operation(summary = "hololens 파일 다운로드 ", hidden = false, description = "input : fileId  ")
	@GetMapping("/hololens/filedown")
	public Object hololensfiledown(@RequestParam("fileId") String fileId) {
		
		try {
			Map<String, String> param = new HashMap<String, String>();
			param.put("fileId", fileId);
			param.put("fileSeq", "0");  // 도면 파일은 파일 순번이 무조건 0 임 
			DwgFileDTO dfd = checkService.selectFileInfo(param);
			String fileName =  dfd.getFilePath()+dfd.getFileNm();
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

	
	
	
	
	
	//비용정산 목록   
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = WbsDTO.class)))
	})
	@Operation(summary = "비용정산 목록 데이터", hidden = false, description = " input : tagNm ")
	@GetMapping("/hololens/costlist")
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
	@Operation(summary = "공사현황 목록 데이터", hidden = false, description = " input : tagNm")
	@GetMapping("/hololens/planlist")
	public Object selectConstList(@RequestParam("tagNm") String tagNm) throws IOException ,Exception {
		SearchDTO searchDTO = new SearchDTO();
	
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
	
	
	
	
	
   

	// 현장설계점검 리스트
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = CheckIssueDTO.class)))
	})
	@Operation(summary = "현장설계점검 리스트", hidden = false, description = "현장설계점검 리스트 ")
	@GetMapping("/hololens/checkIssueList")
	public Object selectIssueList(@RequestParam("tagNm") String tagNm) throws IOException ,Exception {
		SearchDTO searchDTO = new SearchDTO();
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
	@GetMapping("/hololens/checkIssueView")
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
	@PostMapping("/hololens/checkIssueInsert")
	public RestResponse<?> checkIssueInsert(@RequestParam("hSeq") int hSeq
											, @RequestParam("issueTitle") String issueTitle
											, @RequestParam("issueConts") String issueConts
											, @RequestParam("regId") String regId
											, @RequestParam("file") MultipartFile[] file
			) throws IOException ,Exception {
		
        int fileId  = 0;
		if (file.length > 0) {
			int i = 0;
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
				atchFileDTO.setFilePath(issuePath);
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
		checkIssueDTO.setHSeq(hSeq);
		checkIssueDTO.setIssueTitle(issueTitle);
		checkIssueDTO.setIssueConts(issueConts);
		checkIssueDTO.setFileId(fileId);
		checkIssueDTO.setRegId(regId);
		checkIssueDTO.setModId(regId);
	
		int issueSeq = checkService.insertIssue(checkIssueDTO);
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
	@GetMapping("/hololens/checkIssueCommentList")
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
	@PostMapping("/hololens/checkIssueCommentInsert")
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
	
	//issue 파일다운로드 
	@Operation(summary = "issue 파일 다운로드 ", hidden = false, description = "")
	@GetMapping("/hololens/issuefiledown")
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


	
}
