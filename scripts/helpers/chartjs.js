(function(app, document, undefined) {
    'use strict';

    var defaultPieOptions = {
        customTooltips: function(tooltip) {
            var tooltipElement = app.helpers.charts.tooltip.getTooltipElement();

            // tooltip will be false if tooltip is not visible or should be hidden
            if (!tooltip) {
                tooltipElement.hide();

                return;
            }

            var offset = $(tooltip.chart.canvas).offset();

            tooltipElement.text(app.utils.unescape(tooltip.text));
            tooltipElement.css({
                top: offset.top + tooltip.x,
                left: offset.left + tooltip.y
            });

            tooltipElement.show();
        }
    };

    app.ns('helpers.charts.chartjsPie').defaultOptions = defaultPieOptions;

}(App, window.document));
