import { instanceToPlain, plainToInstance } from "class-transformer";
import { ReducerInterface } from "./Reducer";
import { ActionI } from "./Action";

export class Store {

    localStoreKey?: string;

    reducers: { [ name: string ]: ReducerInterface<any> };
    states: { [ name: string ]: any };
    subscribers: { [ state: string ]: { [ id: string ]: ( ( state: any ) => void ) } };

    constructor( reducers: { [ name: string ]: ReducerInterface<any> } ) {
        this.reducers = reducers;
        this.states = {}
        this.subscribers = {}
    }

    EnableLocalStorage( key: string ) {
        this.localStoreKey = key;

        if ( window.localStorage.getItem( key ) !== null ) {
            try {
                const temps = JSON.parse( window.localStorage.getItem( key ) );
                Object.keys( temps ).forEach( name => {
                    this.states[ name ] = plainToInstance( this.reducers[ name ].getStateFn(), temps[ name ] )
                } )
            } catch ( e ) {
                window.localStorage.removeItem( key )
            }
        }
    }

    InitStates() {
        Object.keys( this.reducers ).forEach( ( name ) => {
            if ( !this.states[ name ] && this.reducers[ name ] ) {
                this.states[ name ] = new (this.reducers[ name ].getStateFn());
            }
        } )
    }

    Dispatch( action: ActionI<any> ) {
        Object.keys( this.reducers ).forEach( name => {
            try {
                this.states[ name ] = this.reducers[ name ].handler( this.states[ name ], action );
                if ( this.subscribers[ name ] ) {
                    Object.values( this.subscribers[ name ] ).forEach( sub => sub( this.states ) );
                }
            } catch ( e ) {
                // console.error( e )
            }
        } )

        if ( this.localStoreKey ) {
            const dump = {};
            Object.keys(this.states).forEach(name => {
                dump[name] = instanceToPlain(name)
            })
            window.localStorage.setItem( this.localStoreKey, JSON.stringify( dump ) )
        }
    }

    Subscribe( name: string, fn: ( state: any ) => void ) {
        if ( !this.subscribers[ name ] ) {
            this.subscribers[ name ] = {};
        }

        const id = crypto.randomUUID()
        this.subscribers[ name ][ id ] = fn;
        return () => {
            delete ( this.subscribers[ name ][ id ] );
        }
    }

    GetState() {
        return this.states;
    }
}

export const createStore = (reducers: { [ name: string ]: ReducerInterface<any> }): Store => {
    return new Store(reducers)
}
