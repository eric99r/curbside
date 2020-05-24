import axios from "axios";
import * as constants from "./constants.crud";



export function getAll() {
  return axios.get(constants.API_BASE_URL + "/Users");
}

export function getById(id) {
  return axios.get(constants.API_BASE_URL + "/Users/" + id);
}

export function update(user) {
  return axios.put(constants.API_BASE_URL + "/users", JSON.stringify(user));
}

export function _delete(id) {
  return axios.delete(constants.API_BASE_URL + "/users/" + id);
}

export function createUserAccount(user) {
  return axios.post(constants.API_BASE_URL + "/users", JSON.stringify(user));
}
