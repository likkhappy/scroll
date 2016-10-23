(function($) {

    var callbackFun = function(index) {
        var $tips = $('.status-label');
        $tips.removeClass('current');
        $tips.eq(index).addClass('current');
    }

    var swipe = new Swipe($('.channel-poster').get(0), {
        auto: false,
        continuous: true,
        callback: callbackFun
    });


    $('.prev').click(function() {
        swipe.prev();
    });

    $('.next').click(function() {
        swipe.next();
    });

})($);
