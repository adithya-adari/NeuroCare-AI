import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl shadow-md">

      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-3xl font-black text-blue-700"
        >
          🧠 NeuroCare AI
        </Link>

        <div className="flex items-center gap-8 font-semibold">

          <Link
            to="/"
            className="hover:text-blue-700 duration-300"
          >
            Home
          </Link>

          <Link
            to="/assessment"
            className="hover:text-blue-700 duration-300"
          >
            Assessment
          </Link>

          <Link
            to="/learn"
            className="hover:text-blue-700 duration-300"
          >
            Learn
          </Link>

          <Link
            to="/chat"
            className="hover:text-blue-700 duration-300"
          >
            AI Chat
          </Link>

          <Link
            to="/about"
            className="hover:text-blue-700 duration-300"
          >
            About
          </Link>

          <Link
            to="/assessment"
            className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800 duration-300"
          >
            Get Started
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;