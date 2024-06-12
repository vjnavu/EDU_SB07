(function () {
	'use strict';

	function $controller(opts) {
		return new CONTROL(opts);
	}

	function CONTROL(opts) {
		var self = this;

		this.container = opts.container;
		this.mediaType = opts.mediaType ? opts.mediaType : 'audio';
		this.controlType = opts.controlType ? opts.controlType : 'control';
		this.mediaArray = $ts.getEl(this.mediaType, this.container);
		this.mediaBtns = opts.mediaBtns;
		this.multiMode = (this.mediaArray.length > 1);
		this.media = this.mediaArray[0];
		this.media.setAttribute("allowfullscreen", "");
		// this.media.setAttribute("controls", "");
		this.index = opts.index ? opts.index : 0;
		this.thumbnail = (this.mediaType === 'video');
		this.screenPlayBtn = (this.mediaType === 'video');
		this.autoPlay = this.media.hasAttribute('data-auto-play');
		if (this.autoPlay) this.playPage = (opts.container.hasAttribute('data-current-page')) ? opts.container.getAttribute('data-current-page') : 1;
		this.mediaSync = opts.container.hasAttribute('data-sync') ? opts.container.getAttribute('data-sync') : false;
		this.isPlaying = false;
		this.caption = opts.container.hasAttribute('data-media-caption') ? true : false;
		this.fullMode = opts.container.hasAttribute('data-media-full') ? true : false;
		this.volume  = 1;
		this.pageIndex = 1;
		this.callBack = opts.callBack || null;
		// getter & setter
		Object.defineProperties(this, {
			fullscreenelement: { // get fullscreenElement by oks, 181129
				get: function () {
					return (document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.fullscreenElement) || null;
				}
			},
			isTouch: {
				get: function () {
					if (/Android/i.test(navigator.userAgent)) { // 안드로이드
						return "android";
					} else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) { // iOS
						return "ios";
					} else return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
				}
			},
			duration: {
				get: function() {
					return this.media.duration || this.mediaDuration;
				}
			},
			durSec: {
				get: function() {
					return Math.floor(this.duration % 60);
				}
			},
			durMin: {
				get: function() {
					return Math.floor(this.duration / 60);
				}
			},
			currTime: {
				get: function() {
					return this.media.currentTime;
				},
				set: function(sec) {
					if (this.media.currentTime) {
						this.media.currentTime = sec;
					}
				}
			},
			currSec: {
				get: function() {
					return Math.floor(this.currTime % 60);
				}
			},
			currMin: {
				get: function() {
					return Math.floor(this.currTime / 60);
				}
			},
			curDurRate: {
				get: function() {
					return this.currTime / this.duration;
				}
			},
			barSize: {
				get: function() {
					return this.handleBar && this.handleBar.getBoundingClientRect();
				}
			},
			barWidth: {
				get: function() {
					return this.barSize.right - this.barSize.left;
				}
			}
		});

		var callBack = opts.callBack;

		this.create = function () {
			// 컨트롤러 생성
			this.controller = $ts.ce({tag: 'div', class: 'controller', parent: this.container});
			this.handleBar = $ts.ce({tag: 'div', class: 'handleBar', parent: this.controller});
			this.handleColorBar = $ts.ce({tag: 'div', class: 'handleColorBar', parent: this.handleBar});
			this.handler = $ts.ce({tag: 'div', class: 'handler', parent: this.handleBar});
			// 타이머 생성
			this.timeContainer = $ts.ce({tag: 'div', class: 'timeContainer', parent: this.controller});
			this.curTime = $ts.ce({tag: 'div', class: 'curTime', parent: this.timeContainer});
			this.totalTime = $ts.ce({tag: 'div', class: 'totalTime', parent: this.timeContainer});
			// button
			this.playBtn = $ts.ce({tag: 'div', class: 'playBtn', parent: this.controller, attr: {title: '재생'}});
			this.pauseBtn = $ts.ce({tag: 'div', class: 'pauseBtn', parent: this.controller, attr: {title: '일시 정지'}});
			this.stopBtn = $ts.ce({tag: 'div', class: 'stopBtn', parent: this.controller, attr: {title: '정지'}});

			this.muteBtn = $ts.ce({tag: 'div', class: 'muteBtn', parent: this.controller, attr: {title: '음소거'}});

			if (this.mediaType !== 'audio') {
				if(this.fullMode){
					this.fullScreenBtn = $ts.ce({
						tag: 'div',
						class: 'fullScreenBtn',
						parent: this.controller,
						attr: {title: '전체 화면'}
					});
				}
				if(this.caption){
					this.captionBtn = $ts.ce({
						tag: 'div',
						class: 'captionBtn',
						parent: this.controller,
						attr: {title: '자막'}
					});
				}
				this.closeBtn = $ts.ce({
					tag: "div",
					class: "closeBtn",
					parent: this.container,
					attr: {
						title: "닫기"
					}
				});
			}

			return this;
		}

		this.addEvent = function () {
			// 전체 화면
			// mediaType이 video인 경우만 fullscreenchange 이벤트 add
			// 20.02.13 oks
			if (this.mediaType === 'video') {
				document.addEventListener('fullscreenchange', this.fullScreenHandler, false);
				document.addEventListener('webkitfullscreenchange', this.fullScreenHandler, false);
				document.addEventListener('mozfullscreenchange', this.fullScreenHandler, false);
				document.addEventListener('MSFullscreenChange', this.fullScreenHandler, false);
			}
			// 버튼
			this.playBtn.addEventListener('click', this.play.bind(this));
			this.pauseBtn.addEventListener('click', this.pause.bind(this, this.pauseBtn));
			this.stopBtn.addEventListener('click', this.pause.bind(this, this.stopBtn));
			if(this.muteBtn){
				this.muteBtn.addEventListener('click', this.mute.bind(this, this.muteBtn));
				this.muteBtn.addEventListener('click', $efSound.click);
				$ts.addHoverEvents(this.muteBtn);
			}

			$ts.addHoverEvents(this.playBtn);
			$ts.addHoverEvents(this.pauseBtn);
			$ts.addHoverEvents(this.stopBtn);

			// sound
			this.playBtn.addEventListener('click', $efSound.click);
			this.pauseBtn.addEventListener('click', $efSound.click);
			this.stopBtn.addEventListener('click', $efSound.click);
			if(this.closeBtn){
				this.closeBtn.addEventListener("click", this.close.bind(this, this.closeBtn));
				$ts.addHoverEvents(this.closeBtn);
				this.closeBtn.addEventListener("click", $efSound.click);
			}

			// 미디어 재생 버튼(data-media-btn)이 별도로 있는 경우
			if (this.mediaArray.length > 1 && this.mediaBtns) {
				for (var i in this.mediaBtns) {
					this.mediaBtns[i].addEventListener('click', this.changeMedia.bind(this, this.mediaBtns[i]));
					$ts.addHoverEvents(this.mediaBtns[i]);

					// 18.12.28 spvog - mediaBtns에 class 추가
					if (this.mediaBtns[i].getAttribute('data-media-btn') == 1) this.mediaBtns[i].classList.add('on');

					// sound
					this.mediaBtns[i].addEventListener('click', $efSound.click);
				}
			}

			// 재생 모드가 스피커일 경우
			if (this.controlType === 'speaker' && this.speaker) {
				this.speaker.addEventListener('click', this.speakerPlay.bind(this));
				$ts.addHoverEvents(this.speaker);

				// sound
				this.speaker.addEventListener('click', $efSound.click);
			}

			// 컨트롤바(드래그)
			this.handleBar.addEventListener('click', this.clickBar.bind(this));
			this.handler.addEventListener('mousedown', this.dragHandler.bind(this));
			this.handler.addEventListener('touchstart', this.dragHandler.bind(this));

			if (this.mediaType !== 'audio') {
				if(this.fullMode){
					this.fullScreenBtn.addEventListener('click', this.fullScreen.bind(this));
					$ts.addHoverEvents(this.fullScreenBtn);
				}
			}
		};

		this.fullScreen = function () {
			if (this.media.requestFullscreen) {
				this.media.requestFullscreen();
			} else if (this.media.msRequestFullscreen) { // Internet Explorer
				this.controlsOn(); // 전체 화면 전환 전, 컨트롤러 미리 생성
				this.media.msRequestFullscreen();
			} else if (this.media.mozRequestFullScreen) { // Gecko (Firefox)
				this.media.mozRequestFullScreen();
			} else if (this.media.webkitRequestFullscreen) { // WebKit (Safari) / Blink (Chrome & Opera) / Edge
				this.media.webkitRequestFullscreen();
			} else if (this.media.webkitEnterFullScreen) {
				this.media.webkitEnterFullScreen();
			}

			if (this.isTouch === "ios") { // iOS인 경우
				window.setTimeout(function () {
					self.isPlayOff();
				});
			}
		};

		this.fullScreenHandler = function () {
			if (!self.fullscreenelement) { // fullscreen mode 가 풀리는 경우
				self.fullScreenOff();
			} else { // fullscreen mode 가 되는 경우
				self.fullScreenOn();
			}
		};

		this.timer = function () {
			this.curTime.innerHTML = adjVal(this.currMin) + ':' + adjVal(this.currSec);
			this.totalTime.innerHTML = adjVal(this.durMin) + ':' + adjVal(this.durSec);

			function adjVal(number) { return number < 10 ? '0' + number : number.toString(); }
		};

		this.getData = function () {
			var data = {};

			data.barSize = this.handleBar.getBoundingClientRect();
			data.barTotalSize = data.barSize.right - data.barSize.left;
			data.handlerWidth = this.handler.getBoundingClientRect().width / 2;

			return data;
		};

		this.resetMediaBtn = function () {
			for (var i in this.mediaBtns) this.mediaBtns[i].classList.remove('on');
		};

		this.changeMedia = function (btn) {
			var index = btn.getAttribute('data-media-btn');

			this.stop();

			// 18.12.28 spvog - mediaBtns에 class 추가
			this.resetMediaBtn();
			btn.classList.add('on');

			for (var i in this.mediaArray) {
				if (this.mediaArray[i].getAttribute('data-media-index') == index) {
					this.media = this.mediaArray[i];
					this.mediaArray[i].removeEventListener('ended', this.stop.bind(this));
					break;
				}
			}

			this.timer();
			// this.play();
			this.media.addEventListener('ended', this.stop.bind(this));
		};

		this.speakerPlay = function () {
			if (this.isPlay) {
				this.stop();
				this.speaker.classList.remove('on');
			} else {
				this.play();
				this.speaker.classList.add('on');
			}
		};

		this.playing = function () {
			this.timeUpdate = setInterval(playing.bind(this), 100);

			function playing() {
				if (this.media.readyState === 2) {
					window.temp_currTime2 = this.currTime;
					this.stop();
					this.currTime = window.temp_currTime2;
					this.play();
				}
				self.changeHandlerPosition(self.curDurRate);
			}
		};

		this.offBtn = function () {
			this.isPlay = false;
			this.isPlayOff();
		};

		this.play = function () {

			if (this.callBack && this.callBack.play) this.callBack.play(this);

			this.isPlaying = true;

			this.offBtn();
			this.isPlayOn();
			if (this.mediaType === 'video') this.thumbnail.classList.add('off');
			this.media.currentTime = this.currTime;
			this.media.play();
			this.playing();
		};

		this.pause = function (btn) {
			this.offBtn();
			this.media.pause();
			// if (this.speakerBtn) this.speakerBtn.classList.remove('isPlay');
			if (btn.className.indexOf('pause') > -1) console.log('pause');
			else this.stop();

			this.isPlaying = false;

			clearInterval(this.timeUpdate);

			if (this.callBack && this.callBack.pause) this.callBack.pause(this);
		};

		this.close = function() {
			this.stop(),
			this.callBack && this.callBack.close && this.callBack.close(this),
			this.container.classList.remove('started');
		}

		this.stop = function () {
			this.isPlaying = false;

			if (this.controlType === 'speaker') {
				this.speaker.classList.remove('on');
			}

			this.offBtn();
			this.media.pause();
			if (this.media.currentTime) {
				this.media.currentTime = 0;
			}
			if (this.thumbnail) {
				this.thumbnail.classList.remove('off');
			}
			this.changeCurTime(0);
			this.changeHandlerPosition(0);

			clearInterval(this.timeUpdate);

			if (this.callBack && this.callBack.stop) {
				this.callBack.stop(this);
			}
		};
		this.mute = function (btn) {
			if(btn.classList.contains('on')){
				btn.classList.remove('on');
				this.media.muted = false;
			}else{
				btn.classList.add('on');
				this.media.muted = true;
			}
		};
		this.clickBar = function (e) {
			var eventX, rate;
			// var data = {};
			eventX = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;

			// data.changeLeftValue = this.LEFT - self.barSize.left;
			// data.rate = data.changeLeftValue / self.barWidth;

			rate = this.getRateByBarEventX(eventX);

			this.changeHandlerPosition(rate);
			this.changeCurTime(rate);
		};

		this.dragHandler = function (e) {
			var eventX, rate;
			var currentMedia = this.media;
			// var data = self.getData();

			eventX = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;
			rate = this.getRateByBarEventX(eventX);

			document.addEventListener('mousemove', move);
			document.addEventListener('touchmove', move);
			document.addEventListener('mouseup', end);
			document.addEventListener('touchend', end);

			this.changeHandlerPosition(rate);
			this.changeCurTime(rate);

			function move(e) {
				eventX = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;
				rate = self.getRateByBarEventX(eventX);

				// data.changeLeftValue = self.LEFT - data.barSize.left;
				// data.rate = data.changeLeftValue / data.barTotalSize;
				// 200413 add: 컨트롤러 드래그 시 음원 정지
				currentMedia.pause();

				self.changeHandlerPosition(rate);
				self.changeCurTime(rate);
			}

			function end() {
				document.removeEventListener('mousemove', move);
				document.removeEventListener('touchmove', move);
				document.removeEventListener('mouseup', end);
				document.removeEventListener('touchend', end);

				if (rate >= 1) {
					self.stop();
				}
				else if (self.isPlaying) {
					// 200413 add: 컨트롤러 드래그 시 음원 정지
					currentMedia.play();
				}
			}
		};

		this.getRateByBarEventX = function(eventX) {
			var changedLeft, rate;
			changedLeft = eventX - this.barSize.left;
			rate = changedLeft / self.barWidth;
			return rate;
		};

		this.changeHandlerPosition = function (rate) {
			var RATE_IS_LT_ZERO, RATE_IS_GT_ONE, handlerLeft, transformStr, colorBarWidth;
			RATE_IS_LT_ZERO = rate <= 0;
			RATE_IS_GT_ONE = rate >= 1;

			if (RATE_IS_LT_ZERO) {
				handlerLeft = 0;
				colorBarWidth = '0';
			} else if (RATE_IS_GT_ONE) {
				handlerLeft = this.barWidth / gameManager.zoomRate;
				colorBarWidth = "100%";
			} else {
				handlerLeft = this.barWidth * rate / gameManager.zoomRate;
				colorBarWidth = rate * 100 + "%";
			}

			transformStr = 'translateX(' + handlerLeft + 'px)';

			this.handler.style.transform = transformStr;
			this.handler.style.msTransform = transformStr;
			this.handler.style.mozTransform = transformStr;
			this.handler.style.webkitTransform = transformStr;
			this.handleColorBar.style.width = colorBarWidth;
			this.timer();
		};

		this.changeCurTime = function (rate) {
			var duration = isNaN(this.media.duration) ? this.mediaDuration : this.media.duration;
			var MIN = rate <= 0;
			var MAX = rate >= 1;
			if (this.currTime || !isNaN(this.currTime)) {
				if (MIN) {
					this.currTime = 0;
				} else if (MAX) {
					this.currTime = duration;
				} else {
					this.currTime = duration * rate;
					this.media.currentTime = duration * rate;
				}
			}
			this.timer();
		};

		this.startAutoPlay = function (delay) {
			// var autoPlayDelay = this.media.getAttribute('data-auto-play');
			// if (this.setTimeAutoPlay) clearTimeout(this.setTimeAutoPlay);
			this.setTimeAutoPlay = setTimeout(function () {
				self.play();
			}, delay);
		};

		this.initThumnail = function() {
			if (this.thumbnail) {
				var thumbnail = $ts.ce({tag: 'div', class: 'mediaThumbnail', parent: this.container}),
				src = this.media.getAttribute('poster');

				// thumbnail.style.display = 'block';
				thumbnail.style.background = 'url(' + src + ') top center no-repeat';
				thumbnail.style.backgroundSize = 'contain';
				this.thumbnail = thumbnail;
			}
		};

		this.initScreenPlayBtn = function() {
			if (this.screenPlayBtn) {
				this.screenPlayBtn = $ts.ce({
					tag: 'div',
					class: 'screenPlayBtn videoPlayBtn',
					parent: this.container.querySelector('.mediaThumbnail')
					// attr: {title: '재생'}
				});
				this.screenPlayBtn = this.container.querySelector('.screenPlayBtn');
				this.screenPlayBtn.addEventListener('click', this.play.bind(this));
				$ts.addHoverEvents(this.screenPlayBtn);

				// sound
				this.screenPlayBtn.addEventListener('click', $efSound.click);
			}
		};

		this.set = function () {
			this.container.classList.add(this.mediaType);

			this.initThumnail();
			this.initScreenPlayBtn();

			// 컨트롤러 타입이 'control'일 때에만 controller 보이기
			if (this.controlType === 'control') this.container.classList.add('on');
			// 컨트롤러 타입이 'speaker'인 경우
			if (this.controlType === 'speaker') {
				var index = this.container.getAttribute('data-speaker-media');
				this.speaker = $ts.getEl('[data-speaker="' + index + '"]')[0];
			}
			// 자동 재생(autoPlay)이 있는 경우 자동 재생 실행
			if (this.autoPlay && this.playPage == 1) this.startAutoPlay(this.media.getAttribute('data-auto-play'));
			// 볼륨 컨트롤이 있는 경우 실행
			if (this.volumeControl) window.$run('$volumeControl', function () {
				window.$volumeControl(this);
			});

			this.getDuration();

			this.media.addEventListener('ended', this.stop.bind(this));
			this.media.addEventListener('playing', function () {
				self.isPlaying = true;
				self.isPlay = true;
			});
			this.create().addEvent();
		};

		this.getDuration = function() {
			var intervalID = setInterval(intervalFn);

			function intervalFn() {
				if (self.media.readyState) {
					clearInterval(intervalID);
					self.mediaDuration = self.media.duration;
					self.timer();
				}
			}
		};

		this.fullScreenOff = function () { // fullscreen 꺼질 시 실행 by oks, 181129
			this.controlsOff();
			this.container.classList.remove('isFullscreen'); // container에 isFullscreen class 제거 by oks, 200213
			if (this.media.paused) { // 정지 상태일 경우
				this.isPlayOff();
			} else { // 재생 상태일 경우
				this.isPlayOn();
			}
			if(this.media.muted){
				this.muteBtn.classList.add('on');
			}else{
				this.muteBtn.classList.remove('on');
			}
		};

		this.fullScreenOn = function () { // fullscreen 켜질 시 실행 by oks, 181129
			this.container.classList.add('isFullscreen'); // container에 isFullscreen class 추가 by oks, 200213
			this.controlsOn();
		};

		this.controlsOn = function () { // native 컨트롤 켜기 by oks, 181129
			this.media.setAttribute("controls", "");
		};

		this.controlsOff = function () { // native 컨트롤 끄기 by oks, 181129
			this.media.removeAttribute("controls");
		};

		this.isPlayOn = function () { // container 버튼 playing 상태로 by oks, 181129
			this.container.classList.add("isPlay");
		};

		this.isPlayOff = function () { // container 버튼 paused 상태로 by oks, 181129
			this.container.classList.remove("isPlay");
		};

		this.set();
	}

	window.$controller = $controller;

})();

