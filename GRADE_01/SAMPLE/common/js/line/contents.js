var CONTENTS = CONTENTS || {};
CONTENTS = (function () {
  var contents = {
    start: function () {
      setTimeout(function () {
        //qBox & examBox (정답 박스 및 예 보기 박스)
        if (QSAll('.pageContainer > li').length > 0) {
          tabInit();
        } //탭
        if (
          QSAll('.qBox').length > 0 ||
          QSAll('.examBox').length > 0 ||
          QSAll('.dapCheckBtn').length > 0
        ) {
          CONTENTS.quizBox.init();
          dapBtnCheck();
        }
        if (QSAll('.popbox').length > 0 || QSAll('.popBtn').length)
          popboxInit(); // 팝업
        if (QSAll('.multiBox').length > 0) {
          sliderFn();
        } // 탭+슬라이드+도트(etc)
        if (QSAll('.gate_container').length > 0) {
          initGatePage();
        }
        if (QSAll('.contentsTitle .titleIcon').length) {
          iconTextFn();
        }
        if (QSAll('.selfCheckBox').length) {
          selfCheckFN();
        }
        if (QSAll('.characterText').length == QSAll('.graph').length) {
          textBoxCanvas();
        }
        if (QSAll('.showObj').length) {
          showObjFn();
        }
        if (QSAll('.svgContainer').length) {
          // clickNumAddLine();
        }
        if (QSAll('.balloonBox') !== null) {
          balloonPopupInit();
        }
        if (QSAll('.selectBox').length > 0 || QSAll('.oxClick').length > 0) {
          OXClickFn();
        }

        //이미지 줌
        if (QSAll('.zoomContainer').length > 0) {
          // TODO: 리셋 버튼 추가
          // imgZoomInit();
          loadScriptFile('common/js/zoomImage.js', function () {
            zoomInstance = new ZoomImage(
              QS('.page_' + tabIdx).querySelector('.zoomContainer')
            );
          });
        }
        if (isThere('.btnDownload')) {
          initDownload();
        }
      }, 50);
    },
  };
  return contents;
})();

// ******************************************************************************
// 정답 박스 : 물음표
var zoomInstance = null;
var tabIdx = 1;
var tabIdxArray = [];
var innerPageNum = 0;
var totalCount = 0;
var dapCount = 0;
var popupIdx = 0;
var popupNum = 0;

CONTENTS.quizBox = {
  boxType: QSAll('.boxType'),
  dapBtn: QSAll('.dapCheckBtn'),
  spliced: null,
  init: function () {
    for (var i = 0; i < this.boxType.length; i++) {
      var boxName = this.boxType[i].classList[1] == 'qBox' ? 'q' : 'exam',
        isIconBox = createElement('div', this.boxType[i], boxName + 'IconBox'),
        isIcon = null,
        isBgBox = createElement('div', this.boxType[i], boxName + 'BoxBg');

      if (this.boxType[i].dataset.spell) {
        this.boxType[i].classList.add('spellBox');
        isIcon = createElement('div', isIconBox, boxName + 'Spell');

        var spellTxt = this.boxType[i].dataset.spell.split(',');
        for (var z = 0; z < spellTxt.length; z++) {
          isIcon.innerHTML += '<span>' + spellTxt[z] + '</span>';
        }
      } else {
        isIcon = createElement('div', isIconBox, boxName + 'Icon');
      }

      if (this.boxType[i].querySelectorAll('.qText').length !== null) {
        var qText = this.boxType[i].querySelectorAll('.qText');
        for (var j = 0; j < qText.length; j++) {
          isBgBox.appendChild(qText[j]);
        }
      }
      this.boxType[i].addEventListener(
        gameManager.eventSelector.upEvent,
        function () {
          CONTENTS.quizBox.start(this);
        }
      );
    }
  },
  start: function (_this) {
    var isBoxClass = _this.classList[1] == 'qBox' ? 'q' : 'exam',
      isViewName = isBoxClass == 'q' ? 'dap' : 'exam';
    var pages = QS('.page_' + tabIdx);
    var tableCont = _this.closest('.tableContainer');
    var i = 0;

    if (!_this.closest('.cellTab')) {
      efSound('media/tab_click.mp3');
    }

    _this.classList.add(isViewName + 'View');
    if (_this.closest('.view') && _this.classList.contains('qBox')) {
      _this.classList.add('complete');
      var hideBoxes = _this.closest('.view').querySelectorAll('.lineBox .hide');
      var hideBoxLen = hideBoxes.length;
      for (i = 0; i < hideBoxLen; i++) {
        hideBoxes[i].style.display = 'none  ';
      }

      if (_this.closest('.cellTab')) {
        var disabledQbox = _this
          .closest('.tab')
          .querySelectorAll('.cellTab .qBox');
        for (i = 0; i < disabledQbox.length; i++) {
          if (i !== getIndex(_this.closest('.cellTab'))) {
            disabledQbox[i].classList.remove('dapView');
            disabledQbox[i].classList.remove('complete');
          }
        }
      }
    }

    if (_this.getAttribute('data-open') !== null) {
      var _this_data = QSAll('.' + _this.getAttribute('data-open') + '');
      for (i = 0; i < _this_data.length; i++) {
        _this_data[i].classList.add(isViewName + 'View');
      }
    }
    if (pages !== null) {
      getCount();
    }
    if (pages == null) {
      return;
    }

    if (
      pages.querySelector('.innerPage[data-page="' + innerPageNum + '"]') ==
      null
    ) {
      if (dapCount !== 0) {
        if (totalCount === dapCount) {
          this.dapShow();
        }
      } else if (
        (pages.querySelectorAll('.qBox').length &&
          pages.querySelectorAll('.dapView.complete').length ===
            pages.querySelectorAll('.qBox').length) ||
        (tableCont &&
          tableCont.querySelectorAll('.dapView.complete').length ===
            tableCont.querySelectorAll('.qBox').length) ||
        (_this.closest('.setInBox') &&
          _this.closest('li').querySelectorAll('.qBox').length ===
            _this.closest('li').querySelectorAll('.qBox.complete').length)
      ) {
        this.dapShow();
      }
    } else {
      var innerPages = pages.querySelector(
        '.innerPage[data-page="' + innerPageNum + '"]'
      );
      if (dapCount !== 0) {
        if (totalCount === dapCount) {
          this.dapShow();
        }
      } else if (
        innerPages.querySelectorAll('.qBox').length &&
        innerPages.querySelectorAll('.dapView.complete').length ===
          innerPages.querySelectorAll('.qBox').length
      ) {
        this.dapShow();
      } else if (
        _this.closest('.cellTab') &&
        _this.closest('.navi').querySelectorAll('.cellTab').length ===
          _this.closest('.navi').querySelectorAll('.complete').length
      ) {
        this.dapShow();
      } else if (
        _this.closest('.setInBox') &&
        _this.closest('.setInBox').querySelectorAll('.qBox').length ===
          _this.closest('.setInBox').querySelectorAll('.qBox.complete').length
      ) {
        this.dapShow();
      }
    }

    if (QSAll('.popbox')[popupNum - 1] !== undefined) {
      var pops = QSAll('.popbox')[popupNum - 1];
      var popQbox = pops.querySelectorAll('.qBox');
      for (i = 0; i < popQbox.length; i++) {
        if (popQbox[i] == _this) {
          if (
            pops.querySelectorAll('.dapView.complete').length ==
            pops.querySelectorAll('.qBox').length
          ) {
            this.dapShow();
          }
        }
      }
    }
  },
  dapShow: function () {
    for (var i = 0; i < this.dapBtn.length; i++) {
      this.dapBtn[i].querySelector('.inAnsCheck').innerHTML = '가리기';
      this.dapBtn[i].classList.add('daps');
    }
  },
};

function getCount() {
  var page = QS('.page_' + tabIdx),
    innerPages = page.getElementsByClassName('innerPage'),
    count = 0;

  if (innerPages.length === 0) {
    count = page.getAttribute('count');
  } else {
    count = innerPages[innerIdx].getAttribute('count');
  }

  dapCount = Number(count);

  if (dapCount !== 0) {
    totalCount++;
  }
}

// ******************************************************************************
// 정답(버튼) : 체크
function dapBtnCheck() {
  var dapCheckBtn = document.querySelectorAll('.dapCheckBtn');

  // 정답 확인
  for (var i = 0; i < dapCheckBtn.length; i++) {
    dapCheckBtn[i].innerHTML =
      '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';
    dapCheckBtn[i].addEventListener(
      gameManager.eventSelector.upEvent,
      dapBtnCheckEvent
    );
  }
}
// (추가 수정) 170330
// 정답(버튼) : 확인 , 가리기
function dapBtnCheckEvent() {
  var target = this,
    dapClass = document.querySelector('.page_' + tabIdx),
    popClass = QS('.popbox[data-pop="' + popupNum + '"]'),
    qBoxClass = dapClass.getElementsByClassName('qBox'),
    hideBoxes = dapClass.querySelectorAll('.lineBox .hide'),
    hideBoxLen = hideBoxes.length,
    bubbleBoxes = dapClass.querySelectorAll('.bubbleBox'),
    bubbleBoxLen = bubbleBoxes.length,
    i = 0;

  efSound('./media/click.mp3');

  totalCount = 0;
  dapCount = 0;

  if (dapClass.getElementsByClassName('qBox').length > 0) {
    if (
      target.getElementsByClassName('inAnsCheck')[0].textContent == '가리기'
    ) {
      for (i = 0; i < qBoxClass.length; i++) {
        qBoxClass[i].classList.remove('dapView');
        qBoxClass[i].classList.remove('complete');
      }
      target.classList.remove('daps');
      target.innerHTML =
        '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';
      tabIdxArray = [];
      for (var j = 0; j < hideBoxLen; j++) {
        hideBoxes[j].style.display = 'block';
      }
    } else {
      for (i = 0; i < qBoxClass.length; i++) {
        qBoxClass[i].classList.add('dapView');
        qBoxClass[i].classList.add('complete');
      }
      target.classList.add('daps');
      target.innerHTML =
        '<span class="inAnsText">정답</span> <span class="inAnsCheck">가리기</span>';
      for (var j = 0; j < hideBoxLen; j++) {
        hideBoxes[j].style.display = 'none';
      }
    }
  }

  // SVG 라인
  if (dapClass.querySelectorAll('.svgContainer').length > 0) {
  }

  // O, X
  if (
    QS('.page_' + tabIdx).getElementsByClassName('oxClick').length > 0 ||
    QS('.page_' + tabIdx).getElementsByClassName('selectBox').length > 0
  ) {
    if (QS('.page_' + tabIdx).querySelectorAll('.oxTextContainer').length > 0) {
      if (
        target.getElementsByClassName('inAnsCheck')[0].textContent == '가리기'
      ) {
        OXResetFn();
        target.classList.remove('daps');
        target.innerHTML =
          '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';
        for (i = 0; i < bubbleBoxLen; i++) {
          bubbleBoxes[i].classList.remove('show');
        }
      } else {
        var ans = QSAll('.page_' + tabIdx + ' .ans');
        for (i = 0; i < ans.length; i++) {
          ans[i].classList.add('correctO');
          ans[i].style.pointerEvents = 'none';
        }
        target.classList.add('daps');
        target.innerHTML =
          '<span class="inAnsText">정답</span> <span class="inAnsCheck">가리기</span>';
        for (i = 0; i < bubbleBoxLen; i++) {
          bubbleBoxes[i].classList.add('show');
        }
      }
    } else {
      if (
        target.getElementsByClassName('inAnsCheck')[0].textContent == '가리기'
      ) {
        OXResetFn();
        target.classList.remove('daps');
        target.innerHTML =
          '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';

        dapClass.classList.remove('showAnswers');
      } else {
        var ans = QSAll('.page_' + tabIdx + ' .ans');
        for (i = 0; i < ans.length; i++) {
          if (QS('.page_' + tabIdx).getElementsByClassName('oxClick').length) {
            var answerO = createElement('div', ans[i], 'oxCheck correctO');
          } else {
            var answerO = createElement(
              'div',
              ans[i].querySelector('.selectNum'),
              'oxCheck correctO'
            );
            ans[i].classList.add('complete');
            if (ans[i].querySelector('.feedBack') !== null) {
              var feedBack = ans[i].querySelector('.feedBack');
              feedBack.style.display = 'inline-block';
            }
            if (hideBoxLen) {
              for (var j = 0; j < hideBoxLen; j++) {
                hideBoxes[j].style.display = 'none';
              }
            }
          }
          answerO.style.opacity = 1;
          ans[i].style.pointerEvents = 'none';
        }

        target.classList.add('daps');
        target.innerHTML =
          '<span class="inAnsText">정답</span> <span class="inAnsCheck">가리기</span>';

        dapClass.classList.add('showAnswers');
      }
    }
  }

  if (
    QS('.page_' + tabIdx).querySelectorAll('input').length > 0 ||
    QS('.page_' + tabIdx).querySelectorAll('textarea').length > 0
  ) {
    var textBox =
      QS('.page_' + tabIdx).querySelectorAll('textarea').length > 0
        ? QS('.page_' + tabIdx).querySelectorAll('textarea')
        : QS('.page_' + tabIdx).querySelectorAll('input');
    for (i = 0; i < textBox.length; i++) {
      if (textBox[i].getAttribute('data-dap')) {
        if (
          target.getElementsByClassName('inAnsCheck')[0].textContent == '쓰기'
        ) {
          textReset();
          target.classList.remove('daps');
          target.innerHTML =
            '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';
        } else {
          textBox[i].style.color = '#0167cd';
          textBox[i].value = textBox[i].getAttribute('data-dap');
          textBox[i].readOnly = true;
          target.classList.add('daps');
          target.innerHTML =
            '<span class="inAnsText" style="padding-left: 10px;">직접</span> <span class="inAnsCheck">쓰기</span>';
        }
      }
    }
  }

  //pop
  if (popClass !== null) {
    if (popClass.querySelector('.dapCheckBtn') == target) {
      if (popClass.querySelectorAll('.svgContainer').length > 0) {
        var addPathClass = popClass.querySelectorAll('.addPath');
        var clickobj = popClass.querySelectorAll('.clickobj');

        if (target.classList.contains('daps')) {
          target.classList.remove('daps');
          target.innerHTML =
            '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';

          for (i = 0; i < addPathClass.length; i++) {
            addPathClass[i].style.display = 'none';
          }
          for (i = 0; i < clickobj.length; i++) {
            clickobj[i].style.pointerEvents = 'auto';
          }
        } else {
          for (i = 0; i < addPathClass.length; i++) {
            if (addPathClass[i].getAttribute('answer') == 'true') {
              addPathClass[i].style.display = 'block';
            }
          }
          for (i = 0; i < clickobj.length; i++) {
            clickobj[i].style.pointerEvents = 'none';
          }
          target.classList.add('daps');
          target.innerHTML =
            '<span class="inAnsText">정답</span> <span class="inAnsCheck">가리기</span>';
        }
        svgIdxArray = [];
      }
      if (popClass.getElementsByClassName('qBox').length > 0) {
        var popQbox = popClass.getElementsByClassName('qBox');
        if (target.classList.contains('daps')) {
          for (var j = 0; j < popQbox.length; j++) {
            popQbox[j].classList.remove('dapView');
          }
          target.classList.remove('daps');
          target.innerHTML =
            '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';
          tabIdxArray = [];
        } else {
          for (var j = 0; j < popQbox.length; j++) {
            popQbox[j].classList.add('dapView');
          }
          target.classList.add('daps');
          target.innerHTML =
            '<span class="inAnsText">정답</span> <span class="inAnsCheck">가리기</span>';
        }
      }
    }

    if (popClass.classList.contains('solve_pop')) {
      popClass.style.display = 'none';
      dapClass.querySelector('.solveCheckBtn').classList.remove('daps');
    }
  }
}

