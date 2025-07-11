package com.iaan.kepco.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.NoSuchFileException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.iaan.kepco.service.CommUtils;
import com.iaan.kepco.service.ResponseEnum;
import com.iaan.kepco.service.RestResponse;
import com.iaan.kepco.service.WbsService;
import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.WbsDTO;


@RestController
public class WbsApi {
	private final Logger logger = LoggerFactory.getLogger(WbsApi.class);

	@Autowired
	private WbsService wbsService;

	@Autowired
	private CommUtils commUtils;

	// 공사계획 리스트, COUNT
	@ResponseBody
	@PostMapping("/wbs/planList")
	public Map<String, Object> selectWbsPlanList(@RequestBody SearchDTO searchDTO){
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("list", wbsService.selectWbsPlanList(searchDTO));
		param.put("totalDataCnt", wbsService.selectWbsPlanCnt(searchDTO).getTotalDataCnt());

		return param;
	}

	// 비용정산계획 리스트, COUNT
	@ResponseBody
	@PostMapping("/wbs/calcList")
	public Map<String, Object> selectWbsCalcList(@RequestBody SearchDTO searchDTO){
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("list", wbsService.selectWbsCalcList(searchDTO));
		param.put("totalDataCnt", wbsService.selectWbsCalcCnt(searchDTO).getTotalDataCnt());

		return param;
	}

	@ResponseBody
	@PostMapping(value = "/wbs/excelUpload")
	public List<Map<String,	String>> excelfileUploadWbsPlan(
			@RequestPart("file") MultipartFile mulFile
			) throws NoSuchFileException, FileAlreadyExistsException, IOException ,Exception {

		File file = new File(mulFile.getOriginalFilename());
		file.createNewFile();
		FileOutputStream fos = new FileOutputStream(file);
		fos.write(mulFile.getBytes());
		fos.close();

		List<Map<String, String>> result = new ArrayList<>();

		try {
			if(file	!= null) {
				result = excelUploadWbs(file);
			}
		}catch(Exception e)	{
			logger.error("Error "	+ e.toString());
		}

		return result;
	}

	public List<Map<String, String>> excelUploadWbs(File destFile) throws Exception {

        ExcelReadOption excelReadOption = new ExcelReadOption();
        excelReadOption.setFilePath(destFile.getAbsolutePath()); //파일경로 추가

        List<Map<String, String>>excelContent = ExcelRead.read(excelReadOption);

        for (Map<String, String> element : excelContent) {

        	String errMsg = "";

    		if(StringUtils.isNotEmpty(element.get("plantNm").toString())) {
        		element.put("plantNm", element.get("plantNm").toString());
    		}
    		else	{
    			errMsg += commUtils.strLineCheck(errMsg) + "Plant 필수 입력입니다.";
    		}

    		if(StringUtils.isNotEmpty(element.get("unitNm").toString())) {
        		element.put("unitNm", element.get("unitNm").toString());
    		}
    		else	{
    			errMsg += commUtils.strLineCheck(errMsg) + "Unit 필수 입력입니다.";
    		}

    		if(StringUtils.isNotEmpty(element.get("buildingNm").toString())) {
        		element.put("buildingNm", element.get("buildingNm").toString());
    		}
    		else	{
    			errMsg += commUtils.strLineCheck(errMsg) + "Building 필수 입력입니다.";
    		}

    		if(StringUtils.isNotEmpty(element.get("levelNm").toString())) {
        		element.put("levelNm", element.get("levelNm").toString());
    		}
    		else	{
    			errMsg += commUtils.strLineCheck(errMsg) + "Level 필수 입력입니다.";
    		}

    		if(StringUtils.isNotEmpty(element.get("rootValveNm").toString())) {
        		element.put("rootValveNm", element.get("rootValveNm").toString());
    		}
    		else	{
    			errMsg += commUtils.strLineCheck(errMsg) + "루트밸브 필수 입력입니다.";
    		}

    		if(StringUtils.isNotEmpty(element.get("wCdNm").toString())) {
        		element.put("wCdNm", element.get("wCdNm").toString());
    		}
    		else	{
    			errMsg += commUtils.strLineCheck(errMsg) + "공종 필수 입력입니다.";
    		}
    		element.put("actualQuantity", element.get("actualQuantity").toString());
    		
    		if (errMsg == "")	{
    			WbsDTO wbsDTO = new WbsDTO();

    			wbsDTO.setPlantNm(element.get("plantNm").toString());
    			wbsDTO.setUnitNm(element.get("unitNm").toString());
    			wbsDTO.setBuildingNm(element.get("buildingNm").toString());
    			wbsDTO.setLevelNm(element.get("levelNm").toString());
    			wbsDTO.setRootValveNm(element.get("rootValveNm").toString());
    			wbsDTO.setWCdNm(element.get("wCdNm").toString());
    			wbsDTO.setWCdNm(element.get("wCdNm").toString());
    			wbsDTO.setActualQuantity(Integer.parseInt(element.get("actualQuantity").toString()));
    			
    			wbsDTO = wbsService.selectWbsCheck(wbsDTO);

    			if(wbsDTO == null) {
    				errMsg += commUtils.strLineCheck(errMsg) + "계층 정보가 잘못되었습니다.";
    			}else {
	    			if(wbsDTO.getTagSeq().equals(""))	{
	        			errMsg += commUtils.strLineCheck(errMsg) + "ROOT VALUE 정보가 잘못되었습니다.";
	        		}else{
	        			element.put("tagSeq", wbsDTO.getTagSeq().toString());
	        			
	        			if(wbsDTO.getQuantity().equals("0"))	{
		        			errMsg += commUtils.strLineCheck(errMsg) + "실적 물량이 계획 물량 보다 많습니다.";
		        		}
		        		
	        		}
	        		
	        		if(wbsDTO.getWCd().equals(""))	{
	        			errMsg += commUtils.strLineCheck(errMsg) + "공종 정보가 잘못되었습니다.";
	        		}
	        		else	{
	        			element.put("WCd", wbsDTO.getWCd().toString());
	        		}
	        		
    			}

    		}

        	element.put("startDate", element.get("startDate"));
        	element.put("endDate", element.get("endDate"));
        	element.put("planQuantity", element.get("planQuantity"));
        	element.put("actualQuantity", element.get("actualQuantity"));
        	element.put("builder", element.get("builder"));
        	element.put("buildContents", element.get("buildContents"));

        	element.put("errMsg", errMsg);
        }
        return excelContent;
    }

