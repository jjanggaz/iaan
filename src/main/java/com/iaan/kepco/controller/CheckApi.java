package com.iaan.kepco.controller;

import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.iaan.kepco.dto.AtchFileDTO;
import com.iaan.kepco.dto.CheckDwgDTO;
import com.iaan.kepco.dto.CheckFileDTO;
import com.iaan.kepco.dto.CheckIssueCommentDTO;
import com.iaan.kepco.dto.CheckIssueDTO;
import com.iaan.kepco.dto.CheckItemDTO;
import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.service.AtchFileService;
import com.iaan.kepco.service.CheckService;

@RestController
public class CheckApi {

	@Autowired
	private CheckService checkService;

	@Autowired
	private AtchFileService atchFileService;
	
	@Value("${drive.path}" + "${root.Path}"+ "${check.filePath}")
	private String checkFolder;
	
	// 2D 설계점검 리스트
	@ResponseBody
	@PostMapping("/check/check2dList")
	public Map<String, Object> selectCheck2dList(@RequestBody SearchDTO searchDTO){
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("list", checkService.selectCheck2dList(searchDTO));
		param.put("totalDataCnt", checkService.selectCheck2dCnt(searchDTO).getTotalDataCnt());

		return param;
	}

	// 3D 설계점검 리스트
	@ResponseBody
	@PostMapping("/check/check3dList")
	public Map<String, Object> selectCheck3dList(@RequestBody SearchDTO searchDTO,HttpServletRequest request){
		
		
		HttpSession session = request.getSession();
		String loginUserId = "";
		if(session.getAttribute("UserId") == null) {
			loginUserId = "admin";
		}else {
			loginUserId = session.getAttribute("UserId").toString();
		}
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("list", checkService.selectCheck3dList(searchDTO));
		param.put("totalDataCnt", checkService.selectCheck3dCnt(searchDTO).getTotalDataCnt());

		return param;
	}

	// 3D 설계점검 리스트
	@ResponseBody
	@PostMapping("/check/checkUpdate")
	public void updateCheck(@RequestBody CheckDwgDTO checkDwgDTO){
		
		
		
		if(Integer.parseInt( checkDwgDTO.getStatus()) >= 600) {
			checkDwgDTO.setActionOpinion3(checkDwgDTO.getActionOpinion());
			checkDwgDTO.setActionOpinion("");
		}
		
		checkService.updateCheck(checkDwgDTO);
	}

	// 설계점검 조회
	@ResponseBody
	@PostMapping("/check/checkInfo")
	public CheckDwgDTO selectCheckInfo(@RequestBody SearchDTO searchDTO){
		CheckDwgDTO checkDwgDTO = checkService.selectCheckInfo(searchDTO);
		
		List<CheckFileDTO> checkFileList =  checkService.select3DFileList(searchDTO);
		checkDwgDTO.setFileDto(checkFileList);
		
		return checkDwgDTO;
	}

	// 현장설계점검 리스트
	@ResponseBody
	@PostMapping("/check/checkIssueList")
	public Map<String, Object> selectIssueList(@RequestBody SearchDTO searchDTO){
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("list", checkService.selectIssueList(searchDTO));
		param.put("totalDataCnt", checkService.selectIssueCnt(searchDTO).getTotalDataCnt());

		return param;
	}

	// 현장설계점검 조회
	@ResponseBody
	@PostMapping("/check/checkIssueView")
	public CheckIssueDTO selectIssueOne(@RequestBody SearchDTO searchDTO){
		return checkService.selectIssueOne(searchDTO);
	}

	// 현장설계점검 댓글 리스트
	@ResponseBody
	@PostMapping("/check/checkIssueCommentList")
	public List<CheckIssueCommentDTO> selectIssueCommentList(@RequestBody SearchDTO searchDTO){
		return checkService.selectIssueCommentList(searchDTO);
	}

	// 현장설계점검 댓글 등록
	@ResponseBody
	@PostMapping("/check/checkIssueCommentInsert")
	public int insertIssueComment(@RequestBody CheckIssueCommentDTO checkIssueCommentDTO, HttpServletRequest request){
		HttpSession session = request.getSession(true);
		//String loginUserId = session.getAttribute("UserId").toString();
		String loginUserId = "admin";

		checkIssueCommentDTO.setRegId(loginUserId);
		return checkService.insertIssueComment(checkIssueCommentDTO);
	}

	@ResponseBody
	@PostMapping("/check/checkItem")
	public List<CheckItemDTO> selectCheckItemList(@RequestBody SearchDTO searchDTO){
		return checkService.selectCheckItemList(searchDTO);

	}
	
