import axios from "axios";
import * as constants from "./constants.crud";
import { authHeader } from "../store/auth.helper";

const authHeaders = authHeader();

export const FILES_CRUD_URL = constants.API_BASE_URL + "/files";

export function downloadFile(fileUri) {
    return axios.get(FILES_CRUD_URL + "/download",
        {
            responseType: 'blob',
            params: { Uri: fileUri },
            headers: authHeaders
        }
    );
}

export function uploadFiles(files, companyCode, path) {
    var formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("", files[i]);
    }
    formData.append("CompanyCode", companyCode);
    formData.append("Path", path);
    return axios.post(FILES_CRUD_URL, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...authHeaders
            },
        }
    );
}

export function _deleteFile(fileUri) {
    return axios.delete(FILES_CRUD_URL,
        {
            data: { Uri: fileUri },
            headers: authHeaders
        }
    );
}

export function getFiles(companyCode, path) {
    return axios.get(FILES_CRUD_URL,
        {
            params: { CompanyCode: companyCode, Path: path },
            headers: authHeaders
        }
    );
}