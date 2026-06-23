import axios from "axios";
import { API_ROOT } from "./config";

const BASE_URL = API_ROOT;

function getAccessToken() {
  const token = localStorage.getItem("access");

  if (!token || token === "undefined") return null;

  return token;
}


function getRefreshToken() {
  const token = localStorage.getItem("refresh");
  return token && token !== "undefined" ? token : null;
}

function setAccessToken(token) {
  localStorage.setItem("access", token);
}

function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}


async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  setAccessToken(data.access);

  return data.access;
}

// core fetch wrapper
export async function apiRequest(endpoint, options = {}, retry = true) {
  let token = getAccessToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    body:
      options.body && !isFormData
        ? JSON.stringify(options.body)
        : options.body,
  };

  let res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();

    if (!newToken) {
      clearTokens();
      return null;
    }

    headers["Authorization"] = `Bearer ${newToken}`;

    res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return res.json();
  }

  return null;
}

const api = axios.create({
  baseURL: `${BASE_URL}/`,
});

export default api;
