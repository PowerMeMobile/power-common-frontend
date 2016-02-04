(function (App, ko, $) {
    'use strict;'

    function NotificationsRouter(url) {
        var baseUrl = url + 'Notifications/';

        this.index = function () { return baseUrl + 'Index'; }
        this.markAllRead = function () { return baseUrl + 'MarkAllAsRead'; }
        this.load = function () { return baseUrl + 'GetLastNotifications'; }
        this.markRead = function () { return baseUrl + 'SetRead'; }
    }


    App.ns('routers').notifications = new NotificationsRouter(App.routers.baseUrl);

}(App, ko, jQuery));