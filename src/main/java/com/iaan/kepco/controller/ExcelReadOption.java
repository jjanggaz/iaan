package com.iaan.kepco.controller;

import java.util.ArrayList;
import java.util.List;

public class ExcelReadOption {
    /**
     * 엑셀파일의 경로
     */
    private String filePath;

    /**
     * 추출할 컬럼 명
     */
    private List<String> outputColumns;

    /**
     * 추출을 시작할 행 번호
     */
    private int startRow;
    private int sheetNum;

    public String getFilePath() {
        return filePath;
    }
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
    public List<String> getOutputColumns() {

        List<String> temp = new ArrayList<>();
/*
        outputColumns.add("A");
        outputColumns.add("B");
        outputColumns.add("C");
        outputColumns.add("D");
        outputColumns.add("E");
        outputColumns.add("F");
        outputColumns.add("G");
        outputColumns.add("H");
        outputColumns.add("I");
        outputColumns.add("J");
        outputColumns.add("K");
*/
        temp.addAll(outputColumns);

        return temp;
    }
    public void setOutputColumns(List<String> outputColumns) {

        List<String> temp = new ArrayList<>();
        temp.addAll(outputColumns);

        this.outputColumns = temp;
    }

    public void setOutputColumns(String ... outputColumns) {

        if(this.outputColumns == null) {
            this.outputColumns = new ArrayList<>();
        }

        for(String ouputColumn : outputColumns) {
            this.outputColumns.add(ouputColumn);
        }
    }

    public int getStartRow() {
        return startRow;
    }
    public void setStartRow(int startRow) {
        this.startRow = startRow;
    }

    public int getSheetNum() {
        return sheetNum;
    }
    public void setSheetNum(int sheetNum) {
        this.sheetNum = sheetNum;
    }
}