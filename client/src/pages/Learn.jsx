function Learn() {
  return (
    <div className="min-h-screen bg-slate-100 py-20 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-black text-blue-700 mb-10">
          Learn About Child Development
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-3">👶 Motor Skills</h2>
            <p className="text-gray-600">
              Learn when babies usually begin rolling, sitting, crawling,
              standing and walking.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-3">🧠 Brain Development</h2>
            <p className="text-gray-600">
              Understand how a child's brain develops during the first years
              of life.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-3">🍎 Nutrition</h2>
            <p className="text-gray-600">
              Healthy nutrition plays an important role in growth and
              development.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-3">💬 Speech</h2>
            <p className="text-gray-600">
              Discover speech and language milestones from infancy to early
              childhood.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-3">🏃 Physical Activity</h2>
            <p className="text-gray-600">
              Daily play helps children develop coordination and strength.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-3">❤️ Early Screening</h2>
            <p className="text-gray-600">
              Early developmental screening helps parents identify concerns
              and seek professional guidance when needed.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Learn;