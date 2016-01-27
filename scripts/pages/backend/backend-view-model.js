(function (globals, App, jQuery) {
    'use strict';

    function BackendViewModel(model) {
        var self = this;

        this.SelectedNodeId = ko.observable(model.selectedNodeId);
        this.TreeData = model.treeData;
        this.SearchText = ko.observable().extend({ rateLimit: 200 });

        this.SearchText.subscribe(function (text) {
            jQuery('#backends_tree').jstree(true).search(text);
        });

        this.BackendItem = new App.vms.Backend.BackendItemViewModel();


        this.backendTreeOptions = {
            "core": {
                "animation": 100,
                'data': this.TreeData
            },
            "types": {
                "Property": {
                    "icon": "fa fa-wrench"
                },
                "Container": {
                    "icon": "fa fa-folder"
                }
            },
            "search": {
                "show_only_matches": true,
                "fuzzy": false
            },
            "plugins": [
               "search", "types", "ui"
            ]
        };

        this.RemoteReload = function () {
            self.ReloadBackendTag(true);
        }

        this.ReloadBackendTag = function (update) {
            if (self.SelectedNodeId()) {
                self.BackendItem.BlockingStatus(new App.vms.base.BlockingStatus(true));
                $.ajax({
                    url: App.routers.Backend.EditView(self.SelectedNodeId()),
                    data: { 'remoteReload': typeof update == 'boolean' && update },
                    type: 'POST',
                    success: function (data) {
                        var success = data.indexOf('edit-view') != -1;
                        if (success) {
                            replaceHash('!/' + self.SelectedNodeId());
                            var viewNode = document.getElementById('edit-view');
                            ko.cleanNode(viewNode);
                            $(viewNode).replaceWith(data);
                        }
                        self.BackendItem.Alert(new App.vms.base.AlertStatus(success, success ? null : LocalizationStrings.InternalError));
                        self.BackendItem.BlockingStatus(new App.vms.base.BlockingStatus(false, null));
                    },
                    error: function () {
                        self.BackendItem.BlockingStatus(new App.vms.base.BlockingStatus(false, false));
                    }
                });
            }
        }

        this.SelectedNodeId.subscribe(this.ReloadBackendTag);
    }

    if (!App.vms.Backend) App.vms.Backend = {};

    App.vms.Backend.BackendViewModel = BackendViewModel;

}(this, App, jQuery));