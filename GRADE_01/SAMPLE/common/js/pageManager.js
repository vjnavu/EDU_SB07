'use strict';

(function () {
  var loadingImage = $ts.ce({
      tag: 'div',
      class: 'loadingImage',
      parent: document.body,
    }),
    loadingAni;

  loadingAni = setInterval(function () {
    if (window.$loadingData) {
      loadingImage.style.display = 'block';
    } else {
      clearInterval(loadingAni);
      loadingImage.style.display = 'none';
    }
  }, 50);

  // ------------------------------------------------------------------------------ //
  // html 단독으로 실행 될 때(스케일, 배경 이미지 적용)
  // if (window.parent == window) {
  //   console.log('[  Run Contents Mode(no UI)  ]');
  //   document.querySelector('html').classList.add('noUI');
  //   $ts.loadScriptFile('common/js/scale.js', function () {
  //     pageManager.scale = new window.$cale({
  //       target: $ts.getEl('#wrap'),
  //       mode: '',
  //       align: 'center',
  //     });
  //     // pageManager._zoomRate = pageManager.scale.zoomRate;
  //     pageManager.__defineGetter__('zoomRate', function () {
  //       return this.scale.zoomRate;
  //     });
  //     // pageManager.__defineSetter__("zoomRate", function(x) { this.a = x/2; });
  //     // pageManager.zoomRate = new window.$cale({target: $ts.getEl('#wrap'), mode: '', align: 'center'}).zoomRate;
  //     setTimeout(function () {
  //       $ts.getEl('#wrap').style.opacity = 1;
  //     }, 100);
  //   });
  // }
  // // UI 내부에서 실행될 때(스케일, 배경 이미지 삭제)
  // else {
  //   if ($ts.getEl('main')[0].classList.contains('sing')) {
  //   } else uiResetTransform();

  //   setTimeout(function () {
  //     pageManager.zoomRate = 1;
  //   }, 100);
  // }
  // 사파리 화면 움직임 취소
  document.addEventListener(
    'touchmove',
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  );
  // ------------------------------------------------------------------------------ //
  // window에 등록된 함수를 찾아서 실행(html에서 실행할 때 주로 사용) ----------------- //
  window.$run = function (name, fnc) {
    // name: 함수 이름, fnc: 실행될 함수
    var runFnc,
      run = setInterval(function () {
        if (name === '' || window[name] !== undefined) {
          clearInterval(run);
          if (fnc) fnc();
        }
      }, 10);
  };

  window.$callBack = {};
  // ------------------------------------------------------------------------------ //

  var pageManager = {};

  // 페이지 이동, 팝업 실행 시 초기화 ----------------------------------------------- //
  // 객체
  var array = {
    // 미디어 컨트롤러(오디오 & 영상)
    controller: [],
    // 개별 실행되는 오디오
    singleAudio: [],
    sync: [],

    get controllerLen() {
      return this.controller.length;
    },
    get singleAudioLen() {
      return this.singleAudio.length;
    },
  };

  // ------------------------------------------------------------------------------ //
  // reset
  pageManager.reset = function (obj, type) {};
  pageManager.mediaReset = function () {
    if (array.controllerLen)
      for (var i in array.controller) array.controller[i].stop();
    if (array.singleAudioLen)
      for (var i in array.singleAudio) array.singleAudio[i].stop();
    if (array.sync.length) for (var i in array.sync) array.sync[i].reset();
  };
  pageManager.allEventReset = function () {};

  // 페이지에서 관련 속성을 찾아서 자동으로 실행 -------------------------------- //

  function autoRun_Control(container) {
    for (var i in container) {
      var mediaType = container[i].getAttribute('data-media-container'),
        mediaBtns = $ts.getEl('[data-media-btn]', container[i]),
        controlType = container[i].getAttribute('data-media-control');

      var newController = new $controller({
        container: container[i],
        mediaType: mediaType,
        controlType: controlType,
        mediaBtns: mediaBtns,
        callBack: {
          play: function (Control) {
            for (var i in array.controller) {
              if (array.controller[i].controller !== Control.controller) {
                array.controller[i].stop();
              }
            }
            if (window.$callBack.mediaStart)
              window.$callBack.mediaStart(Control);
          },
          pause: function (Control) {
            if (window.$callBack.mediaPause)
              window.$callBack.mediaPause(Control);
          },
          stop: function (Control) {
            if (window.$callBack.mediaEnd) window.$callBack.mediaEnd(Control);
          },
          close: function(Control) {
              window.$callBack.videoClose && window.$callBack.videoClose(Control);
          }
        },
      });

      array.controller.push(newController);
    }
  }
  // ----------------------------------------------------------------------------- //

  // 자동 실행 객체 검색 ---------------------------------------------------------- //
  function autoRun() {
    // hover
    var elements = $ts.getEl('[data-hover]');
    if (elements) {
      for (var idx in elements) {
        $ts.addHoverEvents(elements[idx], 'preventDefault');
      }
    }
    // controller
    if ($ts.getEl('[data-media-container]')) {
      autoRun_Control($ts.getEl('[data-media-container]'));
    }
    // sprite motion
    if ($ts.isDevice) {
      document.querySelector('#wrap').classList.add('ISMOBILE');
    }
    // CONTENTS.start();
  }

  (function () {
    window.$efSound = {};

    var efArray = {
      click: $ts.createAudio.set('media/click.mp3'),
      correct: $ts.createAudio.set('media/correct.mp3'),
      incorrect: $ts.createAudio.set('media/incorrect.mp3'),
      wrong: $ts.createAudio.set('media/wrong.mp3'),
      checkSound: $ts.createAudio.set('media/checkSound.mp3'),
      // clap: $ts.createAudio.set('media/clap.mp3'),
      // animation: $ts.createAudio.set('media/animationBG.mp3'),
    };

    for (var name in efArray) appendEfAudio(name, efArray[name]);

    function appendEfAudio(name, sound) {
      sound.load();
      window.$efSound[name] = function () {
        $ts.createAudio.interval(sound.duration, function () {
          stopEfSound();
          sound.play();
        });

        return sound;
      };
    }

    function stopEfSound(audio) {
      for (var name in efArray) {
        efArray[name].pause();
        if (efArray[name].currentTime) efArray[name].currentTime = 0;
      }
    }

    window.$efSound.stop = stopEfSound;
    window.$efSound.muted = function (boolean) {
      for (var name in efArray) {
        efArray[name].muted = boolean;
      }
    };
  })();

  function completeQuizManually(opts) {
    opts.container.classList.add('complete');
    if (opts.answerBtn) opts.answerBtn.classList.add('reset');
  }

  document.addEventListener('DOMContentLoaded', function () {
    autoRun();
    window.$efSound.muted(true);

    var isMuted = true;
    document.body.addEventListener('mousedown', function () {
      if (isMuted) {
        window.$efSound.muted(false);
        isMuted = false;
      }
    });
    document.body.addEventListener('touchstart', function () {
      if (isMuted) {
        window.$efSound.muted(false);
        isMuted = false;
      }
    });
  });

  // ----------------------------------------------------------------------------- //

  pageManager.array = array;
  pageManager.completeQuizManually = completeQuizManually;
  window.$pm = pageManager;
  // console.log(pageManager);
})();

// function uiResetTransform() {
//   var uiElements = {
//     frame: parent.document.getElementById('frame'),
//     uiTextTop: parent.document.getElementsByClassName(
//       'uiText_top_container'
//     )[0],
//     activeHelper: parent.document.getElementsByClassName(
//       'activeHelper_container'
//     )[0],
//     headerInfo: parent.document.getElementsByClassName(
//       'headerInfoContainer'
//     )[0],
//   };

//   for (var key in uiElements) {
//     uiElements[key].style.webkitTransform = '';
//     uiElements[key].style.mozTransform = '';
//     uiElements[key].style.msTransform = '';
//     uiElements[key].style.transform = '';
//     uiElements[key].style.zIndex = '';
//   }
// }

// function openPageCallback(object) {}

// 모든 DOM ELEMENTS가 로딩되었음을 CHECK
// window.DOMelementsLoaded = true;
