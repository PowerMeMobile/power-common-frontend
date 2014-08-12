function AuthModule(options) {

    var defaultOptions = {
        urlToLoadDialog: null,
        urlToLogin: null,
    }

    for (var option in defaultOptions)
        this[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];
    //checkAjaxAuth

    this.loadInlineLogin = function (response) {
        var self = this;
        if (!$('#inline-login-page').length) {
            $.get(self.urlToLoadDialog, null,
                function (data) {
                    $('body').append(data);
                    openModal();
                });
        } else {
            if (!$('#inline-login-page').hasClass('in')) {
                openModal();
            }
        }
    }

    var openModal = function () {
        $('#inline-login-page').modal('show');
        setTimeout(function () {
            $('#login-form').unbind().submit(replaceLoginAction);
        }, 50);
    };

    var replaceLoginAction = function () {
        $('#login-form').validate();
        if ($('#login-form').valid()) {
            $.ajax({
                type: "POST",
                url: authModule.urlToLogin,
                data: $("#login-form").serialize(),
                success: function (data) {
                    var newForm = $(data).find('#login-form');
                    if (newForm.length == 1) {
                        $('#login-form').replaceWith(newForm);
                        setTimeout(function () {
                            $.validator.unobtrusive.parse(newForm);
                            $('#login-form').submit(replaceLoginAction);
                        }, 50);
                    } else {
                        $('#inline-login-page').modal('hide');
                    }
                }
            });
        }
        return false;
    }

    this.IsUnauthorizeResponse = function (xhr) {
        return xhr.status == 403 || xhr.status == 401;
    }
}