	@ResponseBody
	@PostMapping("/check/checkItemDesc")
	public List<CheckItemDTO> selectCheckItemDescList(@RequestBody SearchDTO searchDTO){
		return checkService.selectCheckItemDescList(searchDTO);

	}
	
	@ResponseBody
	@PostMapping("/check/imgsave")
	public Map insertimgfile(HttpServletRequest request){
		String binaryData = request.getParameter("imgSrc");
		String mesh1Id = request.getParameter("mesh1Id");
		String mesh2Id = request.getParameter("mesh2Id");
		String radiovalue = request.getParameter("radiovalue");
		String base64Img= request.getParameter("imgSrc");
		HttpSession session = request.getSession();
		String loginUserId = "";
		if(session.getAttribute("UserId") == null) {
			loginUserId = "admin";
		}else {
			loginUserId = session.getAttribute("UserId").toString();
		}
		FileOutputStream stream = null;
		Map<String, String> mav = new HashMap<String, String>();
		mav.put("jsonView","jsonView");        
	    try{
	        if(binaryData == null || binaryData=="") {
	             throw new Exception();    
	        }
	        binaryData = binaryData.replaceAll("data:image/png;base64,", "");
            byte[] file = Base64.decodeBase64(binaryData);
            String fileName=  UUID.randomUUID().toString();
            
            stream = new FileOutputStream(checkFolder+fileName+".png");
            stream.write(file);
            stream.close();
            mav.put("msg","ok");
            // DWG_SEQ 찾아오기  radiovalue "11ef8d6a-141d-45a0-bcdd-340e497d4afa.JSON"
            Map<String, String> param = new HashMap<String, String>();
            param.put("fileId",radiovalue);
            String strDwgSeq = checkService.selectJsonFileDwgSeq(param);
            
            
            String oriFilename = strDwgSeq+"_"+mesh1Id+"_"+mesh2Id+".png";
			String extension  = oriFilename.substring(oriFilename.lastIndexOf(".") );
			//String extension = fileName.substring(fileName.lastIndexOf("."), fileName.length());

			UUID uuid = UUID.randomUUID();
			String newFileName = fileName+".png";
			
			//FileUtil.fileUpload(issueFolder, mfile, newFileName);
			int fileId  = atchFileService.selectAtchFileId();
			AtchFileDTO atchFileDTO = new AtchFileDTO();
			
			atchFileDTO.setFileId(fileId);
			
			atchFileDTO.setFileType("png");
			atchFileDTO.setFilePath(checkFolder);
			atchFileDTO.setFileNmOri(oriFilename);
			
			atchFileDTO.setFileNm(newFileName);
			atchFileDTO.setFileLength(file.length);
			atchFileDTO.setFileStatus("U");
			atchFileDTO.setRegId(loginUserId);
			atchFileDTO.setModId(loginUserId);
			
			atchFileService.insertMultiAtchFileSeq(atchFileDTO);
		
			param.put("dwgSeq",strDwgSeq);
			param.put("mesh1Id",mesh1Id);
			param.put("mesh2Id",mesh2Id);
			param.put("fileId",fileId+"");
			param.put("fileSeq",atchFileDTO.getFileSeq()+"");
			
			param.put("fileBase64", base64Img);
			
			checkService.inserttbkcdwgmst3dfile(param);
			
			
	            
        }catch(Exception e){
            System.out.println("파일이 정상적으로 넘어오지 않았습니다"+e.getMessage());
            mav.put("msg","no");
            return mav;
        }finally{
            //stream.close();
        }
        return mav;
	
	}
	
	
	@ResponseBody
	@PostMapping("/check/interference")
	public void Interferencecheck(@RequestBody SearchDTO searchDTO,HttpServletRequest request){
		
		Map<String, String> param = new HashMap<String, String>();
        param.put("fileId",searchDTO.getFileId());
        HttpSession session = request.getSession();
 		String loginUserId = "";
 		if(session.getAttribute("UserId") == null) {
 			loginUserId = "admin";
 		}else {
 			loginUserId = session.getAttribute("UserId").toString();
 		}
		String strDwgSeq = checkService.selectJsonFileDwgSeq(param);
        
		CheckDwgDTO checkDwgDTO = new CheckDwgDTO();
		checkDwgDTO.setDwgSeq(Integer.parseInt(strDwgSeq));
		checkDwgDTO.setActionDeadline3(searchDTO.getActionDeadline3());  
		checkDwgDTO.setExaminationOpinion3(searchDTO.getExaminationOpinion3());
		checkDwgDTO.setModId(loginUserId);
		checkService.updateCheck (checkDwgDTO);
	}

}
