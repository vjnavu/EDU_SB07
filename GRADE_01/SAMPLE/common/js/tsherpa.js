var _mainUrl = "https://e.tsherpa.co.kr"; //초등 교과 플래시 사용
var _testUrl = "https://e.tsherpa.co.kr"; //초등 교과 플래시 사용


$(document).ready(function () {
    $("title").text("초등 T셀파");
});

//플래시 ie9 이하 height 처리
$(function () {
    $("<style>html, body, form {display:block; height:100%; } div {height:100%;}</style>").prop("type", "text/css").appendTo("head");
});


// 클래스123 알림장 열기 - 초등 플래시내 링크되어 있음
function tsherpa_allim() {
    Note.userID = getQuerystring("flashxmlnum");
    Note.classA = getQuerystring("classa");
    Note.flash_Init();
}

//학습 부가 링크
function open_helper(idx) {
    var url = "http://e.tsherpa.co.kr/webdata/MultiMedia/Flash/2018/curri_helper";
    idx = String(idx);
    switch (idx) {
        case '1':
            //칠판
            url += "/helper.htm?fn=blackboard";
            url = "https://tbag.tsherpa.co.kr/?from=";
            break;
        case '2':
            //깜깜이
            url += "/helper.htm?fn=kkamkkam";
            url = "https://tbag.tsherpa.co.kr/hide/E-tbag-hide.html?from=";
            break;
        case '3':
            //집중벨
            url += "/helper.htm?fn=attention";
            url = "https://tbag.tsherpa.co.kr/focusebell/E-tbag-bell.html?from=";
            break;
        case '4':
            //타이머
            url += "/helper.htm?fn=timer";
            url = "https://tbag.tsherpa.co.kr/timer/E-tbag-stopwatch.html"
            break;
        case '5':
            //모둠 스티커
            url += "/helper.htm?fn=stickers";
            break;
        case '6':
            //벌칙
            url += "/helper.htm?fn=penalties";
            break;
        case '7':
            //발표
            url += "/helper.htm?fn=announce";
            url = "https://tbag.tsherpa.co.kr/presenterpick/E-tbag-guide.html?from=";
            break;
        case '8':
            //알림장
            url = "http://e.tsherpa.co.kr/notice/notice_write.aspx";
            break;
        case '9':
            //오류신고
            url = "http://e.tsherpa.co.kr/curri/pop_regerror.aspx?url=" + encodeURIComponent(opener.document.location.href);
            break;
        default: url += "/helper.htm?fn=blackboard";
            break;
    }

    if (idx == "9") {
        //오류 신고
        //alert(url);
        var winCheck = window.open(url, "winCheck" + idx, "width=800, height=700, resizable=yes");
        winCheck.focus();
    }

    else if (idx == "10") {
        //색연필
        //        if ($.browser.msie) {
        //            $("#pencil1").show();
        //        }
        //        else {
        //            $("#pencil2").show();
        //        }

        $("#pencil2").remove();
        $("body").append("<embed id='pencil2' src='pencil.swf' quality='high' width='100%' height='100%' name='pencil' align='middle' wmode='transparent' allowScriptAccess='always' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' style='position:absolute; left:0px; top:0px; z-index:10; display:none;' />");
        $("#pencil2").show()
    }

    else if (idx == "8") {
        //알림장
        Common.openPop(screen.width, screen.height, url, "yes", "win_note_step", "yes");
    }

    else {
        //alert(url);
        var win = window.open(url, "winHelper" + idx, "width=1024, height=700, channelmode=yes, resizable=yes");
        win.focus();
    }
}

//창닫기(깜깜이)
function helper_close() {
    self.close();
}

// 색연필 닫기
function helper_close2() {
    //색연필
    //    if ($.browser.msie) {
    //        $("#pencil1").hide();
    //    }
    //    else {
    //        $("#pencil2").attr("height", "100%").hide();
    //    }

    $("#pencil2").attr("height", "100%").hide();
}

function helper_hide() {
    if (!$.browser.msie) {
        $("#pencil2").attr("height", "70");
        $("#main_flash").focus();
    }
}

function helper_show() {
    if (!$.browser.msie) {
        $("#pencil2").attr("height", "100%");
    }
}

//집중벨 닫기
function helper_close3() {
    self.close();
}

function open_vacabulary(lecdataid, dicdataid) {
    var url = Common.format(_mainUrl + "/curri/pop_vocabulary.aspx?lecdataid={0}&dicdataid={1}", lecdataid, dicdataid);

    Common.openPop(1000, 621, url, "no", "win_vocabulary", "yes");

    return;
}

function open_photo(dataid, num) {
    var url = Common.format(_mainUrl + "/curri/pop_photo.aspx?dataid={0}&num={1}", dataid, num);

    Common.openPop(1000, 654, url, "no", "win_photo", "yes");

    return;
}

