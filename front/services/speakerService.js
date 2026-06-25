import { apiGet, apiPost } from "./api";

export async function getAllSpeakers(q) {
  const params = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiGet(`/speakers${params}`);
}

export async function getSpeaker(id) {
  return apiGet(`/speakers/${id}`);
}

export async function getSpeakersBySession(sessionId) {
  return apiGet(`/speakers/session/${sessionId}`);
}

export async function createSpeaker(data) {
  return apiPost("/speakers", data);
}
