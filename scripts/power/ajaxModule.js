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

        this.Save = function (url, vm, callback) {
            if (vm.isValid()) {
                AjaxInternal(url, vm, callback, 'POST', vm.MapToSave());
            } else {
                vm.errors.showAllMessages();
            }
        }

        this.Delete = function (url, vm, callback) {
            AjaxInternal(url, vm, callback, 'DELETE');
        }

        function AjaxInternal(url, vm, callback, type, data) {
            vm.BlockingStatus(new BlockingStatus(true));
            $.ajax({
                url: url,
                data: data,
                contentType: "application/json",
                type: type,
                success: function (data) {
                    vm.Alert(new AlertStatus(data.success, data.message));
                    vm.BlockingStatus(new BlockingStatus(false, data.success));
                    if (data.success) {
                        if (callback) callback.call(vm, data);
                    }
                },
                error: function () {
                    vm.BlockingStatus(new BlockingStatus(false, false));
                }
            });
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