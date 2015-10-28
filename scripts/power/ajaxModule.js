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

        this.Get = function (url, vm, callback, data) {
            return self.AjaxInternal(url, vm, callback, 'POST', data, true);
        }

        this.Save = function (url, vm, callback) {
            if (vm.isValid()) {
                self.AjaxInternal(url, vm, callback, 'POST', vm.MapToSave());
            } else {
                vm.errors.showAllMessages();
            }
        }

        this.Delete = function (url, vm, callback) {
            self.AjaxInternal(url, vm, callback, 'DELETE');
        }

        this.Select2Data = function (url, query) {
            return $.ajax({
                url: url,
                data: { startWith: query.term },
                type: 'POST',
                success: function (data) {
                    if (data.success) {
                        query.callback({
                            results: data.obj
                        });
                    } else {
                        alert(LocalizationStrings.InternalServerError);
                    }
                }
            });
        }

        this.AjaxInternal = function(url, vm, callback, type, data, skipStatus) {
            vm.BlockingStatus(new App.vms.Base.BlockingStatus(true));

            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            return $.ajax({
                url: url,
                data: data,
                contentType: "application/json",
                type: type,
                success: function (data) {
                    vm.Alert(new App.vms.Base.AlertStatus(data.success, data.message));
                    vm.BlockingStatus(new App.vms.Base.BlockingStatus(false, skipStatus ? null : data.success));
                    if (data.success) {
                        if (callback) callback.call(vm, data);
                    }
                },
                error: function () {
                    vm.BlockingStatus(new App.vms.Base.BlockingStatus(false, false));
                }
            });
        }

        this.errorHandler = function (event, xhr, settings, thrownError) {
            if (App.auth.isUnauthorizeResponse(xhr)) {
                if (!self.options.ignoreAuthUrls.some(function (url) { return settings.url.indexOf(url) != -1 }))
                    App.auth.loadInlineLogin()
            } else if (xhr.status == 500 || xhr.status == 502 || xhr.status == 503 || xhr.status == 504) {
                console.log("internal error");
            } else {
                console.log("unknoun error");
            }
        }

        function setupAuthAjaxHook() {
            jQuery(globals.document).ajaxError(self.errorHandler);
        }
    }

    App.ajax = new AjaxModule();

}(this, App, jQuery));