// src/api/authApi.ts
import api from "./api";

/* ================= LOGIN ================= */
export const login = async (email: string, password: string) => {
  // Backend sets HttpOnly cookie
  return api.post("/auth/login", {
    email,
    password,
  });
};

/* ================= REGISTER ================= */
export const registerBuyer = (name: string, email: string, password: string) =>
  api.post("/auth/register/buyer", {
    name,
    email,
    password,
  });

export const registerArtisan = (
  name: string,
  email: string,
  password: string
) =>
  api.post("/auth/register/artisan", {
    name,
    email,
    password,
  });

/* ================= ROLE (OAUTH PRE-SELECT) ================= */
export const setRole = async (role: "ROLE_SELLER" | "ROLE_CUSTOMER") => {
  return api.post("/auth/set-role", { role });
};

/* ================= GOOGLE LOGIN ================= */
export const googleLoginWithRole = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

/* ================= AUTH CHECK ================= */
export const checkAuth = async () => {
  return api.get("/auth/me");
};

/* ================= LOGOUT ================= */
export const logout = async () => {
  await api.post("/auth/logout", {}, { withCredentials: true });
};
