(function (App, ko, $) {
    'use strict;'

    function DownloadsRouter(baseUrl) {
        var url = baseUrl + 'Downloads/'

        this.export = function (fileData) { return url + 'Export?' + $.param(fileData); }

    }

    App.routers.downloads = new DownloadsRouter(App.routers.baseUrl);

    function DownloadsHelper() {
        this.downloads = function (fileData) {
            if (fileData) {
                window.location = App.routers.downloads.export(fileData);
            }
        }
    }


    App.downloadsHelper = new DownloadsHelper();

}(App, ko, jQuery));
