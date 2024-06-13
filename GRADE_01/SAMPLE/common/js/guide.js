function QS(target) {
  return document.querySelector(target);
}
function QSAll(target) {
  return document.querySelectorAll(target);
}

function efSound(src) {
  var efAudio = new Audio();
  var efPlay = function () {
    efAudio.removeEventListener('loadeddata', efPlay);
    efAudio.play();
  };
  efAudio.src = src;
  efAudio.addEventListener('loadeddata', efPlay);
  efAudio.load();
}

if (document.querySelectorAll('.page_zoom').length > 0) {
  zoomInstance = new ZoomImage(
    QS('.page_zoom').querySelector('.zoomContainer')
  );

  $(document).on('click', '.popup_closeBtn', function () {
    zoomInstance.resetZoom();
  })
}