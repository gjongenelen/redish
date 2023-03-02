import { useState } from "react";
import Store from "../Store";

export const useStore = ( name: string, store: Store ) => {
    const [ state, setState ] = useState( store.GetState()[ name ] );

    console.log("subscribing");
    store.Subscribe( name, ( state ) => {
        setState( state[ name ] )
    } )
    return state;
}

export const useStoreFn = ( store: Store ) => ( name: string ) => useStore(name, store);
