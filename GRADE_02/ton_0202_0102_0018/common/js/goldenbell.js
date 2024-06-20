function startGB() {
  var gateCont = QS('.gate_container'),
    contents = document.getElementById('contents'),
    contentWrap = document.getElementById('gbContentWrap'),
    btnConfigs = gateCont.querySelectorAll('.wrapSet button'),
    btnConfigLen = btnConfigs.length,
    progress = document.getElementById('gbProgress'),
    que = contentWrap.querySelector('.que10'),
    btnTimer = contents.querySelector('.qzBtnTimer'),
    timerCnt = btnTimer.querySelector('.count'),
    timerInterval = null,
    curStep = 0,
    btnPrev = contents.querySelector('.innerPrevBtn'),
    btnNext = contents.querySelector('.innerNextBtn '),
    qIconBoxes = contentWrap.querySelectorAll('.qBox'),
    qBoxLen = qIconBoxes.length,
    btnOXList = contentWrap.querySelectorAll('.boxOX button'),
    btnOXLen = btnOXList.length,
    quizLen = 10,
    timeLimit = 10,
    isLast = false,
    i = 0,
    init = function () {
      var gbContents = contentWrap.querySelectorAll('.gbContent');
      var gbContentsLen = gbContents.length;
      var gbContent = null;
      var boxOX = null;

      curStep = 0;
      isLast = false;
      btnTimer.disabled = false;

      gateCont.classList.remove('off');
      que.firstElementChild.classList.add('hide');
      que.classList.add('hide');

      if (progress.childElementCount) {
        progress.removeChild(progress.firstElementChild);
      }
      stopTimer();

      for (i = 0; i < gbContentsLen; i++) {
        gbContent = gbContents[i];
        boxOX = gbContent.querySelector('.boxOX');

        if (gbContent.classList.contains('complete')) {
          if (gbContent.querySelector('.qBox')) {
            gbContent.querySelector('.qBox').classList.remove('dapView');
          } else if (boxOX) {
            boxOX.querySelector('.clicked').classList.remove('clicked');
            boxOX.querySelector('.sel').classList.remove('sel');
            boxOX.querySelector('.desc') &&
              boxOX.querySelector('.desc').classList.remove('show');
          }
        }
        gbContent.classList.add('hide');
        gbContent.classList.remove('complete');
      }
      btnPrev.classList.add('hide');
      btnNext.classList.remove('hide');

      contents.querySelector('.qzBtnHome').classList.remove('hide');
      contents.querySelector('.gbBtnOut').classList.remove('last');
      contents.querySelector('.gbBtnSuccess').classList.remove('show');
    },
    reset = function () {
      var prevContent = que.querySelectorAll('.gbContent')[curStep];
      var boxOX = prevContent.querySelector('.boxOX');

      btnTimer.disabled = false;

      stopTimer();
      setTimeout(function () {
        startTimer();
      }, 0);

      if (prevContent.classList.contains('complete')) {
        prevContent.classList.remove('complete');
        if (prevContent.querySelector('.qBox')) {
          prevContent.querySelector('.qBox').classList.remove('dapView');
        } else if (boxOX) {
          boxOX.querySelector('.clicked').classList.remove('clicked');
          boxOX.querySelector('.sel').classList.remove('sel');
          boxOX.querySelector('.desc') &&
            boxOX.querySelector('.desc').classList.remove('show');
        }
      }
    },
    setConfig = function () {
      var btnWrap = this.parentElement;
      efSound('./media/tab_click.mp3');
      btnWrap.querySelector('.sel').classList.remove('sel');
      this.classList.add('sel');

      if (btnWrap.id === 'gbQue') {
        quizLen = this.value;
        que = contentWrap.querySelector('.que' + quizLen);
      } else {
        timeLimit = this.value;
      }
    },
    startQuiz = function () {
      init();
      startTimer();
      setProgress();
      que.classList.remove('hide');
      que.firstElementChild.classList.remove('hide');
    },
    setProgress = function () {
      var list = document.createElement('ul');
      var li = null;

      for (i = 0; i < quizLen; i++) {
        li = document.createElement('li');
        li.textContent = i + 1;
        if (!i) {
          li.className = 'sel';
        }
        list.appendChild(li);
      }
      progress.appendChild(list);
    },
    startTimer = function () {
      var cnt = 1;

      btnTimer.disabled = false;
      timerCnt.textContent = timeLimit;
      btnTimer.classList.remove('off');
      btnTimer.classList.add('go');
      btnTimer.querySelector('.current').style.animation =
        'goldenbellTimerGuage ' + timeLimit + 's linear';

      timerInterval = setInterval(function () {
        if (timeLimit - cnt > 0) {
          timerCnt.textContent = timeLimit - cnt;
          cnt++;
        } else {
          efSound('./media/wrong.mp3');
          stopTimer();
        }
      }, 1000);
    },
    stopTimer = function () {
      clearInterval(timerInterval);
      btnTimer.classList.remove('go');
      btnTimer.classList.add('off');
      timerCnt.textContent = 0;
      btnTimer.querySelector('.current').style.animation = 'none';
    },
    moveNext = function () {
      var curProgress = progress.querySelector('.sel');

      if (
        !que
          .querySelectorAll('.gbContent')
          [curStep].classList.contains('complete')
      ) {
        alert('문제를 풀어주세요.');
      } else {
        efSound('./media/tab_click.mp3');
        reset();

        curProgress.classList.remove('sel');
        curProgress.classList.add('done');
        curProgress.nextElementSibling.classList.add('sel');

        if (!curStep) {
          btnPrev.classList.remove('hide');
        }

        que.children[curStep].classList.add('hide');
        curStep++;
        que.children[curStep].classList.remove('hide');

        if (curStep === quizLen - 1) {
          btnNext.classList.add('hide');
          isLast = true;
        }
      }
    },
    movePrev = function () {
      var curProgress = progress.querySelector('.sel');

      efSound('./media/tab_click.mp3');
      reset();

      curProgress.classList.remove('sel');
      curProgress.classList.remove('done');
      curProgress.previousElementSibling.classList.add('sel');

      if (curStep === quizLen - 1) {
        btnNext.classList.remove('hide');
      }

      que.children[curStep].classList.add('hide');
      curStep--;
      que.children[curStep].classList.remove('hide');

      if (!curStep) {
        btnPrev.classList.add('hide');
      }
    },
    eliminatedAll = function () {
      stopTimer();
      showPopup(false);
      initAfterFeed(init, 500);
    },
    checkOX = function () {
      if (this.value === 'true') {
        efSound('./media/correct.mp3');
        checkAnswer.call(this);
        this.classList.add('sel');
        this.parentElement
          .querySelector('button:not(.sel)')
          .classList.add('clicked');
        this.parentElement.querySelector('.desc') &&
          this.parentElement.querySelector('.desc').classList.add('show');
      } else {
        efSound('./media/incorrect.mp3');
      }
    },
    checkAnswer = function () {
      stopTimer();
      btnTimer.disabled = true;
      this.closest('.gbContent').classList.add('complete');

      if (isLast) {
        contents.querySelector('.qzBtnHome').classList.add('hide');
        contents.querySelector('.gbBtnOut').classList.add('last');
        contents.querySelector('.gbBtnSuccess').classList.add('show');
      }
    },
    initAfterFeed = function (callback, timeout) {
      var feedback = QS('.alert_popup');
      var checkHide = setInterval(function () {
        if (feedback.style.display === 'none') {
          clearInterval(checkHide);
          callback();
          efSound('./media/checkSound.mp3');
        }
      }, timeout);
    };

  // 시작
  gateCont.querySelector('.introStartBtn').addEventListener('click', startQuiz);
  // 출제 문항, 타이머
  for (i = 0; i < btnConfigLen; i++) {
    btnConfigs[i].addEventListener('click', setConfig);
  }
  // 타이머
  btnTimer.addEventListener('click', function () {
    efSound('./media/tab_click.mp3');
    if (this.classList.contains('go')) {
      stopTimer();
    } else {
      startTimer();
    }
  });
  // 홈
  contents.querySelector('.qzBtnHome').addEventListener('click', function () {
    var isCheck = confirm(
      '홈으로 돌아가시겠습니까?\n(골든벨 퀴즈가 초기화됩니다.)'
    );
    if (isCheck) {
      init();
      efSound('./media/checkSound.mp3');
    }
    efSound('./media/tab_click.mp3');
  });
  // 전원 탈락
  contents.querySelector('.gbBtnOut').addEventListener('click', eliminatedAll);
  // 골든벨 성공
  contents
    .querySelector('.gbBtnSuccess')
    .addEventListener('click', function () {
      showPopup(true);
      initAfterFeed(init, 500);
    });
  // 이전/다음
  btnPrev.addEventListener('click', movePrev);
  btnNext.addEventListener('click', moveNext);
  // qBox
  for (i = 0; i < qBoxLen; i++) {
    qIconBoxes[i].addEventListener('click', checkAnswer);
  }
  // OX
  for (i = 0; i < btnOXLen; i++) {
    btnOXList[i].addEventListener('click', checkOX);
  }
  // 초기화
  init();
  efSound('./media/checkSound.mp3');
}

window.addEventListener('load', startGB, false);
