/**
 * Event Store — Zustand
 * ---
 * Manages event data and CRUD operations.
 */
import { create } from "zustand";
import API from "../services/api";

const useEventStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────────────
  events: [],
  currentEvent: null,
  isLoading: false,
  error: null,

  // ─── Actions ─────────────────────────────────────────────────────

  /**
   * Fetch all events with optional filters.
   */
  fetchEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await API.get(`/events?${params}`);
      set({ events: data.events, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch events",
        isLoading: false,
      });
    }
  },

  /**
   * Fetch a single event by ID.
   */
  fetchEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get(`/events/${id}`);
      set({ currentEvent: data.event, isLoading: false });
      return data.event;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch event",
        isLoading: false,
      });
    }
  },

  /**
   * Create a new event (Admin only).
   */
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/events", eventData);
      set((state) => ({
        events: [data.event, ...state.events],
        isLoading: false,
      }));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create event";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Update an existing event (Admin only).
   */
  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.put(`/events/${id}`, eventData);
      set((state) => ({
        events: state.events.map((e) => (e._id === id ? data.event : e)),
        currentEvent: data.event,
        isLoading: false,
      }));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update event";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Delete an event (Admin only).
   */
  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await API.delete(`/events/${id}`);
      set((state) => ({
        events: state.events.filter((e) => e._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete event";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  /**
   * Fetch registrations for a specific event (Admin only).
   */
  fetchEventRegistrations: async (eventId) => {
    try {
      const { data } = await API.get(`/events/${eventId}/registrations`);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch registrations"
      );
    }
  },

  clearCurrentEvent: () => set({ currentEvent: null }),
  clearError: () => set({ error: null }),
}));

export default useEventStore;
