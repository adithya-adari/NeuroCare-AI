import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function Report() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useLanguage();

  const [report, setReport] = useState(
    location.state?.report || null
  );

  const [child, setChild] = useState(
    location.state?.child || null
  );

  const [loading, setLoading] = useState(
    !location.state?.report
  );

  const [error, setError] = useState("");

  useEffect(() => {
    const loadSavedReport = async () => {
      const params = new URLSearchParams(
        location.search
      );

      const assessmentId =
        params.get("assessmentId");

      const childId =
        params.get("childId");

      // If report was already passed from Assessment.jsx,
      // no MongoDB request is needed.
      if (location.state?.report) {

        if (!location.state?.child && childId) {
          const savedChildren =
            JSON.parse(
              localStorage.getItem(
                "neurocare_children"
              )
            ) || [];

          const selectedChild =
            savedChildren.find(
              (item) =>
                String(item.id) ===
                String(childId)
            );

          if (selectedChild) {
            setChild(selectedChild);
          }
        }

        setLoading(false);
        return;
      }

      // No assessment ID means there is no saved report to load.
      if (!assessmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get(
          `/ai/assessment-report/${assessmentId}`
        );

        const savedAssessment =
          response.data.assessment;

        if (!savedAssessment) {
          throw new Error(
            "Assessment not found"
          );
        }

        setReport(
          savedAssessment.report
        );

        // Find child information from localStorage
        const savedChildren =
          JSON.parse(
            localStorage.getItem(
              "neurocare_children"
            )
          ) || [];

        const savedChild =
          savedChildren.find(
            (item) =>
              String(item.id) ===
              String(
                savedAssessment.answers?.childId
              )
          );

        if (savedChild) {
          setChild(savedChild);
        }

      } catch (err) {
        console.log(
          "Unable to load saved report:",
          err
        );

        setError(
          "Unable to load the saved assessment report."
        );

      } finally {
        setLoading(false);
      }
    };

    loadSavedReport();
  }, [location.search, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex justify-center items-center p-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-6xl">
            📋
          </div>

          <h1 className="text-2xl font-bold mt-5 text-blue-700">
            {t.loading || "Loading report..."}
          </h1>

          <p className="text-gray-500 mt-3">
            Please wait while the saved assessment is loaded.
          </p>

        </div>

      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6">

        <div className="text-center">

          <h1 className="text-3xl font-bold">
            {error || t.noReportFound}
          </h1>

          <button
            onClick={() => navigate("/children")}
            className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
          >
            {t.backToChildren}
          </button>

        </div>

      </div>
    );
  }

  const riskText = report.risk || "Moderate";

  let riskLevel = "Moderate";

  if (
    riskText
      .toLowerCase()
      .includes("high")
  ) {
    riskLevel = "High";
  } else if (
    riskText
      .toLowerCase()
      .includes("low")
  ) {
    riskLevel = "Low";
  } else if (
    riskText
      .toLowerCase()
      .includes("moderate")
  ) {
    riskLevel = "Moderate";
  }

  const riskLabels = {
    Low: t.low,
    Moderate: t.moderate,
    High: t.high,
  };

  const colors = {
    Low: "bg-green-500",
    Moderate: "bg-yellow-500",
    High: "bg-red-500",
  };

  const riskTextColors = {
    Low: "text-green-600",
    Moderate: "text-yellow-600",
    High: "text-red-600",
  };

  const widths = {
    Low: "35%",
    Moderate: "65%",
    High: "95%",
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return t.ageUnavailable;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let years =
      today.getFullYear() -
      birthDate.getFullYear();

    let months =
      today.getMonth() -
      birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${
        years > 1 ? t.years : t.year
      }`;
    }

    return `${months} ${
      months !== 1 ? t.months : t.month
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-blue-700 text-white rounded-3xl shadow-xl p-8">

          <button
            onClick={() =>
              navigate("/children")
            }
            className="text-blue-100 hover:text-white font-semibold"
          >
            ← {t.backToChildren}
          </button>

          <h1 className="text-4xl md:text-5xl font-black mt-5">
            🧠 {t.neuroCareAIReport}
          </h1>

          <p className="text-blue-100 mt-3 text-lg">
            {t.aiPoweredDevelopmentalAssessment}
          </p>

        </div>

        {/* Child Information */}

        {child && (

          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <p className="text-sm font-semibold text-gray-500 uppercase">
                  {t.childAssessed}
                </p>

                <h2 className="text-3xl font-black text-blue-700 mt-2">
                  👶 {child.name}
                </h2>

                <div className="mt-4 space-y-2 text-gray-600">

                  <p>
                    <strong>{t.age}:</strong>{" "}
                    {calculateAge(
                      child.dateOfBirth
                    )}
                  </p>

                  <p>
                    <strong>{t.gender}:</strong>{" "}
                    {child.gender}
                  </p>

                  <p>
                    <strong>
                      {t.motherGuardianName}:
                    </strong>{" "}
                    {child.motherName}
                  </p>

                  <p>
                    <strong>{t.village}:</strong>{" "}
                    {child.village}
                  </p>

                </div>

              </div>

              <div className="bg-blue-50 rounded-2xl p-6">

                <p className="text-sm text-blue-600 font-semibold">
                  {t.assessmentStatus}
                </p>

                <p className="text-xl font-bold text-blue-700 mt-2">
                  {t.completed}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* Risk Level */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <h2 className="text-2xl font-bold">
              ⚠️ {t.aiRiskLevel}
            </h2>

            <span
              className={`font-bold text-xl ${riskTextColors[riskLevel]}`}
            >
              {riskLabels[riskLevel]}
            </span>

          </div>

          <div className="mt-6 bg-gray-200 rounded-full h-6">

            <div
              className={`${colors[riskLevel]} h-6 rounded-full transition-all duration-1000`}
              style={{
                width: widths[riskLevel],
              }}
            ></div>

          </div>

        </div>

        {/* Report Sections */}

        <div className="grid md:grid-cols-2 gap-8 mt-8">

          {/* Summary */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-blue-700">
              📋 {t.assessmentSummary}
            </h2>

            <p className="mt-6 leading-8 text-gray-700">
              {report.summary ||
                t.notAvailable}
            </p>

          </div>

          {/* Concerns */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-red-600">
              ⚠️ {t.possibleConcerns}
            </h2>

            <p className="mt-6 leading-8 text-gray-700">
              {report.concerns ||
                t.notAvailable}
            </p>

          </div>

          {/* Home Care */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-green-700">
              🏠 {t.homeCare}
            </h2>

            <p className="mt-6 leading-8 text-gray-700">
              {report.homeCare ||
                t.notAvailable}
            </p>

          </div>

          {/* Next Steps */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold text-yellow-700">
              👨‍⚕️ {t.nextSteps}
            </h2>

            <p className="mt-6 leading-8 text-gray-700">
              {report.doctor ||
                t.notAvailable}
            </p>

          </div>

        </div>

        {/* Medical Disclaimer */}

        <div className="bg-red-50 border-l-8 border-red-500 rounded-3xl p-8 mt-8">

          <h2 className="text-2xl font-bold text-red-700">
            📌 {t.medicalDisclaimer}
          </h2>

          <p className="mt-5 leading-8 text-gray-700">
            {report.disclaimer ||
              t.screeningDisclaimer}
          </p>

        </div>

        {/* Buttons */}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          <button
            onClick={() =>
              window.print()
            }
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold"
          >
            📄 {t.downloadReport}
          </button>

          <button
            onClick={() =>
              navigate("/children")
            }
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold"
          >
            👶 {t.backToChildren}
          </button>

          <button
            onClick={() =>
              navigate("/asha")
            }
            className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold"
          >
            🏠 {t.ashaDashboard}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Report;