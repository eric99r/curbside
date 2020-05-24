import axios from "axios";
import * as constants from "./constants.crud";
import { authHeader } from "../store/auth.helper";

const authHeaders = authHeader();

export const ORGANIZATION_CRUD_URL = constants.API_BASE_URL + "/organizations";

export function createOrganization(organization) {
    return axios.post(ORGANIZATION_CRUD_URL, organization, { headers: authHeaders }).catch(error => { throw error });
}

export function updateOrganization(organization) {
    return axios.put(ORGANIZATION_CRUD_URL, organization, { headers: authHeaders });
}

export function _deleteOrganization(organization) {
    return axios.delete(ORGANIZATION_CRUD_URL, { data: organization, headers: authHeaders });
}

export function getOrganizationById(id) {
    return axios.get(`${ORGANIZATION_CRUD_URL}/${id}`, { headers: authHeaders });
}

export function getAllOrganizations() {
    return axios.get(ORGANIZATION_CRUD_URL, { headers: authHeaders });
}

export function toggleOrganizationActiveStatus(organization) {
    if (organization.isActivated === true) {
        organization.isActivated = false
    }
    else {
        organization.isActivated = true;
    }
    return updateOrganization(organization);
}
