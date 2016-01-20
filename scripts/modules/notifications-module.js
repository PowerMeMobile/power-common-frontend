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

        this.init = function (options) {
            for (var option in defaultOptions)
                self[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];
        }

        this.addNotification = function (notification) {
            notificationsViewModel.notifications.unshift(notification);
        }

        this.connect = function () {
            $.ajax({
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
                    if (!App.auth.isUnauthorizeResponse(jqXHR)) {
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
                    } else {
                        setTimeout(self.connect, self.defaultLongTimeout * 2);
                    }
                }
            });
        }

        this.loadLastNotifications = function () {
            $.ajax({
                url: self.urlToLoad,
                cache: false,
                success: function (data, s) {
                    if (data) {
                        ko.utils.arrayPushAll(notificationsViewModel.notifications, data.map(function (el) {
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

        this.reload = function () {
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