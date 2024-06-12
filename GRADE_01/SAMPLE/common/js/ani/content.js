function initContent() {
    var main = amt.get(".main");
    var mainTabs = main.dataset.mainTabs;
    var pageModules = [];
    var picModules = [];
    var addedModules;

    var mainTabModule;

    var fullPopupPages = [];

    var pageNumber = 0;
    var page;

    var exceptModules = [
        "SUB_TAB",
        "CONTENT_TAB"
    ]

    // document.addEventListener("DOC_EVENT", hnDocEvent);

    // 개별 js에서 module 생성 후 add하기
    // if (window.hasOwnProperty("addModules")) {
    //     addedModules = addModules();
    // }

    // 개별 js에서 리셋 제외 모듈 등록
    // if (window.hasOwnProperty("addExceptModules")) {
    //     var arr = addExceptModules();
    //     exceptModules = exceptModules.concat(arr);
    //     console.log("except modules :: ", exceptModules);
    // }

    // 메인 탭
    // if (mainTabs) {
    //     mainTabModule = createMainTabs({
    //         moduleName: "MAIN_TAB",
    //         box: main,
    //         names: mainTabs.split(",")
    //     });
    // } else {
    //     page = amt.get(".main");
    //     console.log("no tab content set up");
    //     setupPage(pageNumber, page);
    // }

    // // 대발문
    // var teacherBox = amt.get(".teacher-question");
    // var moduleTeacher;
    // if (teacherBox) {
    //     var opened;
    //     if (teacherBox.classList.contains("close")) {
    //         opened = false;
    //     } else {
    //         opened = true;
    //     }
    //     moduleTeacher = createTeacherQuestion({
    //         moduleName: "TEACHER_QUESTION",
    //         open: opened
    //     });
    //     moduleTeacher.start();
    // }

    // popup full
    // var fullPopups = amt.getAll(".popup-full");
    // if (fullPopups.length > 0) {
    //     for (var i = 0; i < fullPopups.length; ++i) {
    //         var box = fullPopups[i];
    //         var module = createFullPopup({
    //             moduleName: "FULL_POPUP",
    //             box: box,
    //             popupIndex: i
    //         })
    //         module.start();

    //         if (mainTabs) {
    //             console.log("main tab full popup set up");
    //             var page = mainTabModule.getTabNumber() + i;
    //             setupPage(page, box);
    //         } else {
    //             console.log("no tab full popup set up");
    //             var page = pageNumber + (i + 1);
    //             setupPage(page, box);
    //         }
    //         fullPopupPages.push(page);
    //     }
    // }

    // popup pic
    // var picPopups = amt.getAll(".popup-pic");
    // if (picPopups.length > 0) {
    //     for (var i = 0; i < picPopups.length; ++i) {
    //         var box = picPopups[i];
    //         var module = createPicturePopup({
    //             moduleName: "PICTURE_POPUP",
    //             box: box
    //         })
    //         module.start();
    //         picModules.push(module);
    //     }
    // }

    // function hnDocEvent(e) {
    //     e.stopPropagation();
    //     var data = e.detail;
    //     var module;
    //     var callback;
    //     // console.log("data :: ", data);
    //     switch (data.message) {
    //         case "SET_MAIN_TAB":
    //             // resetPage(pageNumber); // 이전 페이지 리셋
    //             resetAll();
    //             pageNumber = data.index;
    //             page = data.page;
    //             console.log("main tab content set up");
    //             setupPage(pageNumber, page);
    //             break;
    //         case "SET_SUB_TAB":
    //             // resetPage(pageNumber);
    //             resetAll();
    //             break;
    //         case "SET_CONTENT_TAB":
    //             // resetPage(pageNumber);
    //             resetAll();
    //             break;
    //         case "RESET_CONTENTS":
    //             resetPage(pageNumber, data.callback);
    //             break;
    //         case "CLOSE_FULL_POPUP":
    //             resetPage(pageNumber, data.callback);
    //             resetFullPopup(data.popupIndex);
    //             break;
    //         case "RESET_MINI_POPUP":
    //             module = data.module;
    //             callback = data.callback;
    //             resetMiniPopup(pageNumber, module, callback);
    //             break;
    //         case "RESET_ANIMATION":
    //             module = data.module;
    //             callback = data.callback;
    //             resetAnimation(pageNumber, module, callback);
    //             break;
    //         // case "ON_AFTER_RESET_PAGE":
    //         //     module = data.module;
    //         //     callback = data.callback;
    //         //     resetAndPlay(pageNumber, module, callback);
    //         //     break;
    //     }
    // }

    function setupPage(pageNumber, page) {
        if (pageModules[pageNumber] && pageModules[pageNumber].length > 0) {
            console.log("already setted page up");
            for (var i = 0; i < pageModules[pageNumber].length; ++i) {
                pageModules[pageNumber][i].start();
            }
            return;
        }

        var modules = [];
        var module;

        // 컨텐츠 서브 탭
        var subTabBox = amt.get("[data-sub-tabs]", page);
        if (subTabBox) {
            module = createSubTabs({
                moduleName: "SUB_TAB",
                box: subTabBox,
                names: subTabBox.dataset.subTabs.split(",")
            })
            module.start();
            modules.push(module);
            // subTabModule = module;
        }

        // 컨텐츠 탭
        var contentTabBox = amt.get(".tab-box", page);
        if (contentTabBox) {
            module = createContentTabs({
                moduleName: "CONTENT_TAB",
                box: contentTabBox
            })
            module.start();
            modules.push(module);
        }

        // 대발문
        // var teacherBox = amt.get(".teacher-question");
        // if(teacherBox) {
        //     module = createTeacherQuestion({
        //         moduleName: "TEACHER_QUESTION",
        //         open: true
        //     });
        //     module.start();
        //     modules.push(module);
        // }


        // 개별 js에서 module 생성 후 특정 메인 탭에 add하기
        // example - kor_220.js
        if (window.hasOwnProperty("addMainTabModules")) {
            addMainTabModules(pageNumber, modules, page);
        }

        // 훈민이와 정음이
        if (page.dataset.content === "intro") {
            module = initIntro({
                moduleName: "INTRO",
                videoBox: ".video-player"
            });
            module.start();
            modules.push(module);
        }

        // 시, 이야기 낭독 컨텐츠
        if (page.dataset.content === "narration") {
            addedModules.narration(modules, page);
        }
        // if(page.dataset.content === "narration") {
        //     module = createNarration({
        //         moduleName: "NARRATION",
        //         box: page
        //     })
        //     module.start();
        //     modules.push(module);
        // }

        // 노래 컨텐츠
        if (page.dataset.content === "song") {
            addedModules.song(modules, page);
        }

        // 동영상 컨텐츠 - 1분 줄거리, 이야기 듣기
        if (page.dataset.content === "video-content") {
            addedModules.video(modules, page);
        }

        // 컷 애니 컨텐츠
        if (page.dataset.content === "cut-ani") {
            addedModules.cutAni(modules, page);
        }

        // 오디오 플레이 스탑
        var buttonAudios = amt.getAll("[data-module=simple-audio", page);
        if (buttonAudios.length > 0) {
            for (var i = 0; i < buttonAudios.length; ++i) {
                var button = buttonAudios[i];
                module = createSimpleAudio({
                    moduleName: "SIMPLE_AUDIO",
                    box: page,
                    button: button
                })
                module.start();
                modules.push(module);
            }
        }

        // quiz
        // if(window.hasOwnProperty("addModules") && addedModules.quizSpec) {
        //     var spec = addedModules.quizSpec;
        //     module = quizManager(spec);
        //     module.start();
        //     modules.push(module);
        // }

        // 퀴즈 관련
        // 확인 문제
        if (page.dataset.content === "confirm-quiz") {
            console.log("confirm quiz");
            module = createConfirmQuiz({
                moduleName: "CONFIRM_QUIZ",
                box: page
            });
            module.start();
            modules.push(module);
            // 쫑 퀴즈
        } else if (page.dataset.content === "jejae-quiz") {
            console.log("jejae quiz");
            module = createJejaeQuiz({
                moduleName: "JEJAE_QUIZ",
                box: page
            });
            module.start();
            modules.push(module);
        } else if (amt.getAll("[data-quiz]", page).length > 0) {
            // console.log("content quiz");
            // module = createContentQuiz({
            //     moduleName: "CONTENT_QUIZ",
            //     box: page
            // });
            // module.start();
            // modules.push(module);
        }

        // 쫑 퀴즈
        // if(page.dataset.content === "jejae-quiz") {
        //     module = createjejaequiz({
        //         modulename: "jejae_quiz",
        //         box: page
        //     });
        //     module.start();
        //     modules.push(module);
        // }

        // 제재 학습 - 낱말 퐁당
        if (page.dataset.content === "jejae-word") {
            module = createJejaeWord({
                moduleName: "JEJAE_WORD",
                box: page
            });
            module.start();
            modules.push(module);
        }

        // 제재 학습 - 쫑 퀴즈 홈, 확인 문제 홈
        // if(page.dataset.content === "jejae-quiz" || page.dataset.content === "confirm-quiz") {
        if (page.dataset.content === "jejae-quiz") {
            module = createQuizHome({
                moduleName: "QUIZ_HOME",
                box: page
            });
            module.start();
            modules.push(module);
        }

        // 확인 문제 홈
        if (page.dataset.content === "confirm-quiz") {
            module = createConfirmQuizHome({
                moduleName: "CONFIRM_QUIZ_HOME",
                // box: page
                box: amt.get("#wrap")
            });
            module.start();
            modules.push(module);
        }

        // audio players - 컨텐츠 안에서 단순 audio play
        var audioPlayers = amt.getAll(".audio-player", page);
        if (audioPlayers.length > 0) {
            for (var i = 0; i < audioPlayers.length; ++i) {
                var box = audioPlayers[i];
                if (box.dataset.mode !== "stand-alone") continue;
                var list = box.dataset.list.split(",");
                module = createAudioPlayer({
                    moduleName: "AUDIO_PLAYER",
                    box: box,
                    audioList: list
                })
                module.start();
                modules.push(module);
            }
        }

        // 칭찬 애니메이션
        var praiseBoxes = amt.getAll(".praise-box", page);
        if (praiseBoxes.length > 0) {
            for (var i = 0; i < praiseBoxes.length; ++i) {
                var box = praiseBoxes[i];
                var type = box.dataset.type;
                module = createPraiseAnimation({
                    moduleName: "PRAISE_ANIMATION",
                    box: box,
                    type: type
                })
                module.start();
                modules.push(module);
            }
        }

        // 캐릭터 애니메이션 말풍선
        var charAniBoxes = amt.getAll(".char-ani-box", page);
        if (charAniBoxes.length > 0) {
            for (var i = 0; i < charAniBoxes.length; ++i) {
                var box = charAniBoxes[i];
                var char = box.dataset.char;
                module = createCharAnimation({
                    moduleName: "CHAR_ANIMATION",
                    box: box,
                    char: char
                })
                module.start();
                modules.push(module);
            }
        }

        // 캐릭터 백그라운드 이미지 애니메이션 말풍선
        var charBgAniBoxes = amt.getAll(".char-bg-ani-box", page);
        if (charBgAniBoxes.length > 0) {
            for (var i = 0; i < charBgAniBoxes.length; ++i) {
                var box = charBgAniBoxes[i];
                var char = box.dataset.char;
                module = createBgAnimation({
                    moduleName: "BG_ANIMATION",
                    box: box,
                    char: char,
                    index: i
                })
                module.start();
                modules.push(module);
            }
        }

        // 캐릭터 말풍선
        var charBoxes = amt.getAll(".char-box", page);
        if (charBoxes.length > 0) {
            for (var i = 0; i < charBoxes.length; ++i) {
                var box = charBoxes[i];
                module = createCharSpeech({
                    moduleName: "CHAR_SPEECH",
                    box: box
                })
                module.start();
                modules.push(module);
            }
        }

        // 비디오 플레이어 오픈
        var openVideoBox = amt.get(".open-video-box", page);
        if (openVideoBox) {
            module = createOpenVideo({
                moduleName: "OPEN_VIDEO",
                box: openVideoBox
            })
            module.start();
            modules.push(module);
        }

        // 비디오 링크 페이지
        var videoLinkBox = amt.get(".link-video-box", page);
        if (videoLinkBox) {
            module = createVideoLink({
                moduleName: "VIDEO_LINK",
                box: videoLinkBox
            })
            module.start();
            modules.push(module);
        }

        // 컨텐츠 페이지에 임베드된 간단한 비디오 플레이어
        var contentVidoeBoxes = amt.getAll("[data-module=content-video", page);
        if (contentVidoeBoxes.length > 0) {
            for (var i = 0; i < contentVidoeBoxes.length; ++i) {
                var box = contentVidoeBoxes[i];
                module = createContentVideo({
                    moduleName: "CONTENT_VIDEO",
                    box: box
                })
                module.start();
                modules.push(module);
            }
        }

        // 링크
        var linkButtons = amt.getAll("[data-module=link]", page);
        if (linkButtons.length > 0) {
            for (var i = 0; i < linkButtons.length; ++i) {
                var button = linkButtons[i];
                module = createLink({
                    moduleName: "LINK",
                    button: button
                })
                module.start();
                modules.push(module);
            }
        }

        // popup mini
        var miniPopups = amt.getAll(".popup-mini", page);
        if (miniPopups.length > 0) {
            for (var i = 0; i < miniPopups.length; ++i) {
                var box = miniPopups[i];
                module = createMiniPopup({
                    moduleName: "MINI_POPUP",
                    box: box
                })
                module.start();
                modules.push(module);
            }
        }

        // slef check
        var selfcheckBoxes = amt.getAll(".section-selfcheck", page);
        if (selfcheckBoxes.length > 0) {
            for (var i = 0; i < selfcheckBoxes.length; ++i) {
                var box = selfcheckBoxes[i];
                module = createSelfCheck({
                    moduleName: "SELF_CHECK",
                    box: box
                })
                module.start();
                modules.push(module);
            }
        }

        // 히든 박스 히든 텍스트 전체 정답 확인 기능
        var checkHidden = amt.get("[data-module=check-hidden]", page);
        var checkHiddenModule;
        if (checkHidden) {
            module = createCheckHidden({
                moduleName: "CHECK_HIDDEN",
                box: page,
                button: checkHidden
            })
            module.start();
            modules.push(module);
            checkHiddenModule = module;
        }

        // 히든 박스와 히든 텍스트 모듈은 
        // 다른 모듈(말풍선)에 들어갈 수도 있기 때문에
        // 제일 나중에 생성 한다.
        // 히든 박스
        var hiddenBoxes = amt.getAll(".hidden-box", page);
        if (hiddenBoxes.length > 0) {
            module = createHiddenBox({
                moduleName: "HIDDEN_BOX",
                box: page
            })
            module.start();
            modules.push(module);
            if (checkHiddenModule) {
                checkHiddenModule.add(module);
            }
        }

        // 히든 텍스트
        var hiddenText = amt.getAll(".hidden-text", page);
        if (hiddenText.length > 0) {
            module = createHiddenText({
                moduleName: "HIDDEN_TEXT",
                box: page
            })
            module.start();
            modules.push(module);
            if (checkHiddenModule) {
                checkHiddenModule.add(module);
            }
        }

        // 히든 박스 - 버튼 분리 버전
        var separateBoxes = amt.getAll(".hidden-box.separate", page);
        if (separateBoxes.length > 0) {
            for (var i = 0; i < separateBoxes.length; ++i) {
                var box = separateBoxes[i];
                module = createSeparateHiddenBox({
                    moduleName: "SEPARATE_BOX",
                    box: box
                })
                module.start();
                modules.push(module);
            }
        }

        // 자료 다운로드
        var buttonDownload = amt.get(".button-download", page);
        if (buttonDownload) {
            module = createDownload({
                moduleName: "DOWNLOAD",
                box: page,
                button: buttonDownload
            })
            module.start();
            modules.push(module);
        }

        // 토글버튼
        var toggleButtonBoxes = amt.getAll("[data-module=toggle-button]", page);
        if (toggleButtonBoxes.length > 0) {
            for (var i = 0; i < toggleButtonBoxes.length; ++i) {
                var box = toggleButtonBoxes[i];
                module = createToggleButton({
                    moduleName: "TOGGLE_BUTTON",
                    box: box
                })
                module.start();
                modules.push(module);
            }
        }

        // 인풋 컨트롤
        var inputs = amt.getAll(".input", page);
        if (inputs.length > 0) {
            module = createInputControl({
                moduleName: "INPUT_CONTROL",
                inputs: inputs
            })
            module.start();
            modules.push(module);
        }

        pageModules[pageNumber] = modules;
    }

    function resetAndPlay(pageNumber, module, callback) {
        var modules = pageModules[pageNumber];
        if (modules === undefined) return;
        for (var i = 0; i < modules.length; ++i) {
            var m = modules[i];
            var excepted = false;
            for (var j = 0; j < exceptModules.length; ++j) {
                if (m.name === exceptModules[j]) {
                    excepted = true;
                    break;
                }
            }
            if (m !== module && !excepted) {
                m.reset();
            }
        }
        if (callback) {
            callback();
        }
    }

    function resetMiniPopup(pageNumber, module, callback) {
        var modules = pageModules[pageNumber];
        if (modules === undefined) return;
        for (var i = 0; i < modules.length; ++i) {
            var m = modules[i];
            if (m.name === "MINI_POPUP" && m !== module) {
                m.reset();
            }

            // 팝업 안에 있는 히든 텍스트 모듈 리셋
            if (m.name === "HIDDEN_TEXT") {
                m.resetText(module.getHiddenText());
            }
        }
        if (callback) {
            callback();
        }
    }

    function resetAnimation(pageNumber, module, callback) {
        var modules = pageModules[pageNumber];
        if (modules === undefined) return;
        for (var i = 0; i < modules.length; ++i) {
            var m = modules[i];
            if (m.name === "BG_ANIMATION" || m.name === "PRAISE_ANIMATION" || m.name === "CHAR_ANIMATION" && m !== module) {
                m.reset();
            }
        }
        if (callback) {
            callback();
        }
    }

    function resetPage(pageNumber, callback) {
        var modules = pageModules[pageNumber];
        reset(modules, callback);

        if (contentQuiz) {
            contentQuiz.reset();
        }

        if (picModules.length > 0) {
            for (var i = 0; i < picModules.length; ++i) {
                picModules[i].reset();
            }
        }
    }

    function resetFullPopup(index, callback) {
        var modules = pageModules[fullPopupPages[index]];
        reset(modules, callback);
    }

    function resetAll() {
        for (var i = 0; i < pageModules.length; ++i) {
            var modules = pageModules[i];
            reset(modules);
        }

        if (contentQuiz) {
            contentQuiz.reset();
        }

        if (picModules.length > 0) {
            for (var i = 0; i < picModules.length; ++i) {
                picModules[i].reset();
            }
        }
    }

    function reset(modules, callback) {
        if (modules === undefined) return;
        for (var i = 0; i < modules.length; ++i) {
            var module = modules[i];
            var excepted = false;
            for (var j = 0; j < exceptModules.length; ++j) {
                if (module.name === exceptModules[j]) {
                    excepted = true;
                    break;
                }
            }
            if (excepted) {
                console.log("reset pass :: ", module.name);
                continue;
            }
            module.reset();
        }
        if (callback) {
            callback();
        }
    }

    if (window.hasOwnProperty("startContent")) {
        startContent();
    }

    amt.get("#wrap").style.visibility = "visible";
}