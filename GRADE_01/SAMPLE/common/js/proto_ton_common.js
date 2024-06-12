document.addEventListener('DOMContentLoaded', function () {
    $('.dapCheckBtn_js').html('정답 확인');

    // check answer button
    $(document).on('click', '.dapCheckBtn_js', function () {
        if (bgSound) {
            efSound('./media/click.mp3');
        }

        const $input = $(this).parent().find('input');
        const $inputAns = $input.data('ans');

        const $currentBtn = $(this);
        const $selected = $currentBtn.parent().find('.selected');

        // const isDaps = $currentBtn.hasClass('daps');

        let handlePopup;
        if (typeof showPopup === 'function') {
            handlePopup = showPopup;
        } else {
            handlePopup = showPopupBee;
        }

        if ($input.attr('type') == 'text') {
            let $inputValue = $input.val();

            if ($inputValue == $inputAns) {
                // $currentBtn.addClass('daps');
                handlePopup(true)
                $input.addClass('complete');
            } else {
                handlePopup(false)
                $input.addClass('wrong');
            }
        } else {
            if ($selected.length > 0) {
                const isCorrect = $selected.hasClass('ans');

                if (isCorrect) {
                    $selected.addClass('complete');
                    // $currentBtn.addClass('daps');
                    handlePopup(true)
                } else {
                    handlePopup(false)
                }

                if (!isCorrect) {
                    $selected.removeClass('selected');
                }
            } else if ($selected.length <= 0) {
                handlePopup(false)
            }
        }
    });

    // btn common sound
    $(document).on('click', '[class^="btn-"]', function () {
        if (bgSound) {
            efSound('./media/click.mp3');
        }
    });

    // resest all when close popup
    $(document).on('click', '.popCloseBtn', function () {
        $('.popupContents').find('.selected').removeClass('selected');
        $('.popupContents').find('.complete').removeClass('complete');
        // $('.dapCheckBtn_js').removeClass('daps');
        $('.popupContents input').removeClass('wrong').val('');
        // $('.starBox').removeClass('complete');
        $('.starBox .starText').html('');
    });

});
function showPopupBee(status) {
    $('.bee-alert').addClass('active');
    $('.wrap').show();
    $('.wrap').css('z-index', '2009');
    if (status === true) {
        if (bgSound) {
            efSound('./media/correct.mp3');
        }
        $('.bee-alert').append(`<img src="./common/images/proto_ton_011/bee-true.png" />`);
    } else {
        if (bgSound) {
            efSound('./media/incorrect.mp3');
        }
        $('.bee-alert').append(`<img src="./common/images/proto_ton_011/bee-false.png" />`);
    }
    setTimeout(() => {
        $('.bee-alert').removeClass('active').html('');
        $('.wrap').css('z-index', '2001');
    }, 2000)
}

document.querySelector('.content-container').classList.add('loaded');

(function () {

    var initializing = false, fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    };

    Class.extend = function (prop) {

        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function (name, fn) {
                return function () {
                    var tmp = this._super;
                    this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            })(name, prop[name]) : prop[name];
        };

        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        };

        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;

        return Class;
    };

})();

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



(function ($) {
    'use strict';

    var GlobalAudio = GlobalAudio || (function () {
        var list = {};
        var nowAudio = null;

        var instance = {
            init: function () {
                this.addAudio("button", "./common/audio/button.mp3");
                this.addAudio("answer", "./common/audio/answer.mp3");
                this.addAudio("quiz_o", "./common/audio/quiz_o.mp3");
                this.addAudio("quiz_x", "./common/audio/quiz_x.mp3");

                return this;
            },
            addAudio: function (id, src) {
                var control = new Audio(src);
                control.onended = function () {
                    nowAudio = null;
                };
                list[id] = control;
            },
            play: function (id) {
                if (id == "" || id == null || id == undefined) return;

                if (nowAudio != null) {
                    nowAudio.pause();
                    nowAudio.currentTime = 0;
                }
                nowAudio = list[id];
                if (nowAudio) nowAudio.play();
            },
            pause: function () {
                nowAudio.pause();
            },
            getAudio: function (id) {
                return list[id];
            },
            getNowAudio: function () {
                return nowAudio;
            }
        }
        return instance;

    });

    window.GlobalAudio = new GlobalAudio().init();

})(jQuery);

$(document).on('click', '.setting-btn', function () {
    if (bgSound) {
        efSound('./media/click.wav');
    }
    $(this).parent().toggleClass('active');
    $(this).toggleClass('close');
});

$(document).on('click', '.check-text', function () {
    if (bgSound) {
        efSound('./media/click.mp3');
    }
    const $element = $(this);
    const $item = $element.parent();
    const redCheck = $element.hasClass('check-text') ? $element.find('p').attr('class') : $element.parent().find('p').attr('class');

    if (redCheck === 'red-check') {
        $item.find('.red-check').remove();
    } else {
        $item.find('.check-box').append(`<p class='red-check'></p>`);

    }
});


$(document).on('click', '#soundMute', function () {
    bgSound = !bgSound;
});

$(document).on('click', '.popBtn, .popCloseBtn', function () {
    if (!bgSound) {
        stopPlayingEfSound();
    }
});