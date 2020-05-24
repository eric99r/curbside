import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { call, put, takeLatest } from "redux-saga/effects";
import * as sponseredapprealApi from "../../crud/sponseredappreal.crud";
const initialproductandCatlog = {
    productAndCatalog: undefined,
    error: undefined
};

export const reducer = persistReducer(
    { storage, key: "productAndCatalog", whitelist: ["productAndCatalog"] },
    (state = initialproductandCatlog, action) => {
        switch (action.type) {
                       

            default:
                return state;
        }
    }
);


export function* saga() {

}