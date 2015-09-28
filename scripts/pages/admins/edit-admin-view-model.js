(function (App, ko) {
    'use strict';

    function EditAdminViewModel(model, options) {
        var self = this;

        App.vms.Base.BaseEditViewModel.call(this);

        this.Id = model.Id;
        this.Name = ko.observable(model.Name).extend({
            required: true,
            remote: { url: options.checkNameUrl, obj: self, fields: ['Id', 'Name'] }
        });
        this.FullName = ko.observable(model.FullName);
        this.Email = ko.observable(model.Email).extend({
            required: true,
            email: true,
            remote: { url: options.checkEmailUrl, obj: self, fields: ['Id', 'Email'] }
        });
        this.Phone = ko.observable(model.Phone).extend({ digit: true });
        this.Role = ko.observable(model.Role).extend({ required: true });
        this.ExternalId = model.ExternalId;
    }

    if (!App.vms.Admins) App.vms.Admins = {};

    App.vms.Admins.EditAdminViewModel = EditAdminViewModel;

}(App, ko));