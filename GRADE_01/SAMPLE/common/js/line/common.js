'use strict';
// loadScriptFile
loadScriptFile('./common/js/responsive.js', function () {
  console.log('□ responsive.js loaded...');
});
loadScriptFile('./common/js/animation.js', function () {
  console.log('□ animation.js loaded...');
});
loadScriptFile('./common/js/polyfill.min.js', function () {
  console.log('□ polyfill.min.js loaded...');
});

// runTextBook
runTextBook(function () {
  FORTEACHERCD.responsive.setScaleElement(
    document.querySelector('#frameContainer')
  );

  window.addEventListener(
    'resize',
    function () {
      FORTEACHERCD.responsive.currentContainerSize.containerWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      FORTEACHERCD.responsive.currentContainerSize.containerHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      FORTEACHERCD.responsive.setScaleElement(
        document.querySelector('#frameContainer')
      );
    },
    false
  );

  if (QS('#contents'))
    setTimeout(function () {
      QS('#contents').style.opacity = 1;
    }, 100);
});

// 오른쪽 마우스 클릭 금지
document.body.oncontextmenu = function () {
  return false;
};

// 위치값
function getRealOffsetTop(o) {
  return o ? o.offsetTop + getRealOffsetTop(o.offsetParent) : 0;
}
function getRealOffsetLeft(o) {
  return o ? o.offsetLeft + getRealOffsetLeft(o.offsetParent) : 0;
}

// ******************************************************************************

var eventCheck =
  'ontouchstart' in window ||
  (window.DocumentTouch && document instanceof DocumentTouch);
// log(eventCheck);

var gameManager = {
  eventSelector: {
    downEvent: eventCheck ? 'touchstart' : 'mousedown',
    moveEvent: eventCheck ? 'touchmove' : 'mousemove',
    upEvent: eventCheck ? 'touchend' : 'mouseup',
    outEvent: eventCheck ? 'touchcancel' : 'mouseleave',
  },
};

var GameManager = {
  event: {
    isTouchDevice:
      'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof DocumentTouch),
    eventSelector: function (eventType) {
      var selectedEvent;
      switch (eventType) {
        case 'eventDown':
          selectedEvent = this.isTouchDevice ? 'touchstart' : 'mousedown';
          break;
        case 'eventMove':
          selectedEvent = this.isTouchDevice ? 'touchmove' : 'mousemove';
          break;
        case 'eventUp':
          selectedEvent = this.isTouchDevice ? 'touchend' : 'mouseup';
          break;
        case 'eventOut':
          selectedEvent = this.isTouchDevice ? 'touchleave' : 'mouseout';
          break;
      }
      return selectedEvent;
    },
  },
};

var audioObj = {};

function eventSelector(eventType, e) {
  var eventMaster;

  if (eventType === 'downEvent') {
    switch (gameManager.eventSelector.downEvent) {
      case 'mousedown':
        eventMaster = e;
        break;
      case 'touchstart':
        e.preventDefault();
        eventMaster = e.touches.item(0);
        break;
    }
  } else if (eventType === 'moveEvent') {
    switch (gameManager.eventSelector.moveEvent) {
      case 'mousemove':
        eventMaster = e;
        break;
      case 'touchmove':
        eventMaster = e.touches.item(0);
        break;
    }
  } else if (eventType === 'upEvent') {
    switch (gameManager.eventSelector.upEvent) {
      case 'mouseup':
        eventMaster = e;
        break;
      case 'touchend':
        eventMaster = e.changedTouches[0];
        break;
    }
  } else if (eventType === 'outEvent') {
    switch (gameManager.eventSelector.outEvent) {
      case 'mouseleave':
        eventMaster = e;
        break;
      case 'touchcancel':
        eventMaster = e.changedTouches[0];
        break;
    }
  }
  return eventMaster;
}

/********** COMMON **********/
function QS(target) {
  return document.querySelector(target);
}
function QSAll(target) {
  return document.querySelectorAll(target);
}
function CE(target) {
  return document.createElement(target);
}
function CESVG(target) {
  return document.createElementNS('http://www.w3.org/2000/svg', target);
}

// createElement & appendChild
function createElement(type, targetElement, className, width, height) {
  var createObject = document.createElement(type);

  if (className !== undefined) createObject.className = className;
  if (width !== undefined) createObject.style.width = width + 'px';
  if (height !== undefined) createObject.style.height = height + 'px';

  targetElement.appendChild(createObject);
  return createObject;
}

