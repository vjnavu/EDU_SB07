"use strict";
function mathCalculationInit() {
    $ts.getEl("[data-calc-container]").forEach(function (t) {
        return new CALCQUIZ({ container: t, option: t.dataset.option });
    });
}
function CALCQUIZ(t) {
    (this.container = t.container),
        (this.option = t.option),
        (this.inputs = $ts.getEl("[data-calc-input]", this.container)),
        (this.inputA = $ts.getEl('[data-calc-input="A"]', this.container)[0]),
        (this.inputB = $ts.getEl('[data-calc-input="B"]', this.container)[0]),
        (this.answer = $ts.getEl(".answerBox", this.container)),
        (this.sumValue = null),
        (this.middleValue = null),
        (this.remainderValue = null),
        (this.valueArray = []);
    var i = this;
    (this.set = function () {
        this.inputs.forEach(function (t, e) {
            t.addEventListener("input", i.onlyNumberInput),
                t.addEventListener("focusout", i.onlyNumberInput),
                t.addEventListener("keyup", i.onlyNumberInput),
                t.addEventListener("input", i.inputCheck),
                t.addEventListener("keyup", i.inputCheck),
                t.addEventListener("click", function () {
                    i.inputClear(this, e);
                });
        });
        for (var t = 0; t < this.answer.length; t++) this.answer[t].addEventListener("click", this.sumOutPut);
    }),
        (this.onlyNumberInput = function () {
            var t = /[^0-9]/gi;
            t.test(this.value) && (this.value = this.value.replace(t, "")), i.inputCheck() ? i.pointerAdd() : i.pointerRemove();
        }),
        (this.pointerAdd = function () {
            for (var t = 0; t < this.answer.length; t++) this.answer[t].classList.add("on");
        }),
        (this.pointerRemove = function () {
            for (var t = 0; t < this.answer.length; t++) this.answer[t].classList.remove("on");
        }),
        (this.inputCheck = function () {
            return i.inputs.every(function (t) {
                return "" !== t.value;
            });
        }),
        (this.inputClear = function (t, e) {
            (t.value = ""), i.sumReset();
        }),
        (this.sumOutPut = function () {
            if (i.inputCheck()) {
                switch (i.option) {
                    case "plus":
                        i.plusValue();
                        break;
                    case "minus":
                        i.minusValue();
                        break;
                    case "multi":
                        i.multiValue();
                        break;
                    case "dev":
                        i.devValue();
                }
                this.classList.add("complete"),
                    this.hasAttribute("data-answer")
                        ? (this.querySelector('.answer').textContent = i.sumValue) : this.hasAttribute("data-remainder") 
                        ? (this.querySelector('.answer').textContent = i.remainderValue) : this.hasAttribute("data-middle") && (this.querySelector('.answer').textContent = i.middleValue),
                    window.$efSound.click();

                    console.log(i.sumValue)
            }
        }),
        (this.plusValue = function () {
            this.sumValue = parseInt(this.inputA.value) + parseInt(this.inputB.value);
        }),
        (this.minusValue = function () {
            this.sumValue = parseInt(this.inputA.value) - parseInt(this.inputB.value);
        }),
        (this.multiValue = function () {
            this.sumValue = parseInt(this.inputA.value) * parseInt(this.inputB.value);
        }),
        (this.devValue = function () {
            (this.sumValue = parseInt(parseInt(this.inputA.value) / parseInt(this.inputB.value))),
                (this.remainderValue = parseInt(this.inputA.value) % parseInt(this.inputB.value)),
                (this.middleValue = parseInt(this.inputB.value) * parseInt(parseInt(this.inputA.value) / parseInt(this.inputB.value)));
        }),
        (this.sumReset = function () {
            for (var t = 0; t < this.answer.length; t++) this.answer[t].classList.remove("complete"), (this.answer[t].childNodes[0].innerText = "");
        }),
        this.set();
}
