(function(app, ko, undefined) {
    'use strict';

    if (ko === undefined) {
        throw ('Knockout is required, please ensure it is loaded before loading this extenders.');
    }

    ko.extenders.escaped = function(target, options) {
        var escapedComputed = ko.pureComputed({
            read: function() {
                return target();
            },
            write: function(newValue) {
                target(app.utils.unescape(newValue));
            }
        });

        escapedComputed(target());

        return escapedComputed;
    };
}(App, ko));