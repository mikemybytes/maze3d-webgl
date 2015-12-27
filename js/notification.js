var NOTIFICATION = {

};

$(function() {

    NOTIFICATION.display = function(messageText, duration) {
        $("#notification").remove();

        var $notification = $('<div>', { id: "notification" });
        $notification.text(messageText);
        $notification.hide();
        $('body').append($notification);
        $notification.fadeIn(1000, function() {
            if (duration) {
                setTimeout(function() {
                    $notification.fadeOut(2500);
                }, duration);
            }
        });
    };

});
