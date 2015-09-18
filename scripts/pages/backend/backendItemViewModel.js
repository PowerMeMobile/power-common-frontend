(function (globals, App, jQuery) {
    'use strict';

    function BackendItemViewModel(id) {
        var self = this;
        App.vms.Base.BaseEditViewModel.call(this);

        this.Id = ko.observable(id);
        this.Value = ko.observable();

        this.MapToSave = function () {
            return JSON.stringify({id: self.Id(), value: ko.mapping.toJSON(self.Value) });
        }

        this.Save = function () {
            App.ajax.Save(App.routers.Backend.Save(), self);

            return false;
        }

        App.vms.Base.BaseValidatableViewModel.call(this);
    }


    if (!App.vms.Backend) App.vms.Backend = {};

    App.vms.Backend.BackendItemViewModel = BackendItemViewModel;

}(this, App, jQuery));