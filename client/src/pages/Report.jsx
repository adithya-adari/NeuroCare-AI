import { useLocation, useNavigate } from "react-router-dom";

function Report() {
  const navigate = useNavigate();
  const location = useLocation();

  const report = location.state?.report;

  if (!report) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold">
          No Report Found
        </h1>
      </div>
    );
  }

  const risk = report.risk || "Moderate";

  const colors = {
    Low: "bg-green-500",
    Moderate: "bg-yellow-500",
    High: "bg-red-500",
  };

  const widths = {
    Low: "35%",
    Moderate: "65%",
    High: "95%",
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-black text-center text-blue-700">
          🧠 NeuroCare AI Report
        </h1>

        <p className="text-center mt-3 text-gray-600">
          AI-powered developmental assessment
        </p>

        {/* Risk Meter */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

          <div className="flex justify-between">

            <h2 className="text-2xl font-bold">
              AI Risk Level
            </h2>

            <span className="font-bold text-xl">
              {risk}
            </span>

          </div>

          <div className="mt-6 bg-gray-200 rounded-full h-6">

            <div
              className={`${colors[risk]} h-6 rounded-full transition-all duration-1000`}
              style={{
                width: widths[risk],
              }}
            ></div>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-blue-700">
              📋 Assessment Summary
            </h2>

            <p className="mt-6 leading-8">
              {report.summary}
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-red-600">
              ⚠ Possible Concerns
            </h2>

            <p className="mt-6 leading-8">
              {report.concerns}
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-green-700">
              🏠 Home Care
            </h2>

            <p className="mt-6 leading-8">
              {report.homeCare}
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-yellow-700">
              👨‍⚕ Next Steps
            </h2>

            <p className="mt-6 leading-8">
              {report.doctor}
            </p>

          </div>

        </div>

        <div className="bg-red-50 border-l-8 border-red-500 rounded-3xl p-8 mt-10">

          <h2 className="text-2xl font-bold text-red-700">
            📌 Medical Disclaimer
          </h2>

          <p className="mt-5 leading-8">
            {report.disclaimer}
          </p>

        </div>

        <div className="flex justify-center gap-8 mt-10">

          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold"
          >
            📄 Download Report
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            🏠 Home
          </button>

        </div>

      </div>

    </div>
  );
}

export default Report;