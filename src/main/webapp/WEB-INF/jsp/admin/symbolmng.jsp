<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<body>
    <main class="area-conts customScrollbar">
        <section class="sect-pageTitle">
          <h3>심볼 형상관리</h3>
        </section>

    <section class="sect-cont sect-symbole">
      <jsp:include page="/layout/fragments/search2.jsp" flush="true" />
      <div class="line-table">
        <table id="grid-symbollist"></table>
      </div>
    </section>
    
    
    <div class="wrap-pagination"></div>
  </main>
</body>
<script src="/js/crypto-js.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {

});

$(window).resize(function() {
  $("#grid-symbollist").setGridWidth($(".sect-cont.sect-symbole .line-table").width());
});

function initGridListSymbol(gridData) {

  $("#grid-symbollist").jqGrid('GridUnload');
  $("#grid-symbollist").jqGrid({
    colNames: ["3D 심볼명", "OD", "파일", "다운로드",""],
        colModel: [
            { name: "symbolType", width: "155px", sortable: false },
            { name: "symbolOd", width: "150px", sortable: false },
            { name: "fileNm", width: "250px", align:"left",sortable: false},

            { name: "symbolSeq", width: "80px", sortable: false, formatter:formatDown },

            { name: "symbolSeq", index: "btn2", width: "100px", formatter:formatEdit, sortable: false},
        
        ],
        autowidth:true,
        data: gridData,
  }, function(){
	  $("#grid-symbollist").setGridWidth($(".sect-cont.sect-symbole .line-table").width());
  });

  /* if(gridData.length == 0){
        $("#grid-symbollist").after("<p id='list_nodata' style='margin-top:10px;text-align:center;font-weight:bold;color:#fff;font-size:14px;'>검색 결과가 없습니다.</p>");
    } */ 
}
/* grid에서 버튼 처리 */
function formatDown(cellvalue, options, rowObject){
  
	return "<button class=\"btn-download\" onclick=\"fnSymbolDown('" + rowObject.symbolSeq + "', '" + rowObject.fileNm + "');\" title=\"\"><img src=\"/img/ico_download.svg\" /></button>";
}
function formatEdit(cellvalue, options, rowObject){
	$("#selSymbolType").prop("disabled", true);
   
    
    var encryptedOd = CryptoJS.AES.encrypt(rowObject.symbolOd, "your-secret-key").toString();
   // console.log("Encrypted Text: " + encryptedOd);
    
	return "<button class=\"btn-edit\" onclick=\"fnSymbolUpdate('" + rowObject.symbolSeq + "', '" + rowObject.symbolType + "', '" + encryptedOd + "', '" + rowObject.fileNm + "');\" title=\"\">수정</button><button class=\"btn-delete\" onclick=\"fnSymbolDelete('" + rowObject.symbolSeq + "');\" title=\"\">삭제</button>";
}


function fnSymbolUpdate(symbolSeq ,symbolType,encryptedOd,fileNm){

	$("#txtSymbolOd").prop("readonly", true);
	$("#selSymbolType").val(symbolType);

	$("#txtSymbolOd").val(CryptoJS.AES.decrypt(encryptedOd, "your-secret-key").toString(CryptoJS.enc.Utf8));
	$("#txtSymbolOd").prop("readonly", true);
	   

	$("#txtSymbolSeq").val(symbolSeq);

	openPop("pop-regist-symbol","update"); 
}
function fnSymbolAdd(){
	
	$("#selSymbolType").prop("disabled", false);
	$("#txtSymbolSeq").val("");
	$("#txtSymbolOd").val("");
	
	
	
	openPop('pop-regist-symbol','regist');
}
function fnSymbolDown(symbolSeq,fileNm){
	
	var params = {symbolSeq :symbolSeq }
	$.ajax({
	    type: "GET", // 또는 POST
	    url: "/d3api/symbolfiledown",
	    data: params,
	    xhrFields: {
            responseType: 'blob'  // 바이너리 데이터 처리
        },
	    success: function(blob) {
	    	var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(blob);
	        link.download = fileNm; 
	        link.click();
	       // console.log("파일 다운로드 성공");
	    },
	    error: function(error) {
	        console.error("Error:", error);
	    }
	});
	
}
function fnSymbolDelete(symbolSeq){
	
	
	var params = {symbolSeq : symbolSeq};

	$.ajax({
		url : "/d3api/symboldelete",
		type : 'POST',
		contentType:"application/json; charset=UTF-8",
		async: false,
		data : JSON.stringify(params), 
		success : function(data) {
			alert("삭제 되었습니다.");
			
		},
		error : function(err) {
			alert("Error : 오류코드 [ " + err.status + " ]");
		}
	});
	fnSearchList(1);
	
}
function fnSymbolInsert(){


	var formData = new FormData();
    formData.append("symbolType", $("#selSymbolType").val());
    formData.append("symbolOd", $("#txtSymbolOd").val());
    formData.append("filesymbol", $("#filesymbol")[0].files[0]);
    formData.append("symbolSeq", $("#txtSymbolSeq").val());
     
    if( $("#selSymbolType").val() == "" ){
    	
    	alert("심볼타입을 설정해 주세요.");
    	return ;
    }
    if($("#txtSymbolOd").val() == ""){
    	

    	alert("심볼OD 을 설정해 주세요.");
    	return ;
    }
    if($("#filesymbol")[0].files[0] == null){
    	alert("심볼파일 을 설정해 주세요.");
    	return ;
    	
    }

    $.ajax({
        url: "/d3api/symbolinsert",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
        	
            alert("File and data uploaded successfully!");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("File upload failed: " + textStatus);
        }
    });
    
    fnSearchList(1);
    fnSymbolClose();
	
}
function fnSymbolClose(){
	
	$("#selSymbolType").val(""); //prop('selectedIndex', 1);
    $("#txtSymbolOd").val("");
    $("#filesymbol").val("");
   
	closePop('pop-regist-symbol');
	
}

</script>




<jsp:include page="/layout/fragments/footer.jsp" flush="true" />