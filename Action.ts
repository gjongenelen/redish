import { instanceToInstance } from "class-transformer";

export type ActionType = string;

export interface ActionI<T> {
    GetType: () => ActionType;

    GetPayload: () => T;
}

class Action<T> {
    protected readonly type: ActionType;
    private payload: T;

    constructor( type: string ) {
        this.type = type;
    }

    Payload( payload: T ): Action<T> {
        const clone = instanceToInstance( this );
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

    private REQUEST = `${ this.type }_REQUEST`
    private SUCCESS = `${ this.type }_SUCCESS`
    private FAILURE = `${ this.type }_FAILURE`

    private fn: ( ...args ) => Promise<T>;

    GetRequest(): ActionType {
        return this.REQUEST
    }

    GetSuccess(): ActionType {
        return this.SUCCESS
    }

    GetFailure(): ActionType {
        return this.FAILURE
    }

    constructor( type: string, fn: ( ...args: any[] ) => Promise<T> ) {
        super( type );
        this.fn = fn;
    }

    call( dispatch: ( action: ActionI<any>, payload?: any ) => void, ...args: any[] ) {
        dispatch( new Event<void>( this.REQUEST ).Payload() )
        return this.fn( ...args ).then( resp => {
            dispatch( new Event<T>( this.SUCCESS ).Payload( resp ) )
            return resp
        } ).catch( e => {
            dispatch( new Event<any>( this.FAILURE ).Payload( e ) )
        } )
    }
}
