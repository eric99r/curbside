import axios from "axios";
import * as constants from "./constants.crud";
import { authHeader } from "../store/auth.helper";

const authHeaders = authHeader();

export const MARKETING_IMAGE_CRUD_URL = constants.API_BASE_URL + "/MarketingImages";

export function createMarketingImage(marketingImage) {
    return axios.post(MARKETING_IMAGE_CRUD_URL, marketingImage, { headers: authHeaders });
}

export function updateMarketingImage(marketingImage) {
    return axios.put(MARKETING_IMAGE_CRUD_URL, marketingImage, { headers: authHeaders });
}

export function deleteMarketingImage(marketingImage) {
    return axios.delete(MARKETING_IMAGE_CRUD_URL, { data: marketingImage, headers: authHeaders });
}

export function getMarketingImageByOrganizationId(organizationId) {
    return axios.get(MARKETING_IMAGE_CRUD_URL, { params: { organizationId }, headers: authHeaders });
}

export function getAllMarketingImage() {
    return axios.get(MARKETING_IMAGE_CRUD_URL, { headers: authHeaders });
}

