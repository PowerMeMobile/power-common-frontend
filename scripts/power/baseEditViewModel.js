(function (globals, App, jQuery) {
    'use strict';

    function BaseEditViewModel() {
        this.BlockingStatus = ko.observable();
        this.Alert = ko.observable();
    }

    function BlockingStatus(isUpdating, success) {
        return {
            isUpdating: isUpdating,
            success: success
        };
    }

    function AlertStatus(success, message) {
        return {
            success: success,
            message: message
        }
    }

    globals.BlockingStatus = BlockingStatus;
    globals.AlertStatus = AlertStatus;
    globals.BaseEditViewModel = BaseEditViewModel;

}(this, App, jQuery));