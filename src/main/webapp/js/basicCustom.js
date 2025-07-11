

$( document ).ready(function() {
  fnPageTabIdx();
  uiCtrl();

 // document.addEventListener('contextmenu', handleCreateContextMenu, false);
 // document.addEventListener('click', handleClearContextMenu, false);
 
  rangeSlider();
  panelBtnCtrl();
  multipleSelect();
  
  fnPlayBtn();
 
  $(".list-playList").sortable();
});


const fnPlayBtn =()=> {
  $(document).on("click",".line-middleBtns > button", function(){
    if(!($(this).hasClass("on"))){
      $(".line-middleBtns > button").removeClass("on");
      $(this).addClass("on");
    }
  });
}

function headermenuInit(str){
	  let tabIdx = str;
  
  const tabCnt = $(".panel-right ul.list-tabBtns > li").length;
  const contCnt = $(".panel-right ul#ul-Interference > li").length;
  
  $(".panel-right ul.list-tabBtns > li").removeClass("on");
  $(".panel-right ul#ul-Interference > li").removeClass("on");

  if(tabIdx == 0) {
    $(".panel-right ul.list-tabBtns > li").eq(0).addClass("on");
    $(".panel-right ul#ul-Interference > li").eq(0).addClass("on");
    $("ul.list-palette > li").removeClass("on");
  }else if(tabIdx == 2) {
    $(".panel-right ul.list-tabBtns > li").eq(tabCnt - 1).addClass("on");
    $(".panel-right ul#ul-Interference > li").eq(contCnt - 1).addClass("on");
    $("ul.list-palette > li").removeClass("on");
  }else{
    $(".panel-right ul.list-tabBtns > li").eq(1).addClass("on");
    if(!($(".panel-right ul#ul-Interference > li.cont-specific.memory"))) {
      alert();
      $(".panel-right ul#ul-Interference > li").eq(1).addClass("on");
      $("ul.list-palette > li").eq(0).addClass("on").addClass("memory");
    }else{
      const memoryIdx = $(".panel-right ul#ul-Interference > li.memory").index();
      $(".panel-right ul#ul-Interference > li.cont-specific.memory").addClass("on");
      $("ul.list-palette > li").eq(memoryIdx - 1).addClass("on");
    }
  }
}
const fnPageTab = (pageId) => {
	
  uiCtrl();
	
  var siteCheck = "";
  
  
  $(".panel-right ul.list-tabBtns > li").removeClass("on");
  
  if(pageId == "cont-webGl"){
	   headermenuInit(2);
  }
  if(pageId == "cont-web2Gl"){
	  pageId ="cont-webGl";
	  //alert("AutoCad 를 실행하여 2D 설계점검을 진행하세요.");
	  openPop("pop-info-2d");
  }
  if(pageId == "cont-webGl2"){
	  pageId ="cont-webGl";
	  headermenuInit(0);
  }
 
  console.log("pageId::::::::::::"+pageId);
  const thisPage = $("ul.list-tabPageConts > li#"+pageId);
  
  $("ul.list-tabPageConts li").removeClass("on");
  thisPage.addClass("on");
  
  if(pageId == "cont-webGl"){
    $("main.area-main").removeClass("noWebGl");
  }else if(pageId == "cont-symbol"){
    $("main.area-main").addClass("noWebGl");
    fnSearchList(1);
    return;
  }else{
    $("main.area-main").addClass("noWebGl");
  }
  
  changeSearchLevel(-1);
  
  $("#searchTag").val("");
  $("ul.list-tabPageConts > li.on #searchTag").val("");
  fnSearchList(1);
}

const fnPageTabIdx = () => {

  $("ul.list-category > li").on("click", function(){
    $("main.area-main").addClass("off-panel-userList");
    let tabIdx = $(this).index();
    $(this).closest("ul.list-category").children("li").removeClass("on");
    $(this).closest("ul.list-category").children("li").eq(tabIdx).addClass("on");
  });
}


