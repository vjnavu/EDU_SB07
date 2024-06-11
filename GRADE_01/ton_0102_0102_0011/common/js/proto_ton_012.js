document.addEventListener('DOMContentLoaded', function () {
    let praiseTimeout;

    $(document).on('click', '.btn-praise', function () {
        let random = (Math.random() + 1).toString(36).substring(7);
        efSound('./media/clap.mp3');
        $('.praise-animation>img').remove();
        $('.praise-animation').addClass('active');
        $('.praise-animation').append('<img src="./common/images/proto_ton_012/success.gif?r=' + random + '" />');
        $('.btn-praise').addClass('disable');

        clearTimeout(praiseTimeout);

        praiseTimeout = setTimeout(() => {
            $('.praise-animation').removeClass('active');
            $('.praise-animation>img').remove();
            $('.btn-praise').removeClass('disable');
        }, 5500);
    });
});