import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export async function getRooms() {
  return apiGet("/api/rooms");
}

export async function getRoom(id) {
  return apiGet(`/api/rooms/${id}`);
}

export async function createRoom(data) {
  return apiPost("/api/rooms", data);
}

export async function updateRoom(id, data) {
  return apiPut(`/api/rooms/${id}`, data);
}

export async function deleteRoom(id) {
  return apiDelete(`/api/rooms/${id}`);
}
