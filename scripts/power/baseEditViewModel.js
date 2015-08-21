(function (globals, App, jQuery, ko) {
    'use strict';

    function BaseEditViewModel() {
        var self = this;

        this.BlockingStatus = ko.observable();
        this.Alert = ko.observable();

        this.MapToSave = function () {
            return ko.mapping.toJSON(self, { ignore: self.ignoreOnSave });
        }

        this.ignoreOnSave = ['ignoreOnSave', 'BlockingStatus', 'Alert'];
    }

    function BaseBoxViewModel() {
        var self = this;

        this.isCollapsed = ko.observable(false);

        this.collapseToggle = function () {
            self.isCollapsed(!self.isCollapsed());
            return false;
        }

        if (this.ignoreOnSave) {
            this.ignoreOnSave = this.ignoreOnSave.concat(['isCollapsed']);
        }
    }

    function BaseValidatableViewModel() {
        var self = this;

        this.errors = ko.validation.group(this, { deep: true });
        this.isValid = ko.pureComputed(function () { return self.errors().length === 0 });

        if (this.ignoreOnSave) {
            this.ignoreOnSave = this.ignoreOnSave.concat(['errors', 'isValid']);
        }
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
    globals.BaseValidatableViewModel = BaseValidatableViewModel;
    globals.BaseBoxViewModel = BaseBoxViewModel;

}(this, App, jQuery, ko));