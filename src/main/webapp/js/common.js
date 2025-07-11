let HierarchySelectList = ["searchPlant", "searchUnit", "searchBuilding", "searchLevel", "searchTag"];
let pageCategory = "";

var dwgPlant,dwgUnit,dwgBuilding,dwgLevel, tagNm ,symbolType;
  
var params = {};
  
  
function changeSearchLevel(selectLevel) {
 
	var searchParentId;
	var lvlCode = "";
  	for(var i = selectLevel + 1; i < 5; i++)  {
		  
		if(i == 4){
			$("ul.list-tabPageConts > li.on #"+HierarchySelectList[i]).val("");
		}else{
			$("ul.list-tabPageConts > li.on #"+HierarchySelectList[i]).empty();
		}
    	
  	}

    if(selectLevel == 2){
    	lvlCode = "LVL";
   	}
  
  	(selectLevel == -1) ? searchParentId = "012" : searchParentId = $('ul.list-tabPageConts > li.on #' + HierarchySelectList[selectLevel] + ' option:selected').val();

  	if(searchParentId != undefined && searchParentId != "") {
    	var params = {parentId : searchParentId ,lvlCode : lvlCode};
      
    	$.ajax({
      		url : "/common/hierarchySelectbox",
      		type : 'POST',
      		contentType:"application/json; charset=UTF-8",
      		async: false,
      		data : JSON.stringify(params),
      		success : function(success) {
		        $("ul.list-tabPageConts > li.on #" + HierarchySelectList[selectLevel + 1]).empty();
		        $("ul.list-tabPageConts > li.on #" + HierarchySelectList[selectLevel + 1]).append("<option value=''>선택하세요</option>");
		        for(var i = 0; i < success.data.length; i++)  {
		          $("ul.list-tabPageConts > li.on #" + HierarchySelectList[selectLevel + 1]).append("<option value='" + success.data[i].cdId + "'>" + success.data[i].cdNm + "</option>");
		        }
     		},
	      	error : function(err) {
	        	alert("Error : 오류코드 [ " + err.status + " ]");
	      	}
    	});
  	}
}

function fnSearchList(pageNum)  {
  //var pageNm = $(location).attr('pathname');
  var pageNm = $("ul.list-tabPageConts > li.on").attr("id");
  var ajaxUrl = "/check/check2dList";

  $("ul.list-tabPageConts > li.on #btnDwgInsert").hide();
  $("ul.list-tabPageConts > li.on #btnModelInsert").hide();
  
  
  if (pageNm == "cont-check3d") {
    ajaxUrl = "/check/check3dList";
  }
  else if (pageNm == "cont-checkIssue") {
    ajaxUrl = "/check/checkIssueList";
  }
  else if (pageNm == "cont-plan") {
    ajaxUrl = "/wbs/planList";

  }
  else if (pageNm == "cont-calc") {
    ajaxUrl = "/wbs/calcList";
  }else if (pageNm == "cont-2dDwg") {
    ajaxUrl = "/admin/dwgmng";
    $("ul.list-tabPageConts > li.on #btnDwgInsert").show();
  }else if (pageNm == "cont-3dModel")  {
    ajaxUrl = "/admin/modelmng";
    $("ul.list-tabPageConts > li.on #btnModelInsert").show();
  } else if (pageNm == "cont-symbol") {
    ajaxUrl = "/d3api/symbollist";
  }
  var startRowNum = ((pageNum - 1) * pageSize);
  if (pageNm != "cont-symbol"){
	  dwgPlant =$("ul.list-tabPageConts > li.on #searchPlant").val();
	  dwgUnit  =$("ul.list-tabPageConts > li.on #searchUnit").val();
	  dwgBuilding   =$("ul.list-tabPageConts > li.on #searchBuilding").val();
	  dwgLevel   =$("ul.list-tabPageConts > li.on #searchLevel").val();
	  tagNm  =$("ul.list-tabPageConts > li.on #searchTag").val();
	  
 // console.log("dwgPlant:::::::::::",dwgPlant);
  }else{
	  symbolType =  $("#txtSymbolType").val();
  }
  params = {dwgPlant : dwgPlant,dwgUnit : dwgUnit,dwgBuilding : dwgBuilding,dwgLevel : dwgLevel,tagNm : tagNm,symbolType : symbolType,  pageSize : pageSize, startRowNum : startRowNum};
  
  
  pageCategory = pageNm.replace("cont-", "")

  //    console.log("pageCategory:::::::::::::",pageCategory);
  $.ajax({
    url : ajaxUrl,
    type : 'POST',
    contentType:"application/json; charset=UTF-8",
    async: false,
    data : JSON.stringify(params),
    success : function(success) {
      if(pageNm == "cont-plan"){
        initGridListPlan(success.list);
      }else if(pageNm == "cont-calc") {
        initGridListCalc(success.list);
      }else if(pageNm == "cont-check3d") {
		  
        initGridListCheck3d(success.list);
      }else if(pageNm == "cont-check2d") {
        initGridListCheck2d(success.list);
      }else if(pageNm == "cont-checkIssue") {
        initGridListCheckIssue(success.list);
      }else if(pageNm == "cont-3dModel") {
        initGridListModel(success.list);
      }else if(pageNm == "cont-2dDwg") {
		
        initGridListDwg(success.list);
      }else if(pageNm == "cont-symbol") {
		
        initGridListSymbol(success.list);
      }
      
      
      fnPaging(success.totalDataCnt, pageNum);
    },
    error : function(err) {
      alert("Error : 오류코드 [ " + err.status + " ]");
    }
  });
}











var pageSize = 10;
var pagingCnt = 10;

function fnPaging(totalCnt, pageNum)  {
  var pagination = $(".wrap-pagination");
  pagination.empty();

  var pageHtml = "";
  var lastPageNum = Math.ceil(totalCnt / pageSize);
  var pageStart = Math.floor((pageNum - 1) / pagingCnt) * pagingCnt + 1;
  var showPageNum = pageStart + pagingCnt - 1;

  if(showPageNum > lastPageNum){
    showPageNum = lastPageNum;
  }

  if(pageNum > 1) {
    pagination.append('<button class="btn-first" onclick="fnSearchList(1);"></button>');
  }
  else  {
    pagination.append('<button class="btn-first" disabled="disabled"></button>');
  }

  if(pageNum > 1) {
    pagination.append('<button class="btn-prev" onclick="fnSearchList(' + (pageNum - 1) + ');"></button>');
  }
  else  {
    pagination.append('<button class="btn-prev" disabled="disabled"></button>');
  }

  for(var i = pageStart; i <= showPageNum; i++) {

    if (i == pageNum) {
      pageHtml += '<li class="on">' + i + '</li>';
    }
    else  {
      pageHtml += '<li style="cursor:pointer" onclick="fnSearchList(' + i + ');">' + i + '</li>';
    }
  }

  if(pageHtml == "")  {
    pageHtml += '<li class="on">1</li>';
  }

  pagination.append('<ol>' + pageHtml + '</ol>');

  if(pageNum < lastPageNum) {
    pagination.append('<button class="btn-next" onclick="fnSearchList(' + (pageNum + 1) + ')"></button>');
  }
  else  {
    pagination.append('<button class="btn-next" disabled="disabled"></button>');
  }

  if(pageNum < lastPageNum) {
    pagination.append('<button class="btn-last" onclick="fnSearchList(' + lastPageNum + ')"></button>');
  }
  else  {
    pagination.append('<button class="btn-last" disabled="disabled"></button>');
  }
}