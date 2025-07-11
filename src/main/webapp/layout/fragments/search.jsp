<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
				<div class="line-searchCond">
					<div class="left search-conditions">
						<div class="set-form">
							<label for="">Plant</label>
							<select name="searchPlant" id="searchPlant" onchange="changeSearchLevel(0);"></select>
						</div>
						<div class="set-form">
							<label for="">Unit</label>
							<select name="searchUnit" id="searchUnit" onchange="changeSearchLevel(1);"></select>
							</div>
						<div class="set-form">
							<label for="">Building</label>
							<select name="searchBuilding" id="searchBuilding" onchange="changeSearchLevel(2);"></select>
						</div>
						<div class="set-form">
							<label for="">Level</label>
							<select name="searchLevel" id="searchLevel" onchange="changeSearchLevel(3);"></select>
						</div>
						<div class="set-form">
							<label for="">태그</label>
							<input type="text" name="searchTag" id="searchTag">
						</div>
					</div>

					<div class="right btns">
						<button class="btn-search" onclick="fnSearchList(1);">검색</button>
						<button class="btn-excel" id="btnDwgInsert" onclick="openPop('pop-dwginsert','regist');" >등록</button>
						<button class="btn-excel" id="btnModelInsert" onclick="openPop('pop-modelinsert','regist');" >등록</button>
					<!-- 	<button class="btn-plan" id="btnPlan" onclick="openPop('pop-plan');" >공사계획</button> -->
						
					</div>
				</div>

<script type="text/javascript">
</script>