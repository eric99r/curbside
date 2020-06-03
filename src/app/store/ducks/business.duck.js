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
  editStoreHours: "[EditStoreHours] Action",
  editCurbsideHours: "[EditCurbsideHours] Action",
  changeOwner: "[ChangeOwner] Action"
};

//What you'll access in the pages you're mapping the reducer to
const initialState = {
  store: database.store,
  lastUpdated: undefined
};

export const reducer = persistReducer(
  { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
  (state = initialState, action) => {
    switch (action.type) {
      //GOOD Example of changing a value in an array (By individual value)
      // case actionTypes.editCurbsideHours: {
      //   const { day, startTime } = action.payload;
      //   let newState = state;
      //   const newStoreHours = newState.store.curbsideHours.map(d => d.day === day ? { ...d, timeOpen: startTime} : d);
      //   newState.store.storeHours = newStoreHours;
      //   newState.lastUpdated = Date.now();
      //   return newState;
      // }     
      
      case actionTypes.editCurbsideHours: {
        const { day } = action.payload;

        const oldDay = state.store.curbsideHours.filter((d) => d.day === day.day)[0]
        console.log(oldDay);
        console.log(78944);
        if (!('timeOpen' in day))
          {
            day.timeOpen = oldDay.timeOpen;
          }

        if (!('timeClosed' in day))
          {
            day.timeClosed = oldDay.timeClosed;
          }

        console.log(day);
        let newState = state;
          newState =
          {
            ...newState,
            store: {
              ...newState.store,
              curbsideHours: newState.store.curbsideHours.map(d => d.day === day.day ? day : d )
            }
          }
          newState.lastUpdated = Date.now();
        return newState;
      }     
      //BEST Example of changing a value in an array (By Object) 
      case actionTypes.editStoreHours: {
          const { day } = action.payload;

          const oldDay = state.store.storeHours.filter((d) => d.day === day.day)[0]
          console.log(oldDay);
          console.log(789);
          if (!('timeOpen' in day))
            {
              day.timeOpen = oldDay.timeOpen;
            }

          if (!('timeClosed' in day))
            {
              day.timeClosed = oldDay.timeClosed;
            }

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
        const { owner } = action.payload;
        let newState = state;
          newState =
          {
            ...newState,
            store: {
              ...newState.store, owner
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
  //Multiple parameter actions
  editCurbsideHours: (day, startTime) => ({ type: actionTypes.editCurbsideHours, payload: { day, startTime } }),
  //Single paramater actions
  editStoreHours: day => ({ type: actionTypes.editStoreHours, payload: { day } }),
  changeOwner: owner => ({ type: actionTypes.changeOwner, payload: { owner } })
};

export function* saga() {
}
