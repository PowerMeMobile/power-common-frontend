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

}(App, ko, jQuery));