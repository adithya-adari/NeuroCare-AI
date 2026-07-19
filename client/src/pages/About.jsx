function About() {
  return (
    <div className="min-h-screen bg-slate-100 py-20 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-5xl font-black text-blue-700 mb-8">
          About NeuroCare AI
        </h1>
        <p className="text-lg text-gray-700 leading-9">
          NeuroCare AI is an AI-powered pediatric support platform designed
          to help parents understand developmental milestones through
          educational guidance.
        </p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-blue-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              🎯 Mission
            </h2>
            <p className="text-gray-700">
              Help parents monitor child development using responsible AI.
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              🤖 AI Assistant
            </h2>
            <p className="text-gray-700">
              Provides educational responses and personalized assessment
              reports.
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              ⚠ Disclaimer
            </h2>
            <p className="text-gray-700">
              NeuroCare AI does not diagnose diseases. Always consult a
              qualified pediatrician for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;