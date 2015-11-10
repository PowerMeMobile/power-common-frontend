(function (App, ko, $) {
    'use strict;'

    function AuditLogViewModel(model) {
        var self = this;

        App.vms.base.ServerTable.call(this, model);

        this.from = ko.observable(model.from).subscribeToAction(this.Search);
        this.to = ko.observable(model.to).subscribeToAction(this.Search);
        this.actions = ko.observableArray(model.actions).subscribeToAction(this.Search);
        this.types = ko.observableArray(model.types).subscribeToAction(this.Search);
        this.properties = ko.observableArray(model.properties).subscribeToAction(this.Search);
        this.admins = ko.observableArray(model.admins).subscribeToAction(this.Search);
        this.text = ko.observable(model.text).extend({ rateLimit: 700 }).subscribeToAction(this.Search);

        var router = App.routers.auditLog

        this.loadTypes = function (query) {
            return App.ajax.Select2Data(router.itemTypes(), query);
        }

        this.loadProperties = function (query) {
            return App.ajax.Select2Data(router.properties(), query);
        }

        this.loadAdmins = function (query) {
            return App.ajax.Select2Data(router.admins(), query);
        }

        this.tableOptions = function () {
            return App.helpers.table.composeServerOptions({
                ajax: {
                    url: router.data(),
                },
                order: [[0, 'desc']],
                columns: [
                    {
                        data: 'date', render: App.helpers.table.timeDate, name: 'Date'
                    },
                    { data: 'action', name: 'Action' },
                    {
                        data: 'itemType', render: function (data, type, obj) {
                            return App.helpers.table.linkTo(obj.url, data);
                        }, name: 'ItemType'
                    },
                    { data: 'property', name: 'Property' },
                    { data: 'admin', name: 'Admin.Name' },
                    { data: 'oldValue', name: 'OldValue' },
                    { data: 'newValue', name: 'NewValue' },
                    { data: 'descriptionPart', name: 'Description' }
                ]
            }, self);
        }
    }

    App.ns('vms.logs').AuditLogPage = AuditLogViewModel;

}(App, ko, jQuery));
