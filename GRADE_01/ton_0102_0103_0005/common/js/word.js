document.addEventListener('DOMContentLoaded', function () { setTimeout(function(){
    if(QSAll('.sciWordBox').length){ sciWordExplane(); }
 }, 100); }, false);


//  2017 . 12 . 29 ~ , YD




// 과학 핵심 용어 설명
// var sciTabObj = [];



function sciWordExplane(){
    var innerText = QSAll('.innerText'),
        wordBox = QSAll('.sciWordBox');
    for(var i = 0; i < 12; i++ ){
            var innerBg = createElement('div' , wordBox[i] , 'innerBg'),
                sliderDot = QSAll('.sliderDot');

        if(sciTabObj.listName[i] ==  undefined){

            var sciTabLeng = sciTabObj.listName.length;
            wordBox[i].classList.add('none');
            if(wordBox[i].classList.contains('none')){
                if(sciTabLeng < 5 ){
                    wordBox[i].style.display = 'none';
                }else if(sciTabLeng === 5  || sciTabLeng === 6){
                    if(i > 5) {
                        wordBox[i].style.display = 'none';
                    }
                }else if(sciTabLeng === 7 || sciTabLeng === 8){
                    if(i > 7){
                        wordBox[i].style.display = 'none';
                    }
                }else if(sciTabLeng > 7) {
                    wordBox[i].style.display = 'inline-flex';
                }
            }



            if(sciTabLeng === 2 ) { QS('.sciWordUl').classList.add('two'); }
            else if(sciTabLeng === 3 ) { QS('.sciWordUl').classList.add('three'); }
            else if(sciTabLeng === 4 ) { QS('.sciWordUl').classList.add('four'); }
            else if(sciTabLeng === 5 || sciTabLeng === 6 ) { QS('.sciWordUl').classList.add('five'); }
            else if(sciTabLeng === 7 || sciTabLeng === 8 ) { QS('.sciWordUl').classList.add('seven'); }

        }else{
            wordBox[i].querySelector('.innerBg').innerHTML = '<span>' + sciTabObj.listName[i] + '</span>';
        }
    }
}


