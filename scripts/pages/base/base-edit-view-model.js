(function (App, $, ko) {
    'use strict';

    function BaseEditableViewModel(model) {
        var self = this;

        this.BlockingStatus = ko.observable();
        this.Alert = ko.observable((model && model.alert) ? model.alert : null);

        this.MapToSave = function () {
            return ko.mapping.toJSON(self, { ignore: self.ignoreOnSave });
        }

        this.ignoreOnSave = ['ignoreOnSave', 'BlockingStatus', 'Alert'];
    }

    function BaseCollapsibleViewModel() {
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

    App.ns('vms.base').BlockingStatus = BlockingStatus;
    App.ns('vms.base').AlertStatus = AlertStatus;
    App.ns('vms.base').Editable = BaseEditableViewModel;
    App.ns('vms.base').Validatable = BaseValidatableViewModel;
    App.ns('vms.base').Collapsible = BaseCollapsibleViewModel;

}(App, jQuery, ko));