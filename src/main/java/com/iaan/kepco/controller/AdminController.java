package com.iaan.kepco.controller;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.DwgModelDTO;
import com.iaan.kepco.dto.DwgMstDTO;
import com.iaan.kepco.dto.DwgTagDTO;
import com.iaan.kepco.dto.ModelDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.WbsDTO;
import com.iaan.kepco.service.AdminService;
import com.iaan.kepco.service.AtchFileService;
import com.iaan.kepco.service.CheckService;
import com.iaan.kepco.service.CommUtils;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.service.WbsService;
import com.iaan.kepco.utils.FileUtil;


@RestController
public class AdminController {
	private final Logger logger = LoggerFactory.getLogger(AdminController.class);

	@Value("${drive.path}")
	private String drivePath;

	@Value("${root.Path}")
	private String rootPath;

	@Value("${dtdx.filePath}")
	private String dtdxFolder;

	@Value("${csv.filePath}")
	private String csvFolder;

	@Value("${dgn.filePath}")
	private String dgnFolder;
	
	@Value("${ae.filePath}")
	private String aeFolder;

	@Value("${dwg.filePath}")
	private String dwgFolder;
	
	@Value("${gate.filePath}")
	private String gateFolder;
	
	@Value("${svg.filePath}")
	private String svgFolder;
	
	@Value("${gateway.path}")
	private String gateWayPath;
	
	@Autowired
	private WbsService wbsService;
	
	@Autowired
	private AdminService adminService;
	
	@Autowired
	private CommUtils commUtils;

	@Autowired
	private AtchFileService atchFileService;
	
	
	@Autowired
	private CheckService checkService;

	// 2D 도면관리, COUNT
	@ResponseBody
	@PostMapping("/admin/dwgmng")
	public Map<String, Object> selectDwgMngList(@RequestBody SearchDTO searchDTO){
		Map<String, Object> param = new HashMap<String, Object>();
		
		param.put("list", adminService.selectDwgMngList(searchDTO));
		//param.put("constbox", checkService.selectComCodeList(code));
		param.put("totalDataCnt", adminService.selectDwgMngCnt(searchDTO).getTotalDataCnt());

		return param;
	}
	
	// 2D 도면관리, COUNT
	@ResponseBody
	@PostMapping("/admin/dwgone")
	public Map<String, Object> selectDwgMngOne(@RequestBody SearchDTO searchDTO){
		
		Map<String, Object> param = new HashMap<String, Object>();
		
		param.put("list", adminService.selectDwgMngOne(searchDTO));
	
		return param;
	}
		
	
	
	//2d도면 삭제 
	@ResponseBody
	@PostMapping("/admin/dwgdelete")
	public void deleteDwgMng(@RequestBody String dwgSeq){
		 adminService.deleteDwgMst(dwgSeq);
		
	}

	
	

	//2d도면 삭제 
	@ResponseBody
	@PostMapping("/admin/dwgupdate")
	public void updateDwgMng(String dwgSeq,String[] modelVal){
		adminService.deleteDwgModel(dwgSeq);
		//model 과 dwg 저장 
		for(int i=0;i<modelVal.length;i++) {
			DwgModelDTO dwgModelDTO = new DwgModelDTO();
			dwgModelDTO.setDwgSeq(Integer.parseInt(dwgSeq));
			dwgModelDTO.setMSeq(Integer.parseInt(modelVal[i]));
			dwgModelDTO.setRegId("admin");//하드코딩 추후 변경해야함 
			adminService.insertDwgModel(dwgModelDTO);
		}
		
	}
	
	//2d 도면 등록 
	@ResponseBody
	@PostMapping("/admin/dwginsert")
	public Map<String, Object> insertDwgMng(String plant,String unit,String build,String level, String wCd,String[] modelVal,String[] rootVal,String[] passVal, MultipartFile aeFile
			, MultipartFile dwgFile) throws Exception {
		Map<String, Object> param = new HashMap<String, Object>();
		DwgMstDTO dwgMstDTO = new DwgMstDTO();
		String loginUserId = "admin";
		//String loginUserId = session.getAttribute("UserId");

		Integer fileidAe= null;
		Integer fileidDwg= null;
		Integer fileidSvg = null;
	
		
		//aeFile 파일 저장 
		
		
		if (aeFile != null && aeFile.getSize() > 0) {
			String realPath = drivePath + rootPath + aeFolder;
			String oriFilename = aeFile.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );

			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			dwgMstDTO.setDwgFileAeNm(oriFilename);
			
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(aeFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidAe  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidAe);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			FileUtil.fileUpload(realPath, aeFile, newFileName);
		}
		
		
		//dwg 파일 저장 
		if (dwgFile != null && dwgFile.getSize() > 0) {
			String realPath = drivePath + rootPath + dwgFolder;
			String gatePath =  drivePath + rootPath + gateFolder; 
			
			String oriFilename = dwgFile.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );

			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			
			dwgMstDTO.setDwgFileNm(oriFilename);
			
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(dwgFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidDwg  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidDwg);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			//FileUtil.fileUpload(realPath, dwgFile, newFileName);
			
			
			
			
			List<String> directories =  new ArrayList<>();
			directories.add(realPath);
			directories.add(gatePath);
			
