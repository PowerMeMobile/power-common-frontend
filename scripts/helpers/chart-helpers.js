(function (App, ko, $) {
    'use strict;'

    function ChartHelper() {
        var self = this;
        var tooltip;

        var defaultTooltipRenderer = function (x, y) {
            return x + ' : ' + y;
        }

        this.composeBarOptions = function (renderTooltip) {
            if (!renderTooltip)
                renderTooltip = defaultTooltipRenderer;

            return {
                mouseover: function (d, i) {
                    var pos = $(this).offset();
                    $(tooltip).text(renderTooltip(d.x, d.y))
                      .css({ top: pos.top - 32, left: pos.left })
                      .show();
                },
                mouseout: function (x) {
                    $(tooltip).hide();
                }
            }
        }

        $(document).ready(function () {
            tooltip = $('<div id="chart-tooltip" class="ex-tooltip"></div>').appendTo(document.body);
        });
    }


    App.ns('helpers').chart = new ChartHelper();

}(App, ko, jQuery));
