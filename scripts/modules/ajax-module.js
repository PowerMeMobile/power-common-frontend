(function(globals, App, $, undefined) {
    'use strict';

    var httpMethod = {
        POST: 'POST',
        PUT: 'PUT',
        GET: 'GET',
        DELETE: 'DELETE'
    };

    function AjaxModule() {
        var self = this;

        this.init = function() {
            setupAuthAjaxHook();
        };

        /**
         * Loading some data for editable view model @see Editable view model.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object} vm - View model that load some data.
         * @param {Object=} data - Optional data.
         * @returns {Promise} - Promise object.
         */
        this.load = function(url, vm, data) {
            return self._sendEditableViewModel(url, vm, httpMethod.POST, data, true);
        };

        /**
         * Changing data for editable view model @see Editable view model.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object} vm - View model that changed.
         * @param {Object} data - data for change.
         * @returns {Promise} - Promise object.
         */
        this.change = function(url, vm, data) {
            return self._sendEditableViewModel(url, vm, httpMethod.POST, data, true);
        };

        /**
         * Saving editable and validatable view model @see Editable and @see Editable view models.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object} vm - View model for save with extended by Editable and Editable view models.
         * @returns {Promise} - For valid view model return rejected or resolved Promise object.
         *                      For invalid view model return empty Promise object. Important `catch` or `then` never calls!
         */
        this.save = function(url, vm) {
            if (vm.isValid()) {
                return this._sendEditableViewModel(url, vm, httpMethod.POST, vm.mapToSave());
            } else {
                vm.errors.showAllMessages();

                return new Promise(function(resolve, reject) { });
            }
        };

        /**
         * Deleting editable view model.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object} vm - View model that load some data.
         * @returns {Promise} - Promise object.
         */
        this.delete = function(url, vm) {
            return this._sendEditableViewModel(url, vm, httpMethod.DELETE);
        };

        this._sendEditableViewModel = function(url, vm, method, data, skipStatus) {
            vm.blockingStatus(new App.vms.base.BlockingStatus(true));

            var result = this._send(url, data, method)
                .then(function(data) {
                    vm.blockingStatus(new App.vms.base.BlockingStatus(false, skipStatus ? null : true));
                    vm.alert(new App.vms.base.AlertStatus(true, App.utils.unescape(data.message)));

                    return data;
                })
                .catch(function(data) {
                    vm.blockingStatus(new App.vms.base.BlockingStatus(false, false));

                    if (data && data.message) {
                        vm.alert(new App.vms.base.AlertStatus(false, App.utils.unescape(data.message)));
                    }

                    return Promise.reject(data);
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
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }

            return new Promise(function(resolve, reject) {
                $.ajax({
                    url: url,
                    data: data,
                    contentType: 'application/json',
                    method: method
                }).done(function(data) {
                    (data && data.success) ? resolve(data) : reject(data);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    reject({ message: '' }); // Provide object with empty message for catch error in same way with unsuccess response.
                });
            });
        };

        /**
        * Use for loading data into `select2`.
        *
        * @param {string} url - A string containing the URL to which the request is sent.
        * @param {Object} query - @see http://select2.github.io/select2/#documentation
        */
        this.Select2Data = function(url, query) {
            return this._send(url, { startWith: query.term }, httpMethod.POST).then(function(data) {
                query.callback({
                    results: data.obj
                });
                return data;
            }).catch(function(data) {
                return Promise.reject(data);
            });
        };

        /**
         * Wrapper method on internal method for send data to the server.
         * Use instead `$.ajax()` method in application.
         *
         * @param {string} url - A string containing the URL to which the request is sent.
         * @param {Object|string|Array} data - @see http://api.jquery.com/jquery.ajax/#jQuery-ajax-settings field data.
         * @param {string} method - The HTTP method to use for the request (e.g. "POST", "GET", "PUT" @see httpMethod).
         * @returns {Object} The Promise with jquery ajax request.
         */
        this.send = function(url, data, method) {
            return this._send(url, data, method);
        };

        this.errorHandler = function(event, xhr, settings, thrownError) {
            if (self.isUnauthorizeResponse(xhr.status)) {
                ko.postbox.publish(App.events.login.signOut);
            } else {
                console.log('Network error: {0} {1}'.format(xhr.status, xhr.statusText));
            }
        };

        /**
         * Verification of belonging to the unauthorized(401) or forbiden(403) statuses.
         *
         * @param {number} responseStatus - Respone status value.
         * @returns {boolean}
         */
        this.isUnauthorizeResponse = function(responseStatus) {
            return responseStatus === 403 || responseStatus === 401;
        }

        function setupAuthAjaxHook() {
            $(globals.document).ajaxError(self.errorHandler);
        }
    }

    App.ajax = new AjaxModule();
    App.ns('enums').httpMethod = httpMethod;

}(this, App, jQuery));