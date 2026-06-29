import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { getVisitorId } from "@/lib/visitor";

export async function getAllSessions() {
  return apiGet("/api/sessions");
}

export async function getSession(id) {
  return apiGet(`/api/sessions/${id}`);
}

export async function getSessionsByEvent(eventId) {
  try {
    return await apiGet(`/api/sessions/event/${eventId}`);
  } catch {
    return [];
  }
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

export async function getFavoriteSessions() {
  return apiGet("/api/sessions/favorites/list", {
    "X-Visitor-Id": getVisitorId(),
  });
}

export async function toggleFavoriteSession(id) {
  return apiPut(`/api/sessions/${id}/favorite`, null, {
    "X-Visitor-Id": getVisitorId(),
  });
}

export async function getFavoriteStatus(id) {
  return apiGet(`/api/sessions/${id}/favorite`, {
    "X-Visitor-Id": getVisitorId(),
  });
}
