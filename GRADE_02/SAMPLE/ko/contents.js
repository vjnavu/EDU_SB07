var CONTENTS = CONTENTS || {};
CONTENTS = (function () {
  var contents = {
    start: function () {
      setTimeout(function () {
        if ($ts.getEl('[data-open-gate]')) {
          $ts.loadScriptFile('../ko/contents/js/cmn_openGate.js', function () {
            openGateInit();
          });
        }
        if ($ts.getEl('[data-addLine-container]')) {
          $ts.loadScriptFile('../ko/contents/js/quiz/quiz_addLine.js', function () {
            addLineInit();
          });
        }
        if ($ts.getEl('[data-puzzle-container]')) {
          $ts.loadScriptFile('../ko/contents/js/quiz/quiz_math_word.js', function () {
            puzzleQuizInit();
          });
        }
        if ($ts.getEl('[data-calc-container]')) {
          $ts.loadScriptFile('../ko/contents/js/quiz/quiz_math_calc.js', function () {
            mathCalculationInit();
          });
        }
        if ($ts.getEl('[data-video-link]')) {
          tSherpaVideoInitLayer();
          // $ts.loadScriptFile('http://e.tsherpa.co.kr/include/js/tsherpa.js', function(){
          //   tSherpaVideoInit();
          // });
        }
        if ($ts.getEl('.wordQuizContent').length) {
          $ts.loadScriptFile('../ko/contents/js/quiz/quiz_life_wordQuiz.js', function () {
            wordQuizHint();
          });
        }
        if ($ts.getEl('.fishing').length) {
          $ts.loadScriptFile('../ko/contents/js/quiz/quiz_life_fishingGame.js', function () {
            fishingGame();
          });
        }
      }, 50);

    },
    reset: function () {
      if ($ts.getEl('[data-addLine-container]')) {
        $ts.loadScriptFile('../ko/contents/js/quiz/quiz_addLine.js', function () {
          resetAddLine();
        });
      }
      if ($ts.getEl('.charSpriteAni').length > 0) $prite.allresetSprite();
    }
  };
  return contents;
})();

// 티셀파 비디오 링크
function tSherpaVideoInitLayer() {
  var tVideo = $ts.getEl('[data-video-link]');
  tVideo.forEach(function (video) {
    video.addEventListener('click', tSherpaGoLink);
    video.addEventListener('click', $efSound.click);
  });
  function tSherpaGoLink() {
    viewChunjaeMediaLayer(this.getAttribute('data-video-link'));
  }
}

function viewChunjaeMediaLayer(mID) {
  var strURL;
  var laypopHtml = '<div id="layerPop_vid" class="layerPop_vid"><div>';
  laypopHtml += '<div class="layerPop_vid-close"></div>';
  laypopHtml += '<div class="layerPop_vid-content">';

  if (mID.toLowerCase().indexOf("_800k.mp4") > -1 || mID.toLowerCase().indexOf("_300k.mp4") > -1) {
    strURL = "https://e.tsherpa.co.kr/media/mediaframe3.aspx?mid=" + mID;
  }
  else {
    strURL = "https://e.tsherpa.co.kr/media/mediaframe1.aspx?fname=" + (mID.toLowerCase().indexOf("https://chunjae.gscdn.com") > -1 ? mID.replace("https://", "") : mID);
  }

  laypopHtml += '<iframe width="100%" height="100%" src="' + strURL + '" allowfullscreen="" allow="autoplay"></iframe>';
  laypopHtml += '</div>';
  laypopHtml += '</div></div>';

  var el_wrap = document.querySelector('#wrap');

  el_wrap.insertAdjacentHTML('beforeend', laypopHtml);

  var closeBtn = document.querySelector('.layerPop_vid-close');

  closeBtn.addEventListener('click', function () {
    document.querySelector('#layerPop_vid').remove();
  });

}






// 자음모음 퀴즈_힌트 보기
function wordQuizHint() {
  var hintBtn = document.querySelector('.wordQuizContent [data-hint]');

  window.$callBack.viewAnswer = function (obj) {
    hintBtn.classList.add('off');
  }
  window.$callBack.hideAnswer = function (obj) {
    hintBtn.classList.remove('off');
  }
  hintBtn.addEventListener('click', function () {
    var hintDrag = document.querySelectorAll('[data-hint-obj]');
    var hintDrop = document.querySelectorAll('[data-hint-area]');

    hintDrag.forEach(function (dragObj) {
      hintDrop.forEach(function (dropArea) {
        var dragIdx = dragObj.getAttribute('data-hint-obj');
        var dropIdx = dropArea.getAttribute('data-hint-area');

        var copiedElement = dragObj.cloneNode(true);
        copiedElement.classList.add('dragObjComplete');
        dropArea.appendChild(copiedElement);
      });
      dragObj.classList.add('dragObjComplete')
    });
    hintBtn.classList.add('off')
  });

}