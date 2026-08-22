import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";
import questions from "../services/questions";

function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();

  const childId = new URLSearchParams(location.search).get("childId");

  const children =
    JSON.parse(localStorage.getItem("neurocare_children")) || [];

  const selectedChild = children.find(
    (child) => String(child.id) === String(childId)
  );

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return t.ageUnavailable;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let years =
      today.getFullYear() - birthDate.getFullYear();

    let months =
      today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${
        years === 1 ? t.year : t.years
      }`;
    }

    return `${months} ${
      months === 1 ? t.month : t.months
    }`;
  };

  const handleAnswer = async (answer) => {
    const updated = {
      ...answers,
      [questions[step].id]: answer,
    };

    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      /*
       * Send the selected language to the AI backend.
       *
       * en = English
       * te = Telugu
       * hi = Hindi
       */
      const res = await API.post("/ai/analyze", {
        answers: {
          ...updated,
          childName: selectedChild?.name || "Child",
          childId: childId || null,
        },
        language,
      });

      const report = res.data.report;

      // Save the latest AI assessment for this child
      const savedAssessments =
        JSON.parse(
          localStorage.getItem("neurocare_assessments")
        ) || [];

      const newAssessment = {
        id: Date.now(),
        childId: childId || null,
        childName: selectedChild?.name || "Child",
        risk: report.risk || "Moderate",
        report,
        answers: updated,
        language: language,
        assessedAt: new Date().toISOString(),
      };

      const updatedAssessments = [
        ...savedAssessments.filter(
          (item) =>
            String(item.childId) !== String(childId)
        ),
        newAssessment,
      ];

      localStorage.setItem(
        "neurocare_assessments",
        JSON.stringify(updatedAssessments)
      );

      navigate("/report", {
        state: {
          report,
          child: selectedChild,
          answers: updated,
          language: language,
        },
      });
    } catch (error) {
      console.log(error);

      alert(
        t.unableToGenerateReport ||
          "Unable to generate AI report."
      );
    } finally {
      setLoading(false);
    }
  };

  // If child was not found
  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg">

          <div className="text-6xl">
            ⚠️
          </div>

          <h1 className="text-3xl font-bold mt-5">
            {t.childNotFound || "Child Not Found"}
          </h1>

          <p className="text-gray-500 mt-3">
            {t.childNotFoundDescription ||
              "The selected child could not be found."}
          </p>

          <button
            onClick={() => navigate("/children")}
            className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold"
          >
            👶 {t.backToChildren || "Back to Children"}
          </button>

        </div>

      </div>
    );
  }

  // AI loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex justify-center items-center p-6">

        <div className="bg-white shadow-2xl rounded-3xl p-12 w-full max-w-2xl text-center">

          <div className="text-7xl animate-pulse">
            🧠
          </div>

          <h1 className="text-4xl font-extrabold text-blue-700 mt-6">
            NeuroCare AI
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            {t.aiAnalyzingAssessment ||
              "AI is analyzing the child's screening assessment..."}
          </p>

          <div className="mt-10 space-y-4 text-left text-lg">

            <p>
              ✅{" "}
              {t.reviewingResponses ||
                "Reviewing screening responses..."}
            </p>

            <p>
              ✅{" "}
              {t.checkingSymptoms ||
                "Checking reported symptoms and concerns..."}
            </p>

            <p>
              ✅{" "}
              {t.assessingDevelopment ||
                "Assessing developmental concerns..."}
            </p>

            <p>
              ✅{" "}
              {t.generatingRecommendations ||
                "Generating recommendations for the ASHA worker..."}
            </p>

          </div>

          <div className="mt-10 w-full bg-gray-200 rounded-full h-5 overflow-hidden">

            <div className="bg-blue-600 h-5 rounded-full animate-pulse w-full"></div>

          </div>

          <p className="mt-6 text-gray-500">
            {t.pleaseWait ||
              "Please wait a few seconds..."}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="bg-blue-700 text-white rounded-3xl shadow-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() => navigate("/children")}
                className="text-blue-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl md:text-5xl font-black mt-5">
                🧠 {t.assessment || "Assessment"}
              </h1>

              <p className="mt-3 text-blue-100">
                {t.ashaScreeningDescription ||
                  "Child screening assessment for ASHA workers."}
              </p>

            </div>

            {/* Language Selector */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-blue-100 mb-2">
                🌐 {t.language}
              </label>

              <select
                value={language}
                onChange={(e) =>
                  changeLanguage(e.target.value)
                }
                className="bg-white text-gray-800 rounded-xl px-4 py-3 font-semibold outline-none cursor-pointer"
              >

                <option value="en">
                  🇬🇧 {t.english}
                </option>

                <option value="te">
                  🇮🇳 {t.telugu}
                </option>

                <option value="hi">
                  🇮🇳 {t.hindi}
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* Child Information */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-sm font-semibold text-gray-500 uppercase">
                {t.childBeingAssessed ||
                  "Child Being Assessed"}
              </p>

              <h2 className="text-3xl font-black text-blue-700 mt-2">
                👶 {selectedChild.name}
              </h2>

              <div className="mt-4 grid sm:grid-cols-2 gap-x-10 gap-y-2 text-gray-600">

                <p>
                  <strong>{t.age}:</strong>{" "}
                  {calculateAge(
                    selectedChild.dateOfBirth
                  )}
                </p>

                <p>
                  <strong>{t.gender}:</strong>{" "}
                  {selectedChild.gender}
                </p>

                <p>
                  <strong>
                    {t.motherGuardianName}:
                  </strong>{" "}
                  {selectedChild.motherName}
                </p>

                <p>
                  <strong>{t.village}:</strong>{" "}
                  {selectedChild.village}
                </p>

              </div>

            </div>

            <div className="bg-blue-50 rounded-2xl p-6">

              <p className="text-sm text-blue-600 font-semibold">
                {t.screeningType ||
                  "Screening Type"}
              </p>

              <p className="text-xl font-bold text-blue-700 mt-2">
                {t.ashaChildScreening ||
                  "ASHA Child Screening"}
              </p>

            </div>

          </div>

        </div>

        {/* Progress */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <div className="flex justify-between items-center">

            <p className="text-gray-500 font-medium">

              {t.question || "Question"}{" "}

              <span className="font-bold text-blue-700">
                {step + 1}
              </span>{" "}

              {t.of || "of"}{" "}

              <span className="font-bold">
                {questions.length}
              </span>

            </p>

            <p className="font-bold text-blue-700">
              {Math.round(
                ((step + 1) / questions.length) * 100
              )}
              %
            </p>

          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full mt-5">

            <div
              className="bg-blue-700 h-4 rounded-full transition-all duration-500"
              style={{
                width: `${
                  ((step + 1) / questions.length) * 100
                }%`,
              }}
            ></div>

          </div>

        </div>

        {/* Question */}

        <div className="bg-white rounded-3xl shadow-2xl p-10 mt-8">

          <p className="text-sm font-semibold text-blue-600 uppercase">
            {t.parentAndAsHAQuestion ||
              "Parent / ASHA Screening Question"}
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-center leading-relaxed text-gray-800 mt-6">
            {t[questions[step].key]}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">

            <button
              onClick={() => handleAnswer("Yes")}
              className="bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-2xl font-bold duration-300 shadow-lg hover:scale-105"
            >
              ✅ {t.yes}
            </button>

            <button
              onClick={() => handleAnswer("No")}
              className="bg-red-600 hover:bg-red-700 text-white py-6 rounded-2xl text-2xl font-bold duration-300 shadow-lg hover:scale-105"
            >
              ❌ {t.no}
            </button>

          </div>

        </div>

        {/* Disclaimer */}

        <div className="bg-yellow-50 border-l-8 border-yellow-500 rounded-3xl p-6 mt-8">

          <p className="text-yellow-800 leading-7">
            ⚠️{" "}
            {t.screeningDisclaimer ||
              "This is a screening tool and does not provide a medical diagnosis. Clinical evaluation and final decisions must be made by a qualified healthcare professional."}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Assessment;