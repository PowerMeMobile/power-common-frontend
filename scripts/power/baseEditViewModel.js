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

    function ServerTableViewModel(model) {
        var self = this;

        this.MapToSave = function () {
            return JSON.parse(ko.mapping.toJSON(self, { ignore: self.ignoreOnSave }));
        }

        if (!this.ignoreOnSave) {
            this.ignoreOnSave = ['ignoreOnSave'];
        }

        $.extend(model, App.routers.getHashData());

        this.Search = function () {
            ko.postbox.publish('search');
        }

        ko.postbox.subscribe('search', function () {
            App.routers.setHashData(self.MapToSave());
        });
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

    App.vms.Base.BlockingStatus = BlockingStatus;
    App.vms.Base.AlertStatus = AlertStatus;
    App.vms.Base.BaseEditViewModel = BaseEditViewModel;
    App.vms.Base.BaseValidatableViewModel = BaseValidatableViewModel;
    App.vms.Base.BaseBoxViewModel = BaseBoxViewModel;
    App.vms.Base.ServerTableViewModel = ServerTableViewModel;

}(App, jQuery, ko));