import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getEvents(q) {
  const params = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiGet(`/api/events${params}`);
}

export async function getEvent(id) {
  return apiGet(`/api/events/${id}`);
}

export async function createEvent(data) {
  return apiPost("/api/events", data);
}

export async function updateEvent(data) {
  return apiPut("/api/events", data);
}

export async function deleteEvent(id) {
  return apiDelete(`/api/events/${id}`);
}
