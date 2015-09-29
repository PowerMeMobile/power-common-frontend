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

    ko.validation.rules['url'] = {
        validator: function (val, required) {
            if (!val) {
                return !required;
            }
            val = val.replace(/^\s+|\s+$/, ''); //Strip whitespace
            //Regex by Diego Perini from: http://mathiasbynens.be/demo/url-regex
            return val.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.‌​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[‌​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1‌​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00‌​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u‌​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i);
        },
        message: 'This field has to be a valid URL'
    };

    ko.validation.rules['validateFileTypeExtensions'] = {
        validator: function (fileName, validExtensions) {
            var isValidExtension = false;
            var extension = fileName.split('.').pop();
            validExtensions.forEach(function (validExtension) {
                if (extension == validExtension)
                    isValidExtension = true;
            });
            return isValidExtension;
        },


        message: 'Please chose a file with an acceptable extension ({0}).'
    };

    ko.validation.registerExtenders();
}