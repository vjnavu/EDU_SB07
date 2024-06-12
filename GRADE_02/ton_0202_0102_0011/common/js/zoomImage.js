/********************************************
 *                  zoomImage                *
 ********************************************/

function ZoomImage(container) {
  this.container = container;
  this.maxZoom = container.hasAttribute('maxZoom')
    ? parseInt(container.getAttribute('maxZoom'))
    : 2;
  this.zoomImg = this.container.querySelector('.zoomImgContainer');
  this.zoomImgPosition = {
    top: this.zoomImg.offsetTop,
    left: this.zoomImg.offsetLeft,
  };

  // this.zoomController = document.createElement('div', this.container, 'zoomController');
  // this.zoomMinus = document.createElement('div', this.zoomController, 'zoomMinus');
  // this.zoomBar = document.createElement('div', this.zoomController, 'zoomBar');
  // this.zoomPlus = document.createElement('div', this.zoomController, 'zoomPlus');
  // this.zoomReset = document.createElement('div', this.zoomController, 'zoomReset');
  // this.zoomSpin = document.createElement('div', this.zoomBar, 'zoomSpin');

  this.zoomController = document.createElement("div");
  this.zoomController.className = "zoomController";

  this.zoomMinus = document.createElement("div");
  this.zoomMinus.className = "zoomMinus";
  this.zoomController.appendChild(this.zoomMinus)

  this.zoomBar = document.createElement("div");
  this.zoomBar.className = "zoomBar";
  this.zoomController.appendChild(this.zoomBar)

  this.zoomPlus = document.createElement("div");
  this.zoomPlus.className = "zoomPlus";
  this.zoomController.appendChild(this.zoomPlus)

  this.zoomReset = document.createElement("div");
  this.zoomReset.className = "zoomReset";
  this.zoomController.appendChild(this.zoomReset)

  this.zoomSpin = document.createElement("div");
  this.zoomSpin.className = "zoomSpin";
  this.zoomController.appendChild(this.zoomSpin);

  this.container.appendChild(this.zoomController);

  // this.zoomRate = gameManager.zoomRate;
  this.zoomRate = 1;
  this.zoomSpinLeft = 35;
  this.zoomSpinMaxLeft = 150;
  this.imageZoomRate = 1;

  this.zoomImg.style.position = 'absolute';
  new Drag({
    name: 'mindmap',
    element: this.zoomImg,
    block: { top: 50 },
  });
  new Drag({
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
      delta = e.wheelDelta / 124;
      if (window.opera) delta = -delta;
    } else if (e.detail) delta = -e.detail / 3;

    if (delta < 0) self.minusZoom();
    else self.plusZoom();
  }
}

ZoomImage.prototype.plusZoom = function () {
  this.imageZoomRate =
    this.imageZoomRate > this.maxZoom - 0.1
      ? this.maxZoom
      : this.imageZoomRate + 0.1;
  this.changeSpin();

};
ZoomImage.prototype.minusZoom = function () {
  this.imageZoomRate = this.imageZoomRate < 1.1 ? 1 : this.imageZoomRate - 0.1;
  this.changeSpin();

};
ZoomImage.prototype.resetZoom = function () {
  this.imageZoomRate = 1.0;
  this.changeSpin();
};
ZoomImage.prototype.changeZoomImage = function () {
  this.zoomImg.style.transform = 'scale(' + this.imageZoomRate + ')';
  this.zoomImg.style.MsTransform = 'scale(' + this.imageZoomRate + ')';
  this.zoomImg.style.MozTransform = 'scale(' + this.imageZoomRate + ')';
  this.zoomImg.style.WebkitTransform = 'scale(' + this.imageZoomRate + ')';

  if (this.imageZoomRate === 1) {
    this.resetPosition();
    this.zoomImg.classList.add('pointerOff');
  } else {
    this.zoomImg.classList.remove('pointerOff');
  }
};
ZoomImage.prototype.adjustPosition = function () {
  var top = this.zoomImg.offsetTop,
    left = this.zoomImg.offsetLeft,
    limit = {
      top: (-this.zoomImg.clientHeight / 2) * (this.imageZoomRate - 1),
      left: (-this.zoomImg.clientWidth / 2) * (this.imageZoomRate - 1),
      right: (this.zoomImg.clientWidth / 2) * (this.imageZoomRate - 1),
      bottom: (this.zoomImg.clientHeight / 2) * (this.imageZoomRate - 1),
    };

  if (limit.top && top < limit.top) top = limit.top;
  else if (limit.bottom && top > limit.bottom) top = limit.bottom;
  this.zoomImg.style.top = top + 'px';

  if (limit.left && left < limit.left) left = limit.left;
  else if (limit.right && left > limit.right) left = limit.right;
  this.zoomImg.style.left = left + 'px';
};
ZoomImage.prototype.changeSpin = function (obj) {
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
ZoomImage.prototype.resetPosition = function () {
  this.zoomImg.style.top = this.zoomImgPosition.top + 'px';
  this.zoomImg.style.left = this.zoomImgPosition.left + 'px';
};

// drag
function Drag(args) {
  this.zoomImg = args.element
  this.option = args;

  window.addEventListener('mousedown', this.startDrag.bind(this));
  window.addEventListener('touchstart', this.startDrag.bind(this));

}
Drag.prototype.startDrag = function (e) {
  var target = e.target;

  /*
  if (
    !target.classList.contains('zoom_img') &&
    !target.closest('.highLightBox') &&
    !target.closest('.zoomSpin')
  ) {
    return;
  }
  */

  if (
    (
      !target.classList.contains('zoom_img') &&
      !target.closest('.bgImg') &&
      !target.closest('.zoomSpin')
    ) ||
    this.zoomImg.classList.contains('pointerOff')
  ) {
    return;
  }

  this.imageZoomRate = parseFloat(
    this.zoomImg.style.transform.replace(/[^0-9|^\.]/gi, '')
  );
  var dragObj = this.option.element,
    type = this.option.type ? this.option.type : 'all',
    limit = {
      top:
        this.option.limit && this.option.limit.top
          ? this.option.limit.top
          : this.option.name === 'mindmap'
            ? (-this.zoomImg.clientHeight / 2) * (this.imageZoomRate - 1)
            : null,
      left:
        this.option.limit && this.option.limit.left
          ? this.option.limit.left
          : this.option.name === 'mindmap'
            ? (-this.zoomImg.clientWidth / 2) * (this.imageZoomRate - 1)
            : null,
      right:
        this.option.limit && this.option.limit.right
          ? this.option.limit.right
          : this.option.name === 'mindmap'
            ? (this.zoomImg.clientWidth / 2) * (this.imageZoomRate - 1)
            : null,
      bottom:
        this.option.limit && this.option.limit.bottom
          ? this.option.limit.bottom
          : this.option.name === 'mindmap'
            ? (this.zoomImg.clientHeight / 2) * (this.imageZoomRate - 1)
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
    drag = function (e) {
      // console.log('drag', e);
      var moveX = (e.clientX - startX) / this.zoomRate,
        moveY = (e.clientY - startY) / this.zoomRate,
        top = dragObjPosition.top + moveY,
        left = dragObjPosition.left + moveX;

      // this.zoomRate = gameManager.zoomRate;
      this.zoomRate = 1;

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
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('touchmove', drag);
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
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
  } else endDrag(e);
};
