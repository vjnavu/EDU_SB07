var isIPad = navigator.userAgent.match(/iPad/i) != null;

var isMobile;
var isAndroid;
var downEvent, moveEvent, upEvent, clickEvent, overEvent, outEvent;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    isMobile = true;
    downEvent = "touchstart";
    moveEvent = "touchmove";
    upEvent = "touchend";
    clickEvent = "click";
} else {
    isMobile = false;
    downEvent = "mousedown";
    moveEvent = "mousemove";
    overEvent = "mouseover";
    outEvent = "mouseout";
    upEvent = "mouseup";
    clickEvent = "click";
};

if (/Android/i.test(navigator.userAgent)) {
    isAndroid = true;
};

let gameLife = 3;
let gameErrorCount = 0;
let bgMusic = true;
let afterStart = false;
// let closeZoom;

// audio control
let audio = document.getElementById("myAudio");
audio.onended = function () {
    this.currentTime = 0;
    var delay = setTimeout(function () {
        audio.play();
        clearTimeout(delay);
    }, 500);
}

function playAudio() {
    audio.currentTime = 0;
    audio.muted = false;
    if (afterStart) {
        audio.play();
    }
}

function mutedAudio() {
    audio.muted = true;
}

$(document).on('click', '#volumeMute', function () {
    bgMusic = !bgMusic;

    if (bgMusic === true && afterStart === true) {
        playAudio();
    } else if (bgMusic === false) {
        mutedAudio();
    }

});

// main script start
let solvesArr = [
    [
        { "y": 260, "x": 850 },
        { "y": 200, "x": 615 },
        { "y": 445, "x": 730 },
        { "y": 530, "x": 500 },
    ],
    [
        { "y": 40, "x": 830 },
        { "y": 90, "x": 580 },
        { "y": 185, "x": 480 },
        { "y": 215, "x": 690 },
        { "y": 525, "x": 710 },
    ],
    [
        { "y": 522, "x": 760 },
        { "y": 440, "x": 355 },
        { "y": 205, "x": 620 },
    ]
]
document.addEventListener('DOMContentLoaded', function () {
    createSolves(solvesArr);

    $(document).on('click', '.btn-check', function () {
        const dataIndex = $('.slideControls').find('.quizHeader-current-idx').text();
        $('.solves').addClass('checked');
        let count = 0;

        for (let i = 0; i < solvesArr.length; i++) {
            for (let j = 0; j < solvesArr[i].length; j++) {
                count++;
                if (i === parseInt(dataIndex - 1)) {
                    if (!$(this).hasClass('active')) {
                        $('.solves div:nth-child(' + count + ')').removeClass('active');
                    } else {
                        $('.solves div:nth-child(' + count + ')').addClass('active').removeClass('hide');
                    }
                }
            }
        }
    });
});


$(document).on('click', '.btn-start', function () {
    afterStart = true;
    $('.setting-container').removeClass('active');
    $('.setting-btn').removeClass('close');

    $(this).parents('.innerBox').hide();
    $('.boxMain').show();
    if (bgMusic) {
        playAudio();
    }
    $('.btn-home').removeClass('hide');
});

$('.setting-container').on('mouseleave', function () {
    $('.setting-container').removeClass('active');
})
// var target;
var zoomIn = false;
$('.zoomButton').on('click', function () {
    efSound('./media/click.mp3');
    $('.solves').css('position', 'relative');
    const $zoomButton = $(this);
    const dataIndex = $('.slideControls').find('.quizHeader-current-idx').text();

    if (zoomIn) {
        let count = 0;
        $zoomButton.removeClass('active');
        $('.errors').show();
        // $('.solves div').removeClass('hide');
        for (let i = 0; i < solvesArr.length; i++) {
            for (let j = 0; j < solvesArr[i].length; j++) {
                count++;
                if (i === parseInt(dataIndex - 1)) {
                    $('.solves div:nth-child(' + count + ')').removeClass('hide');
                }
            }
        }
        $('.solves').css('position', 'unset');
        closeZoom();
    } else {
        let count = 0;
        zoomIn = true;
        $(".magnifier").show();
        // target = $zoomButton.parent('.magnify').find('img.show');
        // var zoom = target.attr('data-zoom');
        // var magnifier = $zoomButton.parent('.magnify').find('.magnifier');
        // var zoomButtonX = Number($('.zoomButton').css('left').replace('px', ''));
        // var zoomButtonY = Number($('.zoomButton').css('top').replace('px', ''));

        // $zoomButton.parent('.magnify').find('.magnifier').css({
        //     "background": "url('" + target.attr("src") + "') no-repeat",
        //     "background-size": target.width() * zoom + "px " + target.height() * zoom + "px",
        //     "background-position": -(zoomButtonX * zoom - magnifier.width() / 2) + "px " + -(zoomButtonY * zoom - magnifier.height() / 2) + "px",
        //     "left": (zoomButtonX - magnifier.width() / 2) + 'px',
        //     "top": (zoomButtonY - magnifier.height() / 2) + 'px'
        // });

        $(".magnifyBox").on(moveEvent, magnify);

        $('.errors').hide();
        // $('.solves div:not(.active)').hide();
        for (let i = 0; i < solvesArr.length; i++) {
            for (let j = 0; j < solvesArr[i].length; j++) {
                count++;
                if (i === parseInt(dataIndex - 1)) {
                    $('.solves div:nth-child(' + count + ')').addClass('hide');
                }
            }
        }
        // $('.solves div').addClass('hide');
        $zoomButton.addClass('active');
    };
    // soundEnd();
}); // 돋보기 클릭

