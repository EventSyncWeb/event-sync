import { getToken } from "@/lib/auth";

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export function buildUrl(path) {
  return path;
}

export function authHeaders() {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiGet(path) {
  const res = await fetch(buildUrl(path), {
    method: "GET",
    headers: authHeaders(),
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(buildUrl(path), {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(path) {
  const res = await fetch(buildUrl(path), {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  if (res.status === 204) return null;
  return handleResponse(res);
}
