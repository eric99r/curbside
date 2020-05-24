import axios from "axios";
import * as constants from "./constants.crud";
import { authHeader } from "../store/auth.helper";

const authHeaders = authHeader();

export const CONTACT_INFO_CRUD_URL = constants.API_BASE_URL + "/ContactInfos";

export function createContactInfo(contactInfo) {
    return axios.post(CONTACT_INFO_CRUD_URL, contactInfo, { headers: authHeaders });
}

export function updateContactInfo(contactInfo) {
    return axios.put(CONTACT_INFO_CRUD_URL, contactInfo, { headers: authHeaders });
}

export function deleteContactInfo(contactInfo) {
    return axios.delete(CONTACT_INFO_CRUD_URL, { data: contactInfo, headers: authHeaders });
}

export function getContactInfoByOrganizationId(organizationId) {
    return axios.get(CONTACT_INFO_CRUD_URL, { params: { organizationId }, headers: authHeaders });
}

export function getAllContactInfo() {
    return axios.get(CONTACT_INFO_CRUD_URL, { headers: authHeaders });
}

