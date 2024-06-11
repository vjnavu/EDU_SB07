var globalScale = 1;

function showViewerNavi() {
    if (parent.document.querySelector("iframe")) {
        var parentDocument = parent.document.querySelector("iframe");
        parentDocument.parentNode.style.position = "static";
        parentDocument.parentNode.style.zIndex = 1;
    }
    var guideTop = amt.get(".guide-top");
    if (guideTop) {
        guideTop.classList.remove("hide");
    }
    var guideBottom = amt.get(".guide-bottom");
    if (guideBottom) {
        guideBottom.classList.remove("hide");
    }
}

function hideViewerNavi() {
    if (parent.document.querySelector("iframe")) {
        var parentDocument = parent.document.querySelector("iframe");
        parentDocument.parentNode.style.position = "relative";
        parentDocument.parentNode.style.zIndex = 1000;
    }
    var guideTop = amt.get(".guide-top");
    if (guideTop) {
        guideTop.classList.add("hide");
    }
    var guideBottom = amt.get(".guide-bottom");
    if (guideBottom) {
        guideBottom.classList.add("hide");
    }
}

// 오른쪽 마우스 클릭 금지
// document.body.oncontextmenu = function () {
//     return false;
// };

window.addEventListener("load", function () {
    initContent();

    var images = document.querySelectorAll('img');
    var i, len = images.length;
    for (i = 0; i < len; ++i) {
        images[i].setAttribute('draggable', false);
    }

    //*
    var baseSize = {
        w: 1170,
        h: 768,
    };
    var wrap = document.querySelector("#wrap");
    setScale();
    window.addEventListener("resize", function (e) {
        setScale();
    });

    function setScale() {
        var ratioX = window.innerWidth / baseSize.w;
        var ratioY = window.innerHeight / baseSize.h;
        var ratio = ratioX > ratioY ? ratioY : ratioX;
        var newLeftPos = Math.abs(Math.floor((baseSize.w * ratio - window.innerWidth) / 2));
        wrap.setAttribute(
            "style",
            "left: " +
                newLeftPos +
                "px; transform: scale(" +
                ratio +
                "," +
                ratio +
                "); -webkit-transform: scale(" +
                ratio +
                "," +
                ratio +
                "); -ms-transform: scale(" +
                ratio +
                "," +
                ratio +
                ");"
        );
        wrap.style.visibility = "visible";
        broadcaster.trigger("RESIZE_WINDOW", { windowRatio: ratio });
        globalScale = ratio;
    }

    var guideTop = document.createElement("div");
    guideTop.classList.add("guide-top");
    wrap.appendChild(guideTop);

    var guideBottom = document.createElement("div");
    guideBottom.classList.add("guide-bottom");
    wrap.appendChild(guideBottom);
    //*/

    audioManager.add("click", "./common/audio/click.mp3");
    audioManager.add("startAni", "./common/audio/animationBG.mp3");
    audioManager.add("correct", "./common/audio/correct.mp3");
    audioManager.add("incorrect", "./common/audio/incorrect.mp3");
    audioManager.add("praise_boy", "./common/audio/praise_boy.mp3");
    audioManager.add("praise_girl", "./common/audio/praise_girl.mp3");

    // 확인 문제 animate cc init()
    if (window.hasOwnProperty("init")) {
        init();
    }
});

var audioManager = (function () {
    var external = {};
    var audios = [];

    external.add = function (id, src, callbacks) {
        audios.push({
            id: id,
            audio: new Audio(src),
            callbacks: callbacks,
        });
    };

    external.play = function (id) {
        var data = get(id);
        var audio = data.audio;
        if (audio) {
            external.stop(id);
            audio.play();
            if (data.callbacks) {
                if (data.callbacks.ended) {
                    audio.addEventListener("ended", data.callbacks.ended);
                }
                if (data.callbacks.pause) {
                    audio.addEventListener("pause", data.callbacks.ended);
                }
            }
        }
    };

    external.pause = function (id) {
        var data = get(id);
        var audio = data.audio;
        if (audio) {
            audio.pause();
        }
    };

    external.stop = function (id) {
        var data = get(id);
        var audio = data.audio;
        if (audio && audio.readyState > 0) {
            audio.pause();
            audio.currentTime = 0;
        }
    };

    external.stopAll = function () {
        for (var i = 0; i < audios.length; ++i) {
            var audio = audios[i].audio;
            if (audio.readyState > 0) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    };

    function get(id) {
        var data;
        for (var i = 0; i < audios.length; ++i) {
            if (id === audios[i].id) {
                data = audios[i];
                break;
            }
        }
        return data;
    }

    return external;
})();

var baseModule = function () {
    var exporter = {};

    exporter.name = "base";

    exporter.addOverEvent = function (el) {
        if (!el) return;
        if (el.length > 0) {
            for (var i = 0; i < el.length; ++i) {
                el[i].addEventListener(amt.mouseTouchEvent.over, function (e) {
                    e.currentTarget.classList.add("over");
                });
                el[i].addEventListener(amt.mouseTouchEvent.out, function (e) {
                    e.currentTarget.classList.remove("over");
                });
            }
        } else {
            el.addEventListener(amt.mouseTouchEvent.over, function (e) {
                e.currentTarget.classList.add("over");
            });
            el.addEventListener(amt.mouseTouchEvent.out, function (e) {
                e.currentTarget.classList.remove("over");
            });
        }
    };

    exporter.reset = function () {
        // console.log("base module reset");
    };

    return exporter;
};

// 인트로-훈민이와 정음이
var initIntro = function (spec) {
    var exporter = _.extend(baseModule());
    var box = amt.get("#main");
    var videoButton = amt.get(".video-open-button");
    var videoDiv = amt.get(".video-player");
    var title = amt.get(".title");

    var videoPlayer = createVideoPlayer({
        moduleName: "VIDEO_PLAYER",
        box: spec.videoBox,
        src: videoDiv.dataset.src,
    });

    exporter.name = spec.moduleName;

    init();

    function init() {
        videoDiv.classList.add("hide");
        videoButton.addEventListener(amt.mouseTouchEvent.click, hnClick);
        videoButton.addEventListener(amt.mouseTouchEvent.over, hnOver);
        videoButton.addEventListener(amt.mouseTouchEvent.out, hnOut);
        videoDiv.addEventListener("VIDEO_PLAYER_EVENT", hnVideoPlayerEvent);
    }

    function hnVideoPlayerEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        switch (data.message) {
            case "VIDEO_PLAYER_CLOSED":
                // title.classList.remove("flowAni");
                // setTimeout(function () {
                //     title.classList.add("flowAni");
                // }, 1);
                videoPlayer.reset();
                break;
        }
    }

    function hnClick(e) {
        var target = e.currentTarget;
        audioManager.play("click");
        if (target === videoButton) {
            videoPlayer.open(true);
        }
    }

    function hnOver(e) {
        var target = e.currentTarget;
        target.classList.add("over");
    }

    function hnOut(e) {
        var target = e.currentTarget;
        target.classList.remove("over");
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        // setTimeout(function () {
        //     title.classList.add("flowAni");
        // }, 1);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
    };

    return exporter;
};