//function send_allim(dataid, fcode) {
//    var url = Common.format("/notice/notice_homework.aspx?dataid={0}&fcode={1}", dataid, fcode);

//    Common.openPop(300, 200, url, "no", "win_aliim", "yes");

//    return;

//}

function send_allim(dataid, fcode) {
    var _ifr = $("#ifr_Allim");

    _ifr.contents().find("#DataID").val(dataid);
    _ifr.contents().find("#FCode").val(fcode);
    _ifr.get(0).contentWindow.save();

    return;
}

function chart_complete() {
    if (typeof opener == "object") {
        var openerUrl = opener.document.location.href;

        if (openerUrl.indexOf("/curri/study.aspx") > -1) {
            opener.load_chasiList();
        }
        else if (openerUrl.indexOf("/curri/pop_chasi2.aspx") > -1) {
            if (typeof opener.opener == "object") {
                var openeropenerUrl = opener.opener.document.location.href;

                if (openeropenerUrl.indexOf("/curri/study.aspx") > -1) {
                    opener.opener.load_chasiList();
                }
            }
        }
    }
}

function view_content(fcode, viewerid, filetype, filepath) {
    //if (siteInfo.checkLogin() && siteInfo.checkCert()) {
    var arrItem = "";

    switch (viewerid) {
        case "1":
            Common.openPop(screen.width, screen.height, _mainUrl + "/media/flashframe.aspx?fcode=" + encodeURIComponent(fcode), "yes", "");

            break;
        case "2":
            Common.openPop(855, 560, _mainUrl + "/media/mediaframe_free.aspx?fcode=" + encodeURIComponent(fcode), "no", "win_player");

            break;
        case "3":
            //                arrItem = load_contentInfo(fcode, "0", "1", "0");

            Common.openPop(screen.width, screen.height, "http://e.tsherpa.co.kr/webdata" + Common.replaceall(filepath, '', '/'), "yes", "", "yes");

            break;
        case "4":
            //                if (filetype.toLowerCase() == "jpg" || filetype.toLowerCase() == "gif") {
            //                    arrItem = load_contentInfo(fcode, "0", "1", "0");

            //                    Common.openOriginImage(encodeURIComponent("http://e.tsherpa.co.kr/webdata" + Common.replaceall(filepath, '', '/')));
            //                }
            //                else {
            do_download(fcode, filetype, filepath);
            //                }

            break;
        case "5":
            alert("pdf.     ");
            break;
        case "6":
            Common.openPop(1014, 665, _mainUrl + "/media/flashskin.aspx?fcode=" + encodeURIComponent(fcode), "no", "");

            break;
        case "7":
            Common.openPop(screen.width, screen.height, Common.replaceall(filepath, '', '/'), "yes", "win_htm", "yes");
            //                arrItem = load_contentInfo(fcode, "1", "1", "0"); // 데이터 가져오기 & 로그체크

            //                if (arrItem[0] != "") {
            //                    Common.openPop(arrItem[2], arrItem[3], Common.replaceall(arrItem[1], '', '/'), "no", "win_htm", "yes");
            //                }

            break;
        case "8":
            Common.openPop(980, 665, _mainUrl + "/media/flashskin2.aspx?fcode=" + encodeURIComponent(fcode), "yes", "", "yes");

            break;
        case "12":
            Common.openPop(480, 196, "http://view.tsherpa.co.kr/viewer/pop_music_class_player.aspx?fcode=" + encodeURIComponent(fcode), "no", "win_player");
            break;

        default:
            alert("해당 컨텐츠는 준비중입니다.     ");
            break;
    }
    //}

    return;
}

// 다운로드
function do_download(fcode, filetype, filepath) {
    var strURL, strFeature;
    var width, height;
    var x, y;

    width = 250;
    height = 50;
    x = (screen.width - width) / 2;
    y = (screen.height - height) / 2;
    strURL = _mainUrl + "/community/downfile.aspx?fcode=" + fcode + "&filepath=" + encodeURIComponent(filepath);
    strFeature = "left=" + x + ", top=" + y + ", width=" + width + ", height=" + height + ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=no";

    var win = window.open(strURL, "win_filedown", strFeature);

    win.focus();

    return;
}

function getQuerystring(name) {
    var rtnval = '';
    var nowAddress = unescape(location.href);
    var parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.length)).split('&');

    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == name.toUpperCase()) {
            rtnval = parameters[i].split('=')[1];
            break;
        }
    }
    return rtnval;
}