// 팝업 + 슬라이드 팝업
function popboxInit() {
  var popBtns = QSAll('.popBtn');
  var popBtn = null;

  for (var i = 0; i < popBtns.length; i++) {
    popBtn = popBtns[i];

    if (
      popBtn.classList.contains('border') &&
      popBtn /* &&
      popBtn[i].querySelector('img') */
    ) {
      var zoomBtn = createElement('div', popBtn, 'zoomBtn');
      popBtn.addEventListener('mouseover', popBtnover);
      popBtn.addEventListener('mouseout', popBtnOut);
    }

    if (
      popBtn.classList.contains('look') ||
      popBtn.getAttribute('data-text') !== null
    ) {
      CONTENTS.bnMaker.make();
    }

    popBtn.addEventListener('click', popupBoxEv);
  }
}
function popBtnover() {
  var zoomBtn = this.querySelector('.zoomBtn');
  zoomBtn.classList.add('over');
}
function popBtnOut() {
  var zoomBtn = this.querySelector('.zoomBtn');
  zoomBtn.classList.remove('over');
}
function popupBoxEv() {
  var btnPopup = this;
  var parentDocument = parent.document.querySelector('iframe');
  popupNum = this.getAttribute('data-pop');
  var popbox = QSAll('.popbox')[popupNum - 1],
    popupContents = popbox.querySelectorAll('.popupContents'),
    popContentsLen = popupContents.length,
    target = this,
    popupCloseBtn = null,
    i = 0,
    alignPopup = function () {
      var dataPos = btnPopup.dataset.pos
        ? btnPopup.dataset.pos.split(',')
        : null;
      var leftPos, topPos;
      if (dataPos) {
        leftPos = dataPos[0];
        topPos = dataPos[1];
        popbox.style.left = leftPos + 'px';
        popbox.style.top = topPos + 'px';
        popbox.style.marginLeft = 0;
        popbox.style.marginTop = 0;
      } else {
        popbox.style.width = popbox.clientWidth + 'px';
        popbox.style.left = '50%';
        popbox.style.top = '50%';
        popbox.style.marginLeft = -popbox.clientWidth / 2 + 'px';
        popbox.style.marginTop = -popbox.clientHeight / 2 + 'px';
      }
    };

  if (popbox.style.display === 'block') {
    return;
  }

  isPopClickReset(this);

  efSound('media/click.mp3');
  popbox.style.display = 'block';
  popupIdx = Number(target.getAttribute('data-slide') - 1);

  if (
    popbox.classList.contains('full') &&
    window.location.href.indexOf('http') > -1
  ) {
    // TODO: 뷰어 네비게이션 숨김 처리
    parentDocument.parentNode.style.position = 'relative';
    parentDocument.parentNode.style.zIndex = 1000;
  }

  if (popbox.getElementsByClassName('svgContainer').length > 0) {
    drawLineInPop(popbox);
  }

  if (
    popbox.classList.contains('mini') ||
    popbox.classList.contains('miniSlide')
  ) {
    popupCloseBtn = createElement('div', popbox, 'popCloseBtn');
    alignPopup();

    popbox.addEventListener(
      touchCheck ? 'touchstart' : 'mousedown',
      startDrag,
      false
    );
    window.addEventListener(
      touchCheck ? 'touchend' : 'mouseup',
      endDrag,
      false
    );
  } else {
    popupCloseBtn = createElement('div', popbox, 'popCloseBtn');
  }

  if (popbox.classList.contains('solve_pop')) {
    popbox.querySelector('.popup_contents p').innerHTML =
      commentaryArr[tabIdx - 1];
  }

  if (this.classList.contains('solveCheckBtn')) {
    this.classList.add('daps');
  }

  for (i = 0; i < popContentsLen; i++) {
    popupContents[i].style.display = 'none';
  }
  popupContents[popupIdx].style.display = 'block';

  if (popContentsLen > 1) {
    var sliderWrap = createElement('div', popbox, 'sliderContainer'),
      innerPrevBtn = createElement('div', sliderWrap, 'innerPrevBtn innerBtn'),
      sliderDotBox = createElement('ul', sliderWrap, 'sliderDotBox'),
      innerNextBtn = createElement('div', sliderWrap, 'innerNextBtn innerBtn'),
      innerBtn = popbox.querySelectorAll('.innerBtn'),
      sliderHTML = '',
      sliderDots = null;

    if (popbox.classList.contains('miniSlide')) {
      var pageNum = createElement('div', popbox, 'pageNum');
      pageNum.innerHTML =
        '<span>' +
        (popupIdx + 1) +
        '</span>' +
        '/' +
        '<span>' +
        popContentsLen +
        '</span>';
      alignPopup();
    }
    // 슬라이드 : 도트 생성
    for (i = 1; i <= popContentsLen; i++) {
      sliderHTML += '<li class="sliderDot" wrapnum="' + i + '"></li>';
    }

    sliderDotBox.innerHTML = sliderHTML;
    sliderDots = popbox.querySelectorAll('.sliderDot');

    for (i = 0; i < sliderDots.length; i++) {
      if (QSAll('.sciWordBox').length > 0) {
        sliderDots[i].innerHTML = '<span>' + sciTabObj.listName[i] + '</span>';
      }
      sliderDots[i].addEventListener('mousedown', popupSlideMove);
    }
    sliderDots[popupIdx].classList.add('active');

    for (var i = 0; i < innerBtn.length; i++) {
      innerBtn[i].addEventListener('mousedown', popupSlideMove);
    }
    popupBtnControl();
  }

  popupCloseBtn.addEventListener('click', function () {
    if (popbox.querySelectorAll('.scrollOutBox') !== null) {
      scrollreset();
    }
    efSound('media/tab_click.mp3');
    popbox.style.display = 'none';
    if (popbox.querySelectorAll('.innerBtn').length > 0) {
      popbox
        .querySelector('.innerPrevBtn')
        .parentNode.removeChild(popbox.querySelector('.innerPrevBtn'));
      popbox
        .querySelector('.innerNextBtn')
        .parentNode.removeChild(popbox.querySelector('.innerNextBtn'));
    }
    if (popbox.querySelector('.dapCheckBtn') !== null) {
      var inPopAnsBtn = popbox.querySelector('.dapCheckBtn');
      if (inPopAnsBtn.childNodes[2].innerHTML == '가리기') {
        inPopAnsBtn.childNodes[2].innerHTML = '확인';
      }
    }
    if (popbox.querySelectorAll('.popupContents.complete').length > 0) {
      var isCompleteContents = popbox.querySelectorAll('.popupContents');
      for (var j = 0; j < isCompleteContents.length; j++) {
        isCompleteContents[j].classList.remove('complete');
      }
    }

    if (popbox.querySelector('.pageNum') !== null) {
      popbox
        .querySelector('.pageNum')
        .parentNode.removeChild(popbox.querySelector('.pageNum'));
    }
    if (sliderDots !== undefined)
      sliderDotBox.parentNode.removeChild(sliderDotBox);
    this.parentNode.removeChild(this);
    if (
      popbox.classList.contains('full') &&
      window.location.href.indexOf('http') > -1
    ) {
      // TODO: 뷰어 네비게이션 노출 처리
      parentDocument.parentNode.style.position = 'static';
      parentDocument.parentNode.style.zIndex = 1;
    }

    if (target.classList.contains('solveCheckBtn')) {
      target.classList.remove('daps');
      return;
    }
    nonePage(popbox);
  });
}

function popupSlideMove(e) {
  popupNum = Number(e.target.closest('.popbox').dataset.pop);
  var popbox = QSAll('.popbox')[popupNum - 1],
    popupContents = popbox.querySelectorAll('.popupContents'),
    popupContentsLen = popupContents.length,
    popupContent = null;

  if (this.classList.contains('off')) return;
  efSound('media/tab_click.mp3');

  if (this.classList.contains('innerBtn')) {
    if (
      (this.classList.contains('innerPrevBtn') && popupIdx === 0) ||
      (this.classList.contains('innerNextBtn') &&
        popupIdx === popupContentsLen - 1)
    )
      return;
    popupIdx = this.classList.contains('innerNextBtn')
      ? popupIdx + 1
      : popupIdx - 1;
  } else {
    popupIdx = this.getAttribute('wrapnum') - 1;
  }

  for (var i = 0; i < popupContentsLen; i++) {
    popupContent = popupContents[i];
    popupContent.style.display = 'none';
    nonePage(popupContent);
  }
  popupBtnControl();
}

function popupBtnControl() {
  var popbox = QSAll('.popbox')[popupNum - 1],
    popupContents = popbox.querySelectorAll('.popupContents'),
    innerPrevBtn = popbox.querySelector('.innerPrevBtn'),
    innerNextBtn = popbox.querySelector('.innerNextBtn'),
    sliderDots = popbox.querySelectorAll('.sliderDot'),
    pageNum = popbox.querySelector('.pageNum');

  popupContents[popupIdx].style.display = 'block';

  if (pageNum !== null) {
    pageNum.childNodes[0].innerHTML = popupIdx + 1;
  }
  if (popupIdx === 0) {
    innerPrevBtn.classList.add('off');
    innerNextBtn.classList.remove('off');
  } else if (popupIdx == popupContents.length - 1) {
    innerPrevBtn.classList.remove('off');
    innerNextBtn.classList.add('off');
  } else {
    innerPrevBtn.classList.remove('off');
    innerNextBtn.classList.remove('off');
  }

  for (var i = 0; i < sliderDots.length; i++) {
    sliderDots[i].classList.remove('active');
  }
  sliderDots[popupIdx].classList.add('active');
}
//미디어 초기화
function allSoundReset() {
  if (
    QSAll('.mediaContainer').length > 0 &&
    QSAll('.mediaContainer') !== null
  ) {
    var mediaContainers = QSAll('.mediaContainer');
    var mediaContainer = null;
    var btnMute = null;
    for (var i = 0; i < mediaContainers.length; i++) {
      mediaContainer = mediaContainers[i];
      btnMute = mediaContainer.querySelector('.muteBtn');
      // 새 미디어 플레이어 메소드
      $pm.array.controller[i].stop();
      if (btnMute.classList.contains('on')) {
        $pm.array.controller[i].mute(btnMute);
      }
    }
  }
}
function isPopClickReset(btn) {
  var targetPopup = QS('.popbox[data-pop="' + btn.dataset.pop + '"]');
  var popboxes = QSAll('.popbox');
  var popboxLen = popboxes.length;
  var i = 0;
  //선긋기 초기화
  drawLineReset();
  //미디어 초기화
  allSoundReset();
  //스크롤 초기화
  if (QSAll('.scrollOutBox') !== null) {
    scrollreset();
  }
  if (isThere('.videoWrap')) {
    // CONTENTS.videoPlayFn.reset();
  }
  if (targetPopup.querySelectorAll('.dapCheckBtn').length > 0) {
    var dapCheckBtn = targetPopup.querySelectorAll('.dapCheckBtn');
    for (i = 0; i < dapCheckBtn.length; i++) {
      if (
        !btn.classList.contains('solveCheckBtn') &&
        btn.nextElementSibling !== dapCheckBtn[i]
      ) {
        dapCheckBtn[i].classList.remove('daps');
        dapCheckBtn[i].querySelector('.inAnsCheck').innerHTML = '확인';
      }
    }
  }
  if (QSAll('.qBox').length > 0 || QSAll('.examBox').length > 0) {
    var qBox = QSAll('.qBox'),
      examBox = QSAll('.examBox');
    for (i = 0; i < qBox.length; i++) {
      if (
        qBox[i].closest('.popbox') ===
        QS('.popbox[data-pop="' + btn.dataset.pop + '"]')
      ) {
        qBox[i].classList.remove('dapView');
        qBox[i].classList.remove('complete');
      }
    }
    for (i = 0; i < examBox.length; i++) {
      examBox[i].classList.remove('examView');
    }
  }
  for (i = 0; i < popboxLen; i++) {
    if (popboxes[i].classList.contains('mini')) {
      popboxes[i].style.display = 'none';
    }
  }
}
// 탭 + 네비게이터 + 슬라이드
function sliderFn() {
  var multiBox = document.querySelectorAll('.multiBox');
  for (var i = 0; i < multiBox.length; i++) {
    var this_ = new createSlide(multiBox[i]);
    this_.start();
  }
}

var createSlide = function (_slide) {
  _this = _slide;
  this.tab = _this.querySelector('.setInBox').children;
  this.totalIndex = this.tab.length;
  this.index = 0;
  this.oldIndex;

  var leftBtn = document.createElement('div');
  var rightBtn = document.createElement('div');

  leftBtn.setAttribute('class', 'slideBtn prev');
  rightBtn.setAttribute('class', 'slideBtn next');

  _this.appendChild(leftBtn);
  _this.appendChild(rightBtn);

  this.left = _this.querySelector('.slideBtn.prev');
  this.right = _this.querySelector('.slideBtn.next');

  this.left.style.display = 'none';

  /*navi*/
  var navi = document.createElement('ul'),
    str = '';

  navi.setAttribute('class', 'navi');
  for (var i = 0; i < this.totalIndex; i++) {
    str += '<li></li>';
  }
  navi.innerHTML = str;

  _this.appendChild(navi);

  this.dot = _this.querySelectorAll('.navi li');
  this.dot[0].classList.add('view');

  this.dotMove = function (target) {
    this.index = Array.prototype.indexOf.call(this.dot, target);
    this.changeEvent(target);
  };

  this.leftMove = function () {
    this.index--;
    this.changeEvent();
  };
  this.rightMove = function () {
    this.index++;
    this.changeEvent();
  };

  this.changeEvent = function (target) {
    // console.log('changeEvent target: ', target);
    efSound('./media/tab_click.mp3');
    /*좌우 버튼*/
    if (this.index == 0) {
      this.left.style.display = 'none';
      this.right.style.display = 'block';
    } else if (this.index == this.totalIndex - 1) {
      this.right.style.display = 'none';
      this.left.style.display = 'block';
    } else {
      this.left.style.display = 'block';
      this.right.style.display = 'block';
    }
    /*도트*/
    for (var i = 0; i < this.dot.length; i++) {
      this.dot[i].classList.remove('view');
    }
    this.dot[this.index].classList.add('view');

    /*안에 div*/
    for (var i = 0; i < this.tab.length; i++) {
      this.tab[i].classList.add('hide');
      this.tab[i].classList.remove('view');
    }
    this.tab[this.index].classList.add('view');
    this.tab[this.index].classList.remove('hide');

    if (target.classList.contains('noChkBtn')) {
      if (QS('.page_' + tabIdx + ' .dapCheckBtn')) {
        QS('.page_' + tabIdx + ' .dapCheckBtn').style.display = 'none';
      }
    } else {
      if (QS('.page_' + tabIdx + ' .dapCheckBtn')) {
        QS('.page_' + tabIdx + ' .dapCheckBtn').style.display = '';
      }
    }

    nonePage(this.tab[this.index]);
  };

  this.reset = function () {
    this.left.style.display = 'none';
    this.right.style.display = 'block';

    for (var i = 0; i < this.tab.length; i++) {
      this.tab[i].classList.add('hide');
      this.tab[i].classList.remove('view');
    }

    this.tab[0].classList.add('view');
    for (var i = 0; i < this.dot.length; i++) {
      this.dot[i].classList.remove('view');
    }
    this.dot[0].classList.add('view');
  };
};

createSlide.prototype = {
  start: function () {
    var _this = this;
    _this.right.addEventListener('mousedown', function () {
      _this.rightMove();
    });
    _this.left.addEventListener('mousedown', function () {
      _this.leftMove();
    });

    for (var i = 0; i < _this.dot.length; i++) {
      _this.dot[i].addEventListener('mouseup', function () {
        _this.dotMove(this);
      });
    }
  },
};

/***************************토글 말풍선 FN**************************/
function balloonPopupInit() {
  var ballIcon = QSAll('.balloonIcon'),
    balloonText = QSAll('.balloonText');

  for (var i = 0; i < ballIcon.length; i++) {
    balloonText[i].style.display = 'none';
    ballIcon[i].addEventListener('click', function () {
      var target = this;
      balloonPopupEv(target);
    });
  }
}
function resetBalloonPopFn() {
  if (QSAll('.balloonText').length > 0) {
    var balloonText = QSAll('.balloonText'),
      ballIcon = QSAll('.balloonIcon');

    for (var i = 0; i < balloonText.length; i++) {
      balloonText[i].style.display = 'none';
      ballIcon[i].classList.remove('complete');
      ballIcon[i].style.pointerEvents = 'auto';

      if (balloonText[i].querySelector('.balloonCloseBtn') !== null) {
        balloonText[i].removeChild(
          balloonText[i].querySelector('.balloonCloseBtn')
        );
      }
    }
  }
}

