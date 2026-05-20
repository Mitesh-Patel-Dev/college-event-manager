import { create } from "zustand";
import API from "../services/api";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/notifications");
      const unread = data.notifications.filter((n) => !n.read).length;
      set({ notifications: data.notifications, unreadCount: unread, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch notifications", isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      set((state) => {
        const updated = state.notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
        const unread = updated.filter((n) => !n.read).length;
        return { notifications: updated, unreadCount: unread };
      });
    } catch (error) {
      console.error(error);
    }
  },

  markAllAsRead: async () => {
    try {
      await API.patch("/notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useNotificationStore;
