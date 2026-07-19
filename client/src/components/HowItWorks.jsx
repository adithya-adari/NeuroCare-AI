function HowItWorks() {
  return (
    <section className="py-24 px-10">

      <h2 className="text-5xl font-bold text-center">

        How It Works

      </h2>

      <div className="grid md:grid-cols-4 gap-8 mt-16">

        {[
          "Answer Questions",
          "AI Reviews Information",
          "Receive Guidance",
          "Consult Healthcare Professional"
        ].map((step, index) => (
          <div
            key={index}
            className="bg-blue-50 p-8 rounded-2xl text-center shadow"
          >
            <h3 className="text-4xl font-bold text-blue-700">
              {index + 1}
            </h3>

            <p className="mt-5 font-semibold">
              {step}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;