// addEventListener
function addEvent(target, eType, fnc) {
  var eventType;
  switch (eType) {
    case 'mousedown':
      eventType = gameManager.eventSelector.downEvent;
      break;
    case 'mousemove':
      eventType = gameManager.eventSelector.moveEvent;
      break;
    case 'mouseup':
      eventType = gameManager.eventSelector.upEvent;
      break;
    case 'mouseout':
      eventType = gameManager.eventSelector.outEvent;
      break;
  }
  return target.addEventListener(eventType, fnc, false);
}

// 기본 : 효과음
function efSound(src) {
  var efAudio = new Audio();
  var efPlay = function () {
    efAudio.removeEventListener('loadeddata', efPlay);
    efAudio.play();
    audioObj.playingObj = efAudio;
  };
  efAudio.src = src;
  efAudio.addEventListener('loadeddata', efPlay);
  efAudio.load();
}

function stopPlayingEfSound() {
  var playingEfSound = audioObj.playingObj;
  // console.log('playingEfSound::: ', playingEfSound);
  if (playingEfSound) {
    playingEfSound.pause();
    playingEfSound.currentTime = 0;
  }
}

function isEmpty(object) {
  if (object === undefined || object === null || object.length === 0) {
    return true;
  } else {
    return false;
  }
}

function isThere(query) {
  var boolean = document.querySelectorAll(query).length === 0 ? false : true;
  return boolean;
}

function getIndex(el) {
  if (!el) return -1;
  var i = 0;
  do {
    i++;
  } while ((el = el.previousElementSibling));
  return i - 1;
}

function getUA() {
  var ua = window.navigator.userAgent;
  var ret = '';
  if (ua.indexOf('Trident') !== -1) {
    ret = 'ie';
  } else {
    ret = 'chrome';
  }
  return ret;
}

// Drag & Drop Start *************************************************************
window.dragDropManager = {
  active: false,
  targetPage: {} || undefined,
  DRAGDROPS: [] || null,
  dragObjs: [] || null,
  dragObjPosition: [] || null,
  dropAreas: null,
  dropIdx: 0,
  ansCount: 0,
  isComplete: function () {
    var boolean = false;
    if (this.ansCount === this.dropAreas.length) {
      boolean = true;
    }
    return boolean;
  },
};

// dragdrop 실행 함수
function DragdropInit() {
  var targetPage;

  // targetPage 설정
  if (isThere('.checkContents') || isThere('.pageContainer')) {
    targetPage = document.querySelector('.page_' + tabIdx);
    if (isThere('.page_' + tabIdx + ' .innerPage')) {
      targetPage = targetPage.querySelectorAll('.innerPage')[innerIdx];
    }
  } else {
    targetPage = document.querySelector('.contents');
    if (isThere('.page_' + tabIdx + ' .innerPage')) {
      targetPage = targetPage.querySelector('.page_' + innerIdx);
    }
  }

  // targetPage에 dragDrop 없을 경우 return
  if (targetPage.querySelector('.dragObj') === null) {
    targetPage = null;
    return;
  }

  resetPosition();
  setDragDropManager(targetPage);

  setTimeout(function () {
    initDapBtn(targetPage);
  }, 300);
}

// dragDropManager 설정
function setDragDropManager(targetPage) {
  if (dragDropManager.DRAGDROPS.length > 0) {
    dragDropManager.DRAGDROPS.forEach(function (el) {
      el.removeEvents();
    });
  }

  (dragDropManager.active = true),
    (dragDropManager.targetPage = targetPage),
    (dragDropManager.DRAGDROPS = [] || null),
    (dragDropManager.dragObjs =
      targetPage.querySelectorAll('.dragObj') || null),
    (dragDropManager.dropAreas =
      targetPage.querySelectorAll('.dropArea') || null),
    (dragDropManager.dropIdx = 0);
  dragDropManager.ansCount = 0;
  dragDropManager.dragObjPosition = [];

  for (var i = 0; i < dragDropManager.dragObjs.length; i++) {
    var dragObj = dragDropManager.dragObjs[i];
    // 초기화
    if (dragObj.classList.contains('dragComplete')) {
      dragObj.classList.remove('dragComplete');
    }

    dragObj.style.cssText = '';

    // 설정
    dragObj.setAttribute('dragIdx', i);
    dragObj.style.pointerEvents = 'auto';
    dragDropManager.dragObjPosition.push([
      dragObj.offsetTop,
      dragObj.offsetLeft,
    ]);

    var DRAGDROP = new Dragdrop(dragObj); // 인스턴스 실행
    dragDropManager.DRAGDROPS.push(DRAGDROP);
  }

  for (var i = 0; i < dragDropManager.dropAreas.length; i++) {
    dragDropManager.dropAreas[i].setAttribute('dropIdx', i);
    if (dragDropManager.dropAreas[i].classList.contains('dropComplete')) {
      dragDropManager.dropAreas[i].classList.remove('dropComplete');
    }
    dragResetAdd();
  }
}

