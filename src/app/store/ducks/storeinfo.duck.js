//THE RULES OF DUCKS!!!
// https://i.stack.imgur.com/TjVsQ.gif

// MUST export default a function called reducer()
// MUST export its action creators as functions
// MUST have action types in the form npm-module-or-app/reducer/ACTION_TYPE
// MAY export its action types as UPPER_SNAKE_CASE, if an external reducer needs to listen for them, or if it is a published reusable library
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import database from '../../database.json';


// Actions
export const actionTypes = {
  changeOrderStatus: "[changeOrderStatus] Action",
};

//What you'll access in the pages you're mapping the reducer to
const initialState = {
  store: database.store,
  lastUpdated: undefined
};

console.log(initialState);
console.log(111);

export const reducer = persistReducer(
  { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
  (state = initialState, action) => {
    switch (action.type) {
      //GOOD Example of changing a value in an array (By individual value)
      case actionTypes.editCurbsideHours: {
      
        const { day, startTime } = action.payload;
        console.log("state: ", state);
        console.log("payload day: " + day)
        console.log("payload startTime: " + startTime)
        let newState = state;
        const newStoreHours = newState.store.curbsideHours.map(d => d.day === day ? { ...d, timeOpen: startTime} : d);
        newState.store.storeHours = newStoreHours;
        newState.lastUpdated = Date.now();
        return newState;
      }           
      //BEST Example of changing a value in an array (By Object) 
      case actionTypes.editStoreHours: {
          const { day } = action.payload;
          console.log("state: ", state);
          console.log("payload: " + day)
          let newState = state;
            newState =
            {
              ...newState,
              store: {
                ...newState.store,
                storeHours: newState.store.storeHours.map(d => d.day === day.day ? day : d )
              }
            }
            newState.lastUpdated = Date.now();
          return newState;
        }     

      //BEST Example of changing a value (By Object)  
      case actionTypes.changeOwner: {
        const { status } = action.payload;
        console.log("payload: " + status)
        let newState = state;
          newState =
          {
            ...newState,
            store: {
              ...newState.store, status
            }
          }
          newState.lastUpdated = Date.now();
        return newState;
      }

      default:
        return state;
    }
  }
);

export const actions = {
  
  changeOrderStatus: status => ({ type: actionTypes.changeOrderStatus, payload: { status } })
};

export function* saga() {
}
