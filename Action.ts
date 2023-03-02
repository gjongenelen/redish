export type ActionType = string;

export interface ActionI<T> {
    GetType: () => ActionType;

    GetPayload: () => T;
}

class Action<T> {
    private type: ActionType;
    private payload: T;

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
