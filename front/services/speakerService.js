import { apiGet, apiPost } from "./api";

export async function getAllSpeakers(q) {
  const params = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiGet(`/api/speakers${params}`);
}

export async function getSpeaker(id) {
  return apiGet(`/api/speakers/${id}`);
}

export async function getSpeakersBySession(sessionId) {
  return apiGet(`/api/speakers/session/${sessionId}`);
}

export async function createSpeaker(data) {
  return apiPost("/api/speakers", data);
}
