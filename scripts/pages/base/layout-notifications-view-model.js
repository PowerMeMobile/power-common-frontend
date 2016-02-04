(function (App, ko) {
    'use strict';

    var now = ko.observable(new Date());

    setInterval(function () {
        now(new Date());
    }, 60 * 1000);

    function NotificationViewModel(model) {
        var self = this;

        this.id = model.id;
        this.adminId = model.adminId;
        this.type = model.type;
        this.message = ko.observable(model.message).extend({ escaped: true });
        this.callbackUrl = ko.observable(model.callbackUrl).extend({ escaped: true });
        this.date = model.date;
        this.dateText = ko.computed(function () {
            return moment(self.date).from(now());
        });
        this.isReaded = ko.observable(model.isReaded);

        this.callBack = function () {
            if (self.callbackUrl()) {
                document.location.href = self.callbackUrl();
            }
            $.ajax({
                url: App.routers.notifications.markRead(),
                method: "POST",
                data: { messageId: self.id },
                success: function () {
                    self.isReaded(true);
                    ko.postbox.publish(App.events.notifications.readed, self);
                }
            });
        }
    }


    function LayoutNotificationsViewModel() {
        var self = this;

        App.vms.base.Editable.call(this);

        this.notifications = ko.observableArray();
        this.latest = ko.pureComputed(function () {
            return self.notifications().slice(0, App.backend.Notifications ?
                App.backend.Notifications.ActiveNotificationsCount : 7);
        });

        this.total = ko.pureComputed(function () {
            return self.notifications().length;
        });

        this.errorMessage = ko.observable();

        this.reload = function () {
            App.ajax.load(App.routers.notifications.load(), self).then(function (data) {
                self.notifications(data.obj.map(function (el) {
                    return new NotificationViewModel(el);
                }));
            });
        }

        ko.postbox.subscribe(App.events.notifications.received, function (notification) {
            now(new Date());
            self.notifications.unshift(notification);
        });

        ko.postbox.subscribe(App.events.notifications.readed, function (notification) {
            self.notifications.remove(function (n) {
                return n.id === notification.id;
            });
        });

        ko.postbox.subscribe(App.events.notifications.reconnected, function () {
            self.reload();
        });

        ko.postbox.subscribe(App.events.login.signIn, function () {
            self.reload();
        });

        this.reload();
    }

    App.ns('vms.notifications').Notification = NotificationViewModel;
    App.ns('vms.notifications').LayoutNotifications = LayoutNotificationsViewModel;

}(App, ko));