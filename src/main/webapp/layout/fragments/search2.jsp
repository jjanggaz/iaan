<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
				<div class="line-searchCond">
					<div class="left search-conditions">
						<div class="set-form" style="justify-content: flex-start;">
			            <label for="">3D 심볼명</label>
			            <input type="text" name="txtSymbolType" id="txtSymbolType" style="flex: initial; width: 200px;" />
			          </div>
					</div>

					<div class="right btns">
						<button class="btn-search" onclick="fnSearchList(1);">검색</button>
						<button class="btn-regist" onclick="fnSymbolAdd();">등록</button>
					</div>
				</div>

<script type="text/javascript">
</script>