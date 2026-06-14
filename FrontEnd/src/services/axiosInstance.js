import axios from "axios";
import Swal from "sweetalert2";
import { isSessionExpiredError } from "../utils/apiError";
import { setSuppressNotifications } from "../utils/notify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

let sessionExpiredHandled = false;

const clearSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("login");
  sessionStorage.removeItem("user");
};

const handleSessionExpired = (message) => {
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;
  setSuppressNotifications(true);
  clearSession();

  Swal.fire({
    icon: "warning",
    title: "Sesión expirada",
    text: message ?? "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    confirmButtonText: "Iniciar sesión",
    confirmButtonColor: "#EC7A21",
    allowOutsideClick: false,
    customClass: {
      popup: "!rounded-xl !font-sans",
      confirmButton: "!rounded-lg !text-sm !font-semibold !px-5",
    },
  }).then(() => {
    window.location.href = "/login";
  });
};

// Request interceptor: adjunta el JWT en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      delete config.headers.Authorization;
      return config;
    }
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: maneja expiración del token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isSessionExpiredError(error)) {
      const message = error.response?.data?.message;
      handleSessionExpired(message);

      if (error.response?.data) {
        error.response.data.error = message
          ?? "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      }
      error.sessionExpired = true;
    } else if (
      error.response?.status === 401
      && !error.config?.url?.includes("/api/auth/login")
      && !window.location.pathname.startsWith("/portal/public")
    ) {
      clearSession();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