// video content
var createVideoContent = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var titleBox;
    var videoNode;
    var sceneButtonBox;
    var sceneButtons;
    var buttonPlayCenter;

    var sceneTimes;

    var currentScene = -1;

    var videoPlayer;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        sceneTimes = spec.sceneTimes;
        titleBox = amt.get(".video-title-box", box);
        videoNode = amt.get(".video-player", box);
        sceneButtonBox = amt.get(".scene-button-box", box);
        sceneButtons = amt.getAll(".button", sceneButtonBox);
        buttonPlayCenter = amt.get(".button-center-play", titleBox);

        for (var i = 0; i < sceneButtons.length; ++i) {
            exporter.addOverEvent(sceneButtons[i]);
        }

        videoPlayer = createVideoPlayer({
            moduleName: "VIDEO_PLAYER",
            box: ".video-player",
            src: spec.src,
            mode: "base",
            callbacks: {
                stop: function () {
                    resetSceneButtons();
                    currentScene = -1;
                },
                loop: function (cTime) {
                    for (var i = 0; i < sceneTimes.length; ++i) {
                        var time = sceneTimes[i];
                        if (currentScene !== i && cTime >= time.start && cTime < time.end) {
                            // console.log((i+1)+"씬 시작");
                            currentScene = i;
                            resetSceneButtons();
                            sceneButtons[currentScene].classList.add("on");
                            break;
                        }
                    }
                },
            },
        });

        buttonPlayCenter.addEventListener(amt.mouseTouchEvent.click, hnClickPlayCenter);
        sceneButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickScene);
        videoNode.addEventListener("VIDEO_PLAYER_EVENT", hnVideoPlayerEvent);
    }

    function hnVideoPlayerEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        switch (data.message) {
            case "VIDEO_PLAYER_CLOSED":
                // videoPlayer.reset();
                break;
        }
    }

    function hnClickPlayCenter(e) {
        titleBox.classList.add("hide");
        videoPlayer.play();
    }

    function hnClickScene(e) {
        var target = e.target;
        var index = sceneButtons.indexOf(target);
        if (index > -1) {
            resetSceneButtons();
            target.classList.add("on");
            videoPlayer.seek(sceneTimes[index].start);
        }
    }

    function resetSceneButtons() {
        for (var i = 0; i < sceneButtons.length; ++i) {
            sceneButtons[i].classList.remove("on");
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
// 시, 이야기 낭독 컨텐츠
var createNarration = function (spec) {
    var exporter = _.extend(baseModule());
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

// 노래 컨텐츠
var createSong = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var songButtonBox;
    var songButtons;
    var textBox;
    var sceneGroup;

    var texts;

    var sceneTimes;
    var textTimes;

    var currentScene = -1;
    var currentText = -1;

    var inTextTime = false;

    var mode = 0; // 0 - ar, 1 - mr

    var audioPlayer;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        sceneTimes = spec.sceneTimes;
        textTimes = spec.textTimes;

        songButtonBox = amt.get(".song-button-box", box);
        songButtons = amt.getAll(".button", songButtonBox);
        sceneGroup = amt.getAll(".group", box);
        textBox = amt.get(".text-box", box);
        texts = amt.getAll(".text", textBox);

        songButtons[mode].classList.add("on");

        for (var i = 0; i < songButtons.length; ++i) {
            exporter.addOverEvent(songButtons[i]);
        }

        audioPlayer = createAudioPlayer({
            box: amt.get(".audio-player", box),
            audioList: spec.audioList,
            callbacks: {
                stop: function () {
                    resetSceneGroup();
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
                            sceneGroup[currentScene].classList.remove("remove");
                            break;
                        }
                    }

                    for (var i = 0; i < textTimes.length; ++i) {
                        var time = textTimes[i];
                        if (currentText !== i && cTime >= time.start && cTime < time.end) {
                            // console.log((i+1)+" 텍스트 on");
                            currentText = i;
                            resetTexts();
                            texts[currentText].classList.add("on");
                            inTextTime = true;
                            break;
                        }
                    }
                    if (inTextTime && currentText > -1) {
                        if (cTime > textTimes[currentText].end) {
                            // console.log((currentText+1)+" 텍스트 off");
                            resetTexts();
                            inTextTime = false;
                        }
                    }
                },
            },
        });

        songButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickSong);
    }

    function hnClickSong(e) {
        var target = e.target;
        var index = songButtons.indexOf(target);
        if (index > -1 && !target.classList.contains("on")) {
            resetSongButtons();
            target.classList.add("on");
            mode = index;
            audioPlayer.changeAudio(mode);
        }
    }

    function resetSongButtons() {
        for (var i = 0; i < songButtons.length; ++i) {
            songButtons[i].classList.remove("on");
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

var createMainTabs = function (spec) {
    var doc = document;
    var exporter = _.extend(baseModule());
    var box;
    var names;
    var tabBox;
    var contents;
    var tabButtons;

    var boxHeader;
    var tabButtonBox;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        names = spec.names;
        boxHeader = amt.get(".header", box);

        tabBox = doc.createElement("div");
        tabBox.classList.add("main-tab-box");
        box.insertBefore(tabBox, amt.get(".header", box).nextSibling);

        contents = amt.getAll(".content", box);
        var i;
        for (i = 0; i < contents.length; ++i) {
            box.removeChild(contents[i]);
        }
        for (i = 0; i < contents.length; ++i) {
            tabBox.appendChild(contents[i]);
            contents[i].classList.add("hide");
        }

        tabButtonBox = doc.createElement("div");
        tabButtonBox.classList.add("main-tab-button-box");
        boxHeader.appendChild(tabButtonBox);
        tabButtons = [];
        for (i = 0; i < names.length; ++i) {
            var button = doc.createElement("div");
            button.classList.add("main-tab-button");
            button.innerHTML = names[i];
            tabButtonBox.appendChild(button);
            tabButtons.push(button);
        }

        setTab(0);

        tabButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickTabButton);
    }

    function hnClickTabButton(e) {
        var target = e.target;
        var index = tabButtons.indexOf(target);
        if (index > -1) {
            audioManager.play("click");
            setTab(index);
        }
    }

    function setTab(index) {
        reset();
        contents[index].classList.remove("hide");
        tabButtons[index].classList.add("on");
        amt.sendMessage(doc, "DOC_EVENT", {
            message: "SET_MAIN_TAB",
            index: index,
            page: contents[index],
        });
        broadcaster.trigger("MAIN_TAB_SET", { index: index });
    }

    function reset() {
        if (contents.length !== tabButtons.length) {
            console.error("탭버튼과 탭컨텐츠 갯수가 맞지 않음");
            return;
        }
        for (var i = 0; i < contents.length; ++i) {
            contents[i].classList.add("hide");
            tabButtons[i].classList.remove("on");
        }
    }

    exporter.getTabNumber = function () {
        return tabButtons.length;
    };

    return exporter;
};

var createSubTabs = function (spec) {
    var doc = document;
    var exporter = _.extend(baseModule());
    var box;
    var names;
    var contents;
    var tabButtons;
    var tabButtonBox;

    var prevButton;
    var nextButton;

    var tabIndex = 0;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        names = spec.names;

        contents = amt.getAll(".sub-content", box);
        var i;
        for (i = 0; i < contents.length; ++i) {
            contents[i].classList.add("hide");
        }

        prevButton = amt.get(".prev-button", box);
        nextButton = amt.get(".next-button", box);

        tabButtonBox = doc.createElement("div");
        tabButtonBox.classList.add("sub-tab-button-box");
        box.insertBefore(tabButtonBox, box.firstChild.nextSibling);
        tabButtons = [];
        for (i = 0; i < names.length; ++i) {
            var button = doc.createElement("div");
            button.classList.add("sub-tab-button");
            button.innerHTML = names[i];
            tabButtonBox.appendChild(button);
            tabButtons.push(button);
        }

        tabButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickTabButton);
        if (prevButton) {
            exporter.addOverEvent(prevButton);
            prevButton.addEventListener(amt.mouseTouchEvent.click, hnClickPrev);
        }
        if (nextButton) {
            exporter.addOverEvent(nextButton);
            nextButton.addEventListener(amt.mouseTouchEvent.click, hnClickNext);
        }

        setTab(0);
    }

    function hnClickTabButton(e) {
        var target = e.target;
        var index = tabButtons.indexOf(target);
        if (index > -1) {
            audioManager.play("click");
            setTab(index);
            // amt.sendMessage(doc, "DOC_EVENT", {
            //     message: "SET_SUB_TAB",
            //     index: index
            // });
        }
    }

    function hnClickPrev(e) {
        audioManager.play("click");
        var index = --tabIndex;
        setTab(index);
        // amt.sendMessage(doc, "DOC_EVENT", {
        //     message: "SET_SUB_TAB",
        //     index: index
        // });
    }

    function hnClickNext(e) {
        audioManager.play("click");
        var index = ++tabIndex;
        setTab(index);
        // amt.sendMessage(doc, "DOC_EVENT", {
        //     message: "SET_SUB_TAB",
        //     index: index
        // });
    }

    function updateButton(index) {
        if (!prevButton || !nextButton) return;
        if (index === 0) {
            prevButton.classList.add("disable");
            nextButton.classList.remove("disable");
        } else if (index === tabButtons.length - 1) {
            prevButton.classList.remove("disable");
            nextButton.classList.add("disable");
        } else {
            prevButton.classList.remove("disable");
            nextButton.classList.remove("disable");
        }
        nextButton.classList.remove("over");
        prevButton.classList.remove("over");
    }

    function setTab(index, noEvent) {
        if (index < 0) index = 0;
        if (index >= tabButtons.length) index = tabButtons.length - 1;
        tabIndex = index;
        reset();
        contents[index].classList.remove("hide");
        tabButtons[index].classList.add("on");
        updateButton(index);

        if (noEvent) return;
        amt.sendMessage(doc, "DOC_EVENT", {
            message: "SET_SUB_TAB",
            index: index,
        });
        broadcaster.trigger("SUB_TAB_SET", { index: index });
    }

    function reset() {
        if (contents.length !== tabButtons.length) {
            console.error("탭버튼과 탭컨텐츠 갯수가 맞지 않음");
            return;
        }
        for (var i = 0; i < contents.length; ++i) {
            contents[i].classList.add("hide");
            tabButtons[i].classList.remove("on");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        setTab(0, true);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        setTab(0, true);
    };

    return exporter;
};

var createContentTabs = function (spec) {
    var doc = document;
    var exporter = _.extend(baseModule());
    var box;
    var contents;
    var tabButtons;
    var prevButton;
    var nextButton;

    var tabButtonBox;

    var tabIndex = 0;

    var modeEvent = true;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        if (spec.hasOwnProperty("modeEvent")) {
            modeEvent = spec.modeEvent;
        }

        if (box.classList.contains("js-ignore-reset")) {
            modeEvent = false;
        }

        contents = amt.getAll(".tab-content", box);
        var i;
        for (i = 0; i < contents.length; ++i) {
            contents[i].classList.add("hide");
        }

        tabButtonBox = amt.get(".button-box", box);
        tabButtons = amt.getAll(".button", tabButtonBox);
        prevButton = amt.get(".prev-button", tabButtonBox);
        nextButton = amt.get(".next-button", tabButtonBox);

        exporter.addOverEvent(tabButtons);

        tabButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickTabButton);
        box.addEventListener("MODULE_EVENT", hnModuleEvent);

        setTab(0);
    }

    function hnModuleEvent(e) {
        if (e.detail.message === "RESET_CONTENT_TAB") {
            setTab(0);
        }
    }

    function hnClickTabButton(e) {
        var target = e.target;
        var index = tabButtons.indexOf(target);
        if (index > -1) {
            audioManager.play("click");
            setTab(index);
            sendMessage(index);
        }

        if (target === prevButton) {
            audioManager.play("click");
            index = --tabIndex;
            setTab(index);
            sendMessage(index);
        }
        if (target === nextButton) {
            audioManager.play("click");
            index = ++tabIndex;
            setTab(index);
            sendMessage(index);
        }
    }

    function updateButton(index) {
        if (!prevButton || !nextButton) return;
        if (index === 0) {
            prevButton.classList.add("disable");
            nextButton.classList.remove("disable");
        } else if (index === tabButtons.length - 1) {
            prevButton.classList.remove("disable");
            nextButton.classList.add("disable");
        } else {
            prevButton.classList.remove("disable");
            nextButton.classList.remove("disable");
        }
    }

    function setTab(index) {
        if (index < 0) index = 0;
        if (index >= tabButtons.length) index = tabButtons.length - 1;
        tabIndex = index;
        reset();
        contents[index].classList.remove("hide");
        tabButtons[index].classList.add("on");
        updateButton(index);
    }

    function reset() {
        for (var i = 0; i < contents.length; ++i) {
            contents[i].classList.add("hide");
            tabButtons[i].classList.remove("on");
        }
    }

    function sendMessage(index) {
        if (modeEvent) {
            amt.sendMessage(doc, "DOC_EVENT", {
                message: "SET_CONTENT_TAB",
                index: index,
            });
        }
    }

    exporter.setTab = function (index) {
        setTab(index);
    };

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        setTab(0);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        setTab(0);
    };

    return exporter;
};

