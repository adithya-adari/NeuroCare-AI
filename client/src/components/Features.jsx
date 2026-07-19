function Features() {
  return (
    <section className="py-24 px-10 bg-gray-100">

      <h2 className="text-5xl font-bold text-center">

        Why NeuroCare AI?

      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold">
            AI Assessment
          </h3>

          <p className="mt-5">
            Personalized guidance based on reported symptoms and milestones.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold">
            Milestone Tracking
          </h3>

          <p className="mt-5">
            Understand developmental progress with simple assessments.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold">
            Parent Education
          </h3>

          <p className="mt-5">
            Learn about SMA and related neuromuscular disorders in plain language.
          </p>
        </div>

      </div>

    </section>
  );
}

export default Features;