if (typeof ko != 'undefined') {
    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, function () {
                return !ko.utils.unwrapObservable(valueAccessor());
            });
        }
    };

    ko.observable.fn.toggle = function () {
        var obs = this;
        return function () {
            obs(!obs())
        };
    };

    ko.bindingHandlers.datetimepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //convert string to moment datetime
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (typeof value == 'string')
                valueAccessor()(new moment(value));
            //initialize datepicker with some optional options
            var options = allBindingsAccessor().datetimepickerOptions || {};
            $(element).datetimepicker(options).on("change.dp", function (ev) {
                var observable = valueAccessor();
                if (typeof ev.date != 'undefined')
                    observable(ev.date);
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).data("DateTimePicker").setDate(value);
        }
    };

    ko.bindingHandlers.jstree = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().optionsFunction() || {};
            $(element).jstree(options).on("changed.jstree", function (e, data) {
                var observable = valueAccessor();
                if (typeof data != 'undefined')
                    debugger;
                observable(data.selected);
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).jstree(true).deselect_all(true);
            $(element).jstree(true).select_node(value);
        }
    };

    ko.bindingHandlers.backendJstree = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().optionsFunction() || {};
            $(element).jstree(options).on("changed.jstree", function (e, data) {
                var observable = valueAccessor();
                if (typeof data != 'undefined' && data.node.type == "Property")
                    observable(data.selected);
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).jstree(true).deselect_all(true);
            $(element).jstree(true).select_node(value);
        }
    };

    ko.bindingHandlers.select2 = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var obj = valueAccessor(),
                allBindings = allBindingsAccessor(),
                lookupKey = allBindings.lookupKey;
            $(element).select2(obj);
            if (lookupKey) {
                var value = ko.utils.unwrapObservable(allBindings.value);
                $(element).select2('data', ko.utils.arrayFirst(obj.data.results, function (item) {
                    return item[lookupKey] === value;
                }));
            }

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });
        },
        update: function (element) {
            $(element).trigger('change');
        }
    };


    ko.bindingHandlers.dataTable = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var binding = ko.utils.unwrapObservable(valueAccessor());
            var options = allBindingsAccessor().optionsFunction($(element).attr('id')) || {};
            $(element).dataTable(options);
        },
        update: function (element, valueAccessor) {
            var binding = ko.utils.unwrapObservable(valueAccessor());

            // If the binding isn't an object, turn it into one. 
            if (!binding.data) {
                binding = { data: valueAccessor() }
            }

            // Clear table
            $(element).dataTable().fnClearTable();

            // Rebuild table from data source specified in binding
            $(element).dataTable().fnAddData(binding.data());
        }
    };

    ko.bindingHandlers.numericValue = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var underlyingObservable = valueAccessor();
            var interceptor = ko.dependentObservable({
                read: underlyingObservable,
                write: function (value) {
                    if (!isNaN(value)) {
                        underlyingObservable(parseFloat(value));
                    }
                },
                disposeWhenNodeIsRemoved: element
            });
            ko.bindingHandlers.value.init(element, function () { return interceptor }, allBindingsAccessor);
        },
        update: ko.bindingHandlers.value.update
    };
}