(function (App, ko, $) {
    'use strict;'

    var defaultTooltipRenderer = function(x, y) {
        return x + ' : ' + y;
    };

    /**
     * Compose function for show tooltip on mouseover event with custom text render.
     *
     * @param {function=} render Function for render tooltip text if not specified used @function defaultTooltipRenderer.
     * @returns {function} Function for display tooltip on chart on mouseover event.
     */
    var composeDisplayTooltipFunc = function(render) {
        render = render || defaultTooltipRenderer;

        return function(data, i) {
            var tooltip = App.helpers.charts.tooltip.getTooltipElement(),
                pos = $(this).offset();

            tooltip.text(render(data.x, data.y));
            tooltip.css({
                top: pos.top - 32, // Up tooltip on his hieght.
                left: pos.left
            });

            tooltip.show();
        }
    };

    var defaultOptions = {
        mouseover: composeDisplayTooltipFunc(),
        mouseout: function(x) {
            var tooltip = App.helpers.charts.tooltip.getTooltipElement();

            tooltip.hide();
        }
    };

    var getDefaultOtipnsWithCustomTooltipTextRender = function(textRender) {
        var optionsWithCustomRender = {
            mouseover: composeDisplayTooltipFunc(textRender)
        };

        return $.extend(true, {}, defaultOptions, optionsWithCustomRender);
    };

    var dateFormat = '%d.%m %H:%M';

    App.ns('helpers.charts.xcharts').defaultOptions = defaultOptions;
    App.ns('helpers.charts.xcharts').defaultOtipnsWithCustomTooltipTextRender = getDefaultOtipnsWithCustomTooltipTextRender;
    App.ns('helpers.charts.xcharts').dateFormat = dateFormat;
}(App, ko, jQuery));
