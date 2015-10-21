(function (App, ko, $) {
    'use strict;'

    function AuditLogViewModel(model) {
        var self = this;

        App.vms.base.ServerTable.call(this, model);

        this.From = ko.observable(model.From).subscribeToAction(this.Search);
        this.To = ko.observable(model.To).subscribeToAction(this.Search);
        this.Actions = ko.observableArray(model.Actions).subscribeToAction(this.Search);
        this.Types = ko.observableArray(model.Types).subscribeToAction(this.Search);
        this.Properties = ko.observableArray(model.Properties).subscribeToAction(this.Search);
        this.Admins = ko.observableArray(model.Admins).subscribeToAction(this.Search);
        this.Text = ko.observable(model.Text).extend({ rateLimit: 700 }).subscribeToAction(this.Search);

        var router = App.routers.Administration.AuditLog

        this.loadTypes = function (query) {
            App.ajax.Select2Data(router.ItemTypes(), query);
        }

        this.loadProperties = function (query) {
            App.ajax.Select2Data(router.Properties(), query);
        }

        this.loadAdmins = function (query) {
            App.ajax.Select2Data(router.Admins(), query);
        }

        this.tableOptions = function () {
            return App.TablesHelper.composeServerOptions({
                ajax: {
                    url: router.Data(),
                },
                order: [[0, 'desc']],
                columns: [
                    {
                        data: 'date', render: App.TablesHelper.timeDate, name: 'Date'
                    },
                    { data: 'action', name: 'Action' },
                    {
                        data: 'itemType', render: function (data, type, obj) {
                            return App.TablesHelper.linkTo(obj.url, data);
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

    App.ns('vms.Administration.Logs').AuditLogViewModel = AuditLogViewModel;

}(App, ko, jQuery));
