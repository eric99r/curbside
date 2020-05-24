import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "../../crud/auth.crud";
import * as routerHelpers from "../../router/RouterHelpers";
import * as userservice from "../../crud/users.crud";

export const actionTypes = {
  getAll: "[getAll] Action",
  createUserAccount: "[createUserAccount] Action",
  getUserById: "[getUserById] Action",
  UpdateUser: "[UpdateUser] Action",
  delete: "[delete] Action"
};
const initialState = {
  items: undefined
};

export const reducer = persistReducer(
  { storage, key: "UsersAuth", whitelist: ["user", "authToken"] },
    (state = initialState, action) => {
      switch (action.type) {
        case actionTypes.getAll: {
          const { users } = action.payload;

           return { ...state, items: users }; 
        }
        case actionTypes.delete: {
          const { id } = action.payload;

           return { ...state, items: state.items.filter(user => user.id !== action.id) }; 
        }
        case actionTypes.createUserAccount: {
          const { user } = action.payload;

           return { ...state }; 
        }
        case actionTypes.getUserById: {
          const { user } = action.payload;

           return { ...state, user }; 
        }
        case actionTypes.UpdateUser: {
          const { items } = action.payload;

           return { 
            ...state, 
            items: state.items.map(user =>
            user.id === action.user.id
              ? action.user
              : user
          )}; 
        }

        default:
          return state;
      }
    }
);

export const actions = {  
  getAll: (users) => ({ type: actionTypes.getAll, payload: { users }  }),
  createUserAccount: (user) => ({ type: actionTypes.createUserAccount, payload: { user } }),
  getUserById: (user) => ({ type: actionTypes.getUserById, payload: { user } }),
  UpdateUser: (user) => ({ type: actionTypes.UpdateUser, payload: { user } }),
  delete: (id) => ({ type: actionTypes.delete, payload: { id } })
};

export function* saga() {

  yield takeLatest(actionTypes.getAll, function* getAllSaga() {
   // yield userservice.getAll();
  });
  
  yield takeLatest(actionTypes.createUserAccount, function* createUserAccount(user) {
    yield userservice.createUserAccount(user);
  });
}