function viewChunjaeMedia(mID) {
    var strURL, strFeature;
    var width, height;
    var x, y;

    width = 855;
    height = 560;
    x = (screen.width - width) / 2;
    y = (screen.height - height) / 2;

    if (mID.toLowerCase().indexOf("_800k.mp4") > -1 || mID.toLowerCase().indexOf("_300k.mp4") > -1) {
        strURL = "http://e.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
    }
    else {
        strURL = "http://e.tsherpa.co.kr/media/mediaframe1.aspx?fname=" + (mID.toLowerCase().indexOf("http://chunjae.gscdn.com") > -1 ? mID.replace("http://", "") : mID);
    }
    strFeature = "left=" + x + ", top=" + y + ", width=" + width + ", height=" + height + ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=no";
    var win = window.open(strURL, "win_ChunjaeMedia", strFeature);

    win.focus();
    return;
}

function viewChunjaeMedia2(mID) {

    console.log("11");
    var strURL, strFeature;

    if (mID.toLowerCase().indexOf("_800k.mp4") > -1 || mID.toLowerCase().indexOf("_300k.mp4") > -1) {
        strURL = "https://e.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
    }
    else {
        strURL = "https://e.tsherpa.co.kr/media/mediaframe1.aspx?fname=" + (mID.toLowerCase().indexOf("http://chunjae.gscdn.com") > -1 ? mID.replace("http://", "") : mID);
    }

    $(".layerPop_vid-content").append("<iframe  width=\"100%\" height=\"100%\" src='" + strURL + "' allowfullscreen allow=\"autoplay\"></iframe>")

    return;
}



var Common = {};

//**********************************************************************************************************************************
//* 팝업 띄우기1
//**********************************************************************************************************************************
Common.openPop = function (width, height, url, scroll) {
    var strURL, strName, strFeature;
    var x, y;

    x = (screen.width - width) / 2;
    y = (screen.height - height) / 2;

    strURL = url;
    strName = "win" + Math.round(Math.random() * 100000);
    strFeature = "left=" + x + ", top=" + y + ", width=" + width + ", height=" + height + ", menubar=no, status=no, location=no, resizable=no, toolbar=no, scrollbars=" + scroll;

    var p = window.open(strURL, strName, strFeature);
    p.focus();
}

//**********************************************************************************************************************************
//* 팝업 띄우기2
//**********************************************************************************************************************************
Common.openPop = function (width, height, url, scroll, name) {
    var strURL, strFeature;
    var x, y;

    x = (screen.width - width) / 2;
    y = (screen.height - height) / 2;

    strURL = url;
    strFeature = "left=" + x + ", top=" + y + ", width=" + width + ", height=" + height + ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=" + scroll;
    var win = window.open(strURL, name, strFeature);

    win.focus();
}

//**********************************************************************************************************************************
//* 팝업 띄우기3
//**********************************************************************************************************************************
Common.openPop = function (width, height, url, scroll, name, resize) {
    var strURL, strFeature;
    var x, y;

    x = (screen.width - width) / 2;
    y = (screen.height - height) / 2;

    strURL = url;
    strFeature = "left=" + x + ", top=" + y + ", width=" + width + ", height=" + height + ", menubar=no, status=no, location=no, resizable=" + resize + ", toolbar=no, scrollbars=" + scroll;

    var win = window.open(strURL, name, strFeature);

    win.focus();
}

Common.replaceall = function (text, searchtext, replacetext) {
    return text.split(searchtext).join(replacetext);
}

Common.format = function (text) {
    if (arguments.length <= 1) {
        return text;
    }

    var tokenCount = arguments.length - 2;

    for (var token = 0; token <= tokenCount; token++) {
        text = text.replace(new RegExp("\\{" + token + "\\}", "gi"), arguments[token + 1]);
    }

    return text;
}

//공통 사용 modal
var _ModalPopupBackgroundID = 'modal';
function ShowModalPopup(modalPopupID) {
    var popupID = "#" + modalPopupID;
    var popupMarginTop = $(popupID).height() / 2;
    var popupMarginLeft = $(popupID).width() / 2;
    $('body').css('overflow', 'hidden');
    $(popupID).css({
        'left': '50%',
        'top': '50%',
        'margin-top': -popupMarginTop,
        'margin-left': -popupMarginLeft,
        'display': 'block',
        'position': 'fixed',
        'z-index': 99999
    });

    var backgroundSelector = $('<div id="' + _ModalPopupBackgroundID + '" ></div>');
    backgroundSelector.appendTo('body');

    backgroundSelector.css({
        'width': $(document).width(),
        'height': $(document).height(),
        'display': 'none',
        'background-color': '#000',
        'filter': 'alpha(opacity=50)',
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'z-index': 99998
    });

    backgroundSelector.fadeTo('fast', 0.8);
    backgroundSelector.click(function () {
        HideModalPopup(modalPopupID)
    });
}
function HideModalPopup(modalPopupID) {
    $("#" + modalPopupID).css('display', 'none');
    $("#" + _ModalPopupBackgroundID).remove();
    $('body').css('overflow', 'auto');

    // 2016.03.14 송지훈 - 쉬는시간 레이어 관련iframe 레이어 처리
    if ($("#ifrm_back").length > 0) {
        $("#ifrm_back").hide();
    }
}