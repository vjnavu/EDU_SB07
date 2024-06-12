/*
    file name: $prite.js
    description: custom sprite animation object
	create date: 2018-01-10
	creator: saltgamer
	version: 0.15
*/

'use strict';

var $priteChange = $priteChange || {};
$priteChange = (function () {
  var sprite = {
    currentAni: null,
    currentSeq: 0,
    spriteList: {},
    sound: {},
    isSoundEnded: false,
    index: 0,
    row: 0,
    isChrome: navigator.userAgent.toLowerCase().indexOf('chrome') !== -1,
    add: function (params) {
      var spriteId = params.spriteId;
      var sheetWidth = 5250;
      var sheetHeight = 3100;
      var charWidth = 250;
      var charHeight = 310;
      var sheetX = 0;
      var sheetY = 0;
      var frame = 0;
      var endSheet = 11;
      var delay = 40;
      // console.log('params::::::::', params);
      this.initSpriteListObj(spriteId);
      if (params.spriteList.length > 0) {
        params.spriteList.forEach(function (value, idx) {
          var characterImg = createElement(
            'div',
            params.target,
            'characterImg'
          );
          var thumbNailImg1 = createElement(
            'div',
            characterImg,
            'charSpriteImg'
          );
          var thumbNailImg2 = createElement(
            'div',
            characterImg,
            'charSpriteImgCir'
          );
          var spriteSheetImg = createElement(
            'div',
            characterImg,
            'charSpriteAni ' + value.name
          );

          thumbNailImg1.style.backgroundImage = 'url(' + value.thumbNail1 + ')';
          thumbNailImg2.style.backgroundImage = 'url(' + value.thumbNail2 + ')';

          if (value.name === 'true' && spriteId === 'trueFalse') {
            spriteSheetImg.style.backgroundImage =
              'url(./common/images/character/common_wrong.png)';
          } else {
            spriteSheetImg.style.backgroundImage =
              'url(' + value.spriteSheet + ')';
          }
          thumbNailImg2.style.opacity = 1;
          spriteSheetImg.style.opacity = 0;
          spriteSheetImg.setAttribute('data-idx', idx);

          sprite.spriteList[spriteId].characterList.push(characterImg);
          sprite.spriteList[spriteId].sheetList.push(spriteSheetImg);
          sprite.spriteList[spriteId].thumbNailList.push(thumbNailImg1);
          sprite.spriteList[spriteId].thumbNailList.push(thumbNailImg2);
          if (value.textBubble) {
            var textBubbleObj = value.textBubble;
            var textBubble = createElement(
              'div',
              params.target,
              textBubbleObj.class
            );
            var bubbleText = createElement('span', textBubble);
            var bubbleArrow = null;

            textBubble.style.display = 'none';
            bubbleText.innerHTML = textBubbleObj.text;

            if (textBubbleObj.arrowClass) {
              bubbleArrow = createElement(
                'div',
                textBubble,
                textBubbleObj.arrowClass
              );
            }

            if (value.circlePlayMode) {
              var bubbleImageBox = document.createElement('div');
              for (var i = 0; i < value.circlePlayMode.images.length; i++) {
                var bubbleImage = createElement('img', bubbleImageBox);
                bubbleImage.src = value.circlePlayMode.images[i];
              }
              textBubble.insertBefore(bubbleImageBox, bubbleText);
            }
          }
          sprite.spriteList[spriteId].textBubbleList.push(textBubble);

          sheetX = sheetWidth / charWidth;
          sheetY = sheetHeight / charHeight;
          frame = sheetX * (sheetY - 1) + endSheet - 1;
          // console.log('------------------------------------------');
          // console.log('-sheetX: ', sheetX);
          // console.log('-sheetY: ', sheetY);
          // console.log('-frame: ', frame);

          var spriteEvent = function () {
            var idx = this.getAttribute('data-idx');
            var curSpriteList = sprite.spriteList[spriteId];
            var textBubble = curSpriteList.textBubbleList[idx];

            if (this.classList.contains('waiting')) {
              this.classList.remove('waiting');
              $priteChange.resetSprite(spriteId);
            } else {
              sprite.allStopSound();
              if (value.sound) {
                sprite.sound['sound_' + value.name].playSound();
              }
              sprite.hideOtherSprite();

              thumbNailImg1.style.opacity = 0;
              thumbNailImg2.style.opacity = 1;
              this.style.opacity = 1;
              this.classList.add('waiting');

              sprite.changeSpritePos({
                x: '0',
                y: '0',
                target: this,
              });

              if (value.circlePlayMode) {
                sprite.initCirclePlayMode(spriteId, params.spriteList);
                for (var i = 0; i < curSpriteList.sheetList.length; i++) {
                  curSpriteList.sheetList[i].style.pointerEvents = 'auto';
                }
                this.style.pointerEvents = 'none';
              }

              if (textBubble) {
                textBubble.style.display = 'block';
              }

              clearInterval(sprite.currentAni);
              sprite.currentAni = null;
              sprite.index = 0;
              sprite.row = 0;

              // sprite.spriteAnimate({
              //   delay: delay,
              //   duration: frame * delay,
              //   delta: makeEaseOut(linear),
              //   step: function (delta) {
              //     sprite.index++;
              //     if (value.name === 'true' && spriteId === 'trueFalse') {
              //       endSheet = 21;
              //     }
              //     if (sprite.index >= sheetX) {
              //       sprite.index = 0;
              //       sprite.row++;
              //     }
              //     // console.log('------------- sprite.row ', sprite.row);
              //     // console.log('------------- sprite.index: ', sprite.index);
              //     if (
              //       sprite.row === sheetY - 1 &&
              //       sprite.index === endSheet - 2
              //     ) {
              //       console.log('- last Exception!');
              //       if (!sprite.isSoundEnded) {
              //         sprite.row = 0;
              //         sprite.index = 0;
              //       }
              //     } else if (
              //       spriteId === 'trueFalse' &&
              //       sprite.row === 1 &&
              //       sprite.index === 20
              //     ) {
              //       clearInterval(sprite.currentAni);
              //     } else {
              //       sprite.changeSpritePos({
              //         x: -(sprite.index * charWidth),
              //         y: -(sprite.row * charHeight),
              //         target: spriteSheetImg,
              //       });
              //     }

              //     if (delta === 1) {
              //       thumbNailImg1.style.opacity = 0;
              //       thumbNailImg2.style.opacity = 1;
              //       spriteSheetImg.style.opacity = 0;
              //       if (value.circlePlayMode) {
              //         spriteSheetImg.style.pointerEvents = 'auto';
              //       }
              //     }
              //   },
              // });
            }
          };

          if (params.spriteList[idx].name.indexOf('noEvent') === -1) {
            spriteSheetImg.addEventListener('click', spriteEvent, false);
          }

          if (value.sound) {
            sprite.addSound({
              id: 'sound_' + value.name,
              src: value.sound,
              autoPlay: false,
              volume: 0.7,
              callBack: function () {
                console.log('-callBack--> ' + value.name + ' play Finished!');
                var curSpriteList = sprite.spriteList[spriteId];
                thumbNailImg1.style.opacity = 0;
                thumbNailImg2.style.opacity = 1;
                spriteSheetImg.style.opacity = 0;
                if (spriteId === 'trueFalse') {
                  spriteSheetImg.style.opacity = 1;
                }
                if (
                  curSpriteList.sequenceList &&
                  curSpriteList.sequenceList[sprite.currentSeq].callBack
                ) {
                  curSpriteList.sequenceList[sprite.currentSeq].callBack();
                }

                sprite.currentSeq++;
                if (
                  curSpriteList.sequenceList &&
                  curSpriteList.sequenceList[sprite.currentSeq]
                ) {
                  var seq = curSpriteList.sequenceList[sprite.currentSeq].seq;
                  curSpriteList.sheetList[seq - 1].click();
                } else {
                  sprite.currentSeq = 0;
                }

                sprite.isSoundEnded = true;
              },
            });
          }
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
        textBubbleList: [],
        sequenceList: null,
      };
    },
    changeSpritePos: function (params) {
      params.target.style.backgroundPositionX = params.x + 'px';
      params.target.style.backgroundPositionY = params.y + 'px';
      params.target.style.transform = 'rotate(0.1deg)';
    },
    spriteAnimate: function (opts) {
      var start = new Date();
      var intervalId = setInterval(function () {
        var timePassed = new Date() - start;
        var progress = timePassed / opts.duration;
        var delta = opts.delta(progress);

        if (progress > 1) progress = 1;

        opts.step(delta);

        if (progress === 1) {
          if (sprite.isSoundEnded) {
            clearInterval(intervalId);
            sprite.isSoundEnded = false;
          }
        }
      }, opts.delay);

      sprite.currentAni = intervalId;
    },
    Sound: function (params) {
      var sound = this;
      sound.element = params.element;
      sound.callBack = params.callBack;

      sound.endSound = function () {
        sound.element.removeEventListener('ended', sound.endSound);
        if (params.callBack) params.callBack();
      };
      sound.loadAndPlay = function () {
        sound.element.removeEventListener('loadeddata', sound.loadAndPlay);
        sound.element.removeEventListener('ended', sound.endSound);
        sound.element.addEventListener('ended', sound.endSound);
        if (params.autoPlay) sound.element.play();
      };
      sound.setSrc = function (src) {
        sound.element.src = src;
        sound.element.volume = params.volume;
        sound.element.addEventListener('loadeddata', sound.loadAndPlay);
        sound.element.load();
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
      var soundElement = createElement('audio', document.body);
      soundElement.setAttribute('id', params.id);

      this.sound[params.id] = new sprite.Sound({
        id: params.id,
        element: soundElement,
        src: params.src,
        autoPlay: params.autoPlay,
        volume: params.volume,
        callBack: params.callBack,
      });
    },
    allStopSound: function () {
      for (var index in this.sound) {
        this.sound[index].element.pause();
        this.sound[index].element.currentTime = 0;
        /* IE11 exception isNaN 20180116 */
        // if (!isNaN(this.sound[index].element.currentTime))
        //   this.sound[index].element.currentTime = 0;
      }
    },
    initCirclePlayMode: function (spriteId, spriteList) {
      var circleTop = 0;
      var circleLeft = 16;
      sprite.spriteList[spriteId].characterList.forEach(function (value, idx) {
        circleTop = idx ? 352 : 124;
        value.classList.add('circle');
        value.classList.add(spriteList[idx].circlePlayMode.class);
        value.style.top = circleTop + 'px';
        value.style.left = circleLeft + 'px';
      });
      $(document).find(".spriteAniBox .characterImg").each(function() {
        $(this).find(".charSpriteImg").css("opacity", 0);
        $(this).find(".charSpriteImgCir").css("opacity", 1);
      });
    },
    playSequence: function (params) {
      console.log('-> playSequence: ', params);

      var spriteId = params.spriteId;
      sprite.spriteList[spriteId].sequenceList = params.sequence;

      if (params.lockElement) {
        for (
          var i = 0;
          i < sprite.spriteList[spriteId].characterList.length;
          i++
        ) {
          sprite.spriteList[spriteId].characterList[i].style.pointerEvents =
            'none';
        }
      }

      var playSequenceButton = createElement(
        'img',
        params.target,
        'playSequenceButton'
      );
      playSequenceButton.src = params.button.src;
      playSequenceButton.style.top = params.button.top + 'px';
      playSequenceButton.style.left = params.button.left + 'px';

      playSequenceButton.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.style.display = 'none';

          var seq = sprite.spriteList[spriteId].sequenceList[0].seq;
          console.log('-playSequenceButton seq: ', seq);
          sprite.spriteList[spriteId].sheetList[seq - 1].click();
        },
        false
      );
    },
    resetSprite: function () {
      this.allStopSound();
      this.hideOtherSprite();
      $(document).find(".spriteAniBox .characterImg").each(function() {
        $(this).removeAttr("style").removeAttr("class").addClass("characterImg");
        $(this).find(".charSpriteImg").css("opacity", 1);
        $(this).find(".charSpriteImgCir").css("opacity", 0);
        $(this).find(".charSpriteAni").css("pointer-events", "auto");
      });
    },
    hideOtherSprite: function () {
      for (var spriteId in this.spriteList) {
        var listById = this.spriteList[spriteId];
        var sheetListLen = listById.sheetList.length;
        for (var i = 0; i < sheetListLen; i++) {
          listById.sheetList[i].style.opacity = 0;
          listById.thumbNailList[i].style.opacity = 1;
          listById.sheetList[i].classList.remove('waiting');
          if (listById.textBubbleList[i]) {
            listById.textBubbleList[i].style.display = 'none';
          }
        }
      }
    },
  };
  return sprite;
})();
