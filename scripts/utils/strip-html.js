(function(app, document, undefined) {
    'use strict';

    /**
     * Extract pure text from HTML.
     * @param {string} html - The content with HTML tags;
     * @returns {string} - The clean text without HTML tags.
     */
    var striphtml = function(html) {
        var text = '';

        if (html !== '') {
            var div = document.createElement('div');

            div.innerHTML = html;
            text = div.textContent || div.innerText;
        }

        return text;
    };

    app.ns('utils').stripHtml = striphtml;
}(App, document));
