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
            var options = allBindingsAccessor().datetimepickerOptions || {};
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
            $(element).data("DateTimePicker").setDate(value);
        }
    };

    ko.bindingHandlers.datepickerMinDate = {
        after: ['datetimepicker'],
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).data("DateTimePicker").setMinDate(value);
        }
    };

    ko.bindingHandlers.datepickerMaxDate = {
        after: ['datetimepicker'],
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
            current = $(element).data("DateTimePicker").setMaxDate(value);
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

            if (obj.allowClear) {
                $(element).prepend('<option value="" selected="selected"></option>');
            };

            $(element).select2(obj);
            if (lookupKey) {
                var value = ko.utils.unwrapObservable(allBindings.value);
                $(element).select2('data', ko.utils.arrayFirst(obj.data.results, function (item) {
                    return item[lookupKey] === value;
                }));
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
            if (obj.query) {
                $(element).trigger('change');
            }
            else if (value) {
                $(element).select2('val', value);
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
            var chart = new xChart(type, data, '#' + element.id, options);
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

    ko.bindingHandlers.leafletmap = {
        init: function(element, valueAccessor, allBindings) {
            var $element = $(element),
                mapOptions = allBindings.get('mapOptions') || {},
                saveCallback = allBindings.get('saveZone'),
                zoom = mapOptions.zoom || 5,
                center = mapOptions.center || [26.940, 43.614],
                urlTemplate = mapOptions.urlTemplate || 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                tileLayerOptions = {
                    attribution: mapOptions.attribution || '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: mapOptions.maxZoom || 18
                },
                map = L.map(element,{ fullscreenControl: true }).setView(center, zoom),
                plugin = new L.Control.DrawSetShapes({
                    onSave: saveCallback
                });

            L.tileLayer(urlTemplate, tileLayerOptions).addTo(map);

            plugin.addTo(map);

            // Save plugin to data in element for future using on update
            $element.data('map-plugin', plugin);
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var $element = $(element),
                plugin = $element.data('map-plugin'),
                zone = ko.unwrap(valueAccessor());

            if (zone && zone.GeoJsonMaps) {
                plugin.loadData(JSON.parse(zone.GeoJsonMaps));
            } else {
                plugin.clearData();
            }
        }
    };
}