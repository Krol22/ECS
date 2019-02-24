declare const EventAggregator: {
    topics: {};
    publish(eventName: string, ...args: any): void;
    subscribe(eventName: string, callback: Function): void;
};
export default EventAggregator;
