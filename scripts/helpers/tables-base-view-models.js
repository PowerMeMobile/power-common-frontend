(function (App, ko, $) {
    'use strict;'

    function ServerTableViewModel(model) {
        var self = this;

        this.MapToSave = function () {
            return JSON.parse(ko.mapping.toJSON(self, { ignore: self.ignoreOnSave }));
        }

        if (!this.ignoreOnSave) {
            this.ignoreOnSave = ['ignoreOnSave'];
        }

        $.extend(model, App.routers.getHashData());

        this.Search = function () {
            ko.postbox.publish('search');
        }

        ko.postbox.subscribe('search', function () {
            App.routers.setHashData(self.MapToSave());
        });
    }

    App.ns('vms.base').ServerTable = ServerTableViewModel;

    function ServerExportViewModel(router) {
        var self = this;

        this.exportData = function (format) {
            $('#main-content').block({
                message: '<b style="font-size: 24px">' + LocalizationStrings.Exporting + '</b>'
            });
            $.ajax({
                url: router.export(),
                type: 'POST',
                data: JSON.stringify({ filter: self.MapToSave(), format: format }),
                contentType: "application/json",
                timeout: 5000,
                error: function (x, t, m) {
                    if (t === "timeout") {
                        bootbox.alert(LocalizationStrings.ExportBackground);
                    }
                }
            }).always(function () { $('#main-content').unblock(); });;
        }
    }

    App.ns('vms.base').ServerExport = ServerExportViewModel;

}(App, ko, jQuery));