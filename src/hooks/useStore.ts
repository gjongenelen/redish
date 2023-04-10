import { useState } from "react";
import { Store } from "../Store";

export const useStore = ( name: string, store: Store ) => {
    const [ state, setState ] = useState( store.GetState()[ name ] );

    store.Subscribe( name, ( state ) => {
        setState( state )
    } )
    return state;
}

export const fnUseStore = ( store: Store ) => ( name: string ) => useStore(name, store);
