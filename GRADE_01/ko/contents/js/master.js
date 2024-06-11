var scriptFile = '<script type="text/javascript" src="../ko/libs/js/ts.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/animate.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/dragdrop.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/slider.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/popup.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/scroll.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/controller.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/appear.js"></script>' +
    '<script type="text/javascript" src="../ko/libs/js/jquery.js"></script>' +
    '<script type="text/javascript" src="../ko/contents/js/quiz/quiz.js"></script>' +
    '<script type="text/javascript" src="../ko/contents/js/pageManager.js"></script>' +
    '<script type="text/javascript" src="../ko/contents/js/sprite.js"></script>' +
    '<script type="text/javascript" src="../ko/contents/js/kmCommon.js"></script>' +
    '<script type="text/javascript" src="./js/contents.js"></script>';



//document.querySelector("body").insertAdjacentHTML("beforeend", scriptFile);

var arrFile = [
    "../ko/libs/js/ts.js",
    "../ko/libs/js/animate.js",
    "../ko/libs/js/dragdrop.js",
    "../ko/libs/js/slider.js",
    "../ko/libs/js/popup.js",
    "../ko/libs/js/scroll.js",
    "../ko/libs/js/controller.js",
    "../ko/libs/js/appear.js",
    "../ko/libs/js/jquery.js",
    "../ko/contents/js/quiz/quiz.js",
    "../ko/contents/js/pageManager.js",
    "../ko/contents/js/sprite.js",
    "../ko/contents/js/kmCommon.js",
    "./js/contents.js"
];

(function() {
    var loadCnt = 1;

    window.onload = function(){
        loadScriptFile()
    };



    function loadScriptFile(){
        if(arrFile[loadCnt-1] == undefined){

        }else{
            var my_head = document.getElementsByTagName('body')[0];
            var my_js = document.createElement('script');
            my_js.type= 'text/javascript';
            my_js.async = false;
            my_js.src = arrFile[loadCnt-1];
            my_js.onload = function (){
                loadCnt++;
                loadScriptFile();

            };
            my_head.appendChild(my_js);
        }

    }

})();