var createSeparateHiddenBox = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var buttons;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        buttons = [];
        var buttonNames = box.dataset.button.split(";");
        for (var i = 0; i < buttonNames.length; ++i) {
            buttons[i] = amt.get(buttonNames[i]);
            buttons[i].addEventListener(amt.mouseTouchEvent.click, hnClickButton);
            exporter.addOverEvent(buttons[i]);
        }
    }

    function hnClickButton(e) {
        var button = e.currentTarget;
        button.classList.add("hide");
        setTimeout(function () {
            box.classList.add("on");
        }, 100);
        audioManager.play("click");
    }

    function reset() {
        for (var i = 0; i < buttons.length; ++i) {
            var button = buttons[i];
            button.classList.remove("hide");
        }
        box.classList.remove("on");
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        reset();
    };

    return exporter;
};

var createCheckHidden = function (spec) {
    var doc = document;
    var exporter = _.extend(baseModule());
    var box;
    var button;

    var count = 0;

    var modules = [];

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        button = spec.button;

        exporter.addOverEvent(button);
        button.addEventListener(amt.mouseTouchEvent.click, hnClick);

        document.addEventListener("MODULE_EVENT", hnModuleEvent);
    }

    function hnModuleEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        var module = data.module;
        var callback;
        // console.log("data :: ", data);
        switch (data.message) {
            case "HIDDEN_BOX_COMPLETE":
            case "HIDDEN_TEXT_COMPLETE":
                checkComplete(module);
                break;
        }
    }

    function checkComplete(module) {
        for (var i = 0; i < modules.length; ++i) {
            if (module === modules[i]) {
                ++count;
                break;
            }
        }
        // 히든 박스 모듈 완료시
        // 히든 텍스트 모듈 완료시
        // 히든 박스와 히든 텍스트 모듈 모두 완료시
        if (count === modules.length) {
            console.log("complete all");
            setButtonAnsweOn();
            button.classList.add("on");
        }
    }

    function hnClick(e) {
        audioManager.play("click");
        var target = e.currentTarget;
        target.classList.toggle("on");
        if (target.classList.contains("on")) {
            setButtonAnsweOn();
            for (var i = 0; i < modules.length; ++i) {
                var module = modules[i];
                module.showAll();
            }
        } else {
            setButtonAnsweOff();
            for (var i = 0; i < modules.length; ++i) {
                var module = modules[i];
                module.hideAll();
            }
            count = 0;
        }
    }

    function setButtonAnsweOn() {
        var text = amt.get(".text", button);
        text.innerHTML = "정답 가리기";
    }

    function setButtonAnsweOff() {
        var text = amt.get(".text", button);
        text.innerHTML = "정답 확인";
    }

    function reset() {
        setButtonAnsweOff();
        button.classList.remove("on");
        count = 0;
    }

    exporter.add = function (module) {
        modules.push(module);
    };

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        // reset();
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        reset();
    };

    return exporter;
};

var createHiddenBox = function (spec) {
    var doc = document;
    var exporter = _.extend(baseModule());
    var box = spec.box;
    // var boxes = amt.getAll(".hidden-box", box);
    var boxes = amt.getAll(".hidden-box:not(.separate)", box);
    var groups = [];

    var count = 0;

    exporter.name = spec.moduleName;

    init();

    function init() {
        for (var i = 0; i < boxes.length; ++i) {
            var iconBox = doc.createElement("div");
            iconBox.classList.add("icon-box");
            var icon = doc.createElement("icon");
            icon.classList.add("icon");
            iconBox.appendChild(icon);
            var box = boxes[i];

            if (box.dataset.group) {
                var index = parseInt(box.dataset.group);
                if (groups[index] === undefined) {
                    groups[index] = [];
                }
                groups[index].push(box);
            }

            box.appendChild(iconBox);
            iconBox.index = i;
            iconBox.addEventListener(amt.mouseTouchEvent.click, hnClick);
            iconBox.addEventListener(amt.mouseTouchEvent.over, hnOver);
            iconBox.addEventListener(amt.mouseTouchEvent.out, hnOut);
        }

        resetGroupIcon();
    }

    function hnClick(e) {
        var iconBox = e.currentTarget;
        var box = boxes[iconBox.index];
        if (box.dataset.group) {
            var groupIndex = parseInt(box.dataset.group);
            var arr = groups[groupIndex];
            for (var i = 0; i < arr.length; ++i) {
                var box = arr[i];
                box.classList.add("on");
                amt.get(".icon-box", box).classList.add("hide");
                ++count;
            }
        } else {
            // iconBox.classList.remove("over");
            iconBox.classList.add("hide");
            // box.classList.add("on");
            setTimeout(function () {
                box.classList.add("on");
            }, 100);
            ++count;
        }
        // 박스 보일 때 같이 보여야 할 node
        if (box.dataset.visible) {
            var nodeNameList = box.dataset.visible.split(";");
            for (var i = 0; i < nodeNameList.length; ++i) {
                var node = amt.get(nodeNameList[i]);
                if (node) {
                    node.classList.remove("hide");
                }
            }
        }
        audioManager.play("click");

        if (count === boxes.length) {
            amt.sendMessage(document, "MODULE_EVENT", {
                message: "HIDDEN_BOX_COMPLETE",
                module: exporter,
            });
        }
    }

    function hnOver(e) {
        var iconBox = e.currentTarget;
        var box = boxes[iconBox.index];
        if (box.dataset.group) {
            var groupIndex = parseInt(box.dataset.group);
            var arr = groups[groupIndex];
            for (var i = 0; i < arr.length; ++i) {
                var box = arr[i];
                amt.get(".icon-box", box).classList.add("over");
            }
        } else {
            iconBox.classList.add("over");
        }
    }

    function hnOut(e) {
        var iconBox = e.currentTarget;
        var box = boxes[iconBox.index];
        if (box.dataset.group) {
            var groupIndex = parseInt(box.dataset.group);
            var arr = groups[groupIndex];
            for (var i = 0; i < arr.length; ++i) {
                var box = arr[i];
                amt.get(".icon-box", box).classList.remove("over");
            }
        } else {
            iconBox.classList.remove("over");
        }
    }

    function resetGroupIcon() {
        if (groups.length > 0) {
            for (var i = 0; i < groups.length; ++i) {
                var arr = groups[i];
                if (arr === undefined) continue;
                for (var j = 0; j < arr.length; ++j) {
                    var box = arr[j];
                    if (box.classList.contains("show-icon")) continue;
                    amt.get(".icon", box).classList.add("hide");
                }
            }
        }
    }

    function reset() {
        for (var i = 0; i < boxes.length; ++i) {
            var box = boxes[i];
            if (box.classList.contains("js-ignore-reset")) continue;
            box.classList.remove("on");
            amt.get(".icon-box", box).classList.remove("hide");
        }
        resetGroupIcon();
        count = 0;
    }

    exporter.showAll = function () {
        for (var i = 0; i < boxes.length; ++i) {
            var box = boxes[i];
            box.classList.add("on");
            amt.get(".icon-box", box).classList.add("hide");
        }
    };

    exporter.hideAll = function () {
        reset();
    };

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        reset();
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        reset();
    };

    return exporter;
};

