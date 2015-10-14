(function (App, ko, $) {
    'use strict;'

    function InternalLogsRouter(url) {
        var baseUrl = url + 'Logs/';

        this.Data = function () { return baseUrl + 'GetData'; }
        this.Details = function (id) { return baseUrl + 'Details/' + id; }
        this.Loggers = function () { return baseUrl + 'GetLoggers'; }
        this.Servers = function () { return baseUrl + 'GetServers'; }
        this.Admins = function () { return baseUrl + 'GetAdmins'; }
    }


    App.ns('routers.Administration').InternalLogs = new InternalLogsRouter(App.routers.baseUrl);

}(App, ko, jQuery));
