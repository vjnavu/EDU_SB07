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
            snd = new Audio("../math/contents/media/click.mp3");
            snd.play();
        },
    }

    Global.speechballoon = {
        reset() {
            const speechs = document.querySelectorAll('.popBtn.speech');
            for (let item of speechs) {
                const __wrap = item.parentNode;

                item.dataset.play = 'off';
                item.dataset.pause = false;
                __wrap.dataset.state = 'off';
                
            }
            Global.KmAudioPlayer && Global.KmAudioPlayer.stop();
        },
        init() {
            const speechs = document.querySelectorAll('.popBtn.speech');
            const act = (e) => {
                const _this = e.currentTarget;
                const _wrap = _this.parentNode;
                const _audio = _this.dataset.audio;
                
                //stop
                const allStop = () => {
                    for (let item of speechs) {
                        const __wrap = item.parentNode;
                        item.dataset.play = 'off';
                        item.dataset.pasue = false;
                        __wrap.dataset.state = 'off';
                        
                    }
                     Global.KmAudioPlayer && Global.KmAudioPlayer.stop();
                }
                //stop callback
                const callbackClose = () => {
                    _this.dataset.play = 'off';
                    _wrap.dataset.state = 'off';
                    _this.dataset.pasue = false;
                }

                //play & pasue
                if (_this.dataset.play === 'on') {
                    //pasue
                    if (_this.dataset.pasue !== 'true') {
                        Global.KmAudioPlayer.stop();
                        _this.dataset.pasue = true;
                    } else {
                        Global.KmAudioPlayer.replay();
                        _this.dataset.pasue = false;
                    }

                } else {
                    //open
                    allStop();
                    Global.KmAudioPlayer.play(_audio, callbackClose);
                    _this.dataset.play = 'on';
                    _wrap.dataset.state = 'on';

                    const closeBtn = _wrap.querySelector('.balloon');
                    closeBtn && closeBtn.addEventListener('click', allStop);
                }
            }

            for (let item of speechs) {
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
            
            const daps = document.querySelectorAll('[data-quiz="dragDrop"] .dapCheckBtn');
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
                        item.addEventListener('mousedown', this.actStart)
                    }
                },0);
            }
            const actDap = (e) => {
                const _this = e.currentTarget;
                const _wrap = _this.closest('[data-quiz="dragDrop"]');
                const _dropAreas = _wrap.querySelectorAll('.js-dropArea');
                const _dragObjs = _wrap.querySelectorAll('.dragObjComplete');
                const _dapObj = _wrap.querySelector('.js-dropDap');
                const isState = _this.classList.contains('reset');

                // false 이면 정답보임, true이면 리셋
                if (isState) {
                    // for(let item of _dropAreas) {
                    //     item.classList.remove('complete');
                    // }
                    for(let item of _dragObjs) {
                        item.classList.remove('dragObjComplete');
                    }
                    for(let item of _dropAreas) {
                        item.classList.remove('complete');
                        const delObj = item.querySelector('.js-dragObj');
                        delObj.remove();
                    }
                } else {
                    for(let item of _dropAreas) {
                        item.classList.add('complete');
                        const _areaCompletes = item.querySelectorAll('.dragObjComplete');
                        for(let item2 of _areaCompletes) {
                            item2.remove();
                        }
                    }
                }
            }
            if (objs) {
                for(let item of objs) {
                    item.addEventListener('mouseup', act);
                } 
            }
            if (daps) {
                for(let item of daps) {
                    item.addEventListener('click', actDap);
                } 
            }
        },
        actStart: (e) => {
            const el = e.currentTarget;
            const wrap = el.closest('.js-dropArea');
            let curScale = wrap.getBoundingClientRect().width / wrap.offsetWidth;
            curScale = Number(curScale.toFixed(6));
            let _x;
            let _y;
            const wrap_t = wrap.getBoundingClientRect().top / curScale;
            const wrap_l = wrap.getBoundingClientRect().left / curScale;
            const wrap_w = wrap.offsetWidth;
            const wrap_h = wrap.offsetHeight;
            const el_w = el.offsetWidth;
            const el_h = el.offsetHeight;
            const el_x = e.offsetX * curScale;
            const el_y = e.offsetY * curScale;

            const actEnd = (e) => {
                _y = e.clientY / curScale - wrap_t;
                _x = e.clientX / curScale - wrap_l;

                document.removeEventListener('mousemove', actMove);
                document.removeEventListener('mouseup', actEnd);

                if ((_x < 0 + el_x) || (_y < 0 + el_y) || (_x + el_w > wrap_w + el_x) || (_y + el_h > wrap_h + el_y)) {
                    el.remove();
                }
               
            }
            const actMove = (e) => {
                _y = e.clientY / curScale - wrap_t;
                _x = e.clientX / curScale - wrap_l;

                // _x = (_x < 0 + el_x) ? 0 + el_x : (_x + el_w > wrap_w + el_x) ? wrap_w + el_x - el_w : _x;
                // _y = (_y < 0 + el_y) ? 0 + el_y : (_y + el_h > wrap_h + el_y) ? wrap_h + el_y - el_h : _y;

                el.style.top = _y - el_y  + 'px';
                el.style.left = _x - el_x  + 'px';
            }

            document.addEventListener('mousemove', actMove);
            document.addEventListener('mouseup', actEnd);
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
    
    Global.iframe = {
        init() {
            const ifr_wrap = document.querySelector('[data-iframe="true"]');
            const ifrm = ifr_wrap.querySelector('iframe');
            const popClose = ifr_wrap.querySelector('.popup_closeBtn');

            popClose.addEventListener('click', () => {
                const src = ifrm.getAttribute('src');
                
                setTimeout(() => {
                    ifrm.setAttribute('src', '');
                    ifrm.setAttribute('src', src);
                },600)
                
            })
        }
    }
    
})();

