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
window.addEventListener(
  'load',
  function () {
    $prite.add({
      target: QS('#successSpriteAniBox'),
      spriteId: 'success',
      spriteList: [
        {
          name: 'success',
          top: 150,
          left: 0,
          width: 550, //380
          height: 570, //450
          thumbNail:
            './common/images/character/goldenBellquiz_success_thumb.png',
          spriteSheet:
            './common/images/character/goldenBellquiz_success_sprite.png',
          sound: './media/feedback_success.mp3',
          sheetWidth: 7700,
          sheetHeight: 5130,
          endSheet: 3,
          delay: 40,
        },
      ],
    });
    $prite.add({
      target: QS('#failSpriteAniBox'),
      spriteId: 'fail',
      spriteList: [
        {
          name: 'fail',
          top: 150,
          left: 0,
          width: 629, //380
          height: 463, //450
          thumbNail: './common/images/character/goldenBellquiz_Fail_thumb.png',
          spriteSheet:
            './common/images/character/goldenBellquiz_Fail_sprite.png',
          sound: './media/feedback_out.mp3',
          sheetWidth: 8177,
          sheetHeight: 4800,
          endSheet: 8,
          delay: 40,
        },
      ],
    });
  },
  false
);
