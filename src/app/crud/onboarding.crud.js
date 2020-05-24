import axios from "axios";
import * as constants from "./constants.crud";
import { authHeader } from "../store/auth.helper";

const authHeaders = authHeader();

export const ONBOARDING_CRUD_URL = constants.API_BASE_URL + "/onboarding";

export function updateBasicInfo(basicInfo) {
    return axios.put(ONBOARDING_CRUD_URL, basicInfo, { headers: authHeaders });
}

export function getBasicInfoById(id) {
    return axios.get(`${ONBOARDING_CRUD_URL}/${id}`, { query: { id: id } }, { headers: authHeaders });
}