function openPop(popId, kind) {
	
  $(".wrap-pop").addClass("on");
  $("#"+popId).addClass("on").appendTo(".wrap-pop");
  
  if(kind == "regist") {
	  if(popId == "pop-dwginsert"){
	    $("#"+popId + " .line-title .title").text("2D 등록");
	    $("#"+popId + " input.kind-regist").attr("readonly", false);
	    $("#"+popId + " input[name=txtaeInput]").attr("type", "hidden");
	    $("#"+popId + " input[name=txtdwgInput]").attr("type", "hidden");
	    
	    document.getElementById("aeInput").style.display = "";
	    document.getElementById("dwgInput").style.display = "";
	    
	    document.getElementById("txtpassText").style.display = "";
	    document.getElementById("txttagText").style.display = "";
	    
	    document.getElementById("btndwgRight").style.display = "";
	    document.getElementById("btnpassRight").style.display = "";
	    
	    
	    
	    fnDwgInit();
	  }else if(popId == "pop-modelinsert"){
   		$("#"+popId + " .line-title .title").text("3D 등록");
    	$("#"+popId + " input.kind-regist").attr("readonly", true);
    	
    	$("#"+popId + " input[name=txtdgnInput]").attr("type", "hidden");
	    $("#"+popId + " input[name=txtdtdxInput]").attr("type", "hidden");
	    $("#"+popId + " input[name=txthdtdxInput]").attr("type", "hidden");
	    $("#"+popId + " input[name=txtcsvInput]").attr("type", "hidden");
	    
	    
	    
	    document.getElementById("dgnInput").style.display = "";
	    document.getElementById("dtdxInput").style.display = "";
	    document.getElementById("hdtdxInput").style.display = "";
	    document.getElementById("csvInput").style.display = "";
	    fnModelInit();
    }else  if(popId == "pop-regist-symbol"){
		  $("#"+popId + " .line-title .title").text("심볼 등록");
		  $("#"+popId + " input.kind-regist").attr("readonly", false);
		  
	  }else{
		  $("#"+popId + " .line-title .title").text("3D 등록");
		  $("#"+popId + " input.kind-regist").attr("readonly", false);
		  
	  }
  }else {
	if(popId == "pop-dwginsert"){
    	$("#"+popId + " .line-title .title").text("2D 수정");
    	$("#"+popId + " input.kind-regist").attr("readonly", true);
    	$("#"+popId + " input[name=txtaeInput]").attr("type", "text");
	    $("#"+popId + " input[name=txtdwgInput]").attr("type", "text");
	    
	    document.getElementById("txtpassText").style.display = "none";
	    document.getElementById("txttagText").style.display = "none";
	    
	    
	    document.getElementById("aeInput").style.display = "none";
	    document.getElementById("dwgInput").style.display = "none";
	    
	    document.getElementById("btndwgRight").style.display = "none";
	    document.getElementById("btnpassRight").style.display = "none";
	    
	 
    }else if(popId == "pop-modelinsert"){
   		$("#"+popId + " .line-title .title").text("3D 수정");
    	$("#"+popId + " input.kind-regist").attr("readonly", true);
    	
    	$("#"+popId + " input[name=txtdgnInput]").attr("type", "text");
	    $("#"+popId + " input[name=txtdtdxInput]").attr("type", "text");
	    $("#"+popId + " input[name=txthdtdxInput]").attr("type", "text");
	    $("#"+popId + " input[name=txtcsvInput]").attr("type", "text");
	    
	    
	    
	    document.getElementById("dgnInput").style.display = "none";
	    document.getElementById("dtdxInput").style.display = "none";
	    document.getElementById("hdtdxInput").style.display = "none";
	    document.getElementById("csvInput").style.display = "none";
	  
    }else if(popId == "pop-regist-symbol"){
		$("#"+popId + " .line-title .title").text("심볼 수정");
		$("#"+popId + " input.kind-regist").attr("readonly", false);
	}else{
		//$("#"+popId + " .line-title .title").text("3D 수정");
    	$("#"+popId + " input.kind-regist").attr("readonly", true);
	}
  }
}

function openImg() {

  $(".box-pics > img").each(function(){
    $(this).on("click", function(){

      $(".wrap-pop").addClass("on");
      $("#pop-expand").addClass("on").appendTo(".wrap-pop");

      let imgSrc = $(this).attr("src");
   //   console.log($(this));
      $("#pop-expand img.realsize").attr({"src":imgSrc});
    });
  });


}