$(document).on('click', '.boxMain .flex', function () {
    let count = 0;
    const dataIndex = $('.slideControls').find('.quizHeader-current-idx').text();

    zoomIn = false;
    $('.zoomButton').removeClass('active');
    $('.errors').show();
    // $('.solves div').show();
    $('.solves').css('position', 'unset');
    for (let i = 0; i < solvesArr.length; i++) {
        for (let j = 0; j < solvesArr[i].length; j++) {
            count++;
            if (i === parseInt(dataIndex - 1)) {
                $('.solves div:nth-child(' + count + ')').removeClass('hide');
            }
        }
    }
    closeZoom();
});

function magnify(e) {
    var target = $(this).find('img.show');
    var zoom = target.attr('data-zoom');
    var magnifier = $(this).find('.magnifier');

    var zoomButtonX = Number($('.zoomButton').css('left').replace('px', ''));
    var zoomButtonY = Number($('.zoomButton').css('top').replace('px', ''));

    $(this).find('.magnifier').css({
        "background": "url('" + target.attr("src") + "') no-repeat",
        "background-size": target.width() * zoom + "px " + target.height() * zoom + "px",
        "background-position": -(zoomButtonX * zoom - magnifier.width() / 2) + "px " + -(zoomButtonY * zoom - magnifier.height() / 2) + "px",
        "left": (zoomButtonX - magnifier.width() / 2) + 'px',
        "top": (zoomButtonY - magnifier.height() / 2) + 'px'
    });

    var mouseX = (isMobile ? e.touches[0].pageX : e.pageX) - $(this).offset().left;
    var mouseY = (isMobile ? e.touches[0].pageY : e.pageY) - $(this).offset().top;

    if (zoomIn) {
        if (mouseX < $(this).width() && mouseY < $(this).height() && mouseX > 0 && mouseY > 0) {
            magnifier.fadeIn(100);
        } else {
            magnifier.fadeOut(100);
        }

        magnifier.css('cursor', 'none');
    }

    if (magnifier.is(":visible")) {
        var rx = -(mouseX * zoom - magnifier.width() / 2);
        var ry = -(mouseY * zoom - magnifier.height() / 2);

        var px = mouseX - magnifier.width() / 2;
        var py = mouseY - magnifier.height() / 2;

        magnifier.css({
            left: px,
            top: py,
            backgroundPosition: rx + "px " + ry + "px"
        });
    };
}

function closeZoom() {
    zoomIn = false;
    $(".magnifier").hide();
}

$(document).on('click', '.solves div', function () {
    if ($(this).hasClass('active')) {
        return;
    } else {
        if (bgSound) {
            efSound('./common/audio/quiz_o.mp3');
        }
        $(this).addClass('active');

        if ($('.solves div:not(.hide)').length == $('.solves div.active').length) {
            $('.magnify .errors').addClass('block');
            $('.zoomButton').addClass('block');
            setTimeout(function () {
                $('.alert_popup2').show();
                showPopup(true);

                setTimeout(function () {
                    $('.alert_popup2').hide();
                    $('.btn-check').html('다시<br>하기').addClass('active');
                }, 2000);

            }, 300);
        }
    }
})

