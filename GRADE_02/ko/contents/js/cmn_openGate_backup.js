"use strict";

function openGateInit() {
    if(document.location.href.indexOf("401_1.html") != -1 || document.location.href.indexOf("proto_km_402.html") != -1){
        $("head").append('<link rel="stylesheet" href="../ko/contents/css/startGateNew.css">');

        var t, e, n, a, i = $ts.getEl(".gate_container [data-open-btn]")[0];
        ($ts.getEl(".checkContainer").length || $ts.getEl(".isActiveContainer").length) && (t = $ts.getEl(".checkContainer").length ? $ts.getEl(".checkContainer .gate_container")[0] : $ts.getEl(".isActiveContainer .gate_container")[0], e = $ts.ce({
            tag: "div",
            // class: "gate_ani",
            class: "gate_ani_Math", //수학
            parent: t
        }), n = $ts.ce({tag: "div", id: "animation_container", parent: e}), $ts.ce({
            tag: "canvas",
            id: "canvas",
            parent: n
        }), $ts.ce({
            tag: "div",
            // class: "gate_ani_cover",
            class: "gate_ani_Math_cover",
            id: "dom_overlay_container",
            parent: n
        }), a = $ts.getEl(".checkContainer").length ? "quiz_main_ani" : "quiz_main_ani", $ts.loadScriptFile("../ko/contents/js/createjs.js", function () {
            $ts.loadScriptFile("../ko/contents/js/canvasMainNew.js", function () {
                $ts.loadScriptFile("../ko/contents/js/" + a + ".js", function () {


                    init()
                    $('#animation_container #canvas').attr('width',1500);
                    $('#animation_container #canvas').attr('height',940);

                    $(document).ready(function(){

                        /*
                        * *** 게이트화면 설정
                        * */

                        //기존 게이트화면 html 제거
                        $("#wrap .gate_container .gate_title_container").remove();


                        //게이트화면 html 생성
                        var gateHtml = '<div class="cl_mainContainer">\n' +
                            '\t\t\t\t<div class="gate_title_title"><span class="orange">확인</span> 문제</div>\n' +
                            '\t\t\t\t<div class="gate_sub_title">문제 수를 선택하세요.</div>\n' +
                            '\n' +
                            '\t\t\t\t<ul class="quizList cl_absolute">\n' +
                            '\t\t\t\t\t<li data-num="3">\n' +
                            '\t\t\t\t\t\t<span class="count">3문제</span>\n' +
                            '\t\t\t\t\t\t<span class="checked"> <span class="circle"></span>선택</span>\n' +
                            '\t\t\t\t\t</li>\n' +
                            '\t\t\t\t\t<li data-num="5">\n' +
                            '\t\t\t\t\t\t<span class="count">5문제</span>\n' +
                            '\t\t\t\t\t\t<span class="checked"> <span class="circle"></span>선택</span>\n' +
                            '\t\t\t\t\t</li>\n' +
                            '\t\t\t\t\t<li class="active" data-num="10">\n' +
                            '\t\t\t\t\t\t<span class="count">7문제</span>\n' +
                            '\t\t\t\t\t\t<span class="checked"> <span class="circle"></span>선택</span>\n' +
                            '\t\t\t\t\t</li>\n' +
                            '\t\t\t\t</ul>\n' +
                            '\t\t\t\t<div class="gate_btn" data-open-btn="" data-hover=""><span>시작</span></div>\n' +
                            '\n' +
                            '\t\t\t\t<div class="worksheet downloadBtn">\n' +
                            '\t\t\t\t\t<a href="" target="_blank" class="search" data-name="활동지 미리보기"></a>\n' +
                            '\t\t\t\t\t<a href="" target="_blank" class="down" data-name="활동지 다운로드"></a>\n' +
                            '\t\t\t\t</div>\n' +
                            '\t\t\t</div>';

                        $("#wrap .gate_container").append(gateHtml);

                        $("#wrap .gate_container").show();


                        //활동지 미리보기, 활동지 다운로드 버튼 href 지정
                        //$(".cl_mainContainer a.search").attr("href", $("#wrap .gate_container input.reviewBtnHref").val());
                        $(".cl_mainContainer a.down").attr("href", $("#wrap .gate_container input.downBtnHref").val());


                        //활동지 미리보기 다운버튼
                        $(".cl_mainContainer a.search").on("click", function(e){
                            e.preventDefault();

                            var fileName = "T:/tsherpa/Tsherpa2021/element/교과학습/수학 확인문제/2023/"+makePreviewFileName();

                            let body = {};
                            let srcFilePath = [];
                            let isLogin = "true";
                            let userType = "S";
                            let pageNumber = "1,3,5";
                            let isExternal = "y";

                            srcFilePath.push(fileName);

                            body.srcFilePath = srcFilePath;
                            body.isLogin = isLogin;
                            body.userType = userType;
                            body.pageNumber = pageNumber;
                            body.isExternal = isExternal;

                            $.ajax({
                                url : 'https://view.chunjae.co.kr/streamdocs/v4/custom/documents/view',
                                type : 'POST',
                                cache : false,
                                contentType : 'application/json; charset=utf-8',
                                data : JSON.stringify(body),
                                success: function (result) {
                                    window.open(result.alink);
                                },
                                error: function (xhr, status) {
                                    console.log(xhr);
                                    console.log(status);
                                }
                            });
                        });


                        //곰돌이 버튼
                        $('.cl_mainContainer .quizList li').on('click', function(){
                            $('.cl_mainContainer .quizList li').removeClass('active');
                            $(this).addClass('active');

                            var num = $(this).attr('data-num');
                            countNum ( num );

                            var buttonClick = new Audio("../ko/libs/media/click.mp3");
                            buttonClick.play();
                        });


                        //각 페이지에 순서대로 번호 부여
                        $('.basicSlider_slides').eq(0).children("li").each(function(index){
                            $(this).attr('data-page-num', index+1);
                        });


                        //랜덤 번호 생성
                        let solveArr = [1,2,3,4,5,6,7,8,9,10];
                        for(let i = 0; i < 500; i++) {
                            let randomNum1 = Math.floor(Math.random() * 10);
                            let randomNum2 = Math.floor(Math.random() * 10);

                            let temp = solveArr[randomNum1]
                            solveArr[randomNum1] = solveArr[randomNum2]
                            solveArr[randomNum2] = temp;

                        }


                        //랜덤으로 섞은 번호를 버튼에 부여
                        $('.basicSlider_tabs li').each(function(index){
                            $(this).attr('data-page-num', solveArr[index]);
                        })


                        //디폴트로 10문제 선택
                        countNum ( 10 );


                        //각 랜덤에 부합하는 contents 내용
                         $('.basicSlider_tabs li').on('mouseup', function(){     /*click를 mouseup으로 변경 --> 선긋기 오류 해결*/
                            $('.basicSlider_slides').eq(0).children("li").css('display', 'none');
                            let pageNum = $(this).attr('data-page-num');

                           $('.basicSlider_slides').eq(0).children("li[data-page-num="+pageNum+"]").css("display", "flex");

                            $('.basicSlider_slides').eq(0).children("li").removeClass("on");
                            $('.basicSlider_slides').eq(0).children("li[data-page-num="+pageNum+"]").addClass("on");
                        });

                        //시작버튼 클릭 시
                        $(".gate_btn").on("mouseup", function(){

                            //10문제 선택인경우 랜덤으로 섞은번호 원래대로
                            if($(".quizList > li[data-num=10]").hasClass("active") == true){
                                solveArr = [1,2,3,4,5,6,7,8,9,10];
                                $('.basicSlider_tabs li').each(function(index){
                                    $(this).attr('data-page-num', solveArr[index]);
                                })
                            }

                            $(".gate_container").addClass("off");
                            $(".checkContainer.math").addClass("on");
                            $('.basicSlider_slides').eq(0).children("li").css('display', 'none');
                            $('.basicSlider_slides').eq(0).children("li[data-page-num="+solveArr[0]+"]").css("display", "flex");

                            $('.basicSlider_slides').eq(0).children("li").removeClass("on");
                            $('.basicSlider_slides').eq(0).children("li[data-page-num="+solveArr[0]+"]").addClass("on");


                            $(".basicSlider_tabs li").eq(0).trigger("click");


                            try{
                                showLeftSlide();
                            }catch(err){

                            }

                        });



                        /*
                        * *** 칭찬하기 팝업 설정
                        * */

                        //칭찬하기 버튼 생성
                        var pBtnHtml = '<span class="cl_sticker">\n' +
                            '\t\t\t\t<img class="on" src="../ko/contents/images/icon/sticker.png" alt="기본 이미지">\n' +
                            '\t\t\t\t<img class="last" src="../ko/contents/images/icon/sticker_hover.png" alt="클릭시 이미지">\n' +
                            '\t\t\t</span>';

                        $("#wrap header").append(pBtnHtml);


                        //칭찬하기 팝업 생성
                        var pPopupHtml = '<div class="cl_modalBg">\n' +
                            '\t\t\t<div class="modalInner">\n' +
                            '\t\t\t\t<div class="modalTop">\n' +
                            '\t\t\t\t\t<span class="closeBtn"></span>\n' +
                            '\t\t\t\t</div>\n' +
                            '\t\t\t\t<div class="modalBody">\n' +
                            '\t\t\t\t\t<div class="mathBoardInner">\n' +
                            '\t\t\t\t\t\t<div class="mathTxt">\n' +
                            '\t\t\t\t\t\t\t<span data-math-txt="1" class="">네가 참 <br> 자랑스러워!</span>\n' +
                            '\t\t\t\t\t\t\t<span data-math-txt="2" class="">정말 대단해!</span>\n' +
                            '\t\t\t\t\t\t\t<span data-math-txt="3" class="">노력해줘서<br>고마워!</span>\n' +
                            '\t\t\t\t\t\t</div>\n' +
                            '\t\t\t\t\t</div>\n' +
                            '\t\t\t\t</div>\n' +
                            '\t\t\t\t<div class="praiseAni"></div>\n' +
                            '\t\t\t</div>\n' +
                            '\t\t</div>';

                        $("#wrap").append(pPopupHtml);



                        let clapSound = new Audio("../ko/contents/media/clap.mp3");

                        //칭찬하기 버튼 클릭 시
                        $('.cl_sticker img').on('click', function(){
                            if($('.cl_sticker img').hasClass('on')) {
                                $('.cl_modalBg').addClass('show');
                                playPraiseAni(3);
                                randomChangeTxt ();

                                clapSound.play();
                                clapSound.currentTime = 0;
                            }
                        })

                        //칭찬하기 팝업 닫기버튼
                        $('.cl_modalBg .modalTop .closeBtn').on('click', function(){

                            $('.cl_modalBg').removeClass('show');
                            clapSound.pause();
                        });

                    });//document ready


                    /*
                    * *** 활동지 미리보기 파일명 조합해서 생성
                    * */
                    function makePreviewFileName(){
                        //주소에서 html파일명 따오기
                        var arrSlashSplit = document.location.href.split("/");
                        var htmlFileName = arrSlashSplit[arrSlashSplit.length-1].split("?")[0];
                        var htmlFileNameSplit = htmlFileName.split("_");

                        //박 / 한 구분
                        var firstName = (htmlFileName.indexOf("suh_p_") != -1) ? "박" : "한";

                        //학년/학기 구분
                        var grade = htmlFileNameSplit[2].substr(1,1) +"-"+ htmlFileNameSplit[2].substr(3,1);

                        //단원 구분
                        var chapter = parseInt(htmlFileNameSplit[3]);

                        //차시 구분
                        var order = (htmlFileNameSplit[4].substr(2,1) == "0") ? "0"+parseInt(htmlFileNameSplit[4]) : parseInt(htmlFileNameSplit[4]);
                        
                        //예외처리
                        if(firstName == "한" && grade == "3-1" && chapter == "3"){
                            order = htmlFileNameSplit[4];
                        }
                        if(firstName == "한" && grade == "4-1" && chapter == "4"){
                            order = htmlFileNameSplit[4];
                        }
                        if(firstName == "한" && grade == "4-1" && chapter == "5"){
                            order = htmlFileNameSplit[4];
                        }
                        if(firstName == "한" && grade == "4-1" && chapter == "6"){
                            order = htmlFileNameSplit[4];
                        }

                        var finalFileName = "5~6학년군_수학("+firstName+")"+grade+"_확인문제_"+chapter+"_"+order+"차시.pdf";

                        return finalFileName;
                    }



                    /*
                    * *** 게이트화면 설정
                    * */

                    function countNum ( num ) {
                        $('.basicSlider_tabs li').css('display', 'none');
                        for(let k = 0; k < num; k++) {
                            $('.basicSlider_tabs li').eq(k).css('display', 'flex');
                        }
                    }


                    /*
                    * *** 칭찬하기 팝업 설정
                    * */

                    //모달창 클릭시 텍스트 랜덤
                    function randomChangeTxt () {
                        let randomTxtNum = Math.floor(Math.random()* (3) ) + 1;

                        $('.cl_modalBg .mathTxt span').css('display', 'none');
                        $('.cl_modalBg .mathTxt span[data-math-txt="'+ randomTxtNum +'"]').css('display', 'block');
                    }

                    //곰돌이 애니메이션
                    var praiseAniInterval
                    function playPraiseAni(_repeat){
                        var totalCnt = 0;
                        var aniCnt = 0;
                        var nextPosX;
                        var nextPosY = 0;

                        var repeatCnt = 1;

                        clearInterval(praiseAniInterval);
                        praiseAniInterval = setInterval(function(){

                            if(totalCnt == 20){
                                nextPosY = 260;
                                nextPosX = 0;
                                aniCnt = 0;
                            }

                            nextPosX = aniCnt * 300;

                            $(".praiseAni").css("background-position-x", -nextPosX+"px");
                            $(".praiseAni").css("background-position-y", -nextPosY+"px");

                            aniCnt++;
                            totalCnt++;


                            if(totalCnt >= 29){
                                if(repeatCnt < _repeat) {
                                    repeatCnt++;

                                    totalCnt = 0;
                                    aniCnt = 0;
                                    nextPosY = 0;
                                    nextPosX = 0;
                                }else {
                                    clearInterval(praiseAniInterval);
                                }

                            }

                        }, 40);
                    }


                });
            })

        })), i.addEventListener("click", $efSound.click), i.addEventListener("click", openGateEvent)

    }else{
        var t, e, n, a, i = $ts.getEl(".gate_container [data-open-btn]")[0];
        ($ts.getEl(".checkContainer").length || $ts.getEl(".isActiveContainer").length) && (t = $ts.getEl(".checkContainer").length ? $ts.getEl(".checkContainer .gate_container")[0] : $ts.getEl(".isActiveContainer .gate_container")[0], e = $ts.ce({
            tag: "div",
            class: "gate_ani",
            parent: t
        }), n = $ts.ce({tag: "div", id: "animation_container", parent: e}), $ts.ce({tag: "canvas", id: "canvas", parent: n}), $ts.ce({
            tag: "div",
            class: "gate_ani_cover",
            id: "dom_overlay_container",
            parent: n
        }), a = $ts.getEl(".checkContainer").length ? "commonConfirm_Main" : "isActive_Main", $ts.loadScriptFile("../ko/contents/js/createjs-2015.11.26.min.js", function () {
            $ts.loadScriptFile("../ko/contents/js/" + a + ".js", function () {
                $ts.loadScriptFile("../ko/contents/js/canvasMain.js", function () {
                    init()
                })
            })
        })), i.addEventListener("click", $efSound.click), i.addEventListener("click", openGateEvent)
    }

}


function openGateEvent() {
    var t, e;
    $ts.getEl("[data-open-gate]")[0].classList.add("on"), $ts.getEl(".gate_container")[0].classList.add("off"), $ts.getEl("#wrap.fishing") && (t = $pm.array.inPage.quiz, e = document.querySelectorAll(".js-dropArea"), dragCount = 0, t.forEach(function (t) {
        t.reset(), t.QUIZ.answerBtn && t.QUIZ.answerBtn.classList.remove("reset")
    }), e.forEach(function (t) {
        t.classList.remove("complete");
        t.childNodes[0];
        console.log("drag", $pm.array.inPage.quiz)
    }))
}
