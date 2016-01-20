(function(app, ko, undefined) {
    'use strict';

    if (ko === undefined) {
        throw ('Knockout is required, please ensure it is loaded before loading this extenders.');
    }

    ko.extenders.escaped = function(target, options) {
        var options = options || {},
            onlyif = options.onlyif;

        var result = ko.pureComputed({
            read: function() {
                return app.utils.unescape(target());
            },
            write: function(newValue) {
                var currentValue = target(),
                    escapedValue = app.utils.escape(app.utils.unescape(newValue));

                if (currentValue !== escapedValue) {
                    target(escapedValue);
                }
            }
        });

        result(target());

        //return the new computed observable
        return result;
    };
}(App, ko));