var createHiddenText = function (spec) {
    var doc = document;
    var exporter = _.extend(baseModule());
    var box = spec.box;
    var texts;
    var buttonAnswer;

    var groups = [];

    var count = 0;

    exporter.name = spec.moduleName;

    init();

    function init() {
        texts = amt.getAll(".hidden-text", box);
        buttonAnswer = amt.get(".button-answer", box);

        for (var i = 0; i < texts.length; ++i) {
            var iconBox = doc.createElement("div");
            iconBox.classList.add("icon-text");
            var icon = doc.createElement("icon");
            icon.classList.add("icon");
            iconBox.appendChild(icon);
            var text = texts[i];

            if (text.dataset.group) {
                var index = parseInt(text.dataset.group);
                if (groups[index] === undefined) {
                    groups[index] = [];
                }
                groups[index].push(text);
            }

            var wrapText = doc.createElement("div");
            wrapText.classList.add("wrap-text");
            wrapText.style.display = "inline-block";
            wrapText.innerHTML = text.innerHTML;
            text.innerHTML = "";
            text.appendChild(wrapText);
            text.appendChild(iconBox);
            iconBox.index = i;
            iconBox.addEventListener(amt.mouseTouchEvent.click, hnClick);
            iconBox.addEventListener(amt.mouseTouchEvent.over, hnOver);
            iconBox.addEventListener(amt.mouseTouchEvent.out, hnOut);
        }

        if (buttonAnswer) {
            exporter.addOverEvent(buttonAnswer);
            buttonAnswer.addEventListener(amt.mouseTouchEvent.click, hnClickAnswer);
        }

        resetGroupIcon();
    }

    function hnClick(e) {
        var iconBox = e.currentTarget;
        var text = texts[iconBox.index];
        if (text.dataset.group) {
            var groupIndex = parseInt(text.dataset.group);
            var arr = groups[groupIndex];
            for (var i = 0; i < arr.length; ++i) {
                var groupText = arr[i];
                groupText.classList.add("on");
                amt.get(".icon-text", groupText).classList.add("hide");
                ++count;
            }
        } else {
            iconBox.classList.add("hide");
            setTimeout(function () {
                text.classList.add("on");
            }, 100);
            ++count;
        }
        // 텍스트 보일 때 같이 보여야 할 node
        if (text.dataset.visible) {
            var nodeNameList = text.dataset.visible.split(";");
            for (var i = 0; i < nodeNameList.length; ++i) {
                var node = amt.get(nodeNameList[i]);
                node.classList.remove("hide");
            }
        }
        audioManager.play("click");

        if (buttonAnswer && count === texts.length) {
            buttonAnswer.classList.add("on");
            setButtonAnsweOn();
        }
    }

    function hnOver(e) {
        var iconBox = e.currentTarget;
        var text = texts[iconBox.index];
        if (text.dataset.group) {
            var groupIndex = parseInt(text.dataset.group);
            var arr = groups[groupIndex];
            for (var i = 0; i < arr.length; ++i) {
                var groupText = arr[i];
                amt.get(".icon-text", groupText).classList.add("over");
            }
        } else {
            iconBox.classList.add("over");
        }
    }

    function hnOut(e) {
        var iconBox = e.currentTarget;
        var text = texts[iconBox.index];
        if (text.dataset.group) {
            var groupIndex = parseInt(text.dataset.group);
            var arr = groups[groupIndex];
            for (var i = 0; i < arr.length; ++i) {
                var groupText = arr[i];
                amt.get(".icon-text", groupText).classList.remove("over");
            }
        } else {
            iconBox.classList.remove("over");
        }
    }

    function resetGroupIcon() {
        if (groups.length > 0) {
            for (var i = 0; i < groups.length; ++i) {
                var arr = groups[i];
                if (arr === undefined) continue;
                for (var j = 0; j < arr.length; ++j) {
                    var box = arr[j];
                    if (box.classList.contains("show-icon")) continue;
                    amt.get(".icon", box).classList.add("hide");
                }
            }
        }
    }

    function hnClickAnswer(e) {
        audioManager.play("click");
        var target = e.currentTarget;
        target.classList.toggle("on");
        if (target.classList.contains("on")) {
            setButtonAnsweOn();
            for (var i = 0; i < texts.length; ++i) {
                var text = texts[i];
                text.classList.add("on");
                amt.get(".icon-text", text).classList.add("hide");
            }
        } else {
            exporter.reset();
        }
    }

    function setButtonAnsweOn() {
        var text = amt.get(".text", buttonAnswer);
        text.innerHTML = "정답 가리기";
    }

    function setButtonAnsweOff() {
        var text = amt.get(".text", buttonAnswer);
        text.innerHTML = "정답 확인";
    }

    function reset() {
        for (var i = 0; i < texts.length; ++i) {
            var text = texts[i];
            if (text.classList.contains("js-ignore-reset")) continue;
            text.classList.remove("on");
            amt.get(".icon-text", text).classList.remove("hide");
        }
        resetGroupIcon();
        count = 0;
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        reset();
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        reset();
        if (buttonAnswer) {
            buttonAnswer.classList.remove("on");
            setButtonAnsweOff();
        }
    };

    exporter.resetText = function (texts) {
        for (var i = 0; i < texts.length; ++i) {
            var text = texts[i];
            text.classList.remove("on");
            amt.get(".icon-text", text).classList.remove("hide");
        }
    };

    return exporter;
};

// 대발문
var createTeacherQuestion = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var background;
    var slideBox;
    var slideButton;
    var closeButton;
    var infoBox;

    var onPositionX;
    var offPositionX;

    // var texts;

    var index = 0;

    var readyTime = 7000; // 7초

    var timerId;

    var template =
        '\
                <div class="background hide"></div>\
                <div class="slide-box">\
                    <button type="button" class="slide-button" aria-label="창열고닫기"></button>\
                    <div class="pannel align-cl">\
                        <div class="bullet-box teacher">\
                            <div class="text"></div>\
                        </div>\
                        <div class="image-info"></div>\
                    </div>\
                    <button type="button" class="slide-close-button" aria-label="닫기"></button>\
                </div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = amt.get(".teacher-question");
        var text = box.innerHTML;
        box.innerHTML = template;

        background = amt.get(".background", box);
        slideBox = amt.get(".slide-box", box);
        slideButton = amt.get(".slide-button", box);
        closeButton = amt.get(".slide-close-button", box);
        infoBox = amt.get(".image-info", box);
        amt.get(".text", slideBox).innerHTML = text;
        // texts = amt.getAll(".text", box);

        if (box.classList.contains("bullet-circle")) {
            var bulletBox = amt.get(".bullet-box", slideBox);
            bulletBox.classList.remove("teacher");
            bulletBox.classList.add("empty-circle");
        }

        // setText(index);

        onPositionX = 0;
        // offPositionX = -1083;
        offPositionX = -1086;

        exporter.addOverEvent(slideButton);
        exporter.addOverEvent(closeButton);
        slideButton.addEventListener(amt.mouseTouchEvent.click, hnClickSlide);
        closeButton.addEventListener(amt.mouseTouchEvent.click, hnClickClose);

        slideBox.style.transform = "translateX(" + offPositionX + "px)";

        if (spec && spec.hasOwnProperty("open") && spec.open) {
            ready();
        }

        document.addEventListener("DOC_EVENT", hnDocEvent);
    }

    function hnDocEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        switch (data.message) {
            case "SET_MAIN_TAB":
                index = data.index;
                // setText(index);
                // ready();

                // 파일 처음 들어왔을때만 자동으로 보이는걸로 수정
                // if (index === 0) {
                //     ready();
                // }
                break;
        }
    }

    function hnClickSlide(e) {
        audioManager.play("click");
        if (slideButton.classList.contains("on")) {
            slideOut();
        } else {
            slideIn();
        }
        slideButton.classList.remove("over");
    }

    function hnClickClose(e) {
        audioManager.play("click");
        slideOut();
        closeButton.classList.remove("over");
    }

    function ready() {
        infoBox.classList.remove("hide");
        slideButton.classList.add("on");
        background.classList.remove("hide");

        slideBox.style.transform = "translateX(" + 0 + ")";

        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(function () {
            slideOut();
        }, readyTime);
    }

    function slideIn() {
        slideButton.classList.add("on");
        background.classList.remove("hide");
        anime({
            targets: slideBox,
            translateX: onPositionX,
            easing: "easeOutExpo",
            duration: 500,
        });
    }

    function slideOut() {
        if (timerId) clearTimeout(timerId);
        infoBox.classList.add("hide");
        slideButton.classList.remove("on");
        background.classList.add("hide");
        anime({
            targets: slideBox,
            translateX: offPositionX,
            easing: "easeOutExpo",
            duration: 500,
        });
    }

    // function setText(index) {
    //     resetTexts();
    //     texts[index].classList.remove("remove");
    // }
    //
    // function resetTexts() {
    //     for(var i = 0; i < texts.length; ++i) {
    //         texts[i].classList.add("remove");
    //     }
    // }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
    };

    return exporter;
};

var createPraiseAnimation = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var button;
    var canvas;
    var aniModule;
    var type;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        button = amt.get(".praise-button", box);
        canvas = amt.get("canvas", box);
        type = parseInt(spec.type);

        var src = "./common/images/ani/praise0" + (type + 1) + ".png";
        var data = window["praise0" + (type + 1)];

        aniModule = canvasAnimation({
            canvas: canvas,
            imageSrc: src,
            data: data,
            autoPlay: false,
            usePoster: false,
            loop: false,
        }).init();

        button.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
        canvas.addEventListener("CANVAS_ANIMATION_ENDED", hnAniEnd);
    }

    function hnClickButton(e) {
        // audioManager.play("click");
        // amt.sendMessage(document, "DOC_EVENT", {
        //     message: "RESET_CONTENTS",
        //     callback: play
        // });
        amt.sendMessage(document, "DOC_EVENT", {
            message: "RESET_ANIMATION",
            module: exporter,
            callback: play,
        });
        // play();
    }

    function hnAniEnd(e) {}

    function play() {
        aniModule.playAni();
        if (type === 0 || type === 1) {
            audioManager.play("praise_boy");
        } else if (type === 2 || type === 3) {
            audioManager.play("praise_girl");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        aniModule.stopAni();
        audioManager.stop("praise_boy");
        audioManager.stop("praise_girl");
    };

    return exporter;
};

