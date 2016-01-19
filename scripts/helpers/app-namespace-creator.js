(function(App, undefined) {
    'use strict';
    
    /**
    * Extend object with namespace and return last object form name space
    *
    * @param {String} namespace Dot separated string with names
    * @returns {Object} Last object form supplied namespace or extendable object if namespace is empty.
    */
    function createNS(namespace) {
        var names = namespace ? namespace.split('.') : [];

        return extend(this, names);
    }

    function extend(parent, names) {
        if (names.length > 0) {
            var name = names.shift();

            if (parent[name] === undefined) {
                parent[name] = {};
            }

            parent = extend(parent[name], names);
        }

        return parent;
    }

    App.ns = createNS;

}(App));
