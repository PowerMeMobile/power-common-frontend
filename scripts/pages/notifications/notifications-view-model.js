(function (App, ko) {
    'use strict';

    function NotificationsViewModel(model) {
        var self = this;

        App.vms.base.Editable.call(this);

        this.onlyUnread = ko.observable(model.onlyUnread);
        this.notifications = ko.observableArray();
        this.activeNotifications = ko.pureComputed(function () {
            return self.notifications().filter(function (n) { return self.onlyUnread() ? !n.isReaded() : true });
        });

        this.from = ko.pureComputed(function () {
            var ntfs = self.activeNotifications();
            if (ntfs && ntfs.length) {
                return ntfs[ntfs.length - 1].date;
            }
        });

        this.load = function () {
            App.ajax.load(App.routers.notifications.index(), self, {
                onlyUnread: self.onlyUnread(),
                from: self.from()
            }).then(function (data) {
                ko.utils.arrayPushAll(self.notifications, data.obj.map(function (el) {
                    return new App.vms.notifications.Notification(el);
                }));
            });
        }

        var reloadMessages = function () {
            App.ajax.load(App.routers.notifications.index(), self, {
                onlyUnread: self.onlyUnread()
            }).then(function (data) {
                self.notifications(data.obj.map(function (el) {
                    return new App.vms.notifications.Notification(el);
                }));
            });
        };

        this.onlyUnread.subscribe(reloadMessages);

        this.markAllAsRead = function () {
            App.ajax.change(App.routers.notifications.markAllRead(), self).then(function (data) {
                reloadMessages();
                ko.postbox.publish(App.events.notifications.reconnected);
            });
        }

        this.callBackWrap = function (notification) {
            if (!notification.isReaded()) {
                notification.callBack();
            }
        }

        ko.postbox.subscribe(App.events.notifications.received, function (notification) {
            self.notifications.unshift(notification);
        });

        ko.postbox.subscribe(App.events.login.signIn, function () {
            reloadMessages();
        });
    }

    App.ns('vms.notifications').NotificationsPage = NotificationsViewModel;

}(App, ko));