import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({
});

export function* rootSaga() {
  yield all();
}
