import { create } from "zustand";
import API from "../services/api";

const useCertificateStore = create((set, get) => ({
  certificates: [],
  isLoading: false,
  error: null,

  fetchMyCertificates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/certificates/my");
      set({ certificates: data.certificates, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch certificates", isLoading: false });
    }
  },

  generateCertificate: async (eventId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post(`/certificates/${eventId}/generate`);
      set((state) => ({ certificates: [data.certificate, ...state.certificates], isLoading: false }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to generate certificate", isLoading: false });
      throw error;
    }
  },
}));

export default useCertificateStore;
