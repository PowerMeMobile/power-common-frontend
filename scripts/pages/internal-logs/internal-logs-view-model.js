(function (App, ko, $) {
    'use strict;'

    function InternalLogsViewModel(model) {
        var self = this;

        App.vms.base.ServerTable.call(this, model);

        this.from = ko.observable(model.from).subscribeToAction(this.Search);
        this.to = ko.observable(model.to).subscribeToAction(this.Search);
        this.message = ko.observable(model.message).extend({ rateLimit: 700 }).subscribeToAction(this.Search);
        this.levels = ko.observableArray(model.levels).subscribeToAction(this.Search);
        this.levels.options = ko.observableArray(model.availableLevels);
        this.loggers = ko.observableArray(model.loggers).subscribeToAction(this.Search);
        this.servers = ko.observableArray(model.servers).subscribeToAction(this.Search);
        this.admins = ko.observableArray(model.admins).subscribeToAction(this.Search);

        var router = App.routers.internalLogs;

        this.loadLoggers = function (query) {
            return App.ajax.Select2Data(router.loggers(), query);
        }

        this.loadServers = function (query) {
            return App.ajax.Select2Data(router.servers(), query);
        }

        this.loadAdmins = function (query) {
            return App.ajax.Select2Data(router.admins(), query);
        }

        this.tableOptions = function () {
            return App.TablesHelper.composeServerOptions({
                ajax: {
                    url: router.data(),
                },
                order: [[0, 'desc']],
                columns: [
                    {
                        data: 'date', render: function (data, type, obj) {
                            return App.TablesHelper.linkTo(
                                router.details(obj.id),
                                App.TablesHelper.dateTime(data)
                            );
                        }, name: 'Date'
                    },
                    { data: 'server', name: 'Server' },
                    { data: 'threadId', name: 'ThreadId' },
                    { data: 'logLevel', name: 'LogLevel' },
                    { data: 'admin', name: 'Admin' },
                    { data: 'logger', name: 'Logger' },
                    { data: 'message', name: 'Message' }
                ]
            }, self);
        }
    }


    App.ns('vms.logs').InternalLogsPage = InternalLogsViewModel;

}(App, ko, jQuery));