// 위치 초기화(필요한 곳에서 실행하면 됨)
function resetPosition() {
  if (dragDropManager.active === false) return;

  for (var i = 0; i < dragDropManager.dragObjs.length; i++) {
    var dragObj = dragDropManager.dragObjs[i];
    dragObj.style.top = dragDropManager.dragObjPosition[i][0] + 'px';
    dragObj.style.left = dragDropManager.dragObjPosition[i][1] + 'px';
    dragObj.style.pointerEvents = 'auto';

    if (dragObj.classList.contains('dragComplete')) {
      dragObj.classList.remove('dragComplete');
    }
  }

  for (var i = 0; i < dragDropManager.dropAreas.length; i++) {
    if (dragDropManager.dropAreas[i].classList.contains('dropComplete')) {
      dragDropManager.dropAreas[i].classList.remove('dropComplete');
    }
  }
}

// 정답 보여주기(필요한 곳에서 실행하면 됨)
function completeDragDrop() {
  if (dragDropManager.active === false) return;

  for (var i = 0; i < dragDropManager.dragObjs.length; i++) {
    var dragObj = dragDropManager.dragObjs[i],
      dragAnswer = dragDropManager.dragObjs[i].getAttribute('answervalue');

    for (var j = 0; j < dragDropManager.dropAreas.length; j++) {
      var dropArea = dragDropManager.dropAreas[j],
        dropAnswer = dragDropManager.dropAreas[j].getAttribute('answervalue');

      if (dragAnswer == dropAnswer) {
        dragDropManager.dropIdx = parseInt(dropArea.getAttribute('dropIdx'));

        correctPosition(dragObj);
        boundingAdd(dragObj);
      }
    }
  }
}

function Dragdrop(element) {
  var dragdrop = this;
  dragdrop = {
    element: element,
    parentElement: window,
    startDrag: function (e) {
      var eventMaster = eventSelector('downEvent', e);
      dragdrop.offY =
        eventMaster.clientY - dragdrop.element.offsetTop * gameManager.zoomRate;
      dragdrop.offX =
        eventMaster.clientX -
        dragdrop.element.offsetLeft * gameManager.zoomRate;
      this.style.zIndex = 20;

      dragdrop.parentElement.addEventListener(
        gameManager.eventSelector.moveEvent,
        dragdrop.drag,
        true
      );
    },
    drag: function (e) {
      e.preventDefault();
      var eventMaster = eventSelector('moveEvent', e);

      dragdrop.element.style.position = 'absolute';

      dragdrop.newY = eventMaster.clientY - dragdrop.offY;
      dragdrop.newX = eventMaster.clientX - dragdrop.offX;

      dragdrop.element.style.left = dragdrop.newX / gameManager.zoomRate + 'px';
      dragdrop.element.style.top = dragdrop.newY / gameManager.zoomRate + 'px';
    },
    endDrag: function (e) {
      var eventMaster = eventSelector('upEvent', e);
      dragdrop.parentElement.removeEventListener(
        gameManager.eventSelector.moveEvent,
        dragdrop.drag,
        true
      );
      dragdrop.element.addEventListener(
        gameManager.eventSelector.upEvent,
        bounding(this, eventMaster.clientX, eventMaster.clientY),
        false
      );
      this.style.zIndex = 2;
    },
    addEvents: function () {
      this.element.addEventListener(
        gameManager.eventSelector.downEvent,
        this.startDrag,
        false
      );
      this.element.addEventListener(
        gameManager.eventSelector.upEvent,
        this.endDrag,
        false
      );
    },
    removeEvents: function () {
      this.element.removeEventListener(
        gameManager.eventSelector.downEvent,
        this.startDrag,
        false
      );
      this.element.removeEventListener(
        gameManager.eventSelector.upEvent,
        this.endDrag,
        false
      );
    },
  };

  dragdrop.addEvents();
  return dragdrop;
}

