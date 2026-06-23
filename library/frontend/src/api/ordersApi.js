import { API_ROOT } from "./config";

const BASE_URL = `${API_ROOT}/orders`;

function getAuthHeaders(isJson = true) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

// CREATE ORDER
export async function createOrder(data) {
  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    console.log(result);
    throw new Error(result?.detail || "Failed to create order");
  }

  return result;
}

// GET ALL ORDERS
export async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/`, {
    headers: getAuthHeaders(false),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export async function fetchOrderById(id) {
  const res = await fetch(`${BASE_URL}/${id}/`, {
    headers: getAuthHeaders(false),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}

export async function updateOrder(id, data) {
  const res = await fetch(`${BASE_URL}/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.detail || "Failed to update order");
  }

  return result;
}

export async function deleteOrder(id) {
  const res = await fetch(`${BASE_URL}/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
  });

  if (!res.ok) {
    throw new Error("Failed to delete order");
  }
}

