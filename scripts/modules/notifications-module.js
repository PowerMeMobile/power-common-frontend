(function (App, ko) {
    'use strict';

    function NotificationsModule() {

        var self = this;

        var defaultOptions = {
            invalidRequestsMaxCount: 3,
            defaultTimeout: 3000,
            defaultLongTimeout: 15000,
            urlToWait: null
        }

        var invalidRequestCount = 0;

        function reconnect() {
            self.connect();
        }

        this.init = function (options) {
            for (var option in defaultOptions)
                self[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];

            ko.postbox.subscribe(App.events.login.signIn, function () {
                reconnect();
            });

            ko.postbox.subscribe(App.events.login.signOut, function () {
                reconnect();
            });

            reconnect();
        }

        var connectXhr;
        this.connect = function () {
            connectXhr = $.ajax({
                url: self.urlToWait,
                cache: false,
                global: false,
                success: function (data) {
                    if (data)
                        ko.postbox.publish(App.events.notifications.received, new App.vms.notifications.Notification(data.obj));

                    invalidRequestCount = 0;
                    self.connect();
                },
                error: function (jqXHR, textStatus) {
                    if (!App.ajax.isUnauthorizeResponse(jqXHR.status)) {
                        if (invalidRequestCount < self.invalidRequestsMaxCount) {
                            invalidRequestCount++;
                            setTimeout(self.connect, self.defaultTimeout);
                        } else {
                            setTimeout(self.connect, self.defaultLongTimeout);
                        }
                    }
                }
            });
        }

        this.disconnect = function () {
            if(connectXhr)
                connectXhr.abort()
        }
    }

    App.notifications = new NotificationsModule();

}(App, ko));