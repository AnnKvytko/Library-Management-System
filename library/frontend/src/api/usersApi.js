const BASE_URL = "http://127.0.0.1:8000/api";

function getAuthHeaders(isJson = true) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

export async function fetchUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}/`, {
    headers: getAuthHeaders(false),
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}

export async function fetchProfileByUser(userId) {
  const res = await fetch(
    `${BASE_URL}/users/profiles/by-user/${userId}/`,
    {
      headers: getAuthHeaders(false),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch profile");

  return res.json();
}

export async function fetchOrdersByUser(userId) {
  const res = await fetch(
    `${BASE_URL}/orders/?user=${userId}`,
    {
      headers: getAuthHeaders(false),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch orders");

  return res.json();
}

export async function fetchReaders() {
  const res = await fetch(`${BASE_URL}/users/?role=reader`, {
    headers: getAuthHeaders(false),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch readers");
  }

  return res.json();
}