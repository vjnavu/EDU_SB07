var canvasAnimation = function (spec) {
    'use strict';

    var doc = document;
    var canvas;
    var context;
    var image;
    var data;

    var now;
    var then;
    var loopId;
    var elapsed;
    var startTime;
    var fpsInterval;
    var currentFrame;

    var fps = 30;
    var enableLoop = false;
    var returnFirst = false;
    var autoPlay = true;
    var usePoster = false;


    if (spec.hasOwnProperty('autoPlay')) {
        autoPlay = spec.autoPlay;
    }

    if (spec.hasOwnProperty('loop')) {
        enableLoop = spec.loop;
    }

    if (spec.hasOwnProperty('usePoster')) {
        usePoster = spec.usePoster;
    }

    if (typeof spec.canvas === 'string') {
        canvas = doc.querySelector(spec.canvas);
    } else {
        canvas = spec.canvas;
    }
    context = canvas.getContext('2d');

    // var json = JSON.parse(spec.data);
    var json = spec.data;
    data = Object.keys(json.frames).map(function (value) {
        return json.frames[value];
    });

    image = new Image();
    image.src = spec.imageSrc;
    image.addEventListener('load', loadImageCompleted);

    if (spec.hasOwnProperty('fps')) {
        fps = spec.fps;
    }

    function loadImageCompleted() {
        canvas.width = data[0].sourceSize.w;
        canvas.height = data[0].sourceSize.h;
        if (usePoster) {
            render(0);
        }
        if (autoPlay) {
            playAnimation();
        }
        if (spec.hasOwnProperty('readyFunc')) {
            spec.readyFunc();
        }
    }

    function render(index) {
        var sx = data[index].frame.x;
        var sy = data[index].frame.y;
        var sw = data[index].frame.w;
        var sh = data[index].frame.h;
        var dx = data[index].spriteSourceSize.x;
        var dy = data[index].spriteSourceSize.y;
        var dw = data[index].spriteSourceSize.w;
        var dh = data[index].spriteSourceSize.h;
        context.clearRect(dx, dy, dw, dh);
        // console.log(sx, sy, sw, sh, dx, dy, dw, dh);
        context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    function loop() {
        loopId = requestAnimationFrame(loop);
        now = performance.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            if (currentFrame < data.length) {
                render(currentFrame);
                ++currentFrame;
            } else {
                if (enableLoop) {
                    currentFrame = 0;
                } else {
                    cancelAnimationFrame(loopId);
                    if (returnFirst) {
                        currentFrame = 0;
                        render(currentFrame);
                    }
                    if (spec.hasOwnProperty('endFunc')) {
                        spec.endFunc();
                    }
                    canvas.classList.remove('start');
                    canvas.classList.add('end');
                    var customEvent = new CustomEvent("CANVAS_ANIMATION_ENDED");
                    canvas.dispatchEvent(customEvent);
                }
            }
        }
    }

    function playAnimation() {
        cancelAnimationFrame(loopId);
        currentFrame = 0;
        render(currentFrame);
        fpsInterval = 1000 / fps;
        then = performance.now();
        startTime = then;
        canvas.classList.remove('end');
        canvas.classList.add('start');
        loop();
        if (spec.hasOwnProperty('audio')) {
            spec.audio.play();
        }
    }

    function stopAnimation() {
        cancelAnimationFrame(loopId);
        currentFrame = 0;
        render(currentFrame);
        canvas.classList.remove('start');
        canvas.classList.add('end');
    }

    function stopAudio() {
        if (!spec.hasOwnProperty('audio')) {
            return;
        }
        spec.audio.pause();
        spec.audio.currentTime = 0;
    }

    return {
        init: function () {
            return this;
        },
        playAni: playAnimation,
        stopAni: stopAnimation,
        stopAudio: stopAudio
    }
};

var bgAnimation = function (spec) {
    var doc = document;
    var bgBox;
    var data;

    var now;
    var then;
    var loopId;
    var elapsed;
    var fpsInterval;
    var currentFrame;

    var fps = 30;
    var enableLoop = false;
    var returnFirst = false;
    var autoPlay = true;
    var usePoster = false;

    if (spec.hasOwnProperty('autoPlay')) {
        autoPlay = spec.autoPlay;
    }

    if (spec.hasOwnProperty('loop')) {
        enableLoop = spec.loop;
    }

    if (spec.hasOwnProperty('usePoster')) {
        usePoster = spec.usePoster;
    }

    if (spec.hasOwnProperty('fps')) {
        fps = spec.fps;
    }

    if (typeof spec.bgBox === 'string') {
        bgBox = doc.querySelector(spec.bgBox);
    } else {
        bgBox = spec.bgBox;
    }

    // var json = JSON.parse(spec.data);
    var json = spec.data;
    data = Object.keys(json.frames).map(function (value) {
        return json.frames[value];
    });

    var image = new Image();
    image.src = spec.imageSrc;
    image.addEventListener('load', loadImageCompleted);

    function loadImageCompleted() {
        bgBox.style.width = data[0].sourceSize.w + "px";
        bgBox.style.height = data[0].sourceSize.h + "px";
        bgBox.style.background = "url(" + spec.imageSrc + ") no-repeat";

        if (usePoster) {
            render(0);
        }
        if (autoPlay) {
            playAnimation();
        }
        if (spec.hasOwnProperty('readyFunc')) {
            spec.readyFunc();
        }
    }

    function render(index) {
        var sx = data[index].frame.x;
        var sy = data[index].frame.y;
        bgBox.style.backgroundPosition = -sx + "px " + -sy + "px";
    }

    function loop() {
        loopId = requestAnimationFrame(loop);
        now = performance.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            if (currentFrame < data.length) {
                render(currentFrame);
                ++currentFrame;
            } else {
                if (enableLoop) {
                    currentFrame = 0;
                } else {
                    cancelAnimationFrame(loopId);
                    if (returnFirst) {
                        currentFrame = 0;
                        render(currentFrame);
                    }
                    if (spec.hasOwnProperty('endFunc')) {
                        spec.endFunc();
                    }
                    bgBox.classList.remove('start');
                    bgBox.classList.add('end');
                    var customEvent = new CustomEvent("BG_ANIMATION_ENDED");
                    bgBox.dispatchEvent(customEvent);
                }
            }
        }
    }

    function playAnimation() {
        cancelAnimationFrame(loopId);
        currentFrame = 0;
        render(currentFrame);
        fpsInterval = 1000 / fps;
        then = performance.now();
        startTime = then;
        bgBox.classList.remove('end');
        bgBox.classList.add('start');
        loop();
        if (spec.hasOwnProperty('audio')) {
            spec.audio.play();
        }
    }

    function stopAnimation() {
        cancelAnimationFrame(loopId);
        currentFrame = 0;
        render(currentFrame);
        bgBox.classList.remove('start');
        bgBox.classList.add('end');
    }

    function stopAudio() {
        if (!spec.hasOwnProperty('audio')) {
            return;
        }
        spec.audio.pause();
        spec.audio.currentTime = 0;
    }

    return {
        init: function () {
            return this;
        },
        playAni: playAnimation,
        stopAni: stopAnimation,
        stopAudio: stopAudio
    }
};