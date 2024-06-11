"use strict";
function _classCallCheck(e, t) {
    if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function")
}
function _defineProperties(e, t) {
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1,
            r.configurable = !0,
        "value"in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r)
    }
}
function _createClass(e, t, n) {
    return t && _defineProperties(e.prototype, t),
    n && _defineProperties(e, n),
        e
}
!function() {
    var o = "data-answer"
        , n = "data-group"
        , e = function() {
        function i(e) {
            _classCallCheck(this, i),
                this.QUIZ = e
        }
        return _createClass(i, [{
            key: "init",
            value: function() {
                this.initGame(),
                    this.initDragObjs(),
                    this.initSvg(),
                    this.initPopupOpenCallback()
            }
        }, {
            key: "initGame",
            value: function() {
                var e = this
                    , t = this.QUIZ.container
                    , n = t.querySelectorAll(".js-dragLineArea")
                    , r = t.querySelectorAll(".js-dragLineObj");
                this.game = initDragDrop({
                    elements: {
                        container: t,
                        areas: n,
                        objs: r
                    },
                    callbacks: {
                        start: i.startCallback,
                        move: i.moveCallback,
                        movedOut: i.movedOutCallback,
                        end: i.endCallback,
                        getZoomRate: function() {
                            return e.getZoomRate()
                        }
                    },
                    movedOutCorrPx: 20
                }),
                    (this.game.quiz = this).game.init()
            }
        }, {
            key: "initDragObjs",
            value: function() {
                this.game.dragObjs.forEach(function(e) {
                    e.answeredCnt = 0
                })
            }
        }, {
            key: "initSvg",
            value: function() {
                var e = this.game
                    , t = this.QUIZ.container.querySelector(".js-svgContainer");
                e.totalAnsweredCnt = 0,
                    Object.defineProperties(e, {
                        svg: {
                            value: t
                        },
                        lineNow: {
                            get: function() {
                                return this._lineNow || null
                            },
                            set: function(e) {
                                this._lineNow = e
                            }
                        },
                        createLine: {
                            value: function() {
                                var e = document.createElementNS("http://www.w3.org/2000/svg", "line");
                                return this.svg.appendChild(e),
                                    this.lineNow = e
                            }
                        },
                        drawLine: {
                            value: function(e, t, n) {
                                var r = 2 < arguments.length && void 0 !== n ? n : this.lineNow;
                                if (!r)
                                    return !1;
                                var i = r.beginCoords || this.getLineBeginCoords(e)
                                    , a = r.endCoords || this.getLineEndCoords(t);
                                return r.setAttribute("x1", i.x),
                                    r.setAttribute("y1", i.y),
                                    r.setAttribute("x2", a.x),
                                    r.setAttribute("y2", a.y),
                                    r
                            }
                        },
                        removeLine: {
                            value: function(e) {
                                var t = 0 < arguments.length && void 0 !== e ? e : this.lineNow;
                                if (!t)
                                    return !1;
                                this.svg.removeChild(t),
                                this.lineNow && (this.lineNow = null)
                            }
                        },
                        getLineBeginCoords: {
                            value: function(e, t) {
                                var n = 0 < arguments.length && void 0 !== e ? e : this.movingObj
                                    , r = 1 < arguments.length && void 0 !== t ? t : this.lineNow;
                                if (!n && r)
                                    return !1;
                                var i = n.offsets;
                                return r.beginCoords = i
                            }
                        },
                        getLineEndCoords: {
                            value: function(e, t) {
                                var n = 0 < arguments.length && void 0 !== e ? e : this.movingObj
                                    , r = 1 < arguments.length && void 0 !== t ? t : this.lineNow;
                                if (!n && r)
                                    return !1;
                                var i = n.offsets;
                                return r.endCoords = i
                            }
                        },
                        getMatchingObjOrArea: {
                            value: function(e) {
                                var t = -1 < e.constructor.toString().indexOf("DragObj") ? "obj" : "area"
                                    , n = e.name;
                                return this.getSameName(t, n)
                            }
                        },
                        getSameName: {
                            value: function(e, t) {
                                var n;
                                return ("obj" === e ? this.dropAreas : this.dragObjs).forEach(function(e) {
                                    t === e.name && (n = e)
                                }),
                                    n
                            }
                        },
                        checkAndDisableDragObjs: {
                            value: function(e) {
                                e.forEach(function(e) {
                                    a(e) && e.disable(!0)
                                })
                            }
                        }
                    })
            }
        }, {
            key: "initPopupOpenCallback",
            value: function() {
                var t = this;
                window.$popupCallBack || (window.$popupCallBack = {}),
                    window.$popupCallBack.open = function(e) {
                        "pageChange" === e.Mode && t.popupOpenCallback()
                    }
            }
        }, {
            key: "endCorrect",
            value: function() {
                
                var e, t, n = this.game, r = n.movingObj, i = n.droppedArea, a = n.getMatchingObjOrArea(i);
                r.answeredCnt++,
                a.answeredCnt++,
                n.totalAnsweredCnt++,
                n.checkAndDisableDragObjs([r, a]),
                n.getLineEndCoords(i),
                n.drawLine(),
                r.resetPosition(),
                (e = n, t = parseInt(e.container.element.getAttribute("data-total-complete-count") || "") || 0,
                e.totalAnsweredCnt === t) && this.QUIZ.answerBtn && this.QUIZ.answerBtn.classList.add("reset")


                if (e = n, t = parseInt(e.container.element.getAttribute("data-total-complete-count") || "") || 0,
                    e.totalAnsweredCnt === t) {
                    this.QUIZ.container.classList.add("complete");
                } else {
                    this.QUIZ.container.classList.remove("complete");
                }
            }
        }, {
            key: "endWrong",
            value: function() {
                this.game.removeLine(),
                    this.game.movingObj.resetPosition()
            }
        }, {
            key: "showAnswer",
            value: function() {
                var n = this
                    , e = this.game
                    , t = e.dragObjs
                    , r = e.dropAreas;
                t.forEach(function(t) {
                    t.disable(!0),
                        r.forEach(function(e) {
                            e.disable(!0),
                                n.checkAnswersAndDrawLines(t, e)
                        })
                })
            }
        }, {
            key: "reset",
            value: function() {                
                var e = this.game
                    , t = this.QUIZ.answerBtn;
                t && t.dataset.option && -1 < t.dataset.option.indexOf("resetOnly") && t.classList.add("reset"),
                    this.game.totalAnsweredCnt = 0,
                    this.resetAreas(),
                    this.resetObjs(),
                    this.resetSvg(),
                    e.initDragObjsCoords(),
                    e.setZoomRate()

                    this.QUIZ.container.classList.remove("complete");
            }
        }, {
            key: "resetObjs",
            value: function() {
                this.game.dragObjs.forEach(function(e) {
                    e.answeredCnt = 0,
                        e.disable(!1),
                        e.element.classList.remove("dragLineComplete")
                })
            }
        }, {
            key: "resetAreas",
            value: function() {
                this.game.dropAreas.forEach(function(e) {
                    e.disable(!1)
                })
            }
        }, {
            key: "resetSvg",
            value: function() {
                for (var e, t = this.game, n = t.svg.querySelectorAll("line"), r = 0, i = n.length; r < i; r++)
                    e = n[r],
                        t.removeLine(e)
            }
        }, {
            key: "popupOpenCallback",
            value: function() {
                var e = this.game;
                /*this.reset(),*/
                e.initDragObjsCoords(),
                    e.setZoomRate()
            }
        }, {
            key: "getZoomRate",
            value: function() {
                if (!document.querySelector("html").classList.contains("noUI"))
                    return {
                        x: 1,
                        y: 1
                    };
                var e = document.getElementById("wrap").style.transform
                    , t = i.convertScaleStringToArray(e);
                return {
                    x: t[0],
                    y: t[1]
                }
            }
        }, {
            key: "checkAnswersAndDrawLines",
            value: function(e, t) {
                var n = this.game
                    , r = s(e, t)
                    , i = l(e, t);
                r && !i && (a(e) || (n.createLine(),
                    n.drawLine(e, t),
                    e.answeredCnt++))
            }
        }], [{
            key: "startCallback",
            value: function(e) {
                e.movingObj && (e.createLine(),
                    e.getLineBeginCoords())
            }
        }, {
            key: "moveCallback",
            value: function(e) {
                e.getLineEndCoords(),
                    e.drawLine()
            }
        }, {
            key: "movedOutCallback",
            value: function(e) {
                e.removeLine()
            }
        }, {
            key: "endCallback",
            value: function(e) {
                var t = e.movingObj
                    , n = e.droppedArea
                    , r = e.quiz
                    , i = s(t, n)
                    , a = l(t, n);
                n && i && !a ? (window.$efSound.correct(),
                    r.endCorrect()) : (window.$efSound.incorrect(),
                    r.endWrong())
            }
        }, {
            key: "convertScaleStringToArray",
            value: function(e) {
                var t = e.split(",")[0].split("(")[1];
                return [t, t].map(function(e) {
                    return parseFloat(e.trim())
                })
            }
        }]),
            i
    }();
    function s(e, t) {
        if (!t)
            return !1;
        var n = e.element.getAttribute(o) || ""
            , r = switchStringNumListToArray(n, ",")
            , i = t.element.getAttribute(o) || ""
            , a = switchStringNumListToArray(i, ",");
        return r.some(function(t) {
            return a.some(function(e) {
                return t === e
            })
        })
    }
    function l(e, t) {
        return !!t && (parseInt(e.element.getAttribute(n)) || 0) === (parseInt(t.element.getAttribute(n)) || 0)
    }
    function a(e) {
        return (parseInt(e.element.getAttribute("data-complete-count")) || 1) <= e.answeredCnt
    }
    window.$dragLine = e
}();
