import { apiRequest } from "./apiClient";

export async function loginUser(email, password) {
  const res = await fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function registerUser(data) {
  const res = await fetch("http://127.0.0.1:8000/api/users/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    console.log("REGISTER ERROR:", responseData);
    throw responseData;
  }

  return responseData;
}

export async function getCurrentUser() {
  const data = await apiRequest("/users/me/");

  if (!data) return null;

  return data;
}


export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };
}

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}