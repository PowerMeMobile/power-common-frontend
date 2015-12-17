(function (globals, App, jQuery) {
    'use strict';
    function BaseAccountViewModel(model) {
        var self = this;

        this.isAjax = false;
        this.Message = ko.observable(model.Message).extend({ escaped: true });
        this.MessageType = ko.observable(model.MessageType);
        this.MessageCssClass = ko.pureComputed(function () {
            if (self.MessageType() === 0 || self.MessageType() === "success")
                return "alert alert-block alert-success"
            else if (self.MessageType() === 1 || self.MessageType() === "danger")
                return "alert alert-block alert-danger"
        });

        this.Submit = function (vm, form) {
            if (!vm) return false;
            vm.errors.showAllMessages();
            if (self.isAjax) {
                if (vm.isValid()) {
                    jQuery.ajax({
                        type: "POST",
                        url: jQuery(form).attr('action'),
                        data: jQuery(form).serialize(),
                        success: function (data) {
                            if (data.obj) {
                                self.Message(data.obj.Message);
                                self.MessageType(data.obj.MessageType);
                            }
                            if (data.success && !(data.obj && data.obj.MessageType === 0/*success*/)) {
                                jQuery('#inline-login-page').modal('hide');
                                if (data.obj.Admin && App.auth.User.Id != data.obj.Admin.Id) {
                                    document.location.reload(true);
                                }
                            }
                        }
                    });
                }
                return false;
            } else {
                return vm.isValid();
            }
        }
    }

    globals.BaseAccountViewModel = BaseAccountViewModel;

    function BaseLoginViewModel(model) {
        var self = this;

        this.Password = ko.observable(model.Password).extend({ required: true });
        this.RememberMe = ko.observable(model.RememberMe);

        this.checkCaps = function (item, event) {
            var s = String.fromCharCode(event.which);
            var show = s.toUpperCase() === s && s.toLowerCase() !== s && !event.shiftKey;
            self.ShowCapsWarning(show);
            return true;
        }

        this.checkPassFocus = function (item, event) {
            self.ShowCapsWarning(false);
        }

        this.ShowCapsWarning = ko.observable(false);
    }

    globals.BaseLoginViewModel = BaseLoginViewModel;

}(this, App, jQuery));