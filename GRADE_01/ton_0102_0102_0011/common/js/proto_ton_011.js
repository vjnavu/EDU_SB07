// let bgMusic = true;
let turnedNo = [];

document.addEventListener('DOMContentLoaded', function () {
    // active number icons depend select-game value
    function activateIcons(value) {
        $('.icon-group .icon').removeClass('active');

        for (let i = 1; i <= value; i++) {
            $('.icon-group .icon[data-icon="' + i + '"]').addClass('active');
        }
        $('.introSlide .icon-group .icon:nth-child(1)').addClass('on');
    }

    // create place in image
    function createChild(dataSlide, dataPop) {
        const child = $('<div>').addClass('popBtn').addClass('place').attr('data-pop', dataPop).attr('data-slide', dataSlide);
        return child;
    }

    function createRow(dataPop, ...childrenText) {
        const row = $('<div>').addClass('row');
        childrenText.forEach(dataSlide => {
            row.append(createChild(dataSlide, dataPop));
        });
        return row;
    }

    function generatePlace(dataPop, dataSlides) {
        dataSlides.forEach(dataSlide => {
            $('.placeContainer').append(createRow(dataPop, ...dataSlide));
        });
    }

    // draw place around image to click depend data-slide
    const dataSlides = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [27, 10],
        [26, 11],
        [25, 12],
        [24, 13],
        [23, 22, 21, 20, 19, 18, 17, 16, 15, 14]
    ];

    generatePlace(3, dataSlides);

    function reset() {
        countRoll = 0;
        $('.popbox .dice-play').css({ 'pointer-events': 'all', 'cursor': 'pointer' })
        clearInterval(intervalId);
        $('.icon-group .icon').removeClass('on');
        // $('.icon-group .icon:nth-child(1)').addClass('on');
    }

    // select number member
    let selectedNumberMember

    $(document).on('click', '.select-game', function () {
        efSound('./media/click.mp3');

        $('.select-game').removeClass('active');
        $(this).addClass('active');
        selectedNumberMember = $(this).data('value');
    });

    $(document).on('click', '.btn-start', function () {
        if (selectedNumberMember) {
            $(this).parents('.innerBox').hide();
            $('.boxMain, .popbox.introSlide').show();
            activateIcons(selectedNumberMember);
            $('.app-dice .dice-img').removeAttr('idx');
            $('.setting-container').hide();
        } else {
            $('.popbox[data-pop="alert"]').show();
            $('.wrap').show();
        }
    });

    $(document).on('click', '.btn-intro-close', function () {
        $(this).parents('.popbox').hide();
        $(this).removeClass('active');
        reset();
    });

    $(document).on('click', '.btn-home', function () {
        $('.icon-group .icon.active').attr('style', 'position: relative');
        $('.select-game').removeClass('active');
        $('.innerBox').show();
        $('.boxMain').hide();
        $('.popbox').hide();
        $('.setting-container').show();
        $('.setting-container').removeClass('active');
        $('.setting-btn').removeClass('close');
        // mutedAudio();
        turnedNo = [];
        $('.icon-group .icon span').text('');
        reset();
    });

    // dice app
    // initContent();

    setApp();

    // select ox
    $(document).on('click', '.oxSelect, .selectBox', function () {
        efSound('./media/click.mp3');
        if ($(this).hasClass('oxSelect')) {
            $(this).parent().find('.oxSelect').removeClass('selected');
        } else if ($(this).hasClass('selectBox')) {
            $(this).parent().find('.selectBox').removeClass('selected');
        }

        $(this).addClass('selected');
        // $('.dapCheckBtn_js').removeClass('daps');
    });

    // input spell
    // create spell element
    const spellContainer = $('.spellContainer');
    const spells = spellContainer.data('spell').split(',');
    spells.forEach(spell => {
        spellContainer.append(`<div class="spell">${spell}</div>`)
    });

    $(document).on('input', '.popupContents input', function () {
        $(this).removeClass('wrong');
        // $('.dapCheckBtn_js').removeClass('daps');
    });

    // create treasure text
    $('.treasureBox').append(`<div class="treasureIcon"></div>
                      <div class="treasureText"></div>`);

    // treasure text generate function
    function generateRandomText(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const treasureTextArr = ['티켓/쿠<br>폰 같은', '반짝반<br>짝한 효', '는 효<br>과 넣기'];

    $(document).on('click', '.treasureBox', function () {
        efSound('./media/chest.wav');
        $(this).find('.treasureText').html(generateRandomText(treasureTextArr));
        $(this).addClass('complete');
    });

    // drag/drop
    $('.contentsBox .icon-group .icon').draggable()
    $(document).on('dragstart', '.contentsBox .icon-group .icon', function () {
        efSound('./media/click.mp3');
        $('.contentsBox .icon-group .icon').css('z-index', '1');
        $(this).css('z-index', '2');
    });

    $('.placeContainer').droppable({
        accept: '.icon',
    });

    let countRoll = 0;
    let intervalId;
    $(document).on('click', '.popbox .dice-play', function () {
        countRoll++;
        if (countRoll == selectedNumberMember) {
            $(this).css({ 'pointer-events': 'none', 'cursor': 'none' });
            clearTimeout(timeOutId)
            $('.popbox .icon-group .icon').removeClass('on');
            intervalId = setInterval(() => {
                $('.btn-intro-close').toggleClass('active')
            }, 600);
        }
    });

    $(document).on('click', '.popBtn.place', function () {
        $('.wrap').show();
    });
});

