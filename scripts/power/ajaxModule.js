(function (globals, App, jQuery) {
    'use strict';

    function AjaxModule() {
        var self = this;

        this.options = {
            ignoreAuthUrls: []
        }

        this.init = function (options) {
            for (var option in this.options)
                this.options[option] = options && options[option] !== undefined ? options[option] : this.options[option];

            setupAuthAjaxHook();
        }

        function setupAuthAjaxHook() {
            jQuery(globals.document).ajaxError(function (event, xhr, settings, thrownError) {
                if (App.auth.isUnauthorizeResponse(xhr)) {
                    if (!self.options.ignoreAuthUrls.some(function (url) { return settings.url.indexOf(url) != -1 }))
                        App.auth.loadInlineLogin()
                } else if (xhr.status == 500 || xhr.status == 502 || xhr.status == 503 || xhr.status == 504) {
                    console.log("internal error");
                } else {
                    console.log("unknoun error");
                }
            });
        }
    }
    
    App.ajax = new AjaxModule();

}(this, App, jQuery));