function balloonPopupEv(target) {
  var ballIcon = QSAll('.balloonIcon');
  var ballIconLen = ballIcon.length;

  efSound('media/tab_click.mp3');
  resetBalloonPopFn();

  for (var i = 0; i < ballIconLen; i++) {
    ballIcon[i].style.pointerEvents = 'auto';
  }
  if (target.nextElementSibling.style.display === 'none') {
    target.nextElementSibling.style.display = 'block';
    target.nextElementSibling.style.cursor = 'default';
    target.classList.add('complete');
    target.style.pointerEvents = 'none';
  }

  var balloonCloseBtn = createElement(
    'div',
    target.nextElementSibling,
    'balloonCloseBtn'
  );

  balloonCloseBtn.addEventListener(
    gameManager.eventSelector.downEvent,
    function () {
      balloonCloseFn(this);
    }
  );
}

function balloonCloseFn(target, idx) {
  var ballIcon = target.parentNode.previousElementSibling;

  efSound('media/tab_click.mp3');

  if (ballIcon.classList.contains('btnSound')) {
    btnSoundReset();
  }
  ballIcon.classList.remove('complete');
  ballIcon.style.pointerEvents = 'auto';
  target.parentNode.style.display = 'none';
  target.parentNode.removeChild(target);
}
//정답 박스 초기화 부분(말풍선 팝업)
function boxTypeReset(resetArea) {
  if (resetArea.querySelectorAll('.qBox') !== null) {
    var qBox = resetArea.querySelectorAll('.qBox');
    for (var i = 0; i < qBox.length; i++) {
      qBox[i].classList.remove('dapView');
    }
  }
  // 예보기 : 초기화
  if (resetArea.querySelectorAll('.examBox') !== null) {
    var examBox = resetArea.querySelectorAll('.examBox');
    for (var i = 0; i < examBox.length; i++) {
      examBox[i].classList.remove('examView');
    }
  }
}
/***********************************************************************************/
// helpText
function helpTextInit(target, text, top, right) {
  var helpTextContainer = createElement('div', target, 'helpTextContainer'),
    helpText = createElement('div', helpTextContainer, 'helpText');

  helpTextContainer.style.position = 'absolute';
  helpTextContainer.style.top = top + 'px';
  helpTextContainer.style.right = right + 'px';

  helpText.innerHTML = '<span>' + text + '</span>';
}

// ******************************************************************************
// 탭 : 컨텐츠

function tabInit() {
  var tabContainer = document.querySelector('.tabContainer'),
    pages = document.querySelectorAll('.pageContainer > li');
  for (var i = 0; i < pages.length; i++) {
    pages[0].classList.add('view');
    if (pages[i].getAttribute('tab') !== null) {
      var tab = document.createElement('li'),
        parentClass = tabContainer.classList[1];

      if (i === 0) {
        tab.className = 'tab_' + parentClass + ' tab_' + (i + 1) + ' tabActive';
        tab.style.pointerEvents = 'none';
      } else {
        tab.className = 'tab_' + parentClass + ' tab_' + (i + 1);
        tab.style.pointerEvents = 'auto';
      }
      if (tabContainer.classList.contains('common')) {
        var tabLeft = createElement('div', tab, 'tabLeft'),
          tabText = createElement('div', tab, 'tabText'),
          tabRight = createElement('div', tab, 'tabRight');
        tabText.innerHTML = '<span>' + pages[i].getAttribute('tab') + '</span>';
      } else {
        tab.innerHTML = '<span>' + pages[i].getAttribute('tab') + '</span>';
      }

      QS('.innerBox').classList.remove('noBg');

      tab.addEventListener('mouseover', function () {
        this.classList.add('tabIconActive');
      });
      tab.addEventListener('mouseout', function () {
        this.classList.remove('tabIconActive');
      });
      tab.addEventListener(gameManager.eventSelector.upEvent, tabActiveFn);
      tabContainer.appendChild(tab);
    }
  }
  DragdropInit();
  // intervalInit();
}

// var contentsTitleText = [];

function tabActiveFn() {
  var tabs = document.querySelectorAll('.tabContainer > li'),
    pages = document.querySelectorAll('.pageContainer > li'),
    idx = this.classList[1].split('_')[1],
    tabNum = parseInt(idx);

  efSound('./media/tab_click.mp3');

  tabIdx = tabNum;

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('tabActive');
    tabs[i].style.pointerEvents = 'auto';
  }
  this.classList.add('tabActive');
  this.style.pointerEvents = 'none';

  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('view');
    pages[i].classList.remove('showAnswers');
  }
  QS('.page_' + tabIdx).classList.add('view');

  tabResetFn();
}

function tabResetFn() {
  tabIdxArray = [];
  innerIdx = 0;

  if (document.querySelector('.innerBox') !== null) {
    var innerBox = document.querySelector('.innerBox');
    if (document.querySelector('.page_' + tabIdx) !== null) {
      var pageTab = document.querySelector('.page_' + tabIdx),
        dapBtn = pageTab.querySelectorAll('.dapCheckBtn'),
        solveBtn = pageTab.querySelectorAll('.solveCheckBtn');
      if (dapBtn.length > 0 || solveBtn.length > 0) {
        for (var j = 0; j < dapBtn.length; j++) {
          dapBtn[j].classList.add('bottom');
        }
        for (var j = 0; j < solveBtn.length; j++) {
          solveBtn[j].classList.add('bottom');
          solveBtn[j].classList.remove('daps');
        }
        if (QS('.solve_pop')) {
          QS('.solve_pop').style.display = 'none';
        }
        //innerBox.style.borderBottom = '5px solid #313D4D';
      } else {
        for (var j = 0; j < dapBtn.length; j++) {
          dapBtn[j].classList.remove('bottom');
        }
        for (var j = 0; j < solveBtn.length; j++) {
          solveBtn[j].classList.remove('bottom');
        }
        innerBox.style.borderBottom = 'none';
      }
      QS('.innerBox').classList.remove('noBg');
    }
  }

  DragdropInit();
  // intervalInit();
  OXClickFn();
  // clickNumAddLine();
  btn_innerPageEvent();
  nonePage(document.querySelector('.page_' + tabIdx));
}

// (추가 수정) 170329
// 초기화 목록 (추가)
function nonePage(targetArea) {
  dapCount = 0;
  totalCount = 0;
  var curTab = QS('.page_' + tabIdx);
  var i = 0;
  var popups = QSAll('.popbox');
  var popupLen = popups.length;

  for (i = 0; i < popupLen; i++) {
    if (
      popups[i].classList.contains('mini') ||
      popups[i].classList.contains('miniSlide')
    ) {
      if (popups[i] !== targetArea.closest('.popbox')) {
        popups[i].style.display = 'none';
      }
    }
  }
  // 정답(버튼) : 초기화
  if (QSAll('.dapCheckBtn') !== null) {
    var dapCheckBtns =
      targetArea.closest('.popbox') || targetArea.classList.contains('popbox')
        ? targetArea.querySelectorAll('.dapCheckBtn')
        : QSAll('.dapCheckBtn');
    var dapCheckBtn = null;
    for (i = 0; i < dapCheckBtns.length; i++) {
      dapCheckBtn = dapCheckBtns[i];
      if (!curTab.querySelector('.cellTab')) {
        if (
          dapCheckBtn.classList.contains('daps') &&
          !targetArea.classList.contains('solve_pop')
        ) {
          dapCheckBtn.classList.remove('daps');
        }
        dapCheckBtn.innerHTML =
          '<span class="inAnsText">정답</span> <span class="inAnsCheck">확인</span>';
      }
    }
  }
  // 물음표 : 초기화
  if (targetArea.querySelectorAll('.qBox').length) {
    var qBoxes = targetArea.querySelectorAll('.qBox');
    var qBoxLen = qBoxes.length;
    var qBox = null;
    for (i = 0; i < qBoxLen; i++) {
      qBox = qBoxes[i];
      qBox.classList.remove('dapView');
      qBox.classList.remove('complete');
    }
  }
  // 예보기 : 초기화
  if (targetArea.querySelectorAll('.examBox') !== null) {
    var examBoxes = QSAll('.examBox');
    var examBoxLen = examBoxes.length;
    for (i = 0; i < examBoxLen; i++) {
      examBoxes[i].classList.remove('examView');
    }
  }
  if (curTab !== null) {
    curTab.classList.remove('showAnswers');
    // OX문제 : 초기화 (170318)
    if (QSAll('.oxClick').length > 0) {
      OXClickFn();
      OXResetFn();
    }
    if (QSAll('.selectBox').length > 0) {
      OXClickFn();
      OXResetFn();
    }
    // SVG : 초기화
    if (QSAll('.svgContainer') !== null) {
      drawLineReset();
    }
    if (QSAll('.selfObj').length > 0) {
      var selfObj = document.querySelectorAll('.selfObj');
      for (i = 0; i < selfObj.length; i++) {
        selfObj[i].classList.remove('active');
      }
    }
    if (QSAll('.targetObj').length > 0) {
      var targetObj = document.querySelectorAll('.targetObj'),
        showObj = QSAll('.showObj');
      for (i = 0; i < targetObj.length; i++) {
        targetObj[i].classList.add('active');
      }
      for (i = 0; i < showObj.length; i++) {
        showObj[i].className = showObj[i].className.replace('shown', 'hide');
      }
    }
    if (QSAll('.balloonBox').length > 0) {
      resetBalloonPopFn();
    }
    if (QSAll('.btnSound').length > 0) {
      btnSoundReset();
    }
    if (QSAll('.dragObj').length > 0) {
      DragdropInit();
    }
    // 예보기(직접 쓰기와 함께 )
    if (curTab.getElementsByClassName('exampleDap').length > 0) {
      var exampleDap = QSAll('.exampleDap');
      for (i = 0; i < exampleDap.length; i++) {
        exampleDap[i].classList.remove('exampleWrite');
        exampleDap[i].classList.add('exampleLook');
      }
      textReset();
    }

    // 캐릭터 스프라이트
    if (isThere('.charSpriteAni')) {
      $prite.resetSprite();
    }

    // 미디어 초 기화
    allSoundReset();
    if (isThere('.videoWrap')) {
      // CONTENTS.videoPlayFn.reset();
    }
    // 스크롤 초기화
    if (isThere('.scrollOutBox')) {
      scrollreset();
    }

    if (isThere('.clickPointer')) {
      var pointers = QSAll('.clickPointer');
      var pointer = null;
      var pointerLen = pointers.length;
      var highlights = QSAll('.highLightShow');

      for (i = 0; i < pointerLen; i++) {
        pointer = pointers[i];
        if (
          (+pointer.getAttribute('num') === tabIdx - 1 &&
            !QS('.thinkopen_popup_tab') &&
            !pointer.closest('.slideBox')) ||
          (QS('.thinkopen_popup_tab') &&
            +pointer.getAttribute('num') !==
              getIndex(QS('.thinkopen_popup_tab .view')))
        ) {
          pointer.classList.add('hide');
        } else {
          pointer.classList.remove('hide');
        }
        if (pointer.classList.contains('inTitle')) {
          highlights[i].classList.add('hide');
          if (+pointer.getAttribute('num') !== tabIdx - 1) {
            pointer.classList.add('hide');
          } else {
            pointer.classList.remove('hide');
          }
        }
      }
    }

    if (zoomInstance) {
      zoomInstance.resetZoom();
    }

    if (targetArea.querySelector('.sliderContainer')) {
      resetSlider(targetArea);
    }

    if (isThere('.bubbleBox')) {
      var bubbleBoxes = QSAll('.bubbleBox');
      var bubbleBoxLen = bubbleBoxes.length;
      for (i = 0; i < bubbleBoxLen; i++) {
        bubbleBoxes[i].classList.remove('show');
      }
    }
    if (isThere('.highLightBox')) {
      var highLightBoxes = QSAll('.highLightBox');
      for (i = 0; i < highLightBoxes.length; i++) {
        for (j = 0; j < highLightBoxes[i].children.length; j++) {
          if (!highLightBoxes[i].closest('.activeBox')) {
            highLightBoxes[i].children[j].classList.add('hide');
          }
        }
      }
    }

    resetSpeechBubble();
  }
}
//스크롤 초기화
function scrollreset() {
  var scrollOutWrap = QSAll('.scroll-wrapper');
  for (var i = 0; i < scrollOutWrap.length; i++) {
    if (scrollOutWrap[i].classList.contains('height')) {
      $('.scrollOutBox.height').scrollTop(0);
    } else {
      $('.scrollOutBox.width').scrollLeft(0);
    }
  }
}

// ******************************************************************************
// (추가 수정) 170329
// page : innerPage 슬라이드 이동
document.addEventListener(
  'DOMContentLoaded',
  function () {
    setTimeout(function () {
      btn_innerPageCreate();
    }, 100);
  },
  false
);

function btn_innerPageCreate() {
  var innerBox = document.querySelector('.innerBox'),
    checkContents = document.querySelector('.checkContents'),
    pages = QSAll('.pageContainer > li'),
    pageLen = pages.length;
  inContents = innerBox !== null ? innerBox : checkContents;

  if (document.querySelector('.pageContainer') !== null) {
    if (innerBox !== null) {
      if (pageLen > 1) {
        innerBox.classList.add('tabs');
      } else {
        innerBox.classList.remove('tabs');
      }
    }
  }

  innerIdx = 0;

  if (QSAll('.innerPage').length === 0) {
    return;
  }

  if (inContents.querySelectorAll('.innerPage').length > 1) {
    var sliderWrap = null,
      innerPrevBtn = null,
      sliderDotBox = null,
      innerNextBtn = null,
      innerBtn = null,
      sliderHTML = '',
      sliderDots = null,
      i = 0,
      j = 0,
      k = 0;

    if (inContents == innerBox) {
      for (j = 0; j < pageLen; j++) {
        var page = pages[j];
        var innerPage = page.querySelectorAll('.innerPage');
        var innerPageLen = innerPage.length;
        var sliderParent = page;
        var slideBoxes = null;
        var slideBoxLen = null;

        if (page.classList.contains('sliderInBox')) {
          slideBoxes = page.querySelectorAll('.slideBox');
          slideBoxLen = slideBoxes.length;

          for (i = 0; i < slideBoxLen; i++) {
            sliderParent = slideBoxes[i];
            innerPage = sliderParent.querySelectorAll('.innerPage');
            innerPageLen = innerPage.length;

            for (k = 0; k < innerPageLen; k++) {
              innerPage[k].setAttribute('data-page', k);
            }
            makeSlider();
          }
        } else {
          for (i = 0; i < innerPageLen; i++) {
            innerPage[i].setAttribute('data-page', i);
          }
          if (page.getAttribute('data-dot') === 'true') {
            makeSlider();
          }
        }

        function makeSlider() {
          sliderWrap = createElement('div', sliderParent, 'sliderContainer');
          innerPrevBtn = createElement(
            'div',
            sliderWrap,
            'innerPrevBtn innerBtn'
          );
          sliderDotBox = createElement('ul', sliderWrap, 'sliderDotBox');
          innerNextBtn = createElement(
            'div',
            sliderWrap,
            'innerNextBtn innerBtn'
          );

          innerPrevBtn.classList.add('off');
          innerBtn = sliderWrap.querySelectorAll('.innerBtn');
          // 슬라이드 : 도트 생성
          sliderHTML = '';
          for (i = 1; i <= innerPageLen; i++) {
            sliderHTML += '<li class="sliderDot" wrapnum="' + i + '"></li>';
          }

          sliderDotBox.innerHTML = sliderHTML;
          sliderDots = sliderDotBox.querySelectorAll('.sliderDot');

          for (i = 0; i < sliderDots.length; i++) {
            sliderDots[i].addEventListener('mousedown', btn_innerPageMove);
          }
          sliderDots[0].classList.add('active');

          for (var i = 0; i < innerBtn.length; i++) {
            innerBtn[i].addEventListener('mousedown', btn_innerPageMove);
          }
        }
      }
    }
    btn_innerPageEvent();
  }
}

var innerPageArray = [0],
  innerIdx = 0;

