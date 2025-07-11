package com.iaan.kepco.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import com.iaan.kepco.dto.SearchDTO;
import com.iaan.kepco.dto.WbsDTO;
import com.iaan.kepco.service.WbsService;

@Controller
@EnableAutoConfiguration
public class PageController{
	
	
	
	
	@Value("${colyseusServer.Host}")
	private String colyseusServer;
	
	@Value("${rtcSignalServer.Host}")
	private String rtcSignalServer;
	
	
	@Autowired
	private WbsService wbsService;

	
	@GetMapping("/")
	public String indexPage() throws Exception {
		return "redirect:login";
	}
	
	@GetMapping(value = "/login")
	public ModelAndView userLogin(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("login");
		return mv;
	}

	@GetMapping(value = "/logout")
	public ModelAndView userLogout(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("login");
		return mv;
	}
	
	@GetMapping(value = "/index")
	public ModelAndView userIndex(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		
		HttpSession sessionSSS = request.getSession();
		String loginUserId = "";
		String loginUserNm = "";
		if(null ==  sessionSSS.getAttribute("UserId")){
			mv.setViewName("index");
		}else{
		 	loginUserId = sessionSSS.getAttribute("UserId").toString();
		 	loginUserNm = sessionSSS.getAttribute("UserNm").toString();
		 	mv.addObject("id",loginUserId);
			mv.addObject("name",loginUserNm);
			mv.addObject("colyseusServer",colyseusServer);
			mv.addObject("rtcSignalServer",rtcSignalServer);
			
			
			mv.setViewName("index");
		}
		
		
		
		return mv;
	}

	@GetMapping(value = "/plan")
	public ModelAndView userPlan(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("plan");
		return mv;
	}

	@GetMapping(value = "/calc")
	public ModelAndView userCalc(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("calc");
		return mv;
	}


	@GetMapping(value = "/check/check2d")
	public ModelAndView useCheck2(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("check/check2d");
		return mv;
	}

	@GetMapping(value = "/check/check3d")
	public ModelAndView useCheck3(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("check/check3d");
		return mv;
	}

	@GetMapping(value = "/check/checkIssue")
	public ModelAndView useCheckIssue(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("check/checkIssue");
		return mv;
	}
	
	@GetMapping(value = "/admin/dwgmng")
	public ModelAndView useDwgMng(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("admin/dwgmng");
		return mv;
	}
	
	@GetMapping(value = "/admin/modelmng")
	public ModelAndView useModelMng(HttpServletRequest request) throws Exception {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("admin/modelmng");
		return mv;
	}

	// 공사계획 엑셀 다운로드
	@GetMapping("/plan/excelDownload")
	public void downloadCarInfo(HttpServletRequest request, HttpServletResponse response) throws IOException {

		SearchDTO searchDTO = new SearchDTO();
		//searchDTO.setSearchSeq(Integer.parseInt(request.getParameter("searchSeq")));
		//searchDTO.setSearchText(request.getParameter("searchText"));
		
		List<WbsDTO> wbslist = wbsService.selectWbsPlanExcelList(searchDTO);

		if(wbslist != null && wbslist.size() > 0) {
			XSSFWorkbook workbook = new XSSFWorkbook();
			XSSFSheet sheet = null;
			XSSFCell cell = null;
			XSSFRow row = null;

			//Font
			Font cellFont = workbook.createFont();
			cellFont.setFontName("맑은 고딕");	//글씨체
			cellFont.setFontHeight((short)(10 * 20));	//사이즈

			CellStyle cellStyle = workbook.createCellStyle();

			cellStyle.setAlignment(HorizontalAlignment.CENTER);
			cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
			cellStyle.setBorderRight(BorderStyle.THIN);
			cellStyle.setBorderLeft(BorderStyle.THIN);
			cellStyle.setBorderTop(BorderStyle.THIN);
			cellStyle.setBorderBottom(BorderStyle.THIN);
			cellStyle.setFont(cellFont);

			final String fileName = "wbs.xlsx";	// 엑셀 파일명 설정

			final String[] colNames = {
				"Plant", "Unit", "Building", "Level", "루트밸브", "공종명", "시작일", "종료일", "계획물량", "실적물량", "시공사", "시공내역"
			};

			final int[] colWidths = {
				3000, 3000, 8000, 3000, 3000, 5000, 3000, 3000, 3000, 3000, 5000, 8000
			};

			//rows
			int rowCnt = 0;
			int cellCnt = 0;

			// 엑셀 시트명 설정
			sheet = workbook.createSheet("Sheet1");
			row = sheet.createRow(rowCnt++);
			//헤더 정보 구성
			for (int i = 0; i < colNames.length; i++) {
				cell = row.createCell(i);
				cell.setCellValue(colNames[i]);
				cell.setCellStyle(cellStyle);
				sheet.setColumnWidth(i, colWidths[i]);	//column width 지정
			}
			//데이터 부분 생성
			for(WbsDTO dto : wbslist) {
				cellCnt = 0;
				row = sheet.createRow(rowCnt++);

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getPlantNm());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getUnitNm());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getBuildingNm());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getLevelNm());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getRootValveNm());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getWorkCdNm());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getStartDate());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getEndDate());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getPlanQuantity());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getActualQuantity());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getBuilder());

				cell = row.createCell(cellCnt++);
				cell.setCellStyle(cellStyle);
				cell.setCellValue(dto.getBuildContents());
			}

			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-Disposition", "attachment;filename=" + fileName);
			try {
				workbook.write(response.getOutputStream());
			} catch(IOException e) {
				e.printStackTrace();
			} catch(Exception e) {
				e.printStackTrace();
			}

			workbook.close();
		}
	}


}
