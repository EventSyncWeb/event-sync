"use client";

import { createContext, useContext, useState } from "react";
import {
  setToken,
  clearToken,
  getStoredAdmin,
  setStoredAdmin,
  getToken,
} from "@/lib/auth";
import { login as apiLogin } from "@/services/authService";

const AuthContext = createContext(null);

function initAdmin() {
  if (typeof window === "undefined") return null;
  return getToken() ? getStoredAdmin() : null;
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(initAdmin);

  async function login(email, password) {
    const result = await apiLogin(email, password);
    const token = result.token || btoa(`${email}:${Date.now()}`);
    setToken(token);
    setStoredAdmin(result);
    setAdmin(result);
    return result;
  }

  function logout() {
    clearToken();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