function btn_innerPageEvent() {
  var innerPage = document
      .querySelector('.page_' + tabIdx)
      .getElementsByClassName('innerPage'),
    innerPageLen = innerPage.length,
    innerBtn = QSAll('.innerBtn'),
    slideBoxes = QSAll('.slideBox'),
    slideBoxLen = slideBoxes.length,
    i = 0,
    j = 0,
    k = 0;

  innerIdx = 0;
  if (innerBtn.length === 0) return;

  if (slideBoxLen) {
    for (j = 0; j < slideBoxLen; j++) {
      innerPage = slideBoxes[j].querySelectorAll('.innerPage');
      innerPageLen = innerPage.length;
      for (k = 0; k < innerPageLen; k++) {
        innerPage[k].style.display = 'none';
      }
      innerPage[0].style.display = 'block';
    }
  } else {
    if (innerPageLen) {
      for (i = 0; i < innerPageLen; i++) {
        innerPage[i].style.display = 'none';
      }
      innerPage[0].style.display = 'block';
    }
  }
}
function btn_innerPageMove() {
  var curTab = QS('.page_' + tabIdx),
    slideBoxes = curTab.querySelectorAll('.slideBox'),
    slideBoxLen = slideBoxes.length,
    innerPage = curTab.getElementsByClassName('innerPage'),
    innerPrevBtn = curTab.querySelector('.innerPrevBtn'),
    innerNextBtn = curTab.querySelector('.innerNextBtn'),
    sliderContainer = null,
    sliderDots = curTab.querySelectorAll('.sliderDot'),
    sliderDotsLen = sliderDots.length,
    tabLen = innerPage.length - 1,
    i = 0,
    j = 0,
    isNone = true;

  if (slideBoxLen) {
    sliderContainer = this.closest('.sliderContainer');
    innerPage = this.closest('.slideBox').querySelectorAll('.innerPage');
    tabLen = innerPage.length - 1;
    innerPrevBtn = sliderContainer.querySelector('.innerPrevBtn');
    innerNextBtn = sliderContainer.querySelector('.innerNextBtn');
    sliderDots = sliderContainer.querySelectorAll('.sliderDot');
    sliderDotsLen = sliderDots.length;
    innerIdx = getIndex(sliderContainer.querySelector('.active'));
    isNone = false;
  }

  if (this.classList.contains('innerBtn')) {
    if (this.classList.contains('innerNextBtn')) {
      if (innerIdx === tabLen) return;
      innerIdx++;
      for (j = 0; j < innerPage.length; j++) {
        innerPage[j].style.display = 'none';
        innerPage[innerIdx].style.display = 'block';
      }
    } else {
      if (innerIdx === 0) return;
      innerIdx--;
      for (j = 0; j < innerPage.length; j++) {
        innerPage[j].style.display = 'none';
        innerPage[innerIdx].style.display = 'block';
      }
    }

    if (innerIdx === 0) {
      innerPrevBtn.classList.add('off');
      innerNextBtn.classList.remove('off');
    } else if (innerIdx == tabLen) {
      innerPrevBtn.classList.remove('off');
      innerNextBtn.classList.add('off');
    } else {
      innerPrevBtn.classList.remove('off');
      innerNextBtn.classList.remove('off');
    }
  } else {
    var pageIdx = this.getAttribute('wrapnum') - 1;

    for (var j = 0; j < innerPage.length; j++) {
      innerPage[j].style.display = 'none';
      innerPage[pageIdx].style.display = 'block';
    }
    if (pageIdx === 0) {
      innerPrevBtn.classList.add('off');
      innerNextBtn.classList.remove('off');
    } else if (pageIdx == tabLen) {
      innerPrevBtn.classList.remove('off');
      innerNextBtn.classList.add('off');
    } else {
      innerPrevBtn.classList.remove('off');
      innerNextBtn.classList.remove('off');
    }
    innerIdx = pageIdx;
  }
  for (var i = 0; i < sliderDotsLen; i++) {
    sliderDots[i].classList.remove('active');
  }
  sliderDots[innerIdx].classList.add('active');

  nonePage(innerPage[innerIdx]);

  tabIdxArray = [];

  innerPageNum = innerIdx;
  innerPageArray = [];
  innerPageArray.push(innerIdx);
  efSound('./media/tab_click.mp3');
}
// 아이콘 생성
var iconTextArray = [];
function iconTextFn() {
  var titleIcon = document.querySelector('.contentsTitle .titleIcon');
  if (titleIcon.classList.contains('intro')) {
    var iconBgLeft = createElement('div', titleIcon, 'left'),
      iconBgMiddle = createElement('div', titleIcon, 'middle'),
      iconBgRight = createElement('div', titleIcon, 'right');

    console.log(iconTextArray);
    if (iconTextArray.length == 1) {
      iconBgMiddle.innerHTML = '<span>' + iconTextArray[0] + '</span>';
    } else if (iconTextArray.length == 2) {
      if (iconTextArray[1] == 'icon') {
        iconBgMiddle.innerHTML =
          '<span>' +
          iconTextArray[0] +
          '</span><span class="innerIcon"></span>';
      } else {
        iconBgMiddle.innerHTML =
          '<span>' +
          iconTextArray[0] +
          '</span><span>' +
          iconTextArray[1] +
          '</span>';
      }
    } else if (iconTextArray.length == 3) {
      if (iconTextArray[1] == 'icon') {
        iconBgMiddle.innerHTML =
          '<span>' +
          iconTextArray[0] +
          '</span><span class="innerIcon"></span><span>' +
          iconTextArray[2] +
          '</span>';
      } else {
        iconBgMiddle.innerHTML =
          '<span>' +
          iconTextArray[0] +
          '</span><span>' +
          iconTextArray[1] +
          '</span><span>' +
          iconTextArray[2] +
          '</span>';
      }
    } else iconBgMiddle.innerHTML = '';
  }
}

// selfCheck

// user check
function selfCheckFN() {
  var checkContainer = document.querySelectorAll('.selfCheckBox');
  for (var i = 0; i < checkContainer.length; i++) {
    var selfObj = checkContainer[i].querySelectorAll('.selfObj');
    if (checkContainer[i].getAttribute('data-type') == 'three') {
      for (var j = 0; j < selfObj.length; j++) {
        selfObj[j].addEventListener('mousedown', checkThreeEv);
      }
    }
    if (checkContainer[i].getAttribute('data-type') == 'multi') {
      for (var k = 0; k < selfObj.length; k++) {
        selfObj[k].addEventListener('mousedown', checkMultiEv);
      }
    }
  }
}
function checkThreeEv() {
  var selfObj = QS('.page_' + tabIdx).querySelectorAll('.selfObj'),
    idx = Array.prototype.indexOf.call(selfObj, this),
    num;
  efSound('./media/click.mp3');
  if (idx < 3) {
    num = 0;
  } else if (idx > 2 && idx < 6) {
    num = 3;
  } else if (idx < 9 && idx > 5) {
    num = 6;
  } else if (idx > 8) {
    num = 9;
  }
  for (var i = num; i < num + 3; i++) {
    selfObj[i].classList.remove('active');
  }
  this.classList.add('active');
}
function checkMultiEv() {
  var selfObj = QS('.page_' + tabIdx).querySelectorAll('.selfObj'),
    idx = Array.prototype.indexOf.call(selfObj, this),
    checkNum = Math.floor(idx / 5) * 5;
  efSound('./media/click.mp3');
  for (var m = 0; m < 5; m++) {
    if (m < (idx % 5) + 1) {
      selfObj[m + checkNum].classList.add('active');
    } else {
      selfObj[m + checkNum].classList.remove('active');
    }
  }
}
// 기본 토글
function showObjFn() {
  var clickObj = document.querySelectorAll('.showObj');
  var targetObj = document.querySelectorAll('.targetObj');
  var clickPointers = document.querySelectorAll('.clickPointer');
  var pointerLen = clickPointers.length;

  for (var j = 0; j < targetObj.length; j++) {
    if (!targetObj[j].classList.contains('mindMap')) {
      targetObj[j].classList.add('active');
    }
  }
  if (targetObj.length !== undefined) {
    for (var i = 0; i < clickObj.length; i++) {
      clickObj[i].classList.add('hide');
      clickObj[i].style.zIndex = 13;
      clickObj[i].addEventListener('mousedown', toggleEv);
    }
  }
  for (i = 0; i < pointerLen; i++) {
    clickPointers[i].addEventListener('click', toggleMindMap);
  }
}
function toggleEv() {
  var targetObjs = document.querySelectorAll('.targetObj'),
    idx = this.getAttribute('data-idx');
  efSound('./media/tab_click.mp3');
  for (var j = 0; j < targetObjs.length; j++) {
    var targetObj = targetObjs[j];
    var targetIdx = targetObj.getAttribute('data-idx');
    var maps = targetObj.querySelectorAll('.hideMindMap');
    var mapClickPointer = targetObj.querySelectorAll('.clickPointer');
    var mapLen = maps.length;

    if (idx == targetIdx) {
      if (!targetObj.classList.contains('mindMap')) {
        if (!targetObj.classList.contains('active')) {
          this.className = this.className.replace('shown', 'hide');
          targetObj.classList.add('active');
        } else {
          this.className = this.className.replace('hide', 'shown');
          targetObj.classList.remove('active');
        }
      } else {
        if (!targetObj.classList.contains('active')) {
          this.className = this.className.replace('hide', 'shown');
          targetObj.classList.add('active');
        } else {
          this.className = this.className.replace('shown', 'hide');
          targetObj.classList.remove('active');
          for (var i = 0; i < mapLen; i++) {
            maps[i].classList.remove('view');
            mapClickPointer[i].classList.remove('hide');
          }
          QS('.zoomReset').click();
        }
      }
    }
  }
}
function toggleMindMap() {
  var targetObjIdx = this.parentElement.dataset.idx;
  var showObj = document.querySelector(
    '.showObj[data-idx="' + targetObjIdx + '"]'
  );
  var targetIdx = this.dataset.mapIdx;
  var maps = document.querySelectorAll('.hideMindMap');
  var mapLen = maps.length;
  var map = null;

  for (var i = 0; i < mapLen; i++) {
    map = maps[i];
    if (map.dataset.mapIdx === targetIdx) {
      map.classList.toggle('view');
    }
  }
  efSound('./media/tab_click.mp3');
  this.classList.add('hide');

  if (
    document.querySelectorAll('.clickPointer').length ===
    document.querySelectorAll('.hideMindMap.view').length
  ) {
    showObj.className = showObj.className.replace('hide', 'shown');
    this.parentElement.classList.add('active');
  }
}

// moveObj
CONTENTS.moveObj = {
  isMove: QSAll('.moveObj'),
  isMoveArea: QSAll('.moveArea'),
  init: function () {
    for (var i = 0; i < this.isMove.length; i++) {
      this.isMove[i].addEventListener('mousedown', this.start);
    }
  },
  start: function () {
    var _this = this,
      moveArea = QS('.page_' + tabIdx).querySelectorAll('.moveArea');

    efSound('./media/tab_click.mp3');
    _this.classList.add('moving');

    if (moveArea.length > 0) {
      for (var j = 0; j < moveArea.length; j++) {
        moveArea[j].innerHTML =
          '<span>' + _this.getAttribute('data-text') + '</span>';
      }
    }
  },
  reset: function (obj) {
    for (var i = 0; i < this.isMove.length; i++) {
      this.isMove[i].classList.remove('moving');
    }
    for (var i = 0; i < this.isMoveArea.length; i++) {
      this.isMoveArea[i].innerHTML = '';
    }
  },
};

// ******************** 말풍선 생성 ***********************

function textBoxCanvas(target) {
  var graph = QSAll('.graph');

  for (var i = 0; i < graph.length; i++) {
    var line = graph[i].getContext('2d');

    line.moveTo(50, 30);
    line.lineTo(100, 30);
    line.lineTo(100, 60);
    if (graph[i].classList[2] == 'blue') line.fillStyle = '#3899FA';
    else if (graph[i].classList[2] == 'green') line.fillStyle = '#42B691';
    else if (graph[i].classList[2] == 'lightgreen') line.fillStyle = '#72AD0C';
    else if (graph[i].classList[2] == 'yellow') line.fillStyle = '#F1C40F';
    else if (graph[i].classList[2] == 'paleOrange') line.fillStyle = '#f6e7d4';
    else if (graph[i].classList[2] == 'paleYellow') line.fillStyle = '#f6f0d4';
    else if (graph[i].classList[2] == 'paleBlue') line.fillStyle = '#d4f3f6';

    if (target == 'yellow') {
      line.shadowColor = 'none';
      line.shadowBlur = 0;
      line.shadowOffsetX = 0;
      line.shadowOffsetY = 0;
    } else if (target == undefined) {
      line.shadowColor = 'rgba(0,0,0,0.4)';
      line.shadowBlur = 9;
      line.shadowOffsetX = 4;
      line.shadowOffsetY = 4;
    }
    line.fill();
  }
}

// 주어진 것, 구하는 것

function addBottomLine() {
  var addLineContainer = QSAll('.addLineContainer');

  for (var i = 0; i < addLineContainer.length; i++) {
    var getLineBtn = createElement('li', addLineContainer[i], 'getLineBtn'),
      givenLineBtn = createElement('li', addLineContainer[i], 'givenLineBtn');

    givenLineBtn.innerHTML = '주어진 것';
    getLineBtn.innerHTML = '구해야 할 것';

    givenLineBtn.addEventListener(
      gameManager.eventSelector.downEvent,
      viewLine
    );
    getLineBtn.addEventListener(gameManager.eventSelector.downEvent, viewLine);
  }

  function viewLine() {
    var givenLine = QSAll('.checkTitleText > span')[0],
      getLine = QSAll('.checkTitleText > span')[1];

    efSound('./media/tab_click.mp3');

    if (this.classList[0].indexOf('givenLineBtn') > -1) {
      if (givenLine.className.indexOf('Line') > -1) givenLine.className = '';
      else givenLine.className = 'givenLine';
    } else {
      if (getLine.className.indexOf('Line') > -1) getLine.className = '';
      else getLine.className = 'getLine';
    }
  }
}

var svgIdxArray = [];

function clickNumAddLine() {
  if (
    document
      .querySelector('.page_' + tabIdx)
      .getElementsByClassName('svgContainer').length > 0
  ) {
    var dapClass = document.querySelector('.page_' + tabIdx),
      clickobj = dapClass.getElementsByClassName('clickobj');

    for (var i = 0; i < clickobj.length; i++) {
      clickobj[i].style.cursor = 'pointer';
      clickobj[i].addEventListener(
        gameManager.eventSelector.upEvent,
        function () {
          clickNumAddLineEv(this, dapClass);
        }
      );
    }
  }
}
function drawLineInPop(popbox) {
  var clickObjs = popbox.getElementsByClassName('clickobj');
  var clickObjLen = clickObjs.length;
  var clickObj = null;
  for (var i = 0; i < clickObjLen; i++) {
    clickObj = clickObjs[i];
    clickObj.style.cursor = 'pointer';
    clickObj.addEventListener(gameManager.eventSelector.upEvent, function () {
      clickNumAddLineEv(this, popbox);
    });
  }
}
function clickNumAddLineEv(target, targetArea) {
  var targetLine = target.getAttribute('line'),
    addPath = targetArea.getElementsByClassName('addPath');
  console.log(targetArea);

  efSound('./media/tab_click.mp3');

  target.style.pointerEvents = 'none';

  for (var j = 0; j < addPath.length; j++) {
    if (targetLine == addPath[j].getAttribute('line')) {
      addPath[j].style.display = 'block';
    }
  }

  svgIdxArray.push(target);
  for (var i = 0, len = svgIdxArray.length; i < len; i++) {
    var checkDobl = 0;
    for (var j = 0, len = svgIdxArray.length; j < len; j++) {
      if (svgIdxArray[i] != svgIdxArray[j]) {
        continue;
      } else {
        checkDobl++;
        if (checkDobl > 1) {
          spliced = svgIdxArray.splice(j, 1);
        }
      }
    }
  }

  if (targetArea.getElementsByClassName('innerPage').length > 0) {
    var innerDapClass = document
        .querySelector('.page_' + tabIdx)
        .getElementsByClassName('innerPage')[innerIdx],
      addPathClass = innerDapClass.getElementsByClassName('addPath'),
      dapCheckClass = innerDapClass.getElementsByClassName('dapCheckBtn');

    if (svgIdxArray.length == addPathClass.length) {
      if (dapCheckClass.length > 0) {
        CONTENTS.quizBox.dapShow();
        svgIdxArray = [];
      }
    }
  } else {
    var addPathClass = targetArea.getElementsByClassName('addPath'),
      dapCheckClass = targetArea.querySelector('.dapCheckBtn');

    if (svgIdxArray.length == addPathClass.length) {
      if (targetArea.getElementsByClassName('dapCheckBtn').length > 0) {
        CONTENTS.quizBox.dapShow();
        svgIdxArray = [];
      }
    }
  }
}
function drawLineAni(target, lineIdx) {
  setTimeout(function () {
    target.style.display = 'block';
  }, 300 * lineIdx);
}
function drawLineReset() {
  var addPath = QSAll('.addPath'),
    clickobj = QSAll('.clickobj');

  for (var i = 0; i < addPath.length; i++) {
    addPath[i].style.display = 'none';
  }
  for (var i = 0; i < clickobj.length; i++) {
    clickobj[i].style.pointerEvents = 'auto';
  }
  svgIdxArray = [];
}

