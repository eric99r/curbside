import axios from "axios";
import * as constants from "./constants.crud"
import { authHeader } from "../store/auth.helper"

const authHeaders = authHeader();

export const LOGIN_URL = constants.API_BASE_URL + "/Login";
export const REGISTER_URL = constants.API_BASE_URL + "/Register";
export const REQUEST_PASSWORD_URL = constants.API_BASE_URL + "/ForgotPassword";
export const PASSWORD_RESET_URL = constants.API_BASE_URL + "/Users/ResetPassword";

export const ME_URL = "api/me";

export function login(email, password) {
  return axios.post(LOGIN_URL, { Email: email, Password: password });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { Email: email });
}

export function ResetPassword(user, newpassword, token) {
  const config = {
    headers: authHeaders
  };

  const bodyParameters = {
    NewPassword: newpassword,
    userid: user.id
  };

  return axios.put(
    PASSWORD_RESET_URL,
    bodyParameters,
    config
  )

  // return axios.post(REQUEST_PASSWORD_URL, {user:uesr });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}
