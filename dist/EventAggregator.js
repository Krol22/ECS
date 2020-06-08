"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventAggregator = {
    topics: {},
    publish: function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.topics[eventName]) {
            return;
        }
        this.topics[eventName].forEach(function (callback) {
            callback.apply(void 0, args);
        });
    },
    subscribe: function (eventName, callback) {
        if (!this.topics[eventName]) {
            this.topics[eventName] = [];
        }
        this.topics[eventName].push(callback);
    }
};
exports.default = EventAggregator;
//# sourceMappingURL=EventAggregator.js.map