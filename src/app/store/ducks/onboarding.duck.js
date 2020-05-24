import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { call, put, takeLatest } from "redux-saga/effects";

import * as onboardingApi from "../../crud/onboarding.crud";
import { onboardingStatus, onboardingStepDependencies, getOnboardingStatus } from "../../pages/Component/onboarding/onboarding.constants";

export const actionTypes = {
    COMPLETE_STEP: 'ONBOARDING_COMPLETE_STEP',

    SET_STATUSES: 'ONBOARDING_SET_STATUSES',
    SET_STEP_STATUS: 'ONBOARDING_SET_STEP_STATUS',
    SET_STEP_MESSAGE: 'ONBOARDING_SET_STEP_MESSAGE',

    LOAD_STATUS_REQUEST: 'ONBOARDING_LOAD_STATUS_REQUEST',
    LOAD_STATUS_SUCCESS: 'ONBOARDING_LOAD_STATUS_SUCCESS',
    LOAD_STATUS_FAILURE: 'ONBOARDING_LOAD_STATUS_FAILURE',

    BASICINFO_GETBYID_REQUEST: 'BASICINFO_GETBYID_REQUEST',
    BASICINFO_GETBYID_SUCCESS: 'BASICINFO_GETBYID_SUCCESS',
    BASICINFO_GETBYID_FAILURE: 'BASICINFO_GETBYID_FAILURE',

    BASICINFO_UPDATE_REQUEST: 'BASICINFO_UPDATE_REQUEST',
    BASICINFO_UPDATE_SUCCESS: 'BASICINFO_UPDATE_SUCCESS',
    BASICINFO_UPDATE_FAILURE: 'BASICINFO_UPDATE_FAILURE'
};

const fakeStatuses = {
    lastUpdated: 0,
    // Section-level.
    "organization": {
        lastUpdated: 0,
        "organization": onboardingStatus.UNLOCKED
    },
    "branding": {
        // Step-level.
        lastUpdated: 0,
        "branding": onboardingStatus.LOCKED,
        "brand-guidelines": onboardingStatus.LOCKED,
        "verbiage-taglines-and-fonts": onboardingStatus.LOCKED,
        "sports-teams": onboardingStatus.LOCKED,
        "logos-and-approved-colors": onboardingStatus.LOCKED
    },
    "catalog-and-products": {
        "catalog-and-products": onboardingStatus.UNLOCKED,
        "sponsored-apparel-brands": onboardingStatus.UNLOCKED
    },

    "groups": {
        "groups": onboardingStatus.LOCKED
    },
    "licensing-and-royalties": {
        "licensing-and-royalties": onboardingStatus.LOCKED
    },
    "billing": {
        "billing": onboardingStatus.LOCKED
    },
    "checkout-options": {
        "checkout-options": onboardingStatus.LOCKED
    },
    "approvals-and-order-processing": {
        "approvals-and-order-processing": onboardingStatus.LOCKED
    },
    "access-and-content": {
        "access-and-content": onboardingStatus.UNLOCKED,
        "marketingImages": onboardingStatus.COMPLETE,
        "contactInfo": onboardingStatus.UNLOCKED
    },
    "final-review": {
        "final-review": onboardingStatus.LOCKED
    }
};

const fakeMessages = {
    // Section-level.
    "organization": {
        "organization": { content: "", type: "" }
    },
    "branding": {
        // Step-level.
        "branding": { content: "", type: "" },
        "brand-guidelines": { content: "", type: "" },
        "verbiage-taglines-and-fonts": { content: "", type: "" },
        "sports-teams": { content: "", type: "" },
        "logos-and-approved-colors": { content: "", type: "" }
    },
    "catalog-and-products": {
        "catalog-and-products": { content: "", type: "" },
        "sponsored-apparel-brands": { content: "", type: "" }
    },
    "groups": {
        "groups": { content: "", type: "" }
    },
    "licensing-and-royalties": {
        "licensing-and-royalties": { content: "", type: "" }
    },
    "billing": {
        "billing": { content: "", type: "" }
    },
    "checkout-options": {
        "checkout-options": { content: "", type: "" }
    },
    "approvals-and-order-processing": {
        "approvals-and-order-processing": { content: "", type: "" }
    },
    "access-and-content": {
        "access-and-content": { content: "", type: "" },
        "marketingImages": { content: "", type: "" },
        "contactInfo": { content: "", type: "" }
    },
    "final-review": {
        "final-review": { content: "", type: "" }
    }
};

const initialOnboardingState = {
    dependencies: onboardingStepDependencies,
    statuses: fakeStatuses,
    lastUpdated: 0,
    messages: fakeMessages,
    basicInfo: undefined,
    error: undefined
};

function trySetStepStatus(statuses, step, status) {
    let newStatuses = statuses;
    let success = false
    // Check if step is section and set section root.
    if (step in statuses) {
        newStatuses[step][step] = status;
        newStatuses[step].lastUpdated = Date.now();
        success = true;
    }
    // Find step in sections and set status.
    Object.keys(statuses).forEach(key => {
        if (typeof statuses[key] === "object"
            && step in statuses[key]) {
            newStatuses[key][step] = status
            newStatuses[key].lastUpdated = Date.now();
            success = true
        }
    });
    return { success, newStatuses }
}

function setStatuses(currentStatuses, statusesToSet) {
    if (statusesToSet && currentStatuses) {
        const keys = Object.keys(statusesToSet);
        for (let i = 0; i < keys.length; i++) {
            if (typeof statusesToSet[keys[i]] === "object") {
                currentStatuses = setStatuses(currentStatuses, statusesToSet[keys[i]]);
            } else {
                let { success, newStatuses } = trySetStepStatus(currentStatuses, keys[i], statusesToSet[keys[i]]);
                if (success) {
                    currentStatuses = newStatuses;
                }
            }
        }
    }
    return currentStatuses;
}

