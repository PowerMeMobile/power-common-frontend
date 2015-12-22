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

    /**
     * View model for server export.
     *
     * @param {string|function} url - The url to export action.
     */
    function ServerExportViewModel(url) {
        var self = this;

        this.exportData = function (format) {
            $('#main-content').block({
                message: '<b style="font-size: 24px">' + LocalizationStrings.Exporting + '</b>'
            });

            var exportId; //notification comes before actual exportId
            var activeNotifications = ko.observableArray().subscribeTo('changed.notifications', true);
            activeNotifications.subscribe(function (newValue) {
                setTimeout(function () {
                    if (newValue && newValue[0]) {
                        var notification = newValue[0];
                        if (exportId && notification.CallbackUrl() && notification.CallbackUrl().indexOf(exportId) != -1) {
                            notification.callBack();
                        }
                    }
                }, 2000);
            });

            $.ajax({
                url: typeof url === 'function' ? url() : url,
                type: 'POST',
                data: JSON.stringify({ filter: self.MapToSave(), format: format }),
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
                setTimeout(function () {
                    activeNotifications.unsubscribeFrom("changed.notifications");
                }, 2000);
                $('#main-content').unblock();
            });;
        }
    }

    App.ns('vms.base').ServerExport = ServerExportViewModel;

}(App, ko, jQuery));