import { instanceToInstance } from "class-transformer";

export type ActionType = string;

export interface ActionI<T> {
    GetType: () => ActionType;

    GetPayload: () => T;
}

class Action<T> {
    private readonly type: ActionType;
    private payload: T;

    constructor(type: string) {
        this.type = type;
    }

    Payload(payload: T): Action<T> {
        const clone = instanceToInstance(this);
        clone.payload = payload;
        return clone;
    }

    GetPayload(): T {
        return this.payload;
    }

    GetType(): ActionType {
        return this.type;
    }
}
export class Event<T> extends Action<T> implements ActionI<T> {

}

export class Request<T> extends Action<T> implements ActionI<T> {

}
