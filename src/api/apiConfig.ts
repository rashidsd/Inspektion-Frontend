import axios from "axios";
import {settings} from "../apiSettings.js"

const api = axios.create({
  //baseURL: "http://77.37.124.245:4000/api/v1", not use for online
  //baseURL: "https://api-inspection.erpsoft.net/api/v1",
  baseURL: settings.apiURL, //"http://localhost:4000/api/v1",

  withCredentials: false,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
