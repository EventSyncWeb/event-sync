import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getAllSessions() {
  return apiGet("/api/session");
}

export async function getSession(id) {
  return apiGet(`/api/session/${id}`);
}

export async function getSessionsByEvent(eventId) {
  return apiGet(`/api/session/event/${eventId}`);
}

export async function createSession(data) {
  return apiPost("/api/session", data);
}

export async function updateSession(id, data) {
  return apiPut(`/api/session/${id}`, data);
}

export async function deleteSession(id) {
  return apiDelete(`/api/session/${id}`);
}
