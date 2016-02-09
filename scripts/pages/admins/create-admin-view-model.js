(function (App, ko) {
    'use strict';

    function CreateAdminViewModel(model, options) {
        var self = this;

        App.vms.Admins.EditAdminViewModel.call(this, model, options);

        this.Password = ko.observable(model.Password).extend({ required: true });
    }

    if (!App.vms.Admins) App.vms.Admins = {};

    App.vms.Admins.CreateAdminViewModel = CreateAdminViewModel;

}(App, ko));