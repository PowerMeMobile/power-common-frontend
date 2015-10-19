(function (App, ko, $) {
    'use strict;'

    function ChangePasswordViewModel(model, router) {
        var self = this;

        App.vms.Base.BaseEditViewModel.call(this);

        this.adminId = model.adminId;
        this.oldPassword = ko.observable(model.oldPassword).extend({ required: true });
        this.newPassword = ko.observable(model.newPassword).extend({ required: true });

        App.vms.Base.BaseValidatableViewModel.call(this);

        this.save = function () {
            App.ajax.Save(router.changePassword(), self, function () {
                self.oldPassword(null);
                self.newPassword(null);
                self.errors.showAllMessages(false);
            });
        }
    }

    App.ns('vms.Admins').ChangePasswordPage = ChangePasswordViewModel;

}(App, ko, jQuery));
