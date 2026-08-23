import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  /* =====================================================
     WAIT FOR AUTHENTICATION TO LOAD
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-5xl">
            🧠
          </div>

          <p className="text-gray-600 font-semibold mt-4">
            Loading NeuroCare AI...
          </p>

        </div>

      </div>
    );
  }

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* =====================================================
     LOGGED IN
  ===================================================== */

  return <Outlet />;
}

export default ProtectedRoute;