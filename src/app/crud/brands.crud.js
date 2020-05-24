import axios from "axios";
import * as constants from "./constants.crud";
import { authHeader } from "../store/auth.helper";

const authHeaders = authHeader();

export const BRAND_CRUD_URL = constants.API_BASE_URL + "/brands";

export function createBrand(brand) {
    return axios.post(BRAND_CRUD_URL, brand, { headers: authHeaders });
}

export function updateBrand(brand) {
    return axios.put(BRAND_CRUD_URL, brand, { headers: authHeaders });
}

export function deleteBrand(brand) {
    return axios.delete(BRAND_CRUD_URL, { data: brand, headers: authHeaders });
}

export function getBrandByOrganizationId(organizationId) {
    return axios.get(BRAND_CRUD_URL, { params: { organizationId }, headers: authHeaders });
}

export function getAllBrands() {
    return axios.get(BRAND_CRUD_URL, { headers: authHeaders });
}

export const VERBIAGE_CRUD_URL = constants.API_BASE_URL + "/verbiage";
export const TAGLINES_CRUD_URL = constants.API_BASE_URL + "/taglines";
export const FONTS_CRUD_URL = constants.API_BASE_URL + "/fonts";
export const SPORTS_TEAMS_CRUD_URL = constants.API_BASE_URL + "/sportsTeams";
export const APPROVED_COLORS_CRUD_URL = constants.API_BASE_URL + "/approvedColors";

export function deleteVerbiage(verbiage) {
    return axios.delete(VERBIAGE_CRUD_URL, { data: verbiage, headers: authHeaders });
}

export function deleteTagline(tagline) {
    return axios.delete(TAGLINES_CRUD_URL, { data: tagline, headers: authHeaders });
}

export function deleteFont(font) {
    return axios.delete(FONTS_CRUD_URL, { data: font, headers: authHeaders });
}

export function deleteSportsTeam(sportsTeam) {
    return axios.delete(SPORTS_TEAMS_CRUD_URL, { data: sportsTeam, headers: authHeaders });
}

export function deleteApprovedColor(approvedColor) {
    return axios.delete(APPROVED_COLORS_CRUD_URL, { data: approvedColor, headers: authHeaders });
}

export const LOGOS_CRUD_URL = constants.API_BASE_URL + "/logos";

export function createLogo(uploadLogoRequest) {
    var formData = new FormData();
    formData.append("", uploadLogoRequest.imageFile);
    formData.append("CompanyCode", uploadLogoRequest.companyCode);
    formData.append("BrandId", uploadLogoRequest.brandId);
    formData.append("Name", uploadLogoRequest.name);
    formData.append("ImageUrl", uploadLogoRequest.imageUrl);
    formData.append("LogoType", uploadLogoRequest.logoType);
    return axios.post(LOGOS_CRUD_URL, formData, { headers: authHeaders });
}

export function updateLogo(uploadLogoRequest) {
    var formData = new FormData();
    if (uploadLogoRequest.imageFile) {
        formData.append("", uploadLogoRequest.imageFile);
    }
    formData.append("CompanyCode", uploadLogoRequest.companyCode);
    formData.append("LogoId", uploadLogoRequest.id);
    formData.append("BrandId", uploadLogoRequest.brandId);
    formData.append("Name", uploadLogoRequest.name);
    formData.append("ImageUrl", uploadLogoRequest.imageUrl);
    formData.append("LogoType", uploadLogoRequest.logoType);
    return axios.put(LOGOS_CRUD_URL, formData, { headers: authHeaders });
}

export function deleteLogo(logo) {
    return axios.delete(LOGOS_CRUD_URL, { data: logo, headers: authHeaders });
}