// *******************************************************************************

// OX 퀴즈 수정 3월 17일
function OXClickFn() {
  var oxClick = QSAll('.page_' + tabIdx + ' .oxClick'),
    selectContainer = QSAll('.selectContainer');

  if (!oxClick.length) {
    oxClick = QSAll('.popbox .oxClick');
  }

  for (var i = 0; i < oxClick.length; i++) {
    oxClick[i].style.pointerEvents = 'auto';
    oxClick[i].addEventListener(
      gameManager.eventSelector.upEvent,
      oxClickHandler
    );
  }

  for (var i = 0; i < selectContainer.length; i++) {
    selectClickFn(selectContainer[i], i);
  }
}
function selectClickFn(container, idx) {
  var selectBox = container.querySelectorAll('.selectBox');
  for (var i = 0; i < selectBox.length; i++) {
    var selectText = selectBox[i].querySelector('.selectText');
    selectText.innerHTML = selectTextArr[idx][i];
    selectBox[i].style.pointerEvents = 'auto';
    selectBox[i].querySelector('.selectNum').innerHTML = i + 1;
    selectBox[i].addEventListener(
      gameManager.eventSelector.upEvent,
      oxClickHandler
    );
  }
}
function oxClickHandler() {
  var target = this,
    curTab = QS('.page_' + tabIdx),
    bubbleBoxes = QS('.page_' + tabIdx).querySelectorAll('.bubbleBox'),
    bubbleBoxLen = bubbleBoxes.length;

  if (QS('.page_' + tabIdx).querySelectorAll('.oxTextContainer').length > 0) {
    if (target.getAttribute('dap') == 'true') {
      target.classList.add('correctO');
      target.classList.add('complete');
      target.parentElement.classList.add('complete');

      efSound('media/correct.mp3');
      for (i = 0; i < bubbleBoxLen; i++) {
        bubbleBoxes[i].classList.add('show');
      }
    } else {
      efSound('media/incorrect.mp3');
    }
  } else {
    if (target.getAttribute('dap') == 'true') {
      // 정답일때 O
      target.style.pointerEvents = 'none';
      target.classList.add('complete');

      if (target.classList.contains('oxClick')) {
        var answerO = createElement('div', target, 'oxCheck correctO');
      } else {
        var answerO = createElement(
          'div',
          target.querySelector('.selectNum'),
          'oxCheck correctO'
        );
      }

      if ($('#frameContainer').hasClass('checkpage')) {
        var hideBoxes = target
          .closest('.view')
          .querySelectorAll('.lineBox .hide');
        var hideBoxLen = hideBoxes.length;
        for (var i = 0; i < hideBoxLen; i++) {
          hideBoxes[i].style.display = 'none';
        }

        showPopup(true);
      } else {
        efSound('media/correct.mp3');
      }
      getCount();

      for (i = 0; i < bubbleBoxLen; i++) {
        bubbleBoxes[i].classList.add('show');
      }
    } else {
      // 정답아닐때 X
      target.style.pointerEvents = 'none';
      if (target.classList.contains('oxClick')) {
        var answerX = createElement('div', target, 'oxCheck incorrectX');
      } else {
        var answerO = createElement(
          'div',
          target.querySelector('.selectNum'),
          'oxCheck incorrectX'
        );

        if (curTab.querySelector('.complete')) {
          curTab.querySelector('.complete').style.pointerEvents = 'auto';
          curTab.querySelector('.complete').classList.remove('complete');
          curTab.querySelector('.correctO').classList.remove('correctO');
          curTab.querySelector('.dapCheckBtn').classList.remove('daps');
          curTab.querySelector('.inAnsCheck').textContent = '확인';
        }
      }

      setTimeout(function () {
        var oxCheck = QSAll('.oxCheck');
        for (var i = 0; i < oxCheck.length; i++) {
          if (oxCheck[i].getAttribute('class').indexOf('incorrectX') != -1) {
            var oxCheckName = oxCheck[i].getAttribute('class');
            oxCheck[i].setAttribute(
              'class',
              oxCheckName.replace('oxCheck incorrectX', '')
            );

            oxCheck[i].parentNode.removeChild(oxCheck[i]);
          }
        }
        target.style.pointerEvents = 'auto';
      }, 800);

      if ($('#frameContainer').hasClass('checkpage')) {
        var correctCheck = target.parentElement.querySelector('.correctO');
        if (correctCheck) {
          correctCheck.closest('.selectBox').classList.remove('complete');
          correctCheck.closest('.selectBox').style.pointerEvents = 'auto';
          correctCheck.parentElement.removeChild(correctCheck);
        }
        showPopup(false);
      } else {
        efSound('media/incorrect.mp3');
      }
    }

    var btnComment = curTab.querySelector('.solveCheckBtn');
    if (btnComment) {
      btnComment.classList.remove('daps');
      QS(
        '.solve_pop[data-pop="' + btnComment.dataset.pop + '"]'
      ).style.display = 'none';
    }
  }

  var correctO = QSAll('.page_' + tabIdx + ' .correctO'),
    ans = QSAll('.page_' + tabIdx + ' .ans');

  if (QS('.page_' + tabIdx).getElementsByClassName('innerPage').length > 0) {
    var dapClass = QS('.page_' + tabIdx).getElementsByClassName('innerPage')[
        innerIdx
      ],
      innerAns = dapClass.getElementsByClassName('ans'),
      innerCorrect = dapClass.getElementsByClassName('correctO'),
      dapCheckClass = dapClass.querySelector('.dapCheckBtn');

    if (dapCheckClass !== null) {
      if (dapCount !== 0) {
        if (totalCount === dapCount) {
          CONTENTS.quizBox.dapShow();
        }
      } else if (innerAns.length == innerCorrect.length) {
        CONTENTS.quizBox.dapShow();
      }
    }
  } else {
    var dapClass = document.querySelector('.page_' + tabIdx),
      dapCheckClass = dapClass.querySelector('.dapCheckBtn');

    if (dapCheckClass !== null) {
      if (dapCount !== 0) {
        if (totalCount === dapCount) {
          CONTENTS.quizBox.dapShow();
        }
      } else if (ans.length == correctO.length) {
        CONTENTS.quizBox.dapShow();
        curTab.classList.add('showAnswers');
      } else {
        curTab.classList.remove('showAnswers');
      }
    }
  }
}
function isSubOXHandler(container, target) {
  var innerNextBtn = container.querySelector('.innerNextBtn'),
    popupContents = container.querySelectorAll('.popupContents')[popupIdx];

  if (target.getAttribute('dap') == 'true') {
    var isNotAnswer = popupContents.querySelectorAll('.isSelect');
    target.style.pointerEvents = 'none';
    if (target.classList.contains('select')) {
    } else {
      target.classList.add('select');
      efSound('media/correct.mp3');
    }
    popupContents.classList.add('complete');
    for (var i = 0; i < isNotAnswer.length; i++) {
      if (isNotAnswer[i].getAttribute('dap') == null) {
        isNotAnswer[i].classList.add('clicked');
        isNotAnswer[i].style.pointerEvents = 'none';
      }
    }
    innerNextBtn.style.pointerEvents = 'auto';
    efSound('media/correct.mp3');
  } else {
    efSound('media/incorrect.mp3');
  }
}
function OXResetFn() {
  var curTab = QS('.page_' + tabIdx),
    correctO = curTab.querySelectorAll('.correctO'),
    oxClick = QSAll('.oxClick'),
    selectBox = curTab.querySelectorAll('.selectBox'),
    feedBack = curTab.querySelectorAll('.selectBox .feedBack'),
    oxTextContainer = curTab.querySelectorAll('.oxTextContainer'),
    hideBoxes = curTab.querySelectorAll('.lineBox .hide'),
    isSelect = QSAll('.isSelect'),
    bubbleBoxes = curTab.querySelectorAll('.bubbleBox'),
    bubbleBoxLen = bubbleBoxes.length;

  if (oxTextContainer.length > 0) {
    for (var i = 0; i < oxClick.length; i++) {
      if (oxClick[i].classList.contains('characterText')) {
        oxClick[i].classList.remove('correctO');
      }
    }
  } else {
    var oxCheck = QSAll('.oxCheck');
    for (var i = 0; i < oxCheck.length; i++) {
      if (oxCheck[i].getAttribute('class').indexOf('correctO') != -1) {
        var oxCheckName = oxCheck[i].getAttribute('class');
        oxCheck[i].setAttribute(
          'class',
          oxCheckName.replace('oxCheck correctO', '')
        );
      }
    }
    for (var i = 0; i < correctO.length; i++) {
      correctO[i].parentNode.removeChild(correctO[i]);
    }
  }
  for (var i = 0; i < oxClick.length; i++) {
    oxClick[i].style.pointerEvents = 'auto';
    oxClick[i].classList.remove('complete');
    oxClick[i].parentElement.classList.remove('complete');
    oxClick[i].classList.remove('correctO');
    for (var j = 0; j < bubbleBoxLen; j++) {
      bubbleBoxes[j].classList.remove('show');
    }
  }
  for (var i = 0; i < selectBox.length; i++) {
    selectBox[i].style.pointerEvents = 'auto';
    selectBox[i].classList.remove('complete');
  }
  for (var i = 0; i < isSelect.length; i++) {
    isSelect[i].classList.remove('clicked');
    isSelect[i].classList.remove('select');
    isSelect[i].style.pointerEvents = 'auto';
  }
  for (var i = 0; i < hideBoxes.length; i++) {
    hideBoxes[i].style.display = 'block';
  }
  if (feedBack.length > 0) {
    for (var i = 0; i < feedBack.length; i++) {
      feedBack[i].style.display = 'none';
    }
  }
}

function exampleBtnFn() {
  var exampleDap = QSAll('.exampleDap');
  for (var i = 0; i < exampleDap.length; i++) {
    exampleDap[i].addEventListener('click', exampleBtnInit);
  }
}
function exampleBtnInit() {
  var target = this,
    textBox =
      QS('.page_' + tabIdx).querySelectorAll('textarea').length > 0
        ? QS('.page_' + tabIdx).querySelectorAll('textarea')
        : QS('.page_' + tabIdx).querySelectorAll('input'),
    textContent = '';

  efSound('./media/click.mp3');
  if (target.classList[2] === 'exampleLook') {
    target.className = target.className.replace('exampleLook', 'exampleWrite');

    for (var j = 0; j < textBox.length; j++) {
      textContent = textBox[j].getAttribute('data-dap');
      textBox[j].style.color = '#00a0ff';
      textBox[j].value = textContent ? textContent : ' ';
      textBox[j].readOnly = true;
    }
  } else {
    target.className = target.className.replace('exampleWrite', 'exampleLook');

    for (var j = 0; j < textBox.length; j++) {
      textBox[j].style.color = '#24914d';
      textBox[j].value = '';
      textBox[j].readOnly = false;
    }
  }
}

function textReset() {
  var textarea = QS('.page_' + tabIdx).querySelectorAll('textarea'),
    input = QS('.page_' + tabIdx).querySelectorAll('input');

  if (textarea.length > 0) {
    for (var j = 0; j < textarea.length; j++) {
      textarea[j].value = '';
      textarea[j].readOnly = false;
      textarea[j].style.color = '#24914d';
    }
  } else {
    for (var j = 0; j < input.length; j++) {
      input[j].value = '';
      input[j].readOnly = false;
      input[j].style.color = '#24914d';
    }
  }
}

/***********************************************************************************/
// 생각 열기 : 탭
var thinkopen_Array = [];
var thinkopen_bgImg = [];
var btnIdx = 0;

function thinkOpen_Type() {
  var contents = document.querySelector('#contents'),
    thinkopen_bg = createElement('div', contents, 'thinkopen_bg'),
    thinkopen_popup = createElement('div', contents, 'thinkopen_popup'),
    thinkopen_topContainer = createElement(
      'div',
      thinkopen_popup,
      'thinkopen_topContainer'
    ),
    thinkopen_popup_tab = createElement(
      'div',
      thinkopen_topContainer,
      'thinkopen_popup_tab'
    ),
    thinkopen_btn = createElement(
      'div',
      thinkopen_topContainer,
      'thinkopen_btn btn'
    ),
    thinkopen_popup_content = createElement(
      'div',
      thinkopen_popup,
      'thinkopen_popup_content'
    ),
    thinkopen_popup_ans = createElement(
      'div',
      thinkopen_popup_content,
      'thinkopen_popup_ans'
    ),
    thinkopen_popup_content = document.querySelector(
      '.thinkopen_popup_content'
    ),
    thinkopen_popup_ans = document.querySelector('.thinkopen_popup_ans'),
    thinkopen_popup_mbtn = createElement(
      'div',
      thinkopen_popup_content,
      'thinkopen_popup_mbtn'
    ),
    i = 0,
    j = 0;

  thinkopen_btn.classList.add('show');
  thinkopen_popup_mbtn.innerHTML =
    '<ul class="slider btn" btnNum="3"><li class="btn_prev"></li></ul><ul class="slider btn" btnNum="3"><li class="btn_next"></li></ul>';

  // 탭 : 버튼 생성
  var tabHTML = '<ul>';
  for (i = 0; i < thinkopen_Array.length; i++) {
    tabHTML += '<li class="tab" num="' + i + '"></li>';
  }
  tabHTML += '</ul>';
  thinkopen_popup_tab.innerHTML = tabHTML;
  thinkopen_popup_tab.childNodes[0].childNodes[0].classList.add('view');

  // 탭이동 : 텍스트, 버튼 생성
  var txtHTML = '<div>';
  txtHTML += '<ul class="thinkopen_popup_txt">';
  for (i = 0; i < thinkopen_Array.length; i++) {
    txtHTML += '<li tnum="' + i + '">' + thinkopen_Array[i] + '</li>';
  }
  txtHTML += '</ul>';
  thinkopen_popup_ans.innerHTML = txtHTML;

  var tab = document.querySelectorAll('.tab'),
    ptxt = thinkopen_popup_ans.childNodes[0].childNodes[0];

  for (i = 0; i < thinkopen_Array.length; i++) {
    ptxt.childNodes[i].style.display = 'none';
    ptxt.childNodes[0].style.display = 'block';
  }

  thinkopen_popup_mbtn.childNodes[0].classList.add('off');
  thinkopen_popup_mbtn.style.pointerEvents = 'none';

  var contentsImgWrap = document.querySelectorAll('.contentsImgWrap');
  var contImgWrapLen = contentsImgWrap.length;
  var toggleContent = null;
  var btnPointer = null;

  if (contImgWrapLen > 1) {
    for (j = 0; j < contImgWrapLen; j++) {
      contentsImgWrap[j].style.display = 'none';
      // 생각 열기 세부 내용 버튼 생성
      toggleContent = contentsImgWrap[j].querySelector('.highLightShow');
      if (toggleContent) {
        btnPointer = document.createElement('span');
        btnPointer.setAttribute('class', 'clickPointer mouse');
        btnPointer.setAttribute('num', j);
        ptxt.childNodes[j].appendChild(btnPointer);
      }
    }
    contentsImgWrap[0].style.display = 'block';
  }

  thinkopen_popup_content.style.visibility = 'visible';
  thinkopen_btn.addEventListener(
    gameManager.eventSelector.upEvent,
    function () {
      if (thinkopen_popup_content.style.visibility == 'visible') {
        thinkopen_btn.classList.remove('show');
        thinkopen_btn.classList.add('hide');
        thinkopen_popup_mbtn.style.display = 'none';
        thinkopen_popup_content.style.visibility = 'hidden';

        thinkopen_popup_content.classList.add('opa_out');
        thinkopen_popup_content.classList.remove('opa_in');
        thinkopen_popup_content.style.visibility = 'hidden';
      } else {
        thinkopen_btn.classList.remove('hide');
        thinkopen_btn.classList.add('show');
        thinkopen_popup_mbtn.style.display = 'block';
        thinkopen_popup_content.style.visibility = 'visible';

        thinkopen_popup_content.classList.add('opa_in');
        thinkopen_popup_content.classList.remove('opa_out');
        thinkopen_btn.classList.add('show');
      }
      efSound('./media/tab_click.mp3');
    }
  );

  for (var i = 0; i < tab.length; i++) {
    tab[i].addEventListener(gameManager.eventSelector.upEvent, function (e) {
      var obj = e.target,
        tabNum = obj.getAttribute('num'),
        tabDis = tab.length - 1;
      efSound('./media/tab_click.mp3');

      if (document.querySelectorAll('.contentsImgWrap').length > 1) {
        var contentsImgWrap = document.querySelectorAll('.contentsImgWrap');
        for (var j = 0; j < contentsImgWrap.length; j++) {
          contentsImgWrap[j].style.display = 'none';
          contentsImgWrap[tabNum].style.display = 'block';
        }
      }

      btnIdx = tabNum;

      if (btnIdx == 0) {
        thinkopen_popup_mbtn.childNodes[0].classList.add('off');
        thinkopen_popup_mbtn.childNodes[1].classList.remove('off');
      } else if (btnIdx == tabDis) {
        thinkopen_popup_mbtn.childNodes[0].classList.remove('off');
        thinkopen_popup_mbtn.childNodes[1].classList.add('off');
      } else {
        thinkopen_popup_mbtn.childNodes[0].classList.remove('off');
        thinkopen_popup_mbtn.childNodes[1].classList.remove('off');
      }

      for (var j = 0; j < tab.length; j++) {
        ptxt.childNodes[j].style.display = 'none';
        ptxt.childNodes[btnIdx].style.display = 'block';
        tab[j].classList.remove('view');
        obj.classList.add('view');
      }

      nonePage(document.getElementById('contents'));
    });
  }

  // 생각 열기 세부 내용 보이기
  var clickBtn = document.querySelectorAll('.clickPointer');
  for (var i = 0; i < clickBtn.length; i++) {
    clickBtn[i].addEventListener(gameManager.eventSelector.upEvent, function (
      e
    ) {
      var obj = e.target,
        tabNum = obj.getAttribute('num');
      efSound('./media/click.mp3');
      if (zoomInstance) {
        zoomInstance.resetZoom();
      }

      if (document.querySelectorAll('.contentsImgWrap').length > 1) {
        var contentsImgWrap = document.querySelectorAll('.contentsImgWrap'),
          showhide_content = contentsImgWrap[tabNum].querySelectorAll('.hide');
        for (var j = 0; j < showhide_content.length; j++) {
          showhide_content[j].classList.remove('hide');
        }
        obj.classList.add('hide');
      }
    });
  }

  btn_tabMove();
}

