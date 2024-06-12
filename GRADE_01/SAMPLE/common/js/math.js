
function onlyNum() {
    setTimeout(function () {
        $("input").keyup(function (event) {
            regexp = /[^0-9]/gi;
            v = $(this).val();
            if (regexp.test(v)) {
                $(this).val(v.replace(regexp, ''));
            }
        });

    },100)
}


function forMula(){
    var calculation = QSAll('.calculation');

    for (var i = 0; i < calculation.length ; i++ ){
        var operator =calculation[i].querySelector('.operator'),
            input = calculation[i].querySelectorAll('input');
        for(var j = 0 ; j < input.length; j++){
            input[j].classList.add('userTarget');
        }

        calculation[i].getAttribute('data-sum') == 'plus' ? operator.innerHTML = '+' : operator.innerHTML = '-' ;
        console.log(calculation[i].getAttribute('data-sum'))
        verticalFormula(calculation[i]);
    }

    function verticalFormula(container) {

        var qBox = container.querySelector('.qBox'),
            qText = container.querySelector('.qText'),
            blindBox = createElement('div', qBox.parentNode, 'blindBox');
        qBox.querySelector('.qText').classList.add('calcText');

        blindBox.addEventListener('mousedown', function(){

            var sumAttribute = container.getAttribute('data-sum');
            sumOutput(this, container);

        });


        function sumReset(calcText , target, container) {
            var userTarget = container.querySelectorAll('.userTarget'),
                formulaAns = container.querySelector('.formulaAns');

            for(k = 0 ; k < userTarget.length; k++) {
                userTarget[k].addEventListener('mousedown', function () {
                    if(this.parentNode.querySelectorAll('.reset').length < 1){
                        calcText.innerHTML = '';

                        formulaAns.appendChild(target);
                        qBox.classList.remove('dapView');
                        this.classList.add('reset');
                    }else {
                        for(var z = 0; z < userTarget.length; z++){
                            userTarget[z].classList.remove('reset');
                        }
                    }
                    this.value = "";
                })
            }
        }

        function sumOutput(target, container) {
            var userNumberA = container.querySelector('.top.NumberBox input'),
                userNumberB = container.querySelector('.bottom.NumberBox input'),
                calcText = container.querySelector('.qBox .qText');
            if(userNumberA.value !== "" && userNumberB.value !== "") {
                if (container.getAttribute('data-sum') == 'plus') {
                    var sumValue = parseInt(userNumberA.value) + parseInt(userNumberB.value);
                } else {
                    var sumValue = parseInt(userNumberA.value) - parseInt(userNumberB.value);
                }

                target.parentNode.removeChild(target);
                calcText.innerHTML = sumValue;
                sumReset(calcText ,target, container);
            }
        }
    }
}