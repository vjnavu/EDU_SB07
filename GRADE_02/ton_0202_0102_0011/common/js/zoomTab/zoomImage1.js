/********************************************
 *                  zoomImage                *
 ********************************************/

function ZoomImage_1(tabNum) {
  this.container = QS('.page_' + tabNum).querySelector('.zoomContainer_1')
  this.maxZoom = this.container.hasAttribute('maxZoom')
    ? parseInt(container.getAttribute('maxZoom'))
    : 2;
  this.zoomImg_1 = this.container.querySelector('.zoomImgContainer_1');
  this.zoomImgPosition = {
    top: this.zoomImg_1.offsetTop,
    left: this.zoomImg_1.offsetLeft,
  };
  this.zoomController = createElement('div', this.container, 'zoomController_1');
  this.zoomMinus = createElement('div', this.zoomController, 'zoomMinus');
  this.zoomBar = createElement('div', this.zoomController, 'zoomBar');
  this.zoomPlus = createElement('div', this.zoomController, 'zoomPlus');
  this.zoomReset = createElement('div', this.zoomController, 'zoomReset');
  this.zoomSpin = createElement('div', this.zoomBar, 'zoomSpin');
  this.zoomRate = gameManager.zoomRate;
  this.zoomSpinLeft = 9;
  this.zoomSpinMaxLeft = 118 + this.zoomSpinLeft;
  this.imageZoomRate = 1;

  this.zoomImg_1.style.position = 'absolute';
  new Drag({
    tabNumm: tabNum,
    name: 'mindmap',
    element: this.zoomImg_1,
    block: { top: 50 },
  });
  new Drag({
    tabNumm: tabNum,
    element: this.zoomSpin,
    type: 'horizon',
    limit: {
      left: this.zoomSpinLeft,
      right: this.zoomSpinMaxLeft,
    },
    callBack: this.changeSpin.bind(this),
  });

  this.zoomPlus.addEventListener('click', this.plusZoom.bind(this));
  this.zoomMinus.addEventListener('click', this.minusZoom.bind(this));
  this.zoomReset.addEventListener('click', this.resetZoom.bind(this));

  if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel);
  window.onmousewheel = document.onmousewheel = wheel;

  var self = this;

  function wheel(e) {
    var delta;
    if (e.wheelDelta) {
      delta = event.wheelDelta / 124;
      if (window.opera) delta = -delta;
    } else if (e.detail) delta = -event.detail / 3;

    if (delta < 0) 
    {
      self.minusZoom();
    }
    else {
      self.plusZoom();
    }
  }
}

ZoomImage_1.prototype.plusZoom = function () {
  this.imageZoomRate =
    this.imageZoomRate > this.maxZoom - 0.1
      ? this.maxZoom
      : this.imageZoomRate + 0.1;
  this.changeSpin();
};
ZoomImage_1.prototype.minusZoom = function () {  
  this.imageZoomRate = this.imageZoomRate < 1.1 ? 1 : this.imageZoomRate - 0.1;
  this.changeSpin();
};
ZoomImage_1.prototype.resetZoom = function () {
  this.imageZoomRate = 1.0;
  this.changeSpin();
};
ZoomImage_1.prototype.changeZoomImage = function () {
  this.zoomImg_1.style.transform = 'scale(' + this.imageZoomRate + ')';
  this.zoomImg_1.style.MsTransform = 'scale(' + this.imageZoomRate + ')';
  this.zoomImg_1.style.MozTransform = 'scale(' + this.imageZoomRate + ')';
  this.zoomImg_1.style.WebkitTransform = 'scale(' + this.imageZoomRate + ')';

  if (this.imageZoomRate === 1) {
    this.resetPosition();
    this.zoomImg_1.classList.add('pointerOff');
  } else {
    this.zoomImg_1.classList.remove('pointerOff');
  }
};
ZoomImage_1.prototype.adjustPosition = function () {
  var top = this.zoomImg_1.offsetTop,
    left = this.zoomImg_1.offsetLeft,
    limit = {
      top: (-this.zoomImg_1.clientHeight / 2) * (this.imageZoomRate - 1),
      left: (-this.zoomImg_1.clientWidth / 2) * (this.imageZoomRate - 1),
      right: (this.zoomImg_1.clientWidth / 2) * (this.imageZoomRate - 1),
      bottom: (this.zoomImg_1.clientHeight / 2) * (this.imageZoomRate - 1),
    };

  if (limit.top && top < limit.top) top = limit.top;
  else if (limit.bottom && top > limit.bottom) top = limit.bottom;
  this.zoomImg_1.style.top = top + 'px';

  if (limit.left && left < limit.left) left = limit.left;
  else if (limit.right && left > limit.right) left = limit.right;
  this.zoomImg_1.style.left = left + 'px';
};
ZoomImage_1.prototype.changeSpin = function (obj) {
  if (obj !== undefined) {
    this.imageZoomRate =
      (obj.offsetLeft - this.zoomSpinLeft) / this.zoomSpinMaxLeft + 1;

    if (this.imageZoomRate > 2) {
      this.imageZoomRate = 2;
    } else if (this.imageZoomRate < 1) {
      this.imageZoomRate = 1;
    }
  }

  var changeLeft =
    this.zoomSpinLeft +
    (this.zoomSpinMaxLeft / (this.maxZoom - 1)) * (this.imageZoomRate - 1);

  this.zoomSpin.style.left =
    this.zoomSpinMaxLeft <= changeLeft
      ? this.zoomSpinMaxLeft + 'px'
      : changeLeft + 'px';

  this.changeZoomImage();
  this.adjustPosition();
};
ZoomImage_1.prototype.resetPosition = function () {
  this.zoomImg_1.style.top = this.zoomImgPosition.top + 'px';
  this.zoomImg_1.style.left = this.zoomImgPosition.left + 'px';
};

