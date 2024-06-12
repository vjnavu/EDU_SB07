"use strict";
var $prite = $prite || {};
function makeEaseOut(t) {
    return function (e) {
        return 1 - t(1 - e);
    };
}
function linear(e) {
    return e;
}
$prite = (function () {
    var y = {
        currentAni: null,
        currentSpriteId: null,
        currentSeq: 0,
        spriteList: {},
        originalSpriteList: null,
        sound: {},
        index: 0,
        row: 0,
        isChrome: -1 != navigator.userAgent.toLowerCase().indexOf("chrome"),
        add: function (L) {
            console.warn("$sprite params: ", L);
            var h = L.spriteId;
            this.initSpriteListObj(h),
                0 < L.spriteList.length
                    ? L.spriteList.forEach(function (r, e) {
                          var t = $ts.ce({ tag: "div", class: "characterImg", parent: L.target });
                          t.classList.add(r.name), r.top && (t.style.top = r.top + "px"), r.left && (t.style.left = r.left + "px"), r.circle && (t.classList.add("circle"), t.classList.add(r.circle));
                          var n = $ts.ce({ tag: "div", class: "charSpriteImg", parent: t });
                          (n.style.backgroundImage = "url(" + r.thumbNail + ")"), (n.style.width = r.width + "px"), (n.style.height = r.height + "px");
                          var a = $ts.ce({ tag: "div", class: "charSpriteAni", parent: t });
                          if (
                              ((a.style.backgroundImage = "url(" + r.spriteSheet + ")"),
                              (a.style.width = r.width + "px"),
                              (a.style.height = r.height + "px"),
                              a.setAttribute("data-idx", e),
                              y.isChrome && (a.style.opacity = 0),
                              y.spriteList[h].characterList.push(t),
                              y.spriteList[h].sheetList.push(a),
                              y.spriteList[h].thumbNailList.push(n),
                              r.textBubble)
                          ) {
                              var i = $ts.ce({ tag: "div", class: r.textBubble.class, parent: L.target });
                              (i.style.width = r.textBubble.width + "px"),
                                  (i.style.top = r.textBubble.top + "px"),
                                  (i.style.left = r.textBubble.left + "px"),
                                  (i.style.display = "none"),
                                  (i.style.textAlign = r.textBubble.textAlign),
                                  (i.style.wordBreak = r.textBubble.wordBreak);
                              var s = $ts.ce({ tag: "span", parent: i });
                              if (((s.innerHTML = r.textBubble.text), r.circlePlayMode)) {
                                  var l = document.createElement("div");
                                  if (((l.className = r.circlePlayMode.imagesParentClass ? r.circlePlayMode.imagesParentClass : "textAlignC"), r.circlePlayMode.images))
                                      for (var c = 0; c < r.circlePlayMode.images.length; c++) {
                                          var o = $ts.ce({ tag: "img", parent: l });
                                          (o.src = r.circlePlayMode.images[c]), (o.height = r.circlePlayMode.imagesHeight ? r.circlePlayMode.imagesHeight[c] : 300);
                                      }
                                  i.insertBefore(l, s);
                              }
                              var c = $ts.ce({ tag: "span", class: "bubbleClose", parent: i });
                              c.addEventListener(
                                "click",
                                function (e) {
                                    efSound('./media/click.mp3');
                                }
                              )
                          }
                          y.spriteList[h].textBubbleList.push(i);
                          var d = r.sheetWidth / r.width,
                              p = r.sheetHeight / r.height,
                              u = d * p - (r.endSheet + 1);
                          a.addEventListener(
                              "click",
                              function (e) {
                                  if ((e.preventDefault(), (y.currentSpriteId = h), (y.originalSpriteList = L.spriteList), this.classList.contains("waiting")))
                                      this.classList.remove("waiting"), 
                                      $prite.resetSprite(h), 
                                      //$(this).parents(".characterImg").siblings(".characterText").css("display", "none"), 
                                      r.callbacks && r.callbacks.end && r.callbacks.end();
                                  else {
                                      var t = this.getAttribute("data-idx");
                                      y.allStopSound(), y.sound["sound_" + r.name].playSound(), y.hideOtherSprite();
                                      for (var i = 0; i < y.spriteList[h].sheetList.length; i++)
                                          (y.spriteList[h].thumbNailList[i].style.opacity = 1),
                                              y.spriteList[h].sheetList[i].classList.remove("waiting");
                                              //y.spriteList[h].textBubbleList[i] && (y.spriteList[h].textBubbleList[i].style.display = "none");
                                      if (((n.style.opacity = 0), (this.style.opacity = 1), this.classList.add("waiting"), y.changeSpritePos({ x: "0", y: "0", target: this }), r.circlePlayMode)) {
                                          y.initCirclePlayMode(h, L.spriteList);
                                          for (i = 0; i < y.spriteList[h].sheetList.length; i++) y.spriteList[h].sheetList[i].style.pointerEvents = "auto";
                                      }
                                      var s = y.spriteList[h].textBubbleList[t];
                                      s && (s.style.display = "block"),
                                          clearInterval(y.currentAni),
                                          (y.currentAni = null),
                                          (y.index = 0),
                                          (y.row = 0),
                                          y.spriteAnimate({
                                              delay: r.delay,
                                              duration: u * r.delay,
                                              delta: makeEaseOut(linear),
                                              step: function (e) {
                                                  y.index++,
                                                      y.index >= d && ((y.index = 0), y.row++),
                                                      (y.row === p - 1 && y.index === d - r.endSheet) || y.changeSpritePos({ x: -(y.index * r.width), y: -(y.row * r.height), target: a }),
                                                      1 === e && ((n.style.opacity = 1), (a.style.opacity = 0), r.circlePlayMode && (a.style.pointerEvents = "auto"));
                                              },
                                          }),
                                          r.callbacks && r.callbacks.start && r.callbacks.start();
                                  }
                              },
                              !1
                            ),
                            y.addSound({
                                id: "sound_" + r.name,
                                src: r.sound,
                                autoPlay: !1,
                                volume: 0.7,
                                callBack: function () {
                                    var e;
                                    (n.style.opacity = 1),
                                        (a.style.opacity = 0),
                                        r.circlePlayMode && r.circlePlayMode.rewind && y.rewindMode(h, L.spriteList),
                                        y.spriteList[h].sequenceList && y.spriteList[h].sequenceList[y.currentSeq].callBack && y.spriteList[h].sequenceList[y.currentSeq].callBack(),
                                        y.currentSeq++,
                                        y.spriteList[h].sequenceList && y.spriteList[h].sequenceList[y.currentSeq] ? ((e = y.spriteList[h].sequenceList[y.currentSeq].seq), y.spriteList[h].sheetList[e - 1].click()) : (y.currentSeq = 0);
                                },
                            }),
                            c.addEventListener(
                                "click",
                                function (e) {
                                    $(this).parents(".characterText").siblings(".characterImg").find(".charSpriteImg").css("opacity", 1);
                                    $(this).parents(".characterText").siblings(".characterImg").find(".charSpriteAni").css("opacity", 0).removeClass("waiting");
                                    $(this).parents(".characterText").css("display", "none");
                                    var audio = document.getElementById("sound_" + r.name);
                                    audio.pause();
                                    audio.currentTime = 0;
                                }
                            );
                      })
                    : alert("$pAni error: spriteList parameter is not find!");
        },
        initSpriteListObj: function (e) {
            this.spriteList[e] = { sheetList: [], characterList: [], thumbNailList: [], textBubbleList: [], sequenceList: null };
        },
        changeSpritePos: function (e) {
           // (e.target.style.backgroundPositionX = e.x + "px"), (e.target.style.backgroundPositionY = e.y + "px"), (e.target.style.transform = "rotate(0.1deg)");
        },
        spriteAnimate: function (i) {
            var s = new Date(),
                r = setInterval(function () {
                    var e = (new Date() - s) / i.duration;
                    1 < e && (e = 1);
                    var t = i.delta(e);
                    i.step(t), 1 === e && clearInterval(r);
                }, i.delay);
            y.currentAni = r;
        },
        Sound: function (e) {
            var t = this;
            (t.element = e.element),
                e.volume && (t.element.volume = e.volume),
                e.loop && (t.element.loop = e.loop),
                e.callBack && (t.callBack = e.callBack),
                (t.endSound = function () {
                    t.element.removeEventListener("ended", t.endSound), e.callBack && e.callBack();
                }),
                (t.loadAndPlay = function () {
                    t.element.removeEventListener("loadeddata", t.loadAndPlay), t.element.removeEventListener("ended", t.endSound), t.element.addEventListener("ended", t.endSound), e.autoPlay && t.element.play();
                }),
                (t.setSrc = function (e) {
                    (t.element.src = e), t.element.addEventListener("loadeddata", t.loadAndPlay), t.element.load();
                }),
                (t.seek = function () {
                    return t.element.currentTime;
                }),
                (t.playSound = function () {
                    t.element.removeEventListener("loadeddata", t.loadAndPlay), t.element.removeEventListener("ended", t.endSound), t.element.addEventListener("ended", t.endSound), t.element.play();
                }),
                t.setSrc(e.src);
        },
        addSound: function (e) {
            var t = $ts.ce({ tag: "audio", parent: document.body });
            t.setAttribute("id", e.id), (t.style.display = "none"), (this.sound[e.id] = new y.Sound({ id: e.id, element: t, src: e.src, autoPlay: e.autoPlay, volume: e.volume, loop: e.loop, callBack: e.callBack }));
        },
        allStopSound: function () {
            for (var e in this.sound) this.sound[e].element.pause(), 0 < this.sound[e].element.currentTime && (this.sound[e].element.currentTime = 0);
        }, 
        initCirclePlayMode: function (e, i) {
            y.spriteList[e].characterList.forEach(function (e, t) {
                e.classList.add("circle"), e.classList.add(i[t].circlePlayMode.class), (e.style.top = i[t].circlePlayMode.top + "px"), (e.style.left = i[t].circlePlayMode.left + "px");
            });
        },
        rewindMode: function (i, s) {
            y.spriteList[i].characterList.forEach(function (e, t) {
                (e.style.top = s[t].top + "px"), (e.style.left = s[t].left + "px"), y.spriteList[i].textBubbleList[t] && (y.spriteList[i].textBubbleList[t].style.display = "none"), y.spriteList[i].sheetList[t].classList.remove("waiting");
            });
        },
        playSequence: function (e) {
            var i = e.spriteId;
            if (((y.currentSpriteId = i), (y.spriteList[i].sequenceList = e.sequence), e.lockElement)) for (var t = 0; t < y.spriteList[i].characterList.length; t++) y.spriteList[i].characterList[t].style.pointerEvents = "none";
            var s = $ts.ce({ tag: "div", class: "playSequenceButton", parent: e.target });
            e.button.top && (s.style.top = e.button.top + "px"),
                e.button.left && (s.style.left = e.button.left + "px"),
                s.addEventListener(
                    "click",
                    function (e) {
                        e.preventDefault(), (this.style.display = "none");
                        var t = y.spriteList[i].sequenceList[0].seq;
                        y.spriteList[i].sheetList[t - 1].click();
                    },
                    !1
                ),
                $ts.addHoverEvents(s);
        },
        resetSprite: function () {
            if ((this.allStopSound(), this.hideOtherSprite(), void (this.currentSeq = 0) !== y.spriteList[y.currentSpriteId] && null !== y.spriteList[y.currentSpriteId].sequenceList))
                for (var e = 0; e < y.spriteList[y.currentSpriteId].sequenceList.length; e++) y.spriteList[y.currentSpriteId].sequenceList[e].callBack();
            y.currentSpriteId &&
                y.originalSpriteList.forEach(function (e) {
                    e.circlePlayMode && e.circlePlayMode.rewind && y.rewindMode(y.currentSpriteId, y.originalSpriteList);
                });
        },
        allresetSprite: function () {
            this.resetSprite(),
            this.hideOtherTextBubble(),
            y.currentSpriteId &&
            y.originalSpriteList.forEach(function (e) {
                e.circlePlayMode && (y.rewindMode(y.currentSpriteId, y.originalSpriteList), e.circle || y.resetSpriteCircle(y.currentSpriteId, y.originalSpriteList));
            });
        },
        resetSpriteCircle: function (e, t) {
            console.log(y.spriteList[e]),
                y.spriteList[e].characterList.forEach(function (e, t) {
                    e.classList.remove("circle");
                });
        },
        hideOtherSprite: function () {
            for (var e in this.spriteList)
                for (var t = 0; t < this.spriteList[e].sheetList.length; t++)
                    this.spriteList[e].sheetList[t].classList.contains("waiting") && this.spriteList[e].sheetList[t].classList.remove("waiting"),
                        (this.spriteList[e].sheetList[t].style.opacity = 0),
                        (this.spriteList[e].thumbNailList[t].style.opacity = 1);
                        //this.spriteList[e].textBubbleList[t] && (this.spriteList[e].textBubbleList[t].style.display = "none");
        },
        hideOtherTextBubble: function () {
            for (var e in this.spriteList)
                for (var t = 0; t < this.spriteList[e].sheetList.length; t++)
                    this.spriteList[e].textBubbleList[t] && (this.spriteList[e].textBubbleList[t].style.display = "none");
        },
    };
    return y;
})();
