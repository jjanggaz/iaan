package com.iaan.kepco.controller;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.NoSuchFileException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iaan.kepco.dto.TestDTO;
import com.iaan.kepco.service.ApiService;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.utils.FileUtil;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

//import org.springframework.htthttp.HttpHeaders;

@Tag(name = "테스트", description = "테스트 관련 api 입니다.")
@RestController
@RequiredArgsConstructor
public class ApiController {
	private final Logger logger = LoggerFactory.getLogger(ApiController.class);

	@Autowired
	private ApiService apiService;

	@Value("${dwg.filePath}")
	private String dwgfolder;

	@Value("${dgn.filePath}")
	private String dgnfolder;

	// URL Get 샘플
	@ResponseBody
	@GetMapping("/acApi/test2/{userNm}")
	public RestResponse<?> getTestUserList(@PathVariable("userNm") String userNm) {
		List<Map<String, String>> param = new ArrayList<>();

		Map<String, String> map = new HashMap<>();
		map.put("userId", "user1");
		map.put("userNm", userNm + "1");
		param.add(map);

		map = new HashMap<>();
		map.put("userId", "user2");
		map.put("userNm", userNm + "1");
		param.add(map);

		return RestResponse.CodeWithData()
				.data(param)
				.build();
	}

	// Get 샘플
	@ResponseBody
	@GetMapping("/acApi/test/sampleGet")
	public RestResponse<?> sampleGet(@RequestParam("dwgId") String dwgId
					, @RequestParam("dwgNum") String dwgNum
					, @RequestParam("dwgCd") String dwgCd) {
		List<Map<String, String>> param = new ArrayList<>();
		Map<String, String> map = new HashMap<>();

		if (dwgId == "")	dwgId = null;
		if (dwgNum == "")	dwgNum = null;
		if (dwgCd == "")	dwgCd = null;

		map.put("dwgId", dwgId + "_1");
		map.put("dwgNum", dwgNum + "_1");
		map.put("dwgCd", dwgCd + "_1");
		param.add(map);

		map = new HashMap<>();
		map.put("dwgId", dwgId + "_2");
		map.put("dwgNum", dwgNum + "_2");
		map.put("dwgCd", dwgCd + "_2");
		param.add(map);

		map = new HashMap<>();
		map.put("dwgId", dwgId + "_3");
		map.put("dwgNum", dwgNum + "_3");
		map.put("dwgCd", dwgCd + "_3");
		param.add(map);

		return RestResponse.CodeWithData()
				.data(param)
				.build();


	}

	// Post 샘플
	@ResponseBody
	@PostMapping("/acApi/test/samplePost")
	public RestResponse<?> samplePost(@RequestParam("dwgId") String dwgId
			, @RequestParam("dwgNum") String dwgNum
			, @RequestParam("dwgCd") String dwgCd) {

		List<Map<String, String>> param = new ArrayList<>();
		Map<String, String> map = new HashMap<>();

		if (dwgId == "")	dwgId = null;
		if (dwgNum == "")	dwgNum = null;
		if (dwgCd == "")	dwgCd = null;

		map.put("dwgId", dwgId + "_1");
		map.put("dwgNum", dwgNum + "_1");
		map.put("dwgCd", dwgCd + "_1");
		param.add(map);

		map = new HashMap<>();
		map.put("dwgId", dwgId + "_2");
		map.put("dwgNum", dwgNum + "_2");
		map.put("dwgCd", dwgCd + "_2");
		param.add(map);

		map = new HashMap<>();
		map.put("dwgId", dwgId + "_3");
		map.put("dwgNum", dwgNum + "_3");
		map.put("dwgCd", dwgCd + "_3");
		param.add(map);

		return RestResponse.CodeWithData()
				.data(param)
				.build();
	}

	// Post 샘플
	@ResponseBody
	@PostMapping("/acApi/test/samplePostJson")
	public RestResponse<?> samplePostJson(@RequestBody List<TestDTO> testDTO) {

		List<Map<String, String>> param = new ArrayList<>();
		Map<String, String> map = new HashMap<>();

		int i = 1;
		for(TestDTO test : testDTO) {
			map = new HashMap<>();
			map.put("dwgId", test.getDwgId() + "_" + i);
			map.put("dwgNum", test.getDwgNum() + "_" + i);
			map.put("dwgCd", test.getDwgCd() + "_" + i);

			param.add(map);
			i++;
		}

		return RestResponse.CodeWithData()
				.data(param)
				.build();
	}