(function () {
	'use strict';

	function $rolePlay(opts) {
		return new ROLEPLAY(opts);
	}

	function ROLEPLAY(opts) {
		var self = this;
		this.type = opts.type;
		this.index = opts.index;
		this.syncData = opts.sync;
		this.syncIndex = 0;

		this.element = opts.sync.element ? opts.sync.element : false;
		this.preObjview = opts.preObjview ? opts.preObjview : false;
		this.bringToFront = opts.bringToFront !== undefined ? opts.bringToFront : true;
		this.mediaIndex = opts.mediaIndex ? opts.mediaIndex : false;

		// 18.12.20 spvog - musicSync 추가
		if (this.type === 'musicSync') var syncInfo = opts.sync;

		this.createCation = function () {
			// this.captionBtn = $ts.ce({tag:'div',class:'captionBtn',parent:this.mediaController.controller});
			this.captionBtn = this.mediaController.captionBtn;
			this.captionContainer = $ts.ce({
				tag: 'div',
				class: 'captionContainer',
				parent: this.mediaController.container
			});
			this.captionText = $ts.ce({tag: 'div', class: 'captionText', parent: this.captionContainer});

			this.captionText.innerHTML = this.syncData.text[0].text;
		}
		this.addEvent = function () {
			if (this.captionBtn) {
				this.captionBtn.classList.add('on');
				this.captionBtn.addEventListener('click', this.toggleCaption.bind(this));
				$ts.addHoverEvents(this.captionBtn);

				// sound
				this.captionBtn.addEventListener('click', $efSound.click);
			}
		}
		this.toggleCaption = function () {
			if (this.captionContainer.classList.contains('on')) this.captionContainer.classList.remove('on');
			else this.captionContainer.classList.add('on');
		}
		this.getSyncTarget = function () {
			var container = $ts.getEl('[data-sync-container="' + this.syncData.container + '"]')[0],
			// target = $ts.getEl('[data-sync-target]', container),
			// 18.12.20 spvog - this.element 속성 추가
			target = (this.element) ? $ts.getEl(this.element, container) : $ts.getEl('[data-sync-target]', container),
			targetText = (this.element) ? this.element.replace('[', '').replace(']', '') : 'data-sync-target',
			targetArray = new Array(this.syncData.time.length);

			for (var i = 0; i < targetArray.length; i++) targetArray[i] = [];
			for (var i in target) {
				targetArray[target[i].getAttribute(targetText) - 1].push(target[i]);
			}

			this.syncData.target = targetArray;
			this.syncData.targetOn = $ts.getEl('[data-target-on]', container);
		}

		this.syncPlay = function () {// console.log('syncAni');
		// if (this.mediaController.isPlaying) this.clearSync();
		// else console.log('media not playing');
		if (this.syncAni) clearInterval(this.syncAni);

		// 18.12.20 spvog - mediaIndex에 맞춰서 싱크 실행
		// console.log(this.mediaIndex, this.mediaController.media.getAttribute('data-media-index'))
		if (this.mediaIndex && this.mediaIndex != this.mediaController.media.getAttribute('data-media-index')) return;

		this.syncAni = setInterval(function () {
			var preIndex = self.syncIndex;

			self.syncIndex = self.getSyncIndex();

			if (self.syncIndex == null) self.clearSync();
			else if (preIndex !== self.syncIndex) {
				// 18.12.20 spvog - preObjview 추가 // 19.01.29 spvog - 수정
				if (self.preObjview) {
					console.log('preview Object viewMode');
					self.clearSync();
					for (var i = 0; i < self.syncIndex; i++) {
						self.addClass({target: self.syncData.target[i], class: 'on'});
					}
				}
				else self.clearSync({targetIdx: preIndex});

				self.activeSync(self.syncIndex);
			}
			// 18.12.28 spvog - interval 취소
			else {
				if (this.syncAni) clearInterval(this.syncAni);
			}

		}, 2);

	}
	this.getSyncIndex = function (curTime) {
		var curTime = self.mediaController.media.currentTime,
		curIndex = null;

		for (var i in this.syncData.time) {
			if (curTime >= this.syncData.time[i][0] && curTime < this.syncData.time[i][1]) curIndex = i;
		}

		return curIndex;
	}
	this.activeSync = function (index) {// console.log('activeSync');
	// 18.12.20 spvog - preObjview 추가
	if (!self.preObjview) this.clearSync();

	if (this.type === 'caption') this.captionText.innerHTML = this.syncData.text[index].text;
	else if (this.type === 'rolePlay') {
	} else if (this.type === 'target') {
		this.addClass({target: this.syncData.target[index], class: 'on'});

		// activeSync callback 추가 oks 20.03.11
		if (this.syncData.callbacks.activeSync) {
			this.syncData.callbacks.activeSync(this.syncData.target[index]);
		}
	} else if (this.type === 'imageSwitch') {
		this.syncData.target.src = this.syncData.images[index];
	}
	// 18.12.20 spvog - musicSync 추가
	else if (this.type === 'musicSync') {
		var targetElement = this.syncData.target[index];
		this.addClass({target: targetElement, class: 'on'});
		console.log(this.bringToFront)
		if (targetElement)
		if (this.bringToFront) targetElement[0].parentNode.appendChild(targetElement[0]);
	}
}
this.clearSync = function (opts) {// console.log('clearSync')
if (this.type === 'caption') this.captionText.innerHTML = '';
else if (this.type === 'rolePlay') this.muted(false);
else if (this.type === 'target' || this.type === 'musicSync') {
	if (opts && opts.targetIdx) {
		console.log('targetIdx', opts.targetIdx)
		this.removeClass({target: this.syncData.target[opts.targetIdx], class: 'on'});

		// clearSync callback 추가 oks 20.03.11
		if (this.syncData.callbacks.clearSync) {
			this.syncData.callbacks.clearSync(this.syncData.target[opts.targetIdx]);
		}
	} else {
		for (var i in this.syncData.target) {
			this.removeClass({target: this.syncData.target[i], class: 'on'});
		}
	}

} else if (this.type === 'imageSwitch') this.syncData.target.src = '';

if (!this.mediaController.isPlaying) {
	console.log('stop????', this.syncAni);
	clearInterval(this.syncAni);
}
}
this.syncPause = function () {
	clearInterval(this.syncAni);
}
this.addClass = function (opts) {
	for (var i in opts.target) {
		var target;
		target = opts.target[i];
		if (target.classList) { // classList 있는 경우
			target.classList.add(opts.class)
		} else { // classList 없는 경우 (IE 11, svg)
			if (!target.className.baseVal) { // className 없는 경우
				target.className.baseVal = opts.class;
			} else {
				target.className.baseVal = target.className.baseVal + " " + opts.class;
			}
		}
	}
};
this.removeClass = function (opts) {
	for (var i in opts.target) {
		var target, targetClassName, indexOfClass;
		target = opts.target[i];
		if (target.classList) { // classList 있는 경우
			target.classList.remove(opts.class)
		} else { // classList 없는 경우 (IE 11, svg)
			targetClassName = target.className.baseVal;
			indexOfClass = targetClassName.indexOf(opts.class);
			if (targetClassName.length === opts.class.length) { // element className 이 지우고자 하는 class name 과 같을 경우
				target.className.baseVal = "";
			} else if (indexOfClass === 0) { // element className 의 첫 자리에 지우고자 하는 class name 이 있는 경우
				target.className.baseVal = targetClassName.slice(opts.class.length + 1, targetClassName.length);
			} else if (indexOfClass + opts.class.length === targetClassName.length) { // element className 의 끝 자리에 지우고자 하는 class name 이 있는 경우
				target.className.baseVal = targetClassName.slice(0, indexOfClass - 1);
			} else {
				target.className.baseVal = targetClassName.slice(0, indexOfClass - 1) + targetClassName.slice(indexOfClass, targetClassName.length);
			}
		}
	}
};
this.switchClass = function (opts) {
	for (var i in opts.target) opts.target[i].className = opts.target[i].className.replace(opts.currentClass, opts.changeClass);
}
this.syncEnd = function () {
	console.log('syncEnd', this.syncAni)
	if (this.syncAni) clearInterval(this.syncAni);
	this.clearSync();
	this.syncIndex = 0;

	if (this.type === 'target' && this.syncData.targetOn) {
		this.addClass({target: this.syncData.targetOn, class: 'on'});
	}
}
this.muted = function (mute) {
	if (mute) {
		this.mediaController.media.muted = true;
		this.mediaController.media.volume = 0;
	} else {
		this.mediaController.media.muted = false;
		this.mediaController.media.volume = this.mediaController.volume;
	}
}
this.reset = function () {
	this.syncEnd();
	if (this.captionContainer) this.captionContainer.classList.remove('on');
}
this.getMedia = function (callback) {
	var self, intervalID;
	self = this;
	intervalID = window.setInterval(function () {
		var controllerArray;
		controllerArray = window.$pm.array.controller;
		if (!!controllerArray) {
			window.clearInterval(intervalID);
			for (var i in controllerArray) {
				if (parseInt(controllerArray[i].mediaSync) === self.index) {
					self.mediaController = controllerArray[i];
				}
			}
			callback();
		}
	});
}
// 18.12.20 spvog - musicSync 추가
this.setMusicSync = function () {

	this.svgs = syncInfo.svgs;
	this.svgElement = document;
	this.noteKey = syncInfo.noteKey;
	this.noteName = syncInfo.noteName ? syncInfo.noteName : '#bar_';
	this.startTime = syncInfo.start;
	this.endTime = syncInfo.end;
	this.noteCount = syncInfo.noteSyncData.length;
	this.noteSyncData = syncInfo.noteSyncData;
	this.meter = syncInfo.meter;
	this.mode = syncInfo.mode;
	this.speedAdjust = syncInfo.speedAdjust;

	this.beat = ((this.endTime - this.startTime) / this.noteCount) + this.speedAdjust;

	function initNote() {
		var index = 0, target = [];

		self.svgs.forEach(function (value, idx) {
			var svgElement = document.querySelector('#' + value);
			var bar = svgElement.querySelector(self.noteName + (idx + 1));

			for (var i = 0; i < bar.children.length; i++) {
				if (bar.children[i].nodeName !== '#text' && bar.children[i].getAttribute('pass') !== 'true') {
					bar.children[i].setAttribute('id', self.getNoteId(index));
					bar.children[i].setAttribute('svgId', idx + 1);
					target.push([bar.children[i]]);
					index++;
				}
			}
		});
		// console.log('target', target);
		self.syncData.target = target;
	}

	function initTime() {
		var startTime, endTime,
		timeArray = [];

		self.noteSyncData.forEach(function (value, idx) {

			if (syncInfo.bridge) {
				syncInfo.bridge.forEach(function (bridgevalue, bridgeidx) {
					// if (idx == 54) console.log('startTime', startTime);
					if (startTime >= bridgevalue.start && startTime < bridgevalue.end) {
						startTime = bridgevalue.end;
						console.log('bridgeidx', idx);
						// console.log('bridgeidx', startTime);
						// console.log('bridge', startTime);
					} else startTime = (idx == 0) ? self.startTime : timeArray[idx - 1][1];
				})
			} else startTime = (idx == 0) ? self.startTime : timeArray[idx - 1][1];

			endTime = startTime + (value * self.beat);

			// time = [value * self.beat, self.noteSyncData[idx+1] * self.beat]
			timeArray.push([startTime, endTime]);
		})

		console.log(timeArray)
		self.syncData.time = timeArray;
	}

	initNote();
	initTime();

}
this.getNoteId = function (syncIndex) {
	var index = syncIndex + 1;
	if (index < 10) {
		index = this.noteKey + '00' + index;
	} else if (index < 100) {
		index = this.noteKey + '0' + index;
	} else {
		index = this.noteKey + index;
	}

	return index;
}

this.addMediaEvent = function () {
	this.mediaController.media.removeEventListener('play', this.syncPlay.bind(this));
	this.mediaController.media.removeEventListener('ended', this.syncEnd.bind(this));
	this.mediaController.handleBar.removeEventListener('click', this.syncPlay.bind(this));
	this.mediaController.pauseBtn.removeEventListener('click', this.syncPause.bind(this));
	this.mediaController.stopBtn.removeEventListener('click', this.syncEnd.bind(this));

	this.mediaController.media.addEventListener('play', this.syncPlay.bind(this));
	this.mediaController.media.addEventListener('ended', this.syncEnd.bind(this));
	this.mediaController.handleBar.addEventListener('click', this.syncPlay.bind(this));
	this.mediaController.pauseBtn.addEventListener('click', this.syncPause.bind(this));
	this.mediaController.stopBtn.addEventListener('click', this.syncEnd.bind(this));
}

this.set = function () {
	var self = this;
	var mediaBtns = $ts.getEl('[data-media-btn]');

	this.getMedia(function () {
		if (self.type === 'caption') {
			self.createCation();
			self.addEvent();
		} else if (self.type === 'rolePlay') self.createRolePlay();
		else if (self.type === 'target') self.getSyncTarget();
		else if (self.type === 'imageChange') {
		} else if (self.type === 'musicSync') self.setMusicSync();

		self.addMediaEvent();

		if (mediaBtns) {
			for (var i in mediaBtns) {
				mediaBtns[i].addEventListener('click', self.addMediaEvent.bind(self));
				mediaBtns[i].addEventListener('click', self.syncEnd.bind(self));
			}
		}

		// self.mediaController.media.addEventListener('play', self.syncPlay.bind(self));
		// self.mediaController.media.addEventListener('ended', self.syncEnd.bind(self));
		// self.mediaController.handleBar.addEventListener('click', self.syncPlay.bind(self));
		// self.mediaController.pauseBtn.addEventListener('click', self.syncPause.bind(self));
		// self.mediaController.stopBtn.addEventListener('click', self.syncEnd.bind(self));
		if (self.mediaController.controlType === 'speaker') self.mediaController.speaker.addEventListener('click', self.syncEnd.bind(self));

	});
};

this.set();
};

window.$rolePlay = $rolePlay;
})();


