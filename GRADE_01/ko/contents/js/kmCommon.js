/* ko, math에서 팝업 zindex */
const popBtns = document.querySelectorAll(".popBtn[data-popup-btn]");
const parentDocument = parent.document.querySelector('iframe');

popBtns.forEach(el => {
    el.addEventListener("click", function () {
        if (el.classList.contains("noIndex")) return;

        if (window.location.href.indexOf('http') > -1) {
            // TODO: 뷰어 네비게이션 숨김 처리
            // parentDocument.parentNode.style.position = 'relative';
            parentDocument.parentNode.parentNode.style.zIndex = 120;
        }
    });
});

$(document).on('click', '.whole .popup_closeBtn', function () {
    if (window.location.href.indexOf('http') > -1) {
        parentDocument.parentNode.parentNode.style = "";
    }
})

// document.addEventListener("click", function (e) {
//     if (e.target.classList.contains("popup_closeBtn") && !e.target.closest("[data-popup-page]").classList.contains("noIndex")) {
//         if (window.location.href.indexOf('http') > -1) {
//             // TODO: 뷰어 네비게이션 노출 처리
//             parentDocument.parentNode.parentNode.style = "";
//         }
//     }
// });

$(function () {
    kmController.setPageCommon();

    $("[data-pageType]").each(function () {
        let pageType = $(this).attr("data-pageType");
        kmController[pageType]();
    });
});






