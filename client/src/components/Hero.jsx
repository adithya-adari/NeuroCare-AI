import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center pt-24 pb-20"
      style={{
        backgroundImage: `url(${hero})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-cyan-600/35"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 md:px-20">

        <div className="max-w-2xl">

          <span className="inline-block bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-lg">
            AI-Powered Pediatric Assistant
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mt-8">
            Supporting Early
            <br />
            Child Development
            <br />
            with AI
          </h1>

          <p className="text-blue-100 text-xl leading-10 mt-8">
            NeuroCare AI helps parents monitor developmental milestones,
            receive AI-powered educational guidance, generate personalized
            assessment reports, and understand when it is appropriate to seek
            professional pediatric care.
          </p>

          {/* Feature Tags */}

          <div className="flex flex-wrap gap-4 mt-8">

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              🧠 AI Powered
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              👶 Child Development
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              📄 Smart Reports
            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-wrap gap-6 mt-10">

            <Link
              to="/assessment"
              className="bg-white text-blue-700 px-8 py-5 rounded-xl text-lg font-bold hover:scale-105 duration-300 shadow-xl"
            >
              Start Assessment
            </Link>

            <Link
              to="/chat"
              className="border-2 border-white text-white px-8 py-5 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-700 duration-300"
            >
              Ask NeuroCare AI
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;