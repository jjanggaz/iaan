package com.iaan.kepco.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Map;

import org.apache.commons.io.FilenameUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iaan.kepco.utils.JsonToDtdxUtil;
public class TestJsonToDtdx {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			JsonToDtdxUtil action= JsonToDtdxUtil.getInstance();
			JSONParser jsonParser = new JSONParser();
			
			String filePath = "D:\\\\5-315-D-166-RG301.json";
			
			// json 파일을 읽어서 BufferedReader 에 저장 
			BufferedReader readers = new BufferedReader( new FileReader(filePath)); 
			// BufferedReader 파일을 JSONObject 로 변경 
			JSONObject reqtoServer= (JSONObject) jsonParser.parse(readers );
			// 파일 생성 
			JSONObject res= action.post(reqtoServer.toString(),"6-324-D-166-FC302.dtdx");
			
			// 리턴 받은 파일 경로 를 map 에 담는다
	        Map<String, Object> map = new ObjectMapper().readValue(res.toString(), Map.class);
	       
	        
	        
	        String dtdxName = FilenameUtils.getName(map.get("absoluteFilePath").toString());
	        //String name2 = FilenameUtils.getPath(map.get("absoluteFilePath").toString());
	        String dtdxPath = FilenameUtils.getFullPath(map.get("absoluteFilePath").toString());
	        
	        System.out.println(dtdxName);
	        System.out.println(dtdxPath);
        
        
		}catch(Exception e) {
			System.out.println("error=="+e.getMessage());
		}
        
	}
}
