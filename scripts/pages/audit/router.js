(function (App, ko, $) {
    'use strict;'

    function AuditLogRouter(url) {
        var baseUrl = url + 'Audit/';

        this.data = function () { return baseUrl + 'GetData'; }
        this.itemTypes = function () { return baseUrl + 'GetTypes'; }
        this.properties = function () { return baseUrl + 'GetProperties'; }
        this.admins = function () { return baseUrl + 'GetAdmins'; }
    }


    App.ns('routers').auditLog = new AuditLogRouter(App.routers.baseUrl);

}(App, ko, jQuery));
