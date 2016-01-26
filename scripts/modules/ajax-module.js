(function (globals, App, jQuery) {
    'use strict';

    var httpMethod = {
        POST: 'POST',
        PUT: 'PUT',
        GET: 'GET',
        DELETE: 'DELETE'
    };

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

        /**
         * Loading some data for editable view model @see BaseEditViewModel.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object} vm - View model that load some data.
         * @param {Object=} data - Optional data.
         * @returns {Promise} - Promise object.
         */
        this.load = function(url, vm, data) {
            return self._sendEditableViewModel(url, vm, httpMethod.POST, vm.MapToSave(), true);
        };

        /**
         * Saving editable and validatable view model @see BaseEditViewModel and @see BaseValidatableViewModel.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object} vm - View model for save with extended by BaseEditViewModel and BaseValidatableViewModel.
         * @returns {Promise} - Promise object.
         */
        this.save = function(url, vm) {
            if (vm.isValid()) {
                return this._sendEditableViewModel(url, vm, httpMethod.POST, vm.MapToSave());
            } else {
                vm.errors.showAllMessages();

                // Because vm is not valid return empty promise object wuth empty message on reject.
                return new Promise(function(resolve, reject) {
                    reject({ message: '' });
                });
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

        this._sendEditableViewModel = function(url, vm, method, data, skipStatus) {
            vm.BlockingStatus(new App.vms.Base.BlockingStatus(true));

            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            var result = this._send(url, data, method)
                .then(function(data) {
                    vm.BlockingStatus(new App.vms.Base.BlockingStatus(false, skipStatus ? null : true));
                    vm.Alert(new App.vms.Base.AlertStatus(true, App.utils.unescape(data.message)));

                    return data;
                })
                .catch(function(data) {
                    vm.BlockingStatus(new App.vms.Base.BlockingStatus(false, false));

                    if (data && data.message) {
                        vm.Alert(new App.vms.Base.AlertStatus(false, App.utils.unescape(data.message)));
                    }

                    return data;
                });

            return result;
        };

        /**
         * Internal method for send request to server and return psromise object.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object|string|Array} data - @see http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings field data.
         * @param {string} method - The HTTP method to use for the request (e.g. "POST", "GET", "PUT" @see httpMethod).
         * @returns {Object} The Promise with jquery ajax request.
         */
        this._send = function(url, data, method) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: url,
                    data: data,
                    contentType: 'application/json',
                    method: method
                }).done(function(data) {
                    (data && data.success) ? resolve(data) : reject(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    reject({ message: '' }); // Provide object with empty messagr for catch error in same way with unsuccess response.
                });
            });
        };

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