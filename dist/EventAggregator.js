"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventAggregator = {
    topics: {},
    publish(eventName, ...args) {
        if (!this.topics[eventName]) {
            return;
        }
        this.topics[eventName].forEach((callback) => {
            callback(...args);
        });
    },
    subscribe(eventName, callback) {
        if (!this.topics[eventName]) {
            this.topics[eventName] = [];
        }
        this.topics[eventName].push(callback);
    }
};
exports.default = EventAggregator;
//# sourceMappingURL=EventAggregator.js.map