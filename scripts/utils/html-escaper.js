/**
 * Functions for escaping and unescaping strings to/from HTML interpolation.
 * Implementation stolen from the underscore.js @link http://underscorejs.org
 */
(function(app, undefined) {
    'use strict';

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    var unescapeMap = invert(escapeMap);

    var createEscaper = function(map) {
        var escaper = function(match) {
            return map[match];
        };

        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + Object.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');

        return function (string) {
            if (typeof string === 'string') {
                return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
            } else {
                return string;
            }
        };
    };

    var escape = createEscaper(escapeMap);
    var unescape = createEscaper(unescapeMap);

    function invert(obj) {
        var result = {};
        var keys = Object.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };


    // Export to app namespace.
    app.ns('utils').escape = escape;
    app.ns('utils').unescape = unescape;
}(App));