	        byte[] fileBytes = dwgFile.getBytes();

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
			
			/*svg 생성 안함 으로 변경 함 
			String batchFilePath = gateWayPath+"kepcoencsvg.bat";
			ProcessBuilder processBuilder = new ProcessBuilder(batchFilePath);
            processBuilder.redirectErrorStream(true); // 오류와 출력을 하나의 스트림으로 통합
            
            // 프로세스 시작 (비동기 실행)
            Process process = processBuilder.start();
            */
        
            // svg 파일 생성 데이터 저장 함. 
            String svgPath = drivePath + rootPath + svgFolder;
            int dotIndex = oriFilename.lastIndexOf('.');
            String svgOri ="";
            if (dotIndex != -1 && dotIndex != 0) {
            	svgOri = oriFilename.substring(0, dotIndex);
              
            } else {
            	svgOri = oriFilename;
            }
            
            String svgFileName = uuid.toString() + ".svg";
			atchFileDTO.setFileType("svg");
			atchFileDTO.setFilePath(svgPath);
			atchFileDTO.setFileNmOri(svgOri);
			atchFileDTO.setFileNm(svgFileName);
			atchFileDTO.setFileLength(dwgFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);

			fileidSvg  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidSvg);
			atchFileService.insertMultiAtchFile(atchFileDTO);
            /* 임시사용 소스 end 
             * 
             * */
			
			
		}
		
		dwgMstDTO.setDwgPlant(plant);
		dwgMstDTO.setDwgUnit(unit);
		dwgMstDTO.setDwgBuilding( build);
		dwgMstDTO.setDwgLevel(level);
		dwgMstDTO.setWCd(wCd);
		
		dwgMstDTO.setStatus("100");
		dwgMstDTO.setFileAe(fileidAe);
		dwgMstDTO.setFileDwg(fileidDwg);
		dwgMstDTO.setFileSvg(fileidSvg);
		
		// dwg_mst 저장 
		int dwgseq = adminService.insertDwgMst(dwgMstDTO);
		
		
		//rootvalve ,tag 저장 
		for(int i=0;i<rootVal.length;i++) {
			DwgTagDTO dwgTagDTO = new DwgTagDTO();
			dwgTagDTO.setDwgSeq(dwgMstDTO.getDwgSeq());
			dwgTagDTO.setTagNm(rootVal[i]);
			dwgTagDTO.setRegId("admin");//하드코딩 추후 변경해야함 
			adminService.insertDwgTag(dwgTagDTO);
			
		}
		
		//model 과 dwg 저장 
		for(int i=0;i<modelVal.length;i++) {
			DwgModelDTO dwgModelDTO = new DwgModelDTO();
			dwgModelDTO.setDwgSeq(dwgMstDTO.getDwgSeq());
			dwgModelDTO.setMSeq(Integer.parseInt(modelVal[i]));
			dwgModelDTO.setRegId("admin");//하드코딩 추후 변경해야함 
			adminService.insertDwgModel(dwgModelDTO);
			
		}
		
		
		//관통테그 저장 tb_kc_dwg_pass_tag
		for(int i=0;i<passVal.length;i++) {
			DwgModelDTO dwgModelDTO = new DwgModelDTO();
			dwgModelDTO.setDwgSeq(dwgMstDTO.getDwgSeq());
			dwgModelDTO.setPassTag(passVal[i]);
			dwgModelDTO.setRegId("admin");//하드코딩 추후 변경해야함 
			adminService.insertDwgPassTag(dwgModelDTO);
			
		}
		
		
		
		return param;
	}
	
	

	@ResponseBody
	@PostMapping("/admin/modelmng")
	public Map<String, Object> selectModelMngList(@RequestBody SearchDTO searchDTO){
		Map<String, Object> param = new HashMap<String, Object>();
		
		List<ModelDTO> aaa = adminService.selectModelMngList(searchDTO);
		
		param.put("list", aaa);
		param.put("totalDataCnt", adminService.selectModelMngCnt(searchDTO).getTotalDataCnt());
 
		return param;
	}

	// 3D 도면관리 수정 조회
	@ResponseBody
	@PostMapping("/admin/modelone")
	public Map<String, Object> selectModelMngOne(@RequestBody SearchDTO searchDTO){
		
		Map<String, Object> param = new HashMap<String, Object>();
		
		param.put("list", adminService.selectModelMngOne(searchDTO));
	
		return param;
	}
			
	//3d도면 삭제 
	@ResponseBody
	@PostMapping("/admin/modeldelete")
	public void deleteModelMng(@RequestBody String mSeq){
		adminService.deleteModelMst(mSeq);
	}
	
	//issue  삭제 
	@ResponseBody
	@PostMapping("/admin/issuedelete")
	public void deleteIssueMng(@RequestBody SearchDTO searchDTO){
		
		String issueSeq = searchDTO.getIssueSeq()+"";
		adminService.deleteIssueMst(issueSeq);
	}
		
	
	
	
	@ResponseBody
	@PostMapping("/admin/modelcode")
	public Object selectModelCodeList(@RequestBody SearchDTO searchDTO) throws IOException ,Exception {
		
		List<ModelDTO> comcode  = adminService.selectModelCodeList(searchDTO);
		
		return RestResponse.builder()
				.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
				.data(comcode)
				.build();
	}
	
	//3d 도면 등록 
	@ResponseBody
	@PostMapping("/admin/modelinsert")
	public Map<String, Object> insertModelMng(String plant,String unit,String build,String level, MultipartFile dgnFile
			, MultipartFile dtdxFile, MultipartFile csvFile, MultipartFile hdtdxFile) throws Exception {
		Map<String, Object> param = new HashMap<String, Object>();
		ModelDTO modelDTO = new ModelDTO();
		String loginUserId = "admin";
		//String loginUserId = session.getAttribute("UserId");

		Integer fileidDgn= null;
		Integer fileidDtdx= null;
		Integer fileidHDtdx= null;
		Integer fileidCsv= null;
		//dgnFile 파일 저장 
		
		
		if (dgnFile != null && dgnFile.getSize() > 0) {
			String realPath = drivePath + rootPath + dgnFolder;
			String oriFilename = dgnFile.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );
   
			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(dgnFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidDgn  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidDgn);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			FileUtil.fileUpload(realPath, dgnFile, newFileName);
		}
		
		
		//dtdx 파일 저장 
		if (dtdxFile != null && dtdxFile.getSize() > 0) {
			String realPath = drivePath + rootPath + dtdxFolder;
			String oriFilename = dtdxFile.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );

			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(dtdxFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidDtdx  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidDtdx);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			FileUtil.fileUpload(realPath, dtdxFile, newFileName);
		}
		
		//hololens dtdx 파일 저장 
		if (hdtdxFile != null && hdtdxFile.getSize() > 0) {
			String realPath = drivePath + rootPath + dtdxFolder;
			String oriFilename = hdtdxFile.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );

			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(hdtdxFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidHDtdx  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidHDtdx);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			FileUtil.fileUpload(realPath, hdtdxFile, newFileName);
		}
		
		//csv 파일 저장 
		
		if (csvFile != null && csvFile.getSize() > 0) {
			System.out.println("=========================="+csvFile.getSize());
			String realPath = drivePath + rootPath + csvFolder;
			String oriFilename = csvFile.getOriginalFilename();
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );

			UUID uuid = UUID.randomUUID();
			String newFileName = uuid.toString() + extension;
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			atchFileDTO.setFileType(null);
			atchFileDTO.setFilePath(realPath);
			atchFileDTO.setFileNmOri(oriFilename);
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(csvFile.getSize());
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			// 신규 데이터 및 파일 등록
			fileidCsv  = atchFileService.selectAtchFileId();
			atchFileDTO.setFileId(fileidCsv);
			atchFileService.insertMultiAtchFile(atchFileDTO);
			FileUtil.fileUpload(realPath, csvFile, newFileName);
			
			// csv 파일 읽어서 tag 테이블에 저장하기
			String csvFilePath = realPath+newFileName; // CSV 파일 경로
	        String line = "";
	        String cvsSplitBy = ","; // CSV 파일의 구분자
	        
	        try (BufferedReader br = new BufferedReader(new FileReader(csvFilePath))) {
	        	int chkline = 0;
	        	while ((line = br.readLine()) != null) {
	            	// CSV 파일의 각 줄을 분할하여 배열에 저장
	                String[] data = line.split(cvsSplitBy);
	                // 배열의 데이터를 출력
	                DwgTagDTO dwgTagDTO = new DwgTagDTO();
	                
	                int colnum = 0;
	                for (String value : data) {
	                    System.out.print(value + " ");
	                    if(colnum == 0) {
	                    	dwgTagDTO.setTagNm(removeQuotes(value));
	                    }else if(colnum == 1) {
	                    	dwgTagDTO.setTagPx(removeQuotes(value));
	                    }else if(colnum == 2) {
	                    	dwgTagDTO.setTagPy(removeQuotes(value));
	                    }else if(colnum == 3) {
	                    	dwgTagDTO.setTagPz(removeQuotes(value));
	                    }
	                    colnum++;
	                }
	                if(chkline > 0) {
	                	adminService.updateDwgTag(dwgTagDTO);
	                }
	                chkline++;
	                
	            }
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
		}
		
		modelDTO.setDwgPlant(plant);
		modelDTO.setDwgUnit(unit);
		modelDTO.setDwgBuilding( build);
		modelDTO.setDwgLevel(level);
		
		
		modelDTO.setFileDgn(fileidDgn);
		modelDTO.setFileDtdx(fileidDtdx);
		modelDTO.setFileCsv(fileidCsv);
		modelDTO.setFileHdtdx(fileidHDtdx);
		
		
		adminService.insertModel(modelDTO);
		return param;
	}
	
	private static String removeQuotes(String field) {
        if (field.startsWith("\"") && field.endsWith("\"")) {
            return field.substring(1, field.length() - 2);
        }
        return field;
    }	
	
}