var kmController = {
    speechSnd: "",
    speechCurrentTime: 0,
    currentSpeechBtn: "",

    /*
    * ********************************************** 공통 설정 ************************************************
    * */
    setPageCommon: function () {
        /*
        * ***
        * */
        kmController.speechSnd = new Audio();



        /*
        * *** 팝업버튼 클릭 시 해당 슬라이드로 이동
        * */
        $(".popBtn, .zoomPop").on("click", function () {
            if ($(this).attr("data-targetSlideNum")) {
                var popNum = $(this).attr("data-popup-btn");
                var targetNum = $(this).attr("data-targetSlideNum");

                $(".popup_container [data-popup-page=" + popNum + "]").find(".basicSlider_circle_tabs li").eq(targetNum - 1).trigger("click");
            }
        });

        $(".imgWrap").on("mouseover", function () {
            $(this).find(".zoomBtn").addClass("hover");
        });
        $(".imgWrap").on("mouseleave", function () {
            $(this).find(".zoomBtn").removeClass("hover");
        });

        // /*
        // * *** close 클릭시 btn에 popupOn class 지워주기 (클릭시 안열리는거 방지)
        // * */
        //
        // $("body").on('click', ".popup_closeBtn", function (){
        //     $('.popBtn').removeClass('popupOn');
        // });


        /*
        * *** 오디오버튼 클릭 시
        * */
        $('.balloon').hide();
        // $('.popBtn.speech').on('click',function (){
        //
        // });


        $(".popBtn.speech").on("click", function (e) {
            let audioPath = $(this).attr("data-audio");

            if ($(this).hasClass('on')) {
                kmController.speechSnd.pause();
                kmController.speechCurrentTime = kmController.speechSnd.currentTime;

                $(this).removeClass('on');
                $(this).parents('.balloonBox').find('.balloon').hide();
            } else {
                $('.close-speech-button').trigger("click");

                $('.popBtn.speech').removeClass('on');
                $(this).addClass('on');
                $(this).parents('.balloonBox').find('.balloon').show();

                //console.log(currentSpeechBtn == e.currentTarget)
                kmController.speechSnd.src = audioPath;
                if (kmController.currentSpeechBtn == e.currentTarget) {
                    kmController.speechSnd.currentTime = kmController.speechCurrentTime;
                } else {
                    kmController.speechSnd.currentTime = 0;
                }
                kmController.speechSnd.play();
            }

            kmController.currentSpeechBtn = this;
        });


        /*
        * *** 미니오디오 버튼
        * */
        var miniAudioSnd = new Audio();
        $(".popBtn.miniAudio").on("click", function () {
            miniAudioSnd.pause();

            miniAudioSnd.src = $(this).attr("data-audio");

            var that = this;
            miniAudioSnd.addEventListener("ended", function () {
                miniAudioSnd.pause();
                $(that).removeClass("on");
            });

            if ($(this).hasClass("on")) {
                miniAudioSnd.pause();
                $(this).removeClass("on");
            } else {
                miniAudioSnd.play();
                $(this).addClass("on");
            }
        });


        /*
        * *** 탭 클릭 시
        * */
        $(".basicSlider_tabs > li").on("click", function () {
            // if($(".videoFrameWrap").length > 0){
            //     $(".videoFrameWrap").each(function(){
            //         var src = $(this).find("iframe").attr("src");
            //         var html = '<iframe src="'+src+'"></iframe>';
            //         $(this).find("iframe").remove();
            //         $(this).append(html);
            //
            //         $(this).find(".btnPlayVideo").show();
            //         $('.innerVideoTitle').show();
            //     });
            // }

            try {
                for (var i = 1; i <= arrVideoPlayer.length; i++) {
                    arrVideoPlayer[i - 1].stop();
                    console.log(arrVideoPlayer[i - 1])
                }
            } catch (error) {

            }

        });

        //탭, 팝업 닫기 버튼 클릭 시 사운드 멈춤
        $('body').on("click", ".basicSlider_circle_tabs>li, .basicSlider_btn, .basicSlider_tabs > li, .innerSlider_tabs>li, .popup_closeBtn", function () {
            $(".popBtn.speech").removeClass('on');
            KmAudioPlayer.stop();
            kmController.speechSnd.pause();
        });

        /*
        * *** 페이지내 비디오 플레이 버튼
        * */
        $(".videoFrameWrap .btnPlayVideo").on("click", function () {
            var src = $(this).parents(".videoFrameWrap").find("iframe").attr("src");
            var html = '<iframe src="' + src + '" allow="autoplay"></iframe>';
            $(this).siblings("iframe").remove();
            $(this).parents(".videoFrameWrap").append(html);

            $(this).hide();
            $('.innerVideoTitle').hide();
            //$(this).siblings("iframe").contents().find(".basic_controls .btn_play").trigger("click");
        });



        /*
        * *** 유튜브 영상 페이지 참고영상 버튼
        * */
        $(".videoSubPlayBtn[data-youtube-id]").on("click", function () {
            KmAudioPlayer.buttonClick();
            var iframeClone = $(this).parents(".youtubeFrameWrap").find("iframe").clone();
            $(this).siblings("iframe").remove();
            $(this).parents(".youtubeFrameWrap").append(iframeClone);

            var youtubeId = $(this).attr("data-youtube-id");
            kmController.setYoutubePopup(youtubeId);
        });


        /*
        * *** speech버튼 close 눌렀을때 balloon 안보이게
        * */
        $('.close-speech-button').on('click', function (e) {
            $(this).parents(".balloon").hide();
            $(this).parents(".balloon").siblings(".popBtn.sound").removeClass("on");
            kmController.speechSnd.pause();

            e.stopPropagation();
        })

        $('.balloon').on('click', function () {
            $(this).find(".close-speech-button").trigger("click");
        })

        /*
        * *** 그룹speech 버튼 안에 이미지 눌렀을때 말풍선 보이게.
        * */
        $('.group-speech .char-box .char-image').on('click', function () {
            if ($(this).siblings(".balloon").css("display") != "none") {
                $(this).siblings('.balloon').hide();
                $(this).removeClass('beforeNon');
            } else {
                //$('.balloon').hide();
                $('.char-box .close-speech-button').trigger("click");
                $(this).siblings('.balloon').show();

                $('.group-speech .char-box .char-image').removeClass('beforeNon')
                $(this).addClass('beforeNon');
            }
        })

        /*
          * *** 그룹speech close 버튼 눌렀을때
         * */
        $('.group-speech .char-box .close-speech-button').on('click', function () {
            $('.group-speech .char-box .char-image').removeClass('beforeNon')
            $(this).addClass('beforeNon');
        })


        /*
        * *** 칭찬캐릭터 클릭 시
        * */
        $(".praise-button").on("click", function () {
            var praiseBox = $(this).parents(".praise-box");
            let praiseAudio = praiseBox.attr("data-praiseAudio");
            kmController.playPraiseAni(praiseBox);

            KmAudioPlayer.stop();
            KmAudioPlayer.play(praiseAudio);
        });


        /*
        * *** 초성박스 세팅
        * */

        //초성박스 초기설정
        $(".cho .dir-rect").each(function () {
            var dataCho = $(this).attr("data-cho");
            $(this).text(dataCho);
        });


        //초성박스 클릭 시
        $(".choBox").on("click", function () {

            if ($(this).children(".dir-rect").hasClass("on")) {
                $(this).find(".dir-rect").removeClass("on");

                $(this).children(".dir-rect").each(function () {
                    var dataAns = $(this).attr("data-cho");
                    $(this).text(dataAns);
                });
            } else {
                $(this).find(".dir-rect").addClass("on");

                $(this).children(".dir-rect").each(function () {
                    var dataAns = $(this).attr("data-letter");
                    $(this).text(dataAns);
                });
            }

            KmAudioPlayer.buttonClick();
        });



        /*
        * *** 메모장 예보기 버튼 클릭 시
        * */
        $(".writeBtn").on("click", function () {

            if ($(this).hasClass("reset") == true) {
                $(this).closest("li").find(".noteText .textLine").css("display", "block").attr("placeholder", "직접 쓰기");
                $(this).closest("li").find(".noteText .text-exam").css("display", "none");
            } else {
                $(this).closest("li").find(".noteText .textLine").attr("placeholder", "").css("display", "none");
                $(this).closest("li").find(".noteText .text-exam").css("display", "flex");
            }
        });


        /*
        * *** oxQuiz소리
        * */
        $('.buttonOX').on('click', function () {
            let buttonAns = $(this).attr('data-ox-type');

            let correctAudio = new Audio("../ko/libs/media/correct.mp3");
            let inCorrectAudio = new Audio("../ko/libs/media/incorrect.mp3");

            if (buttonAns == '1') {
                correctAudio.play();
            } else {
                inCorrectAudio.play();
            }
        })



        /*
        * *** 보더 박스 클릭 시
        * */
        $(".colorBox.borderBox").on("click", function () {
            let dataDoNotMark = $(this).attr('data-doNotMark');
            KmAudioPlayer.buttonClick();

            if ($(this).attr("data-doNotMark") != undefined) {
                $(this).removeClass("on");
                //alert('aa')
            } else {
                $(this).addClass("on");
                //alert('bbb')
            }

        });


        /*
        * *** 정리 총총
        * */

        //초성확인
        $(".choBtn").on("click", function () {
            $(this).toggleClass("reset");

            let choBtnNum = $(this).parents(".multiBtnContainer").attr("data-choBtn-id");

            if ($(this).hasClass("reset") == true) {
                $("[data-choBox-id=" + choBtnNum + "]").find(".choToggle .cho").css("display", "inline-flex");
            } else {
                $("[data-choBox-id=" + choBtnNum + "]").find(".choToggle .cho").hide();
            }
            KmAudioPlayer.buttonClick();
        });

        //초성 정답확인
        $(".choAnsBtn").on("click", function () {
            let tabNum = $(this).parent(".multiBtnContainer").attr("data-choBtn-id");

            $(this).toggleClass("reset");

            $("[data-choBox-id=" + tabNum + "]").find(".cho").hide();
            $(".multiBtnContainer[data-choBtn-id=" + tabNum + "]").find(".choBtn").removeClass("reset");

            if ($(this).hasClass("reset") == true) {
                $("[data-choBox-id=" + tabNum + "]").find(".toggle").addClass("complete");
            } else {
                $("[data-choBox-id=" + tabNum + "]").find(".toggle").removeClass("complete");
            }
            KmAudioPlayer.buttonClick();
        });

        $(".toggle").on("mousedown", function () {
            let choAnsNum = $(this).parents("[data-choBox-id]").attr("data-choBox-id");
            let toggleClick = $(this).parents('[data-choBox-id]').find('.toggle');
            let toggleComplete = $(this).parents('[data-choBox-id]').find('.toggle.complete');

            if (toggleClick.length == (toggleComplete.length + 1)) {
                $(".multiBtnContainer[data-choBtn-id=" + choAnsNum + "]").find(".choAnsBtn").toggleClass("reset");
            }
        });

        $(".multiBtnContainer[data-choBtn-id='0']").addClass("on");

        $('.sideTopSlider_tabs li').on('click', function () {
            var tabNum = $(this).attr('data-tab-id');
            $(".multiBtnContainer").removeClass('on');
            $('.multiBtnContainer[data-choBtn-id=' + tabNum + ']').addClass('on');
        })

        /*
        * *** 자기 평가표
        * */
        //2단
        $(".check-box .wrap").on("click", function () {
            $(this).parent().find(".wrap").removeClass("over").removeClass("on");
            $(this).addClass("on");
            KmAudioPlayer.buttonClick();
        });

        $(".check-box .wrap").on("mouseover", function () {
            $(this).parent().find(".wrap").removeClass("over");
            $(this).addClass("over");

            if ($(this).hasClass("on")) {
                $(this).removeClass("over");
            }
        });

        $(".check-box .wrap").on("mouseleave", function () {
            $(this).removeClass("over");
        });


        //3단
        $(".icon-box .wrap").on("click", function () {
            $(this).parent().find(".wrap").removeClass("on over");
            $(this).addClass("on");
            KmAudioPlayer.buttonClick();
        });

        $(".icon-box .wrap").on("mouseover", function () {
            $(this).parent().find(".wrap").removeClass("over");
            $(this).addClass("over");

            if ($(this).hasClass("on")) {
                $(this).removeClass("over");
            }
        });

        $(".icon-box .wrap").on("mouseleave", function () {
            $(this).removeClass("over");
        });


        /*
        * *** 낱말 퐁당
        * */

        $(".main.jejae.word .word-button").eq(0).addClass("on");
        $(".main.jejae.word .explain").eq(0).addClass("on");

        $(".main.jejae.word .word-button").on("click", function () {
            var wordNum = $(this).index();
            KmAudioPlayer.buttonClick();

            $(".main.jejae.word .word-button").removeClass("on");
            $(this).addClass("on");
            $(".main.jejae.word .explain").removeClass("on");
            $(".main.jejae.word .explain").eq(wordNum).addClass("on");
        });

        /*
        * *** 쏙 퀴즈
        * */
        $(".main.jejae.quiz .start-button").on("click", function () {
            KmAudioPlayer.buttonClick();
            $(".main.jejae.quiz .home-box").addClass("hide");
        });
        $(".main.jejae.quiz .quiz-tab-box .sub-content .button").on("click", function () {
            let singleOx = $(this).parent().attr("data-answer");

            if ($(this).index() == singleOx) {
                $(this).addClass("correct");
                $(".main.jejae.quiz .single-choice .button").css({
                    "cursor": "auto",
                    "pointer-events": "none",
                });
                $(".ox_popup").addClass("on correct");
                $(".explanatory").removeClass("hide");
                KmAudioPlayer.correct();
                setTimeout(function () {
                    $(".ox_popup").removeClass("on correct");
                }, 1200);

            } else {
                KmAudioPlayer.incorrect();
                $(".ox_popup").addClass("on incorrect");
                setTimeout(function () {
                    $(".ox_popup").removeClass("on incorrect");
                }, 1200);
            }

        });

        /*
            * *** 확인문제 boxOx
        * */
        $('.oxBoxAns .self-check .checkWrap .check-box .button').on('click', function () {
            let page = $(this).parents(".basicSlider_slides").children("li");
            let oxBoxAns = $(this).attr('data-ox-answer');
            // let dataAnswerLength = $(this).parents('.self-check').attr('data-answer-num');



            if (oxBoxAns == 0) {
                $(this).addClass("correct");
                $(this).parents('.check-box').find('.wrap').css({
                    "cursor": "auto",
                    "pointer-events": "none",
                });
                $(".ox_popup").addClass("on correct");
                KmAudioPlayer.correct();
                setTimeout(function () {
                    $(".ox_popup").removeClass("on correct");
                }, 1200);
            } else {
                KmAudioPlayer.incorrect();
                $(".ox_popup").addClass("on incorrect");
                let that = this;
                setTimeout(function () {
                    $(".ox_popup").removeClass("on incorrect");
                    $(that).parents('.wrap').removeClass('on');
                }, 1200);

            }

            let totalAns = page.find("[data-ox-answer]").length;
            let numOpen = page.find(".check-box .button.correct").length;

            //완료여부
            if (totalAns == numOpen) {
                $('.oxBoxAns .dapCheckBtn').addClass('reset');
            }
            console.log(totalAns, numOpen)
        })

        // boxOx 확인문제 정답확인버튼

        $('.oxBoxAns .dapCheckBtn').on('click', function () {
            let page = $(this).parents(".basicSlider_slides").children("li");
            let oxBoxAns = page.find('[data-ox-answer]');
            KmAudioPlayer.buttonClick();
            if ($(this).hasClass('reset')) {
                $(this).removeClass('reset')

                oxBoxAns.removeClass('correct');
                oxBoxAns.parent().removeClass('on');
                oxBoxAns.parents('.check-box').find('.wrap').css({
                    "cursor": "auto",
                    "pointer-events": "auto",
                });
            } else {
                $(this).addClass('reset')
                oxBoxAns.addClass('correct');
                oxBoxAns.parent().addClass('on');
                oxBoxAns.parents('.check-box').find('.wrap').css({
                    "cursor": "auto",
                    "pointer-events": "none",
                });
            }
            console.log(oxBoxAns)
        })


        /*
        * *** 텍스트 클릭시 선 연결
        * */
        $('.clickText').on('click', function () {
            // let page = $(this).parents(".basicSlider_slides").children("li");


            let dataColor = $(this).attr('data-color');

            $(this).addClass('on');
            $(this).find('.dir-line').show();
            $(this).find('.dir-line').addClass('on');

            $('.innerBox[data-color=' + dataColor + ']').addClass('on');

            let totalNum = $('.dir-line').length;
            let showNum = $('.dir-line.on').length;
            if (totalNum == showNum) {
                $('.clickLineText .dapCheckBtn').addClass('reset');
            }
            console.log(totalNum, showNum)
        })

        $('.clickLineText .dapCheckBtn').on('click', function () {
            if ($(this).hasClass('reset') == false) {
                $(this).addClass('reset');
                $('.clickText').addClass('on');
                $('.dir-line').show();


                $('.innerBox').addClass('on');
            } else {
                $(this).removeClass('reset');
                $('.clickText').removeClass('on');
                $('.dir-line').hide();

                $('.innerBox').removeClass('on');
                $('.dir-line').removeClass('on');
            }
        })


        /*
        * *** 새창으로 링크 열기
        * */
        $(".link-button").on("click", function () {
            window.open($(this).attr('data-src'), '', 'width=1365, height=768, menubar=no, status=no, toolbar=no');
            KmAudioPlayer.buttonClick();
        });


        /*
        * *** 쓰기 창 예보기 클릭 시
        * */
        $(".word-box .examBtn").on("click", function () {
            $(this).hide();
            $(this).siblings(".word-box-item").css("cursor", "auto");
            $(this).siblings(".word-box-item").children(".hidden-box").addClass("on");
            KmAudioPlayer.buttonClick();
        });

        $('.wordBox .dapCheckBtn').on('click', function () {
            KmAudioPlayer.buttonClick();
            if ($(this).hasClass('reset')) {
                $(this).removeClass('reset')
                $('.hidden-box').removeClass('on');
            } else {
                $(this).addClass('reset');
                $('.hidden-box').addClass('on');
            }
        })


        /*
        * *** 함께 보기 영상
        * */
        $(".lookBtn").on("click", function () {
            var lookBtnNum = $(this).attr("data-look-btn");

            $('.fullPopupAni').hide();
            $('.fullPopupAni[data-look-btn=' + lookBtnNum + ']').show();
            $('.fullPopupAni[data-look-btn=' + lookBtnNum + '] .screenPlayBtn').trigger("click");
        });

        $("body").on("click", ".aniContainer.fullPopupAni .video .closeBtn", function () {
            $(this).parents('.fullPopupAni').hide();
        });


        /*
       * *** 영상보기 버튼
       * */
        $(".innerVideoTitle").on("click", function () {
            $(this).siblings(".videoPlayBtn").trigger("click");
        });



        /*
       * *** 유튜브 팝업 영상보기 버튼
       * */
        $(".youtubeTitleWrap .mediaSubContainer").on("click", function () {
            var youtubeId = $(this).find("[data-youtube-id]").attr("data-youtube-id");
            kmController.setYoutubePopup(youtubeId);
        });




        /*
        * *** 1,2,3회 도장버튼
        * */
        $(".speakWord .countNum").on("click", function () {
            $(this).addClass("on");
            KmAudioPlayer.correct();
        });


        /*
        * *** oxQuiz toggle
        * */
        // var cnt = 0
        // $('.flexListContainer .ox-box').on('click',function (){
        //
        //     let iconClick = $(this).find('.icon');
        //     console.log($(this).parents().parents())
        //     cnt++
        //
        //     if($(this).find('.icon ').hasClass('icon_o')==true){
        //         if (cnt % 2 == 0){
        //             $(this).find('.icon ').removeClass('on')
        //             $(this).closest('li').removeClass('complete')
        //         }else{
        //             $(this).find('.icon ').addClass('on')
        //         }
        //         $('.txt').removeClass('complete');
        //         $(this).find('.txt').css('pointer-events','auto');
        //         // $(this).find('.icon ').addClass('on')
        //
        //     }else{
        //     }
        //
        // })



        /*
        * *** 문장완성게임
        * */



        $('body').on('click', '.sentenceCpl .sentence', function () {
            if ($(this).hasClass('on') == false) {
                $(this).addClass('on');

            } else {
                $(this).removeClass('on');
            }

            let dataSentence = $('.on[data-sentence-answer]');
            let wrongOnLength = $(".sentence.on").not("[data-sentence-answer]").length;
            let sentenceLength = dataSentence.length;
            if (sentenceLength == 23 && wrongOnLength == 0) {
                $('.colorBox p').addClass('on');
                $('.sentenceCpl .dapCheckBtn').addClass('reset');
            } else {
                $('.colorBox p').removeClass('on');
                $('.sentenceCpl .dapCheckBtn').removeClass('reset');
            }
            console.log(sentenceLength, wrongOnLength)
        })

        $('body').on('click', '.sentenceCpl .dapCheckBtn', function () {
            if ($(this).hasClass('reset')) {
                $(this).removeClass('reset');
                $('.sentenceCpl .sentence').removeClass('on');
                $('.colorBox p').removeClass('on');
                $('.sentenceCpl .sentence').css('pointer-events', 'auto');
            } else {
                $('.sentenceCpl .sentence').removeClass('on');
                $(this).addClass('reset');
                $('[data-sentence-answer]').addClass('on');
                $('.colorBox p').addClass('on');
                $('.sentenceCpl .sentence').css('pointer-events', 'none');
            }
        })


        $("body").on('click', '[data-type=makeToggle]', function (e) {
            /**/
            if ($(this).children("div").hasClass("complete")) {
                $(this).find(".icon_o").removeClass("on");
                $(this).children("div").removeClass("complete");

                if ($(this).parents("li").hasClass("complete")) {
                    $(this).parents("li").removeClass("complete");
                }
            } else {

                $(this).find(".icon_o").addClass("on");
                $(this).children("div").addClass("complete");
            }

            e.stopPropagation();
            e.preventDefault();
        })

        $("body").on("click", '[data-type=makeToggle] > div', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        /*
        * *** 확인문제 빈칸형
        * */
        $(".round-bg-box .text").addClass("hide");

        $("body").on("click", ".dapCheckBtn", function () {
            $(this).parents(".basicSlider_slides > li").find(".round-bg-box .text").toggleClass("hide");

            // if ($(this).hasClass("reset")) {
            //     alert("dd")
            //
            //     $(this).parents("li").find(".single-choice").css("pointer-events", "none");
            //     $(this).parents("li").find([data-answer=""]).addClass("on correct");
            //
            // } else {
            //     $(this).parents("li").find(".single-choice").css("pointer-events", "auto");
            //     $(this).parents("li").find([data-answer=""]).removeClass("on correct");
            // }
        });

        $("body").on("click", ".multipleChoiceList li", function () {
            if ($(this).attr("data-answer") !== undefined) { /*정답일때*/
                $(this).parents(".basicSlider_slides > li").find(".round-bg-box .text").removeClass("hide");
            }
        });

        $('.empty.toggle').on('click', function () {
            $(".round-bg-box .text").removeClass("hide");
        })

        /*
        * *** 문장카드 클릭 시
        * */
        //
        $(".speakWord .zoomSent").on("click", function () {
            var audio = $(this).attr("data-audio");

            KmAudioPlayer.stop();
            KmAudioPlayer.play(audio);
        });

        /*
        * *** data-quiz 두개일때 toggle
        * */
        $("[data-addQuiz='toggle'] .toggle").on("click", function () {
            if ($(this).css("display", "block")) {
                $(this).css("display", "none");
                $(this).siblings(".colorBox.orange .bg").show();
                KmAudioPlayer.buttonClick();
            }
        });
        $("[data-addQuiz='toggle'] .toggle").on("mouseover", function () {
            $(this).addClass("hover")
        });
        $("[data-addQuiz='toggle'] .toggle").on("mouseleave", function () {
            $(this).removeClass("hover")
        });

        $("[data-addQuiz='toggle'] .dapCheckBtn").on("click", function () {
            if ($(this).hasClass("reset")) {
                $("[data-addQuiz='toggle'] .toggle").css("display", "block");
                $("[data-addQuiz='toggle'] .toggle").siblings(".colorBox.orange .bg").hide();
            } else {
                $("[data-addQuiz='toggle'] .toggle").css("display", "none");
                $("[data-addQuiz='toggle'] .toggle").siblings(".colorBox.orange .bg").show();
            }
        });

        $("body").on("click", "[data-addQuiz='toggle'] .popup_closeBtn", function () {
            $("[data-addQuiz='toggle'] .toggle").css("display", "block");
            $("[data-addQuiz='toggle'] .toggle").siblings(".colorBox.orange .bg").hide();
        });

        /*
        * *** 라인 박스 클릭 시
        * */
        // $("body").on("click", ".colorBox.borderBox", function (){
        //     $(this).addClass("on");
        // });


        /*
        * *** 미리보기 버튼
        * */
        $("body").on("click", ".previewBtn", function () {
            var fileName = "T:" + $(this).attr("data-file");

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
                url: 'https://view.chunjae.co.kr/streamdocs/v4/custom/documents/view',
                type: 'POST',
                cache: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(body),
                success: function (result) {
                    window.open(result.alink);
                },
                error: function (xhr, status) {
                    console.log(xhr);
                    console.log(status);
                }
            });
        });

        /*
        * *** 스피커박스 토글
        * */
        $('.speaker_toggle .popBtn.speech').on('click', function () {
            $(this).parents('.speaker_toggle').find('.tex-box .toggleBox').addClass('show');
            $(this).parents('.speaker_toggle').find('.tex-box .blue').addClass('on');
        })

        /*
        * *** 버튼 클릭음
        * */
        $("body").on("click", ".char-box", function () {
            KmAudioPlayer.buttonClick();
        });

        //VTA 2024-06-05 double click sound error (.click-finger-Btn .popBtn)
        // $("body").on("click", ".click-finger-Btn", function () {
        //     KmAudioPlayer.buttonClick();
        // });


        /*
        * *** 클릭 누르면 비디오 실행
        * */

        $("body").on("click", ".mouseVideo .popBtn", function () {
            var that = $(this);
            KmAudioPlayer.buttonClick();
            var videoURL = $(this).attr("data-video-url");
            let audioPath = $(this).attr("data-audio");
            KmAudioPlayer.play(audioPath);
            $(".mouseVideo .videoPlayArea").html("<video src='" + videoURL + "' autoplay></video>");
            that.hide();

            $('video').on('ended', function () {
                that.show();
                $(".mouseVideo .videoPlayArea").html("<video src='" + videoURL + "'  poster=\"./images/kor_0101_00_1316_201_02_thumb.png\"></video>");
            })
        });


        /*
        * *** 클릭 누르면 글자비디오 실행
        * */
        $("body").on("click", ".textVideo .popBtn", function () {
            var that = $(this);
            KmAudioPlayer.buttonClick();
            var videoURL = $(this).attr("data-video-url");

            $(".textVideo .videoPlayArea").html("<video src='" + videoURL + "' autoplay></video>");
            that.hide();
            $('.textVideo .colorBox .bottom').addClass('on');

            $('video').on('ended', function () {
                that.show();
                $(".textVideo .videoPlayArea").html("");
            })
        });


        /*
        * *** 클릭 누르면 멀티 글자비디오 실행
        * */
        $("body").on("click", ".textVideoMulti .lineBox", function () {
            var videoURL = $(this).attr("data-video-url");

            $(".textVideoMulti .videoPlayArea").html("<video src='" + videoURL + "' autoplay></video>");
            $(".textVideoMulti .videoPlayArea").addClass("on");
            KmAudioPlayer.buttonClick();

            let audioPath = $(this).attr("data-audio");
            KmAudioPlayer.stop();
            KmAudioPlayer.play(audioPath);
        });

        $("body").on("click", ".basicSlider_tabs>li", function () {
            // $(".textVideoMulti .videoPlayArea").html("");
            // $(".textVideoMulti .videoPlayArea").removeClass("on");

            // $(".textVideo .videoPlayArea").html("");
            // $(".textVideo .videoPlayArea").removeClass("on");
        });


        /*
        * *** 글자 누르면 글자 내용 보이게 하기
        * */
        $(".textVideoMulti .lineBox").on("click", function () {
            let multiBoxTxt = $(this).attr("data-list-txt");

            $(".textVideoMulti .show-text").text(multiBoxTxt);
        })

        /*
       * *** 글자 누르면 색깔 획 추가
       * */
        $("body").on("click", ".textVideo .textClk", function () {
            KmAudioPlayer.buttonClick();

            $(this).find(".word-box-item").addClass("on");
        });


        /*
        * *** 내레이션&줌
        * */
        $("body").on("click", ".narAndZoom .popBtn.speech", function () {
            $(this).siblings(".textWrap").addClass("on");
        });

        $("body").on("click", ".narAndZoomTab .popBtn.speech", function () {
            $(this).siblings(".textWrap").addClass("on");
        });

        $("body").on("click", ".narAndBogi .examBtn", function () {
            $(this).siblings(".word-box-item").addClass("on");
        });

        $("body").on("click", ".word-box.popBtn", function () {
            $(this).children(".word-box-item").addClass("on");
        });

        /*
       * *** 정답확인버튼 글자
       * */
        $("body").on("click", ".wordBoxItem .dapCheckBtn", function () {
            if ($(this).hasClass('reset')) {
                $(this).parents('.wordBoxItem').find(".word-box-item").addClass("on");
            } else {
                $(this).parents('.wordBoxItem').find(".word-box-item").removeClass("on");
            }
        });
        /*
           * *** 동화제목
        * */
        $("body").on("click", ".wordToggleButton .exButton", function () {
            KmAudioPlayer.buttonClick();
            if ($(this).hasClass('on')) {
                $(this).parents('.wordToggleButton').find(".changeWord").removeClass("on");
                $(this).removeClass("on")
            } else {
                $(this).parents('.wordToggleButton').find(".changeWord").addClass("on");
                $(this).addClass("on")
            }
        });

        /*
            * *** 글자색칠
        * */
        $("body").on("click", ".wordColor", function () {
            $(this).siblings(".wordColor").addClass("on");
        });


        /*
        * *** 글자박스 2개
        * */
        $("body").on("click", ".colorBoxFlex .dapCheckBtn", function () {
            $(this).siblings(".page-inner").toggleClass("on");
        });


        /*
        * *** 예보기 버튼 토글
        * */
        /*$("body").on("click", ".toggle.examBtn.complete", function (){

            var that = this;
            setTimeout(function(){
                if($(that).hasClass("complete")) {
                    $(that).removeClass("complete");
                    $(that).children(".answer").removeClass("on");
                }  else {
                    $(that).addClass("complete");
                    $(that).children(".answer").addClass("on");
                }
            }, 200);

        });*/

        $("body").on("click", "[data-quiz=dragDrop] .resetBtn", function () {
            $(this).addClass("reset");
        })


        /*
        * *** 직접쓰기 밑줄
        * */
        if ($(".noteLine").not(".noLine").length > 0) {
            $(".noteLine").not(".noLine").find(".textareaWrap").each(function () {
                for (var i = 1; i <= 5; i++) {
                    $(this).append("<span class='underline' style='position:absolute; left:20px; top:" + (i * 60 + 34) + "px; width:calc(100% - 40px); height:1px; background-color:#cccccc;'></span>");
                }
            })
        }


    },//setPageCommon


    /*
    * *********************************************** checkCommon ********************************************
    * */
    checkCommon: function () {
        $('.check_view .check_box').off();
        $('.check_view .check_box').on('click', function () {
            /*if ($(this).parents('.check_view').find(".check_box").length > 0) {
                $(this).parents('.check_view').find(".check_box").find("p").remove();
            }
            let redClick = $(this).find("p").attr("class");
            if (redClick === "red_check") {
                $(this).find("p").remove();
            } else {
                $(this).append("<p class='red_check'></p>");
            }*/

            if ($(this).find(".red_check").length > 0) {
                $(this).find("p").remove();
            } else {
                $(this).append("<p class='red_check'></p>");
            }
        })
    },


    /*
    * *********************************************** checkWithEx ********************************************
    * */
    checkWithEx: function () {
        kmController.checkCommon();

        $('.examViewBtn').on('click', function () {
            if ($(this).hasClass("reset")) {
                $(this).removeClass("reset");
                $(this).parents("li").find(".check_view").removeAttr("style");
                $(this).parents("li").find(".check_view .check_box p").remove();
            } else {
                $(this).addClass("reset");
                $(this).parents("li").find(".check_view").css("pointer-events", "none");
                $(this).parents("li").find(".check_view .check_box p").remove();
                $(this).parents("li").find(".check_view .check_box.check_ans").append("<p class='blue_check'></p>");
            }
        })
    },


    /*
    * *********************************************** checkAlone ********************************************
    * */
    checkAlone: function () {
        kmController.checkCommon();


    },



    /*
    * *********************************************** 낱말 읽기 ********************************************
    * */
    readingWord: function () {
        var totalWordNum = $(".selectArea .word").length;
        var currentWordNum = 1;


        //작은 낱말카드 클릭 시
        $(".selectArea .word").on("click", function () {
            currentWordNum = $(this).index() + 1;

            var word = $(this).text();
            var audio = $(this).attr("data-audio");

            setWord(word, audio);

            $(".selectArea .word").removeClass("on");
            $(this).addClass("on");
            KmAudioPlayer.buttonClick();
        });


        //큰 낱말카드 클릭 시
        $(".wordZoom .zoomText").on("click", function () {
            var audio = $(this).attr("data-audio");

            KmAudioPlayer.stop();
            KmAudioPlayer.play(audio);
        });


        //좌우 화살표 클릭 시
        $(".arrowArea .arrow.left").on("click", function () {
            if (currentWordNum == 1) {
                currentWordNum = 1;
            } else {
                currentWordNum--;
            }

            $(".selectArea .word").eq(currentWordNum - 1).trigger("click");
        });
        $(".arrowArea .arrow.right").on("click", function () {
            if (currentWordNum == totalWordNum) {
                currentWordNum = totalWordNum;
            } else {
                currentWordNum++;
            }

            $(".selectArea .word").eq(currentWordNum - 1).trigger("click");
        });


        //초기 선택
        $(".selectArea .word").eq(0).trigger("click");


        function setWord(_word, _audio) {
            $(".wordZoom .zoomText").text(_word);
            $(".wordZoom .zoomText").attr("data-audio", _audio);
        }

    },



    /*
    * ********************************************** 칭찬 캐릭터 모션 ******************************************
    * */
    aniInterval: "",

    playPraiseAni: function (_praiseBoxEl) {
        var praiseBoxEl = _praiseBoxEl;
        var audioPath = praiseBoxEl.attr("data-praiseAudio");
        var aniAreaW = praiseBoxEl.find(".praiseAni").width();
        var aniAreaH = praiseBoxEl.find(".praiseAni").height();

        // 프레임이동시 속도
        var aniSpeed = 34;

        var currentLeft = 0;
        var currentTop = 0;

        var totalCut = praiseBoxEl.attr("data-totalCut");
        var numCutLine = 6;
        var currentCut = 1;

        //var aniInterval;

        //초기설정
        $('.praiseAni').css("opacity", 0);
        praiseBoxEl.find(".praiseAni").css("opacity", 1);


        //애니 인터벌
        var praiseAni = praiseBoxEl.find(".praiseAni");
        var targetTop = 0;

        clearInterval(kmController.aniInterval)
        kmController.aniInterval = setInterval(function () {
            var targetLeft = (currentCut - 1) % numCutLine;

            praiseAni.css("background-position-y", -targetTop * aniAreaH + "px");
            praiseAni.css("background-position-x", -targetLeft * aniAreaW + "px");

            if (targetLeft == 5) targetTop++;
            currentCut++;

            if (currentCut > totalCut) {
                clearInterval(kmController.aniInterval)
                praiseBoxEl.find(".praiseAni").css("opacity", 0);
            };
        }, aniSpeed)

    },


    /*
    * ********************************************** 유튜브 영상 팝업 ********************************************
    * */
    setYoutubePopup: function (_youtubeId) {
        var html = '<div class="youtubePopup">' +
            '   <div class="videoWin">' +
            '       <div class="btnClosePopup"></div>' +
            '       <div class="frameWrap">' +
            '           <iframe src="https://www.youtube.com/embed/' + _youtubeId + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
            '       </div>' +
            '   </div>' +
            '</div>';

        $("#wrap").append(html);


        //팝업 닫기 버튼
        $(".youtubePopup .videoWin .btnClosePopup").on("click", function () {
            $(this).parents(".youtubePopup").remove();
        });
    },



}



