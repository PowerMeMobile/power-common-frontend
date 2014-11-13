(function (global) {
    'use strict';

    var MessageUtils = (function () {
        var instance;

        var rArabicChars = /[\u0600-\u06FF]/,
          rGSM7BitAlphabetWithoutExtra = /[\u0040\u00A3\u0024\u00A5\u00E8\u00E9\u00F9\u00EC\u00F2\u00E7\u00C7\u000A\u00D8\u00F8\u000D\u00C5\u00E5\u0394\u005F\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039E\u00A0\u000C\u005E\u007B\u007D\u005C\u005B\u007E\u005D\u007C\u20AC\u00C6\u00E6\u00DF\u00C9\u0020-\u0023\u00A4\u0025-\u003F\u00A1\u0041\u0391\u0042\u0392\u0043-\u0045\u0395\u0046-\u0048\u0397\u0049\u0399\u004A\u004B\u039A\u004C\u004D\u039C\u004E\u039D\u004F\u039F\u03A1\u0050-\u0054\u03A4\u0055\u03A5\u0056\u0057\u0058\u03A7\u0059\u005A\u0396\u00C4\u00D6\u00D1\u00DC\u00A7\u00BF\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006A\u006B\u006C\u006D\u006E\u006F\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007A\u00E4\u00F6\u00F1\u00FC\u00E0]/g,
          rAnyCharsExcludeGSM7Bit = /[^\u0040\u00A3\u0024\u00A5\u00E8\u00E9\u00F9\u00EC\u00F2\u00E7\u00C7\u000A\u00D8\u00F8\u000D\u00C5\u00E5\u0394\u005F\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039E\u00A0\u000C\u005E\u007B\u007D\u005C\u005B\u007E\u005D\u007C\u20AC\u00C6\u00E6\u00DF\u00C9\u0020-\u0023\u00A4\u0025-\u003F\u00A1\u0041\u0391\u0042\u0392\u0043-\u0045\u0395\u0046-\u0048\u0397\u0049\u0399\u004A\u004B\u039A\u004C\u004D\u039C\u004E\u039D\u004F\u039F\u03A1\u0050-\u0054\u03A4\u0055\u03A5\u0056\u0057\u0058\u03A7\u0059\u005A\u0396\u00C4\u00D6\u00D1\u00DC\u00A7\u00BF\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006A\u006B\u006C\u006D\u006E\u006F\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007A\u00E4\u00F6\u00F1\u00FC\u00E0\u000C\u005E\u007B\u007D\u005C\u005B\u007E\u005D\u007C\u20AC]/,
          rGSM7BitAlphabetExtra = /[\u000C\u005E\u007B\u007D\u005C\u005B\u007E\u005D\u007C\u20AC]/g,
          rRightTrim = /\s+$/gm;

        var defaultOptions = {
            charsLatinPerPart: 160,
            charsLatinPerMultiPart: 153,
            charsNonLatinPerPart: 70,
            charsNonLatinPerMultiPart: 67
        };

        function Init() {
            var options = defaultOptions;

            /**
             * Get from text count GSM 03.38 extra chars.
             *
             * @param  {string} text Message text.
             * @return {number} Extra chars count.
             */
            var getGSM7BitExtraCharsCount = function (text) {
                if (!text) return 0;

                var extraChars = text.match(rGSM7BitAlphabetExtra);

                return extraChars ? extraChars.length : 0;
            };

            /**
             * Update options.
             *
             * @param {object} newOptions Describing the number of characters
             * in one part of the SMS.
             * @param {number} newOptions.charsLatinPerPart Chars count for one part
             *   message containing only GSM 03.38 symbols if message length not more than this value.
             * @param {number} newOptions.charsLatinPerMultiPart Chars count for one part
             *   message containing only GSM 03.38 symbols if message length more than 'charsLatinPerPart'
             * @param {number} newOptions.charsNonLatinPerPart Chars count for one part
             *   message containing not only GSM 03.38 symbols if message length not more than this value.
             * @param {number} newOptions.charsNonLatinPerMultiPart Chars count for one part
             *   message containing not only GSM 03.38 symbols if message length more than 'charsLatinPerPart'
             */
            var setNewOptions = function (newOptions) {
                options = extend(options, newOptions || {});

                return this;
            };

            /**
             * Checks message text on only GSM 03.38 chars.
             *
             * @param  {string}  text Message text.
             * @return {Boolean}
             */
            var hasOnlyGSM7BitChars = function (text) {
                if (!text) return true;

                return !rAnyCharsExcludeGSM7Bit.test(text);
            };

            /**
             * Checks message text on  Arabic (RTL) chars
             *
             * @param  {string}  text Message text.
             * @return {Boolean}
             */
            var hasArabicChars = function (text) {
                if (!text) return false;

                return rArabicChars.test(text);
            };

            /**
             * Return message text length. In case message text consist only from
             * GSM 03.38 chars increase length on count extra chars if exist.
             *
             * @param  {string} text Message text.
             * @return {number}
             */
            var getMessageLength = function (text) {
                if (!text) return 0;

                var trimedText = text.replace(rRightTrim, ''), // Trim text by Right.
                  textLength = trimedText.length;

                return hasOnlyGSM7BitChars(trimedText)
                        ? textLength + getGSM7BitExtraCharsCount(trimedText)
                        : textLength;
            };

            /**
             * Return message part count accordance with options.
             *
             * @param  {string} text Message text.
             * @return {number}
             */
            var getNumberOfParts = function (text) {
                if (!text) return 0;

                var o = options,
                  messageLength = getMessageLength(text),
                  onlyLatinChars = hasOnlyGSM7BitChars(text),
                  charsPerPart = onlyLatinChars ? o.charsLatinPerPart : o.charsNonLatinPerPart,
                  charsPerMultiPart = onlyLatinChars ? o.charsLatinPerMultiPart : o.charsNonLatinPerMultiPart;

                return (messageLength > charsPerPart)
                    ? Math.ceil(messageLength / charsPerMultiPart)
                    : Math.ceil(messageLength / charsPerPart);
            };

            return {
                options: options,
                setOptions: setNewOptions,
                messageLength: getMessageLength,
                hasRtlChars: hasArabicChars,
                hasOnlyLatinChars: hasOnlyGSM7BitChars,
                partCount: getNumberOfParts
            };
        }

        return {
            getInstance: function (options) {
                if (instance === undefined) {
                    instance = new Init();
                }

                return instance.setOptions(options);
            }
        };

        /**
         * Copy all of the properties in the source objects over to the destination
         * object, and return the destination object. If exist Underscore.js lib use
         * method _.extend().
         *
         * @param  {object} destination Destination object.
         * @param  {object} source Source object.
         * @return {object} Object after copy from source to destination object.
         */
        function extend(destination, source) {
            if (global._) {
                return global._.extend(destination, source);
            } else {
                if (source) {
                    for (var prop in source) {
                        destination[prop] = source[prop];
                    }
                }

                return destination;
            }
        }

    }());

    /**
     * Add shortcut to global for get MessageUtils instance.
     *
     * @param {object} options Describing the number of characters
     * in one part of the SMS. Look at method 'setOptions'.
     * @return {object} MessageUtils instance.
     */
    global.MessageUtils = function (options) {
        return MessageUtils.getInstance(options);
    };

}(this));
