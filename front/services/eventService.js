import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getEvents() {
  return apiGet("/api/events");
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
