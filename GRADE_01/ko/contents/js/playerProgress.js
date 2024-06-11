var createProgressBar = function (spec) {
    var doc = document;
    var box;
    var bar;
    var played;

    var rootRect;
    var barRect;

    var scale = 1;

    var scrolling = false;

    init();

    function init() {
        if(typeof spec.box === "string") {
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
        scale = globalScale;

        box.addEventListener(amt.mouseTouchEvent.down, scrollHandler);
        doc.addEventListener(amt.mouseTouchEvent.move, scrollHandler);
        doc.addEventListener(amt.mouseTouchEvent.up, scrollHandler);
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
            bar.style.transform = "translate3d(" + barX / scale + "px, 0, 0)";
        }
        played.style.width = playedX / scale + "px";

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
        var x = total * p / scale;
        played.style.width = x + "px";
        if (bar) {
            // 크롬에서 스케일 리사이즈시 element가 보이지 않는 문제 때문에 z값 0으로 설정해야함
            bar.style.transform = "translate3d(" + (x - getBarW() / 2) + "px, 0, 0)";
        }
    }

    function getBarW() {
        return bar ? barRect.width * scale : 0;
    }

    function getRootW() {
        return rootRect.width * scale;
    }

    function getCoordinate(e) {
        var clientX = typeof e.clientX === "number" ? e.clientX : e.changedTouches[0].clientX;
        var clientY = typeof e.clientY === "number" ? e.clientY : e.changedTouches[0].clientY;
        // var target = e.target || document.elementFromPoint(clientX, clientY);

        var wrap = doc.querySelector("#wrap");
        var wrapRect = wrap.getBoundingClientRect();
        var offsetX = clientX - wrapRect.left - rootRect.left * scale;
        var offsetY = clientY - wrapRect.top - rootRect.top * scale;
        // var offsetX = clientX - rootRect.left * scale;
        // var offsetY = clientY - rootRect.top * scale;

        return [offsetX, offsetY];
    }

    broadcaster.on("RESIZE_WINDOW", function () {
        scale = arguments[0].windowRatio;
    });

    var instance = {
        setPercent: setPercent,
        resetScroll: function () {
            scrolling = false;
            setPercent(0);
        }
    };
    return instance;
};
