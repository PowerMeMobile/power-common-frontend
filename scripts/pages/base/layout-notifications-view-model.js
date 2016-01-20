function NotificationViewModel(model) {
    var self = this;

    this.Id = model.Id;
    this.AdminId = model.AdminId;
    this.Type = model.Type;
    this.Message = ko.observable(model.Message).extend({ escaped: true });
    this.CallbackUrl = ko.observable(model.CallbackUrl).extend({ escaped: true });
    this.Date = model.Date;
    this.dateText = ko.computed(function () {
        return moment(this.Date).from(notificationsViewModel.now());
    }, this);
    this.IsReaded = ko.observable(model.IsReaded);

    this.callBack = function () {
        if (self.CallbackUrl()) {
            document.location.href = self.CallbackUrl();
        }
        $.ajax({
            url: App.notifications.urlToRead,
            method: "POST",
            data: { messageId: self.Id },
            success: function () {
                self.IsReaded(true);
                notificationsViewModel.notifications.remove(function (el) { return el.Id == self.Id });
            }
        });
    }
}

function NotificationsViewModel() {
    var self = this;

    this.notifications = ko.observableArray().publishOn('changed.notifications');
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