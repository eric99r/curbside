import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { call, put, takeLatest } from "redux-saga/effects";

import * as organizationApi from "../../crud/organization.crud";

export const actionTypes = {
    GETALL_REQUEST: 'ORGANIZATIONS_GETALL_REQUEST',
    GETALL_SUCCESS: 'ORGANIZATIONS_GETALL_SUCCESS',
    GETALL_FAILURE: 'ORGANIZATIONS_GETALL_FAILURE',

    GETBYID_REQUEST: 'ORGANIZATIONS_GETBYID_REQUEST',
    GETBYID_SUCCESS: 'ORGANIZATIONS_GETBYID_SUCCESS',
    GETBYID_FAILURE: 'ORGANIZATIONS_GETBYID_FAILURE',

    CREATE_REQUEST: 'ORGANIZATIONS_CREATE_REQUEST',
    CREATE_SUCCESS: 'ORGANIZATIONS_CREATE_SUCCESS',
    CREATE_FAILURE: 'ORGANIZATIONS_CREATE_FAILURE',

    UPDATE_REQUEST: 'ORGANIZATIONS_UPDATE_REQUEST',
    UPDATE_SUCCESS: 'ORGANIZATIONS_UPDATE_SUCCESS',
    UPDATE_FAILURE: 'ORGANIZATIONS_UPDATE_FAILURE',

    DELETE_REQUEST: 'ORGANIZATIONS_DELETE_REQUEST',
    DELETE_SUCCESS: 'ORGANIZATIONS_DELETE_SUCCESS',
    DELETE_FAILURE: 'ORGANIZATIONS_DELETE_FAILURE',

    TOGGLE_ACTIVE_STATUS_REQUEST: 'ORGANIZATION_TOGGLE_ACTIVE_STATUS_REQUEST',

    SET_CURRENT: 'SET_CURRENT_ORGANIZATION',
    SET_CURRENT_COLLECTION: 'SET_CURRENT_ORGANIZATIONS'
};

const initialOrganizationState = {
    organization: undefined,
    organizations: undefined,
    error: undefined
};

export const reducer = persistReducer(
    { storage, key: "organization", whitelist: ["organization", "organizations"] },
    (state = initialOrganizationState, action) => {
        switch (action.type) {
            case actionTypes.GETALL_REQUEST: {
                return state;
            }

            case actionTypes.GETALL_SUCCESS: {
                const { organizations } = action.payload;
                return { ...state, organizations };
            }

            case actionTypes.GETBYID_SUCCESS: {
                const { organization } = action.payload;
                return { ...state, organization };
            }

            case actionTypes.CREATE_SUCCESS: {
                const { organization } = action.payload;
                return { ...state, organization };
            }

            case actionTypes.CREATE_FAILURE: {
                return {
                    error: action.payload.response
                };
            }

            case actionTypes.UPDATE_SUCCESS: {
                const { organization } = action.payload;
                let newState = state;
                if (state.organization) {
                    newState = { ...newState, organization }
                }
                if (state.organizations) {
                    newState = {
                        ...newState,
                        organizations: state.organizations.map(org => org.id === organization.id ? organization : org)
                    }
                }
                return newState;
            }

            case actionTypes.DELETE_SUCCESS: {
                const { organization } = action.payload;
                return {
                    ...state,
                    organizations: state.organizations.filter(org => organization.id !== org.id)
                };
            }

            case actionTypes.SET_CURRENT: {
                const { organization } = action.payload;
                return {
                    ...state,
                    organization
                };
            }

            case actionTypes.SET_CURRENT_COLLECTION: {
                const { organizations } = action.payload;
                return {
                    ...state,
                    organizations
                };
            }

            default:
                return state;
        }
    }
);

export const actions = {
    createOrganization: organization => ({ type: actionTypes.CREATE_REQUEST, payload: { organization } }),
    updateOrganization: organization => ({ type: actionTypes.UPDATE_SUCCESS, payload: { organization } }),
    deleteOrganization: organization => ({ type: actionTypes.DELETE_REQUEST, payload: { organization } }),
    getAllOrganizations: () => ({ type: actionTypes.GETALL_REQUEST }),
    getOrganizationById: id => ({ type: actionTypes.GETBYID_REQUEST, payload: { id } }),
    toggleOrganizationActiveStatus: organization => ({ type: actionTypes.TOGGLE_ACTIVE_STATUS_REQUEST, payload: { organization } }),
    setOrganization: organization => ({ type: actionTypes.SET_CURRENT, payload: { organization } }),
    setOrganizations: organizations => ({ type: actionTypes.SET_CURRENT_COLLECTION, payload: { organizations } })
};

const privateActions = {
    organizationsLoaded: organizations => ({ type: actionTypes.GETALL_SUCCESS, payload: { organizations } }),
    organizationLoaded: organization => ({ type: actionTypes.GETBYID_SUCCESS, payload: { organization } }),
    organizationCreated: organization => ({ type: actionTypes.CREATE_SUCCESS, payload: { organization } }),
    organizationCreationFailed: (organization, response) => ({ type: actionTypes.CREATE_FAILURE, payload: { organization, response } }),
    organizationUpdated: organization => ({ type: actionTypes.UPDATE_SUCCESS, payload: { organization } }),
    organizationDeleted: organization => ({ type: actionTypes.DELETE_SUCCESS, payload: { organization } }),
}

export function* saga() {

    yield takeLatest(actionTypes.CREATE_REQUEST, function* organizationsCreatedSaga(action) {
        const result = yield call(organizationApi.createOrganization, action.payload.organization);
        if (result.status === 200) {
            yield put(privateActions.organizationCreated(result.data))
        } else if (result.status === 400) {
            yield put(privateActions.organizationCreationFailed(action.payload.organization, result.data))
        }
    });

    yield takeLatest(actionTypes.GETALL_REQUEST, function* organizationsLoadedSaga() {
        const { data: organizations } = yield organizationApi.getAllOrganizations();
        yield put(privateActions.organizationsLoaded(organizations));
    });

    yield takeLatest(actionTypes.GETBYID_REQUEST, function* organizationLoadedSaga(action) {
        const { data: organization } = yield organizationApi.getOrganizationById(action.payload.id);
        yield put(privateActions.organizationLoaded(organization));
    });

    yield takeLatest(actionTypes.TOGGLE_ACTIVE_STATUS_REQUEST, function* organizationActiveStatusToggledSaga(action) {
        const result = yield call(organizationApi.toggleOrganizationActiveStatus, action.payload.organization);
        if (result.status === 200) {
            const { data: organization } = result;
            yield put(privateActions.organizationUpdated(organization));
        } else {
            console.log("Error when toggling active status: ", result.data);
        }
    });

}
