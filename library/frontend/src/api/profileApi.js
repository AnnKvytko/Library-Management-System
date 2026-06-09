const BASE_URL = "http://127.0.0.1:8000/api/users/profiles";

function getAuthHeaders(isJson = true) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

//
// GET CURRENT PROFILE
//
export async function getMyProfile() {
  const response = await fetch(`${BASE_URL}/me/`, {
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}

//
// CREATE PROFILE (only if needed once)
//
export async function createProfile(data) {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: getAuthHeaders(false), // no Content-Type
    body: data,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log(text);
    throw new Error("Failed to create profile");
  }

  return response.json();
}

//
// UPDATE PROFILE (IMPORTANT: ME endpoint ONLY)
//
export async function updateMyProfile(data) {
  const response = await fetch(`${BASE_URL}/me/`, {
    method: "PATCH",
    headers: getAuthHeaders(false), // ❗ NO Content-Type for FormData
    body: data,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("SERVER ERROR:", text);
    throw new Error("Failed to update profile");
  }

  return response.json();
}
