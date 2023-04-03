![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/gjongenelen/redish/continuous-deployment-workflow.yml)
![npm](https://img.shields.io/npm/dw/@redish/redish)
![npm bundle size](https://img.shields.io/bundlephobia/min/@redish/redish)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@redish/redish)
![npm](https://img.shields.io/npm/v/@redish/redish)

# Redish [WIP]
Introducing Redish - a lightweight and minimalist package based on React-Redux. Redish aims to simplify the state management process for React applications, while keeping the package size small and efficient.

With Redish, developers can easily manage their application state with a simple and intuitive API. The package is designed to be highly performant, with minimal impact on the overall size of your application bundle.

Overall, Redish is a great choice for developers who value simplicity and efficiency in their React applications


## Docs

### Create new store
```typescript
import { createStore } from "@redish/redish";
import Reducer1 from "reducers/Reducer1";

const store = createStore( {
    ReducerAlias: Reducer1,
} );

store.EnableLocalStorage( "ls_namespace" )
store.InitStates();
```

### Create new action (event/request)
```typescript
import { Event } from "@redish/redish"

export const INCREMENT = new Event<number>( "INCREMENT" );
```

### Create new Reducer
```typescript
import { createReducer } from "@redish/redish";


export class State {
    private counter: number;

    constructor() {
        this.counter = 0;
    }
    
    increment(incr: number) {
        this.counter = this.counter + incr;
    }
    
    getCount(): number {
        return this.counter;
    }

}

const Reducer1 = createReducer( State )
    .handle<number>( INCREMENT.GetEvent(), ( state, payload ) => {
        state.increment(payload)
        return state;
    } );

export default Reducer1;
```

### Use it
```typescript
const Presenter = () => {
    store.Dispatch(INCREMENT.Payload(8))
    
    const state = useStore("ReducerAlias")
    console.log(state.getCount())
}


```