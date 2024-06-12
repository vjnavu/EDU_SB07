$(document).find(".finger").on("click", function () {
    efSound("./media/click.mp3");
    if ($(this).parent().hasClass('view')) {
        $(this).parent().removeClass('view');
    } else {
        $(this).parent().addClass('view');
    }

});