// ******************************************************************
// 생각열기 : 팝업 탭
function btn_tabMove() {
  var thinkopen_popup_ans = document.querySelector('.thinkopen_popup_ans'),
    thinkopen_popup_mbtn = document.querySelector('.thinkopen_popup_mbtn'),
    tab = document.querySelectorAll('.tab'),
    slider = document.querySelectorAll('.slider');

  var ptxt = thinkopen_popup_ans.childNodes[0].childNodes[0];

  for (var i = 0; i < slider.length; i++) {
    slider[i].addEventListener(gameManager.eventSelector.upEvent, function (e) {
      var objClass = e.target.childNodes[0].getAttribute('class').split(' ')[0],
        tablen = tab.length - 1;

      efSound('./media/tab_click.mp3');

      // 다음 페이지 -------------
      if (objClass == 'btn_next') {
        btnIdx++;

        if (btnIdx > 0) {
          thinkopen_popup_mbtn.childNodes[0].classList.remove('off');
          thinkopen_popup_mbtn.childNodes[1].classList.remove('off');
        }
        if (btnIdx == tablen) {
          thinkopen_popup_mbtn.childNodes[0].classList.remove('off');
          thinkopen_popup_mbtn.childNodes[1].classList.add('off');
        }

        for (var j = 0; j < tab.length; j++) {
          ptxt.childNodes[j].style.display = 'none';
          ptxt.childNodes[btnIdx].style.display = 'block';
          tab[j].classList.remove('view');
          tab[btnIdx].classList.add('view');
        }
        if (document.querySelectorAll('.contentsImgWrap').length > 1) {
          var contentsImgWrap = document.querySelectorAll('.contentsImgWrap');
          for (var j = 0; j < contentsImgWrap.length; j++) {
            contentsImgWrap[j].style.display = 'none';
            contentsImgWrap[btnIdx].style.display = 'block';
          }
        }
      }

      // 이전 페이지 -------------
      else {
        btnIdx--;

        if (btnIdx == 0) {
          thinkopen_popup_mbtn.childNodes[0].classList.add('off');
          thinkopen_popup_mbtn.childNodes[1].classList.remove('off');
        } else {
          thinkopen_popup_mbtn.childNodes[0].classList.remove('off');
          thinkopen_popup_mbtn.childNodes[1].classList.remove('off');
        }

        for (var j = 0; j < tab.length; j++) {
          ptxt.childNodes[j].style.display = 'none';
          ptxt.childNodes[btnIdx].style.display = 'block';
          tab[j].classList.remove('view');
          tab[btnIdx].classList.add('view');
        }
        if (document.querySelectorAll('.contentsImgWrap').length > 1) {
          var contentsImgWrap = document.querySelectorAll('.contentsImgWrap');
          for (var j = 0; j < contentsImgWrap.length; j++) {
            contentsImgWrap[j].style.display = 'none';
            contentsImgWrap[btnIdx].style.display = 'block';
          }
        }
      }
      nonePage(document.getElementById('contents'));
    });
  }
}
// *************************************************************************

// 오늘 배울 내용 : 등장 효과
function todaycontent_txtani(obj, idx) {
  setTimeout(function () {
    animate({
      delay: 20,
      duration: 300,
      delta: makeEaseOut(linear),
      step: function (delta) {
        obj.style.display = 'block';
        obj.style.left = -800 + 800 * delta + 'px';
      },
    });
  }, 500 * (idx + 1));
}

// 다음 시간에 배울 내용 : 등장 효과
function nextcontent_txtani(obj, idx) {
  setTimeout(function () {
    animate({
      delay: 80,
      duration: 400,
      delta: makeEaseOut(linear),
      step: function (delta) {
        obj.style.display = 'block';
        obj.style.opacity = 0 + 1 * delta;
        obj.style.top = -50 + 130 * delta + 'px';
      },
    });
  }, 300 * (idx + 1));
}

// 교과서 쪽수 내용 : 등장 효과
function subjectNum_txtani(obj) {
  setTimeout(function () {
    animate({
      delay: 90,
      duration: 250,
      delta: makeEaseOut(linear),
      step: function (delta) {
        obj.style.opacity = 0 + 1 * delta;
      },
    });
  }, 850);
}

// 단원 학습 목표 - 171221 yd
function lessonStudyGoal() {
  var contents = document.querySelector('#contents'),
    lessonGoalTitle = createElement('div', contents, 'lessonGoal_bg'),
    lessonGoalInner = createElement('div', contents, 'whiteInner'),
    whiteInner = document.querySelector('.whiteInner'),
    lessonGoalTitleContainer = createElement(
      'div',
      whiteInner,
      'lessonGoalTitleContainer'
    ),
    lessonGoalTitleContainer = document.querySelector(
      '.lessonGoalTitleContainer'
    ),
    lessonGoalTitleText = createElement(
      'span',
      lessonGoalTitleContainer,
      'lessonGoalTitleText'
    ),
    lessonGoal_contents = createElement(
      'ul',
      whiteInner,
      'lessonGoal_contents'
    ),
    lessonGoal_contents = document.querySelector('.lessonGoal_contents'),
    lessonGoal_contents_li_T = createElement(
      'li',
      lessonGoal_contents,
      'lessonGoal_contents_top_bg'
    ),
    lessonGoal_contents_li_M = createElement(
      'li',
      lessonGoal_contents,
      'lessonGoal_contents_middle_bg'
    ),
    lessonGoal_contents_li_B = createElement(
      'li',
      lessonGoal_contents,
      'lessonGoal_contents_bottom_bg'
    );
  lessonGoal_contents.classList.add('topToBottom');

  var elLength = StudyGoalArray.text.length;

  for (var i = 0; i < elLength; i++) {
    var lessonGoal_textBox = createElement(
      'div',
      lessonGoal_contents_li_M,
      'goalTextBox'
    );

    if (elLength > 1) {
      var lessonGoal_text_Bullet = createElement(
          'div',
          lessonGoal_textBox,
          'lessonGoal_text_Bullet'
        ),
        lessonGoal_text = createElement(
          'p',
          lessonGoal_textBox,
          'goalTextBox_' + i
        );
      lessonGoal_text_Bullet.classList.add('redBullet');
      lessonGoal_text_Bullet.style.marginTop = '24px';
      lessonGoal_text.classList.add('setList');
    } else {
      var lessonGoal_text = createElement(
        'p',
        lessonGoal_textBox,
        'goalTextBox_' + i
      );
    }
    lessonGoalTitleText.innerHTML =
      "<span style='padding-right: 15px;'>" +
      lessonTitleArray[0] +
      '.</span>' +
      '<span>' +
      lessonTitleArray[1] +
      '</span>';
    if (StudyGoalArray.align == 'center') {
      lessonGoal_textBox.style.textAlign = 'center';
    } else if (StudyGoalArray.align == 'justify') {
      lessonGoal_textBox.style.textAlign = 'justify';
    }
    lessonGoal_text.innerHTML = StudyGoalArray.text[i];
  }
}

// 이번 시간에 배울 내용 - 171222 yd
function todaycontent_Type() {
  var contents = document.querySelector('#contents');
  var todaycontent = createElement('div', contents, 'todaycontent');
  var nextClass = todayContents.contents === 'today' ? '' : 'next';
  var todayHeader = createElement(
    'div',
    todaycontent,
    'todayHeader ' + nextClass
  );
  var todayContentTitle = createElement(
    'span',
    todayHeader,
    'todayContentTitle'
  );
  var textBox = createElement('div', todaycontent, 'textBox');
  var textBoxPage = createElement('div', textBox, 'todayPage');
  var pageParagraph = createElement('p', textBoxPage);
  var pageText = createElement('span', pageParagraph);
  var textBoxText = createElement('div', textBox, 'todayTxt');
  var textParagraph = createElement('p', textBoxText);
  var todayBottom = createElement('div', todaycontent, 'todayBottom');

  todayContentTitle.textContent = todayContents.text;
  pageText.textContent = todayContents.bookPage;
  textParagraph.innerHTML = todayContents.text;
}

// 확인문제 인트로 및 컨텐츠페이지 구성 ------------------------------------------
function initGatePage() {
  document
    .querySelector('.introStartBtn')
    .addEventListener('click', function () {
      this.closest('.gate_container').classList.add('off');
      efSound('./media/click.mp3');
    });
}
// 확인 문제 탭
function checkTabInit() {
  var checkTabContainer = document.querySelector('.checkTabContainer'),
    checkContents = document.querySelectorAll('.checkContents > li'),
    checkContainer = document.querySelector('.checkContainer');

  var checkBgTitle = document.createElement('div');
  checkBgTitle.setAttribute(
    'style',
    'position: absolute;top: 37px;left: 159px;font-size: 42px;letter-spacing: -4px;color: #fff;font-family: HUGothicB;text-shadow: 2px 2px #000;'
  );
  checkBgTitle.innerHTML = '<span>확인 문제</span>';
  checkContainer.appendChild(checkBgTitle);

  tabIdx = 1;
  QS('.page_' + tabIdx).style.display = 'block';

  DragdropInit();
  // clickNumAddLine();

  for (var i = 0; i < checkContents.length; i++) {
    var tab = createElement('li', checkTabContainer, 'tab_' + (i + 1));
    tab.classList.add('checkTab');
  }
  var checkTab = document.querySelectorAll('.checkTab');

  for (var i = 0; i < checkTab.length; i++) {
    var checkTabNum = createElement('span', checkTab[i]);
    checkTabNum.innerHTML = i + 1;
    checkTab[0].classList.add('active');
    checkTab[i].addEventListener('mousedown', checkTabActFn);
    checkTab[i].addEventListener('mouseover', checkTabOver);
    checkTab[i].addEventListener('mouseout', chechTabOut);
  }
}
function checkTabOver() {
  this.classList.add('tabIconActive');
}
function chechTabOut() {
  this.classList.remove('tabIconActive');
}
function checkTabActFn() {
  var checkContents = document.querySelectorAll('.checkContents > li'),
    checkTab = document.querySelectorAll('.checkTab'),
    target = this;
  tabIdx = target.classList[0].split('_')[1];
  tabIdxArray = [];

  checkTitleCreate(tabIdx);
  target.style.pointerEvents = 'none';

  for (var j = 0; j < checkTab.length; j++) {
    checkTab[j].classList.remove('active');
    target.classList.add('active');
    checkTab[j].style.pointerEvents = 'auto';
  }

  for (var j = 0; j < checkContents.length; j++) {
    checkContents[j].style.display = 'none';
    checkContents[tabIdx - 1].style.display = 'block';
  }
  efSound('./media/tab_click.mp3');
  // intervalInit();
  DragdropInit();
  // clickNumAddLine();
  nonePage(QS('.page_' + tabIdx));
  btn_innerPageEvent();

  svgIdxArray = [];
  console.log('tab : ' + tabIdx);
}
// 확인 문제 발문 생성
function checkTitleCreate(tabIdx) {
  var text = document.querySelector('.checkTitleText');

  if (tabIdx !== undefined) {
    var checkPages = QS('.page_' + tabIdx);

    text.innerHTML = checkTitleText[tabIdx - 1];
    if (text.clientHeight > 72 && text.clientHeight < 215) {
      checkPages.classList.add('twoLine');
      checkPages.classList.remove('threeLine');
    } else if (text.clientHeight > 215) {
      checkPages.classList.add('threeLine');
      checkPages.classList.remove('twoLine');
    } else {
      checkPages.classList.remove('threeLine');
      checkPages.classList.remove('twoLine');
    }
  } else {
    text.innerHTML = checkTitleText[0];
  }
}
/*20180607 제재퀴즈 추가 기능*/
function startIntroStartBtn() {
  var subQuizBtn = document.querySelector('.subQuizBtn');
  subQuizBtn.addEventListener('click', function () {
    var subQuizContents = document.querySelector('.start.subQuizContents');
    subQuizContents.style.display = 'block';
    var closeBtn = document.querySelector('.start.subQuizContents .closeBtn');
    closeBtn.addEventListener('click', function () {
      var subQuizContents = document.querySelector('.start.subQuizContents');
      subQuizContents.style.display = 'none';
    });
  });
}
// ------------------------------------------

// 이미지 확대
var touchCheck = false;
var dragDrop;
var zoom;
var zoomRate = 1.0;

