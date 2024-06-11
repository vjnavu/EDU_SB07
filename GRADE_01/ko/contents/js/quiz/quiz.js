"use strict";

function switchStringNumListToArray(t, e) {
    return t.replace("/ /g", "").split(e).map(function (t) {
        return parseInt(t)
    })
}

!function () {
    function i(t) {
        var e, n = this;
        this.container = t.container, this.type = t.type, this.include = t.include, this.parent = "inPage" === t.include ? $ts.getEl("main", document, 0) : $ts.getEl("popup", document, 0), this.name = this.container.getAttribute("data-quiz-name"), this.option = t.container.hasAttribute("data-option"), this.alert = t.container.hasAttribute("data-alert"), this.answerBtn = $ts.getEl("[data-answer-btn]", t.container, 0), this.customCompleteCount = this.container.dataset.customCompleteCount ? parseInt(this.container.dataset.customCompleteCount) : null, this.startQuiz = function () {
            window.$run("$" + this.type, function () {
                switch (n.type) {
                    case "toggle":
                        e = $toggle(n);
                        break;
                    case "check":
                        e = $check(n);
                        break;
                    case "input":
                        e = $input(n);
                        break;
                    case "ox":
                        e = $ox(n);
                        break;
                    case "dragdrop":
                        e = $dragdrop(n);
                        break;
                    case "dragDrop":
                        (e = new $dragDrop(n)).init(i);
                        break;
                    case "drawline":
                        e = $drawline(n);
                        break;
                    case "dragLine":
                        (e = new $dragLine(n)).init(i)
                }
                window.$pm.array[n.include].quiz.push(e), e.QUIZ = n, e.name = n.name
            })
        }, this.toggleAnswerBtn = function () {
            this.answerBtn.classList.contains("reset") ? (this.answerBtn.classList.remove("reset"), e.reset(), window.$callBack && window.$callBack.hideAnswer && window.$callBack.hideAnswer(e)) : (this.answerBtn.classList.add("reset"), e.showAnswer(), window.$callBack && window.$callBack.viewAnswer && window.$callBack.viewAnswer(e))
        }, this.checkComplete = function (t) {
            e.totalCompleteCount === e.completeCount ? (this.container.classList.add("complete"), this.answerBtn && this.answerBtn.classList.add("reset"), t && t.complete && t.complete(n)) : (this.container.classList.remove("complete"), this.answerBtn && this.answerBtn.classList.remove("reset"), t && t.reset && t.reset(n)), this.chain && this.chain.checkComplete(this)
        }, this.showAnswer = function () {
            e.showAnswer()
        }, this.reset = function () {
            e.reset()
        }, this.getIndex = function (t) {
            return t.obj.getAttribute("data-" + t.type + "-obj")
        }, this.getTarget = function (t) {
            var e = [];
            for (var n in t.target) t.target[n].getAttribute("data-" + t.type + "-target") == t.index && e.push(t.target[n]);
            return e
        }, this.set = function () {
            if (this.startQuiz(), this.answerBtn && (this.answerBtn.addEventListener("click", this.toggleAnswerBtn.bind(this)), $ts.addHoverEvents(this.answerBtn), this.answerBtn.addEventListener("click", $efSound.click)), this.option) {
                this.option = {};
                var t = (t = this.container.getAttribute("data-option").replace(/ /g, "")).split(",");
                for (var e in t) this.option[t[e]] = !0
            }
        }, this.set()
    }

    $ts.loadScriptFile("../ko/libs/js/dragdropCore.js"), $ts.loadScriptFile("../ko/contents/js/quiz/dragDrop.js"), $ts.loadScriptFile("../ko/contents/js/quiz/dragLine.js"), window.$quiz = function (t) {
        return new i(t)
    }
}(), function () {
    function e(s) {
        var a = this;

        function i(t, e) {
            if (t.classList.contains("complete")) s.option.toggle && (!function t(e) {
                var n = s.getIndex({ obj: e, type: "toggle" }),
                    i = s.getTarget({ index: n, type: "toggle", target: a.target });
                a.completeCount--;
                e.classList.remove("complete");
                for (var o in i) i[o].classList.remove("on"), i[o].classList.contains("complete") && t(i[o])
            }(t), window.$callBack && window.$callBack.toggleBack && window.$callBack.toggleBack({
                quiz: a,
                curObj: t,
                curTarget: e
            })); else {
                if (t.hasAttribute("data-group-index")) for (var n = a.obj, i = 0; i < n.length; i++) t.getAttribute("data-group-index") === n[i].getAttribute("data-group-index") && (a.completeCount++, n[i].classList.add("complete")); else for (var i in a.completeCount++, t.classList.add("complete"), e) e[i].classList.add("on");
                window.$callBack && window.$callBack.toggleClick && window.$callBack.toggleClick({
                    quiz: a,
                    curObj: t,
                    curTarget: e
                })
            }
            s.checkComplete()
        }

        this.container = s.container, this.obj = $ts.getEl("[data-" + s.type + "-obj]", this.container), this.target = $ts.getEl("[data-" + s.type + "-target]", this.container), this.totalCompleteCount = s.customCompleteCount || this.obj.length, this.completeCount = 0, this.showAnswer = function () {
            for (var t in this.completeCount = this.totalCompleteCount, this.container.classList.add("complete"), this.obj) this.obj[t].classList.add("complete");
            for (var t in this.target) this.target[t].classList.add("on");
            window.$callBack && window.$callBack.toggleAnswer && window.$callBack.toggleAnswer(a)
        }, this.reset = function () {
            for (var t in this.completeCount = 0, this.container.classList.remove("complete"), this.obj) this.obj[t].classList.remove("complete");
            for (var t in this.target) this.target[t].classList.remove("on");
            s.answerBtn && s.answerBtn.classList.remove("reset"), window.$callBack && window.$callBack.toggleReset && window.$callBack.toggleReset(a)
        }, function () {
            for (var t in a.obj) {
                var e = s.getIndex({ obj: a.obj[t], type: "toggle" }),
                    n = s.getTarget({ index: e, type: "toggle", target: a.target });
                a.obj[t].addEventListener("click", i.bind(a, a.obj[t], n)), $ts.addHoverEvents(a.obj[t]), a.obj[t].addEventListener("click", $efSound.click)
            }
        }()
    }

    window.$toggle = function (t) {
        return new e(t)
    }
}(), function () {
    function e(s) {
        var a = this;

        function i(t, e) {
            if (a.reset(), t.hasAttribute("data-answer")) for (var n in a.completeCount++, e) e[n].classList.add("on"); else for (var n in e) e[n].classList.add("on");
            window.$callBack && window.$callBack.checkClick && window.$callBack.checkClick({
                quiz: a,
                curObj: t,
                curTarget: e
            }), s.checkComplete({ complete: r, reset: l })
        }

        function o(t, e) {
            if (t.classList.contains("checked")) c(t); else if (t.classList.contains("complete")) c(t); else {
                for (var n in t.hasAttribute("data-answer") && a.completeCount++, t.classList.add("checked"), e) e[n].classList.add("on");
                window.$callBack && window.$callBack.checkClick && window.$callBack.checkClick({
                    quiz: a,
                    curObj: t,
                    curTarget: e
                })
            }
            s.checkComplete({ complete: r, reset: l })
        }

        function c(t) {
            var e = s.getIndex({ obj: t, type: "check" }), n = s.getTarget({ index: e, type: "check", target: a.target });
            for (var i in t.hasAttribute("data-answer") && a.completeCount--, t.classList.contains("complete") && t.classList.remove("complete"), t.classList.remove("checked"), n) n[i].classList.remove("on"), n[i].classList.contains("checked") && c(n[i])
        }

        function r() {
            for (var t in a.obj) a.obj[t].hasAttribute("data-answer") && (a.obj[t].classList.add("checked"), a.obj[t].classList.add("complete"))
        }

        function l() {
            for (var t in a.obj) a.obj[t].hasAttribute("data-answer") && a.obj[t].classList.remove("complete")
        }

        this.container = s.container, this.obj = $ts.getEl("[data-" + s.type + "-obj]", this.container), this.target = $ts.getEl("[data-" + s.type + "-target]", this.container), this.totalCompleteCount = $ts.getEl("[data-answer]", this.container).length, this.completeCount = 0, this.showAnswer = function () {
            this.completeCount = this.totalCompleteCount, this.container.classList.add("complete");
            var t = [];
            for (var e in this.obj) if (this.obj[e].hasAttribute("data-answer")) {
                var n = s.getIndex({ obj: a.obj[e], type: "check" }),
                    i = s.getTarget({ index: n, type: "check", target: a.target });
                for (var o in this.obj[e].classList.add("complete"), this.obj[e].classList.add("checked"), i) t.push(i[o])
            }
            for (var e in t) t[e].classList.add("on");
            window.$callBack && window.$callBack.checkAnswer && window.$callBack.checkAnswer(a)
        }, this.reset = function () {
            for (var t in this.completeCount = 0, this.container.classList.remove("complete"), this.obj) this.obj[t].classList.remove("complete"), this.obj[t].classList.remove("checked");
            for (var t in this.target) this.target[t].classList.remove("on");
            window.$callBack && window.$callBack.checkReset && window.$callBack.checkReset(a)
        }, function () {
            for (var t in a.obj) {
                var e = s.getIndex({ obj: a.obj[t], type: "check" }),
                    n = s.getTarget({ index: e, type: "check", target: a.target });
                1 === a.totalCompleteCount ? a.obj[t].addEventListener("click", i.bind(this, a.obj[t], n)) : a.obj[t].addEventListener("click", o.bind(this, a.obj[t], n)), $ts.addHoverEvents(a.obj[t]), a.obj[t].addEventListener("click", $efSound.click)
            }
        }()
    }

    window.$check = function (t) {
        return new e(t)
    }
}(), function () {
    function e(t) {
        var e = this;
        this.container = t.container, this.obj = $ts.getEl("[data-" + t.type + "-obj]", this.container), this.showAnswer = function () {
            this.obj.forEach(function (t) {
                var e = t.getAttribute("data-answer");
                e && (t.value = e, t.classList.add("answerMode"), t.setAttribute("readonly", ""))
            }), window.$callBack && window.$callBack.inputAnswer && window.$callBack.inputAnswer(e)
        }, this.reset = function () {
            this.obj.forEach(function (t) {
                var e = t.getAttribute("data-answer");
                t.value = "", e && (t.classList.remove("answerMode"), t.removeAttribute("readonly", ""))
            }), window.$callBack && window.$callBack.inputReset && window.$callBack.inputReset(e)
        }, e.obj.forEach(function (t) {
            var e;
            t.hasAttribute("placeholder") && (e = t.getAttribute("placeholder"), t.setAttribute("onfocus", "placeholder=''"), t.setAttribute("onblur", "placeholder='" + e + "'")), t.setAttribute("autocomplete", "off")
        })
    }

    window.$input = function (t) {
        return new e(t)
    }
}(), function () {
    function e(s) {
        var a = this;

        function i(t, e) {
            if (1 === a.totalCompleteCount && a.reset(), t.hasAttribute("data-answer") && !t.classList.contains("complete")) {
                for (var n in a.completeCount++, t.classList.add("complete"), e) e[n].classList.add("on");
                s.alert && (a.alertPopup.setAttribute("class", "alert_popup on correct"), o()), s.option && s.option.answerSound && $efSound.correct(), window.$callBack && window.$callBack.oxCorrect && window.$callBack.oxCorrect({
                    quiz: a,
                    curObj: t,
                    curTarget: e
                })
            } else {
                for (var n in e) e[n].classList.add("on"), s.option && s.option.hide && function (t) {
                    setTimeout(function () {
                        t.classList.remove("on")
                    }, 500)
                }(e[n]);
                s.alert && (a.alertPopup.setAttribute("class", "alert_popup on incorrect"), o()), s.option && s.option.answerSound && window.$efSound.incorrect(), window.$callBack && window.$callBack.oxIncorrect && window.$callBack.oxIncorrect({
                    quiz: a,
                    curObj: t,
                    curTarget: e
                })
            }
            s.checkComplete()
        }

        function o() {
            setTimeout(function () {
                a.alertPopup.setAttribute("class", "alert_popup")
            }, 1200)
        }

        this.container = s.container, this.obj = $ts.getEl("[data-" + s.type + "-obj]", this.container), this.target = $ts.getEl("[data-" + s.type + "-target]", this.container), this.totalCompleteCount = s.customCompleteCount || $ts.getEl("[data-answer]", this.container).length, this.completeCount = 0, s.alert && (this.alertPopup = $ts.ce({
            tag: "div",
            class: "alert_popup",
            parent: this.container
        })), this.showAnswer = function () {
            this.completeCount = this.totalCompleteCount, this.container.classList.add("complete");
            var t = [];
            for (var e in this.obj) if (this.obj[e].hasAttribute("data-answer")) {
                var n = s.getIndex({ obj: this.obj[e], type: "ox" }),
                    i = s.getTarget({ index: n, type: "ox", target: this.target });
                for (var o in this.obj[e].classList.add("complete"), i) t.push(i[o])
            }
            for (var e in t) t[e].classList.add("on");
            window.$callBack && window.$callBack.oxAnswer && window.$callBack.oxAnswer(a)
        }, this.reset = function () {
            for (var t in this.completeCount = 0, this.container.classList.remove("complete"), this.obj) this.obj[t].classList.remove("complete");
            for (var t in this.target) this.target[t].classList.remove("on");
            window.$callBack && window.$callBack.oxReset && window.$callBack.oxReset(a)
        }, function () {
            for (var t in a.obj) {
                var e = s.getIndex({ obj: a.obj[t], type: "ox" }),
                    n = s.getTarget({ index: e, type: "ox", target: a.target });
                a.obj[t].addEventListener("click", i.bind(this, a.obj[t], n)), $ts.addHoverEvents(a.obj[t]), s.option && s.option.answerSound || a.obj[t].addEventListener("click", $efSound.click)
            }
        }()
    }

    window.$ox = function (t) {
        return new e(t)
    }
}(), function () {
    function e(e) {
        var n = this, i = $ts.getEl("[data-drag-drop-container]", e.container, 0),
            t = $ts.getEl("[data-drag-element]", i), o = $ts.getEl("[data-drop-area-element]", i),
            s = new DragDrop({ containerElement: i, dragElements: t, dropAreaElements: o });
        s.initialize(), this.container = i, this.obj = t, this.target = o, this.totalCompleteCount = t.length, this.completeCount = 0, s.endCallback = function (t) {
            t.isCorrect ? (n.completeCount++, $efSound.correct(), window.$callBack && window.$callBack.dragdropCorrect && window.$callBack.dragdropCorrect(n)) : ($efSound.incorrect(), window.$callBack && window.$callBack.dragdropIncorrect && window.$callBack.dragdropIncorrect(n)), n.totalCompleteCount === n.completeCount && i.classList.add("complete"), e.checkComplete()
        }, this.showAnswer = function () {
            i.classList.add("complete"), n.completeCount = this.totalCompleteCount, s.answerAll(), window.$callBack && window.$callBack.dragdropAnswer && window.$callBack.dragdropAnswer(n)
        }, this.reset = function () {
            i.classList.remove("complete"), n.completeCount = 0, s.resetAll(), window.$callBack && window.$callBack.dragdropReset && window.$callBack.dragdropReset(n)
        }
    }

    window.$dragdrop = function (t) {
        return new e(t)
    }
}(), function () {
    function e(o) {
        this.answers = [], this.dots = [], this.btns = [], this.svg = void 0, this.lines = [], Object.defineProperties(this, {
            len_dots: {
                get: function () {
                    return this.dots.length
                }
            }, len_answers: {
                get: function () {
                    return this.answers.length
                }
            }, allAnswered: {
                get: function () {
                    return this.lines.every(function (t) {
                        return "complete" === t.getAttribute("data-complete")
                    })
                }
            }
        }), this.initiate = function () {
            this.setAnswers(), this.setDots(), this.setBtns(), this.setSvg()
        }, this.setAnswers = function () {
            var n, t = o.container.dataset.drawLineAnswers;
            (t = t.split(" ")).forEach(function (t) {
                var e = [];
                n = n || [], e = (e = t.split(",")).map(function (t) {
                    return parseInt(t)
                }), n.push(e)
            }), this.answers = n
        }, this.setDots = function () {
            this.dots = $ts.getEl("[data-draw-line-dot]"), this.dots.forEach(function (t) {
                t.dotIndex = parseInt(t.dataset.drawLineDot)
            })
        }, this.setBtns = function () {
            var i = this;
            this.btns = $ts.getEl("[data-draw-line-btn]"), this.btns.forEach(function (t) {
                t.answerIndex = parseInt(t.dataset.drawLineBtn), t.addEventListener("click", function (t) {
                    for (var e, n = t.target; !n.hasAttribute("data-draw-line-btn");) n = n.parentElement;
                    n.dataset.complete || (e = i.answers[n.answerIndex - 1], i.answers[n.answerIndex - 1].answered = !0, i.drawLine(e), i.completeBtn(n), i.allAnswered && o.toggleAnswerBtn())
                }, !1), t.addEventListener("click", $efSound.click)
            })
        }, this.setSvg = function () {
            var t, e, n = document.createElementNS("http://www.w3.org/2000/svg", "g");
            n.style.stroke = "#e25050", n.style.strokeWidth = 3;
            for (var i = 0; i < this.len_answers; i++) t = document.createElementNS("http://www.w3.org/2000/svg", "line"), n.appendChild(t), this.lines.push(t);
            (e = document.createElementNS("http://www.w3.org/2000/svg", "svg")).style.position = "absolute", e.style.top = "0px", e.style.left = "0px", e.style.width = "100%", e.style.height = "100%", e.style.pointerEvents = "none", o.container.insertBefore(e, o.container.children[0]), e.appendChild(n)
        }, this.drawLine = function (t) {
            var e, n, i = this, o = [];
            t.forEach(function (t) {
                o.push(i.findDot(t))
            }), e = o.map(function (t) {
                return i.getDotPosition(t)
            }), this.lines.forEach(function (t) {
                n || "complete" !== t.getAttribute("data-complete") && (t.setAttribute("x1", e[0].x), t.setAttribute("x2", e[1].x), t.setAttribute("y1", e[0].y), t.setAttribute("y2", e[1].y), t.setAttribute("data-complete", "complete"), n = !0)
            })
        }, this.findDot = function (t) {
            for (var e = 0; e < this.len_dots; e++) if (t === this.dots[e].dotIndex) return this.dots[e]
        }, this.getDotPosition = function (t) {
            var e = $ts.getSize(t), n = $ts.getSize(o.container);
            return { x: e.left - n.left + e.width / 2, y: e.top - n.top + e.width / 2 }
        }, this.drawLines = function () {
            var e = this;
            this.answers.forEach(function (t) {
                t.answered || (e.drawLine(t), t.answered = !0)
            })
        }, this.resetLine = function (t) {
            t.setAttribute("x1", "0"), t.setAttribute("x2", "0"), t.setAttribute("y1", "0"), t.setAttribute("y2", "0"), t.setAttribute("data-complete", "")
        }, this.resetLines = function () {
            var e = this;
            this.lines.forEach(function (t) {
                e.resetLine(t)
            })
        }, this.completeBtn = function (t) {
            t.classList.add("complete"), t.dataset.complete = "complete", t.style.pointerEvents = "none"
        }, this.completeBtns = function () {
            var e = this;
            this.btns.forEach(function (t) {
                e.completeBtn(t)
            })
        }, this.resetBtn = function (t) {
            t.classList.remove("complete"), t.dataset.complete = "", t.style.pointerEvents = "auto"
        }, this.resetBtns = function () {
            var e = this;
            this.btns.forEach(function (t) {
                e.resetBtn(t)
            })
        }, this.checkAllAnswered = function () {
            return this.lines.every(function (t) {
                return "complete" === t.dataset.complete
            })
        }, this.showAnswer = function () {
            this.completeBtns(), this.drawLines()
        }, this.reset = function () {
            this.resetBtns(), this.resetLines(), this.answers.forEach(function (t) {
                t.answered = !1
            })
        }, this.initiate()
    }

    window.$drawline = function (t) {
        return new e(t)
    }, window.$selectCorrectQuiz = function () {
        var t = window.$ts.getEl(".js-selectCorrectQuiz");
        if (!t.length) return {
            resetAll: function () {
            }
        };
        var e = t.map(function (t) {
            var n = window.$ts.getEl(".js-select", t);

            function i(t) {
                return t.classList.contains("js-correct")
            }

            function e(t) {
                i(t.target) ? (window.$efSound.correct(), o(!0)) : (window.$efSound.incorrect(), o(!1))
            }

            function o(e) {
                n.forEach(function (t) {
                    i(t) && t.classList[e ? "add" : "remove"]("on")
                })
            }

            return n.forEach(function (t) {
                t.addEventListener("click", e)
            }), {
                reset: function () {
                    o(!1)
                }
            }
        });
        return {
            resetAll: function () {
                e.forEach(function (t) {
                    t.reset()
                })
            }
        }
    }(), window.$oxSelectQuiz = function () {
        var t = window.$ts.getEl(".js-oxSelect");
        if (!t.length) return {
            resetAll: function () {
            }
        };

        function e(t) {
            o(t, !1)
        }

        function i(t) {
            t.forEach(e)
        }

        function o(t, e) {
            t.classList[e ? "add" : "remove"]("on")
        }

        function s(t) {
            return window.$ts.getEl(".js-select", t)
        }

        return t.forEach(function (t) {
            var n = s(t);
            n.forEach(function (t) {
                t.addEventListener("click", function (t) {
                    var e = t.target;
                    i(n), o(e, !0)
                })
            })
        }), {
            resetAll: function () {
                t.map(s).forEach(function (t) {
                    i(t)
                })
            }
        }
    }()
}();

//toggle button
(() => {
    const toggleTypeBtns = document.querySelectorAll('[data-type="toggleButton"]');
    if (!!toggleTypeBtns) {
        for (let item of toggleTypeBtns) {
            item.addEventListener('click', (e) => {
                const _this = e.currentTarget;
                const _obj = _this.querySelector('[data-toggle-obj]')

                if (_obj.classList.contains('complete')) {

                    if (_this.dataset.active !== 'on') {
                        _this.dataset.active = 'on';
                    } else {
                        _this.dataset.active = 'off';
                        _obj.classList.remove('complete');

                        const wrap = _obj.closest('[data-quiz="toggle"]');
                        wrap.querySelector('[data-toggle-target="' + _obj.dataset.toggleObj + '"]').classList.remove('on');

                        // KmAudioPlayer.buttonClick();
                    }

                }
            })
        }
    }
})();






