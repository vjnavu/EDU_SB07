$(document).on('click', '.clickText', function () {
    let ans;
    if ($(this).hasClass('ans')) {
        efSound('./media/correct.mp3');
        ans = $(this).text();
        $(this).parents('.boxAction').find('.boxAns').text(ans);
        $(this).addClass('active');
        $(this).parent().find('.clickText').addClass('complete');
    } else {
        efSound('./media/incorrect.mp3');
        $(this).addClass('fail');
        setTimeout(function () {
            $('.clickText').removeClass('fail');
        }, 500);
    }
});