var createBgAnimation = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var bgBox;
    var speechBox;
    var speechBoxInner;
    var closeSpeechButton;

    var audioSrc;
    var audioId;

    var aniModule;

    var imageName;

    var useSpeech = true;

    var index;

    var template =
        '\
        <div class="bg-box"></div>\
        <div class="speech-box">\
            <div class="bg"></div>\
            <div class="arrow"></div>\
            <div class="speech-box-inner ti"></div>\
            <button type="button" class="close-speech-button" aria-label="닫기"></button>\
        </div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        index = spec.index;

        var speech = box.innerHTML;
        if (speech.length === 0) useSpeech = false;

        box.innerHTML = template;

        bgBox = amt.get(".bg-box", box);
        speechBox = amt.get(".speech-box", box);
        speechBoxInner = amt.get(".speech-box-inner", speechBox);
        closeSpeechButton = amt.get(".close-speech-button", speechBox);
        arrow = amt.get(".arrow", speechBox);

        speechBox.classList.add("hide");
        speechBoxInner.innerHTML = speech;

        imageName = box.dataset.name;

        audioSrc = box.dataset.audio;
        if (box.dataset.audioId) {
            audioId = box.dataset.audioId;
        } else {
            var strs = audioSrc.split("/");
            audioId = strs[strs.length - 1].split(".")[0];
        }

        audioManager.add(audioId, audioSrc, {
            ended: audioEnded,
        });

        var boxColor = box.dataset.color;
        if (boxColor) {
            speechBox.classList.add(boxColor);
        }
        var tailType = box.dataset.tail;
        if (tailType) {
            speechBox.classList.add(tailType);
        }
        var tailDirection = box.dataset.tailDirection;
        if (tailDirection) {
            arrow.classList.add(tailDirection);
        }

        var src = "./common/images/ani/" + imageName + ".png";
        var data = window[imageName];

        aniModule = bgAnimation({
            bgBox: bgBox,
            imageSrc: src,
            data: data,
            autoPlay: false,
            usePoster: true,
            loop: true,
        }).init();

        closeSpeechButton.addEventListener(amt.mouseTouchEvent.click, hnClickClose);
        bgBox.addEventListener(amt.mouseTouchEvent.click, hnClickChar);
        bgBox.addEventListener("BG_ANIMATION_ENDED", hnAniEnd);
    }

    function hnClickChar(e) {
        // audioManager.play("click");
        if (bgBox.classList.contains("start")) {
            stop();
        } else {
            amt.sendMessage(document, "DOC_EVENT", {
                message: "RESET_ANIMATION",
                module: exporter,
                callback: play,
            });
            // play();
        }
    }

    function hnClickClose(e) {
        audioManager.play("click");
        stop();
    }

    function hnAniEnd(e) {}

    function play() {
        audioManager.play(audioId);
        aniModule.playAni();
        if (useSpeech) {
            speechBox.classList.remove("hide");
        }
        broadcaster.trigger("BROAD_BG_ANIMATION_PLAYED", { aniIndex: index });
    }

    function stop() {
        audioManager.stop(audioId);
        aniModule.stopAni();
        if (useSpeech) {
            speechBox.classList.add("hide");
        }
    }

    function audioEnded() {
        aniModule.stopAni();
        if (useSpeech) {
            speechBox.classList.add("hide");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        stop();
    };

    return exporter;
};

var createCharAnimation = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var canvas;
    var speechBox;
    var speechBoxInner;
    var closeSpeechButton;

    var audioSrc;
    var audioId;

    var aniModule;

    var imageName;

    var useSpeech = true;

    var index;

    var template =
        '\
        <canvas class="char-canvas"></canvas>\
        <div class="speech-box">\
            <div class="bg"></div>\
            <div class="arrow"></div>\
            <div class="speech-box-inner ti"></div>\
            <div class="close-speech-button"></div>\
        </div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        index = sepc.index;

        var speech = box.innerHTML;
        if (speech.length === 0) useSpeech = false;

        box.innerHTML = template;

        canvas = amt.get("canvas", box);
        speechBox = amt.get(".speech-box", box);
        speechBoxInner = amt.get(".speech-box-inner", speechBox);
        closeSpeechButton = amt.get(".close-speech-button", speechBox);
        arrow = amt.get(".arrow", speechBox);

        speechBox.classList.add("hide");
        speechBoxInner.innerHTML = speech;

        imageName = box.dataset.name;

        audioSrc = box.dataset.audio;
        if (box.dataset.audioId) {
            audioId = box.dataset.audioId;
        } else {
            var strs = audioSrc.split("/");
            audioId = strs[strs.length - 1].split(".")[0];
        }

        audioManager.add(audioId, audioSrc, {
            ended: audioEnded,
        });

        var boxColor = box.dataset.color;
        if (boxColor) {
            speechBox.classList.add(boxColor);
        }
        var tailType = box.dataset.tail;
        if (tailType) {
            speechBox.classList.add(tailType);
        }
        var tailDirection = box.dataset.tailDirection;
        if (tailDirection) {
            arrow.classList.add(tailDirection);
        }

        var src = "./common/images/ani/" + imageName + ".png";
        var data = window[imageName];

        aniModule = canvasAnimation({
            canvas: canvas,
            imageSrc: src,
            data: data,
            autoPlay: false,
            usePoster: true,
            loop: true,
        }).init();

        closeSpeechButton.addEventListener(amt.mouseTouchEvent.click, hnClickClose);
        canvas.addEventListener(amt.mouseTouchEvent.click, hnClickChar);
        canvas.addEventListener("CANVAS_ANIMATION_ENDED", hnAniEnd);
    }

    function hnClickChar(e) {
        // audioManager.play("click");
        if (canvas.classList.contains("start")) {
            stop();
        } else {
            amt.sendMessage(document, "DOC_EVENT", {
                message: "RESET_ANIMATION",
                module: exporter,
                callback: play,
            });
            // play();
        }
    }

    function hnClickClose(e) {
        audioManager.play("click");
        stop();
    }

    function hnAniEnd(e) {}

    function play() {
        audioManager.play(audioId);
        aniModule.playAni();
        if (useSpeech) {
            speechBox.classList.remove("hide");
        }
        broadcaster.trigger("BROAD_CHAR_ANIMATION_PLAYED", { aniIndex: index });
    }

    function stop() {
        audioManager.stop(audioId);
        aniModule.stopAni();
        if (useSpeech) {
            speechBox.classList.add("hide");
        }
    }

    function audioEnded() {
        aniModule.stopAni();
        if (useSpeech) {
            speechBox.classList.add("hide");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        stop();
    };

    return exporter;
};

var createCharSpeech = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var imageBox;
    var speechBox;
    var speechBoxInner;
    var closeSpeechButton;

    var audioSrc;
    var audioId;

    var useAudio = false;

    var template =
        '\
        <div class="char-image"></div>\
        <div class="speech-box">\
            <div class="bg"></div>\
            <div class="arrow"></div>\
            <div class="speech-box-inner ti"></div>\
            <div class="close-speech-button"></div>\
        </div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        var speech = box.innerHTML;
        box.innerHTML = template;

        imageBox = amt.get(".char-image", box);
        speechBox = amt.get(".speech-box", box);
        speechBoxInner = amt.get(".speech-box-inner", speechBox);
        closeSpeechButton = amt.get(".close-speech-button", speechBox);
        arrow = amt.get(".arrow", speechBox);

        speechBox.classList.add("hide");
        speechBoxInner.innerHTML = speech;

        audioSrc = box.dataset.audio;
        if (audioSrc) {
            useAudio = true;
            if (box.dataset.audioId) {
                audioId = box.dataset.audioId;
            } else {
                var strs = audioSrc.split("/");
                audioId = strs[strs.length - 1].split(".")[0];
            }

            audioManager.add(audioId, audioSrc, {
                ended: audioEnded,
            });
        }

        var boxColor = box.dataset.color;
        if (boxColor) {
            speechBox.classList.add(boxColor);
        }
        var tailType = box.dataset.tail;
        if (tailType) {
            speechBox.classList.add(tailType);
        }
        var tailDirection = box.dataset.tailDirection;
        if (tailDirection) {
            arrow.classList.add(tailDirection);
        }

        exporter.addOverEvent(imageBox);
        closeSpeechButton.addEventListener(amt.mouseTouchEvent.click, hnClickClose);
        imageBox.addEventListener(amt.mouseTouchEvent.click, hnClickChar);
    }

    function hnClickChar(e) {
        audioManager.play("click");
        if (imageBox.classList.contains("on")) {
            stop();
        } else {
            amt.sendMessage(document, "DOC_EVENT", {
                message: "RESET_CONTENTS",
                callback: play,
            });
        }
    }

    function hnClickClose(e) {
        audioManager.play("click");
        stop();
    }

    function hnAniEnd(e) {}

    function play() {
        imageBox.classList.add("on");
        speechBox.classList.remove("hide");
        if (useAudio) {
            audioManager.play(audioId);
        }
    }

    function stop() {
        imageBox.classList.remove("on");
        speechBox.classList.add("hide");
        if (useAudio) {
            audioManager.stop(audioId);
        }
    }

    function audioEnded() {}

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        stop();
    };

    return exporter;
};

var createOpenVideo = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var openButton;
    var title;

    var videoNode;
    var videoPlayer;

    var src;

    var template =
        '\
        <div class="background"></div>\
        <div class="title-box">\
            <div class="title"></div>\
        </div>\
        <div class="open-video-button"></div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        var text = box.innerHTML;
        box.innerHTML = template;

        title = amt.get(".title", box);
        openButton = amt.get(".open-video-button", box);
        videoNode = amt.get(".video-player");

        videoNode.classList.add("hide");

        title.innerHTML = text;

        src = box.dataset.src;

        videoPlayer = createVideoPlayer({
            moduleName: "VIDEO_PLAYER",
            box: videoNode,
            src: src,
        });

        exporter.addOverEvent(openButton);
        openButton.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
        videoNode.addEventListener("VIDEO_PLAYER_EVENT", hnVideoPlayerEvent);
    }

    function hnVideoPlayerEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        switch (data.message) {
            case "VIDEO_PLAYER_CLOSED":
                var header = amt.get(".header");
                header.classList.remove("hide");
                videoPlayer.reset();
                break;
        }
    }

    function hnClickButton(e) {
        audioManager.play("click");
        var header = amt.get(".header");
        header.classList.add("hide");
        videoPlayer.open(true);
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
    };

    return exporter;
};

