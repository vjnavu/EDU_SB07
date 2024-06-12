const dataSave = $(document).find('.btnSave').data('save');

$(document).on('click', '.image-container, .check-text', function () {
    efSound('./media/click.mp3');
    const $item = $(this).parents('.item-box');
    const $imageContainer = $item.find('.image-container');
    let idTimeout;
    clearTimeout(idTimeout);
    const $checkText = $(this).hasClass('check-text') ? $(this) : $item.find('.check-text');

    if ($checkText.hasClass('active')) {
        $item.find('.red-check, .image-container .mark').remove();
        $checkText.removeClass('active');
    } else {
        $checkText.addClass('active');
        if (!$(this).hasClass('check-text')) {
            $item.find('.check-box').append(`<p class='red-check'></p>`);
        }
        $imageContainer.append(`<div class='mark'></div>`);
        idTimeout = setTimeout(() => {
            $('.mark').addClass('active');
        }, 400);
    }
});


$(document).on('click', '.popCloseBtn', function () {
    $('.sliderContainer').remove();
    $('.textArea').hide();
    $('.popupContents:nth-child(3)').show();
    $('.textBox-change > span').removeClass('active');
    $('.textBox-change .write').addClass('active');
});

$(document).on('click', '.textBox-change', function () {
    efSound('./media/click.mp3');

    const $write = $(this).find('.write');
    const $view = $(this).find('.view');
    const $popupContents = $(this).parent();

    $write.toggleClass('active');
    $view.toggleClass('active');

    if (!$write.hasClass('active')) {
        $popupContents.find('.sliderContainer, .popupContents').hide();
        $popupContents.find('.textArea').show();
    } else {
        $('.textArea').hide();
        $('.popupContents:nth-child(3)').show();
        $popupContents.find('.sliderContainer').css('display', 'flex');
        $('.sliderDot').removeClass('active');
        $('.innerBtn').removeClass('off');
        $('.sliderDot[wrapnum="1"]').addClass('active');
        $('.innerPrevBtn').addClass('off')
    }
});

// FOR LEARNING MAP
let storedData = JSON.parse(localStorage.getItem('storage_input_' + dataSave)) || [];

$(document).on('click', '.popLearning', function () {
    efSound('./media/click.mp3');
    $(this).find('.learning-input').focus();
})

$(document).on('click', '.popBtn[data-pop="1"]', function () {
    if (storedData) {
        storedData.forEach(data => {
            $('.popbox[data-pop="1"] .popLearning[data-no="' + data.idx + '"]').addClass('active');
            $('.popbox[data-pop="1"] .popLearning[data-no="' + data.idx + '"]').find('.learning-input').val(data.input);
        });
    }
})

$(document).on('click', '.popbox[data-pop="1"] .btnSave', function () {
    $('.popbox[data-pop="1"] .popLearning').each(function () {
        let idxInput = $(this).data('no');
        let inputText = $(this).find('.learning-input').val();
        const learningLocation = {
            idx: idxInput,
            input: inputText,
        };

        storedData = storedData.filter(data => data.idx !== idxInput);
        storedData.push(learningLocation);
    })

    efSound('./media/click.mp3');
    localStorage.setItem('storage_input_' + dataSave, JSON.stringify(storedData));
    alert('저장되었습니다. 저장한 우리 반 배움 지도는 매 차시 ‘이번 시간 안내‘에서 확인하실 수 있습니다.');
});