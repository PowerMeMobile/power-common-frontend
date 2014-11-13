function NotificationsModule(options) {

    var defaultOptions = {
        activeNotificationsCount: 7,
        invalidRequestMaxCount: 5,
        invalidRequestSleepsMaxCount: 3,
        defaultTimeout: 3000,
        defaultLongTimeout: 15000,
        urlToWait: null,
        urlToLoad: null
    }

    for (var option in defaultOptions)
        this[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];

    var invalidRequestCount = 0,
        invalidRequestSleepsCount = 0;

    this.addNotification = function (notification) {
        notification.dateText = ko.computed(function () {
            return moment(notification.Date).from(notificationsViewModel.now());
        });
        notificationsViewModel.activeNotifications.unshift(notification);
        if (notificationsViewModel.activeNotifications().length > this.activeNotificationsCount)
            notificationsViewModel.activeNotifications.pop()
        notificationsViewModel.totalNotificationsCount(notificationsViewModel.totalNotificationsCount() + 1);
    }

    this.connect = function () {
        var self = this;

        $.ajax({
            url: self.urlToWait,
            cache: false,
            success: function (data, s) {
                    if (data) {
                        self.addNotification(data);
                    }

                    invalidRequestCount = 0;
                    invalidRequestSleepsCount = 0;

                    self.connect();
            },
            error: function (jqXHR, textStatus) {
                if (!authModule.IsUnauthorizeResponse(jqXHR)) {
                    if (invalidRequestCount < self.invalidRequestMaxCount) {
                        invalidRequestCount++;
                        self.connect();
                    } else {
                        if (invalidRequestSleepsCount < self.invalidRequestSleepsMaxCount) {
                            invalidRequestSleepsCount++;
                            invalidRequestCount = 0;
                            setTimeout(function () { self.connect(); }, self.defaultTimeout);
                        } else {
                            setTimeout(function () { self.connect(); }, self.defaultLongTimeout);
                        }
                    }
                } else {
                    setTimeout(function () { self.connect(); }, self.defaultLongTimeout * 2);
                }
            }
        });
    }

    this.loadLastNotifications = function () {
        var self = this;
        $.ajax({
            url: self.urlToLoad,
            cache: false,
            success: function (data, s) {
                if (data) {
                    $.each(data, function (i, el) {
                        if (el.id)
                            self.addNotification(el);
                    });
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