(function () {
	function $volume(opts) {
		return new VOLUME(opts);
	}

	function VOLUME(opts) {
		var self = this;

		this.container = opts.container;
		this.mediaController = opts.controller;
		this.volume = opts.volume;

		this.create = function () {
			this.volumeContainer = $ts.ce({tag: 'div', class: 'volumeContainer', parent: this.controller});
			this.muteBtn = $ts.ce({tag: 'div', class: 'muteBtn', parent: this.volumeContainer});
			this.handleBar = $ts.ce({tag: 'div', class: 'handleBar', parent: this.volumeContainer});
			this.handleColorBar = $ts.ce({tag: 'div', class: 'handleColorBar', parent: this.handleBar});
			this.handler = $ts.ce({tag: 'div', class: 'handler', parent: this.handleBar});

			return this;
		}
		this.addEvent = function () {
			this.handleBar.addEventListener('click', this.clickBar.bind(this));
			this.handler.addEventListener('mousedown', this.dragHandler.bind(this));
			this.handler.addEventListener('touchstart', this.dragHandler.bind(this));
		}
		this.reset = function () {
		}
		this.getData = function () {
			var data = {};

			data.barSize = this.handleBar.getBoundingClientRect();
			data.barTotalSize = data.barSize.right - data.barSize.left;
			data.handlerWidth = this.handler.getBoundingClientRect().width / 2;

			return data;
		}
		this.clickBar = function (e) {
			var data = this.getData();
			this.LEFT = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;

			data.changeLeftValue = this.LEFT - data.barSize.left;
			data.rate = data.changeLeftValue / data.barTotalSize * 100;

			this.changeHandlerPosition(data);
			this.changeCurTime(data);
		}
		this.dragHandler = function (e) {
			var data = self.getData();

			self.LEFT = (e.type === 'touchstart') ? e.touches[0].clientX : e.clientX;

			document.addEventListener('mousemove', move);
			document.addEventListener('touchmove', move);
			document.addEventListener('mouseup', end);
			document.addEventListener('touchend', end);

			function move(e) {
				self.LEFT = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;

				data.changeLeftValue = self.LEFT - data.barSize.left;
				data.rate = data.changeLeftValue / data.barTotalSize * 100;

				self.changeHandlerPosition(data);
				self.changeCurTime(data);
			}

			function end() {
				document.removeEventListener('mousemove', move);
				document.removeEventListener('touchmove', move);
				document.removeEventListener('mouseup', end);
				document.removeEventListener('touchend', end);
			}
		}
		this.changeHandlerPosition = function (data) {
			var handlerLeft = data.changeLeftValue / $pm.zoomRate;

			if (data.rate < 0) handlerLeft = null;
			else if (data.rate > 100) handlerLeft = data.barSize.width / $pm.zoomRate;

			this.handler.style.transform = 'translateX(' + handlerLeft + 'px)';
			this.handler.style.msTransform = 'translateX(' + handlerLeft + 'px)';
			this.handler.style.mozTransform = 'translateX(' + handlerLeft + 'px)';
			this.handler.style.webkitTransform = 'translateX(' + handlerLeft + 'px)';
			this.handleColorBar.style.width = (data.rate > 100) ? '100%' : data.rate + '%';
			// this.timer();
		}
		this.changeCurTime = function (data) {
			var duration = isNaN(this.media.duration) ? this.mediaDuration : this.media.duration;
			this.media.currentTime = duration * (data.rate / 100);
			// this.timer();
		}

		this.set = function () {
			this.create().addEvent();
		}

		this.set();
	}

	window.$volume = $volume;
})();


// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;(function(constructor) {
	if (constructor &&
		constructor.prototype &&
		constructor.prototype.children == null) {
			Object.defineProperty(constructor.prototype, 'children', {
				get: function() {
					var i = 0, node, nodes = this.childNodes, children = [];
					while (node = nodes[i++]) {
						if (node.nodeType === 1) {
							children.push(node);
						}
					}
					return children;
				}
			});
		}
	})(window.Node || window.Element);