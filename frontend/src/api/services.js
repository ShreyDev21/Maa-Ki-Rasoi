import api from "./axios.js";

// ─── AUTH ──────────────────────────────────────────────────
export const authAPI = {
    register: (data) => api.post("/auth/register", data),
    verifyOTP: (data) => api.post("/auth/verify-otp", data),
    resendOTP: (data) => api.post("/auth/resend-otp", data),
    login: (data) => api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
    refreshToken: () => api.post("/auth/refresh-token"),
    getMe: () => api.get("/auth/me"),
    changePassword: (data) => api.put("/auth/change-password", data),
};

// ─── USER ─────────────────────────────────────────────────
export const userAPI = {
    getProfile: () => api.get("/users/profile"),
    updateProfile: (data) => api.put("/users/profile", data),
    addAddress: (data) => api.post("/users/addresses", data),
    updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
    deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
    // Admin
    getAllUsers: (params) => api.get("/users/admin/all", { params }),
    updateUserRole: (id, data) => api.put(`/users/admin/${id}/role`, data),
    toggleUserStatus: (id) => api.put(`/users/admin/${id}/status`),
};

// ─── CATEGORIES ───────────────────────────────────────────
export const categoryAPI = {
    getAll: () => api.get("/categories"),
    getBySlug: (slug) => api.get(`/categories/${slug}`),
    create: (data) => api.post("/categories", data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// ─── PRODUCTS ─────────────────────────────────────────────
export const productAPI = {
    getAll: (params) => api.get("/products", { params }),
    getFeatured: () => api.get("/products/featured"),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    getById: (id) => api.get(`/products/${id}`),
    // Admin
    adminGetAll: (params) => api.get("/products/admin/all", { params }),
    create: (data) => api.post("/products", data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    deleteImage: (id, imageId) => api.delete(`/products/${id}/images/${imageId}`),
};

// ─── CART ──────────────────────────────────────────────────
export const cartAPI = {
    get: () => api.get("/cart"),
    add: (data) => api.post("/cart/add", data),
    updateItem: (productId, data) => api.put(`/cart/item/${productId}`, data),
    removeItem: (productId) => api.delete(`/cart/item/${productId}`),
    clear: () => api.delete("/cart/clear"),
};

// ─── ORDERS ───────────────────────────────────────────────
export const orderAPI = {
    create: (data) => api.post("/orders", data),
    getMyOrders: (params) => api.get("/orders/my-orders", { params }),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
    // Admin
    adminGetAll: (params) => api.get("/orders/admin/all", { params }),
    adminUpdateStatus: (id, data) => api.put(`/orders/admin/${id}/status`, data),
    adminGetStats: () => api.get("/orders/admin/stats"),
};

// ─── PAYMENTS ─────────────────────────────────────────────
export const paymentAPI = {
    getRazorpayKey: () => api.get("/payments/razorpay-key"),
    createOrder: (data) => api.post("/payments/create-order", data),
    verify: (data) => api.post("/payments/verify", data),
};

// ─── REVIEWS ──────────────────────────────────────────────
export const reviewAPI = {
    getProductReviews: (productId, params) =>
        api.get(`/reviews/product/${productId}`, { params }),
    create: (data) => api.post("/reviews", data),
    delete: (id) => api.delete(`/reviews/${id}`),
};
