<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/jstl.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<!-- start::Head -->
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>설계점검시스템</title>

    <script src="/lib/jquery/jquery.min.js"></script>
    <script src="/lib/jquery/jquery-ui.js"></script>
    <link rel="stylesheet" href="/lib/jquery/jquery-ui.css" />
    <link rel="stylesheet" href="/lib/materialdesignicons/materialdesignicons.min.css" />

    <!-- jqgrid -->
    <script src="/lib/jqgrid/js/jquery.jqGrid.min.js"></script>
    <link rel="stylesheet" href="/lib/jqgrid/css/ui.jqgrid.css">
    <link rel="stylesheet" href="/lib/jqgrid/css/custom.css">

    <!-- jstree -->
    <script src="/lib/jstree/jstree.js"></script>
    <!-- <script src="lib/jstree/custom/jstree_custom.js"></script> -->
    <link rel="stylesheet" href="/lib/jstree/theme/default.css" />
    <link rel="stylesheet" href="/lib/jstree/custom/jstree_custom.css" />

    <link rel="stylesheet" href="/css/init.css" />
    <link rel="stylesheet" href="/css/form.css">
    <link rel="stylesheet" href="/css/basicCustom.css" />
    <link rel="stylesheet" href="/css/pop.css" />

    <script src="/js/basicCustom.js"></script>

    <script>
        function btnView() {
            return "<button onclick=\"openPop('pop-view-1')\">view</button>";
        }
        $(function() {
            $("#grid-plan").jqGrid({
                colNames: ["DWG", "루트벨브", "ver", "도면등록일", "완료일", "조치기한", "조치일", "상태", "점검", "도면"],
                colModel: [
                    { name: "DWG", width: "55px" },
                    { name: "rootValve", width: "50px" },
                    { name: "regiDay", width: "55px" },
                    { name: "dueDay", width: "50px" },
                    { name: "deadline", width: "50px" },
                    { name: "dDay", width: "50px" },
                    { name: "state", width: "50px" },
                    { name: "inspect", width: "50px" },
                    { name: "view", width: "50px", align: "center", formatter: formatView },
                    { name: "floor", width: "50px", align: "center", formatter: formatdtdx }
                ],
                autowidth: true,
                //shrinkToFit:false,
                data: [
                    { DWG: "새울2발", rootValve: "5", regiDay: "Reactor", dueDay: "5", deadline: "V0137", dDay: "센싱라인", state: "", inspect: "2D완료", view: "", floor: "" },
                    { DWG: "새울2발", rootValve: "5", regiDay: "Reactor", dueDay: "5", deadline: "V0137", dDay: "센싱라인", state: "", inspect: "3D완료", view: "", floor: "" }
                ],
                //multiselect: true,
            });
        });

        function formatView(cellValue, options, rowObject) {
            return '<img src="../img/ico_readglass.svg" alt="View Image" onclick="openPop(\'pop-view-1\')" />';
        }

        function formatdtdx(cellvalue, options, rowObject) {
            var str = "";
            var row_id = options.rowId;
            var idx = rowObject.idx;

            str += "<button onclick=\"openPop('pop-view-2')\">SVG</button>";

            return str;
        }
    </script>
</head>
<body>
    <div class="wrap-pop">
        <div class="pop-basic" id="pop-view-1">
            <div class="floor-title">
                <div class="line-title">
                    <h3 class="title">2D 설계점검</h3><button class="btn-close" onclick="closePop('pop-view-1')"></button>
                </div>
            </div>
            <div class="floor-conts customScrollbar">
                <div class="area-conts">
                    <section>
                        <div class="grid-pop column2">
                            <dl>
                                <dt>상태:</dt>
                                <dd class="collapseCell">설계점검</dd>
                                <dt>Plant:</dt>
                                <dd>새울2발</dd>
                                <dt>Unit:</dt>
                                <dd>5호기</dd>
                                <dt>Building:</dt>
                                <dd>Reactor Containment BLDG</dd>
                                <dt>Level:</dt>
                                <dd>2Level</dd>
                                <dt>루트밸브:</dt>
                                <dd>V0220</dd>
                                <dt>등록일:</dt>
                                <dd><input type="date" class="customDate "  readOnly='readOnly'/></dd>
                            </dl>
                        </div>
                    </section>
                    <div class="pop-devideLine"></div>
                    <section>
                        <div>
                            <dl class="grid-pop column2">
                                <dt class="verticalMargin">점검결과:</dt>
                                <dd><span>점검이상</span></dd>
                                <dt class="verticalMargin">점검일자:</dt>
                                <dd class="verticalMargin"><input type="date" class="customDate " readOnly='readOnly'/></dd>
                                <dt class="verticalMargin">처리:</dt>
                                <dd class="collapseCell">
                                    <label for="radio2">
                                        <input id="radio2" type="radio" name="process" value="" />
                                        <span>조치지시</span>
                                    </label>
                                    <label for="radio1">
                                        <input id="radio1" type="radio" class="" name="process" value=""  />
                                        <span>완료</span>
                                    </label>
                                </dd>
                                <dt class="verticalMargin">조치기한</dt>
                                <dd class="verticalMargin collapseCell" for="calendar">
                                    <input type="date" id="calendar" class="customDate" />
                                </dd>
                                <dt>검토의견:</dt>
                                <dd class="collapseCell">
                                    <textarea name="" id="" cols="10" rows="10" placeholder="dd"></textarea>
                                </dd>
                                <dt>조치내용:</dt>
                                <dd class="collapseCell">
                                    <textarea name="" id="" cols="10" rows="10" readOnly="readOnly"></textarea>
                                </dd>
                            </dl>
                        </div>
                    </section>
                </div>
            </div>
            <div class="floor-footer">
                <div class="area-footer">
                    <button class="btn-close" onclick="closePop('pop-view-1')">닫기</button>
                </div>
            </div>
        </div>
    </div>
    <div id="wrap-page">
        <header>
            <div class="area-header">
                <h1 class="logoBox">
                    <a href="/index">
                        <img src="/img/ico_logo.png" alt="" />
                    </a>
                </h1>
                <div class="group-headerList">
                    <ul class="list-category">
                        <li onclick="location.href='plan'">공사계획</li>
                        <li onclick="location.href='check'" class="on">설계점검</li>
                        <li onclick="location.href='calc'">비용정산</li>
                    </ul>
                    <ul class="list-accountInfo">
                        <li class="userInfo">
                            <span class="userPic"></span>
                            이영수9797
                        </li>
                        <li class="btn-log"></li>
                    </ul>
                </div>
            </div>
        </header>
        <main class="area-conts">
            <section class="sect-pageTitle">
                <h3>설계점검</h3>
            </section>
            <section class="sect-cont">
                <div class="line-searchCond">
                    <div class="left">
                        <div class="set-form">
                            <label for="">Plant</label>
                            <select name="" id=""></select>
                        </div>
                        <div class="set-form">
                            <label for="">Unit</label>
                            <select name="" id=""></select>
                        </div>
                        <div class="set-form">
                            <label for="">Building</label>
                            <select name="" id=""></select>
                        </div>
                        <div class="set-form">
                            <label for="">Level</label>
                            <select name="" id=""></select>
                        </div>
                        <div class="set-form">
                            <label for="">태그</label>
                            <input type="text">
                        </div>
                    </div>
                    <div class="right btns"></div>
                </div>
                <div class="line-table">
                    <table id="grid-plan"></table>
                </div>
            </section>
        </main>
    </div>
</body>
</html>
