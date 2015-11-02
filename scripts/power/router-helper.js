(function (App, $, globals) {
    'use strict;'

    function RouterHelper() {
        var self = this;

        this.getHashData = function () {
            var data = $.deparam(globals.location.hash.substr(App.routers.hash.length), true);
            for (var i in data) {
                if (data[i] === "")
                    data[i] = null; //null -> empty -> null
            }
            return data;
        }

        this.setHashData = function (data) {
            globals.document.location.replace(self.getDataUrl(data));
        }

        this.getDataUrl = function (data) {
            if (data)
                return App.routers.hash + $.param(data);
            else
                return '';
        }
    }

    $.extend(true, App.routers, new RouterHelper());

}(App, jQuery, this));