var createVideoLink = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var title;
    var linkButton;
    var linkType; // player = 천재 미디어 실행, open = window.open url, content = window.open html
    var link;

    var template =
        '\
        <div class="background"></div>\
        <div class="title-box">\
            <div class="title"></div>\
        </div>\
        <div class="link-video-button"></div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        var text = box.innerHTML;
        box.innerHTML = template;

        title = amt.get(".title", box);
        linkButton = amt.get(".link-video-button", box);

        title.innerHTML = text;

        linkType = box.dataset.linkType;
        link = box.dataset.src;

        linkButton.addEventListener(amt.mouseTouchEvent.click, hnClickLink);
        linkButton.addEventListener(amt.mouseTouchEvent.over, hnOver);
        linkButton.addEventListener(amt.mouseTouchEvent.out, hnOut);
    }

    function hnClickLink(e) {
        audioManager.play("click");
        if (linkType === "player") {
            viewChunjaeMedia(link);
        } else if (linkType === "open") {
            videoPageOpen(link);
        } else if (linkType === "content") {
            linkHtml(link);
        }
    }

    function hnOver(e) {
        var target = e.currentTarget;
        target.classList.add("over");
    }

    function hnOut(e) {
        var target = e.currentTarget;
        target.classList.remove("over");
    }

    // 천재 미디어 실행용
    // viewChunjaeMedia('M201901057_800K.mp4'); // 천재에서 제공하는 영상파일명 800K
    function viewChunjaeMedia(mID) {
        var strURL, strFeature;
        var width, height;
        var x, y;

        width = 855;
        height = 560;
        x = (screen.width - width) / 2;
        y = (screen.height - height) / 2;

        if (mID.toLowerCase().indexOf("_800k.mp4") > -1 || mID.toLowerCase().indexOf("_300k.mp4") > -1) {
            // strURL = "http://e.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
            strURL = "http://m.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
        } else {
            // strURL = "http://e.tsherpa.co.kr/media/mediaframe1.aspx?fname=" + (mID.toLowerCase().indexOf("http://chunjae.gscdn.com") > -1 ? mID.replace("http://", "") : mID);
            strURL =
                "http://m.tsherpa.co.kr/media/mediaframe.aspx?fcode=" +
                (mID.toLowerCase().indexOf("http://chunjae.gscdn.com") > -1 ? mID.replace("http://", "") : mID);
        }
        //console.log(strURL);
        strFeature =
            "left=" +
            x +
            ", top=" +
            y +
            ", width=" +
            width +
            ", height=" +
            height +
            ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=no";
        var win = window.open(strURL, "win_ChunjaeMedia", strFeature);

        win.focus();
        return;
    }

    // 동영상 링크 직접 띄우기 window.open
    // var link = 'https://www.youtube.com/embed/njRsMxGO4_8';
    // videoPageOpen(link);
    function videoPageOpen(strURL) {
        var strFeature;
        var width, height;
        var x, y;

        width = 855;
        height = 560;
        x = (screen.width - width) / 2;
        y = (screen.height - height) / 2;

        strFeature =
            "left=" +
            x +
            ", top=" +
            y +
            ", width=" +
            width +
            ", height=" +
            height +
            ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=no";
        var win = window.open(strURL, "win_ChunjaeMedia", strFeature);

        win.focus();
        return;
    }

    function linkHtml(src) {
        window.open(src, "_blank", "width=1170, height=768, resizable=yes");
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
        // setTimeout(function () {
        //     title.classList.add("flowAni");
        // }, 1);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        // title.classList.remove("flowAni");
    };

    return exporter;
};

var createLink = function (spec) {
    var exporter = _.extend(baseModule());
    var button;
    var src;

    var type; // player = 천재 미디어 실행, open = window.open url, html = window.open html

    exporter.name = spec.moduleName;

    init();

    function init() {
        button = spec.button;
        src = button.dataset.src;
        type = button.dataset.type;

        exporter.addOverEvent(button);
        button.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        audioManager.play("click");
        if (type === "player") {
            viewChunjaeMedia(src);
        } else if (type === "open") {
            videoPageOpen(src);
        } else if (type === "html") {
            linkHtml(src);
        }
    }

    // 천재 미디어 실행용
    // viewChunjaeMedia('M201901057_800K.mp4'); // 천재에서 제공하는 영상파일명 800K
    function viewChunjaeMedia(mID) {
        var strURL, strFeature;
        var width, height;
        var x, y;

        width = 855;
        height = 560;
        x = (screen.width - width) / 2;
        y = (screen.height - height) / 2;

        if (mID.toLowerCase().indexOf("_800k.mp4") > -1 || mID.toLowerCase().indexOf("_300k.mp4") > -1) {
            // strURL = "http://e.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
            strURL = "http://m.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
        } else {
            // strURL = "http://e.tsherpa.co.kr/media/mediaframe1.aspx?fname=" + (mID.toLowerCase().indexOf("http://chunjae.gscdn.com") > -1 ? mID.replace("http://", "") : mID);
            strURL =
                "http://m.tsherpa.co.kr/media/mediaframe.aspx?fcode=" +
                (mID.toLowerCase().indexOf("http://chunjae.gscdn.com") > -1 ? mID.replace("http://", "") : mID);
        }
        //console.log(strURL);
        strFeature =
            "left=" +
            x +
            ", top=" +
            y +
            ", width=" +
            width +
            ", height=" +
            height +
            ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=no";
        var win = window.open(strURL, "win_ChunjaeMedia", strFeature);

        win.focus();
        return;
    }

    // 동영상 링크 직접 띄우기 window.open
    // var link = 'https://www.youtube.com/embed/njRsMxGO4_8';
    // videoPageOpen(link);
    function videoPageOpen(strURL) {
        var strFeature;
        var width, height;
        var x, y;

        width = 855;
        height = 560;
        x = (screen.width - width) / 2;
        y = (screen.height - height) / 2;

        strFeature =
            "left=" +
            x +
            ", top=" +
            y +
            ", width=" +
            width +
            ", height=" +
            height +
            ", menubar=no, status=no, location=no, toolbar=no, resizable=no, scrollbars=no";
        var win = window.open(strURL, "win_ChunjaeMedia", strFeature);

        win.focus();
        return;
    }

    function linkHtml(src) {
        var win = window.open(src, "_blank", "width=1170, height=768, resizable=yes");
        // var win = window.open(src, '_blank', 'width=1170, height=768, resizable=yes');
        // win.moveTo(0, 0);
        // win.resizeTo(window.screen.availWidth, window.screen.availHeight);
        // win.resizeTo(window.screen.width, window.screen.height);
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
    };

    return exporter;
};

// cut animation 컨텐츠
var createCutAnimation = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var centerPlayButton;
    var cutAniBox;
    var cuts;
    var poster;
    var sceneButtonBox;
    var sceneButtons;

    var cutTimes;

    var currentCut = -1;

    var audioPlayer;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        cutTimes = spec.cutTimes;

        cutAniBox = amt.get(".cut-ani-box", box);
        cuts = amt.getAll(".cut", cutAniBox);
        centerPlayButton = amt.get(".center-play-button", box);
        poster = amt.get(".img-poster", cutAniBox);
        sceneButtonBox = amt.get(".scene-button-box", box);
        sceneButtons = amt.getAll(".button", sceneButtonBox);

        for (var i = 0; i < sceneButtons.length; ++i) {
            exporter.addOverEvent(sceneButtons[i]);
        }

        audioPlayer = createAudioPlayer({
            moduleName: "AUDIO_PLAYER",
            box: amt.get(".audio-player", box),
            audioList: spec.audioList,
            callbacks: {
                play: function () {
                    centerPlayButton.classList.add("hide");
                },
                stop: function () {
                    resetCuts();
                    resetSceneButtons();
                    currentCut = -1;
                    centerPlayButton.classList.remove("hide");
                    // cuts[0].style.visibility = "inherit";
                    // poster.classList.remove("hide");
                    setPoster();
                },
                pause: function () {
                    centerPlayButton.classList.remove("hide");
                },
                loop: function (cTime) {
                    for (var i = 0; i < cutTimes.length; ++i) {
                        var time = cutTimes[i];
                        if (currentCut !== i && cTime >= time.start && cTime < time.end) {
                            // console.log((i+1)+"씬 시작");
                            currentCut = i;
                            resetCuts();
                            resetSceneButtons();
                            cuts[currentCut].style.visibility = "inherit";
                            if (sceneButtons[currentCut]) {
                                sceneButtons[currentCut].classList.add("on");
                            }
                            if (poster) {
                                poster.classList.add("hide");
                            }
                            break;
                        }
                    }
                },
            },
        });

        resetCuts();
        setPoster();

        exporter.addOverEvent(centerPlayButton);
        centerPlayButton.addEventListener(amt.mouseTouchEvent.click, hnClickCenter);
        if (sceneButtonBox) {
            sceneButtonBox.addEventListener(amt.mouseTouchEvent.click, hnClickScene);
        }
    }

    function hnClickScene(e) {
        var target = e.target;
        var index = sceneButtons.indexOf(target);
        if (index > -1) {
            resetSceneButtons();
            target.classList.add("on");
            audioPlayer.seek(cutTimes[index].start);
        }
    }

    function resetSceneButtons() {
        for (var i = 0; i < sceneButtons.length; ++i) {
            sceneButtons[i].classList.remove("on");
        }
    }

    function hnClickCenter(e) {
        audioPlayer.play();
    }

    function resetCuts() {
        for (var i = 0; i < cuts.length; ++i) {
            cuts[i].style.visibility = "hidden";
        }
    }

    function setPoster() {
        if (poster) {
            poster.classList.remove("hide");
        } else {
            cuts[0].style.visibility = "inherit";
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        audioPlayer.reset();
    };

    return exporter;
};

