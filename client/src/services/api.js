import axios from "axios";

const API = axios.create({
  baseURL: "https://neurocare-ai-backend.onrender.com/api",
});

/* =====================================================
   ATTACH JWT TOKEN TO REQUESTS
===================================================== */

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "neurocare_auth_token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =====================================================
   HANDLE AUTHENTICATION ERRORS
===================================================== */

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "neurocare_auth_token"
      );

      localStorage.removeItem(
        "neurocare_asha_worker"
      );

      /*
        Don't redirect automatically here.
        ProtectedRoute will handle the
        login redirect when the app reloads.
      */
    }

    return Promise.reject(error);
  }
);

export default API;