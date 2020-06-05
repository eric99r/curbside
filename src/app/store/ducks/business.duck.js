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
  changeOwner: "[ChangeOwner] Action",
  toggleCurbsideHoursDifferentFromStore: "[ToggleCurbsideHoursDifferentFromStore] Action"
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
      
      case actionTypes.editCurbsideHours: {
        const { day } = action.payload;

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

      case actionTypes.editStoreHours: {
          const { day } = action.payload;

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

      case actionTypes.toggleCurbsideHoursDifferentFromStore: {
        let newState = state;
          newState =
          {
            ...newState,
            store: {
              ...newState.store, 
              curbsideHoursDifferentFromStore: !state.store.curbsideHoursDifferentFromStore
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
  editCurbsideHours: (day) => ({ type: actionTypes.editCurbsideHours, payload: { day } }),
 
  //Single paramater actions
  editStoreHours: day => ({ type: actionTypes.editStoreHours, payload: { day } }),
  changeOwner: owner => ({ type: actionTypes.changeOwner, payload: { owner } }),

  //Zero parameter actions
  toggleCurbsideHoursDifferentFromStore: () => ({ type: actionTypes.toggleCurbsideHoursDifferentFromStore })
};

export function* saga() {
}
