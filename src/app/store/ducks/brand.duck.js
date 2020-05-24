import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { call, put, takeLatest } from "redux-saga/effects";

import * as brandApi from "../../crud/brands.crud";

export const actionTypes = {
    GETBY_ORGANIZATION_ID_REQUEST: 'BRANDS_GETBY_ORGANIZATION_ID_REQUEST',
    GETBY_ORGANIZATION_ID_SUCCESS: 'BRANDS_GETBY_ORGANIZATION_ID_SUCCESS',
    GETBY_ORGANIZATION_ID_FAILURE: 'BRANDS_GETBY_ORGANIZATION_ID_FAILURE',

    CREATE_REQUEST: 'BRANDS_CREATE_REQUEST',
    CREATE_SUCCESS: 'BRANDS_CREATE_SUCCESS',
    CREATE_FAILURE: 'BRANDS_CREATE_FAILURE',

    UPDATE_REQUEST: 'BRANDS_UPDATE_REQUEST',
    UPDATE_SUCCESS: 'BRANDS_UPDATE_SUCCESS',
    UPDATE_FAILURE: 'BRANDS_UPDATE_FAILURE',

    DELETE_REQUEST: 'BRANDS_DELETE_REQUEST',
    DELETE_SUCCESS: 'BRANDS_DELETE_SUCCESS',
    DELETE_FAILURE: 'BRANDS_DELETE_FAILURE',
};

const initialBrandState = {
    brand: undefined,
    error: undefined
};

export const reducer = persistReducer(
    { storage, key: "brand", whitelist: ["brand"] },
    (state = initialBrandState, action) => {
        switch (action.type) {

            case actionTypes.GETBY_ORGANIZATION_ID_SUCCESS: {
                const { brand } = action.payload;
                return { ...state, brand };
            }

            case actionTypes.CREATE_SUCCESS: {
                const { brand } = action.payload;
                return { ...state, brand };
            }

            case actionTypes.CREATE_FAILURE: {
                return {
                    error: action.payload.response
                };
            }

            case actionTypes.UPDATE_SUCCESS: {
                const { brand } = action.payload;
                return { ...state, brand };
            }

            case actionTypes.DELETE_SUCCESS: {
                const { brand } = action.payload;
                return {
                    ...state,
                    brand: undefined
                };
            }

            default:
                return state;
        }
    }
);

export const actions = {
    createBrand: brand => ({ type: actionTypes.CREATE_REQUEST, payload: { brand } }),
    updateBrand: brand => ({ type: actionTypes.UPDATE_REQUEST, payload: { brand } }),
    deleteBrand: brand => ({ type: actionTypes.DELETE_REQUEST, payload: { brand } }),
    getBrandByOrganizationId: organizationId => ({ type: actionTypes.GETBY_ORGANIZATION_ID_REQUEST, payload: { organizationId } })
};

const privateActions = {
    brandLoaded: brand => ({ type: actionTypes.GETBY_ORGANIZATION_ID_SUCCESS, payload: { brand } }),
    brandCreated: brand => ({ type: actionTypes.CREATE_SUCCESS, payload: { brand } }),
    brandUpdated: brand => ({ type: actionTypes.UPDATE_SUCCESS, payload: { brand } }),
    brandDeleted: brand => ({ type: actionTypes.DELETE_SUCCESS, payload: { brand } }),
    brandCreationFailed: (brand, response) => ({ type: actionTypes.CREATE_FAILURE, payload: { brand, response } }),
    brandUpdateFailed: (brand, response) => ({ type: actionTypes.UPDATE_FAILURE, payload: { brand, response } }),
    brandDeleteFailed: (brand, response) => ({ type: actionTypes.DELETE_FAILURE, payload: { brand, response } }),
}

export function* saga() {

    yield takeLatest(actionTypes.CREATE_REQUEST, function* brandsCreatedSaga(action) {
        const result = yield call(brandApi.createBrand, action.payload.brand);
        if (result.status === 200) {
            yield put(privateActions.brandCreated(result.data));
        } else {
            yield put(privateActions.brandCreationFailed(action.payload.brand, result.data));
        }
    });

    yield takeLatest(actionTypes.UPDATE_REQUEST, function* brandsCreatedSaga(action) {
        const result = yield call(brandApi.updateBrand, action.payload.brand);
        if (result.status === 200) {
            const updatedBrand = yield call(brandApi.getBrandByOrganizationId, action.payload.brand.organizationId);
            yield put(privateActions.brandUpdated(updatedBrand.data[0]));
        } else {
            yield put(privateActions.brandUpdateFailed(action.payload.brand, result.data));
        }
    });

    yield takeLatest(actionTypes.DELETE_REQUEST, function* brandsCreatedSaga(action) {
        const result = yield call(brandApi.deleteBrand, action.payload.brand);
        if (result.status === 200) {
            yield put(privateActions.brandDeleted(action.payload.brand));
        } else {
            yield put(privateActions.brandDeleteFailed(action.payload.brand, result.data));
        }
    });

    yield takeLatest(actionTypes.GETBY_ORGANIZATION_ID_REQUEST, function* brandLoadedSaga(action) {
        const result = yield call(brandApi.getBrandByOrganizationId, action.payload.organizationId);
        if (result.status === 200) {
            yield put(privateActions.brandLoaded(result.data[0]));
        }
    });

}
