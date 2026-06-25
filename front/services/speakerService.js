import { apiGet, apiPost } from "./api";

export async function getAllSpeakers() {
  return apiGet("/speakers");
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
