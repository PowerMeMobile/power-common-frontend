(function () {
    'use strict';
    describe("VM-data select binded", () => {
        context("to plain array", () => {
            it("should have 3 options with selected '2'", () => {
                const selected = '2';
                let vm = {
                    data: ['1', '2', '3'],
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#simple-select')[0]);
                chai.assert.equal(vm.val(), selected);
            });
        });
        context("to plain array & optionsCaption", () => {
            it("should have 3 options with selected '2'", () => {
                const selected = '2';
                let vm = {
                    data: ['1', '2', '3'],
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#simple-select-with-optionsCaption')[0]);
                chai.assert.equal(vm.val(), selected);
            });
        });
        context("to just value & predefinded values", () => {
            it("should have 3 options with selected '2'", () => {
                const selected = '2';
                let vm = {
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#simple-select-with-predefinded')[0]);
                chai.assert.equal(vm.val(), selected);
            });
        });
        context("to just value & predefinded values & placeholders", () => {
            it("should have 3 options with not selected value", () => {
                const selected = '';
                let vm = {
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#select-with-predefinded-valueAllowUnset-empty')[0]);
                chai.assert.equal(vm.val(), selected);
            });
            it("should have 3 options with selected '2'", () => {
                const selected = '2';
                let vm = {
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#select-with-predefinded-valueAllowUnset')[0]);
                chai.assert.equal(vm.val(), selected);
            });
        });
        context("to array of object", () => {
            it("should have 3 options with selected '2'", () => {
                const selected = 2;
                let vm = {
                    data: [
                        { id: 1, title: "1" },
                        { id: 2, title: "2" },
                        { id: 3, title: "3" }
                    ],
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#select-to-object-array')[0]);
                chai.assert.equal(vm.val(), selected);
            });
        });
    });
    describe("VM-data multiple select binded", () => {
        context("with plain array", () => {
            it("should have 3 options with selected 2,3", () => {
                const selected = [2, 3];
                let vm = {
                    data: [1, 2, 3],
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#multiple-select-plain-array')[0]);
                chai.assert.sameMembers(vm.val(), selected);
            });
        });
        context("to plain array", () => {
            it("should have 3 options with not selected value", () => {
                const selected = [];
                let vm = {
                    data: [1, 2, 3],
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#multiple-select-plain-array-empty')[0]);
                chai.assert.sameMembers(vm.val(), selected);
            });
        });
    });
    describe("VM-data select binded", () => {
        context("to a ajax query", () => {
            it("should have 3 options with selected '2'", (done) => {
                const selected = 'guid2';
                let vm = {
                    load: (query) => {
                        return new Promise((resolve) => setTimeout(() => {
                            let data = {
                                success: true, obj: [
                                        { id: 'guid1', text: "1" },
                                        { id: 'guid2', text: "2" },
                                        { id: 'guid3', text: "3" }
                                ]
                            };
                            query.callback({ results: data.obj });
                            resolve(data);
                        }, 0));
                    },
                    val: ko.observable(selected)
                };
                ko.applyBindings(vm, $('#query-select-single-val')[0]);
                setTimeout(() => {
                    chai.assert.equal(vm.val(), selected, 'Invalid vm value');
                    chai.assert.equal($('#query-select-single-val input[role="search"]').val(), selected, 'Invalid select value');
                    done();
                }, 10);
            });
        });
    });
    describe("VM-data multi select binded", () => {
        context("to a ajax query", () => {
            it("should have 3 options with selected '2,3'", (done) => {
                const selected = ['guid2', 'guid3'];
                let vm = {
                    load: (query) => {
                        return new Promise((resolve) => setTimeout(() => {
                            let data = {
                                success: true, obj: [
                                        { id: 'guid1', text: "1" },
                                        { id: 'guid2', text: "2" },
                                        { id: 'guid3', text: "3" }
                                ]
                            };
                            query.callback({ results: data.obj });
                            resolve(data);
                        }, 0));
                    },
                    val: ko.observableArray(selected)
                };
                ko.applyBindings(vm, $('#query-select-multi-val')[0]);
                setTimeout(() => {
                    chai.assert.sameMembers(vm.val(), selected, 'Invalid vm value');
                    chai.assert.sameMembers($('#query-select-multi-val input[role="search"]').val().split(','), selected, 'Invalid select value');
                    done();
                }, 10);
            });
        });
    });
    describe("VM-data multi select binded", () => {
        context("to a plain array", () => {
            it("should have 3 options with selected '2,3' and after '1,2'", (done) => {
                const selected = ['2', '3'];
                let vm = {
                    data: ['1', '2', '3'],
                    val: ko.observableArray(selected)
                };
                ko.applyBindings(vm, $('#select-multi-val-changed')[0]);
                setTimeout(() => {
                    chai.assert.sameMembers(vm.val(), selected, 'Invalid vm value');
                    chai.assert.sameMembers($('#select-multi-val-changed select').val(), selected, 'Invalid select value');
                }, 10);
                const selected_new = ['1', '2'];
                setTimeout(() => {
                    vm.val(selected_new);
                }, 20);
                setTimeout(() => {
                    chai.assert.sameMembers(vm.val(), selected_new, 'Invalid vm value after change');
                    chai.assert.sameMembers($('#select-multi-val-changed select').val(), selected_new, 'Invalid select value after change');
                    chai.assert.sameMembers(getSelect2Choices('#select-multi-val-changed'), selected_new, 'Invalid select value after change');
                    done();
                }, 40);
            });
        });
    });

    function getSelect2Choices(id) {
        return $(id).find('.select2-search-choice div').toArray().map((el) => $(el).text());
    }
}());