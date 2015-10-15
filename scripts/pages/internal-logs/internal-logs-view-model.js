(function (App, ko, $) {
    'use strict;'

    function InternalLogsViewModel(model) {
        var self = this;

        App.vms.base.ServerTable.call(this, model);

        this.From = ko.observable(model.From).subscribeToAction(this.Search);
        this.To = ko.observable(model.To).subscribeToAction(this.Search);
        this.Message = ko.observable(model.Message).extend({ rateLimit: 700 }).subscribeToAction(this.Search);
        this.Levels = ko.observableArray(model.Levels).subscribeToAction(this.Search);
        this.Levels.options = ko.observableArray(model.AvailableLevels);
        this.Loggers = ko.observableArray(model.Loggers).subscribeToAction(this.Search);
        this.Servers = ko.observableArray(model.Servers).subscribeToAction(this.Search);
        this.Admins = ko.observableArray(model.Admins).subscribeToAction(this.Search);

        var router = App.routers.Administration.InternalLogs;

        this.loadLoggers = function (query) {
            App.ajax.Select2Data(router.Loggers(), query);
        }

        this.loadServers = function (query) {
            App.ajax.Select2Data(router.Servers(), query);
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
                        data: 'Date', render: function (data, type, obj) {
                            return App.TablesHelper.linkTo(
                                router.Details(obj.Id),
                                App.TablesHelper.dateTime(data)
                            );
                        }
                    },
                    { data: 'Server' },
                    { data: 'ThreadId' },
                    { data: 'LogLevel' },
                    { data: 'Admin' },
                    { data: 'Logger' },
                    { data: 'Message' }
                ]
            }, self);
        }
    }


    App.ns('vms.Administration.Logs').InternalLogsViewModel = InternalLogsViewModel;

}(App, ko, jQuery));
