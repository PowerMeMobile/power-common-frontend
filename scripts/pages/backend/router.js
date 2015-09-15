(function (App) {
    'use strict';

    function BackendRouter(url) {
        var baseUrl = url + 'Backend/';

        this.EditView = function (id) { return baseUrl + 'Edit/' + id; };
        this.Save = function () { return baseUrl + 'Save/'; };
    }

    App.routers.Backend = new BackendRouter(App.baseUrl);

}(App));