/*
* *** 오디오 플레이 설정
* */
var KmAudioPlayer = {
    audioObj: null,

    play: function (_src, _callback) {
        audioObj = new Audio(_src);
        audioObj.play();
        audioObj.addEventListener("ended", function () {
            if (typeof (_callback) == "function") {
                _callback();
            }
        });
    },

    setVolume: function (_volume) {
        audioObj.volume = _volume;
    },

    stop: function () {
        try {
            audioObj.pause();
        } catch (error) {

        }
    },

    playGroup: function (_arrSound, _callback, _betweenGap) {
        var numSound = _arrSound.length;
        var currentTurn = 1;
        var betweenGap = (_betweenGap == undefined) ? 1000 : _betweenGap;

        playSound();

        function playSound() {
            audioObj = new Audio(_arrSound[currentTurn - 1]);
            audioObj.play();
            audioObj.addEventListener("ended", function () {
                if (typeof (_callback) == "function") {
                    if (_callback != null) {
                        _callback();
                    }
                } else {
                    currentTurn++;
                    setTimeout(function () {
                        playSound();
                    }, betweenGap);
                }
            });
        }
    },//playGroup

    //버튼 클릭음
    buttonClick: function () {
        var snd;
        snd = new Audio("../ko/libs/media/click.mp3");
        snd.play();
    },

    //정답효과음
    correct: function () {
        var snd;
        snd = new Audio("../ko/libs/media/correct.mp3");
        snd.play();
    },

    //오답효과음
    incorrect: function () {
        var snd;
        snd = new Audio("../ko/libs/media/incorrect.mp3");
        snd.play();
    },

};//AudioPlayer



