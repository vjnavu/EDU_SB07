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
  zoomContainers = QS('.popup_pages').querySelectorAll('.zoomContainer');
  zoomContainers.forEach(zoom => {
    zoomInstance = new ZoomImage(zoom);
  });


  $(document).on('click', '.popup_closeBtn', function () {
    if (!$(this).parent().hasClass('min')) {
      zoomInstance.resetZoom();
    }
  })
}
