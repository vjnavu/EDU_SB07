"use strict";

function openGateInit() {
    var t, e, n, a, i = $ts.getEl(".gate_container [data-open-btn]")[0];
    ($ts.getEl(".checkContainer").length || $ts.getEl(".isActiveContainer").length) && (t = $ts.getEl(".checkContainer").length ? $ts.getEl(".checkContainer .gate_container")[0] : $ts.getEl(".isActiveContainer .gate_container")[0], e = $ts.ce({
        tag: "div",
        class: "gate_ani",
        parent: t
    }), n = $ts.ce({tag: "div", id: "animation_container", parent: e}), $ts.ce({
        tag: "canvas",
        id: "canvas",
        parent: n
    }), $ts.ce({
        tag: "div",
        class: "gate_ani_cover",
        id: "dom_overlay_container",
        parent: n
    }), a = $ts.getEl(".checkContainer").length ? "commonConfirm_Main" : "isActive_Main", $ts.loadScriptFile("../ko/contents/js/createjs-2015.11.26.min.js", function () {
        $ts.loadScriptFile("../ko/contents/js/" + a + ".js", function () {
            $ts.loadScriptFile("../ko/contents/js/canvasMain.js", function () {
                init()

                /*setTimeout(function(){
                    $(".gate_ani canvas").css("width", "1365px");
                }, 200);*/

                $(function (){
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
                        '\t\t\t\t\t\t\t<span data-math-txt="4" class="">우리반 노력왕!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="5" class="">노력하는<br> 모습이 멋있어!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="6" class="">집중해서<br> 풀어줘서 고마워!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="7" class="">끝까지 해줘서<br> 고마워!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="8" class="">넌 해낼거라<br> 생각했어!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="9" class="">집중하는 눈빛!<br> 반짝반짝!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="10" class="">다음 문제도<br> 잘 부탁해!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="11" class="">짝짝짝!<br> 너의 노력이<br> 빛나고 있어!</span>\n' +
                        '\t\t\t\t\t\t\t<span data-math-txt="12" class="">해냈구나<br> 엄지척!</span>\n' +
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
                            playPraiseAni(12);
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
                });

                /*
                  * *** 칭찬하기 팝업 설정
                  * */

                //모달창 클릭시 텍스트 랜덤
                function randomChangeTxt () {
                    let randomTxtNum = Math.floor(Math.random()* (12) ) + 1;

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

            })
        })
    })), i.addEventListener("click", $efSound.click), i.addEventListener("click", openGateEvent)
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
