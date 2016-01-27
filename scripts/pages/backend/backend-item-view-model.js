(function (globals, App, jQuery) {
    'use strict';

    function BackendItemViewModel(id) {
        var self = this;
        App.vms.base.Editable.call(this);

        this.Id = ko.observable(id);
        this.Value = ko.observable().extend({ escaped: true });

        this.MapToSave = function () {
            return JSON.stringify({ id: self.Id(), value: ko.mapping.toJSON(self.Value) });
        }

        this.Save = function () {
            App.ajax.save(App.routers.Backend.Save(), self);

            return false;
        }

        App.vms.base.Validatable.call(this);
    }


    if (!App.vms.Backend) App.vms.Backend = {};

    App.vms.Backend.BackendItemViewModel = BackendItemViewModel;

}(this, App, jQuery));