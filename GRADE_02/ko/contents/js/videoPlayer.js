var createVideoPlayer = function (spec) {
    var exporter = _.extend(baseModule());
    var box;
    var controller;
    var playButton;
    var stopButton;
    var muteButton;
    var pauseButton;
    var progressBar;
    var timeDisplay;
    var currentTime;
    var durationTime;
    var closeButton;

    var progress;

    var loopID;

    var mode = "popup"; // mode는 base or popup

    var video;

    var callbacks = {};

    var template = '\
        <div class="controller">\
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
            <div class="play-button"></div>\
            <div class="pause-button"></div>\
            <div class="stop-button"></div>\
            <div class="mute-button"></div>\
        </div>\
    ';

    exporter.name = spec.moduleName;

    init();

    function init() {
        if (typeof spec.box === 'string') {
            box = amt.get(spec.box);
        } else {
            box = spec.box;
        }
        box.innerHTML = template;

        if (spec.hasOwnProperty("callbacks")) {
            // callbacks = spec.callbacks;
            for (var attr in spec.callbacks) {
                callbacks[attr] = spec.callbacks[attr];
            }
        }

        if (spec.hasOwnProperty("mode")) {
            mode = spec.mode;
        }

        var doc = document;
        video = doc.createElement("video");
        video.style.top = spec.videoTopPosition;
        var source = doc.createElement("source");
        source.src = spec.src;
        source.type = "video/mp4";
        video.appendChild(source);
        box.insertBefore(video, box.firstChild);

        closeButton = doc.createElement("div");
        closeButton.classList.add("close-button");
        box.appendChild(closeButton);
        if (mode === "base") {
            closeButton.classList.add("hide");
        }

        controller = amt.get(".controller", box);
        playButton = amt.get(".play-button", box);
        stopButton = amt.get(".stop-button", box);
        muteButton = amt.get(".mute-button", box);
        pauseButton = amt.get(".pause-button", box);
        progressBar = amt.get(".progress-bar", box);
        timeDisplay = amt.get(".time-display", box);
        currentTime = amt.get(".current-time", timeDisplay);
        durationTime = amt.get(".duration-time", timeDisplay);

        pauseButton.style.display = "none";

        currentTime.innerHTML = "00:00";
        durationTime.innerHTML = "00:00";

        progress = createProgressBar({
            box: ".progress-bar"
        });

        box.addEventListener(amt.mouseTouchEvent.click, hnClick);
        box.addEventListener(amt.mouseTouchEvent.over, hnOver);
        box.addEventListener(amt.mouseTouchEvent.out, hnOut);

        video.addEventListener("play", videoPlayed);
        video.addEventListener("pause", videoPaused);
        video.addEventListener("ended", videoEnded);
        // video.addEventListener("seeked", videoSeeked);
        // video.addEventListener("timeupdate", videoTimeUpdate);
        video.addEventListener("loadedmetadata", videoMetaData);

        progressBar.addEventListener("SCROLL_BAR", hnProgress);

        audioManager.add("startAni", "../ko/audio/mute.mp3", {
            ended: startAudioEnded
        });
    }

    function hnProgress(e) {
        if (video.readyState === 0) return;
        if (e.detail.percent === 1) {
            stop();
            return;
        }
        var time = video.duration * e.detail.percent;
        video.currentTime = time;
    }

    function videoMetaData(e) {
        updateCurrentTime(0);
    }

    function videoPlayed(e) {
        playButton.style.display = "none";
        pauseButton.style.display = "";
        loop();
    }

    function videoPaused(e) {
        playButton.style.display = "";
        pauseButton.style.display = "none";
        cancelAnimationFrame(loopID);
    }

    function videoEnded(e) {
        stop();
    }

    function videoSeeked(e) {
    }

    function videoTimeUpdate(e) {
    }

    function loop() {
        loopID = requestAnimationFrame(loop);
        updateControl();
    }

    function updateControl() {
        var duration = video.duration;
        var current = video.currentTime;
        progress.setPercent(current / duration);
        updateCurrentTime(video.currentTime);
        if (callbacks.loop) {
            callbacks.loop(current);
        }
    }

    var timer_tit;
    function updateCurrentTime(time) {
        console.log(time);
        var duration = video.duration;
        if (isNaN(duration)) {
            duration = 0;
        }

        var videoTitlBox = document.getElementsByClassName('video-title-box');
        console.log(videoTitlBox);
        clearTimeout(timer_tit);
        timer_tit = setTimeout(function(){
            if (time === 0) {
                videoTitlBox[0].classList.remove('hide');
            } else {
                videoTitlBox[0].classList.add('hide');
            }
        },100);
        
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
                break;
            case closeButton:
                close();
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
            case closeButton:
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
            case closeButton:
                target.classList.remove("over");
                break;
        }
    }

    function startAudioEnded() {
        video.play();
        if (callbacks.play) {
            callbacks.play();
        }
    }

    function play() {
        // video.play();
        // if (callbacks.play) {
        //     callbacks.play();
        // }
        if (video.readyState > 0 && parseInt(video.currentTime) === 0) {
             audioManager.play("startAni");
        } else {
            video.play();
            if (callbacks.play) {
                callbacks.play();
            }
        }
    }

    function pause() {
        video.pause();
        if (callbacks.pause) {
            callbacks.pause();
        }
    }

    function stop() {
        if (video.readyState > 0) {
            video.pause();
            video.currentTime = 0;
        }
        progress.resetScroll();
        updateCurrentTime(0);
        if (callbacks.stop) {
            callbacks.stop();
        }
    }

    function mute() {
        video.muted = true;
        muteButton.classList.add("on");
    }

    function unmute() {
        video.muted = false;
        muteButton.classList.remove("on");
    }

    function close() {
        audioManager.stopAll();
        stop();
        box.classList.remove("on");
        box.classList.add("hide");
        showViewerNavi();
        amt.sendMessage(box, "VIDEO_PLAYER_EVENT", {
            message: "VIDEO_PLAYER_CLOSED"
        })
    }

    exporter.open = function (autoplay) {
        box.classList.add("on");
        box.classList.remove("hide");
        if (autoplay) {
            play();
        }
        hideViewerNavi();
        // setTimeout(function() {
        //     audioManager.play("startAni");
        // }, 10);
    }

    exporter.play = function () {
        play();
    }

    exporter.stop = function () {
        stop();
    }

    exporter.seek = function (seconds) {
        video.currentTime = seconds;
        updateControl();
    };

    exporter.showControl = function () {
        controller.classList.remove("hide");
        // if(mode === "popup") {
        //     closeButton.classList.remove("hide");
        // }
    }

    exporter.hideControl = function () {
        controller.classList.add("hide");
        // if(mode === "popup") {
        //     closeButton.classList.add("hide");
        // }
    }

    exporter.start = function () {
        console.log("start :: ", exporter.name);
    }

    exporter.reset = function () {
        console.log("reset :: ", exporter.name);
        stop();
        unmute();
    }

    return exporter;
};
