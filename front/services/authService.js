import { apiPost } from "./api";

export async function login(email, password) {
  return apiPost("/api/auth/login", { email, password });
}

export async function register(firstName, lastName, email, password) {
  return apiPost("/api/auth/register", { firstName, lastName, email, password });
}
