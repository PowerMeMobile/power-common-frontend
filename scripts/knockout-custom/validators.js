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
            var regex = '^(https?:\\/\\/)' + // protocol
       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
       '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
       '(\\?[,;&a-z\\d%_.~+=-]*)?' + // query string
       '(\\#[-a-z\\d_]*)?$'; // hash
            return val.match(regex);
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