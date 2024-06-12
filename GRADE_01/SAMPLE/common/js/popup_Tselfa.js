'use strict';

function showPopup(isSuccess) {
  $('.alert_popup').css('display', 'block');

  if (isSuccess) {
    $('#successSpriteAniBox').css('display', 'block');
    $('#failSpriteAniBox').css('display', 'none');
    spriteSheetImgList['success'].click();
  } else {
    $('#failSpriteAniBox').css('display', 'block');
    $('#successSpriteAniBox').css('display', 'none');
    spriteSheetImgList['fail'].click();
  }
}
function hidePopup() {
  $('.alert_popup').css('display', 'none');
}
window.addEventListener('load', function () {
  $prite.add({
    target: QS('#successSpriteAniBox'),
    spriteId: 'success',
    spriteList: [
      {
        name: 'success',
        top: 150,
        left: 0,
        width: 444,//380
        height: 400,//450
        thumbNail: './common/images/character/commonConfirm_Good_thumb.png',
        spriteSheet: './common/images/character/commonConfirm_Good.png',
        sound: './media/correct.mp3',
        sheetWidth: 7992,
        sheetHeight: 2000,
        endSheet: 3,
        delay: 40
      }
    ]
  });
  $prite.add({
    target: QS('#failSpriteAniBox'),
    spriteId: 'fail',
    spriteList: [
      {
        name: 'fail',
        top: 150,
        left: 0,
        width: 570,//380
        height: 390,//450
        thumbNail: './common/images/character/commonConfirm_Bad_thumb.png',
        spriteSheet: './common/images/character/commonConfirm_Bad.png',
        sound: './media/incorrect.mp3',
        sheetWidth: 7980,
        sheetHeight: 1950,
        endSheet: 8,
        delay: 40
      }
    ]
  });
}, false);