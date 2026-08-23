import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-md">

      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-black text-blue-700"
        >
          🧠 NeuroCare AI
        </Link>

        {/* ASHA Login */}

        <Link
          to="/login"
          className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 hover:scale-105 duration-300 shadow-lg"
        >
          👩‍⚕️ ASHA Worker Login
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;