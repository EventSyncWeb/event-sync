import { apiPost } from "./api";

export async function login(email, password) {
  return apiPost("/api/auth/login", { email, password });
}
