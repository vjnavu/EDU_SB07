var wrapScale;

$(function () {

    setTimeout(function () {
        wrapScale = ($("#wrap").css("transform") == "none") ? 1 : $("#wrap").css("transform").split(",")[0].split("(")[1];
    }, 500);

})



var createAudioPlayer = function (spec) {
    var box = document.querySelector(".audio-player");

    var playButton;
    var stopButton;
    var muteButton;
    var pauseButton;
    var progressBar;
    var timeDisplay;
    var currentTime;
    var durationTime;
    // 추가
    var mode = 0;
    var audioPlayer;
    var songButtonBox;
    var textBox;
    var texts;
    var textTimes;
    // exporter.name = spec.moduleName;
    var inTextTime = false;

    var progress;

    var loopID;

    var audio = new Audio;
    var audioList;

    var callbacks = {};

    var template = '\
        <div class="controller">\
            <div class="play-button"></div>\
            <div class="pause-button"></div>\
            <div class="stop-button"></div>\
            <div class="mute-button"></div>\
            <div class="volumeGauge">\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
                <span></span>\
            </div>\
            <div class="progress-bar">\
                <div class="background">\
                    <div class="played"></div>\
                </div>\
                <div class="bar"></div>\
            </div>\
            <div class="time-display">\
                <div class="current-time"></div>\
                <div class="duration-time"></div>\
            </div>\
            <div class="playSpeedArea">\
                <div class="currentSpeed">1.0X</div>\
                <ul class="speedSelector">\
                    <li data-value="2.0">2.0X</li>\
                    <li data-value="1.5">1.5X</li>\
                    <li data-value="1.2">1.2X</li>\
                    <li data-value="1" class="on">1.0X</li>\
                    <li data-value="0.7">0.7X</li>\
                </ul>\
            </div>\
        </div>\
    ';


    init();

    function init() {

        box.innerHTML = template;

        if (spec.hasOwnProperty("callbacks")) {
            // callbacks = spec.callbacks;
            for (var attr in spec.callbacks) {
                callbacks[attr] = spec.callbacks[attr];
            }
        }

        // audioList = box.dataset.list.split(",");
        audioList = spec.audioList;
        // console.log("list :: ", audioList);
        audio.src = audioList[0];

        playButton = document.querySelector(".play-button");
        stopButton = document.querySelector(".stop-button");
        muteButton = document.querySelector(".mute-button");
        pauseButton = document.querySelector(".pause-button");
        progressBar = document.querySelector(".progress-bar");
        timeDisplay = document.querySelector(".time-display");
        currentTime = document.querySelector(".current-time");
        durationTime = document.querySelector(".duration-time");
        // 추가
        songButtonBox = document.querySelector(".song-button-box", box);
        songButtons = document.querySelectorAll(".button", songButtonBox);
        textBox = document.querySelector(".text-box", box);
        texts = document.querySelectorAll(".text", textBox);

        if (songButtons[mode]) {
            songButtons[mode].classList.add("on");

            for (var i = 0; i < songButtons.length; ++i) {

            }
        }


        pauseButton.style.display = "none";

        currentTime.innerHTML = "00:00";
        durationTime.innerHTML = "00:00";

        progress = createProgressBar({
            box: document.querySelector(".progress-bar")
        });

        box.addEventListener(mouseTouchEvent.click, hnClick);
        box.addEventListener(mouseTouchEvent.over, hnOver);
        box.addEventListener(mouseTouchEvent.out, hnOut);

        audio.addEventListener("play", audioPlayed);
        audio.addEventListener("pause", audioPaused);
        audio.addEventListener("ended", audioEnded);
        // audio.addEventListener("seeked", videoSeeked);
        // audio.addEventListener("timeupdate", videoTimeUpdate);
        audio.addEventListener("loadedmetadata", audioMetaData);

        progressBar.addEventListener("SCROLL_BAR", hnProgress);


        /*재생속도*/
        $(".audio-player .playSpeedArea .currentSpeed").on("click", function () {
            if ($(".audio-player .playSpeedArea").hasClass("on") == true) {
                $(".audio-player .playSpeedArea").removeClass("on");
            } else {
                $(".audio-player .playSpeedArea").addClass("on");
            }
        });

        $(".audio-player .playSpeedArea .speedSelector > li").on("click", function () {
            $(".audio-player .playSpeedArea .speedSelector > li").removeClass("on");
            $(this).addClass("on");

            audio.playbackRate = $(this).attr("data-value");

            $(".audio-player .playSpeedArea .currentSpeed").text($(this).text());
            $(".audio-player .playSpeedArea").removeClass("on");
        });


        /*볼륨게이지*/
        setVolumeGauge();

        /*초기 볼륨*/
        setVideoVolume(0.5, true);


        if (spec.sceneTimes) {
            $(".scene-button-box .button").on("click", function () {
                var idx = $(this).index();
                audio.currentTime = spec.sceneTimes[idx].start;
                updateControl();
            });
        }
        // textTimes = spec.textTimes;
        // if(spec.textTimes){
        //     $('.play-button').on("click", function(){
        //         var idx = $(texts).index();
        //         audio.currentTime = spec.textTimes[idx].start;
        //         updateControl();
        //     });
        // }

        $(songButtons).on('click', function () {
            var index = $(this).index();

            if (!$(this).hasClass("on")) {

                resetSongButtons();
                $(this).addClass("on");
                mode = index;
                changeAudio(mode);

            }
        });


    }

    function hnProgress(e) {
        if (audio.readyState === 0) return;
        if (e.detail.percent === 1) {
            stop();
            return;
        }
        var time = audio.duration * e.detail.percent;
        //console.log(e.detail)
        audio.currentTime = time;
    }

    function audioMetaData(e) {
        updateCurrentTime(0);
    }

    function audioPlayed(e) {
        playButton.style.display = "none";
        pauseButton.style.display = "";
        loop();

    }

    function audioPaused(e) {
        playButton.style.display = "";
        pauseButton.style.display = "none";
        cancelAnimationFrame(loopID);

    }

    function audioEnded(e) {
        stop();

    }

    function audioSeeked(e) { }

    function audioTimeUpdate(e) { }

    function loop() {
        loopID = requestAnimationFrame(loop);
        updateControl();
    }

    function updateControl() {
        var duration = audio.duration;
        var current = audio.currentTime;
        progress.setPercent(current / duration);
        updateCurrentTime(audio.currentTime);
        if (callbacks.loop) {
            callbacks.loop(current);
        }
    }

    // function changeAudio(index) {
    //     if(index < 0 || index >= audioList.length) return;
    //     stop();
    //     setTimeout(function() {
    //         audio.src = audioList[index];
    //     }, 1);
    // }



    /*
    * ************************************************ 볼륨게이지 설정 ************************************************
    * */
    function setVolumeGauge() {
        var isDonw = false;

        /*볼륨게이지 마우스 업, 다운, 오버*/
        $(".audio-player .volumeGauge").on("mousedown", function () {
            isDonw = true;
        });

        $("body").on("mouseup", function () {
            isDonw = false;
        });

        $(".audio-player .volumeGauge span").on("mouseover", function () {
            if (isDonw == true) {
                var volumeCnt = $(this).index() + 1;
                $(".audio-player .volumeGauge span").removeClass("on");
                for (var i = 1; i <= volumeCnt; i++) {
                    $(".audio-player .volumeGauge span").eq(i - 1).addClass("on");
                }

                setVideoVolume(volumeCnt / 10);
            }
        });

        $(".audio-player .volumeGauge span").on("click", function () {
            var volumeCnt = $(this).index() + 1;
            $(".audio-player .volumeGauge span").removeClass("on");
            for (var i = 1; i <= volumeCnt; i++) {
                $(".audio-player .volumeGauge span").eq(i - 1).addClass("on");
            }

            setVideoVolume(volumeCnt / 10);
        });

    }


    function setVideoVolume(_volume, _markVolumeGauge = false) {
        audio.volume = _volume;

        if (_markVolumeGauge == true) {
            $(".audio-player .volumeGauge span").removeClass("on");
            for (var i = 1; i <= _volume * 10; i++) {
                $(".audio-player .volumeGauge span").eq(i - 1).addClass("on");
            }
        }
    }






    function updateCurrentTime(time) {



        // box.innerHTML = template;
        //
        // textBox = document.querySelector(".text-box", box);
        // texts = document.querySelector(".text", textBox);

        var duration = audio.duration;
        if (isNaN(duration)) {
            duration = 0;
        }
        var curmins = Math.floor(time / 60);
        var cursecs = Math.floor(time - curmins * 60);
        var durmins = Math.floor(duration / 60);
        var dursecs = Math.floor(duration - durmins * 60);
        if (cursecs < 10) {
            cursecs = "0" + cursecs;
        }
        if (dursecs < 10) {
            dursecs = "0" + dursecs;
        }
        if (curmins < 10) {
            curmins = "0" + curmins;
        }
        if (durmins < 10) {
            durmins = "0" + durmins;
        }
        currentTime.innerHTML = curmins + ":" + cursecs;
        durationTime.innerHTML = durmins + ":" + dursecs;


        /*
        * *** sceneTimes 이 있는 경우 씬 설정
        * */
        var sceneNum = 1;
        if (spec.sceneTimes) {
            for (var i = 1; i <= spec.sceneTimes.length; i++) {
                if (time >= spec.sceneTimes[i - 1].start && time <= spec.sceneTimes[i - 1].end) {
                    sceneNum = i;
                }
            }
        }

        $(".content .text-box .group").hide();
        $(".content .text-box .group").eq(sceneNum - 1).css("display", "flex");

        $(".scene-button-box .button").removeClass("on");
        $(".scene-button-box .button").eq(sceneNum - 1).addClass("on");


        /*
          * *** textTime 글자강조효과
      * */
        var currentText = -1;

        if (spec.textTimes === undefined) return;

        for (var i = 0; i < spec.textTimes.length; i++) {
            var timeSpec = spec.textTimes[i];

            if (currentText !== i && time >= timeSpec.start && time < timeSpec.end) {
                // console.log((i + 1) + " 텍스트 on");
                currentText = i;
                resetTexts();
                texts[currentText].classList.add("on");
                inTextTime = true;
                break;
            }
        }
        // console.log(currentText)
        if (inTextTime && currentText > -1) {
            if (time < spec.textTimes[currentText].start || time > spec.textTimes[currentText].end) {
                // console.log((currentText + 1) + " 텍스트 off");
                resetTexts();
                currentText = -1;
                inTextTime = false;
            }
        }


        // songButtonBox.addEventListener(box.mouseTouchEvent.click, hnClickSong);


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



    function hnClick(e) {
        var target = e.target;
        // console.log(target);
        switch (target) {
            case playButton:
                play();
                break;
            case pauseButton:
                pause();
                break;
            case stopButton:
                stop();
                break;
            case muteButton:
                if (target.classList.contains("on")) {
                    unmute();
                } else {
                    mute();
                }
                target.classList.toggle("on");
                break;
        }
    }

    function hnOver(e) {
        var target = e.target;
        switch (target) {
            case playButton:
            case pauseButton:
            case stopButton:
            case muteButton:
                target.classList.add("over");
                break;
        }
    }

    function hnOut(e) {
        var target = e.target;
        switch (target) {
            case playButton:
            case pauseButton:
            case stopButton:
            case muteButton:
                target.classList.remove("over");
                break;
        }
    }

    function play() {
        audio.play();

        if (callbacks.play) {
            callbacks.play();
        }
    }

    function pause() {
        audio.pause();

        if (callbacks.pause) {
            callbacks.pause();
        }
    }

    function stop() {
        if (audio.readyState > 0) {
            audio.pause();
            audio.currentTime = 0;
        }
        progress.resetScroll();
        updateCurrentTime(0);

        if (callbacks.stop) {
            callbacks.stop();
        }
    }

    function mute() {
        audio.muted = true;
    }

    function unmute() {
        audio.muted = false;
    }

    function resetTexts() {
        for (var i = 0; i < texts.length; ++i) {
            texts[i].classList.remove("on");
        }
    }

    function start() {
        //console.log("start :: ", exporter.name);
    }

    function reset() {
        //console.log("reset :: ", exporter.name);
        stop();
    }


    function seek(seconds) {
        audio.currentTime = seconds;
        updateControl();
    };

    function changeAudio(index) {
        if (index < 0 || index >= audioList.length) return;
        stop();
        setTimeout(function () {
            audio.src = audioList[index];
        }, 1);
    }

};



var isTouchSupported = function () {
    return "ontouchstart" in window || navigator.maxTouchPoints;
    return "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
};

var mouseTouchEvent = false
    ? {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
        over: "touchstart",
        out: "touchend",
        click: "touchend"
    }
    : {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
        over: "mouseover",
        out: "mouseout",
        click: "click"
    };



var createProgressBar = function (spec) {
    var doc = document;
    var box;
    var bar;
    var played;

    var rootRect;
    var barRect;

    var scale = wrapScale;

    var scrolling = false;

    init();

    function init() {
        if (typeof spec.box === "string") {
            box = doc.querySelector(spec.box);
        } else {
            box = spec.box;
        }
        bar = box.querySelector(".bar");
        played = box.querySelector(".played");

        // 리사이징 되기 전 원래 사이즈와 좌표로 스크롤 바가 제작 되었는데
        // 리사이징 된 후에 스크롤바가 생성되는 경우 좌표와 크기가 오류남
        // getBoundingClientRect는 리사이징이 반영된 값을 리턴함
        // 그래서 원래 사이즈와 좌표를 리턴하는 offset값으로 수정
        //

        // rootRect = box.getBoundingClientRect();
        rootRect = {
            left: box.offsetLeft,
            top: box.offsetTop,
            width: box.offsetWidth,
            height: box.offsetHeight
        };
        console.log("root box :: ", rootRect);
        console.log("root box :: ", box.offsetWidth);
        if (bar) {
            // barRect = bar.getBoundingClientRect();
            barRect = {
                left: bar.offsetLeft,
                top: bar.offsetTop,
                width: bar.offsetWidth,
                height: bar.offsetHeight
            }
        }

        // 중간에 생성되는 경우 resize 이벤트를 받지 못함
        //scale = globalScale;

        box.addEventListener(mouseTouchEvent.down, scrollHandler);
        doc.addEventListener(mouseTouchEvent.move, scrollHandler);
        doc.addEventListener(mouseTouchEvent.up, scrollHandler);
    }

    function scrollHandler(e) {
        e.stopPropagation();
        e.preventDefault();
        var point;
        // console.log("type :: ", e.type);
        if (e.type === "mousedown" || e.type === "touchstart") {
            scrolling = true;
            point = getCoordinate(e);
            setPosition(point);
        }

        if (e.type === "mousemove" || e.type === "touchmove") {
            if (!scrolling) return;
            point = getCoordinate(e);
            setPosition(point);
        }

        if (e.type === "mouseup" || e.type === "touchend") {
            if (!scrolling) return;
            scrolling = false;
        }
    }

    function setPosition(point) {
        var barX;
        var playedX;
        if (point[0] < 0) {
            barX = 0;
            playedX = 0;
            scrolling = false;
        } else if (point[0] > getRootW()) {
            barX = getRootW() - getBarW();
            playedX = getRootW() - getBarW() / 2;
            scrolling = false;
        } else {
            barX = point[0] - getBarW() / 2;
            playedX = point[0];
        }

        if (bar) {
            // 크롬에서 스케일 리사이즈시 element가 보이지 않는 문제 때문에 z값 0으로 설정해야함
            bar.style.transform = "translate3d(" + barX / wrapScale + "px, 0, 0)";
            console.log(wrapScale)
        }
        played.style.width = playedX / wrapScale + "px";

        var p = point[0] / getRootW();
        if (p < 0) p = 0;
        else if (p > 1) p = 1;

        var customEvent = new CustomEvent("SCROLL_BAR", {
            detail: { percent: p }
        });
        box.dispatchEvent(customEvent);
    }

    function setPercent(p) {
        if (p < 0 || p > 1 || scrolling) return;
        var total = getRootW();
        var x = total * p / wrapScale;
        played.style.width = x + "px";
        if (bar) {
            // 크롬에서 스케일 리사이즈시 element가 보이지 않는 문제 때문에 z값 0으로 설정해야함
            bar.style.transform = "translate3d(" + (x - getBarW() / 2) + "px, 0, 0)";
        }
    }

    function getBarW() {
        return bar ? barRect.width * wrapScale : 0;
    }

    function getRootW() {
        return rootRect.width * wrapScale;
    }

    function getCoordinate(e) {
        var clientX = typeof e.clientX === "number" ? e.clientX : e.changedTouches[0].clientX;
        var clientY = typeof e.clientY === "number" ? e.clientY : e.changedTouches[0].clientY;
        // var target = e.target || document.elementFromPoint(clientX, clientY);

        var wrap = doc.querySelector("#wrap");
        var wrapRect = wrap.getBoundingClientRect();
        var offsetX = clientX - wrapRect.left - rootRect.left * wrapScale;
        var offsetY = clientY - wrapRect.top - rootRect.top * wrapScale;
        // var offsetX = clientX - rootRect.left * scale;
        // var offsetY = clientY - rootRect.top * scale;

        return [offsetX, offsetY];
    }

    /*broadcaster.on("RESIZE_WINDOW", function () {
        scale = arguments[0].windowRatio;
    });*/

    var instance = {
        setPercent: setPercent,
        resetScroll: function () {
            scrolling = false;
            setPercent(0);
        }
    };
    return instance;
};


