import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getAllSessions() {
  return apiGet("/api/sessions");
}

export async function getSession(id) {
  return apiGet(`/api/sessions/${id}`);
}

export async function getSessionsByEvent(eventId) {
  return apiGet(`/api/sessions/event/${eventId}`);
}

export async function createSession(data) {
  return apiPost("/api/sessions", data);
}

export async function updateSession(id, data) {
  return apiPut(`/api/sessions/${id}`, data);
}

export async function deleteSession(id) {
  return apiDelete(`/api/sessions/${id}`);
}
