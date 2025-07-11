<!DOCTYPE html>
<html lang="ko" xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout" >
    <!-- head -->
	<head th:replace="layout/fragments/head :: HeadFragment" />
	<style>

	#wrap-page {
	  height: auto;
	  min-height: 100%;
	  padding-bottom: 50px;
	}
	</style>

    <body>
		<!-- top -->
		<th:block th:replace="layout/fragments/top :: TopFragment"></th:block>

		<div id="wrap-page">
			<!-- content -->
			<th:block layout:fragment="Content"></th:block>
			<!-- content -->
		</div>
		<!-- footer -->
		<th:block th:replace="layout/fragments/footer :: Footer"></th:block>
    </body>
</html>