function closePop(popId) {

 	if($(".wrap-pop").children(".on").length < 2){
    	$('.wrap-pop').removeClass("on");
  	}
  	$("#"+popId).removeClass("on");

}
function closePopAbsolute(popId) {


 	$('.wrap-pop').removeClass("on");
 	$("#"+popId).removeClass("on");

}
function ctrlPop() {
  $(document).on("click", "[class*='pop-'] .btn-close", function(){
    if($(".wrap-pop").children(".on").length < 2){
      $('.wrap-pop').removeClass("on");
    }
    $(this).closest("[class*='pop-']").removeClass("on");

  });
}



function handleClearContextMenu(event){
 const ctxMenu = document.getElementById('context-1');

 // 노출 초기화
 //ctxMenu.style.display = 'none';
 ctxMenu.style.top = null;
 ctxMenu.style.left = null;
}

function handleCreateContextMenu(event){
 event.preventDefault();
 const ctxMenu = document.getElementById('context-1');

 if(event.target.classList.contains("box-view")){
  // 노출 설정
  ctxMenu.style.display = 'block';

  // 위치 설정
  ctxMenu.style.top = event.pageY - 100+'px';
  ctxMenu.style.left = event.pageX+'px';
 }
}

let uiCtrl = () => {
 $(document).on("click", "main.area-main:not('.off-panel-userList') .panel-userList .btn-fold", function(){
  let $this = $(this).closest("main.area-main");
  $this.addClass("off-panel-userList");
 });
 $(document).on("click", ".area-main.off-panel-userList .panel-userList", function(){
  let $this = $(this).closest("main.area-main");
  $this.removeClass("off-panel-userList");
 });

 $(document).on("click", "nav.panel-nav .btn-navBar", function(){
  let triggerEl = $(this);
  leftCtrl(triggerEl);
 });

 $(document).on("click", ".panel-right .btn-navBar", function(){
	let triggerEl = $(this);
	rightCtrl(triggerEl);
 });

 $(document).on("click", ".box-view .btn-toggleSize", function(){
  let triggerEl = $(this);
  leftCtrl(triggerEl);
  rightCtrl(triggerEl);
  userListCtrl(triggerEl);
 });

 tabCtrl();
}

let panelRightStatus = false;
let rightContStatus = false;

const tabCtrl = () => {
 $(document).on("click", "ul.list-palette > li", function(){
   
   
  
  if ($(this).attr("linked-idx")) {
    let tabIdx = Number($(this).attr("linked-idx")) - 1;
    let tabTitle = $(this).text();
    $(".panel-right ul.list-tabBtns > li").removeClass("on");
    $(".panel-right ul.list-tabBtns > li").eq(1).addClass("on");
    
    $(".panel-right ul.list-tabBtns > li:nth-child(2) button").text(tabTitle);
    
    $("#ul-Interference > li").removeClass("on").removeClass("memory");
    $("ul#ul-Interference > li").eq(tabIdx + 1).addClass("on").addClass("memory");
  }

  if ($(this).hasClass("btn-init")) {
    $(".panel-right ul.list-tabBtns > li").removeClass("on");
    $(".panel-right ul.list-tabBtns > li.tab-information").addClass("on");
    $(".panel-right ul.list-tabConts > li").removeClass("on");
    $(".panel-right ul.list-tabConts > li.cont-information").addClass("on");
  }



  /*$(".panel-nav ul.list-tabBtns > li").removeClass("on");
  $(".panel-nav ul.list-tabConts > li").removeClass("on");*/
  
  
  /*if(!$(this).hasClass("on")){*/
   $(this).closest("ul").children("li").removeClass("on");
   $(this).addClass("on");
   
   
   rightContStatus = true;

   /*$(".panel-nav ul.list-tabBtns > li").eq(1).addClass("on");

   $(".panel-nav ul.list-tabConts > li").eq(tabIdx+1).addClass("on");

   $(".panel-nav ul.list-tabBtns > li:nth-child(2) > button").text(tabTitle);*/
  /*} else{
   $(this).closest("ul").children("li").removeClass("on");

   $(".panel-nav ul.list-tabBtns > li").eq(0).addClass("on");

   $(".panel-nav ul.list-tabConts > li").eq(0).addClass("on");
  }*/
	rightBtnCtrl();

 });

 $(document).on("click", ".panel-nav ul.list-tabBtns > li", function(){
  

  let tabIdx = $(this).index();

  $(this).closest("ul").children("li").removeClass("on");
  $(this).addClass("on");

  $(this).closest("ul").next("ul").children("li").removeClass("on");
  $(this).closest("ul").next("ul").children("li").eq(tabIdx).addClass("on");
  /*$(".panel-nav ul.list-tabConts > li").removeClass("on");
  $(".panel-nav ul.list-tabConts > li").eq(tabIdx).addClass("on");*/
 });
 
 
 $(document).on("click", ".panel-right ul.list-tabBtns > li", function(){
	 
	
  let tabIdx = $(this).index();
  
  const tabCnt = $(".panel-right ul.list-tabBtns > li").length;
  const contCnt = $(".panel-right ul#ul-Interference > li").length;
  
  $(".panel-right ul.list-tabBtns > li").removeClass("on");
  $(".panel-right ul#ul-Interference > li").removeClass("on");

  if(tabIdx == 0) {
    $(".panel-right ul.list-tabBtns > li").eq(0).addClass("on");
    $(".panel-right ul#ul-Interference > li").eq(0).addClass("on");
    $("ul.list-palette > li").removeClass("on");
  }else if(tabIdx == 2) {
    $(".panel-right ul.list-tabBtns > li").eq(tabCnt - 1).addClass("on");
    $(".panel-right ul#ul-Interference > li").eq(contCnt - 1).addClass("on");
    $("ul.list-palette > li").removeClass("on");
  }else{
    $(".panel-right ul.list-tabBtns > li").eq(1).addClass("on");
    if(!($(".panel-right ul#ul-Interference > li.cont-specific.memory"))) {
      alert();
      $(".panel-right ul#ul-Interference > li").eq(1).addClass("on");
      $("ul.list-palette > li").eq(0).addClass("on").addClass("memory");
    }else{
      const memoryIdx = $(".panel-right ul#ul-Interference > li.memory").index();
      $(".panel-right ul#ul-Interference > li.cont-specific.memory").addClass("on");
      $("ul.list-palette > li").eq(memoryIdx - 1).addClass("on");
    }
  }
 });
}

