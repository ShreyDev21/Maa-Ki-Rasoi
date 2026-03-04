import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "/api/v1";

/**
 * Axios instance with interceptors for auth token management
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// ─── REQUEST INTERCEPTOR: Attach access token ─────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR: Auto-refresh expired tokens ────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only skip refresh for login/register/refresh-token — NOT /auth/me
        const skipRefreshUrls = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/verify-otp", "/auth/resend-otp"];
        const shouldSkipRefresh = skipRefreshUrls.some((url) => originalRequest.url?.includes(url));

        if (error.response?.status === 401 && !originalRequest._retry && !shouldSkipRefresh) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.data.accessToken;
                localStorage.setItem("accessToken", newToken);
                api.defaults.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem("accessToken");
                // Don't force redirect — let AuthContext handle it gracefully
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
