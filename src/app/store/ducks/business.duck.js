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
  EditStoreHours: "[EditStoreHours] Action",
  EditCurbsideHours: "[EditCurbsideHours] Action",
  ChangeOwner: "[ChangeOwner] Action"
};

const initialState = {
  store: database.store
};

export const reducer = persistReducer(
    { storage, key: "demo1-auth", whitelist: ["user", "authToken"] },
    (state = initialState, action) => {
      switch (action.type) {
        case actionTypes.editCurbsideHours: {
          //const { user } = action.payload;
          return { ...state, undefined};
        }

        case actionTypes.editStoreHours: {
          return { ...state, undefined};
        }

        // case actionTypes.ChangeOwner: {
        //   const { owner } = action.payload;
        //   return { authToken, user: undefined };
        // }

        case actionTypes.ChangeOwner: {
          const { owner } = action.payload;
          console.log("test change owner" + owner)
          let newState = state;
          if (state.business) {
              newState = { ...newState, owner }
          }
          return newState;
        }
        default:
          return state;
      }
    }
);

export const actions = {
  editCurbsideHours: day => ({ type: actionTypes.editCurbsideHours, payload: { day } }),
  editStoreHours: day => ({ type: actionTypes.editStoreHours, payload: { day } }),
  changeOwner: owner => ({ type: actionTypes.changeOwner, payload: { owner } })
  
};

export function* saga() {
}
