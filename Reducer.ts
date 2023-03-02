import { instanceToInstance } from "class-transformer";
import { ActionI } from "./Action";

type ReducerCallback<T, R> = ( state: T, payload: R ) => T
type ReducerHandlers = { [ index: string ]: ReducerCallback<any, any> }

export interface ReducerInterface<T> {
    handler: ( state: T, action: ActionI<any> ) => T

    getStateFn: () => new () => T;

    handle<R>( types: string | string[], callback: ReducerCallback<T, R> ): ReducerInterface<T>;
}

class Reducer<T> implements ReducerInterface<T> {

    private readonly stateFn: new ()=> T;
    private readonly handlers: ReducerHandlers;

    constructor( initialState: new ()=> T ) {
        this.stateFn = initialState;
        this.handlers = {};
    }

    public handle<R>( types: string | string[], callback: ReducerCallback<T, R> ): Reducer<T> {
        if ( typeof types === "string" ) {
            types = [ types ]
        }
        types.map( type => {
            return this.handlers[ type ] = callback
        } )
        return this
    }

    public getStateFn() {
        return this.stateFn;
    }

    public handler = ( origState: T, action: ActionI<any> ): T => {
        if ( this.handlers[ action.GetType() ] !== undefined ) {
            try {
                origState = this.handlers[ action.GetType() ]( origState, action.GetPayload() )
            } catch ( e ) {
                console.error( e )
            }
        }
        return origState
    }
}

export function createReducer<T>(  initialState: new ()=> T ) {

    return new Reducer<T>( initialState )
}