function bounding(dragObj, x, y) {
  if (dropCompare(dragObj, x, y)) {
    efSound('./media/correct.mp3');

    // dragObj : 위치 이동
    correctPosition(dragObj);
    boundingAdd(dragObj);

    dragDropManager.ansCount++;
    if (dragDropManager.isComplete()) {
      toggleDapBtn(dragDropManager.targetPage);
      for (var i = 0; i < dragDropManager.dragObjs.length; i++) {
        dragDropManager.dragObjs[i].style.pointerEvents = 'none';
        dragDropManager.ansCount = 0;
      }
    }
  } else {
    incorrectAnimation(dragObj);
    efSound('./media/inCorrect.mp3');
  }
}

function dropCompare(dragObj, x, y) {
  var zoomRate = gameManager.zoomRate;
  var dragObjValue = dragObj.getAttribute('answervalue'),
    dragObjLeft = getRealOffsetLeft(dragObj) * zoomRate,
    dragObjTop = getRealOffsetTop(dragObj) * zoomRate,
    dragObjWidth = dragObj.clientWidth * zoomRate,
    dragObjHeight = dragObj.clientHeight * zoomRate,
    bool = false;

  for (var i = 0; i < dragDropManager.dropAreas.length; i++) {
    var dropArea = dragDropManager.dropAreas[i],
      dropValue = dropArea.getAttribute('answervalue'),
      dropIdx = dropArea.getAttribute('dropIdx'),
      left = getRealOffsetLeft(dropArea) * zoomRate,
      top = getRealOffsetTop(dropArea) * zoomRate,
      dropAreaWidth = dropArea.clientWidth * zoomRate,
      dropAreaHeight = dropArea.clientHeight * zoomRate;

    if (
      ((dragObjLeft > left && dragObjLeft < left + dropAreaWidth) ||
        (dragObjLeft + dragObjWidth > left &&
          dragObjLeft + dragObjWidth < left + dropAreaWidth)) &&
      ((dragObjLeft && dragObjTop > top && dragObjTop < top + dropAreaHeight) ||
        (dragObjTop + dragObjHeight > top &&
          dragObjTop + dragObjHeight < top + dropAreaWidth))
    ) {
      if (dragObjValue == dropValue) {
        dragDropManager.dropIdx = parseInt(dropIdx);
        return true;
      }
    }
  }
  return bool;
}

function correctPosition(dragObj) {
  dragObj.style.top =
    parseInt(dragDropManager.dropAreas[dragDropManager.dropIdx].offsetTop) +
    'px';
  dragObj.style.left =
    parseInt(dragDropManager.dropAreas[dragDropManager.dropIdx].offsetLeft) +
    'px';
  dragObj.style.pointerEvents = 'none';
  dragObj.classList.add('dragComplete');
  dragDropManager.dropAreas[dragDropManager.dropIdx].classList.add(
    'dropComplete'
  );
}

function incorrectAnimation(dragObj) {
  var dragIdx = dragObj.getAttribute('dragIdx'),
    top = dragDropManager.dragObjPosition[dragIdx][0],
    left = dragDropManager.dragObjPosition[dragIdx][1];

  animate({
    delay: 20,
    duration: 800,
    delta: makeEaseOut(elastic),
    step: function (delta) {
      dragObj.style.top = -50 * delta + 50 + top + 'px';
      dragObj.style.left = left + 'px';
    },
  });
}

var boundingAdd = function () {
  console.log('boundingAdd is empty.');
};
var dragResetAdd = function () {
  console.log('dragResetAdd is empty.');
};
// Drag & Drop End *************************************************************

function initDapBtn(targetPage) {
  var dapCheckBtn = targetPage.querySelector('.dapCheckBtn');
  dapCheckBtn.addEventListener(gameManager.eventSelector.upEvent, toggleDapBtn);
}

function toggleDapBtn(targetPage) {
  var dapCheckBtn =
      this !== undefined ? this : targetPage.querySelector('.dapCheckBtn'),
    inAnsCheck = dapCheckBtn.querySelector('.inAnsCheck');
  efSound('./media/click.mp3');
  if (dapCheckBtn.classList.contains('daps')) {
    dapCheckBtn.classList.remove('daps');
    inAnsCheck.innerHTML = '확인';
    hideAllDap();
  } else {
    dapCheckBtn.classList.add('daps');
    inAnsCheck.innerHTML = '가리기';
    showAllDap();
  }
}

function hideAllDap() {
  // 드래그드롭
  if (dragDropManager.active) {
    resetPosition();
    dragResetAdd();
  }
}

function showAllDap() {
  // 드래그드롭
  if (dragDropManager.active) {
    completeDragDrop();
  }
}