const userListCtrl = (triggerEl) => {
 $this = triggerEl.closest(".area-main");
 if($this.hasClass("off-panel-userList")) {
  $this.removeClass("off-panel-userList");
 }else{
  $this.addClass("off-panel-userList");
 }
}

const leftCtrl = (triggerEl) => {
 $this = triggerEl.closest(".area-main");
 if($this.hasClass("off-panel-nav")) {
  $this.removeClass("off-panel-nav");
 }else{
  $this.addClass("off-panel-nav");
 }
}

const rightCtrl = (triggerEl) => {
 $this = triggerEl.closest(".area-main");
 if($this.hasClass("off-panel-right")) {
  $this.removeClass("off-panel-right");
  panelRightStatus = true;
 }else{
  $this.addClass("off-panel-right");
  panelRightStatus = false;
 }
 rightBtnCtrl();
}


const rightBtnCtrl = () => {
 if(rightContStatus === true) {
	$(".panel-right").addClass("exist");
 }else{
	$(".panel-right").removeClass("exist");
 }
}




const rangeSlider = () => {
	$(".kit-rangeSlider input[type='range']").each(function(){
		$(this).closest(".kit-rangeSlider").find("input[type='text']").val($(this).val());
	});
	$(".kit-rangeSlider input[type='range']").change(function(){
		$(this).closest(".kit-rangeSlider").find("input[type='text']").val($(this).val());
	})
}


const panelBtnCtrl = () => {
	$("ul.list-panelBtns > li.skill").on("click", function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
		}else{
			$(this).closest(".list-panelBtns").find("li.skill").removeClass("on");
			$(this).addClass("on");
		}
		
		if($(this).hasClass("draw")){
			$("dl.column-panelModule").removeClass("on");
			$("dl.column-pickColor, dl.column-pickThick").addClass("on");
		}
		if($(this).hasClass("text")){
			$("dl.column-panelModule").removeClass("on");
			$("dl.column-fontSize, dl.column-pickColor").addClass("on");
		}
		if($(this).hasClass("clipart")){
			$("dl.column-panelModule").removeClass("on");
			$("dl.column-clipart").addClass("on");
		}
	});
	
	
	$("ul.list-colors > li").on("click", function(){

		$(this).closest(".list-colors").find("li").removeClass("on");
		$(this).addClass("on");
		
	});
	
	$("ul.list-thickness > li").on("click", function(){

		$(this).closest(".list-thickness").find("li").removeClass("on");
		$(this).addClass("on");
		
	});

}



function multipleSelect() {


}


