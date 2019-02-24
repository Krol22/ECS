const EventAggregator = {
    topics: {},
    publish(eventName: string, ...args: any) {
        if (!this.topics[eventName]) {
            return;
        }

        this.topics[eventName].forEach((callback: Function) => {
            callback(...args);
        });
    },
    subscribe(eventName: string, callback: Function) {
        if (!this.topics[eventName]) {
            this.topics[eventName] = [];
        }

        this.topics[eventName].push(callback);
    }
}

export default EventAggregator;