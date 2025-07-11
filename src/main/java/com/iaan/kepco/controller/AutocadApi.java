package com.iaan.kepco.controller;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.CheckItemDTO;
import com.iaan.kepco.dto.ComCodeDTO;
import com.iaan.kepco.dto.DwgDTO;
import com.iaan.kepco.dto.DwgFileDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.DwgTagDTO;
import com.iaan.kepco.dto.JsonSymbolDTO;
import com.iaan.kepco.dto.PassTagDTO;
import com.iaan.kepco.dto.UserDTO;
import com.iaan.kepco.service.AtchFileService;
import com.iaan.kepco.service.CheckService;
import com.iaan.kepco.service.CommonService;
import com.iaan.kepco.service.DwgService;
import com.iaan.kepco.service.FileService;
import com.iaan.kepco.service.JsonSymbolService;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.utils.FileUtil;
import com.iaan.kepco.utils.JsonToDtdxUtil;
import com.iaan.kepco.utils.SHA256Util;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "AutoCAD API", description = "AutoCAD 사용하는 API.")
@RestController
@RequiredArgsConstructor
public class AutocadApi {
	private final Logger logger = LoggerFactory.getLogger(AutocadApi.class);

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
	private JsonSymbolService jsonSymbolService;

	
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
	
	/*
	 * @Value("${dtdx.url}") private String dtdxurl;
	 * 
	 * @Value("${dtdx.port}") private String dtdxport;
	 */
	
	@Value("${svg.filePath}")
	private String svgFolder;
	
	@Value("${gate.filePath}")
	private String gateFolder;
	
	@Value("${gateway.path}")
	private String gateWayPath;
	
	
	Session session;
	
	private JsonToDtdxUtil action= JsonToDtdxUtil.getInstance();
	
