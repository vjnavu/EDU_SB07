"use strict";

function openGateInit() {
    if(document.location.href.indexOf("401_1.html") != -1 || document.location.href.indexOf("proto_km_402.html") != -1){
        let t; 
        let e; 
        let n; 
        let a; 
        let i = $ts.getEl(".gate_container [data-open-btn]")[0];

        ($ts.getEl(".checkContainer").length || $ts.getEl(".isActiveContainer").length) && (
            t = $ts.getEl(".checkContainer").length ? 
            $ts.getEl(".checkContainer .gate_container")[0] : $ts.getEl(".isActiveContainer .gate_container")[0], 
            e = $ts.ce({
                tag: "div",
                class: "gate_ani_Math", 
                parent: t
            }), 
            n = $ts.ce({ 
                tag: "div", 
                id: "animation_container", 
                parent: e 
            }), 
            $ts.ce({
                tag: "canvas",
                id: "canvas",
                parent: n
            }), 
            $ts.ce({
                tag: "div",
                // class: "gate_ani_cover",
                class: "gate_ani_Math_cover",
                id: "dom_overlay_container",
                parent: n
            }), 
            $ts.loadScriptFile("../math/contents/js/createjs.js", function () {
                $ts.loadScriptFile("../math/contents/js/canvasMainNew.js", function () {
                    $ts.loadScriptFile("../math/contents/js/quiz_main_ani.js", function () {
                        
                        init();
                        $('#animation_container #canvas').attr('width',1500);
                        $('#animation_container #canvas').attr('height',940);

                        $(document).ready(function(){
                            $(".cl_mainContainer .search").on("click", function(e){
                                e.preventDefault();
                                const _this = e.currentTarget;
                                const _link = _this.dataset.link;
                                const fileName = "T:/tsherpa/Tsherpa2021/element/교과학습/수학 확인문제/2024/"+ _link + ".pdf";

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
                                        console.log(body);
                                        window.open(result.alink);
                                    },
                                    error: function (xhr, status) {
                                        console.log(xhr);
                                        console.log(status);
                                    }
                                });
                            });

                            // [신규] 곰돌이 문제수 선택 버튼
                            const clickSound = new Audio("../math/libs/media/click.mp3");
                            const quizPages = document.querySelectorAll('.basicSlider_slides li[data-page-num]');
                            const tabs = document.querySelectorAll('.basicSlider_tabs li[data-page-num]');
                            const gumBtns = document.querySelectorAll('.quizList button');
                            let selectedQuizArray = [1,2,3,4,5,6,7];

                            const quizRandomAct = (v) => {
                                console.log(v);
                                const n = v;
                                let random_a = Math.floor(Math.random() * 2);;
                                let random_b = Math.floor(Math.random() * 3);;
                                let random_c = Math.floor(Math.random() * 2);;

                                switch (n) {
                                    case 3 :
                                        selectedQuizArray = [random_c + 1, random_b + 3, random_a + 6];
                                        break;
                                    case 5 :
                                        let _a = [1, 2,  random_a + 6];
                                        let _b = [3,4,5];
                                        _b = _b.filter((value) => { 
                                            console.log(value, random_b)
                                            return value !== random_b + 3
                                        });

                                        selectedQuizArray = _a.concat(_b).sort();
                                        break;
                                    default :
                                        selectedQuizArray = [1,2,3,4,5,6,7];
                                        break;
                                }
                                for (let item of tabs) {
                                    item.dataset.view = '';
                                    item.classList.remove('on');
                                }

                                for (let i = 0; i < selectedQuizArray.length; i++) {
                                    selectedQuizArray[i];
                                    const tab = document.querySelector('.basicSlider_tabs li[data-page-num="'+ selectedQuizArray[i] +'"]');
                                    tab.textContent = '문제 ' +(i + 1);
                                    tab.dataset.view = 'true';

                                    if (i === 0) {
                                        tab.classList.add('on');
                                        document.querySelector('.basicSlider_slides li[data-page-num="'+ selectedQuizArray[i] +'"]').classList.add('on');
                                    }
                                }
                            }
                            const quizRandom = (e) => {
                                clickSound.play();
                                const _this = e.currentTarget;
                                const n = Number(_this.dataset.num);
                                const selected = document.querySelector('.quizList button.active');

                                selected.classList.remove('active');
                                _this.classList.add('active');

                                quizRandomAct(n);
                            }
                            for (let item of gumBtns) {
                                item.addEventListener('click', quizRandom);
                            }
                            let _pageNumber = 0;
                            for (let item of quizPages) {
                                _pageNumber = _pageNumber + 1;
                                item.dataset.pageNum = _pageNumber;
                            }
                            quizRandomAct(7);

                            //칭찬하기 버튼 생성
                            var pBtnHtml = '<span class="cl_sticker">\n' +
                                '\t\t\t\t<img class="on" src="../math/contents/images/icon/sticker.png" alt="기본 이미지">\n' +
                                '\t\t\t\t<img class="last" src="../math/contents/images/icon/sticker_hover.png" alt="클릭시 이미지">\n' +
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
                                '\t\t\t\t\t\t\t<span data-math-txt="13" class="">끝까지 도전하는<br> 모습! 멋지다!</span>\n' +

                                '\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t</div>\n' +
                                '\t\t\t\t</div>\n' +
                                '\t\t\t\t<div class="praiseAni"></div>\n' +
                                '\t\t\t</div>\n' +
                                '\t\t</div>';

                            $("#wrap").append(pPopupHtml);

                            let clapSound = new Audio("../math/contents/media/clap.mp3");

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

                        //모달창 클릭시 텍스트 랜덤
                        function randomChangeTxt () {
                            let randomTxtNum = Math.floor(Math.random()* (13) ) + 1;

                            $('.cl_modalBg .mathTxt span').css('display', 'none');
                            $('.cl_modalBg .mathTxt span[data-math-txt="'+ randomTxtNum +'"]').css('display', 'flex');
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
                                if (totalCnt == 20){
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
            })
        ), 
        i.addEventListener("click", openGateEvent)
    }
}

function openGateEvent() {
    $efSound.click();
    var t, e;
    $ts.getEl("[data-open-gate]")[0].classList.add("on"), $ts.getEl(".gate_container")[0].classList.add("off"), $ts.getEl("#wrap.fishing") && (t = $pm.array.inPage.quiz, e = document.querySelectorAll(".js-dropArea"), dragCount = 0, t.forEach(function (t) {
        t.reset(), t.QUIZ.answerBtn && t.QUIZ.answerBtn.classList.remove("reset")
    }), e.forEach(function (t) {
        t.classList.remove("complete");
        t.childNodes[0];
        console.log("drag", $pm.array.inPage.quiz)
    }))
}
