/**
 * Auth Store — Zustand
 * ---
 * Manages user authentication state across the entire app.
 * Persists user and token to localStorage for session persistence.
 */
import { create } from "zustand";
import API from "../services/api";

const useAuthStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────────────
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  // ─── Computed ────────────────────────────────────────────────────
  get isAuthenticated() {
    return !!get().token;
  },
  get isAdmin() {
    return get().user?.role === "admin";
  },

  // ─── Actions ─────────────────────────────────────────────────────

  /**
   * Register a new student account.
   */
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/auth/register", userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Login with email and password.
   */
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoading: false });
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Logout and clear all stored data.
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, error: null });
  },

  /**
   * Clear any auth errors.
   */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
