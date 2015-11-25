(function(app, undefined) {
    'use strict';

    /**
     * Cut text to defined length and adds ellipsis in the end.
     * @param {string} text - The text for cut;
     * @param {number} length - The max text length after cutting;
     * @returns {type} - The cut text with ellipsis;
     */
    var ellipsis = function(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    app.ns('utils').ellipsis = ellipsis;
}(App));
