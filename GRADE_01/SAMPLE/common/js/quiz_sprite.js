/*
    file name: $prite.js
    description: custom sprite animation object
    create date: 2018-01-10
    creator: saltgamer
    version: 0.15
*/

'use strict';

var spriteSheetImgList = {};
var $prite = $prite || {};
$prite = (function () {
    var sprite = {
        currentAni: null,
        currentSeq: 0,
        spriteList: {},
        sound: {},
        index: 0,
        row: 0,
        isChrome: navigator.userAgent.toLowerCase().indexOf('chrome') != -1,
        play: function () {

        },
        add: function (params) {
            var spriteId = params.spriteId;

            this.initSpriteListObj(spriteId);

            if (params.spriteList.length > 0) {
                params.spriteList.forEach(function (value, idx) {
                    var characterImg = createElement('div', params.target, 'characterImg quiz_type');

                    characterImg.style.top = value.top + 'px';
                    characterImg.style.left = value.left + 'px';

                    // 추가 hyun
                    characterImg.setAttribute("data-left", value.left);

                    if (value.circle) {
                        characterImg.classList.add('circle');
                        characterImg.classList.add(value.circle);
                    }

                    var thumbNailImg = createElement('div', characterImg, 'charSpriteImg');
                    thumbNailImg.style.backgroundImage = 'url(' + value.thumbNail + ')';
                    thumbNailImg.style.width = value.width + 'px';
                    thumbNailImg.style.height = value.height + 'px';

                    var spriteSheetImg = createElement('div', characterImg, 'charSpriteAni');
                    spriteSheetImg.style.backgroundImage = 'url(' + value.spriteSheet + ')';
                    spriteSheetImg.style.width = value.width + 'px';
                    spriteSheetImg.style.height = value.height + 'px';
                    spriteSheetImg.setAttribute('data-idx', idx);
                    if (sprite.isChrome) spriteSheetImg.style.opacity = 0;
                    spriteSheetImgList[spriteId] = spriteSheetImg;

                    sprite.spriteList[spriteId].characterList.push(characterImg);
                    sprite.spriteList[spriteId].sheetList.push(spriteSheetImg);
                    sprite.spriteList[spriteId].thumbNailList.push(thumbNailImg);

                    var sheetX = value.sheetWidth / value.width,
                        sheetY = value.sheetHeight / value.height,
                        frame = (sheetX * sheetY) - (value.endSheet + 1);

                    var spriteEvent = function (e) {
                        e.preventDefault();

                        if (this.classList.contains('waiting')) {
                            console.log('waiting');
                            this.classList.remove('waiting');
                            $prite.resetSprite(spriteId);

                            // 조건 추가.. 가운데로 이동 - hyun
                            if (value.movD != null) {
                                if (value.movD == 'left') {
                                    characterImg.style.left = value.left + 'px';
                                }
                                else if (value.movD == 'top') {
                                    characterImg.style.top = value.top + 'px';
                                }
                            }

                        }
                        // 조건 추가.. 왼쪽으로 이동 - hyun
                        if (value.movD != null) {

                            if (value.movD == 'left') {
                                characterImg.style.left = value.movPx + 'px';
                            }
                            else if (value.movD == 'top') {
                                characterImg.style.top = value.movPx + 'px';
                            }
                        }

                        var idx = this.getAttribute('data-idx');

                        sprite.allStopSound();
                        sprite.sound['sound_' + value.name].playSound();

                        sprite.hideOtherSprite();

                        for (var i = 0; i < sprite.spriteList[spriteId].sheetList.length; i++) {
                            sprite.spriteList[spriteId].thumbNailList[i].style.opacity = 1;
                            sprite.spriteList[spriteId].sheetList[i].classList.remove('waiting');
                        }
                        thumbNailImg.style.opacity = 0;

                        this.style.opacity = 1;
                        this.classList.add('waiting');
                        sprite.changeSpritePos({
                            x: '0',
                            y: '0',
                            target: this
                        });


                        if (value.circlePlayMode) {
                            sprite.initCirclePlayMode(spriteId, params.spriteList);

                            for (var i = 0; i < sprite.spriteList[spriteId].sheetList.length; i++) {
                                sprite.spriteList[spriteId].sheetList[i].style.pointerEvents = 'auto';
                            }
                            this.style.pointerEvents = 'none';

                        }

                        clearInterval(sprite.currentAni);
                        sprite.currentAni = null;

                        sprite.index = 0;
                        sprite.row = 0;
                        sprite.spriteAnimate({
                            delay: value.delay,
                            duration: frame * value.delay,
                            delta: makeEaseOut(linear),
                            step: function (delta) {
                                sprite.index++;
                                if (sprite.index >= sheetX) {
                                    sprite.index = 0;
                                    sprite.row++;
                                }
                                if (sprite.row === (sheetY - 1) && sprite.index === (sheetX - value.endSheet)) {

                                } else {
                                    sprite.changeSpritePos({
                                        x: -(sprite.index * value.width),
                                        y: -(sprite.row * value.height),
                                        target: spriteSheetImg
                                    });
                                }

                                if (delta === 1) {
                                    thumbNailImg.style.opacity = 1;
                                    spriteSheetImg.style.opacity = 0;
                                    if (value.circlePlayMode) {
                                        spriteSheetImg.style.pointerEvents = 'auto';
                                    }
                                }
                            }
                        });
                    };
                    spriteSheetImg.addEventListener('click', spriteEvent, false);

                    sprite.addSound({
                        id: 'sound_' + value.name,
                        src: value.sound,
                        autoPlay: false,
                        volume: 0.7,
                        callBack: function () {
                            thumbNailImg.style.opacity = 1;
                            spriteSheetImg.style.opacity = 0;

                            if (value.circlePlayMode) {
                                if (value.circlePlayMode.rewind) sprite.rewindMode(spriteId, params.spriteList);
                            }
                            if (value.playMode) {
                                if (value.playMode.rewind) sprite.playRewindMode(spriteId, params.spriteList);
                            }
                            if (sprite.spriteList[spriteId].sequenceList && sprite.spriteList[spriteId].sequenceList[sprite.currentSeq].callBack) {
                                sprite.spriteList[spriteId].sequenceList[sprite.currentSeq].callBack();
                            }

                            sprite.currentSeq++;
                            if (sprite.spriteList[spriteId].sequenceList && sprite.spriteList[spriteId].sequenceList[sprite.currentSeq]) {
                                var seq = sprite.spriteList[spriteId].sequenceList[sprite.currentSeq].seq;
                                sprite.spriteList[spriteId].sheetList[seq - 1].click();
                            } else {
                                sprite.currentSeq = 0;
                            }




                        }
                    });

                });
            } else {
                alert('$pAni error: spriteList parameter is not find!');
            }

        },
        initSpriteListObj: function (name) {
            this.spriteList[name] = {
                sheetList: [],
                characterList: [],
                thumbNailList: [],
                sequenceList: null
            };
        },
        changeSpritePos: function (params) {
            params.target.style.backgroundPositionX = params.x + 'px';
            params.target.style.backgroundPositionY = params.y + 'px';
            params.target.style.transform = 'rotate(0.1deg)';

        },
        spriteAnimate: function (opts) {
            var start = new Date;

            var id = setInterval(function () {
                var timePassed = new Date - start,
                    progress = timePassed / opts.duration;

                if (progress > 1)
                    progress = 1;

                var delta = opts.delta(progress);
                opts.step(delta);

                if (progress === 1) {
                    clearInterval(id);
                }
            }, opts.delay);

            sprite.currentAni = id;
        },
        Sound: function (params) {
            var sound = this;
            sound.element = params.element;
            if (params.volume) sound.element.volume = params.volume;
            if (params.loop) sound.element.loop = params.loop;
            if (params.callBack) sound.callBack = params.callBack;
            sound.endSound = function () {
                sound.element.removeEventListener('ended', sound.endSound);
                if (params.callBack) params.callBack();
                hidePopup();
            };
            sound.loadAndPlay = function () {
                sound.element.removeEventListener('loadeddata', sound.loadAndPlay);
                sound.element.removeEventListener('ended', sound.endSound);
                sound.element.addEventListener('ended', sound.endSound);
                if (params.autoPlay) sound.element.play();
            };
            sound.setSrc = function (src) {
                sound.element.src = src;
                sound.element.addEventListener('loadeddata', sound.loadAndPlay);
                sound.element.load();
            };
            sound.seek = function () {
                return sound.element.currentTime;
            };
            sound.playSound = function () {
                sound.element.removeEventListener('loadeddata', sound.loadAndPlay);
                sound.element.removeEventListener('ended', sound.endSound);
                sound.element.addEventListener('ended', sound.endSound);
                sound.element.play();
            };
            sound.setSrc(params.src);
        },
        addSound: function (params) {

            var soundElement = createElement('audio', document.body, '');
            soundElement.setAttribute('id', params.id);
            soundElement.style.display = 'none';

            this.sound[params.id] = new sprite.Sound({
                id: params.id,
                element: soundElement,
                src: params.src,
                autoPlay: params.autoPlay,
                volume: params.volume,
                loop: params.loop,
                callBack: params.callBack
            });
            /*console.log('---------------------------');
            console.log('$$: ', this.sound[params.id]);
            console.log('$$: ', this.sound);
            console.log('---------------------------');*/

        },
        allStopSound: function () {
            //console.log('- sprite.sound: ', this.sound);
            for (var index in this.sound) {
                //console.log('-index: ', index);
                this.sound[index].element.pause();
                // this.sound[index].element.currentTime = 0;
                /* IE11 exception isNaN 20180116 */
                if (!isNaN(this.sound[index].element.currentTime)) this.sound[index].element.currentTime = 0;
            }

        },
        initCirclePlayMode: function (spriteId, spriteList) {
            //console.log('-> initCirclePlayMode: ', spriteList);

            sprite.spriteList[spriteId].characterList.forEach(function (value, idx) {
                value.classList.add('circle');
                value.classList.add(spriteList[idx].circlePlayMode.class);
                value.style.top = spriteList[idx].circlePlayMode.top + 'px';
                value.style.left = spriteList[idx].circlePlayMode.left + 'px';


            });

        },
        rewindMode: function (spriteId, spriteList) {
            //console.log('-> rewindMode: ', spriteList);
            sprite.spriteList[spriteId].characterList.forEach(function (value, idx) {
                value.style.top = spriteList[idx].top + 'px';
                value.style.left = spriteList[idx].left + 'px';
                sprite.spriteList[spriteId].sheetList[idx].classList.remove('waiting');
            });

        },

        // 추가.. 나레이션 종료 시 원래 위치로 이동 - hyun
        playRewindMode: function (spriteId, spriteList) {
            //console.log('-> rewindMode: ', spriteList);
            sprite.spriteList[spriteId].characterList.forEach(function (value, idx) {
                value.style.top = spriteList[idx].top + 'px';
                value.style.left = spriteList[idx].left + 'px';
                sprite.spriteList[spriteId].sheetList[idx].classList.remove('waiting');
            });

        },


        playSequence: function (params) {
            //console.log('-> playSequence: ', params);

            var spriteId = params.spriteId;
            sprite.spriteList[spriteId].sequenceList = params.sequence;

            if (params.lockElement) {
                for (var i = 0; i < sprite.spriteList[spriteId].characterList.length; i++) {
                    sprite.spriteList[spriteId].characterList[i].style.pointerEvents = 'none';
                }
            }

            var playSequenceButton = createElement('img', params.target, 'playSequenceButton');
            playSequenceButton.src = params.button.src;
            playSequenceButton.style.top = params.button.top + 'px';
            playSequenceButton.style.left = params.button.left + 'px';

            playSequenceButton.addEventListener('click', function (e) {
                e.preventDefault();
                this.style.display = 'none';

                var seq = sprite.spriteList[spriteId].sequenceList[0].seq;
                //console.log('-playSequenceButton seq: ', seq);
                sprite.spriteList[spriteId].sheetList[seq - 1].click();

            }, false);


        },
        resetSprite: function (param) {
            this.allStopSound();
            this.hideOtherSprite();

            // 추가.. 탭 클릭 시 원래 위치로 이동. - hyun
            for (var index in this.spriteList) {
                for (var i = 0; i < this.spriteList[index].sheetList.length; i++) {
                    sprite.spriteList[index].sheetList[i].classList.remove('waiting');
                    this.spriteList[index].characterList[i].style.left = this.spriteList[index].characterList[i].getAttribute("data-left") + "px";
                }
            }
        },

        hideOtherSprite: function () {

            for (var index in this.spriteList) {

                for (var i = 0; i < this.spriteList[index].sheetList.length; i++) {
                    this.spriteList[index].sheetList[i].style.opacity = 0;
                    this.spriteList[index].thumbNailList[i].style.opacity = 1;
                }

            }
        }
    };
    return sprite;

})();