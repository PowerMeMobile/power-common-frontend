(function (App, $, globals) {
    'use strict;'

    function RouterHelper() {

        this.getHashData = function () {
            var data = $.deparam(globals.location.hash.substr(App.routers.hash.length), true);
            for (var i in data) {
                if (data[i] === "")
                    data[i] = null; //null -> empty -> null
            }
            return data;
        }

        this.setHashData = function (data) {
            globals.document.location.replace(App.routers.hash + $.param(data));
        }
    }

    $.extend(true, App.routers, new RouterHelper());

}(App, jQuery, this));
