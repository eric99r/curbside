import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./ducks/auth.duck";
import * as organization from "./ducks/organization.duck";
import * as onboarding from "./ducks/onboarding.duck";
import { metronic } from "../../_metronic";
import * as users from "./ducks/users.duck";
import * as brand from "./ducks/brand.duck";
import * as productAndCatalog from "./ducks/productAndcatalog.duck";
export const rootReducer = combineReducers({
  auth: auth.reducer,
  organization: organization.reducer,
  onboarding: onboarding.reducer,
  i18n: metronic.i18n.reducer,
  builder: metronic.builder.reducer,
  users: users.reducer,
  brand: brand.reducer,
  productAndCatalog:productAndCatalog.reducer
});

export function* rootSaga() {
  yield all([auth.saga(), organization.saga(), users.saga(), onboarding.saga(), brand.saga()]);
}
