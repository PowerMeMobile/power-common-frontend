(function (App, ko, $) {
    'use strict;'

    function InternalLogsRouter(url) {
        var baseUrl = url + 'Logs/';

        this.data = function () { return baseUrl + 'GetData'; }
        this.details = function (id) { return baseUrl + 'Details/' + id; }
        this.loggers = function () { return baseUrl + 'GetLoggers'; }
        this.servers = function () { return baseUrl + 'GetServers'; }
        this.admins = function () { return baseUrl + 'GetAdmins'; }
    }


    App.ns('routers').internalLogs = new InternalLogsRouter(App.routers.baseUrl);

}(App, ko, jQuery));
