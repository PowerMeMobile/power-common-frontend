(function(app, document, undefined) {
    'use strict';

    var tooltipId = 'chart-tooltip',
        tooltipTempalte = '<div id="{0}" class="ex-tooltip"></div>'.format(tooltipId);

    /**
     * Return existing element for chart tooltip or create it.
     * 
     * @returns {Object}  Div element as jQuery object.
     */
    var getCustomTooltipElement = function() {
        var customTooltipElement = $('#' + tooltipId);

        if (customTooltipElement.length === 0) {
            // Append to the end of the body to avoid tooltip bad position.
            customTooltipElement = $(tooltipTempalte).appendTo(document.body);
        }

        return customTooltipElement.eq(0);
    };

    app.ns('helpers.charts.tooltip').getTooltipElement = getCustomTooltipElement;

}(App, window.document));
