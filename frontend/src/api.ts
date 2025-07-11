import axios from "axios";

/**
 * Singleton Axios con:
 *  · baseURL "/api"
 *  · Authorization automático si hay token en localStorage
 */
export const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