function startDrag(e) {
  zoom = gameManager.zoomRate;
  dragDrop = this;
  e.preventDefault();
  dragDrop.startX =
    (touchCheck ? e.touches[0].clientX : e.clientX) - this.offsetLeft * zoom;
  dragDrop.startY =
    (touchCheck ? e.touches[0].clientY : e.clientY) - this.offsetTop * zoom;
  if (
    (dragDrop.classList.contains('mini') ||
      dragDrop.classList.contains('miniSlide')) &&
    !dragDrop.dataset.width
  ) {
    dragDrop.dataset.width = dragDrop.clientWidth;
  }
  window.addEventListener(
    touchCheck ? 'touchmove' : 'mousemove',
    doDrag,
    false
  );
}
function doDrag(e) {
  dragDrop.style.position = 'absolute';

  dragDrop.moveX =
    (touchCheck ? e.touches[0].clientX : e.clientX) - dragDrop.startX;
  dragDrop.moveY =
    (touchCheck ? e.touches[0].clientY : e.clientY) - dragDrop.startY;
  dragChange();
}
function endDrag(e) {
  if (dragDrop) {
    dragDrop.endX = touchCheck ? e.changedTouches[0].clientX : e.clientX;
    dragDrop.endY = touchCheck ? e.changedTouches[0].clientY : e.clientY;
  }
  window.removeEventListener(
    touchCheck ? 'touchmove' : 'mousemove',
    doDrag,
    false
  );
  window.removeEventListener(
    touchCheck ? 'touchmove' : 'mousemove',
    endDrag,
    false
  );
}
function dragChange() {
  var zoom = zoomRate;
  var parent = dragDrop.parentNode;

  if (
    dragDrop.classList.contains('mini') ||
    dragDrop.classList.contains('miniSlide')
  ) {
    dragDrop.style.left =
      dragDrop.moveX / gameManager.zoomRate -
      parseInt(dragDrop.style.marginLeft) +
      'px';
    dragDrop.style.top =
      dragDrop.moveY / gameManager.zoomRate -
      parseInt(dragDrop.style.marginTop) +
      'px';
    dragDrop.style.width = dragDrop.dataset.width + 'px';
  } else {
    dragDrop.style.left = dragDrop.moveX / zoom + 'px';
    dragDrop.style.top = dragDrop.moveY / zoom + 'px';

    if (dragDrop.offsetLeft * zoom < -((dragDrop.offsetWidth / 3) * zoom)) {
      dragDrop.style.left = -((dragDrop.offsetWidth / 3) * zoom) + 'px';
    } else if (
      dragDrop.offsetLeft / zoom + dragDrop.offsetWidth >
      parent.offsetWidth + dragDrop.offsetWidth / 3 / zoom
    ) {
      dragDrop.style.left =
        parent.offsetWidth -
        (dragDrop.offsetWidth - dragDrop.offsetWidth / 3) / zoom +
        'px';
    }

    if (dragDrop.offsetTop * zoom < -((dragDrop.offsetHeight * zoom) / 2)) {
      dragDrop.style.top = -((dragDrop.offsetHeight * zoom) / 2) + 'px';
    } else if (
      dragDrop.offsetTop / zoom + dragDrop.offsetHeight >
      parent.offsetHeight + dragDrop.offsetHeight / 2 / zoom
    ) {
      dragDrop.style.top =
        parent.offsetHeight -
        (dragDrop.offsetHeight - dragDrop.offsetHeight / 2) / zoom +
        'px';
    }
  }
}

function initPuzzleQuiz() {
  var quizContainer = QS('.quizContainer'),
    puzzleWrap = QS('#qzPuzz'),
    que = puzzleWrap.querySelector('.que'),
    puzzlePieces = que.querySelectorAll('button'),
    pieceLen = puzzlePieces.length,
    btnFunc = quizContainer.querySelectorAll('.qzFunc button'),
    pieceIdxArr = [],
    i = 0,
    setPieceIdxArr = function () {
      for (i = 0; i < pieceLen; i++) {
        pieceIdxArr.push(i);
      }
    },
    selectBtn = function () {
      efSound('./media/tab_click.mp3');
      if (this.classList.contains('solveCheckBtn')) {
        //힌트 버튼
        var pieceIdx = 0;
        var randomNum = 0;
        var hintPiece = null;

        var getHintPiece = function () {
          if (pieceIdxArr.length === 0) {
            setPieceIdxArr();
          }
          randomNum = Math.floor(Math.random() * pieceIdxArr.length);
          pieceIdx = pieceIdxArr[randomNum];
          pieceIdxArr.splice(randomNum, 1);
          if (puzzlePieces[pieceIdx].classList.contains('sel')) {
            getHintPiece();
          }
          return puzzlePieces[pieceIdx];
        };
        var onAnimationEnded = function () {
          this.classList.remove('flip');
          this.removeEventListener('animationend', onAnimationEnded);
        };

        if (puzzleWrap.querySelectorAll('.flip').length === 0) {
          hintPiece = getHintPiece();
          hintPiece.classList.add('flip');
          hintPiece.addEventListener('animationend', onAnimationEnded);
        }
      } else if (this.classList.contains('ansCheckBtn')) {
        //정답버튼
        var flipLen = puzzleWrap.querySelectorAll('.flip').length;
        var showAnswer = function () {
          if (this.classList.contains('hide')) {
            var selPieces = que.querySelectorAll('.sel');

            for (var i = 0; i < selPieces.length; i++) {
              selPieces[i].classList.remove('sel');
            }
            this.classList.remove('hide');
            que.classList.remove('answer');
            que.querySelector('img').classList.remove('show');
            que.querySelector('.ans').classList.remove('show');

            QS('.qzFunc .solveCheckBtn').classList.remove('hide');
            QS('.qzFunc .solveCheckBtn').classList.add('show');
          } else {
            this.classList.add('hide');
            que.classList.add('answer');
            que.querySelector('img').classList.add('show');
            que.querySelector('.ans').classList.add('show');
            QS('.qzFunc .solveCheckBtn').classList.add('hide');
            QS('.qzFunc .solveCheckBtn').classList.remove('show');
          }
        };

        if (!flipLen) {
          showAnswer.call(this);
        }
        timer.stop();
      } else {
        // 퍼즐 선택
        if (!this.classList.contains('sel')) {
          this.classList.add('sel');
        }
        if (puzzleWrap.querySelectorAll('button.sel').length === pieceLen) {
          que.querySelector('img').classList.add('show');
        } else if (puzzleWrap.querySelectorAll('button.sel').length === 3) {
          QS('.qzFunc .solveCheckBtn').classList.add('hide');
        }
      }
    },
    selectPuzzlePiece = function () {
      if (!this.classList.contains('sel')) {
        selectBtn.call(this);
      }
    };

  for (i = 0; i < pieceLen; i++) {
    puzzlePieces[i].addEventListener('click', selectPuzzlePiece);
  }

  for (i = 0; i < btnFunc.length; i++) {
    btnFunc[i].addEventListener('click', selectBtn);
  }

  setPieceIdxArr();
  var timer = new Timer();
  timer.init();
}

function Timer() {
  var qzTimer = QS('.qzTimer');
  var btnTimer = qzTimer.querySelector('.qzBtnTimer');
  var timeout = 30000;
  var count = 0;

  return {
    timer: this,
    init: function () {
      qzTimer.addEventListener('click', this.selectTimer.bind(this));
    },
    selectTimer: function (e) {
      if (
        !document.getElementById('qzIntro') &&
        qzTimer.parentElement
          .querySelector('.ansCheckBtn')
          .classList.contains('hide')
      ) {
        return;
      }

      if (e.target.parentElement.classList.contains('off')) {
        this.start();
      } else {
        this.stop();
      }
      efSound('./media/tab_click.mp3');
    },
    start: function (timeLimit) {
      timeout = timeLimit ? timeLimit : timeout;
      console.log(timeout / 1000 + '초');
      var timer = this;

      qzTimer.querySelector('.count').innerHTML =
        '<span class="num">' +
        timeout / 1000 +
        '초</span> <span>남았습니다!</span>';

      qzTimer.querySelector('.bar span').style.opacity = 1;
      qzTimer.querySelector('.qzBtnTimer').classList.add('active');
      qzTimer.classList.remove('off');
      qzTimer.classList.add('go');
      qzTimer.dataset.timer = setInterval(function () {
        count++;
        if (count * 1000 >= timeout) {
          console.log('종료');
          efSound('./media/wrong.mp3');
          timer.stop();
        } else {
          console.log(timeout / 1000 - count + '초');
          qzTimer.querySelector('.num').textContent =
            timeout / 1000 - count + '초';
        }
      }, 1000);

      btnTimer.nextElementSibling.firstElementChild.style.animation =
        'puzzBarWidth ' + timeout / 1000 + 's linear';
    },
    stop: function () {
      count = 0;
      clearInterval(qzTimer.dataset.timer);
      qzTimer.querySelector('.qzBtnTimer').classList.remove('active');
      qzTimer.classList.add('off');
      qzTimer.classList.remove('go');
      qzTimer.querySelector('.count').innerHTML =
        '<span class="num">' +
        timeout / 1000 +
        '초</span> <span>타이머 <span>OFF</span></span>';
      qzTimer.querySelector('.bar span').style.opacity = 0;

      btnTimer.nextElementSibling.firstElementChild.style.animation = 'none';
    },
    finish: function () {},
    reset: function () {},
  };
}

function LineDraw(target, idx) {
  var lineDraw = null;
  return {
    container: target,
    containerIdx: idx,
    svgContainer: null,
    allPoints: null,
    isCreateAnswer: false,
    init: function () {
      // create svg
      lineDraw = this;
      var dots = lineDraw.container.querySelectorAll('.lineDot');
      var tabContainer = QSAll('.tabContainer');
      var tabContLen = tabContainer.length;

      var createPointEle = function (i) {
        var dot = dots[i];
        var dotWidth = parseInt(window.getComputedStyle(dot).width);
        var dotHeight = parseInt(window.getComputedStyle(dot).height);
        var dotLeft = window.getComputedStyle(dot).left;
        var dotTop = window.getComputedStyle(dot).top;
        var dotMarginLeft = parseInt(window.getComputedStyle(dot).marginLeft);
        var dotMarginTop = parseInt(window.getComputedStyle(dot).marginTop);
        var pointEle = document.createElement('div');

        pointEle.className = 'drawLinePoint';
        pointEle.dataset.answer = dot.dataset.answer;
        pointEle.style.width = dotWidth * 4 + 'px';
        pointEle.style.height = dotHeight * 4 + 'px';
        pointEle.style.left =
          'calc(' +
          dotLeft +
          ' - ' +
          (dotWidth / 2 - dotMarginLeft + dotWidth) +
          'px)';

        pointEle.style.top =
          'calc(' +
          dotTop +
          ' - ' +
          (dotHeight / 2 - dotMarginTop + dotHeight) +
          'px)';
        dot.insertAdjacentElement('afterend', pointEle);
        // bind drag start
        pointEle.addEventListener(
          gameManager.eventSelector.downEvent,
          lineDraw.startDraw
        );
      };

      lineDraw.svgContainer = lineDraw.container.querySelector('.svgContainer');

      for (var i = 0; i < dots.length; i++) {
        createPointEle(i);
      }

      lineDraw.allPoints = lineDraw.container.querySelectorAll(
        '.drawLinePoint'
      );

      lineDraw.container.parentElement
        .querySelector('.dapCheckBtn')
        .addEventListener('click', lineDraw.showAnswer);

      if (lineDraw.containerIdx === 0) {
        for (i = 0; i < tabContLen; i++) {
          tabContainer[i].addEventListener('click', lineDraw.resetAll);
        }
      }
    },
    setDrawLine: function () {
      lineDraw.line.setAttribute('x1', lineDraw.startPoint.x);
      lineDraw.line.setAttribute('y1', lineDraw.startPoint.y);
      lineDraw.line.setAttribute('x2', lineDraw.endPoint.x);
      lineDraw.line.setAttribute('y2', lineDraw.endPoint.y);
    },
    startDraw: function (e) {
      lineDraw.startPointEle = e.target;
      var pointRect = lineDraw.startPointEle.getBoundingClientRect();
      if (lineDraw.startPointEle.classList.contains('complete')) return;

      lineDraw.svgContainer.style.zIndex = 100;
      lineDraw.svgContRect = lineDraw.svgContainer.getBoundingClientRect();
      lineDraw.svgContainer.setAttribute(
        'class',
        lineDraw.svgContainer.getAttribute('class') + ' dragging'
      );
      lineDraw.answer = lineDraw.startPointEle.dataset.answer;

      lineDraw.line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );
      lineDraw.startPoint = {
        x:
          (pointRect.left - lineDraw.svgContRect.left) / gameManager.zoomRate +
          lineDraw.startPointEle.clientWidth / 2,
        y:
          (pointRect.top - lineDraw.svgContRect.top) / gameManager.zoomRate +
          lineDraw.startPointEle.clientHeight / 2,
      };

      window.addEventListener(
        gameManager.eventSelector.moveEvent,
        lineDraw.moveDraw,
        { passive: true }
      );
      window.addEventListener(
        gameManager.eventSelector.upEvent,
        lineDraw.endDraw,
        { passive: true }
      );
      window.addEventListener(
        gameManager.eventSelector.outEvent,
        lineDraw.endDraw,
        { passive: true }
      );
    },
    moveDraw: function (e) {
      // console.log('move::::: ');
      var evt = eventSelector('moveEvent', e);

      if (
        evt.type === 'mousemove' &&
        evt.target.tagName !== 'svg' &&
        evt.target.tagName !== 'line'
      ) {
        return;
      }

      lineDraw.endPointX = eventCheck
        ? (evt.clientX - lineDraw.svgContRect.left) / gameManager.zoomRate
        : evt.offsetX;
      lineDraw.endPointY = eventCheck
        ? (evt.clientY - lineDraw.svgContRect.top) / gameManager.zoomRate
        : evt.offsetY;

      lineDraw.endPoint = { x: lineDraw.endPointX, y: lineDraw.endPointY };
      lineDraw.setDrawLine();
      lineDraw.svgContainer.appendChild(lineDraw.line);
    },
    endDraw: function (e) {
      var evt = eventSelector('outEvent', e);

      if (evt.type === 'mouseleave') return;
      lineDraw.svgContainer.style.zIndex = 'auto';

      var clientX = evt.clientX;
      var clientY = evt.clientY;
      lineDraw.svgContainer.setAttribute('class', 'svgContainer');
      var endPointEle = document.elementFromPoint(clientX, clientY);
      var endPointRect = endPointEle.getBoundingClientRect();
      var isAllCompleted = false;

      if (
        endPointEle.tagName === 'svg' ||
        endPointEle.tagName === 'line' ||
        !endPointEle.classList.contains('drawLinePoint') ||
        !(lineDraw.answer === endPointEle.dataset.answer) ||
        endPointEle.classList.contains('complete') ||
        endPointEle === lineDraw.startPointEle
      ) {
        lineDraw.line.parentNode.removeChild(lineDraw.line);
        efSound('./media/wrong.mp3');

        if (
          endPointEle.tagName !== 'svg' &&
          endPointEle.tagName !== 'line' &&
          endPointEle.classList.contains('drawLinePoint') &&
          endPointEle !== lineDraw.startPointEle
        ) {
          // showPopup(false);
        }
      } else {
        lineDraw.endPoint = {
          x:
            (endPointRect.left - lineDraw.svgContRect.left) /
              gameManager.zoomRate +
            endPointEle.clientWidth / 2,

          y:
            (endPointRect.top - lineDraw.svgContRect.top) /
              gameManager.zoomRate +
            endPointEle.clientHeight / 2,
        };
        lineDraw.setDrawLine();
        endPointEle.classList.add('complete');
        lineDraw.startPointEle.classList.add('complete');
        efSound('./media/correct.mp3');
        // showPopup(true);

        for (var i = 0; i < lineDraw.allPoints.length; i++) {
          if (!lineDraw.allPoints[i].classList.contains('complete')) {
            isAllCompleted = false;
            break;
          } else {
            isAllCompleted = true;
          }
        }
        if (isAllCompleted) {
          lineDraw.container.parentElement
            .querySelector('.dapCheckBtn')
            .classList.add('daps');
        }
      }

      window.removeEventListener(
        gameManager.eventSelector.moveEvent,
        lineDraw.moveDraw,
        { passive: true }
      );
      window.removeEventListener(
        gameManager.eventSelector.upEvent,
        lineDraw.endDraw,
        { passive: true }
      );
      window.removeEventListener(
        gameManager.eventSelector.outEvent,
        lineDraw.endDraw,
        { passive: true }
      );
    },
    showAnswer: function () {
      var leftContainer = lineDraw.container.querySelector('.leftContainer');
      var leftDots = leftContainer.querySelectorAll('.lineDot');
      var leftDotLen = leftDots.length;
      var leftDot = null;
      var answerLines = lineDraw.container.querySelectorAll('line.answer');
      var answerLineLen = answerLines.length;

      var createAnswerLine = function () {
        var line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        var leftDotRect = leftDot.getBoundingClientRect();
        var rightDotRect = lineDraw.container
          .querySelector(
            '.rightContainer .lineDot[data-answer="' +
              leftDot.dataset.answer +
              '"]'
          )
          .getBoundingClientRect();

        line.setAttribute('class', 'answer');
        line.setAttribute(
          'x1',
          (leftDotRect.left - lineDraw.svgContRect.left) /
            gameManager.zoomRate +
            leftDot.clientWidth / 2
        );
        line.setAttribute(
          'y1',
          (leftDotRect.top - lineDraw.svgContRect.top) / gameManager.zoomRate +
            leftDot.clientHeight / 2
        );
        line.setAttribute(
          'x2',
          (rightDotRect.left - lineDraw.svgContRect.left) /
            gameManager.zoomRate +
            leftDot.clientWidth / 2
        );
        line.setAttribute(
          'y2',
          (rightDotRect.top - lineDraw.svgContRect.top) / gameManager.zoomRate +
            leftDot.clientHeight / 2
        );

        lineDraw.svgContainer.appendChild(line);
      };

      lineDraw.svgContRect = lineDraw.svgContainer.getBoundingClientRect();

      if (this.classList.contains('daps')) {
        lineDraw.hideAnswer(this);
      } else {
        if (!lineDraw.isCreateAnswer) {
          for (var i = 0; i < leftDotLen; i++) {
            leftDot = leftDots[i];
            createAnswerLine();
          }
          lineDraw.isCreateAnswer = true;
        } else {
          for (var i = 0; i < answerLineLen; i++) {
            answerLines[i].style.display = 'block';
          }
        }

        this.classList.add('daps');
        for (var i = 0; i < lineDraw.allPoints.length; i++) {
          lineDraw.allPoints[i].classList.add('complete');
        }
      }
    },
    hideAnswer: function (btn) {
      btn.classList.remove('daps');
      lineDraw.resetAll();
    },
    resetAll: function () {
      // console.log('lineDraw resetAll::::::');
      var allLines = QSAll('line');
      var lineLen = allLines.length;
      var line = null;
      var i = 0;

      for (i = 0; i < lineLen; i++) {
        line = allLines[i];
        if (line.className.baseVal.indexOf('answer') !== -1) {
          line.style.display = 'none';
        } else {
          line.parentNode.removeChild(line);
        }
      }
      for (i = 0; i < lineDraw.allPoints.length; i++) {
        lineDraw.allPoints[i].classList.remove('complete');
      }
    },
  };
}

