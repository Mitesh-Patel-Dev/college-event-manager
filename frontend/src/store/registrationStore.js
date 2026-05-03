/**
 * Registration Store — Zustand
 * ---
 * Manages student event registrations.
 */
import { create } from "zustand";
import API from "../services/api";

const useRegistrationStore = create((set) => ({
  // ─── State ───────────────────────────────────────────────────────
  myRegistrations: [],
  isLoading: false,
  error: null,

  // ─── Actions ─────────────────────────────────────────────────────

  /**
   * Register for an event.
   */
  registerForEvent: async (eventId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post(`/registrations/${eventId}`);
      set({ isLoading: false });
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Cancel a registration.
   */
  cancelRegistration: async (eventId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.delete(`/registrations/${eventId}`);
      set((state) => ({
        myRegistrations: state.myRegistrations.filter(
          (r) => r.event?._id !== eventId
        ),
        isLoading: false,
      }));
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Cancellation failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Get all events the student is registered for.
   */
  fetchMyRegistrations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/registrations/my-events");
      set({ myRegistrations: data.registrations, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch registrations",
        isLoading: false,
      });
    }
  },

  /**
   * Check if student is registered for a specific event.
   */
  checkRegistration: async (eventId) => {
    try {
      const { data } = await API.get(`/registrations/check/${eventId}`);
      return data.isRegistered;
    } catch {
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useRegistrationStore;
