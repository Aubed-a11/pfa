import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Injecter le token JWT automatiquement
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Gestion globale des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) => api.post("/auth/register", data),
};

// ── Menu ──────────────────────────────────────────────────
export const menuApi = {
  getFullMenu:    () => api.get("/menu/full"),
  getCategories:  () => api.get("/menu/categories"),
  getDishes:      (search?: string) =>
    api.get("/menu/dishes", { params: search ? { search } : {} }),
  getDish:        (id: number) => api.get(`/menu/dishes/${id}`),
  createDish:     (data: unknown) => api.post("/menu/dishes", data),
  updateDish:     (id: number, data: unknown) => api.put(`/menu/dishes/${id}`, data),
  toggleDish:     (id: number) => api.patch(`/menu/dishes/${id}/toggle`),
  deleteDish:     (id: number) => api.delete(`/menu/dishes/${id}`),
  createCategory: (data: unknown) => api.post("/menu/categories", data),
  updateCategory: (id: number, data: unknown) => api.put(`/menu/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/menu/categories/${id}`),
};

// ── Orders ────────────────────────────────────────────────
export const orderApi = {
  create:       (data: unknown) => api.post("/orders", data),
  getMyOrders:  () => api.get("/orders/my"),
  getActive:    () => api.get("/orders/active"),
  getById:      (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, data: unknown) => api.patch(`/orders/${id}/status`, data),
};

// ── Stats ─────────────────────────────────────────────────
export const statsApi = {
  getDashboard: () => api.get("/stats/dashboard"),
};
