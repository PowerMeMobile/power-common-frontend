(function (globals, App, jQuery) {
    'use strict';

    function AuthModule() {

        var self = this;

        this.options = {
            urlToLoadDialog: null
        }

        this.init = function (options, user) {
            for (var option in this.options)
                this.options[option] = options && options[option] !== undefined ? options[option] : this.options[option];

            self.User = user;
        }

        this.User = null;

        this.loadInlineLogin = function (response) {
            var self = this;
            if (!jQuery('#inline-login-page').length) {
                jQuery.get(self.options.urlToLoadDialog, null,
                    function (data) {
                        jQuery('body').append(data);
                        openModal();
                        setTimeout(function () {
                            applyLoginPageBindings();
                        }, 50);
                    });
            } else {
                if (!jQuery('#inline-login-page').hasClass('in')) {
                    openModal();
                }
            }
        }

        var openModal = function () {
            jQuery('#inline-login-page').modal('show');
        };

        this.isUnauthorizeResponse = function (xhr) {
            return xhr.status == 403 || xhr.status == 401;
        }
    }

    App.auth = new AuthModule();

}(this, App, jQuery));