function setApp() {
    $("*[data-ui='app-dice']").each(function (i) {
        let option = $(this).attr("data-option") ? JSON.parse($(this).attr("data-option")) : {};
        $(this).diceApp(option);
    });
}

let timeOutId;

(function ($) {
    'use strict';

    var DiceApp = DiceApp || (function () {
        var ani_data = {
            "frames": [
                {
                    "frame": { "x": 4, "y": 4, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 241, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 478, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 715, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 952, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 1189, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 1426, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 4, "y": 1663, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 4, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 241, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 478, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 715, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 952, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 1189, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 1426, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 178, "y": 1663, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 352, "y": 4, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 352, "y": 241, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 352, "y": 478, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 352, "y": 715, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 352, "y": 952, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }
                , {
                    "frame": { "x": 352, "y": 1189, "w": 170, "h": 233 },
                    "sourceSize": { "w": 170, "h": 233 }
                }],
            "meta": {
                "app": "Adobe Animate",
                "version": "19.2.1.408",
                "image": "dice_sprite.png",
                "format": "RGBA8888",
                "size": { "w": 1024, "h": 2048 },
                "scale": "1"
            }
        }
        var htmlInner =
            '<div class="dice-cont">'
            + '	<div class="dice dice-img"></div>'
            + '	<div class="dice dice-ani"></div>'
            + '	<div class="dice-play"></div>'
            + '</div>'

        var instance;
        var count = 0;
        var countMember = 1;


        function initFn() {
            var ani = new SpriteAni(this.element.find(".dice-ani"), { frameData: ani_data, loop: false, onFinish: $.proxy(onFinish, this) });

            this.element.find(".dice-play").on("click", function () {
                stopPlayingEfSound();
                instance = $(this).parents('.app-dice');
                instance.css("pointer-events", "none");
                // GlobalAudio.play("button");
                efSound('./media/dice.mp3');
                instance.addClass("play");
                ani.play(1);

                turnedNo.push(count);

                if ($(this).parent().parent().hasClass('dice-popbox')) {
                    do {
                        count = Math.ceil(Math.random() * 6);
                    }
                    while (jQuery.inArray(count, turnedNo) != -1)

                    timeOutId = setTimeout(() => {
                        $('.icon-group .icon[data-icon="' + countMember + '"] span').text(count);
                        countMember++;
                    }, 900)

                    $('.icon-group .icon').removeClass('on');

                    timeOutId = setTimeout(() => {
                        $('.icon-group .icon:nth-child(' + countMember + ')').addClass('on');
                    }, 900)

                } else {
                    count = Math.ceil(Math.random() * 6);
                    countMember++;
                }

                instance.find(".dice-img").attr("idx", count);

                let countMemberActive = $('.icon-group .icon.active').length / 2;
                if (countMember > countMemberActive) {
                    countMember = 1;
                }
            });


            $(document).on('click', '.btn-home, .btn-intro-close', function () {
                countMember = 1;
            })

            if (this.options.autoStart) this.start();
        }

        function onFinish(e) {
            instance.css("pointer-events", "");
            instance.removeClass("play");
        }
        return Class.extend({

            init: function (element, options) {
                this.element = element;
                this.options = options;

                instance = this;

                this.element.css("pointer-events", "none");
                this.element.append($(htmlInner));

                initFn.call(this);
            },
            start: function () {
                this.element.css("pointer-events", "");
            }
        });

    })();

    // 메인 기본 옵션
    DiceApp.DEFAULT = { autoStart: true };

    function Plugin(option, params) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('ui.diceApp');
            var options = $.extend({}, DiceApp.DEFAULT, typeof option == "object" && option);
            if (!data) $this.data('ui.diceApp', (data = new DiceApp($this, options)));
            if (typeof option == 'string') data[option](params);
            $this.data('instance', data);
        });
    }

    window.DiceApp = DiceApp;

    $.fn.diceApp = Plugin;
    $.fn.diceApp.Constructor = DiceApp;

})(jQuery);

$(document).on('click', '.popWrap, .popCloseBtn', function () {
    if ($(this).hasClass('popWrap')) {
        $('.wrap').show();
    } else if ($(this).hasClass('popCloseBtn')) {
        $('.wrap').hide();
        $('.treasureBox').removeClass('complete');
    }
    if ($(this).parent().hasClass('alert')) {
        efSound('./media/click.mp3');
        $(this).parent().hide();
        $('.wrap').hide();
    }
});