// var baseModule = function () {
//     var exporter = {};
//
//     exporter.name = "base";
//
//     exporter.addOverEvent = function (el) {
//         if (!el) return;
//         if (el.length > 0) {
//             for (var i = 0; i < el.length; ++i) {
//                 el[i].addEventListener(el.mouseTouchEvent.over, function (e) {
//                     e.currentTarget.classList.add("over");
//                 });
//                 el[i].addEventListener(el.mouseTouchEvent.out, function (e) {
//                     e.currentTarget.classList.remove("over");
//                 });
//             }
//         } else {
//             el.addEventListener(el.mouseTouchEvent.over, function (e) {
//                 e.currentTarget.classList.add("over");
//             });
//             el.addEventListener(el.mouseTouchEvent.out, function (e) {
//                 e.currentTarget.classList.remove("over");
//             });
//         }
//     };
//
//     exporter.reset = function () {
//         // console.log("base module reset");
//     };
//
//     return exporter;
// };


// 시, 이야기 낭독 컨텐츠
var createNarration = function (spec) {
    var exporter = baseModule();
    var box;
    var sceneButtonBox;
    var sceneButtons;
    var textBox;
    var sceneGroup;

    var texts;

    var sceneTimes;
    var textTimes;

    var currentScene = -1;
    var currentText = -1;

    var inTextTime = false;

    var audioPlayer;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        sceneTimes = spec.sceneTimes;
        textTimes = spec.textTimes;

        sceneButtonBox = amt.get(".scene-button-box", box);
        sceneButtons = amt.getAll(".button", sceneButtonBox);
        sceneGroup = amt.getAll(".group", box);
        textBox = amt.get(".text-box", box);
        texts = amt.getAll(".text", textBox);

        for (var i = 0; i < sceneButtons.length; ++i) {
            exporter.addOverEvent(sceneButtons[i]);
        }

        audioPlayer = createAudioPlayer({
            box: amt.get(".audio-player", box),
            audioList: spec.audioList,
            callbacks: {
                stop: function () {
                    resetSceneGroup();
                    resetSceneButtons();
                    resetTexts();
                    currentScene = -1;
                    currentText = -1;
                    sceneGroup[0].classList.remove("remove");
                },
                loop: function (cTime) {
                    for (var i = 0; i < sceneTimes.length; ++i) {
                        var time = sceneTimes[i];
                        if (currentScene !== i && cTime >= time.start && cTime < time.end) {
                            // console.log((i+1)+"씬 시작");
                            currentScene = i;
                            resetSceneGroup();
                            resetSceneButtons();
                            sceneGroup[currentScene].classList.remove("remove");
                            sceneButtons[currentScene].classList.add("on");
                            break;
                        }
                    }

                    if (textTimes === undefined) return;

                    for (var i = 0; i < textTimes.length; ++i) {
                        var time = textTimes[i];
                        if (currentText !== i && cTime >= time.start && cTime < time.end) {
                            // console.log((i + 1) + " 텍스트 on");
                            currentText = i;
                            resetTexts();
                            texts[currentText].classList.add("on");
                            inTextTime = true;
                            break;
                        }
                    }
                    if (inTextTime && currentText > -1) {
                        if (cTime < textTimes[currentText].start || cTime > textTimes[currentText].end) {
                            // console.log((currentText + 1) + " 텍스트 off");
                            resetTexts();
                            currentText = -1;
                            inTextTime = false;
                        }
                    }
                },
            },
        });

        sceneButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickScene);
    }

    function hnClickScene(e) {
        var target = e.target;
        var index = sceneButtons.indexOf(target);
        if (index > -1) {
            resetSceneButtons();
            target.classList.add("on");
            audioPlayer.seek(sceneTimes[index].start);
        }
    }

    function resetSceneButtons() {
        for (var i = 0; i < sceneButtons.length; ++i) {
            sceneButtons[i].classList.remove("on");
        }
    }

    function resetSceneGroup() {
        for (var i = 0; i < sceneGroup.length; ++i) {
            sceneGroup[i].classList.add("remove");
        }
    }

    function resetTexts() {
        for (var i = 0; i < texts.length; ++i) {
            texts[i].classList.remove("on");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
    };

    return exporter;
};



