import { apiPost } from "./api";

export async function login(email, password) {
  return apiPost("/login", { email, password });
}