// 제재 학습 - 낱말 퐁당
var createJejaeWord = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var buttonBox;
    var buttons;
    var explains;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        buttonBox = amt.get(".word-box", box);
        buttons = amt.getAll(".word-button", buttonBox);
        explains = amt.getAll(".explain", box);

        setWord(0);

        exporter.addOverEvent(buttons);
        buttonBox.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        var target = e.target;
        var index = buttons.indexOf(target);
        if (index > -1) {
            audioManager.play("click");
            setWord(index);
        }
    }

    function setWord(index) {
        resetButtons();
        resetExplains();
        buttons[index].classList.add("on");
        explains[index].classList.remove("hide");
    }

    function resetButtons() {
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("on");
        }
    }

    function resetExplains() {
        for (var i = 0; i < explains.length; ++i) {
            explains[i].classList.add("hide");
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

// 제재 학습 - 쫑 퀴즈, 확인 문제
var createQuizHome = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var homeBox;
    var headerBox;
    var startButton;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        homeBox = amt.get(".home-box", box);
        headerBox = amt.get(".header", box);
        startButton = amt.get(".start-button", homeBox);

        exporter.addOverEvent(startButton);
        startButton.addEventListener(amt.mouseTouchEvent.click, hnClickStart);
    }

    function hnClickStart(e) {
        startButton.classList.add("on");
        audioManager.play("click");
        homeBox.classList.add("hide");
        // 확인 문제에서 홈 화면에선 헤더 안보이다가 문제 화면에서 헤더 보이게
        if (headerBox && headerBox.classList.contains("hide")) {
            headerBox.classList.remove("hide");
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

// 확인 문제 인트로
var createConfirmQuizHome = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var homeBox;
    var headerBox;
    var startButton;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        homeBox = amt.get(".gate_container", box);
        headerBox = amt.get(".header", box);
        startButton = amt.get(".start-button", homeBox);

        exporter.addOverEvent(startButton);
        startButton.addEventListener(amt.mouseTouchEvent.click, hnClickStart);
    }

    function hnClickStart(e) {
        startButton.classList.remove("over");
        startButton.classList.add("on");
        audioManager.play("click");
        homeBox.classList.add("hide");
        // 확인 문제에서 홈 화면에선 헤더 안보이다가 문제 화면에서 헤더 보이게
        if (headerBox && headerBox.classList.contains("hide")) {
            headerBox.classList.remove("hide");
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

// full popup
var createFullPopup = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var buttons;
    var buttonClose;

    var popupIndex;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        popupIndex = spec.popupIndex;

        buttons = [];
        var buttonNames = box.dataset.button.split(";");
        for (var i = 0; i < buttonNames.length; ++i) {
            var name = buttonNames[i];
            buttons[i] = amt.get(name);
            buttons[i].addEventListener(amt.mouseTouchEvent.click, hnClickButton);
        }
        buttonClose = amt.get(".popup-full > .button-close", box);

        exporter.addOverEvent(buttons);
        exporter.addOverEvent(buttonClose);
        buttonClose.addEventListener(amt.mouseTouchEvent.click, hnClickClose);

        close();
    }

    function hnClickButton(e) {
        audioManager.play("click");
        var target = e.currentTarget;
        target.classList.toggle("on");
        if (target.classList.contains("on")) {
            open();
        } else {
            close();
        }
    }

    function hnClickClose(e) {
        audioManager.play("click");
        close();
        amt.sendMessage(document, "DOC_EVENT", {
            message: "CLOSE_FULL_POPUP",
            popupIndex: popupIndex,
        });
    }

    function close() {
        showViewerNavi();
        box.classList.add("hide");
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("on");
        }
    }

    function open() {
        hideViewerNavi();
        box.classList.remove("hide");
    }

    // exporter.getIndex = function() {
    //     return popupIndex;
    // }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        close();
    };

    return exporter;
};

// mini popup
var createMiniPopup = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var buttons;
    var buttonClose;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;

        buttons = [];
        var buttonNames = box.dataset.button.split(";");
        for (var i = 0; i < buttonNames.length; ++i) {
            var name = buttonNames[i];
            buttons[i] = amt.get(name);
            buttons[i].addEventListener(amt.mouseTouchEvent.click, hnClickButton);
        }
        buttonClose = amt.get(".button-close", box);

        exporter.addOverEvent(buttons);
        exporter.addOverEvent(buttonClose);
        buttonClose.addEventListener(amt.mouseTouchEvent.click, hnClickClose);

        close();
    }

    function hnClickButton(e) {
        audioManager.play("click");
        var target = e.currentTarget;
        target.classList.toggle("on");
        if (target.classList.contains("on")) {
            // open();
            amt.sendMessage(document, "DOC_EVENT", {
                message: "RESET_MINI_POPUP",
                module: exporter,
                callback: open,
            });
        } else {
            close();
        }
    }

    function hnClickClose(e) {
        audioManager.play("click");
        close();
    }

    function close() {
        box.classList.add("hide");
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("on");
        }

        var tabBox = amt.get(".tab-box", box);
        if (tabBox) {
            amt.sendMessage(tabBox, "MODULE_EVENT", {
                message: "RESET_CONTENT_TAB",
            });
        }
    }

    function open() {
        box.classList.remove("hide");
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        box.classList.add("hide");
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("on");
        }
    };

    exporter.getHiddenText = function () {
        return amt.getAll(".hidden-text", box);
    };

    return exporter;
};

// pic popup
var createPicturePopup = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var buttons;
    var buttonClose;
    var boxFull;

    var tabModule;

    var type;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        boxFull = box.parentNode;

        if (box.dataset.type) {
            type = box.dataset.type;
        }

        buttons = [];
        var buttonNames = box.dataset.button.split(";");
        for (var i = 0; i < buttonNames.length; ++i) {
            var name = buttonNames[i];
            buttons[i] = amt.get(name);
            buttons[i].addEventListener(amt.mouseTouchEvent.click, hnClickButton);
        }
        buttonClose = amt.get(".button-close", box);

        tabModule = createContentTabs({
            moduleName: "CONTENT_TAB",
            box: box,
            // 팝업안 탭 모듈일 경우 content의 reset을 실행 하지 않게
            modeEvent: false,
        });

        exporter.addOverEvent(buttons);
        exporter.addOverEvent(buttonClose);
        buttonClose.addEventListener(amt.mouseTouchEvent.click, hnClickClose);

        close();
    }

    function hnClickButton(e) {
        audioManager.play("click");
        var target = e.currentTarget;
        var index = _.indexOf(buttons, target);
        open(index);

        // amt.sendMessage(document, "DOC_EVENT", {
        //     message: "ON_AFTER_RESET_PAGE",
        //     module: exporter,
        //     callback: (function (num) {
        //         var number = num;
        //         return function (numger) {
        //             open(number);
        //         };
        //     })(index)
        // });
    }

    function hnClickClose(e) {
        audioManager.play("click");
        close();
    }

    function close() {
        boxFull.classList.add("hide");
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("on");
        }
        tabModule.reset();
        if (type === "full") {
            showViewerNavi();
        }
    }

    function open(index) {
        boxFull.classList.remove("hide");
        tabModule.setTab(index);
        if (type === "full") {
            hideViewerNavi();
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        close();
    };

    return exporter;
};

var createJejaeQuiz = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var subContents;
    var subContent;
    var quizBoxes;
    var quizes = [];
    var pageQuizes = [];

    var index = 0;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        subContents = amt.getAll(".sub-content", box);
        createQuiz(index);

        document.addEventListener("DOC_EVENT", hnDocEvent);
        document.addEventListener("QUIZ_EVENT", hnQuizEvent);
    }

    function hnDocEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        switch (data.message) {
            case "SET_SUB_TAB":
                index = data.index;
                createQuiz(index);
                break;
        }
    }

    function hnQuizEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        // console.log("data :: ", data);
        switch (data.message) {
            case "CORRECT":
                break;
        }
    }

    function createQuiz(index) {
        subContent = subContents[index];
        quizBoxes = amt.getAll("[data-quiz]", subContent);

        if (quizes[index] !== undefined) {
            pageQuizes = quizes[index];
        } else {
            pageQuizes = [];
            for (var i = 0; i < quizBoxes.length; ++i) {
                var type = quizBoxes[i].dataset.quiz;
                var createQuiz = window[type];
                // box = 탭박스, quizBox = 퀴즈 div
                var quiz = createQuiz({
                    moduleName: type,
                    box: subContent,
                    quizBox: quizBoxes[i],
                });
                quiz.start();
                pageQuizes[i] = quiz;
            }
            quizes[index] = pageQuizes;
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        if (pageQuizes.length === 0) {
            var explanatory = amt.get(".explanatory", subContent);
            if (explanatory) {
                explanatory.classList.add("hide");
            }
            return;
        }

        console.log("reset :: ", exporter.name);
        for (var i = 0; i < pageQuizes.length; ++i) {
            pageQuizes[i].reset();
        }
    };

    return exporter;
};

