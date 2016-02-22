(function (App, ko, $) {
    'use strict;'

    function NotificationsRouter(routers) {
        var baseUrl = function() { return routers.root + 'Notifications/'; };

        this.index = function() { return baseUrl() + 'Index'; };
        this.markAllRead = function() { return baseUrl() + 'MarkAllAsRead'; };
        this.load = function() { return baseUrl() + 'GetLastNotifications'; };
        this.markRead = function() { return baseUrl() + 'SetRead'; };
    }

    App.ns('routers').notifications = new NotificationsRouter(App.routers);

}(App, ko, jQuery));
