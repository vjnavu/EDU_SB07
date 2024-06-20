// get star element
var dataSave = $(document).find('.btnSave').data('save');
let storedData = JSON.parse(localStorage.getItem('chunjaeInteCurriStarLocations-' + dataSave)) || [];
let $slides = $('.starContainer li.on .starContents li')
let totalSlides = $slides.length;
reLoad();

let clickedPopbtn;
const $navItem = $('.navItem');
// hover nav item

$navItem.on('mouseenter', function () {
    $(this).removeClass('off');
}).on('mouseleave', function () {
    if (!$(this).hasClass('active')) {
        $(this).addClass('off')
    }
});

// click active nav item and content inside
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

function resetSlide() {
    $slides = $('.starContainer li.on .starContents li');
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
    const $starContainerItems = $('.starContainer > li');
    $starContainerItems.removeClass('on');
    $starContainerItems.eq(index).addClass('on');
}

$(document).on('click', '.starContents > li', function () {
    efSound('./media/click.mp3');
    let tabIdx = $(this).closest('.starContainer > li.on').index();
    let starIdx = $(this).index();

    const starLocation = {
        tab: tabIdx,
        star: starIdx,
        popBtn: clickedPopbtn
    }

    storedData = storedData.filter(data => data.popBtn !== clickedPopbtn);

    storedData.push(starLocation);

    $('.popBtn[data-popBtn="' + clickedPopbtn + '"]').html($(this).html());
    $(this).parents('.popbox.star').css('display', 'none');

    reLoad();
});

$(document).on('click', '.btnSave', function () {
    efSound('./media/click.mp3');
    localStorage.setItem('chunjaeInteCurriStarLocations-' + dataSave, JSON.stringify(storedData));
    alert('저장되었습니다. 저장한 우리 반 배움 지도는 매 차시 ‘이번 시간 안내‘에서 확인하실 수 있습니다.');
});

// popstar
$(document).on('click', '.popStar', function () {
    clickedPopbtn = $(this).attr('data-popBtn');
    $('.navItem').removeClass('active').addClass('off');
    $('.navItem:first-child').removeClass('off').addClass('active');
    $('.starContainer>li').removeClass('on');
    $('.starContainer>li:first-child').addClass('on');
    resetSlide();
});

function reLoad() {
    $('.starContents li').removeClass('off');
    storedData.forEach(data => {
        let star = $(`.starContainer>li:nth-child(${data.tab + 1}) .starContents>li:nth-child(${data.star + 1})`);
        star.addClass('off');
        $('.popBtn[data-popBtn="' + data.popBtn + '"]').html(star.html());
        if (star.is("[data-line")) {
            $('.popBtn[data-popBtn="' + data.popBtn + '"]').attr("data-line", Number(star.data("line")));
        }
        if (star.is("[data-color")) {
            $('.popBtn[data-popBtn="' + data.popBtn + '"]').attr("data-color", star.data("color"));
        }
        $('.popBtn[data-popBtn="' + data.popBtn + '"]').addClass('complete');
    });
}

let currentIndex = 0;
let slidesToShow = 4; // number of slides to show at a time

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