$(document).on('click', '.errors', function (e) {
    if (bgSound) {
        efSound('./common/audio/quiz_x.mp3');
    }

    let quizError = document.createElement('div');
    document.querySelector('.errors').appendChild(quizError);

    var box = document.querySelector(".errors");
    var errorRect = box.getBoundingClientRect();
    var x = (e.pageX - errorRect.left - ((quizError.offsetWidth * viewport.scale) / 2)) / viewport.scale;
    var y = (e.pageY - errorRect.top - ((quizError.offsetHeight * viewport.scale) / 2)) / viewport.scale;

    quizError.style.left = x + 'px';
    quizError.style.top = y + 'px';
    quizError.classList.add('active');

    setTimeout(function () {
        quizError.classList.remove('active');

    }, 1000);

    if (gameErrorCount < gameLife) {
        gameErrorCount++;
        $('.lives-container .live:nth-child(' + gameErrorCount + ')').addClass('off');
    }
    if (gameErrorCount === gameLife) {
        setTimeout(function () {
            $('.alert_popup2').css('display', 'block');
            showPopup(false)
        }, 300);
    }

})

$(document).on('click', '.characterAni button', function () {
    reset();
})

$(document).on('click', '.btn-check', function () {
    if ($(this).hasClass('active')) {
        reset();
    } else {
        $('.errors').addClass('disable');
        $('.solves div').addClass('active');
        $(this).html('다시<br>하기').addClass('active');
        $('.zoomButton').addClass('block');
    }
});

$(document).on('click', '.btn-sub.popBtn, .popCloseBtn', function () {
    if ($(this).hasClass('popBtn')) {
        $('.wrap').show();
    } else if ($(this).hasClass('popCloseBtn')) {
        $('.wrap').hide();
    }
});

function createSolves(solvesArr, idx) {
    for (let i = 0; i < solvesArr.length; i++) {
        for (let j = 0; j < solvesArr[i].length; j++) {
            let solve = document.createElement('div');
            if (i > 0) {
                solve.classList.add('hide');
            }
            solve.style.top = solvesArr[i][j].y + 'px';
            solve.style.left = solvesArr[i][j].x + 'px';
            document.querySelector('.solves').appendChild(solve);
        }
    }
}

function reset() {
    $('.alert_popup2').css('display', 'none');
    gameErrorCount = 0;
    $('.lives-container .live').removeClass('off');
    $('.solves div').removeClass('active').addClass('hide');
    $('.btn-check').html('정답<br>확인').removeClass('active');
    $('.errors').removeClass('disable');
    $('.magnify .errors').removeClass('block');
    $('.zoomButton').removeClass('block');
}

$(document).on('click', '.btn-home', function () {
    $('.innerBox').show();
    $('.boxMain').hide();
    $('.setting-container').removeClass('active');
    $('.setting-btn').removeClass('close');
    afterStart = false;
    mutedAudio();

    $(this).addClass('hide');

    reset();
});

// slide controls start
const quizSlides = $('.magnifyBox > img');
const maxQuizIdx = quizSlides.length;
const quizHeaderCurrentIdx = $('.quizHeader-current-idx');
const quizHeaderTotalIdx = $('.quizHeader-total-idx');
const quizSliderPrevBtn = $(".quizSlider-btn.btn-prev");
const quizSliderNextBtn = $(".quizSlider-btn.btn-next");

let quizCurrentIdx = 0;

showCurrentQuizIdx(quizCurrentIdx);
showSlideQuiz(quizCurrentIdx);

function showCurrentQuizIdx(idx) {
    idx += 1;

    quizHeaderTotalIdx.text(maxQuizIdx);
    quizHeaderCurrentIdx.text(idx);
}

$(document).on('click', '.quizSlider-btn', function () {
    gameErrorCount = 0;
    $('.btn-check').removeClass('active').html('정답<br>확인');

    if ($(this).hasClass("btn-prev")) { // button prev
        quizCurrentIdx--;
        showSlideQuiz(quizCurrentIdx);
        showCurrentQuizIdx(quizCurrentIdx);
    } else if ($(this).hasClass("btn-next")) { // button next
        quizCurrentIdx++;
        showSlideQuiz(quizCurrentIdx);
        showCurrentQuizIdx(quizCurrentIdx);
    }
    // createSolves(quizCurrentIdx + 1);

    $('.solves div').removeClass('active');
    // $('.btn-check').removeClass('active');
    $('.lives-container .live').removeClass('off');

    const dataIndex = $(this).parent().find('.quizHeader-current-idx').text();
    $('.btn-sub').attr('data-pop', dataIndex);

    $('.solves div').addClass('hide');
    let count = 0;

    for (let i = 0; i < solvesArr.length; i++) {
        for (let j = 0; j < solvesArr[i].length; j++) {
            count++;
            if (i === parseInt(dataIndex - 1)) {
                $('.solves div:nth-child(' + count + ')').removeClass('hide');
            }
        }
    }
});

