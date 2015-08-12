(function (globals) {
    'use strict';

    function AuthModule(options, user) {

        var defaultOptions = {
            urlToLoadDialog: null
        }

        for (var option in defaultOptions)
            this[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];

        this.User = user;

        this.loadInlineLogin = function (response) {
            var self = this;
            if (!$('#inline-login-page').length) {
                $.get(self.urlToLoadDialog, null,
                    function (data) {
                        $('body').append(data);
                        openModal();
                        setTimeout(function () {
                            applyLoginPageBindings();
                        }, 50);
                    });
            } else {
                if (!$('#inline-login-page').hasClass('in')) {
                    openModal();
                }
            }
        }

        var openModal = function () {
            $('#inline-login-page').modal('show');
        };

        this.IsUnauthorizeResponse = function (xhr) {
            return xhr.status == 403 || xhr.status == 401;
        }
    }

    globals.AuthModule = AuthModule;

    function BaseAccountViewModel(model) {
        var self = this;

        this.isAjax = false;
        this.Message = ko.observable(model.Message);
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
                    $.ajax({
                        type: "POST",
                        url: $(form).attr('action'),
                        data: $(form).serialize(),
                        success: function (data) {
                            if (data.obj) {
                                self.Message(data.obj.Message);
                                self.MessageType(data.obj.MessageType);
                            }
                            if (data.success && !(data.obj && data.obj.MessageType === 0/*success*/)) {
                                $('#inline-login-page').modal('hide');
                                if (data.obj.Admin && authModule.User.Id != data.obj.Admin.Id) {
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

}(this));