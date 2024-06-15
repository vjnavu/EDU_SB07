const $slideControlItems = $('.slideControl > li');
const $slideContentsItems = $('.slideContents > li');
// const totalItems = $slideControlItems.length;

$(document).on('click', '.slideControl > li, .popText', function () {
    const popBtn = $(this).data('pop');
    const dataContent = $(this).data('content');

    if (dataContent !== undefined) {
        // click on popText
        if (dataContent < 4) {
            updateSlide(dataContent, popBtn);
        } else {
            $('.popbox[data-pop="' + popBtn + '"]').find('.slideControl > li').eq(dataContent - 4).addClass('off');
            $('.popbox[data-pop="' + popBtn + '"] .slideControl > li').each((index) => {
                if (index <= dataContent) {
                    $('.popbox[data-pop="' + popBtn + '"] .slideControl > li:nth-child(' + index + ')').addClass('off');
                }
            })
            updateSlide(dataContent, popBtn);
        }
    } else if (!$(this).hasClass('on')) {
        // click on slideControl
        efSound('./media/click.mp3');
        const idx = $(this).index();
        const popBox = $(this).parents('.popbox').data('pop');
        updateSlide(idx, popBox);
    }
});

$(document).on('click', '.popCloseBtn', function () {
    updateSlide(0);
});

function updateSlide(index, popBtn) {
    const totalItems = $(this).parents('.popbox[data-pop="' + popBtn + '"]').find('.slideControl > li').length;
    $slideControlItems.removeClass('on');

    if (index == 0) {
        $slideControlItems.addClass('off');
    }
    $('.popbox[data-pop="' + popBtn + '"]').find('.slideControl > li').eq(index).addClass('on').removeClass('off');

    $slideContentsItems.removeClass('on');
    $('.popbox[data-pop="' + popBtn + '"]').find('.slideContents > li').eq(index).addClass('on');

    $('.slideBtn').removeClass('off');
    if (index == 0) {
        $('.slideBtn.prev').addClass('off');
    }
    if (index == totalItems - 1) {
        $('.slideBtn.next').addClass('off');
    }

    for (i = 1; i <= 3; i++) {
        $('.popbox[data-pop="' + popBtn + '"]').find('.slideControl > li').eq(index + i).removeClass('off');
    }
}

$(document).on('click', '.slideBtn', function () {
    efSound('./media/click.mp3');
    const isPrev = $(this).hasClass('prev');
    const popBox = $(this).parents('.popbox').data('pop');
    const totalItems = $(this).parents('.popbox[data-pop="' + popBox + '"]').find('.slideControl > li').length;
    navigateSlide(isPrev, popBox, totalItems);
});

function navigateSlide(isPrev, popBox, totalItems) {
    const currentIndex = $('.popbox[data-pop="' + popBox + '"]').find('.slideControl > li').filter('.on').index();
    let newIndex;

    if (isPrev) {
        newIndex = (currentIndex - 1 + totalItems) % totalItems;
        if (newIndex + 4 >= 4) {
            $('.popbox[data-pop="' + popBox + '"]').find('.slideControl > li').eq(newIndex + 4).addClass('off');
        }
    } else {
        newIndex = (currentIndex + 1) % totalItems;
        if (newIndex - 4 >= 0) {
            $('.popbox[data-pop="' + popBox + '"]').find('.slideControl > li').eq(newIndex - 4).addClass('off');
        }
    }
    updateSlide(newIndex, popBox);
}