export const reducer = persistReducer(
    { storage, key: "onboarding", whitelist: ["onboarding", "statuses", "messages", "status", "step", "basicInfo"] },
    (state = initialOnboardingState, action) => {
        switch (action.type) {
            case actionTypes.LOAD_STATUS_REQUEST: {
                return { ...state, loading: true };
            }

            case actionTypes.LOAD_STATUS_SUCCESS: {
                const { statuses } = action.payload;

                // TODO: Update this temp.
                return { ...state, statuses: state.statuses, loading: false };
            }

            case actionTypes.LOAD_STATUS_FAILURE: {
                return { error: action.payload.response, loading: false };
            }

            case actionTypes.SET_STATUSES: {
                const { statuses } = action.payload;
                if (statuses) {
                    const newStatuses = setStatuses(state.statuses, statuses);
                    newStatuses.lastUpdated = Date.now();
                    return { ...state, statuses: newStatuses };
                }
                return state;
            }

            case actionTypes.SET_STEP_STATUS: {
                const { step, status } = action.payload;
                if (step && status) {
                    const { success, newStatuses } = trySetStepStatus(state.statuses, step, status);
                    if (success) {
                        newStatuses.lastUpdated = Date.now();
                        return { ...state, statuses: newStatuses };
                    }
                }
                return state;
            }

            case actionTypes.SET_STEP_MESSAGE: {
                const { step, message, messageType } = action.payload;
                if (step) {
                    const { success, newStatuses } = trySetStepStatus(state.messages, step, { content: message, type: (messageType || "") });
                    if (success) {
                        return { ...state, messages: newStatuses };
                    }
                }
                return state;
            }

            case actionTypes.COMPLETE_STEP: {
                const { step } = action.payload;
                if (step) {
                    const { success, newStatuses } = trySetStepStatus(state.statuses, step, "complete");
                    if (success) {
                        newStatuses.lastUpdated = Date.now();
                        return { ...state, statuses: newStatuses };
                    }
                }
                return state;
            }

            case actionTypes.BASICINFO_GETBYID_SUCCESS: {
                const { basicInfo } = action.payload;
                return { ...state, basicInfo };
            }

            case actionTypes.BASICINFO_UPDATE_SUCCESS: {
                const { basicInfo } = action.payload;
                let newState = state;
                if (state.basicInfo) {
                    newState = { ...newState, basicInfo }
                }
                return newState;
            }

            case actionTypes.BASICINFO_UPDATE_FAILURE: {
                return {
                    error: action.payload.response
                };
            }

            default:
                return state;
        }
    }
);

export const actions = {
    loadOnboardingStatusesForOrganization: organizationId => ({ type: actionTypes.LOAD_STATUS_REQUEST, payload: { organizationId } }),
    setStatuses: (statuses) => ({ type: actionTypes.SET_STATUSES, payload: { statuses } }),
    setStepStatus: (step, status) => ({ type: actionTypes.SET_STEP_STATUS, payload: { step, status } }),
    setStepMessage: (step, message, messageType) => ({ type: actionTypes.SET_STEP_MESSAGE, payload: { step, message, messageType } }),
    completeStep: step => ({ type: actionTypes.COMPLETE_STEP, payload: { step } }),
    updateBasicInfo: basicInfo => ({ type: actionTypes.BASICINFO_UPDATE_REQUEST, payload: { basicInfo } }),
    getBasicInfoById: id => ({ type: actionTypes.BASICINFO_GETBYID_REQUEST, payload: { id } })
};

const privateActions = {
    loadOnboardingStatuses_Success: statuses => ({ type: actionTypes.LOAD_STATUS_SUCCESS, payload: { statuses } }),
    loadOnboardingStatuses_Failure: error => ({ type: actionTypes.LOAD_STATUS_FAILURE, payload: { error } }),
    basicInfoLoaded: basicInfo => ({ type: actionTypes.BASICINFO_GETBYID_SUCCESS, payload: { basicInfo } }),
    basicInfoUpdated: basicInfo => ({ type: actionTypes.BASICINFO_UPDATE_SUCCESS, payload: { basicInfo } }),
    basicInfoUpdateFailed: (basicInfo, response) => ({ type: actionTypes.BASICINFO_UPDATE_FAILURE, payload: { basicInfo, response } }),
};

export function* saga() {

    yield takeLatest(actionTypes.LOAD_STATUS_REQUEST, function* loadOnboardingStatuses_Request(action) {
        try {
            const { organizationId } = action.payload
            let statuses = {}; // yield call(onboardingApi.getOnboardingStatusesForOrganization(organizationId));
            yield put(privateActions.loadOnboardingStatuses_Success(statuses));
        }
        catch (error) {
            yield put(privateActions.loadOnboardingStatuses_Failure(error));
        }
    });

    yield takeLatest(actionTypes.COMPLETE_STEP, function* completeStep(action) {

    });

    yield takeLatest(actionTypes.BASICINFO_GETBYID_REQUEST, function* basicInfoLoadedSaga(action) {
        const { data: basicInfo } = yield onboardingApi.getBasicInfoById(action.payload.id);
        yield put(privateActions.basicInfoLoaded(basicInfo));
    });

    yield takeLatest(actionTypes.BASICINFO_UPDATE_REQUEST, function* basicInfoUpdatedSaga(action) {
        const result = yield call(onboardingApi.updateBasicInfo, action.payload.basicInfo);
        if (result.status === 200) {
            yield put(privateActions.basicInfoUpdated(result.data))
        } else if (result.status === 400) {
            yield put(privateActions.basicInfoUpdateFailed(action.payload.basicInfo, result.data))
        }
    });

}
