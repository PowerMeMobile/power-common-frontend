(function (globals) {
    'use strict';

    function EditAdminViewModel(model, options) {
        var self = this;

        this.Id = model.Id;
        this.Name = ko.observable(model.Name).extend({
            required: true,
            remote: { url: options.checkNameUrl, obj: self, fields: ['Id','Name'] }
        });
        this.FullName = ko.observable(model.FullName);
        this.Email = ko.observable(model.Email).extend({
            required: true,
            email: true,
            remote: { url: options.checkEmailUrl, obj: self, fields: ['Id', 'Email'] }
        });
        this.Phone = ko.observable(model.Phone).extend( {digit: true} );
        this.Role = ko.observable(model.Role).extend({ required: true });
        this.ExternalId = model.ExternalId;

        this.Save = function Save(url) {
            if (self.isValid()) {
                App.blockUI($('#edit-box'));
                $.ajax({
                    url: url,
                    data: ko.mapping.toJSON(self),
                    contentType: "application/json",
                    type: 'POST',
                    success: function (data) {
                        addAlertToForm(data, "ajaxAlert");
                    }
                }).complete(function () { App.unblockUI($('#edit-box')); });
            } else {
                self.errors.showAllMessages();
            }
        }
    }

    globals.EditAdminViewModel = EditAdminViewModel;

    function CreateAdminViewModel(model, options) {
        var self = this;
        EditAdminViewModel.call(this, model, options);

        this.Password = ko.observable(model.Password).extend({ required: true });

        this.Save = function Save(url) {
            if (self.isValid()) {
                App.blockUI($('#edit-box'));
                $.ajax({
                    url: url,
                    data: ko.mapping.toJSON(self),
                    contentType: "application/json",
                    type: 'POST',
                    success: function (data) {
                        addAlertToForm(data, "ajaxAlert");
                        if (data.success) {
                            location.href = data.obj;
                        }
                    }
                }).complete(function () { App.unblockUI($('#edit-box')); });
            } else {
                self.errors.showAllMessages();
            }
        }
    }

    globals.CreateAdminViewModel = CreateAdminViewModel;

    function ChangePasswordViewModel(model) {
        var self = this;

        this.AdminId = model.AdminId;
        this.OldPassword = ko.observable(model.OldPassword).extend({ required: true });
        this.NewPassword = ko.observable(model.NewPassword).extend({ required: true });

        this.Save = function Save(url) {
            if (self.isValid()) {
                App.blockUI($('#edit-box'));
                $.ajax({
                    url: url,
                    data: ko.mapping.toJSON(self),
                    contentType: "application/json",
                    type: 'POST',
                    success: function (data) {
                        addAlertToForm(data, "changePasswordAjaxAlert");
                        if (data.success) {
                            self.OldPassword(null);
                            self.NewPassword(null);
                            self.errors.showAllMessages(false);
                        }
                    }
                }).complete(function () { App.unblockUI($('#edit-box')); });
            } else {
                self.errors.showAllMessages();
            }
        }
    }

    globals.ChangePasswordViewModel = ChangePasswordViewModel;

}(this));