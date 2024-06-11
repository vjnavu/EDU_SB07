(() => {

    'use strict';

    const global = 'UI';

    if (!window[global]) {
        window[global] = {};
    } 
    const Global = window[global];

    Global.KmAudioPlayer = {
        audioObj : null,
        play : (_src, _callback) => {
            Global.KmAudioPlayer.audioObj = new Audio(_src);
            Global.KmAudioPlayer.audioObj.play();
            Global.KmAudioPlayer.audioObj.addEventListener("ended", function(){
                _callback && _callback();
                // if(typeof(_callback) == "function"){
                //     console.log(222222);
                //     _callback();
                // }
            });

            console.log('audioObj' , Global.KmAudioPlayer.audioObj)
        },
        setVolume : (_volume) => {
            Global.KmAudioPlayer.audioObj.volume = _volume;
        },
        replay: () => {
            Global.KmAudioPlayer.audioObj.play();
        },
        stop : () => {
            try{
                Global.KmAudioPlayer.audioObj.pause();
            }catch (error){

            }
        },
        stop2 : () => {
            Global.KmAudioPlayer.play();
            Global.KmAudioPlayer.stop();
        },
        playGroup : (_arrSound, _callback, _betweenGap) => {
            var numSound = _arrSound.length;
            var currentTurn = 1;
            var betweenGap = (_betweenGap == undefined) ? 1000 : _betweenGap;
            const playSound = () => {
                Global.KmAudioPlayer.audioObj = new Audio(_arrSound[currentTurn-1]);
                Global.KmAudioPlayer.audioObj.play();
                Global.KmAudioPlayer.audioObj.addEventListener("ended", function(){
                    if(typeof(_callback) == "function"){
                        if(_callback != null){
                            _callback();
                        }
                    }else{
                        currentTurn++;
                        setTimeout(function(){
                            playSound();
                        }, betweenGap);
                    }
                });
            }
            playSound();

        },
        buttonClick : function(){
            var snd;
            snd = new Audio("../ko/contents/media/effect/click.mp3");
            snd.play();
        },
    }

    Global.speechballoon = {
        init() {
            const speechs = document.querySelectorAll('.popBtn.speech');
            let isAudio = false;

            const act = (e) => {
                const _this = e.currentTarget;
                const _wrap = _this.parentNode;
                const _audio = _this.dataset.audio;
                const closeAct= () => {
                    console.log('close');
                    _this.dataset.state = 'off';
                    _this.classList.remove('on');
                    Global.KmAudioPlayer.stop();
                    Global.KmAudioPlayer.play(null);
                    Global.KmAudioPlayer.stop();
                    _wrap.dataset.state = 'off';
                }
                const endCallback = () => {
                    console.log('callback')
                    closeAct();
                }

                if (_this.dataset.state === 'on') {
                    _this.dataset.state = 'off';
                    _this.classList.remove('on');
                    isAudio = Global.KmAudioPlayer;
                    Global.KmAudioPlayer.stop();
                    _wrap.dataset.state = 'off';
                } else {
                    if (isAudio.audioObj?.paused === true) {
                        Global.KmAudioPlayer.replay();
                    } else {
                        for (let item of speechs) {
                            const _wrap2 = item.parentNode;
        
                            item.dataset.state = 'off';
                            item.dataset.pause = 'false';
                            item.classList.remove('on');
                            Global.KmAudioPlayer.stop();
                            _wrap2.dataset.state = 'off';
                        }
                        Global.KmAudioPlayer.play(_audio, endCallback);
                    }
                    _this.dataset.state = 'on';
                    _this.classList.add('on');
                    _wrap.dataset.state = 'on';

                    const closeBtn = _wrap.querySelector('.balloon');
                    closeBtn && closeBtn.addEventListener('click', closeAct)
                }
            }

            for (let item of speechs) {
                item.removeEventListener('click', act);
                item.addEventListener('click', act);
            }


            // $(".popBtn.speech").on("click", function(){
            //     let audioPath = $(this).attr("data-audio");
            //     if($(this).hasClass('on')){
            //         KmAudioPlayer.stop();
            //         $(this).removeClass('on');
            //         $(this).parents('.balloonBox').find('.balloon').hide();
            //     }else{
            //         $(this).addClass('on');
            //         $(this).parents('.balloonBox').find('.balloon').show();
            //         KmAudioPlayer.stop();
            //         KmAudioPlayer.play(audioPath);
            //     }

            // });
        }
    }
    Global.speechballoon.init();

    Global.dragPositionFree = {
        init() {
            let _top;
            let _left;
            const objs = document.querySelectorAll('.js-dragObj[data-ps="free"]');
            const act = (e) => {
                const _this = e.currentTarget;
                const _id = _this.dataset.dragObjAnswer;
                const _wrap = _this.closest('.drag-zone');
                const _area = _wrap.querySelector('.js-dropArea[data-drop-area-answer="'+ _id +'"]');
                _top = window.getComputedStyle(_this).top;
                _left = window.getComputedStyle(_this).left;

                setTimeout(() => {
                    const _clones = _area.querySelectorAll('.dragObjComplete');

                    for (let item of _clones) {
                        if (!item.dataset.end) {
                            item.dataset.end = true;
                            item.style.top = _top;
                            item.style.left = _left;
                        }
                    }
                },0);
            }

            if (objs) {
                for(let item of objs) {
                    item.addEventListener('mouseup', act);
                } 
            }
        }
    }
    Global.dragPositionFree.init();

    Global.chartToggle = {
        init() {
            const charts = document.querySelectorAll('.char-image');
            const closes = document.querySelectorAll('.char-box .close-speech-button');
            const show = (e) => {
                const _selected = document.querySelector('.char-box[data-toggle="true"]');
                if (_selected) {
                    _selected.dataset.toggle = false;
                }
                
                const _this = e.currentTarget;
                const _wrap = _this.closest('.char-box');
                _wrap.dataset.toggle = true;
                Global.KmAudioPlayer.buttonClick();
            }
            const hide = (e) => {
                const _this = e.currentTarget;
                const _wrap = _this.closest('.char-box');
                _wrap.dataset.toggle = false;
                Global.KmAudioPlayer.buttonClick();
            }
            for (let item of charts) {
                item.addEventListener('click', show);
            }
            for (let item of closes) {
                item.addEventListener('click', hide);
            }
        }
    }
    Global.chartToggle.init();

    Global.squareClick = {
        init() {
            console.log(1111)
            const daps = document.querySelectorAll('.dapCheckBtn');
            const btns = document.querySelectorAll('.squareClick_btn > div');
			const pointCheck = (e) => {
				const _this = e.currentTarget;
				const n = Number(_this.dataset.n);
				const _tr = _this.closest('.squareClick_btn');
				const m = Number(_tr.dataset.check);
                const _type = _tr.dataset.type;
				// _tr.dataset.check = (n === m && _type === 'fill') ? n - 1 :  n;
                _tr.dataset.check = n;

			}
            const dapAct = (e) => {
                const _this = e.currentTarget;
                const _wrap = _this.closest('[data-quiz]');
                const els = _wrap.querySelectorAll('.squareClick_btn:not([data-disabled])');

                for (let item of els) {
                    item.removeAttribute('data-check');
                }
            }
			for (let item of btns) {
				item.addEventListener('click', pointCheck)
			}
            for (let item of daps) {
                item.addEventListener('click', dapAct)
            }
        }
    }

    Global.imgSprite = {
        init(opt) {
            const id = opt.id;
            const _this = document.querySelector('.ui-imgsprite[data-id="'+id+'"]');
            const count = Number(_this.dataset.spritecount);
            const img = _this.querySelector('img');
            const src = opt.src;
            const name = opt.name;
            const wrap = _this.closest('.ui-imgsprite-wrap');
            const btn = wrap.querySelector('.ui-imgsprite-btn');
            let n = 0;
            const callback = opt.callback;

            const act = () => {
                if (n === 0) {
                    document.querySelector('.number-write[data-id="'+ id+'"]').classList.remove('on');
                    img.src = src + name + '1.png';
                } else {
                    img.src = src + name + n +'.png';
                }
                
                n = n + 1;
                setTimeout(() => {
                    if (n <= count) {
                        act();
                    } else {
                        n = 0;
                        callback && callback();
                    }  
                },30);
            }
            btn.addEventListener('click', act);
        },
        reset(opt) {
            const id = opt.id;
            const src = opt.src;
            const name = opt.name;
            const _this = document.querySelector('.ui-imgsprite[data-id="'+id+'"]');
            const img = _this.querySelector('img');

             img.src = src + name + '1.png';
        },
        complete(opt) {
            const id = opt.id;
            const src = opt.src;
            const name = opt.name;
            const _this = document.querySelector('.ui-imgsprite[data-id="'+id+'"]');
            const count = Number(_this.dataset.spritecount);
            const img = _this.querySelector('img');

             img.src = src + name + count +'.png';
        }
    }

    Global.dapcheckAll = {
        n:0,
        complete() {
            Global.dapcheckAll.n = Global.dapcheckAll.n + 1;

            console.log( Global.dapcheckAll.n);

        },
        init() {
            const wrap = document.querySelector('[data-dapcheck="all"]');

            const btns = wrap.querySelectorAll('.dapCheckBtn');
            const len = btns.length;
            const act = (e) => {

            }
            for (let item of btns) {
                item.addEventListener('click', act);
            } 

        }
    }

    Global.checkBox = {
        init() {
            const btns = document.querySelectorAll('.check-box .wrap');
            const btns2 = document.querySelectorAll('.icon-box .wrap');
            const act = (e) => {
                const _this = e.currentTarget;
                const _wrap = _this.parentNode;
                const _on = _wrap.querySelector('.on');
                _on && _on.classList.remove('on');
                _this.classList.add('on');
                Global.KmAudioPlayer.buttonClick();
            }
            for (let item of btns) {
                item.addEventListener('click', act);
            }   
            for (let item of btns2) {
                item.addEventListener('click', act);
            }    
         }
    }
	Global.checkBox.init();

    Global.tab = {
        act() {
            const tabs2 = document.querySelectorAll('.basicSlider_circle_tabs > li');
            const tabs = document.querySelectorAll('.basicSlider_tabs > li');
            const audiobtns = document.querySelectorAll('.balloonBox ');
            const act = () => {
                Global.KmAudioPlayer.stop();
                for (let item of audiobtns) {
                    item.dataset.state="off";
                    const _a = item.querySelector('.btnKmAudio');
                    if (_a) {
                        _a.classList.remove('on');
                        _a.dataset.state="off";
                    }
                }
            }
            for (let item of tabs) {
                item.addEventListener('click', act);
            }
            for (let item of tabs2) {
                item.addEventListener('click', act);
            }
        }
    }
    Global.tab.act();
    
    Global.dragRest = {
        init(){
            const btnResets = document.querySelectorAll(".only-reset");
			btnResets.forEach((item) => {
				item.addEventListener("click", function () {
					if(!this.classList.contains("reset")){
						this.classList.add("reset");
					}
				});
			});

			const it_tab = document.querySelectorAll( ".basicSlider_tabs li" );
			it_tab.forEach(function (objs, index){
				objs.addEventListener('click', function () {
					btnResets.forEach((item) => {
						item.classList.add("reset");
					})
				});
			});

            let isAnswered = false;
			const btn_reset = document.querySelectorAll('.reset.only-reset');
			const resetQuiz = (e) => {

                const _this = e.currentTarget;



                const _wrap = _this.closest('[data-quiz="dragDrop"]')
                const _area = _wrap.querySelectorAll('.js-dropArea');

                for (let item of _area) {
                    item.innerHTML = '';
                }

				isAnswered = false;
				$pm.array.inPage.quiz.forEach(function(quiz) {
					
					const wrap = quiz.QUIZ.container;
					const isPage = wrap.classList.contains('on');
                    const _dropAreas = wrap.querySelectorAll('.js-dropArea');
          

					console.log(isPage);
					if (quiz.QUIZ.type === 'dragDrop' && isPage) {
						quiz.reset();
                        _dropAreas.forEach(function(area) {
                            area.classList.remove('textColor');
                            area.classList.remove('answer');
                        });
					}
				});
			}

			for (let item of btn_reset) {
				item.addEventListener('click', resetQuiz);
			}
        }
    }
    UI.dragRest.init();

    Global.bottomTab = {
        init(){
            const switchs = document.querySelectorAll('[data-switch-obj]');
			const tabs = document.querySelectorAll('.intro_circle_tabs li');
			const tabs2 = document.querySelectorAll('.introSlider_btn');
			const closes = document.querySelectorAll('.mouse-area-close');

			const actSwitch = (e) => {
				const _this =  e.currentTarget;
				const target = document.querySelector('[data-switch-target="'+ _this.dataset.switchObj +'"]');
				_this.classList.add('active');

				if (_this.dataset.switchObj === 'think') {
					if (target.dataset.switchOn === 'true') {
						target.dataset.switchOn = 'false';
						target.style.transform = 'translate(0, ' + (target.offsetHeight - 1) + 'px)';
					} else {
						target.dataset.switchOn = 'true';
						target.style.transform = 'translate(0, 0)';
					} 
				} else {
					target.dataset.switchOn === 'true' ? target.dataset.switchOn = 'false' : target.dataset.switchOn = 'true';
				}
			}
			const resetSwitch = (e) => {
				const _this =  e.currentTarget;
				let n = 1;
                const target = document.querySelector('.mouse-area[data-switch-on="true"]');
				if (target) target.dataset.switchOn = false;

				for (let item of tabs) {
					console.log(item);
					if (item.classList.contains('on')) {
						document.querySelector('.imgContainer').dataset.n = n;
					}
					n = n + 1;
				}

				for (let item of switchs) {
					item.classList.remove('active');
				}
			}
			const close = (e) => {
				const _this =  e.currentTarget;
				const _wrap = _this.closest('.mouse-area');
				const _n = _wrap.dataset.switchTarget;

				document.querySelector('.mouse[data-switch-obj="'+ _n +'"]').classList.remove('active');
				_wrap.dataset.switchOn = false;
			}

			for (let item of switchs) {
				item.addEventListener('click', actSwitch);
			}
			for (let item of tabs) {
				item.addEventListener('click', resetSwitch);
			}
			for (let item of tabs2) {
				item.addEventListener('click', resetSwitch);
			}
			for (let item of closes) {
				item.addEventListener('click', close);
			}
        }
    }
    
})();

