(function (App, ko, $) {
    'use strict';

    function BaseAccountViewModel(model) {
        var self = this;

        this.isAjax = false;
        this.message = ko.observable(model.message).extend({ escaped: true });
        this.messageType = ko.observable(model.messageType);
        this.messageCssClass = ko.pureComputed(function () {
            if (self.messageType() === 0 || self.messageType() === "success")
                return "alert alert-block alert-success"
            else if (self.messageType() === 1 || self.messageType() === "danger")
                return "alert alert-block alert-danger"
        });

        this.submit = function (form) {
            self.errors.showAllMessages();
            if (self.isAjax) {
                if (self.isValid()) {
                    $.ajax({
                        type: "POST",
                        url: $(form).attr('action'),
                        data: $(form).serialize(),
                        success: function (data) {
                            if (data.obj) {
                                self.message(data.obj.message);
                                self.messageType(data.obj.messageType);
                            }
                            if (data.success && !(data.obj && data.obj.message && data.obj.messageType === 'success')) {
                                $('#inline-login-page').modal('hide');
                                if (data.obj.admin && App.auth.User.Id != data.obj.admin.id) {
                                    document.location.reload(true);
                                } else {
                                    ko.postbox.publish(App.events.login.bus, App.events.login.values.signIn);
                                }
                            }
                        }
                    });
                }
                return false;
            } else {
                return self.isValid();
            }
        }
    }

    function BaseLoginViewModel(model) {
        var self = this;

        this.password = ko.observable(model.password).extend({ required: true });
        this.rememberMe = ko.observable(model.rememberMe);

        this.checkCaps = function (item, event) {
            var s = String.fromCharCode(event.which);
            var show = s.toUpperCase() === s && s.toLowerCase() !== s && !event.shiftKey;
            self.showCapsWarning(show);
            return true;
        }

        this.checkPassFocus = function (item, event) {
            self.showCapsWarning(false);
        }

        this.showCapsWarning = ko.observable(false);
    }

    App.ns('vms.login').BaseAccount = BaseAccountViewModel;
    App.ns('vms.login').BaseLogin = BaseLoginViewModel;

}(App, ko, jQuery));