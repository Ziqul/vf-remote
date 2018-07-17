(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.vfRemote = factory());
}(this, (function () { 'use strict';

    var methodHandler = {
        get: function(obj, prop) {
            return function() {
                var args = (
                    arguments.length === 1 ?
                    [arguments[0]] :
                    Array.apply(null, arguments));

                var methodName = obj.prop + '.' + prop;

                return new Promise(function(resolve, reject) {
                    var actionArgs = [methodName];

                    actionArgs = actionArgs.concat(args);

                    actionArgs = actionArgs.concat([function(result, event) {
                        if (event.status) {
                            resolve(result);
                        } else {
                            reject(event);
                        }
                    }]);

                    actionArgs = actionArgs.concat(
                        [{ buffer: true, escape: false, timeout: 30000 }]);

                    Visualforce
                        .remoting.Manager
                        .invokeAction.apply(
                            Visualforce.remoting.Manager, actionArgs);
                });
            };
        }
    };

    var classHandler = {
        get: function(obj, prop) {
            return new Proxy({prop: prop}, methodHandler);
        }
    };

    var vfRemote = new Proxy({}, classHandler);

    return vfRemote;

})));
