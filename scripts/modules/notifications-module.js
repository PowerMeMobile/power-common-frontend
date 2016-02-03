(function (App, ko) {
    'use strict';

    function NotificationsModule() {

        var self = this;

        var defaultOptions = {
            invalidRequestMaxCount: 5,
            invalidRequestSleepsMaxCount: 3,
            defaultTimeout: 3000,
            defaultLongTimeout: 15000,
            urlToWait: null,
            urlToLoad: null,
            urlToRead: null
        }

        var invalidRequestCount = 0,
            invalidRequestSleepsCount = 0;


        function reconnect() {
            self.reload();
            self.connect();
        }

        this.init = function (options) {
            for (var option in defaultOptions)
                self[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];

            ko.postbox.subscribe(App.events.login.bus, function (ev) {
                if (ev === App.events.login.values.signOut) {
                    self.disconnect();
                } else if (ev === App.events.login.values.signIn) {
                    reconnect();
                }
            });

            reconnect();
        }

        this.addNotification = function (notification) {
            notificationsViewModel.notifications.unshift(notification);
        }

        var pollRequest;
        this.connect = function () {
            pollRequest = $.ajax({
                url: self.urlToWait,
                cache: false,
                global: false,
                success: function (data, s) {
                    if (data) {
                        notificationsViewModel.now(new Date());
                        notificationsViewModel.notifications.unshift(new NotificationViewModel(data));
                    }

                    invalidRequestCount = 0;
                    invalidRequestSleepsCount = 0;

                    self.connect();
                },
                error: function (jqXHR, textStatus) {
                    if (!App.ajax.isUnauthorizeResponse(jqXHR.status)) {
                        if (invalidRequestCount < self.invalidRequestMaxCount) {
                            invalidRequestCount++;
                            self.connect();
                        } else {
                            if (invalidRequestSleepsCount < self.invalidRequestSleepsMaxCount) {
                                invalidRequestSleepsCount++;
                                invalidRequestCount = 0;
                                setTimeout(self.connect, self.defaultTimeout);
                            } else {
                                setTimeout(self.connect, self.defaultLongTimeout);
                            }
                        }
                    }
                }
            });
        }

        this.disconnect = function () {
            if (pollRequest)
                pollRequest.abort();
        }

        this.reload = function () {
            notificationsViewModel.isLoading(true);
            $.ajax({
                url: self.urlToLoad,
                cache: false,
                success: function (data, s) {
                    if (data) {
                        notificationsViewModel.notifications(data.map(function (el) {
                            return new NotificationViewModel(el);
                        }));
                    }
                },
                error: function (jqXHR, textStatus) {
                    notificationsViewModel.errorMessage("Error loading data from server");
                },
                complete: function () {
                    notificationsViewModel.isLoading(false);
                }
            });
        }
    }

    App.notifications = new NotificationsModule();

}(App, ko));