function showSlideQuiz(idx) {

    if (idx == 0) {
        quizSliderPrevBtn.addClass("disable");
    } else {
        quizSliderPrevBtn.removeClass("disable");
    }
    if (idx == maxQuizIdx - 1) {
        quizSliderNextBtn.addClass("disable");
    } else {
        quizSliderNextBtn.removeClass("disable");
    }

    quizSlides.each((index, element) => {
        if (quizCurrentIdx == index) {
            $(element).addClass("show");
        } else {
            $(element).removeClass("show");
        }
    });

}

// slide controls end

(function ($) {
    'use strict';

    var SpriteAni = SpriteAni || (function () {

        function initSprite() {
            var owner = this;

            this.totalFrams = this.options.frameData.frames.length;
            this.container.width(this.options.frameData.frames[0].sourceSize.w);
            this.container.height(this.options.frameData.frames[0].sourceSize.h);
            // var url = "url('" + this.options.source + "')";
            // this.container.css("background-image", url);

            this.gotoAndStop(0);

            if (this.options.autoPlay) {
                this.play();
            }
        }

        function onUpdate(isFirst) {
            var owner = this;
            if (!isFirst) this.currentFrame++;
            if (this.currentFrame > this.totalFrams) this.currentFrame = this.totalFrams;

            if (this.currentFrame < this.totalFrams) {
                var pos = -this.frames[this.currentFrame].frame.x + "px " + -this.frames[this.currentFrame].frame.y + "px";
                this.container.css("background-position", pos);
            }

            if (this.currentFrame >= this.totalFrams) {
                if (this.options.onFinish) {
                    if (this.options.callbackTarget) this.options.onFinish.call(this.options.callbackTarget, this);
                    else this.options.onFinish(this);
                }

                this.stop();

                if (this.options.loop) {
                    this.currentFrame = 1;
                    this.timeout = setTimeout(function () {
                        owner.play();
                    }, this.options.delay);
                }
            }
        }

        return Class.extend({

            init: function (element, options) {
                this.element = element;
                this.container = this.element;
                this.options = { source: "", frameData: {}, loop: true, autoPlay: false, fps: 30, onFinish: null, delay: 0, callbackTarget: null };
                $.extend(this.options, options);

                if (!this.options.frameData.frames) return;
                this.frames = this.options.frameData.frames;

                this.currentFrame = 1;
                this.timer;
                this.timeout;
                this.totalFrams;
                initSprite.call(this);

                this.element.data("instance", this);
            },

            play: function (frame) {
                if (frame) this.currentFrame = frame;
                clearInterval(this.timer);
                this.timer = setInterval($.proxy(onUpdate, this), 1000 / this.options.fps);
            },

            stop: function () {
                clearInterval(this.timer);
                clearTimeout(this.timeout);
            },

            gotoAndStop: function (frame) {
                this.currentFrame = frame;
                if (this.currentFrame > this.totalFrams) this.currentFrame = this.totalFrams;

                var pos = -this.frames[this.currentFrame].frame.x + "px " + -this.frames[this.currentFrame].frame.y + "px";
                this.container.css("background-position", pos);
            },

            show: function () {
                this.container.show();
            },

            hide: function () {
                this.container.hide();
                this.stop();
            },

            update: function () {
                onUpdate.call(this);
            },

            reset: function () {
                this.stop();
                this.gotoAndStop(0);
            },

            dispose: function () {
                clearInterval(this.timer);
                clearTimeout(this.timeout);
            }
        });

    })();

    window.SpriteAni = SpriteAni;

})(jQuery);




// -- resize
const viewbase = { left: 0, top: 0, width: 1365, height: 768, scale: 1 };
let viewport = { left: 0, top: 0, width: 0, height: 0, scale: 1 };
scale();
window.onresize = function () {
    scale();
};

function scale() {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    let scaleW = viewport.width / viewbase.width;
    let scaleH = viewport.height / viewbase.height;
    scaleH = (viewport.height - 60) / (viewbase.height - 60);
    viewport.scale = Math.min(scaleW, scaleH);

    viewport.left = (scaleW < scaleH) ? 0 : parseInt((viewport.width - (viewbase.width * viewport.scale)) / 2);
    if (viewport.scale < 1) {
        viewport.scale = 1;
        viewport.left = parseInt((viewport.width - viewbase.width) / 2);
        if (viewport.left < 0) viewport.left = 0;
        if (viewport.top < 0) viewport.top = 0;
    }
}



