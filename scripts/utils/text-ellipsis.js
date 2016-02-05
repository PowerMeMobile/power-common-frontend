(function(app, undefined) {
    'use strict';

    /**
     * Cut text to defined length and add dots in the end.
     *
     * @param {string} text - The text for cut;
     * @param {number} length - The max text length after cutting;
     * @returns {string} - The cutted text with dots;
     */
    var ellipsis = function(text, length) {
        text = text || '';

        if (text && text.length > length) {
            return text.substring(0, length) + '...';
        } else {
            return text;
        }
    };

    // Extend `String` prototype with ellipsis functionality.
    if (!String.prototype.ellipsis) {
        String.prototype.ellipsis = function() {
            return ellipsis(this, arguments[0]);
        };
    }

    app.ns('utils').ellipsis = ellipsis;
}(App));
