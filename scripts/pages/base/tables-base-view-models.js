(function (App, ko, $) {
    'use strict;'

    function ServerTableViewModel(model) {
        var self = this;

        this.mapToSave = function () {
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
            App.routers.setHashData(self.mapToSave());
        });
    }

    App.ns('vms.base').ServerTable = ServerTableViewModel;

    /**
     * View model for server export.
     *
     * @param {string|function} url - The url to export action.
     */
    function ServerExportViewModel(url) {
        var self = this;

        var exportId; //notification comes before actual exportId
        this.exportData = function (format) {
            $('#main-content').block({
                message: '<b style="font-size: 24px">' + LocalizationStrings.Exporting + '</b>'
            });

            $.ajax({
                url: typeof url === 'function' ? url() : url,
                type: 'POST',
                data: JSON.stringify({ filter: self.mapToSave(), format: format }),
                contentType: "application/json",
                timeout: 5000,
                success: function (data) {
                    if (data.success)
                        exportId = data.obj.path;
                },
                error: function (x, t, m) {
                    if (t === "timeout") {
                        bootbox.alert(LocalizationStrings.ExportBackground);
                    }
                }
            }).always(function () {
                $('#main-content').unblock();
            });
        }

        ko.postbox.subscribe(App.events.notifications.received, function (notification) {
            setTimeout(function () {
                if (exportId && notification.callbackUrl() && notification.callbackUrl().indexOf(exportId) != -1) {
                    notification.callBack();
                    exportId = null;
                }
            }, 500);
        });
    }

    App.ns('vms.base').ServerExport = ServerExportViewModel;

}(App, ko, jQuery));