	// 로그인
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = UserDTO.class)))
	})
	@Operation(summary = "로그인", hidden = false, description = "login")
	@PostMapping("/autocad/login")
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
	
	//도면 조회조건  최상위는   012    level  = 013
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = ComCodeDTO.class)))
	})
	@Operation(summary = "도면 목록 select box", hidden = false, description = "도면목록 셀렉트 박스 데이터 plan 는 부모키 012 하위는 선택된 상위 cdId , 4 level 사용시 lvlCode : PBS, LVL 로 구분자 줄것  ")
	@GetMapping("/autocad/codelist")
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
	@Operation(summary = "도면 목록 데이터", hidden = false, description = "autocad select box 데이터 input-param :  dwgNum ")
	@GetMapping("/autocad/dwglist")
	public Object selectDwgList(@RequestParam("dwgPlant") String dwgPlant,@RequestParam("dwgUnit") String dwgUnit,@RequestParam("dwgBuilding") String dwgBuilding,@RequestParam("dwgLevel") String dwgLevel,String tagNm) throws IOException ,Exception {
		Map<String,String> param = new HashMap<String,String>();
		param.put("dwgPlant", dwgPlant);
		param.put("dwgUnit", dwgUnit);
		param.put("dwgLevel", dwgLevel);
		param.put("dwgBuilding", dwgBuilding);
		param.put("tagNm", tagNm);
		List<DwgMstDTO> dwgmstlist = dwgService.selectAutoCadDwgList(param);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dwgmstlist)
				.build();
	}
	//autocad 도면다운로드 
	@Operation(summary = "autocad 도면다운로드 ", hidden = false, description = "autocad 도면다운로드 ")
	@GetMapping("/autocad/filedown")
	public Object autocadfiledown(@RequestParam("fileId") String fileId)  {
		try {
			Map<String, String> param = new HashMap<String, String>();
			param.put("fileId", fileId);
			param.put("fileSeq", "0");  // 도면 파일은 파일 순번이 무조건 0 임 
			DwgFileDTO dfd = checkService.selectFileInfo(param);
			if(dfd != null) {
				String fileName =  dfd.getFilePath()  +"\\"+dfd.getFileNm();
				Resource resource = fileService.getDwgFileResource(fileName);
				File file = new File(String.format("%s%s%s", dfd.getFilePath(), File.separator, resource.getFilename()));
				String contentType = "application/octet-stream";
				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
						.header("Content-Disposition",
								"attachment; filename=\"" + URLEncoder.encode(file.getName(), "utf-8") + "\"")
						.body(resource);
			}else {
				return RestResponse.builder()
						.resultCode(ResponseEnum.FILE_NOT_FOUND_EXCEPTION.getResultCode()).message("파일데이터 가 없습니다.")
						.data(null)
						.build();
			}
		} catch (FileNotFoundException ex) {
			logger.info(ex.getMessage());
			return RestResponse.builder()
					.resultCode(ResponseEnum.FILE_NOT_FOUND_EXCEPTION.getResultCode()).message(ResponseEnum.FILE_NOT_FOUND_EXCEPTION.getResultMessage())
					.data(null)
					.build();
		} catch (Exception ex) {
			logger.info(ex.getMessage());
			return RestResponse.builder()
					.resultCode(ResponseEnum.FAIL.getResultCode()).message(ex.getMessage())
					.data(null)
					.build();
		}
	}
	// 도면 업로드 
	@Operation(summary = "도면 업로드 및 점검표 저장", hidden = false, description = "도면 업로드 int :  dwgSeq, file : fileAe, fileDwg,fileJson   String : checkResult =점검갯수 쉼표 구분")
	@PostMapping(value = "/autocad/upload")
	public Object uploadFileIso(@RequestParam("dwgSeq") int dwgSeq
						,  MultipartFile fileAe
						,  MultipartFile fileDwg
						,  MultipartFile fileJson
						, @RequestParam("checkResult") String checkResult
						, @RequestParam("checkResultJson") String checkResultJson,HttpServletRequest request)
				{
		try {
		String loginUserId = "admin";
		//String loginUserId = session.getAttribute("UserId");
		DwgDTO dwgDTO = new DwgDTO();
		dwgDTO.setDwgSeq(dwgSeq);
		dwgDTO.setRegId(loginUserId);
		dwgDTO.setModId(loginUserId);

		List<Map<String, String>> param = new ArrayList<>();
		Map<String, String> map = new HashMap<>();
		String tableNm;
		Integer fileVersion;
		Integer fileidAe= null;
		Integer fileidDwg= null;
		Integer fileidSvg = null;
		Integer fileidJson= null;
		Integer fileidDtdx= null;
		String  dwgFileNm = "";
		// 기준도면 (AE) 업로드  
		if (fileAe != null && fileAe.getSize() > 0) {
			tableNm = "dwg";
			String realPath = drivePath + rootPath + aeFolder;
			String oriFilename = fileAe.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") +1);

			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(fileAe.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidAe  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidAe);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			FileUtil.fileUpload(realPath, fileAe, newFileName);
		}
		
		
		
		
		if ((fileDwg != null && fileDwg.getSize() > 0) || (fileJson != null && fileJson.getSize() > 0)) {
			tableNm = "DC";
			String realPath = drivePath + rootPath + dwgFolder;
			String gatePath =  drivePath + rootPath + gateFolder; 
			
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			// DWG 업로드
			if (fileDwg.getSize() > 0) {
				String fileTypeDwg = "dwg";
				String fileNmOri = fileDwg.getOriginalFilename();
				dwgFileNm = fileNmOri;
				String extension  = "." + fileNmOri.substring(fileNmOri.lastIndexOf(".") +1);
				
				UUID uuid = UUID.randomUUID();
				String newFileName = uuid.toString() + extension;
				atchFileDTO.setFileType(fileTypeDwg);
				atchFileDTO.setFilePath(realPath);
				atchFileDTO.setFileNmOri(fileNmOri);
				atchFileDTO.setFileNm(newFileName);
				atchFileDTO.setFileLength(fileDwg.getSize());
				atchFileDTO.setFileStatus("U");
				atchFileDTO.setRegId(loginUserId);
				atchFileDTO.setModId(loginUserId);

				fileidDwg  = atchFileService.selectAtchFileId();
				atchFileDTO.setFileId(fileidDwg);
				atchFileService.insertMultiAtchFile(atchFileDTO);
				
				
				
				
				List<String> directories =  new ArrayList<>();
				directories.add(realPath);
				directories.add(gatePath);
				
		        byte[] fileBytes = fileDwg.getBytes();

		        for (String directory : directories) {
		            // 디렉토리가 존재하지 않으면 생성합니다.
		            Path directoryPath = Paths.get(directory);
		            if (!Files.exists(directoryPath)) {
		                Files.createDirectories(directoryPath);
		            }
		            // 파일 경로를 설정합니다.
		            Path filePath = directoryPath.resolve(newFileName);
		            // 파일을 저장합니다.
		            Files.write(filePath, fileBytes);
		        }
				
				/*svg 생성안함으로 변경 
				
				String batchFilePath = gateWayPath+"kepcoencsvg.bat";
				ProcessBuilder processBuilder = new ProcessBuilder(batchFilePath);
	            processBuilder.redirectErrorStream(true); // 오류와 출력을 하나의 스트림으로 통합
	            
	            // 프로세스 시작 (비동기 실행)
	            Process process = processBuilder.start();
	            
	        
	            // svg 파일 생성 데이터 저장 함. 
	            String svgPath = drivePath + rootPath + svgFolder;
	            int dotIndex = fileNmOri.lastIndexOf('.');
	            String svgOri ="";
	            if (dotIndex != -1 && dotIndex != 0) {
	            	svgOri = fileNmOri.substring(0, dotIndex);
	              
	            } else {
	            	svgOri = fileNmOri;
	            }
	            
	            String svgFileName = uuid.toString() + ".svg";
				atchFileDTO.setFileType("svg");
				atchFileDTO.setFilePath(svgPath);
				atchFileDTO.setFileNmOri(svgOri);
				atchFileDTO.setFileNm(svgFileName);
				atchFileDTO.setFileLength(fileDwg.getSize());
				atchFileDTO.setFileStatus("U");
				atchFileDTO.setRegId(loginUserId);
				atchFileDTO.setModId(loginUserId);

				fileidSvg  = atchFileService.selectAtchFileId();
				atchFileDTO.setFileId(fileidSvg);
				atchFileService.insertMultiAtchFile(atchFileDTO);
				
				*/
	            /* 임시사용 소스 end 
	             * 
	             * */
			}
			// JSON 업로드
			if (fileJson.getSize() > 0) {
				String fileTypeJson = "json";
				String fileNmOri = fileJson.getOriginalFilename();
				String extension  = "." + fileNmOri.substring(fileNmOri.lastIndexOf(".") +1);

				UUID uuid = UUID.randomUUID();
				String newFileName = uuid.toString() + extension;

				atchFileDTO.setFileType(fileTypeJson);
				atchFileDTO.setFileSeq(0);
				atchFileDTO.setFilePath(realPath);
				atchFileDTO.setFileNmOri(fileNmOri);
				atchFileDTO.setFileNm(newFileName);
				atchFileDTO.setFileLength(fileJson.getSize());
				atchFileDTO.setFileStatus("U");
				atchFileDTO.setRegId(loginUserId);
				atchFileDTO.setModId(loginUserId);

				// 신규 데이터 및 파일 등록
				fileidJson = atchFileService.selectAtchFileId();
				atchFileDTO.setFileId(fileidJson);
				atchFileService.insertMultiAtchFile(atchFileDTO);
				
				FileUtil.fileUpload(realPath, fileJson, newFileName);

				/*  JSON 내의 심볼 정보 축출	*/
				String content = readFile(realPath + newFileName, StandardCharsets.UTF_8);
				JsonSymbolDTO jsonSymbolDTO = new JsonSymbolDTO();
		        jsonSymbolDTO.setDwgSeq(dwgSeq);
				jsonSymbolService.updateJsonSymbolStatus(jsonSymbolDTO);
				JSONParser parser = new JSONParser();
				JSONObject jObject = (JSONObject) parser.parse(content);
				Object object = jObject.get("PROPERTY");
				JSONArray jArray = (JSONArray) object;
	
				// 배열의 모든 아이템을 출력합니다.
			    for (int i = 0; i < jArray.size(); i++) {
			        JSONObject obj = (JSONObject)jArray.get(i);

			        jsonSymbolDTO = new JsonSymbolDTO();
			        jsonSymbolDTO.setDwgSeq(dwgSeq);
			        jsonSymbolDTO.setVersion(0);
			        jsonSymbolDTO.setHandle(obj.get("HANDLE").toString());
			        jsonSymbolDTO.setGubun(obj.get("GUBUN").toString());
			        jsonSymbolDTO.setTag(obj.get("TAG").toString());
			        jsonSymbolDTO.setLineGroup(obj.get("LINE_GROUP").toString());
			        jsonSymbolDTO.setRootPlate(obj.get("ROOT_PLATE").toString());
			        jsonSymbolDTO.setLineSeq(obj.get("LINE_SEQ").toString());
			        jsonSymbolDTO.setLength(obj.get("LENGTH").toString());
			        jsonSymbolDTO.setThdOd(obj.get("THD_OD").toString());
			        jsonSymbolDTO.setSymbol(obj.get("SYMBOL").toString());
			        jsonSymbolService.insertJsonSymbol(jsonSymbolDTO);
			        
			        
			       
			    }
			    // JSON 파일로 그룹핑 해서 TB_KC_DWG_SYMBOL 테이블에 넣는다  DWG_SEQ, TAG_SEQ , SYMBOL SEQ 
			    jsonSymbolDTO = new JsonSymbolDTO();
		        jsonSymbolDTO.setDwgSeq(dwgSeq);
		   
				// JsonSymbol 테이블에서 Gubun의 이름을 변경
		        jsonSymbolService.updateJsonSymbolGubun(jsonSymbolDTO);
		        
				// JsonSymbol 테이블에서 UPDATE, INSERT 안된 데이터를 삭제(처음 DATA_STATUS = 'N'인 데이터)
				jsonSymbolService.deleteJsonSymbolStatus(jsonSymbolDTO);
							
				/* dtdx 파일 생성 및 저장  */
				String dtdxfile = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/convert?fileName=" + fileNmOri ;
				
				// 파일 생성 
				JSONObject res= action.post(jObject.toString(),dtdxfile);
				
				
				if(res != null) {
				// 리턴 받은 파일 경로 를 map 에 담는다
			        Map<String, Object> rtn = new ObjectMapper().readValue(res.toString(), Map.class);
			        String dtdxName = FilenameUtils.getName(rtn.get("absoluteFilePath").toString());
			        String dtdxPath = FilenameUtils.getFullPath(rtn.get("absoluteFilePath").toString());
			        
			        File filedtdx= new File(dtdxPath+dtdxName);
			        //파일정보 저장 
			        atchFileDTO.setFileType("dtdx");
					atchFileDTO.setFileSeq(0);
					atchFileDTO.setFilePath(dtdxPath);
					atchFileDTO.setFileNmOri(dtdxName);
					atchFileDTO.setFileNm(dtdxName);
					atchFileDTO.setFileLength(filedtdx.length());
					atchFileDTO.setFileStatus("U");
					atchFileDTO.setRegId(loginUserId);
					atchFileDTO.setModId(loginUserId);
	
					// 신규 데이터 및 파일 등록
					fileidDtdx = atchFileService.selectAtchFileId();
					atchFileDTO.setFileId(fileidDtdx);
					atchFileService.insertMultiAtchFile(atchFileDTO);
				}
			}
			// 파일저장후에 데이터 저장
			CheckDwgDTO checkDwgDTO = new CheckDwgDTO();
			checkDwgDTO.setDwgSeq(dwgSeq);
			checkDwgDTO.setDwgFileNm(dwgFileNm);
			checkDwgDTO.setRegId(loginUserId);
			checkDwgDTO.setFileAe(fileidAe);
			checkDwgDTO.setFileDwg(fileidDwg);
			checkDwgDTO.setFileJson(fileidJson);
			checkDwgDTO.setFileDtdx(fileidDtdx);
			checkDwgDTO.setFileSvg(fileidSvg);
			
			checkService.insertDwgMst(checkDwgDTO);
			checkService.insertCheck(checkDwgDTO);
			
			//공사계획 저장 
			//tag 갯수만큼 가져오기 
			
			List<DwgTagDTO> tagRtn = checkService.selectTagList(dwgSeq);
			
			for(DwgTagDTO rn :tagRtn ) {
				Map<String,String> conVal =  new HashMap<String,String>();
				conVal.put("dwgSeq", dwgSeq+"");
				conVal.put("tagSeq", rn.getTagSeq()+"");
				checkService.insertWbs(conVal) ;
			}
		
			
			// 2D설계점검 결과 저장
			if(checkResult != null && !checkResult.equals(""))	{
				CheckItemDTO checkItemDTO = new CheckItemDTO();
				checkItemDTO.setDwgSeq(dwgSeq);
				checkItemDTO.setVersion(checkDwgDTO.getVersion());
			
				String[] arrCheckResult = checkResult.split(",");
				for(int i = 0; i < arrCheckResult.length; i++){
					checkItemDTO.setItem(i+1);
					checkItemDTO.setCheckCnt(Integer.parseInt(arrCheckResult[i]));
					
					checkService.insertDwgItem(checkItemDTO);
				}
			}
			
			//상세정보 저장 
			if(checkResultJson != null){
				JSONParser parser2 = new JSONParser();
				JSONArray array = (JSONArray)parser2.parse(checkResultJson);
				CheckItemDTO descItem =  new CheckItemDTO();
				// 이력없음 기존데이터 삭제후  저장 할것 
				checkService.delDwgItemDesc(dwgSeq);
				for(int i =0 ; i<array.size();i++) {
					descItem.setDwgSeq(dwgSeq);
					descItem.setItem(  Integer.parseInt(   ((JSONObject)array.get(i)).get("SEQ").toString() ) );
					descItem.setHandle(    ((JSONObject)array.get(i)).get("HANDLE").toString()  );
					descItem.setName(    ((JSONObject)array.get(i)).get("NAME").toString()  );
					checkService.insertDwgItemDesc(descItem);
				}
			}
			
			
			
			
		}
		map.put("result", "SUCCESS");
		param.add(map);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(null)
				.build();
		}catch(Exception e) {
			return null;
		}
	}

	
	public static String readFile(String path, Charset encoding) throws IOException    {
        byte[] encoded = Files.readAllBytes(Paths.get(path));
        return new String(encoded, encoding);
    }
	
	
	//관통테그 조회 
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = PassTagDTO.class)))
	})
	@Operation(summary = "관통테그 조회 ", hidden = false, description = "관통테그 조회 ")
	@GetMapping("/autocad/passtag")
	public Object selectpasstag( String dwgSeq,String dwgFileNm ) {
		
		Map<String,String> param = new HashMap<>();
		
		param.put("dwgSeq", dwgSeq);
		param.put("dwgFileNm", dwgFileNm);
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dwgService.selectPassTag(param))
				.build();
	
	}
	
	
	
	//재질 조회 
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = PassTagDTO.class)))
	})
	@Operation(summary = "재질 조회 ", hidden = false, description = "재질 조회 ")
	@GetMapping("/autocad/quality")
	public Object selectQualityList() {
		Map<String,String> param = new HashMap<>();
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dwgService.selectQualityList(param))
				.build();
	}
	//심볼  조회 
	@ApiResponses(value = {
	        @ApiResponse(responseCode = "40000", description = "SUCCESS", content = @Content(schema = @Schema(implementation = PassTagDTO.class)))
	})
	@Operation(summary = "심볼정보 조회 ", hidden = false, description = "심볼정보 조회 ")
	@GetMapping("/autocad/symbol")
	public Object selectSysmbolList( String dwgSeq,String dwgFileNm ) {
		Map<String,String> param = new HashMap<>();
		param.put("dwgSeq", dwgSeq);
		param.put("dwgFileNm", dwgFileNm);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(dwgService.selectSysmbolList(param))
				.build();
	}		

	
	//점검표 저장 (처리할것) 이태희 부장님 완료후 협의후 처리 
	
	
}
