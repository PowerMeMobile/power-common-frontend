(function (App, jQuery, ko) {
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

        this.errors = ko.validation.group(this, { deep: true, live: true });
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

    App.ns('vms.Base').BlockingStatus = BlockingStatus;
    App.ns('vms.Base').AlertStatus = AlertStatus;
    App.ns('vms.Base').BaseEditViewModel = BaseEditViewModel;
    App.ns('vms.Base').BaseValidatableViewModel = BaseValidatableViewModel;
    App.ns('vms.Base').BaseBoxViewModel = BaseBoxViewModel;

}(App, jQuery, ko));