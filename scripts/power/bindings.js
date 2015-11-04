if (typeof ko != 'undefined') {
    ko.observableArray.fn.setAt = function (index, value) {
        this.valueWillMutate();
        this()[index] = value;
        this.valueHasMutated();
    }

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
            var options = allBindingsAccessor().datetimepickerOptions || {
                format: App.backend.LocalizationSettings.DatetimePickerFormat
            };
            $(element).datetimepicker(options).on("dp.change", function (ev) {
                var observable = valueAccessor();
                if (typeof ev.date != 'undefined') {
                    observable($(element).data("DateTimePicker").unset ? null : ev.date);
                }
            });
            $(element).datetimepicker(options).on("dp.error", function (ev) {
                var observable = valueAccessor();
                observable(null);
            });
            if (options && options.disabled) {
                $(element).data("DateTimePicker").disable();
            }
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (!($(element).data("DateTimePicker").unset && value === null)) {
                $(element).data("DateTimePicker").setDate(value);
            }
        }
    };
    ko.bindingHandlers.datepickerMinDate = {
        after: ['datetimepicker'],
        update: function (element, valueAccessor) {
            var currentDate = $(element).data("DateTimePicker").getDate();
            var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).data("DateTimePicker").setMinDate(value);
            if (currentDate != null && currentDate < value) {
                $(element).data("DateTimePicker").setDate(value);
            }
        }
    };

    ko.bindingHandlers.datepickerMaxDate = {
        after: ['datetimepicker'],
        update: function (element, valueAccessor) {
            var currentDate = $(element).data("DateTimePicker").getDate();
            var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).data("DateTimePicker").setMaxDate(value);
            if (currentDate != null && currentDate > value) {
                $(element).data("DateTimePicker").setDate(value);
            }

        }
    };


    ko.bindingHandlers.jstree = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().optionsFunction() || {};
            $(element).jstree(options).on("changed.jstree", function (e, data) {
                var observable = valueAccessor();
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
            var options = ko.utils.unwrapObservable(allBindingsAccessor().treeOptions) || {};
            $(element).jstree(options).on("changed.jstree", function (e, data) {
                var observable = valueAccessor();
                if (data && data.node && data.node.type == "Property") {
                    if (data.selected.length > 0) observable(data.selected[0]);
                }
            });

            $(element).bind("select_node.jstree", function (e, data) {
                return data.instance.toggle_node(data.node);
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var tree = $(element).jstree(true);
            if (value != tree.get_selected()[0]) {
                tree.deselect_all(true);
                tree.select_node(value);
            }
        }
    };

    ko.bindingHandlers.select2 = {
        after: ['options', 'foreach'],
        init: function (element, valueAccessor, allBindingsAccessor) {
            var obj = valueAccessor(),
                allBindings = allBindingsAccessor();

            if (obj.query && obj.value && obj.value() && obj.value().length) {
                obj.initSelection = function (element, callback) {
                    var deffered = obj.query({ term: null, callback: function () { } });
                    if (deffered && deffered.then) {
                        deffered.then(function (data) {
                            if (data.success && data.obj) {
                                callback(Array.isArray(obj.value()) ? obj.value().map(function (i) {
                                    return { id: i, text: ko.utils.arrayFirst(data.obj, function (d) { return d.id == i; }).text };
                                }) : { id: obj.value(), text: ko.utils.arrayFirst(data.obj, function (d) { return d.id == obj.value(); }).text });
                            }
                        });
                    } else {
                        callback(Array.isArray(obj.value()) ? obj.value().map(function (i) { return { id: i, text: i } }) : { id: obj.value(), text: obj.value() });
                    }
                }

                $(element).select2(obj);
                $(element).select2("val", []);
            }
            else {
                $(element).select2(obj);
            }

            if (obj.value) {
                $(element).on('change', function () {
                    obj.value($(element).select2("val"));
                });
            }

            if (obj.events)
                for (var event in obj.events)
                    $(element).on(event, obj.events[event]);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).select2('destroy');
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var obj = valueAccessor(),
                allBindings = allBindingsAccessor(),
                value = ko.utils.unwrapObservable(allBindings.value || allBindings.selectedOptions);

            if (typeof (value) !== 'undefined' && value !== $(element).select2('val')) {
                if (obj.query) {
                    $(element).trigger('change');
                } else {
                    $(element).select2('val', value);
                };
            }
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
            if (binding) {
                if (!binding.data) {
                    binding = { data: valueAccessor() }
                }

                $(element).dataTable().fnClearTable(false);
                $(element).dataTable().fnAddData(binding.data(), false);
                $(element).dataTable().fnDraw();
            }
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

    ko.bindingHandlers.select2placeholder = {
        after: ['select2'],
        init: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value)
                $(element).attr('placeholder', value);
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value) {
                $(element).attr('placeholder', value);
                var newValues = ko.utils.unwrapObservable(allBindingsAccessor().selectedOptions);
                if (newValues && newValues.length == 0)
                    $(element).select2("val", "");
            }
        }
    };

    ko.bindingHandlers.easyPieChart = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().options || {};
            options.lineWidth = options.lineWidth || 5;
            options.barColor = options.barColor || '#cf1e25';
            $(element).easyPieChart(options);
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).data('easyPieChart').update(value);
        }
    };

    ko.bindingHandlers.xcharts = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var data = ko.utils.unwrapObservable(valueAccessor());
            var options = allBindingsAccessor().optionsFunction() || {};
            var type = allBindingsAccessor().chartType;
            var chart = new xChart(type, data, element, options);
            $(element).data('float-chart', chart);
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var chart = $(element).data('float-chart');
            chart.setData(value);
        }
    };

    ko.bindingHandlers.chart = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var data = ko.utils.unwrapObservable(valueAccessor());
            var options = allBindingsAccessor().chartOptions || {};
            var ctx = element.getContext("2d");
            var chart = new Chart(ctx).Pie(data, options);
            $(element).data('chart.js-chart', chart);
            $(element).data('chart.js-data', data);
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            var data = ko.utils.unwrapObservable(valueAccessor());
            if (data != $(element).data('chart.js-data')) {
                var chart = $(element).data('chart.js-chart');
                var dSeg = [];
                chart.segments.forEach(function (v, i) {
                    var ns = data.filter(function (el) { return el.label == v.label })[0];
                    if (!ns)
                        dSeg.push(v);
                    else
                        v.value = ns.value;
                }, this);

                chart.update();

                dSeg.forEach(function (v) {
                    chart.removeData(chart.segments.indexOf(v));
                });

                data.forEach(function (v) {
                    var ns = chart.segments.filter(function (el) { return el.label == v.label })[0];
                    if (!ns)
                        chart.addData(v);
                }, this);
            }
        }
    };

    ko.bindingHandlers.toggle = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var options = allBindingsAccessor().toggleOptions || {};
            $(element).bootstrapToggle(options);
            $(element).change(function () {
                valueAccessor()($(this).prop('checked'));
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var vStatus = $(element).prop('checked');
            var vmStatus = ko.utils.unwrapObservable(valueAccessor());
            if (vStatus != vmStatus) {
                $(element).bootstrapToggle(vmStatus ? 'on' : 'off');
            }
        }
    };

    ko.bindingHandlers.typeahead = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);
            var allBindings = allBindingsAccessor();
            var typeaheadOpts = { source: ko.utils.unwrapObservable(valueAccessor()) };
            if (allBindings.typeaheadOptions) {
                $.each(allBindings.typeaheadOptions, function (optionName, optionValue) {
                    typeaheadOpts[optionName] = ko.utils.unwrapObservable(optionValue);
                });
            }
            $element.attr("autocomplete", "off").typeahead(typeaheadOpts);
        }
    };

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var shouldDisplay = ko.utils.unwrapObservable(valueAccessor());
            $(element).toggle(shouldDisplay);
        },
        update: function (element, valueAccessor) {
            var shouldDisplay = ko.utils.unwrapObservable(valueAccessor());
            shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.bindingHandlers.collapseBox = {
        init: function (element, valueAccessor) {
            var isCollapsed = ko.utils.unwrapObservable(valueAccessor());
            App.collapseBox(isCollapsed, element);
        },
        update: function (element, valueAccessor) {
            var isCollapsed = ko.utils.unwrapObservable(valueAccessor());
            App.collapseBox(isCollapsed, element);
        }
    };

    ko.bindingHandlers.block = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var options = $.extend({}, App.block, ko.utils.unwrapObservable(allBindingsAccessor().blockOptions));
            var updatingStatus = ko.utils.unwrapObservable(valueAccessor());
            if (typeof updatingStatus == 'object') {
                if (updatingStatus.isUpdating && options.showSpinner) {
                    $(element).block();
                } else {
                    if (options.showSpinner)
                        $(element).unblock();

                    setTimeout(function () {
                        if (updatingStatus.success === true && !options.skipSuccess)
                            App.blockUIWithStatus(element, true);
                        else if (updatingStatus.success === false && !options.skipError)
                            App.blockUIWithStatus(element, false);
                    }, 0);
                }
            }
        }
    };

    ko.bindingHandlers.alert = {
        init: function (element, valueAccessor) {
            $(element).append('<p></p>');
        },
        update: function (element, valueAccessor) {
            var alert = ko.utils.unwrapObservable(valueAccessor());
            if (alert && alert.message) {
                $(element).show();
                if (alert.success) {
                    $(element).removeClass('alert-danger');
                    $(element).addClass('alert-success');
                } else {
                    $(element).addClass('alert-danger');
                    $(element).removeClass('alert-success');
                }
                $(element).find('p').text(alert.message);
            } else if (alert && alert.success) {
                $(element).hide();
            }
        }
    };

    ko.bindingHandlers.colorButtonStatus = {
        init: function (element, valueAccessor) { },
        update: function (element, valueAccessor) {
            var updatingStatus = ko.utils.unwrapObservable(valueAccessor());
            if (typeof updatingStatus == 'object' && typeof updatingStatus.success == 'boolean') {
                App.handleButtonColor(element, updatingStatus.success);
            }
        }
    };

    ko.bindingHandlers.lazyOptions = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var load = valueAccessor().options.load;
            var oldValue = ko.utils.unwrapObservable(valueAccessor());
            load().done(function (data) {
                valueAccessor().options(data.obj);
                if (ko.utils.unwrapObservable(valueAccessor()) != oldValue)
                    valueAccessor()(oldValue);
            });
        }
    };

    ko.bindingHandlers.serverDataTable = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var options = ko.utils.unwrapObservable(valueAccessor())();
            var table = $(element).DataTable(options);
            $(element).data('tableInstance', table);

            var lazyEvent = ko.observable().extend({ rateLimit: 100 });

            ko.postbox.subscribe('search', function (data) {
                lazyEvent({});
            });

            lazyEvent.subscribe(function () {
                table.ajax.reload();
            });

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                table.destroy();
            });
        },
    };

    ko.bindingHandlers.replicate = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var id = ko.utils.unwrapObservable(valueAccessor());
            element.innerHTML = document.getElementById(id).innerHTML;
        },
    };

    ko.bindingHandlers.clientDataTable = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = allBindingsAccessor().optionsFunction();
            var data = ko.utils.unwrapObservable(valueAccessor());
            options.data = data;
            options.createdRow = function (row, data, index) {
                ko.cleanNode(row);
                ko.applyBindingsToDescendants(bindingContext.createChildContext(data), row);
            };
            setTimeout(function () {
                var table = $(element).DataTable(options);
                $(element).data('tableInstance', table);
            }, 10);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                table.destroy();
            });
        },
        update: function (element, valueAccessor) {
            var table = $(element).data('tableInstance');
            var data = ko.utils.unwrapObservable(valueAccessor());
            if (table) {
                table.clear();
                table.rows.add(data);
                table.draw();
            }
        }
    }
}