	// 파일 업로드 샘플
	@ResponseBody
	@PostMapping(value = "/acApi/test/fileUpload")
	public RestResponse<?> uploadFile(@RequestParam("dwgId") String dwgId,
					@RequestParam("file") MultipartFile file)
							throws NoSuchFileException, FileAlreadyExistsException, IOException ,Exception{
		List<Map<String, String>> param = new ArrayList<>();
		Map<String, String> map = new HashMap<>();

		if (file.isEmpty()) {
			// 파일을 업로드 하지 않았을 경우 처리
		}

		map.put("dwgId", dwgId + "_1");
		param.add(map);

		map = new HashMap<>();
		map.put("dwgId", dwgId + "_2");
		param.add(map);

		if (file != null) {

			FileUtil.fileUpload(dwgfolder, file, file.getOriginalFilename());
		}

		// 파일저장후에 데이터 저장
		return RestResponse.CodeWithData()
				.data(param)
				.build();
	}

	// 파일 다운로드 샘플
	@GetMapping("/acApi/test/fileDownload")
	public ResponseEntity<?> fileDownload(@RequestParam("dwgId") String dwgId) {
		try {
			String fileName = "1234.dwg";
			Resource resource = apiService.getFileResource(fileName);
			File file = new File(String.format("%s%s%s", dwgfolder, File.separator, resource.getFilename()));
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


/*
	// 설비배치도 다운로드
	@GetMapping("/ar/plandown/{layoutSeq}")
	public Object plandownfileDownload(@PathVariable("layoutSeq") String layoutSeq)
			throws NoSuchFileException, IOException {

		String fileName = vupApiService.getFileName(layoutSeq);
		Path filePath = Paths.get(String.format("%s%s%s", planfolder, "", fileName));
		Resource resource = new InputStreamResource(Files.newInputStream(filePath)); // 파일 resource 얻기
		File file = new File(String.format("%s%s%s", planfolder, File.separator, fileName));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentDisposition(
				ContentDisposition.builder("attachment").filename(file.getName(), StandardCharsets.UTF_8).build());
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		return new ResponseEntity<Object>(resource, headers, HttpStatus.OK);
	}

	// 메뉴얼 목록
	@GetMapping("/ar/menual/{factoryPid}")
	public List<EquipMenual> getMenualList(@PathVariable("factoryPid") String factoryPid) {
		Map param = new HashMap();
		param.put("factoryPid", factoryPid);
		return vupApiService.selectEquipMenual(param);
	}

	@GetMapping("/ar/menualdown/{manualSeq}")
	public Object fileDownload(@PathVariable("manualSeq") String manualSeq) throws NoSuchFileException, IOException {

		String fileName = vupApiService.getMenualFileName(manualSeq);
		Path filePath = Paths.get(String.format("%s%s%s", menualfolder, "", fileName));
		Resource resource = new InputStreamResource(Files.newInputStream(filePath)); // 파일 resource 얻기
		File file = new File(String.format("%s%s%s", menualfolder, File.separator, fileName));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentDisposition(
				ContentDisposition.builder("attachment").filename(file.getName(), StandardCharsets.UTF_8).build());
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		return new ResponseEntity<Object>(resource, headers, HttpStatus.OK);
	}

	// 메뉴얼 다운로드
	@GetMapping("/ar/menualdownOLD/{manualSeq}")
	public ResponseEntity<?> getMenualdown(@PathVariable("manualSeq") String manualSeq, HttpServletRequest request) {
		String contentType = null;
		try {
			Resource resource = vupApiService.getMenualFileResource(manualSeq);
			File file = new File(String.format("%s%s%s", menualfolder, File.separator, resource.getFilename()));
			contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
			if (contentType == null) {
				contentType = "application/octet-stream";
			}
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

	// 장비이력 목록
	@GetMapping("/ar/mntnhis/{facilityPid}")
	public List<EquipMntn> getEquipMntnHisList(@PathVariable("facilityPid") String facilityPid) {
		Map param = new HashMap();
		param.put("facilityPid", facilityPid);
		return vupApiService.selectEquipMntn(param);
	}

	// 장비내역 조회
	@GetMapping("/ar/mntn/{mntnNo}")
	public List<EquipMntn> getEquipMntnList(@PathVariable("mntnNo") String mntnNo) {
		Map param = new HashMap();
		param.put("mntnNo", mntnNo);
		return vupApiService.selectEquipMntn(param);
	}

	// 장비내역 파일 목록 조회
	@GetMapping("/ar/mntnfile/{mntnNo}")
	public List<EquipMntn> getEquipMntnFileList(@PathVariable("mntnNo") String mntnNo) {
		Map param = new HashMap();
		param.put("mntnNo", mntnNo);
		return vupApiService.selectEquipMntnFile(param);
	}

	// 장비목록 파일 다운로드
	@GetMapping("/ar/mntndownOld/{mntnNo}/{fileSeq}")
	public ResponseEntity<?> getMntndown(@PathVariable("mntnNo") String mntnNo, @PathVariable("fileSeq") String fileSeq,
			HttpServletRequest request) {
		String contentType = null;
		try {
			Resource resource = vupApiService.getMntnlFileResource(mntnNo, fileSeq);
			contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
			if (contentType == null) {
				contentType = "application/octet-stream";
			}

			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
					.header("Content-Disposition", "attachment; filename=\"" + resource.getFilename() + "\"")
					.body(resource);
		} catch (IOException ex) {
			logger.info(ex.getMessage());
		} catch (Exception ex) {
			logger.info(ex.getMessage());
		}
		return null;
	}

	// 설비배치도 다운로드
	@GetMapping("/ar/mntndown/{mntnNo}/{fileSeq}")
	public Object plandownfileDownload(@PathVariable("mntnNo") String mntnNo, @PathVariable("fileSeq") String fileSeq)
			throws NoSuchFileException, IOException {

		String fileName = vupApiService.getMntnlFileName(mntnNo, fileSeq);
		Path filePath = Paths.get(String.format("%s%s%s", mntnfolder, "", fileName));
		Resource resource = new InputStreamResource(Files.newInputStream(filePath)); // 파일 resource 얻기
		File file = new File(String.format("%s%s%s", mntnfolder, File.separator, fileName));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentDisposition(
				ContentDisposition.builder("attachment").filename(file.getName(), StandardCharsets.UTF_8).build());
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		return new ResponseEntity<Object>(resource, headers, HttpStatus.OK);
	}

	// 장비계획 목록 조회
	@GetMapping("/ar/mntnplan/{facilityPid}")
	public List<EquipMntn> selectEquipMntnPlan(@PathVariable("facilityPid") String facilityPid) {
		Map param = new HashMap();
		param.put("facilityPid", facilityPid);
		return vupApiService.selectEquipMntnPlan(param);
	}

	// 장비목록 등록
	@PostMapping("/ar/mntndata")
	public ResponseEntity<?> setMntnData(@RequestParam("mntnNo") String mntnNo, @RequestParam("facilityPid") String facilityPid,
			@RequestParam("mntnTitle") String mntnTitle, @RequestParam("mntnResvDate") String mntnResvDate,
			@RequestParam("mntnStrtDate") String mntnStrtDate, @RequestParam("mntnFnshDate") String mntnFnshDate,
			@RequestParam("mntnUser") String mntnUser, @RequestParam("mntnConts") String mntnConts,
			@RequestParam("mntnNoNext") String mntnNoNext, @RequestParam("mntnResvDateNext") String mntnResvDateNext) {
		Map param = new HashMap();
		if (mntnStrtDate == "")	mntnStrtDate = null;
		if (mntnFnshDate == "")	mntnFnshDate = null;
		if (mntnResvDate == "")	mntnResvDate = null;
		if (mntnResvDateNext == "")	mntnResvDateNext = null;

		param.put("mntnNo", mntnNo);
		param.put("facilityPid", facilityPid);
		param.put("mntnTitle", mntnTitle);
		param.put("mntnResvDate", mntnResvDate);
		param.put("mntnStrtDate", mntnStrtDate);
		param.put("mntnFnshDate", mntnFnshDate);
		param.put("mntnUser", "system"); // 시스템 자체에 로그인 처리가 없음으로 임시로 system 으로 저장 함 .
		param.put("mntnConts", mntnConts);

		param.put("mntnNoNext", mntnNoNext);
		param.put("mntnResvDateNext", mntnResvDateNext);

		//System.out.println("insertEquipMntnData : "+mntnNo);

		if (mntnNo != null) {
			vupApiService.updateEquipMntnData(param);
		}

		if (mntnNoNext == "" && mntnResvDateNext != null)	{
			vupApiService.insertEquipMntnData(param);
		}
		else if (mntnNoNext != "" && mntnResvDateNext != null)	{
			vupApiService.updateDtvEquipMntnResv(param);
		}

		return new ResponseEntity<>(HttpStatus.OK);

	}


	// 장비 업로드
	@PostMapping(value = "/ar/equip/upload/{mntnNo}")
	public ResponseEntity<?> uploadFile(@PathVariable("mntnNo") String mntnNo,
			@RequestParam("file") MultipartFile file) {
		if (file.isEmpty()) {
			// 파일을 업로드 하지 않았을 경우 처리
		}

		String upload = vupApiService.saveEquipMentFile(file, mntnNo);
		// 파일저장후에 데이터 저장
		return ResponseEntity.status(HttpStatus.OK).body(upload);
	}

	// 설비 트리 api
	 *
	@GetMapping("/ar/tree/{sdcode}")
	public List<ComCode> getEquipTreeList(@PathVariable("sdcode") String sdcode) {
		Map param = new HashMap();
		param.put("sdCode", sdcode);
		return codeService.selectTreeList(param);
	}

	// 산단 선택
	@GetMapping("/ar/complex")
	public List<ComCode> getComplexList() {
		Map param = new HashMap();
		param.put("cdGrp", "SD");
		return codeService.selectComCode(param);
	}

	// 설비 정보
	@GetMapping("/ar/equip/{facilityPid}")
	public List<Equip> getEquipInfo(@PathVariable("facilityPid") String facilityPid) {
		Map param = new HashMap();
		param.put("facilityPid", facilityPid);
		return equipService.selectEquip(param);
	}

*/
}
