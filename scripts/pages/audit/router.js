(function (App, ko, $) {
    'use strict;'

    function AuditLogRouter(url) {
        var baseUrl = url + 'Audit/';

        this.Data = function () { return baseUrl + 'GetData'; }
        this.ItemTypes = function () { return baseUrl + 'GetTypes'; }
        this.Properties = function () { return baseUrl + 'GetProperties'; }
        this.Admins = function () { return baseUrl + 'GetAdmins'; }
    }


    App.ns('routers.Administration').AuditLog = new AuditLogRouter(App.routers.baseUrl);

}(App, ko, jQuery));
