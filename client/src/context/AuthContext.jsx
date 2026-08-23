import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [worker, setWorker] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =====================================================
     LOAD SAVED LOGIN
  ===================================================== */

  useEffect(() => {
    try {
      const savedWorker =
        localStorage.getItem(
          "neurocare_asha_worker"
        );

      const token =
        localStorage.getItem(
          "neurocare_auth_token"
        );

      if (
        savedWorker &&
        token
      ) {
        setWorker(
          JSON.parse(savedWorker)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load authentication:",
        error
      );

      localStorage.removeItem(
        "neurocare_asha_worker"
      );

      localStorage.removeItem(
        "neurocare_auth_token"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = ({
    token,
    worker,
  }) => {
    localStorage.setItem(
      "neurocare_auth_token",
      token
    );

    localStorage.setItem(
      "neurocare_asha_worker",
      JSON.stringify(worker)
    );

    setWorker(worker);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem(
      "neurocare_auth_token"
    );

    localStorage.removeItem(
      "neurocare_asha_worker"
    );

    setWorker(null);
  };

  /* =====================================================
     AUTHENTICATION STATE
  ===================================================== */

  const isAuthenticated =
    Boolean(worker);

  return (
    <AuthContext.Provider
      value={{
        worker,
        token:
          localStorage.getItem(
            "neurocare_auth_token"
          ),
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================================
   CUSTOM HOOK
===================================================== */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}