// drag
function Drag(args) {
  this.zoomImg_1 = QS('.page_' + args.tabNumm + ' .zoomImgContainer_1');
  this.option = args;

  window.addEventListener('mousedown', this.startDrag.bind(this));
  window.addEventListener('touchstart', this.startDrag.bind(this));
}
Drag.prototype.startDrag = function (e) {
  // console.log('startDrag', e.target);
  var target = e.target;
  if (
    !target.classList.contains('zoom_img') &&
    !target.closest('.highLightBox') &&
    !target.closest('.zoomSpin')
  ) {
    return;
  }
  this.imageZoomRate = parseFloat(
    this.zoomImg_1.style.transform.replace(/[^0-9|^\.]/gi, '')
  );
  var dragObj = this.option.element,
    type = this.option.type ? this.option.type : 'all',
    limit = {
      top:
        this.option.limit && this.option.limit.top
          ? this.option.limit.top
          : this.option.name === 'mindmap'
          ? (-this.zoomImg_1.clientHeight / 2) * (this.imageZoomRate - 1)
          : null,
      left:
        this.option.limit && this.option.limit.left
          ? this.option.limit.left
          : this.option.name === 'mindmap'
          ? (-this.zoomImg_1.clientWidth / 2) * (this.imageZoomRate - 1)
          : null,
      right:
        this.option.limit && this.option.limit.right
          ? this.option.limit.right
          : this.option.name === 'mindmap'
          ? (this.zoomImg_1.clientWidth / 2) * (this.imageZoomRate - 1)
          : null,
      bottom:
        this.option.limit && this.option.limit.bottom
          ? this.option.limit.bottom
          : this.option.name === 'mindmap'
          ? (this.zoomImg_1.clientHeight / 2) * (this.imageZoomRate - 1)
          : null,
    },
    block = { top: 0, left: 0, right: 0, bottom: 0 },
    callBack = this.option.callBack ? this.option.callBack : null,
    dragObjPosition = { top: dragObj.offsetTop, left: dragObj.offsetLeft },
    containerSize = {
      top: dragObj.getBoundingClientRect().top,
      left: dragObj.getBoundingClientRect().left,
      right:
        dragObj.getBoundingClientRect().left +
        dragObj.getBoundingClientRect().width,
      bottom:
        dragObj.getBoundingClientRect().top +
        dragObj.getBoundingClientRect().height,
    },
    startX = e.clientX,
    startY = e.clientY,
    drag_1 = function (e) {
      // console.log('drag', e);
      var moveX = (e.clientX - startX) / this.zoomRate,
        moveY = (e.clientY - startY) / this.zoomRate,
        top = dragObjPosition.top + moveY,
        left = dragObjPosition.left + moveX;

      this.zoomRate = gameManager.zoomRate;


      if (type !== 'horizon') {
        if (limit.top && top < limit.top) top = limit.top;
        else if (limit.bottom && top > limit.bottom) top = limit.bottom;
        dragObj.style.top = top + 'px';
      }
      if (type !== 'vertical') {
        if (limit.left && left < limit.left) left = limit.left;
        else if (limit.right && left > limit.right) left = limit.right;
        dragObj.style.left = left + 'px';
      }

      if (callBack) callBack(dragObj);
    },
    endDrag = function (e) {
      // console.log('endDrag', e);
      window.removeEventListener('mousemove', drag_1);
      window.removeEventListener('touchmove', drag_1);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
    };

  if (e.target.classList.contains('zoomArea')) return;

  if (this.option.block) {
    block = {
      top: this.option.block.top ? this.option.block.top : 0,
      left: this.option.block.left ? this.option.block.left : 0,
      right: this.option.block.right ? this.option.block.right : 0,
      bottom: this.option.block.bottom ? this.option.block.bottom : 0,
    };
  }

  var isOverPosition =
    e.clientX < containerSize.left + block.left ||
    e.clientX > containerSize.right - block.right ||
    e.clientY < containerSize.top + block.top ||
    e.clientY > containerSize.bottom - block.bottom;

  if (!isOverPosition) {
    window.addEventListener('mousemove', drag_1);
    window.addEventListener('touchmove', drag_1);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  } else endDrag(e);
};
