import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      {/* Statistics */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-8">

          <div className="bg-blue-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-blue-700">
              AI
            </h1>

            <p className="mt-4 text-gray-600">
              Intelligent Development Analysis
            </p>

          </div>

          <div className="bg-green-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-green-700">
              24/7
            </h1>

            <p className="mt-4 text-gray-600">
              Parent Assistance
            </p>

          </div>

          <div className="bg-yellow-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-yellow-700">
              Fast
            </h1>

            <p className="mt-4 text-gray-600">
              AI Health Guidance
            </p>

          </div>

          <div className="bg-red-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-red-700">
              Safe
            </h1>

            <p className="mt-4 text-gray-600">
              Educational Guidance
            </p>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="py-24 bg-slate-100">

        <div className="max-w-7xl mx-auto px-8">

          <h1 className="text-5xl font-black text-center text-blue-700">
            Why NeuroCare AI?
          </h1>

          <p className="text-center text-gray-600 mt-5 text-xl">
            AI-powered developmental support for parents.
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-16">

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                🧠
              </div>

              <h2 className="text-3xl font-bold mt-6">
                AI Assessment
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                Answer a few simple questions and receive an
                AI-generated developmental assessment.
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                💬
              </div>

              <h2 className="text-3xl font-bold mt-6">
                AI Healthcare Chat
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                Parents can ask healthcare-related questions
                and receive educational AI guidance.
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                📄
              </div>

              <h2 className="text-3xl font-bold mt-6">
                Smart Report
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                Download a professional AI-generated report
                summarizing developmental observations.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* How it Works */}

      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-8">

          <h1 className="text-5xl font-black text-center text-blue-700">
            How It Works
          </h1>

          <div className="grid md:grid-cols-4 gap-10 mt-20">

            <div className="text-center">

              <div className="text-6xl">1️⃣</div>

              <h2 className="text-2xl font-bold mt-5">
                Start Assessment
              </h2>

            </div>

            <div className="text-center">

              <div className="text-6xl">2️⃣</div>

              <h2 className="text-2xl font-bold mt-5">
                AI Analysis
              </h2>

            </div>

            <div className="text-center">

              <div className="text-6xl">3️⃣</div>

              <h2 className="text-2xl font-bold mt-5">
                Smart Report
              </h2>

            </div>

            <div className="text-center">

              <div className="text-6xl">4️⃣</div>

              <h2 className="text-2xl font-bold mt-5">
                Consult Doctor
              </h2>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24 bg-gradient-to-r from-blue-700 to-cyan-500 text-center text-white">

        <h1 className="text-6xl font-black">
          Ready to Try NeuroCare AI?
        </h1>

        <p className="mt-6 text-2xl">
          Get AI-powered developmental guidance in minutes.
        </p>

        <Link to="/assessment">

          <button className="mt-10 bg-white text-blue-700 px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 duration-300">

            Start Assessment

          </button>

        </Link>

      </section>

      {/* Footer */}

      <footer className="bg-slate-900 text-white py-10 text-center">

        <h1 className="text-3xl font-bold">
          NeuroCare AI
        </h1>

        <p className="mt-4 text-gray-400">
          AI-powered educational guidance for child development.
        </p>

        <p className="mt-6 text-gray-500">
          © 2026 NeuroCare AI • Idea2Impact Hackathon
        </p>
      </footer>
    </>
  );
}

export default Home;