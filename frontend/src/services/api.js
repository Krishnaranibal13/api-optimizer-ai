import axios from "axios";

const API = axios.create({
    baseURL: " ",
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 Unauthorized cleanly
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Only auto-redirect to login if on a protected page
            const protectedPaths = ["/connected-apis", "/settings"];
            const isProtected = protectedPaths.some((path) => window.location.pathname.startsWith(path));
            
            if (isProtected) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;
