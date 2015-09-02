function NotificationViewModel(model) {
    var self = this;

    this.Id = model.Id;
    this.AdminId = model.AdminId;
    this.Type = model.Type;
    this.Message = model.Message;
    this.CallbackUrl = model.CallbackUrl;
    this.Date = model.Date;
    this.dateText = ko.computed(function () {
        return moment(this.Date).from(notificationsViewModel.now());
    }, this);
    this.IsReaded = ko.observable(model.IsReaded);

    this.callBack = function () {
        $.ajax({
            url: notificationsModule.urlToRead,
            method: "POST",
            data: { messageId: self.Id },
            success: function () {
                self.IsReaded(true);
                notificationsViewModel.notifications.remove(function (el) { return el.Id == self.Id });
            }
        });
        if (self.CallbackUrl) {
            document.location.href = self.CallbackUrl;
        }
    }
}

function NotificationsViewModel() {
    var self = this;

    this.notifications = ko.observableArray();
    this.lastActiveNotifications = ko.pureComputed(function () {
        return self.notifications().slice(0, App.backend.Notifications ? App.backend.Notifications.ActiveNotificationsCount : 7);
    });

    this.totalNotificationsCount = ko.pureComputed(function () {
        return self.notifications().length;
    });
    this.isLoading = ko.observable(true);
    this.errorMessage = ko.observable();
    this.now = ko.observable(new Date());

    setInterval(function () { self.now(new Date()); }, 60 * 1000);
}

var notificationsViewModel = new NotificationsViewModel();

function NotificationsModule(options) {

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

    for (var option in defaultOptions)
        this[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];

    var invalidRequestCount = 0,
        invalidRequestSleepsCount = 0;

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

