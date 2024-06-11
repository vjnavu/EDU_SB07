"use strict";

function openPageCallback(t) { }
$ts.loadScriptFile("../ko/libs/js/polyfills.js"),
    function () {
        var t = $ts.ce({
            tag: "div",
            class: "loadingImage",
            parent: document.body
        }),
            e = setInterval(function () {
                window.$loadingData ? t.style.display = "block" : (clearInterval(e), t.style.display = "none")
            }, 50);
        window.parent == window ? (console.log("[  Run Contents Mode(no UI)  ]"), document.querySelector("html").classList.add("noUI"), $ts.loadScriptFile("../ko/libs/js/scale.js", function () {
            g.scale = new window.$cale({
                target: $ts.getEl("#wrap"),
                mode: "",
                align: "center"
            }), g.__defineGetter__("zoomRate", function () {
                return this.scale.zoomRate
            }), setTimeout(function () {
                $ts.getEl("#wrap").style.opacity = 1
            }, 100)
        })) : setTimeout(function () {
            g.zoomRate = 1
        }, 100), document.addEventListener("touchmove", function (t) {
            t.preventDefault()
        }, {
            passive: !1
        }), window.$run = function (t, e) {
            var n = setInterval(function () {
                "" !== t && void 0 === window[t] || (clearInterval(n), e && e())
            }, 10)
        }, window.$callBack = {};
        var g = {},
            f = {
                inPage: {
                    slider: [],
                    quiz: [],
                    scroll: []
                },
                inPopup: {
                    slider: [],
                    quiz: [],
                    scroll: []
                },
                popup: [],
                controller: [],
                singleAudio: [],
                sync: [],
                zoom: [],
                singleSprite: [],
                get controllerLen() {
                    return this.controller.length
                },
                get singleAudioLen() {
                    return this.singleAudio.length
                }
            };

        function p(n) {
            var t = n,
                e = {};
            e.slideClass = n.slideClass ? n.slideClass : "on", e.tabClass = n.tabClass ? n.tabClass : "on", e.btnClass = n.btnClass ? n.btnClass : "off", e.callbacks = {
                move: function (t) {
                    g.allEventReset(), "popup" === n.type || "intro" === n.type ? console.log("isPopup") : g.popupClose(), window.$callBack.sliderMove && window.$callBack.sliderMove(t), window.$callBack.sliderReset && window.$callBack.sliderReset(t), n.type && "main" === n.type && g.inPageReset(), n.type && "intro" === n.type || g.mediaReset();
                    var e = t.idx + 1;
                    f.controller.forEach(function (t) {
                        t.autoPlay && (t.setTimeAutoPlay && clearTimeout(t.setTimeAutoPlay), n.type && "main" === n.type && e == t.playPage && t.startAutoPlay(300))
                    })
                },
                reset: function (t) {
                    n.callback && n.callback(t)
                }
            }, n.carousel && (e.carousel = {
                wrapper: $ts.getEl(n.carousel.wrapper, t.container, 0),
                loop: {
                    left: "left" === n.carousel.loop,
                    right: "right" === n.carousel.loop
                },
                transitionDuration: n.carousel.transitionDuration ? n.carousel.transitionDuration : 100
            });
            var a = new $slider(t, e);
            "popup" === n.type ? f.inPopup.slider.push(a) : null != n.type && "main" === n.type || f.inPage.slider.push(a)
        }

        function m(i) {
            var o = this;
            this.btn = i.btn, this.quizArray = [], this.completeCount = 0, this.toggleBtn = function () {
                this.btn.classList.contains("reset") ? this.allReset() : this.allComplete()
            }, this.allComplete = function () {
                for (var t in this.btn.classList.add("reset"), this.quizArray) this.quizArray[t].showAnswer()
            }, this.allReset = function () {
                for (var t in this.btn.classList.remove("reset"), this.quizArray) this.quizArray[t].reset()
            }, this.checkComplete = function (t) {
                for (var e in this.completeCount = 0, this.quizArray) this.quizArray[e].container.classList.contains("complete") && this.completeCount++;
                this.completeCount == this.quizArray.length ? this.btn.classList.add("reset") : this.btn.classList.remove("reset")
            },
                function () {
                    var t = (t = o.btn.getAttribute("data-quiz-chain")).replace(/ /g, "").split(",");
                    for (var e in t) ! function (n) {
                        var a = setInterval(function () {
                            if (0 !== f[i.include].quiz.length)
                                for (var t in f[i.include].quiz) {
                                    var e;
                                    f[i.include].quiz[t].name === n && (clearInterval(a), ((e = f[i.include].quiz[t]).QUIZ.chain = o).quizArray.push(e))
                                }
                        }, 10)
                    }(t[e]);
                    o.btn.addEventListener("click", o.toggleBtn.bind(o)), $ts.addHoverEvents(o.btn), o.btn.addEventListener("click", $efSound.click)
                }()
        }

        function v(t) {
            var e = this,
                n = t.targets,
                a = t.btn,
                i = (t.idx, t.callBack),
                o = [];

            function r() {
                console.log("test", o), i && i.play && i.play(e), o.forEach(function (t) {
                    t.start()
                })
            }

            function s() {
                i && i.stop && i.stop(e), o.forEach(function (t) {
                    t.stop()
                })
            }
            n.forEach(function (e) {
                var t = e.getAttribute("data-sprite-count"),
                    n = e.hasAttribute("data-sprite-delay") ? e.getAttribute("data-sprite-delay") : 50,
                    a = (e.getAttribute("data-sprite-target"), e.getAttribute("data-sprite-src")),
                    i = e.getAttribute("data-sprite-repeat");
                $ts.imgPreload(a, t, "png", function (t) {
                    o.push(new $ts.imgSprite(e, t, n, i))
                })
            }), a.addEventListener("click", $efSound.click), a.addEventListener("click", function () {
                (!this.hasAttribute("data-answer-btn") || this.classList.contains("reset") ? r : s)()
            }), this.stop = s, this.spriteArray = o
        }

        function n() {
            $ts.loadScriptFile("../ko/libs/js/drag.js", function () {
                if ($ts.getEl("[data-drag]")) {
                    var t = $ts.getEl("[data-drag]");
                    for (var e in t) new $Drag({
                        dragObj: t[e]
                    })
                }
            }), $ts.getEl("[drag]") && $ts.loadScriptFile("../ko/content/js/simpleDrag.js");
            var t = $ts.getEl("[data-hover]");
            if (t)
                for (var e in t) $ts.addHoverEvents(t[e], "preventDefault");
            if ($ts.getEl("[data-popup-btn]") && $ts.getEl("[data-popup-container]") && function (t, e) {
                var n = $ts.getEl("[data-popup-page]"),
                    a = $ts.getEl("main")[0];
                for (var i in setTimeout(function () {
                    for (var t in n) n[t].style.display = "block"
                }, 200), t) {
                    var o = t[i].getAttribute("data-popup-btn"),
                        r = $ts.getEl('[data-popup-page="' + o + '"]')[0],
                        s = "hidden" === t[i].getAttribute("data-popup-parent"),
                        l = t[i].hasAttribute("data-popup-mode") ? t[i].getAttribute("data-popup-mode") : "pageChange",
                        c = t[i].getAttribute("data-auto-close") ? parseInt(t[i].getAttribute("data-auto-close")) : null,
                        d = !!t[i].hasAttribute("data-close-inner"),
                        u = !!parent.document.querySelector("iframe"),
                        p = $popup({
                            btn: t[i],
                            page: r,
                            popupPages: n,
                            container: e,
                            idx: o,
                            autoMode: c,
                            closeInnerMode: d,
                            UIHidden: s,
                            Mode: l,
                            callBack: {
                                open: function (t) {
                                    var e;
                                    if (t.container.hasAttribute("data-slide-container"))
                                        for (var n in t.container.classList.add("on"), f.inPopup.slider) f.inPopup.slider[n].container === t.container && f.inPopup.slider[n].reset({
                                            idx: t.idx - 1
                                        });
                                    (t.UIHidden || t.page.classList.contains("whole")) && (u && ((e = parent.document.querySelector("iframe")).parentNode.style.position = "relative", e.parentNode.style.zIndex = 1e3), a.style.opacity = .3), "pageChange" === t.Mode && g.mediaReset(), a.style.opacity = .99, setTimeout(function () {
                                        a.style.opacity = 1
                                    }, 500), window.$popupCallBack && window.$popupCallBack.open && window.$popupCallBack.open(t), window.$popCallBack && window.$popCallBack.open && window.$popCallBack.open(t)
                                },
                                close: function (e) {
                                    var t;
                                    e.page.hasAttribute("data-popup-inner") || g.inPopupReset(), e.container.hasAttribute("data-slide-container") && e.container.classList.remove("on"), $ts.getEl("[data-popup-inner]") && $ts.getEl("[data-popup-inner]").forEach(function (t) {
                                        e.idx == t.getAttribute("data-popup-inner") && (t.classList.remove("on"), t.style.zIndex = "")
                                    }), (e.UIHidden || e.page.classList.contains("whole")) && (a.style.opacity = 1, u && ((t = parent.document.querySelector("iframe")).parentNode.style.position = "static", t.parentNode.style.zIndex = 1)), "pageChange" === e.Mode && g.mediaReset(), window.$popupCallBack && window.$popupCallBack.close && window.$popupCallBack.close(e), window.$popCallBack && window.$popCallBack.close && window.$popCallBack.close(e)
                                },
                                reset: function (t) {
                                    t.page.hasAttribute("data-popup-inner") || g.inPopupReset(), t.UIHidden && g.mediaReset()
                                }
                            }
                        });
                    f.popup.push(p)
                }
            }($ts.getEl("[data-popup-btn]"), $ts.getEl("[data-popup-container]")[0]), $ts.getEl("[data-media-container]") && function (t) {
                for (var e in t) {
                    var n = t[e].getAttribute("data-media-container"),
                        a = $ts.getEl("[data-media-btn]", t[e]),
                        i = t[e].getAttribute("data-media-control"),
                        o = new $controller({
                            container: t[e],
                            mediaType: n,
                            controlType: i,
                            mediaBtns: a,
                            callBack: {
                                play: function (t) {
                                    for (var e in f.controller) f.controller[e].controller !== t.controller && f.controller[e].stop();
                                    window.$callBack.mediaStart && window.$callBack.mediaStart(t)
                                },
                                pause: function (t) {
                                    window.$callBack.mediaPause && window.$callBack.mediaPause(t)
                                },
                                stop: function (t) {
                                    window.$callBack.mediaEnd && window.$callBack.mediaEnd(t)
                                },
                                close: function (t) {
                                    window.$callBack.videoClose && window.$callBack.videoClose(t)
                                }
                            }
                        });
                    f.controller.push(o)
                }
            }($ts.getEl("[data-media-container]")), $ts.getEl("[data-slide-container]")) {
                var n = $ts.getEl("[data-slide-container]");
                for (var a in n) ! function (t) {
                    for (var e = t.getAttribute("data-slide-container"), n = t.children, a = null, i = null, o = null, r = null, s = null, l = {}, c = 0; c < n.length; c++)
                        if (n[c].hasAttribute("data-slides") && (a = n[c].children), n[c].hasAttribute("data-tabs-toggle") && (s = n[c]), n[c].hasAttribute("data-slide-btn-container"))
                            for (var d = n[c].children, u = 0; u < d.length; u++) d[u].hasAttribute("data-tabs") && (i = d[u].children), d[u].hasAttribute("data-btn-prev") && (o = d[u]), d[u].hasAttribute("data-btn-next") && (r = d[u]);
                        else n[c].hasAttribute("data-tabs") && (i = n[c].children), n[c].hasAttribute("data-btn-prev") && (o = n[c]), n[c].hasAttribute("data-btn-next") && (r = n[c]);
                    l.type = e, l.container = t, l.slides = a, i && (l.tabs = i), o && (l.prevBtn = o), r && (l.nextBtn = r), s && (l.toggleBtn = s), p(l)
                }(n[a])
            } ($ts.getEl("[data-scroll-container]") || $ts.getEl("[data-scroll-popup-container]")) && function (t) {
                var e = {};
                for (var n in e.inPage = t.page, e.inPopup = t.popup, e)
                    for (var a in e[n]) {
                        var i = e[n][a],
                            o = $ts.getEl("[data-scroll-inner]", e[n][a], 0),
                            r = $ts.getEl("[data-scroll-content]", e[n][a], 0),
                            s = e[n][a].getAttribute("data-scroll-reset"),
                            l = e[n][a].getAttribute("data-scroll-value"),
                            c = e[n][a].getAttribute("data-scroll-container");
                        "all" === c ? (d({
                            container: i,
                            inner: o,
                            content: r,
                            reset: s,
                            value: l,
                            type: "vertical"
                        }, n), d({
                            container: i,
                            inner: o,
                            content: r,
                            reset: s,
                            value: l,
                            type: "horizon"
                        }, n)) : d({
                            container: i,
                            inner: o,
                            content: r,
                            reset: s,
                            value: l,
                            type: c
                        }, n)
                    }

                function d(t, e) {
                    var n = $scroll(t);
                    f[e].scroll.push(n)
                }
            }({
                page: $ts.getEl("[data-scroll-container]"),
                popup: $ts.getEl("[data-scroll-popup-container]")
            })
            // ,
            // $ts.getEl("[data-zoom-container]") && $ts.loadScriptFile("../ko/libs/js/zoomImage.js", function () {
            //         for (var t = $ts.getEl("[data-zoom-container]"), e = 0; e < t.length; e++) f.zoom.push($zoom(t[e]))
            // });
            var i, o, r = $ts.getEl("main [data-quiz]"),
                s = $ts.getEl("[data-popup-container] [data-quiz]"),
                l = $ts.getEl("main [data-quiz-chain]"),
                c = $ts.getEl("[data-popup-container] [data-quiz-chain]");
            for (var a in r) {
                var d = r[a].getAttribute("data-quiz");
                $quiz({
                    container: r[a],
                    type: d,
                    include: "inPage"
                })
            }
            for (var a in s) {
                d = s[a].getAttribute("data-quiz");
                $quiz({
                    container: s[a],
                    type: d,
                    include: "inPopup"
                })
            }
            for (var a in l) new m({
                btn: l[a],
                include: "inPage"
            });
            for (var a in c) new m({
                btn: c[a],
                include: "inPopup"
            });
            if ($ts.getEl("[data-url]") && 1 <= $ts.getEl("[data-url]").length) {
                var u = $ts.getEl("[data-url]");
                for (var a in u) u[a].addEventListener("click", h), u[a].addEventListener("click", $efSound.click)
            }
            $ts.getEl("[data-sprite-target]") && 1 <= $ts.getEl("[data-sprite-target]").length && ($ts.getEl("[data-sprite-target]"), i = $ts.getEl("[data-sprite-btn]"), o = f.singleSprite, i.forEach(function (t) {
                var e = t.getAttribute("data-sprite-btn");
                o.push(new v({
                    btn: t,
                    targets: $ts.getEl('[data-sprite-target="' + e + '"]'),
                    idx: e - 1,
                    callBack: {
                        play: function (t) {
                            o.forEach(function (t) {
                                t.stop()
                            })
                        },
                        stop: function (t) { }
                    }
                }))
            })), $ts.isDevice && document.querySelector("#wrap").classList.add("ISMOBILE"), CONTENTS.start()
        }

        function h() {
            var t = this.getAttribute("data-url");
            window.open(t)
        }
        g.inPageReset = function () {
            for (var t in g.mediaReset(), g.popupClose(), f.inPage)
                if (f.inPage[t].length)
                    for (var e in f.inPage[t]) g.reset(f.inPage[t][e], t);
            window.resetAppears()
        }, g.inPopupReset = function () {
            for (var t in f.inPopup)
                if (f.inPopup[t].length)
                    for (var e in f.inPopup[t]) g.reset(f.inPopup[t][e], t);
            $pm.array.inPopup.quiz.forEach(function (t) {
                t.reset(), t.QUIZ.answerBtn && t.QUIZ.answerBtn.classList.remove("reset")
            }), g.zoomReset()
        }, g.reset = function (t, e) {
            // 탭이동시 리셋기능 삭제
            // switch (e) {
            //     case "scroll":
            //         t.isReset ? t.reset() : t.getData();
            //         break;
            //     default:
            //         t.reset()
            // }
        }, g.popupClose = function () {
            if (f.popup.length)
                for (var t in f.popup) f.popup[t].close()
        }, g.mediaReset = function () {
            if (f.controllerLen)
                for (var t in f.controller) f.controller[t].stop();
            if (f.singleAudioLen)
                for (var t in f.singleAudio) f.singleAudio[t].stop();
            if (f.sync.length)
                for (var t in f.sync) f.sync[t].reset()
        }, g.zoomReset = function () {
            g.array.zoom.forEach(function (t) {
                t.resetNotWorking || t.resetZoom()
            })
        }, g.singleSpriteReset = function () {
            g.array.singleSprite.forEach(function (t) {
                t.stop()
            })
        }, g.allEventReset = function () {
            // 탭이동시 리셋기능 삭제
            // $pm.array.inPage.quiz.forEach(function(t) {
            //     t.reset(),
            //     t.QUIZ.answerBtn && t.QUIZ.answerBtn.classList.remove("reset")
            // }), CONTENTS.reset(), g.zoomReset(), g.singleSpriteReset()

            $pm.array.inPage.quiz.forEach(function (t) {
                //t.reset()
                // t.QUIZ.answerBtn && t.QUIZ.answerBtn.classList.remove("reset")
            }), CONTENTS.reset(), g.zoomReset(), g.singleSpriteReset()
        },
            function () {
                window.$efSound = {};
                var n = {
                    click: $ts.createAudio.set("../ko/libs/media/click.mp3"),
                    correct: $ts.createAudio.set("../ko/libs/media/correct.mp3"),
                    incorrect: $ts.createAudio.set("../ko/libs/media/incorrect.mp3"),
                    wrong: $ts.createAudio.set("../ko/libs/media/wrong.mp3"),
                    checkSound: $ts.createAudio.set("../ko/libs/media/checkSound.mp3"),
                    clap: $ts.createAudio.set("../ko/libs/media/clap.mp3"),
                    animation: $ts.createAudio.set("../ko/libs/media/animationBG.mp3")
                };
                for (var t in n) ! function (t, e) {
                    e.load(), window.$efSound[t] = function () {
                        return $ts.createAudio.interval(e.duration, function () {
                            a(), e.play()
                        }), e
                    }
                }(t, n[t]);

                function a(t) {
                    for (var e in n) n[e].pause(), n[e].currentTime && (n[e].currentTime = 0)
                }
                window.$efSound.stop = a, window.$efSound.muted = function (t) {
                    for (var e in n) n[e].muted = t
                }
            }(), document.addEventListener("DOMContentLoaded", function () {
                var t;
                n(), window.$efSound && window.$efSound.muted && (window.$efSound.muted(!0), t = !0, document.body.addEventListener("mousedown", function () {
                    t && (window.$efSound.muted(!1), t = !1)
                }), document.body.addEventListener("touchstart", function () {
                    t && (window.$efSound.muted(!1), t = !1)
                }))
            }), g.slider = p, g.array = f, g.completeQuizManually = function (t) {
                t.container.classList.add("complete"), t.answerBtn && t.answerBtn.classList.add("reset")
            }, window.$pm = g
    }(),
    function () {
        var n, t = $ts.getEl("[data-tabs]");
        if (t) {
            n = [], t.forEach(function (t) {
                for (var e = 0; e < t.children.length; e++) n.push(t.children[e])
            });
            for (var e = 0; e < n.length; e++) n[e].addEventListener("click", function (t) {
                var e, n = t.target;
                n.classList.contains("on") || (e = n.dataset.appearIndex, (e = parseInt(e)) && (resetAppears(), startAppear("group_" + e)))
            })
        }
    }(), window.DOMelementsLoaded = !0;

// line박스 click
let lineBoxCorrect = document.querySelectorAll('.colorBox.lineBox');
lineBoxCorrect.forEach((item) => {
    item.addEventListener('click', () => {
        // lineBoxCorrect.forEach((e)=>{
        //     //하나만 선택되도록 기존의 효과를 지워준다.
        //     // e.classList.remove('correct');
        // })
        // 선택한 그 아이만 효과를 추가해준다.
        item.classList.add('correct');

    })
})

