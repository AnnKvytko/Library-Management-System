import api, { apiRequest } from "./apiClient";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchAuthors({
  page,
  pageSize,
  search,
  nationality,
}) {
  const params = new URLSearchParams();

  // pagination
  params.append("page", page);
  if (pageSize) {
    params.append("page_size", pageSize);
  }

  // search
  if (search) {
    params.append("search", search);
  }

  // nationality filter
  if (
    nationality &&
    nationality !== "all"
  ) {
    params.append("nationality", nationality);
  }

  return apiRequest(
    `/authors/?${params.toString()}`
  );
}

export async function deleteAuthor(id) {
  return apiRequest(`/authors/${id}/`, {
    method: "DELETE",
  });
}

export async function createAuthor(data) {
  const res = await fetch(`${BASE_URL}/authors/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    body: data,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(result));
  }

  return result;
}


export async function fetchAuthorById(id) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/authors/${id}/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch author");
  }

  return response.json();
}

export async function fetchNationalities() {
  const response = await api.get("authors/nationalities/");
  return response.data;
}

export async function updateAuthor(id, formData) {
  return apiRequest(`/authors/${id}/`, {
    method: "PATCH",
    body: formData,
    headers: {},
  });
}