var createConfirmQuiz = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var subContents;
    var subContent;
    var quizBoxes;
    var quizes = [];
    var pageQuizes = [];
    var buttonAnswer;

    var index = 0;
    var count = 0;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        subContents = amt.getAll(".sub-content", box);
        createQuiz(index);

        document.addEventListener("DOC_EVENT", hnDocEvent);
        document.addEventListener("QUIZ_EVENT", hnQuizEvent);
    }

    function hnDocEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        switch (data.message) {
            case "SET_SUB_TAB":
                index = data.index;
                createQuiz(index);
                break;
        }
    }

    function hnQuizEvent(e) {
        e.stopPropagation();
        var data = e.detail;
        // console.log("data :: ", data);
        switch (data.message) {
            case "CORRECT":
                ++count;
                console.log(count, pageQuizes.length);
                if (count === pageQuizes.length) {
                    buttonAnswer.classList.add("on");
                    setButtonAnsweOn();
                }
                break;
        }
    }

    function createQuiz(index) {
        subContent = subContents[index];
        quizBoxes = amt.getAll("[data-quiz]", subContent);

        if (quizes[index] !== undefined) {
            pageQuizes = quizes[index];
        } else {
            pageQuizes = [];
            for (var i = 0; i < quizBoxes.length; ++i) {
                var type = quizBoxes[i].dataset.quiz;
                var createQuiz = window[type];
                // box = 탭박스, quizBox = 퀴즈 div
                var quiz = createQuiz({
                    moduleName: type,
                    box: subContent,
                    quizBox: quizBoxes[i],
                });
                quiz.start();
                pageQuizes[i] = quiz;
            }
            quizes[index] = pageQuizes;
        }
        buttonAnswer = amt.get(".button-answer", subContent);
        exporter.addOverEvent(buttonAnswer);
        buttonAnswer.addEventListener(amt.mouseTouchEvent.click, hnClickAnswer);
    }

    function hnClickAnswer(e) {
        audioManager.play("click");
        var target = e.currentTarget;
        target.classList.toggle("on");
        if (target.classList.contains("on")) {
            setButtonAnsweOn();
            showAnswer();
        } else {
            // setButtonAnsweOff();
            // hideAnswer();
            exporter.reset();
        }
    }

    function setButtonAnsweOn() {
        var text = amt.get(".text", buttonAnswer);
        text.innerHTML = "정답 가리기";
    }

    function setButtonAnsweOff() {
        var text = amt.get(".text", buttonAnswer);
        text.innerHTML = "정답 확인";
    }

    function showAnswer() {
        for (var i = 0; i < pageQuizes.length; ++i) {
            pageQuizes[i].showAnswer();
        }
    }

    function hideAnswer() {
        for (var i = 0; i < pageQuizes.length; ++i) {
            pageQuizes[i].hideAnswer();
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        if (pageQuizes.length === 0) return;
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < pageQuizes.length; ++i) {
            pageQuizes[i].reset();
        }
        buttonAnswer.classList.remove("on");
        setButtonAnsweOff();
        count = 0;
    };

    return exporter;
};

var createSelfCheck = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var checkBoxes;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        checkBoxes = amt.getAll(".check-box", box);

        for (var i = 0; i < checkBoxes.length; ++i) {
            var checkBox = checkBoxes[i];
            checkBox.addEventListener(amt.mouseTouchEvent.click, hnClickBox);
            exporter.addOverEvent(checkBox.children);
        }
    }

    function hnClickBox(e) {
        var checkBox = e.currentTarget;
        var target = e.target;
        var index = _.indexOf(checkBox.children, target);
        if (index > -1) {
            resetCheck(checkBox);
            target.classList.add("on");
            audioManager.play("click");
        }
    }

    function resetCheck(checkBox) {
        var childs = checkBox.children;
        for (var i = 0; i < childs.length; ++i) {
            childs[i].classList.remove("on");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < checkBoxes.length; ++i) {
            var checkBox = checkBoxes[i];
            resetCheck(checkBox);
        }
    };

    return exporter;
};

var createDownload = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var button;

    var src;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        button = spec.button;
        src = button.dataset.src;

        exporter.addOverEvent(button);
        button.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        window.location = src;
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
    };

    return exporter;
};

var createSimpleAudio = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var button;

    var src;
    var audioId;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        button = spec.button;
        src = button.dataset.src;

        if (button.dataset.audioId) {
            audioId = button.dataset.audioId;
        } else {
            var strs = src.split("/");
            audioId = strs[strs.length - 1].split(".")[0];
        }

        audioManager.add(audioId, src, {
            ended: complete,
            pause: complete,
        });

        exporter.addOverEvent(button);
        button.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        if (button.classList.contains("on")) {
            stop();
        } else {
            play();
        }
    }

    function play() {
        button.classList.add("on");
        audioManager.stopAll();
        audioManager.play(audioId);
    }

    function stop() {
        button.classList.remove("on");
        audioManager.stop(audioId);
    }

    function complete() {
        button.classList.remove("on");
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        stop();
    };

    return exporter;
};

var createContentVideo = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var video;
    var button;
    var buttonImage;

    var enableReset = true;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        video = amt.get("video", box);
        button = amt.get(".button-play", box);
        buttonImage = amt.get(".image", button);

        if (box.dataset.reset) {
            if (box.dataset.reset === "false") {
                enableReset = false;
            }
        }

        exporter.addOverEvent(button);
        button.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
        video.addEventListener("play", videoPlayed);
        video.addEventListener("pause", videoPaused);
        video.addEventListener("ended", videoEnded);
        // video.addEventListener("loadedmetadata", videoMetaData);
    }

    // function videoMetaData(e) {
    // }

    function videoPlayed(e) {
        buttonImage.classList.add("hide");
    }

    function videoPaused(e) {
        buttonImage.classList.remove("hide");
    }

    function videoEnded(e) {
        stop();
    }

    function hnClickButton(e) {
        // audioManager.play("click");
        // console.log("content video paused :: ", video.paused);
        if (video.paused) {
            if (enableReset) {
                amt.sendMessage(document, "DOC_EVENT", {
                    message: "RESET_CONTENTS",
                    callback: play,
                });
            } else {
                play();
            }
        } else {
            stop();
        }
    }

    function play() {
        video.play();
    }

    function stop() {
        if (video.readyState > 0) {
            video.pause();
            video.currentTime = 0;
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        stop();
    };

    return exporter;
};

var createToggleButton = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var buttons;

    var modeEvent = true;

    exporter.name = spec.moduleName;

    init();

    function init() {
        box = spec.box;
        buttons = amt.getAll(".button", box);

        if (box.classList.contains("js-ignore-reset")) {
            modeEvent = false;
        }

        for (var i = 0; i < buttons.length; ++i) {
            for (var j = 0; j < buttons[i].children.length; ++j) {
                buttons[i].children[j].style.pointerEvents = "none";
            }
        }

        exporter.addOverEvent(buttons);
        box.addEventListener(amt.mouseTouchEvent.click, hnClickButton);
    }

    function hnClickButton(e) {
        var target = e.target;
        var index = _.indexOf(buttons, target);
        if (index > -1) {
            audioManager.play("click");
            target.classList.toggle("on");
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        if (!modeEvent) return;
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < buttons.length; ++i) {
            buttons[i].classList.remove("on");
            buttons[i].classList.remove("over");
        }
    };

    return exporter;
};

var createInputControl = function (spec) {
    var exporter = _.extend(baseModule());
    var inputs;

    exporter.name = spec.moduleName;

    init();

    function init() {
        inputs = spec.inputs;
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < inputs.length; ++i) {
            inputs[i].value = "";
        }
    };

    return exporter;
};

var contentQuiz = (function () {
    var exporter = _.extend(baseModule());
    var mainBox;
    var quizBoxes;

    var quizes = [];

    exporter.name = "CONTENT_QUIZ";

    init();

    function init() {
        mainBox = amt.get(".main");
        var cornerName = mainBox.dataset.content;
        if (cornerName === "confirm-quiz" || cornerName === "jejae-quiz") {
            return;
        }

        quizBoxes = amt.getAll("[data-quiz]", mainBox);

        for (var i = 0; i < quizBoxes.length; ++i) {
            var quizBox = quizBoxes[i];
            var type = quizBox.dataset.quiz;
            var createQuiz = window[type];
            var quiz = createQuiz({
                moduleName: type,
                box: quizBox.parentNode,
                quizBox: quizBox,
            });
            quiz.start();
            quizes[i] = quiz;
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < quizes.length; ++i) {
            var quiz = quizes[i];
            quiz.reset();
        }
    };

    return exporter;
})();

var contentPopupQuiz = (function () {
    var exporter = _.extend(baseModule());
    var mainBox;
    var quizBoxes;

    var quizes = [];

    exporter.name = "CONTENT_QUIZ";

    init();

    function init() {
        mainBox = amt.get(".popup-full");
        if (document.querySelector('.popup-full') != null) {
            quizBoxes = amt.getAll("[data-quiz]", mainBox);

            for (var i = 0; i < quizBoxes.length; ++i) {
                var quizBox = quizBoxes[i];
                var type = quizBox.dataset.quiz;
                var createQuiz = window[type];
                var quiz = createQuiz({
                    moduleName: type,
                    box: quizBox.parentNode,
                    quizBox: quizBox,
                });
                quiz.start();
                quizes[i] = quiz;
            }
        }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    };

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        for (var i = 0; i < quizes.length; ++i) {
            var quiz = quizes[i];
            quiz.reset();
        }
    };

    return exporter;
})();
