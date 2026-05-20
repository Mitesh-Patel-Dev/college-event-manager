/**
 * Event Store — Zustand
 * ---
 * Manages event data, CRUD operations, stats, and approval workflow.
 */
import { create } from "zustand";
import API from "../services/api";

const useEventStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────────────
  events: [],
  currentEvent: null,
  stats: null,
  trendData: [],
  activeEventsList: [],
  savedEvents: [],
  recommendedEvents: [],
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
   * Fetch dashboard stats (Organization only).
   */
  fetchEventStats: async () => {
    try {
      const { data } = await API.get("/events/stats");
      set({
        stats: data.stats,
        trendData: data.trendData,
        activeEventsList: data.activeEventsList,
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  },

  /**
   * Create a new event (Organization only).
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
   * Update an existing event (Organization only).
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
   * Delete an event (Organization only).
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
   * Update event approval status (Organization only).
   */
  updateApprovalStatus: async (id, approval_status) => {
    try {
      const { data } = await API.patch(`/events/${id}/approval`, {
        approval_status,
      });
      set((state) => ({
        events: state.events.map((e) =>
          e._id === id ? { ...e, approval_status } : e
        ),
      }));
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update approval status"
      );
    }
  },

  /**
   * Fetch registrations for a specific event (Organization only).
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

  toggleSaveEvent: async (id) => {
    try {
      const { data } = await API.post(`/events/${id}/save`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to save event");
    }
  },

  fetchSavedEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/events/saved");
      set({ savedEvents: data.events, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch saved events", isLoading: false });
    }
  },

  fetchRecommendedEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/events/recommended");
      set({ recommendedEvents: data.events, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch recommendations", isLoading: false });
    }
  },

  submitFeedback: async (eventId, rating, comment) => {
    try {
      const { data } = await API.post("/feedback", { eventId, rating, comment });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to submit feedback");
    }
  },

  clearCurrentEvent: () => set({ currentEvent: null }),
  clearError: () => set({ error: null }),
}));

export default useEventStore;