	@ResponseBody
	@PostMapping("/wbs/excelSave")
	public int saveWbsPlan(@RequestParam("upExcelData") String upExcelData
							, HttpServletRequest request){

		int successCnt = 0;
		
		//HttpSession session = request.getSession(true);
		//String loginUserId = session.getAttribute("UserId").toString();
		String loginUserId = "admin";

		JSONArray jsonArr = new JSONArray(upExcelData);
		for (int i = 0; i < jsonArr.length(); i++) {

		    JSONObject wbsData = jsonArr.getJSONObject(i);

		    WbsDTO wbsDTO = new WbsDTO();

			wbsDTO.setTagSeq( Integer.parseInt(wbsData.get("tagSeq").toString()));          
			wbsDTO.setWCd(wbsData.get("WCd").toString());
			wbsDTO.setStartDate(wbsData.get("startDate").toString());
			wbsDTO.setEndDate(wbsData.get("endDate").toString());
			wbsDTO.setPlanQuantity(Integer.parseInt(wbsData.get("planQuantity").toString()));
			wbsDTO.setActualQuantity(Integer.parseInt(wbsData.get("actualQuantity").toString()));
			wbsDTO.setBuilder(wbsData.get("builder").toString());
			wbsDTO.setBuildContents(wbsData.get("buildContents").toString());
			wbsDTO.setRegId(loginUserId);

			wbsService.insertWbs(wbsDTO);
			successCnt += 1;
		}

		return successCnt;
	}
	
	@ResponseBody
	@PostMapping("/wbs/update")
	public Object updateWbs(@RequestBody WbsDTO WbsDTO){
		
		
		try {
			wbsService.updateWbs(WbsDTO);
			return RestResponse.builder()
					.resultCode(ResponseEnum.SUCCESS.getResultCode()).message(ResponseEnum.SUCCESS.getResultMessage())
					.data(null)
					.build();
		}catch(Exception e) {
			return RestResponse.builder()
					.resultCode(ResponseEnum.FAIL.getResultCode()).message(ResponseEnum.FAIL.getResultMessage())
					.data(null)
					.build();
		}
		
	}
	
	
	
}
