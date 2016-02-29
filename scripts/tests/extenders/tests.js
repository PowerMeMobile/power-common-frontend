(function () {
    'use strict';

    let samples = {
        decoded: "'&'\"#!;",
        encoded: "&#39;&amp;&#39;\&quot;#!;"
    };

    describe("Decode values", () => {
        context("with App.utils", () => {
            it("should be equals", () => {
                chai.assert.equal(App.utils.unescape(samples.encoded), samples.decoded);
            });
        });

        context("with ko extenders", () => {
            it("should be equals", () => {
                var obs = ko.observable(samples.encoded).extend({ escaped: true });
                chai.assert.equal(obs(), samples.decoded);
            });
        });
    });

    describe("Changing value in observable", () => {
        context("with the same value, but decoded", () => {
            it("should not generate event", (done) => {
                var obs = ko.observable(samples.decoded).extend({ escaped: true });
                obs.subscribe((val) => {
                    if (val !== "ok") {
                        chai.assert.equal(val, samples.decoded);
                        chai.assert.fail("", "", "Event was fired");
                    }
                    done();
                });
                obs(samples.encoded);
                obs("ok");
            });
        });
    });

    describe("Writable pure computed", () => {
        context("with escaper extender", () => {
            it("should get escaped value", (done) => {
                let store;
                let comp = ko.pureComputed({
                    read: function () {
                        return store;
                    },
                    write: function (value) {
                        if (value !== store) {
                            store = value;
                        } else if (value) {
                            chai.assert.equal(value, samples.decoded);
                            chai.assert.equal(store, samples.decoded);
                            done();
                        }
                    }
                }).extend({ escaped: true, rateLimit: 10 });
                comp(samples.encoded);
                comp(samples.encoded);
            });
        });
    });
} ());