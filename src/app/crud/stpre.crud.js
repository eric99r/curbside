import axios from "axios";
import * as constants from "./constants.crud";


export function getStore() {
  return axios.get(constants.API_BASE_URL + "/store");
}

export function changeHoursByDay(day) {
  return axios.post(constants.API_BASE_URL + "/store", JSON.stringify(day));
}

export function _delete(day) {
  return axios.delete(constants.API_BASE_URL + "/store/" + day);
}

