if (typeof ko != 'undefined') {
    ko.validation.rules['mustEqual'] = {
        validator: function (val, otherVal) {
            return val === otherVal;
        },
        message: 'The field must equal {0}'
    };

    ko.validation.rules['remote'] = {
        async: true,
        validator: function (val, parms, callback) {
            var defaults = {
                type: 'POST',
                success: function (data) {
                    callback({ isValid: data.success, message: data.message });
                }
            };

            var options = $.extend(defaults, parms);
            options.data = {};
            parms.fields.forEach(function (i) {
                options.data[i] = ko.unwrap(parms.obj[i]);

            });

            $.ajax(options);
        },
        message: 'Invalid value'
    };

    ko.validation.registerExtenders();
}