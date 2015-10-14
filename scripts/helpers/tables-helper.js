(function (App, ko, $) {
    'use strict;'

    function TablesHelper() {
        var self = this;

        var baseOptions = {
            language: {
                processing: '<div class="blocking"><i class="fa fa-spinner fa-spin fa-3x"></i></div>'
            },
            autoWidth: false,
            dom: '<"row"<"col-sm-6"l>><"row"<"col-xs-12"<"table-responsive"t><"new-table"r>>><"row"<"col-sm-6"><"col-sm-6"p>>'
        }

        var serverOptions = {
            serverSide: true,
            deferRender: true,
            processing: true,
            ajax: {
                type: 'POST',
                contentType: 'application/json'
            }
        }

        this.composeServerOptions = function (options, vm) {
            var options = $.extend(true, {}, baseOptions, serverOptions, options);
            options.ajax.data = function (data, settings) {
                var filter = vm.MapToSave();
                return JSON.stringify({ data: data, filter: filter });
            }

            return options;
        }

        this.linkTo = function (url, text, options) {
            return $("<a />",
                $.extend(options, {
                    href: url,
                    text: text
                }))[0].outerHTML;
        }

        this.dateTime = function (data) {
            return data ? new moment(data).format(App.backend.LocalizationSettings.DefaultDateTimeFormat) : null;
        }

        this.timeDate = function (data) {
            return data ? new moment(data).format(App.backend.LocalizationSettings.TimeDateFormat) : null;
        }
    }


    App.TablesHelper = new TablesHelper();

}(App, ko, jQuery));
