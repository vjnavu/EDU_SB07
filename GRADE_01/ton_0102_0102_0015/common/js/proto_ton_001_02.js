var dataSave = $(document).find('.btnSave').data('save');

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

// let learningMapArr = [];

let clickedPopbtn;
const $navItem = $('.navItem');
let currentIndex = 0;
let slidesToShow = 4; // number of slides to show at a time

let storedData = JSON.parse(localStorage.getItem('storage_village_' + dataSave)) || [];
let $slides = $('.learning-list li.on .learning-item li')
let totalSlides = $slides.length;
reLoad();

$(document).on('click', '.check-box', function () {
    efSound('./media/click.mp3');
    if ($(this).hasClass('checked')) {
        $(this).removeClass('checked');
    } else {
        $(this).addClass('checked');
    }
})
$(document).on('click', '.popBtn[data-pop="1"]', function () {
    // let learningMapArrLC = JSON.parse(localStorage.getItem('storage_village_' + dataSave));
    if (storedData) {
        storedData.forEach(data => {
            $('.popbox[data-pop="1"] .check-box[data-check="' + data + '"]').addClass('checked');
        });
    }

})
$(document).on('click', '.popbox[data-pop="1"] .btnSave', function () {
    efSound('./media/click.mp3');
    $('.popbox[data-pop="1"] .check-box').each(function () {
        if ($(this).hasClass('checked')) {
            storedData.push($(this).data('check'));
        }
    })
    localStorage.setItem('storage_village_' + dataSave, JSON.stringify(storedData));
    setTimeout(() => {
        alert('저장되었습니다. 저장한 우리 반 배움 지도는 매 차시 ‘이번 시간 안내‘에서 확인하실 수 있습니다.');
    }, 200);

})



// popLearning - popBtn on Main Screen
$(document).on('click', '.popLearning', function () {
    clickedPopbtn = $(this).attr('data-popBtn');
    $('.navItem').removeClass('active').addClass('off');
    $('.navItem:first-child').removeClass('off').addClass('active');
    $('.learning-list>li').removeClass('on');
    $('.learning-list>li:first-child').addClass('on');
    resetSlide();
});

// Mini popbox > item > li
$(document).on('click', '.learning-item > li', function () {
    efSound('./media/click.mp3');
    let tabIdx = $(this).closest('.learning-list > li.on').index();
    let liIndx = $(this).index();
    let className = $(this).attr('class');

    const starLocation = {
        tab: tabIdx,
        li: liIndx,
        popBtn: clickedPopbtn,
        class: className
    }

    storedData = storedData.filter(data => data.popBtn !== clickedPopbtn);

    storedData.push(starLocation);

    $('.popBtn[data-popBtn="' + clickedPopbtn + '"]').html($(this).html());
    $('.popBtn[data-popBtn="' + clickedPopbtn + '"]').attr('data-color', $(this).attr('data-color'));
    $('.popBtn[data-popBtn="' + clickedPopbtn + '"]').addClass(className);

    $(this).parents('.popbox.mini').css('display', 'none');
    reLoad();
});

$(document).on('click', '#contents .btnSave', function () {
    efSound('./media/click.mp3');
    localStorage.setItem('storage_village_' + dataSave, JSON.stringify(storedData));
    alert('저장되었습니다. 저장한 우리 반 배움 지도는 매 차시 ‘이번 시간 안내‘에서 확인하실 수 있습니다.');
});


// navItem: 주제 - 놀이 - 안전 - 함께 Tab
$navItem.on('mouseenter', function () {
    $(this).removeClass('off');
}).on('mouseleave', function () {
    if (!$(this).hasClass('active')) {
        $(this).addClass('off')
    }
});

$(document).on('click', '.navItem', function () {
    efSound('./media/click.mp3');
    const idx = $(this).index();
    $navItem.addClass('off');
    $navItem.removeClass('active');
    $(this).addClass('active');
    $(this).removeClass('off');
    updateSlideTab(idx);
    resetSlide();
});


// Reset Popmini > learning-item to first page
function resetSlide() {
    $slides = $('.learning-list li.on .learning-item li');
    totalSlides = $slides.length;
    currentIndex = 0;
    $('.slideBtn.prev').addClass('off');
    if (totalSlides > 4) {
        $('.slideBtn.next').removeClass('off');
    } else {
        $('.slideBtn.next').addClass('off');
    }
    updateSlider();
}

function updateSlideTab(index) {
    const $learningList = $('.learning-list > li');
    $learningList.removeClass('on');
    $learningList.eq(index).addClass('on');
}



function reLoad() {
    $('.learning-item li').removeClass('off');
    if (storedData.length > 0) {
        storedData.forEach(data => {
            let tabIdx = data.tab + 1;
            let liIndx = data.li + 1;
            let popBtn = data.popBtn;
            let className = data.class;
            $('.learning-list>li:nth-child(' + tabIdx + ') .learning-item>li:nth-child(' + liIndx + ')').addClass('off');

            let html = $('.learning-list>li:nth-child(' + tabIdx + ') .learning-item>li:nth-child(' + liIndx + ')').html();
            let dataColor = $('.learning-list>li:nth-child(' + tabIdx + ') .learning-item>li:nth-child(' + liIndx + ')').attr('data-color');
            $('.popBtn[data-popBtn="' + popBtn + '"]').html(html);
            $('.popBtn[data-popBtn="' + popBtn + '"]').attr('data-color', dataColor);
            $('.popBtn[data-popBtn="' + popBtn + '"]').addClass(className);
        });
    }
}


// next button click event
$('.slideBtn.next').on('click', function () {
    efSound('./media/click.mp3');
    if (currentIndex < totalSlides - slidesToShow) {
        currentIndex += slidesToShow;
        updateSlider();
    }
});

// Previous button click event
$('.slideBtn.prev').on('click', function () {
    efSound('./media/click.mp3');
    if (currentIndex >= slidesToShow) {
        currentIndex -= slidesToShow;
        updateSlider();
    }
});

// Function to update the slider
function updateSlider() {
    $slides.hide();
    $slides.slice(currentIndex, currentIndex + slidesToShow).show();

    // Toggle off class for previous button
    if (currentIndex === 0) {
        $('.slideBtn.prev').addClass('off');
    } else {
        $('.slideBtn.prev').removeClass('off');
    }

    // Toggle off class for next button
    if (currentIndex >= totalSlides - slidesToShow) {
        $('.slideBtn.next').addClass('off');
    } else {
        $('.slideBtn.next').removeClass('off');
    }
}