function initSpeedQuiz() {
  var qzIntro = document.getElementById('qzIntro'),
    qzQue = qzIntro.querySelector('#qzQue'),
    qzTime = qzIntro.querySelector('#qzTime'),
    btnSettings = qzIntro.querySelectorAll('button'),
    qzCont = document.getElementById('qzContentWrap'),
    quizList = qzCont.querySelectorAll('.quiz'),
    quizTabWrap = document.getElementById('qzTab'),
    quizTabs = quizTabWrap.querySelectorAll('em'),
    btnAns = QS('.qzBtnSuss'),
    btnPass = QS('.qzBtnOut'),
    btnAgain = null,
    result = document.getElementById('result'),
    step = 0,
    answerCnt = 0,
    timer = null,
    sprite = null,
    init = function () {
      efSound('./media/checkSound.mp3');
      reset();
      qzIntro.classList.remove('hide');
      sprite = new Sprite({
        name: 'speedquiz',
        target: document.getElementById('successSpriteAniBox'),
        efSound: 'clap',
        repeatCnt: 2,
      });
      sprite.init();
    },
    bindEfSound = function () {
      document.addEventListener('mousedown', function (e) {
        var target = e.target;
        var hasEfArr = ['introStartBtn'];

        if (
          (target.tagName == 'BUTTON' ||
            target.parentElement.tagName == 'BUTTON' ||
            hasEfArr.indexOf(target.className) !== -1) &&
          !target.classList.contains('popBtn')
        ) {
          efSound('./media/tab_click.mp3');
        }
      });
    },
    startQuiz = function () {
      var qtype = '';
      if (!qzQue.dataset.val) {
        qzQue.dataset.val = qzQue.querySelector('.sel').value;
      }
      qtype = 'quizType' + qzQue.dataset.val.toUpperCase();
      if (!qzTime.dataset.val) {
        qzTime.dataset.val = qzTime.querySelector('.sel').value;
      }
      qzIntro.classList.add('hide');
      timer.start(qzTime.dataset.val * 60000);
      qzCont.querySelector('.' + qtype).classList.remove('hide');
      qzCont.querySelector('.' + qtype + ' .quiz').classList.remove('hide');
    },
    setConfig = function () {
      var val = this.value;
      this.parentElement.dataset.val = val;
      for (var i = 0; i < this.parentElement.children.length; i++) {
        this.parentElement.children[i].classList.remove('sel');
      }
      this.classList.add('sel');
    },
    checkAnswer = function () {
      if (this.classList.contains('qzBtnAgain')) {
        init();
      } else {
        answerCnt++;
        moveNextStep();
      }
    },
    passQuiz = function () {
      quizTabs[step].classList.remove('ans');
      quizTabs[step].classList.add('pass');
      moveNextStep();
    },
    moveNextStep = function () {
      var curQuiz = qzCont.querySelector('.quiz:not(.hide)');
      var nextQuiz = curQuiz.nextElementSibling;

      step++;

      if (step === 5) {
        timer.stop();
        btnPass.classList.add('hide');
        btnAns.className = btnAns.className.replace('qzBtnSuss', 'qzBtnAgain');
        btnAgain = QS('.qzBtnAgain');
        btnAgain.firstElementChild.textContent = '다시하기';
        result.querySelector('.length').textContent = answerCnt;
        result.parentElement.classList.add('show');
        sprite.start();
      } else {
        curQuiz.classList.add('hide');
        quizTabs[step].classList.add('ans');
        nextQuiz.classList.remove('hide');
      }
    },
    reset = function () {
      var quizTab = null;
      step = 0;
      answerCnt = 0;
      timer && timer.stop();
      qzCont.querySelector('.quizTypeA').classList.add('hide');
      qzCont.querySelector('.quizTypeB').classList.add('hide');

      for (var i = 0; i < quizList.length; i++) {
        quizList[i].classList.add('hide');
      }
      for (i = 0; i < quizTabs.length; i++) {
        quizTab = quizTabs[i];
        quizTab.classList.remove('pass');
        if (i === 0) {
          quizTab.classList.add('ans');
        } else {
          quizTab.classList.remove('ans');
        }
      }

      btnAns.classList.remove('hide');
      btnPass.classList.remove('hide');
      if (btnAgain) {
        btnAgain.classList.remove('qzBtnAgain');
        btnAgain.classList.add('qzBtnSuss');
        btnAgain.firstElementChild.textContent = '정답';
      }
    };

  init();
  bindEfSound();
  timer = new Timer();
  timer.init();

  qzIntro.querySelector('.introStartBtn').addEventListener('click', startQuiz);
  for (var i = 0; i < btnSettings.length; i++) {
    btnSettings[i].addEventListener('click', setConfig);
  }
  btnAns.addEventListener('click', checkAnswer);
  btnPass.addEventListener('click', passQuiz);
  result
    .querySelector('.popup_closeBtn')
    .addEventListener('click', function () {
      result.parentElement.classList.remove('show');
    });
}

function Sprite(opt) {
  return {
    target: opt.target,
    pos: { x: 0, y: 0 },
    leftSpacing: 0,
    topSpacing: 0,
    row: 0,
    col: 0,
    imgWidth: 0,
    imgHeight: 0,
    spriteAni: null,
    delay: opt.delay ? opt.delay : 40,
    lastLen: 5,
    efSound: opt.efSound,
    repeatCnt: 0,
    init: function () {
      this.reset();

      if (opt.name === 'stamp') {
        this.leftSpacing = 370;
        this.topSpacing = 370;
        this.row = 1;
        this.col = 20;
        this.imgWidth = 7770;
        this.imgHeight = 740;
      } else if (opt.name === 'speedquiz') {
        this.leftSpacing = 300;
        this.topSpacing = 260;
        this.row = 1;
        this.col = 20;
        this.imgWidth = 6300;
        this.imgHeight = 520;
        this.lastLen = 9;
      }
    },
    start: function () {
      var sprite = this;
      var idx = 0;

      if (sprite.target.classList.contains('animated')) {
        return;
      }

      sprite.target.classList.add('active');
      sprite.target.classList.add('animated');

      sprite.spriteAni = setInterval(function () {
        // console.log('sprite interavl:::::::::', idx);
        if (idx < sprite.row * sprite.col + sprite.lastLen) {
          if (sprite.pos.x >= sprite.leftSpacing * sprite.col) {
            sprite.pos.x = 0;
            sprite.pos.y += sprite.topSpacing;
          } else {
            sprite.pos.x += sprite.leftSpacing;
          }
          idx++;
        } else {
          if (sprite.repeatCnt < opt.repeatCnt) {
            idx = 0;
            sprite.pos.x = 0;
            sprite.pos.y = 0;
            sprite.repeatCnt++;
          } else {
            clearInterval(sprite.spriteAni);
          }
        }

        sprite.target.style.backgroundPositionX = -sprite.pos.x + 'px';
        sprite.target.style.backgroundPositionY = -sprite.pos.y + 'px';
      }, sprite.delay);

      if (sprite.efSound) {
        efSound('./media/' + sprite.efSound + '.mp3');
      }
    },
    reset: function () {
      this.target.classList.remove('active');
      this.target.classList.remove('animated');
    },
  };
}

function initStamp() {
  var characters = QSAll('.characterImg');

  for (var i = 0; i < characters.length; i++) {
    var charWrap = characters[i].parentElement;
    var stamp = charWrap.lastElementChild;
    var sprite = new Sprite({ name: 'stamp', target: stamp, efSound: 'clap' });
    sprite.init();

    charWrap.addEventListener('click', sprite.start.bind(sprite));
  }
}

function initSpeechBubble() {
  var selectEls = QSAll('.charHover');
  var selectLen = selectEls.length;
  var i = 0;

  var showBubble = function () {
    for (i = 0; i < selectLen; i++) {
      selectEls[i].classList.remove('active');
      selectEls[i].nextElementSibling.style.display = 'none';
    }
    this.classList.add('active');
    this.nextElementSibling.style.display = 'block';
    stopPlayingEfSound();
    efSound(this.dataset.sound);
  };

  var closeBubble = function () {
    var bubble = this.parentElement;
    bubble.style.display = 'none';
    bubble.previousElementSibling.classList.remove('active');
    stopPlayingEfSound();
  };

  for (i = 0; i < selectLen; i++) {
    selectEls[i].addEventListener('click', showBubble);
    selectEls[i].nextElementSibling
      .querySelector('.bubbleClose')
      .addEventListener('click', closeBubble);
  }
}

function resetSpeechBubble() {
  var selectEls = QSAll('.charHover');
  var selectLen = selectEls.length;
  var i = 0;

  for (i = 0; i < selectLen; i++) {
    selectEls[i].classList.remove('active');
    selectEls[i].nextElementSibling.style.display = 'none';
  }
  stopPlayingEfSound();
}

function initPopupPlayer() {
  var btnOpenVPopup = QSAll('.videoPlayBtn, .videoSubPlayBtn');
  var videoPopupLen = btnOpenVPopup.length;
  var openVideoPopup = function () {
    var src = this.dataset.videoLink;
    efSound('./media/click.mp3');
    viewChunjaeMedia(src); // 천재에서 제공하는 영상파일명 800K
  };

  for (var i = 0; i < videoPopupLen; i++) {
    btnOpenVPopup[i].addEventListener(
      gameManager.eventSelector.downEvent,
      openVideoPopup
    );
  }
}

function initPointer() {
  var pointers = QSAll('.clickPointer');
  var pointerLen = pointers.length;
  var i = 0;
  var callback = null;
  var btnShowEx = QS('.exampleLook');
  var showHighlight = function () {
    var highlights = QSAll('.highLightShow');
    var highlightLen = highlights.length;
    var i = 0;
    for (i = 0; i < highlightLen; i++) {
      if (i === +this.getAttribute('num')) {
        highlights[i].classList.remove('hide');
      }
    }
    if (zoomInstance) {
      zoomInstance.resetZoom();
    }
    this.classList.add('hide');
    efSound('./media/click.mp3');
  };
  var showBox = function () {
    this.closest('.colorBox').classList.remove('hide');
    if (!isThere('.colorBox.hide')) {
      btnShowEx.classList.add('shown');
    }
    efSound('./media/click.mp3');
  };
  var toggleAllBox = function () {
    var allBox = QSAll('.colorBox');
    var boxLen = allBox.length;
    var box = null;
    for (i = 0; i < boxLen; i++) {
      box = allBox[i];
      if (!this.classList.contains('shown')) {
        box.classList.remove('hide');
      } else {
        box.classList.add('hide');
      }
    }
    this.classList.toggle('shown');
  };
  var showBubble = function () {
    var bubbles = this.parentElement.querySelectorAll('.bubbleBox');
    var bubbleLen = bubbles.length;

    for (i = 0; i < bubbleLen; i++) {
      bubbles[i].classList.add('show');
    }
    this.classList.add('hide');
    efSound('./media/click.mp3');
  };

  for (i = 0; i < pointerLen; i++) {
    callback = pointers[i].classList.contains('inTitle')
      ? showHighlight
      : pointers[i].previousElementSibling.classList.contains('bubbleBox')
      ? showBubble
      : showBox;
    pointers[i].addEventListener('click', callback);
  }

  if (btnShowEx) {
    btnShowEx.addEventListener('click', toggleAllBox);
  }
}

function initDownload() {
  var btns = QSAll('.btnDownload');
  var btnLen = btns.length;
  var i = 0;

  var downloadDoc = function () {
    var src = this.dataset.url;
    window.open(src);
  };

  for (i = 0; i < btnLen; i++) {
    btns[i].addEventListener('click', downloadDoc);
  }
}

function resetSlider(cont) {
  var innerPages = cont.querySelectorAll('.innerPage');
  var innerPageLen = innerPages.length;
  var sliderCont = cont.querySelector('.sliderContainer');
  var slideNum = getIndex(sliderCont.querySelector('.active'));
  var sliderDotList = sliderCont.querySelectorAll('.sliderDot');
  var activeDot = sliderDotList[slideNum];
  var i = 0;

  if (innerPageLen) {
    innerPages[slideNum].style.display = 'none';
    innerPages[0].style.display = 'block';
    activeDot.classList.remove('active');
    sliderDotList[0].classList.add('active');
    sliderCont.querySelector('.innerPrevBtn').classList.add('off');
    sliderCont.querySelector('.innerNextBtn').classList.remove('off');

    for (i = 0; i < innerPageLen; i++) {
      hideBubble(innerPages[i]);
    }
  }
}

function hideBubble(cont) {
  var bubbles = cont.querySelectorAll('.bubbleBox');
  var bubbleLen = bubbles.length;
  var i = 0;
  for (i = 0; i < bubbleLen; i++) {
    bubbles[i].classList.remove('show');
  }
}

function initSelectArea() {
  var areas = QSAll('.selectArea');
  var areaLen = areas.length;
  var i = 0;

  var showSelectArea = function () {
    var selectAreaIdx = this.dataset.idx;
    var highLightBoxChildren = QSAll('.highLightBox')[selectAreaIdx].children;
    var curTabIdx = QS('.tab.view').getAttribute('num');
    var pointers = QSAll('.clickPointer');
    var i = 0;

    if (selectAreaIdx === curTabIdx) {
      for (i = 0; i < highLightBoxChildren.length; i++) {
        highLightBoxChildren[i].classList.remove('hide');
      }
      pointers[selectAreaIdx].classList.add('hide');
      efSound('./media/click.mp3');
    }
  };

  for (i = 0; i < areaLen; i++) {
    areas[i].addEventListener('click', showSelectArea);
  }
}

//lookBtn 생성
CONTENTS.bnMaker = {
  make: function () {
    lookBtn = QSAll('.popBtn.look');
    for (i = 0; i < lookBtn.length; i++) {
      var firstPiece = createElement('div', lookBtn[i], 'first'),
        looktext = createElement('span', lookBtn[i]),
        lastPiece = createElement('div', lookBtn[i], 'last');
      looktext.innerHTML = lookBtn[i].getAttribute('data-text');
    }
  },
};
runTextBook(function () {
  loadScriptFile('common/js/jquery.js', function () {
    loadScriptFile(
      'common/js/scroll.js',
      function () {
        setTimeout(function () {
          if (QSAll('.scrollOutBox').length) $('.scrollOutBox').scrollbar();
        });
      },
      50
    );

    var soundArr = [
      './media/tab_click.mp3',
      './media/checkSound.mp3',
      './media/wrong.mp3',
      './media/correct.mp3',
      './media/incorrect.mp3',
    ];
    for (var i = 0; i < soundArr.length; i++) {
      var clickSound = document.createElement('audio');
      clickSound.setAttribute('src', soundArr[i]);
      clickSound.setAttribute('preload', 'auto');
    }
    window.addEventListener('load', CONTENTS.start, false);
  });
  CONTENTS.start();
});
