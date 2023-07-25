export declare type EventOptions = {
    /**
     * Callback called when the event is successfully sent.
     */
    readonly callback?: () => void;
    /**
     * Properties to be bound to the event.
     */
    readonly props?: {
        readonly [propName: string]: string | number | boolean;
    };
};
