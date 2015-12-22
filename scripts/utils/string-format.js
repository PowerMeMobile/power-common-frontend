/**
 * Extend javascript `String` type with method same like `String.Format` in C#.
 * Getts from: http://stackoverflow.com/questions/18405736/is-there-a-c-sharp-string-format-equivalent-in-javascript
 */

// TODO: move this to submodules with all common utils
(function(window, document, undefined) {
    'use strict';

    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match
                ;
            });
        };
    }
}(window, document));
