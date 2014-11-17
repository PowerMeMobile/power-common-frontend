function BackendModule(options) {

    var defaultOptions = {
        urlToCheckHash: null,
        urlToLoad: null,
        urlGetEditView: null
    }

    for (var option in defaultOptions)
        this[option] = options && options[option] !== undefined ? options[option] : defaultOptions[option];

    this.backend = {};
    this.onLoadCallBack;

    this.load = function (hash) {
        var self = this;
        if (hash) {
            self.checkHash(hash)
        } else {
            $.ajax({
                url: self.urlToCheckHash,
                success: function (data) {
                    self.checkHash(data);
                },
                error: function () {
                    self.updateBackend();
                }
            });
        }
        return self;
    }

    this.checkHash = function (hash) {
        if (!hash || !localStorage.backendHash || !localStorage.backend || localStorage.backendHash != hash)
            this.updateBackend();
        else {
            this.backend = JSON.parse(localStorage.backend);
            this.onLoad();
        }
    }

    this.updateBackend = function (hash) {
        var self = this;
        $.get(self.urlToCheckHash, null, function (data) {
            if (data) {
                localStorage.setItem("backendHash", data);
                $.getJSON(self.urlToLoad, null, function (data) {
                    if (data) {
                        localStorage.setItem("backend", JSON.stringify(data));
                        self.backend = data;
                        self.onLoad();
                    }
                });
            }
        });
    }

    this.onLoad = function (func) {
        this.onLoad = func;
    }

    this.getEditView = function (key) {
        return $.ajax(
            {
                url: this.urlGetEditView,
                data: { id: key },
                type: 'POST'
            });
    }
}