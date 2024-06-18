/*
	create date : 2016-05-19
	creator : saltgamer
*/
'use strict';

var FORTEACHERCD = FORTEACHERCD || {};

FORTEACHERCD.responsive = (function () {
  var responsive = {
    baseContainerSize: {
      width: 1170,
      height: 768,
    },
    currentContainerSize: {
      containerWidth:
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth,
      containerHeight:
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
    },
    setScaleElement: function (targetElement) {
      var frameContainer = document.querySelector('#frameContainer'),
        zoomVertical =
          this.currentContainerSize.containerHeight /
          targetElement.clientHeight,
        zoomHorizontal =
          this.currentContainerSize.containerWidth / targetElement.clientWidth;

      var zoomVerticalBg =
        (this.currentContainerSize.containerHeight /
          frameContainer.clientHeight) *
        1.0;
      var zoomHorizontalBg =
        (this.currentContainerSize.containerWidth /
          frameContainer.clientWidth) *
        1.0;

      if (
        targetElement.clientWidth * zoomVertical >
        this.currentContainerSize.containerWidth
      ) {
        this.setTransformCSS(targetElement, zoomHorizontal);
        this.setTransformCSS(frameContainer, zoomHorizontalBg);
      } else {
        this.setTransformCSS(targetElement, zoomVertical);
        targetElement.style.left =
          (this.currentContainerSize.containerWidth -
            targetElement.clientWidth * zoomVertical) /
            2 +
          'px';

        this.setTransformCSS(frameContainer, zoomVerticalBg);
        frameContainer.style.left =
          (this.currentContainerSize.containerWidth -
            frameContainer.clientWidth * zoomVerticalBg) /
            2 +
          'px';
      }
    },
    setTransformCSS: function (targetElement, zoomRate) {
      gameManager.zoomRate = zoomRate;
      targetElement.setAttribute(
        'style',
        '-ms-transform: scale(' +
          zoomRate +
          ',' +
          zoomRate +
          ');' +
          '-webkit-transform: scale(' +
          zoomRate +
          ',' +
          zoomRate +
          ');' +
          'transform: scale(' +
          zoomRate +
          ',' +
          zoomRate +
          ');' +
          'transform-origin: 0% 0%; -webkit-transform-origin: 0% 0%; -ms-transform-origin: 0% 0%;'
      );
      gameManager.zoomRate = zoomRate;
    },
  };
  return responsive;
})();
