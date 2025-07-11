package com.iaan.kepco.controller;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.formula.eval.ErrorEval;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class ExcelRead {

	public static List<Map<String, String>> read(ExcelReadOption excelReadOption) {
     	if(excelReadOption != null) {
            Workbook wb = ExcelFileType.getWorkbook(excelReadOption.getFilePath());

            int sheetNum = wb.getNumberOfSheets();

            Row row = null;        // row
            Cell cell = null;      // cell
            String cellName = "";  // cell name
            int numOfCells = 0;    // cell number

            Map<String, String> map = null;
            List<Map<String, String>> result = new ArrayList<>();
            sheetNum = 1;

            /* 엑셀 시트가 1개가 아닌 여러개의 경우 for문을 통해 처리 */
            for(int k=0; k<sheetNum; k++) {
            	Sheet sheet = wb.getSheetAt(k);
                int numOfRows = sheet.getLastRowNum() + 1;

                if(numOfRows <= 1) {
                    map = new HashMap<>();
                    map.put("errorMessage", "numOfRows 1이 반환되는 오류 발생");
                    result.add(map);
                    return result;
                }

                /* 각 Row만큼 반복을 한다. */
                for(int rowIndex = excelReadOption.getStartRow() + 1; rowIndex < numOfRows; rowIndex++) {

                    row = sheet.getRow(rowIndex);

                    if(sheet.getRow(rowIndex).getCell(1) != null && row != null) {
                        numOfCells = row.getLastCellNum();
                        map = new HashMap<>();

                        for(int cellIndex = 0; cellIndex < numOfCells; cellIndex++) {

                            cell = row.getCell(cellIndex);
                            String value = "";

                            if(cell == null) {
                            	continue;
                            }else {
                            	if(cell.getCellType() == CellType.STRING) { // getRichStringCellValue() 메소드를 사용하여 컨텐츠를 읽음
                                    value = cell.getRichStringCellValue().getString();
	                            }else if(cell.getCellType() == CellType.NUMERIC){ // 날짜 또는 숫자를 포함 할 수 있으며 아래와 같이 읽음
	                                    if (DateUtil.isCellDateFormatted(cell))	{
	                                    	DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
	  	                                  	Date date = cell.getDateCellValue();
	  	                                  	value = df.format(date);
	                                    }
	                                    else
	                                        value = String.valueOf(cell.getNumericCellValue());
	                                        if (value.endsWith(".0"))
	                                            value = value.substring(0, value.length() - 2);
	                            }else if(cell.getCellType() == CellType.BOOLEAN) {
	                                    value = String.valueOf(cell.getBooleanCellValue());
	                            }else if(cell.getCellType() == CellType.FORMULA) {
	                              value = String.valueOf(cell.getNumericCellValue());
	                            }else if(cell.getCellType() == CellType.ERROR) {
	                                 value = ErrorEval.getText(cell.getErrorCellValue());
	                            }else {
	                                    value = "";
	                            }
                            }
                            value =  value.replaceAll("(\r\n|\r|\n|\n\r)", "");

                            cellName = getName(cell, cellIndex);
                            if( cellName == "" ) {
                                continue;
                            }
                            /* map객체의 Cell의 이름을 키(Key)로 데이터를 담는다. */
                            map.put(cellName, value);
                        }
                         result.add(map);
                        }else { /* Column(행) 값이 null이거나 row(열)이 null인 경우 break; */
                            break;
                        }
                    } /* 행의 개수가 끝날 떄까지 */
                } /* 시트 개수가 끝날 떄까지 */
                return result;
            }
            return null;
        }

	private static String getName(Cell cell, int cellIndex) {
		int cellNum = 0;
        String cellName = "";
        if(cell != null) {
        	if (cellIndex == 0) cellName = "plantNm";
        	if (cellIndex == 1) cellName = "unitNm";
        	if (cellIndex == 2) cellName = "buildingNm";
        	if (cellIndex == 3) cellName = "levelNm";
        	if (cellIndex == 4) cellName = "rootValveNm";
        	if (cellIndex == 5) cellName = "wCdNm";
        	if (cellIndex == 6) cellName = "startDate";
        	if (cellIndex == 7) cellName = "endDate";
        	if (cellIndex == 8) cellName = "planQuantity";
        	if (cellIndex == 9) cellName = "actualQuantity";
        	if (cellIndex == 10) cellName = "builder";
        	if (cellIndex == 11) cellName = "buildContents";

            cellNum = cell.getColumnIndex();
        }
        else {
            cellNum = cellIndex;
            cellName = "";
        }

        return cellName;
	}



}