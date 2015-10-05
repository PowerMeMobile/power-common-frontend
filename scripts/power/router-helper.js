(function (App, $, globals) {
    'use strict;'

    function RouterHelper() {

        this.getHashData = function () {
            return $.deparam(globals.location.hash.substr(App.routers.hash.length));
        }

        this.setHashData = function (data) {
            globals.document.location.replace(App.routers.hash + $.param(data));
        }
    }

    $.extend(true, App.routers, new RouterHelper());

}(App, jQuery, this));
