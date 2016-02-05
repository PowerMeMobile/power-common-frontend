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

    app.ns('utils').ellipsis = ellipsis;
}(App));
