import { API_ROOT } from "./config";

const BASE_URL = API_ROOT;

function getAuthHeaders(isJson = true) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
import { apiRequest } from "./apiClient";

export async function fetchBooks({ page, search, genre, sortBy }) {
  const params = new URLSearchParams();

  // pagination
  params.append("page", page);

  if (search) params.append("search", search);
  if (genre && genre !== "all") params.append("genre", genre);
  if (sortBy) params.append("ordering", sortBy);

  return apiRequest(`/books/?${params.toString()}`);
}

export async function deleteBook(id) {
  return apiRequest(`/books/${id}/`, {
    method: "DELETE",
  });
}

export async function fetchBookById(id) {
  const response = await fetch(
    `${BASE_URL}/books/${id}/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  return response.json();
}

export async function createBook(data) {
  const res = await fetch(`${BASE_URL}/books/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    body: data, // FormData
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(result));
  }

  return result;
}

export async function updateBook(id, formData) {
  return apiRequest(`/books/${id}/`, {
    method: "PATCH",
    body: formData,
    headers: {},
  });
}

export async function fetchBooksByAuthor(authorId) {
  return apiRequest(
    `/books/?author=${authorId}`
  );
}

export async function addFavorite(bookId) {
  const res = await fetch(`${BASE_URL}/books/${bookId}/favorite/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
}

export async function removeFavorite(bookId) {
  const res = await fetch(`${BASE_URL}/books/${bookId}/unfavorite/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
}

export async function getFavoriteBooks() {
  const res = await fetch(`${BASE_URL}/books/favorites/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch favorites");

  return res.json();
}