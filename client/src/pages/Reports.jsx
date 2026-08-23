import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function Reports() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [assessments, setAssessments] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Risk filter
  const [riskFilter, setRiskFilter] = useState("All");

  // Date sorting
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    loadReports();

    const savedChildren =
      JSON.parse(
        localStorage.getItem("neurocare_children")
      ) || [];

    setChildren(savedChildren);
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/ai/assessments"
      );

      if (
        response.data &&
        Array.isArray(
          response.data.assessments
        )
      ) {
        setAssessments(
          response.data.assessments
        );
      } else {
        setAssessments([]);
      }

    } catch (error) {
      console.error(
        "Failed to load assessments:",
        error
      );

      setError(
        "Unable to load assessment reports."
      );

      setAssessments([]);

    } finally {
      setLoading(false);
    }
  };

  /* -------------------- CHILD -------------------- */

  const getChild = (childId) => {
    return children.find(
      (child) =>
        String(child.id) ===
        String(childId)
    );
  };

  /* -------------------- AGE -------------------- */

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return (
        t.ageUnavailable ||
        "Age unavailable"
      );
    }

    const birthDate =
      new Date(dateOfBirth);

    const today = new Date();

    let years =
      today.getFullYear() -
      birthDate.getFullYear();

    let months =
      today.getMonth() -
      birthDate.getMonth();

    let days =
      today.getDate() -
      birthDate.getDate();

    if (days < 0) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${
        years > 1
          ? t.years || "years"
          : t.year || "year"
      }`;
    }

    return `${months} ${
      months !== 1
        ? t.months || "months"
        : t.month || "month"
    }`;
  };

  /* -------------------- RISK -------------------- */

  const getRiskStyle = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "Moderate") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (risk === "Low") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const getRiskLabel = (risk) => {
    if (risk === "High") {
      return t.high || "High";
    }

    if (risk === "Moderate") {
      return t.moderate || "Moderate";
    }

    if (risk === "Low") {
      return t.low || "Low";
    }

    return risk || "Unknown";
  };

  /* -------------------- LANGUAGE -------------------- */

  const getLanguageLabel = (language) => {
    if (language === "te") {
      return t.telugu || "Telugu";
    }

    if (language === "hi") {
      return t.hindi || "Hindi";
    }

    return t.english || "English";
  };

  /* -------------------- DATE -------------------- */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* -------------------- VIEW REPORT -------------------- */

  const handleViewReport = (
    assessment,
    child
  ) => {

    const reportChild = child || {
      name:
        assessment.answers
          ?.childName ||
        "Child",

      id:
        assessment.answers
          ?.childId ||
        null,
    };

    navigate("/report", {
      state: {
        report: assessment.report,
        child: reportChild,
        assessmentId:
          assessment._id,
      },
    });
  };

  /* -------------------- SEARCH + FILTER + SORT -------------------- */

  const filteredAssessments =
    assessments
      .filter((assessment) => {

        const child =
          getChild(
            assessment.answers
              ?.childId
          );

        const childName =
          child?.name ||
          assessment.answers
            ?.childName ||
          "Child";

        const risk =
          assessment.report
            ?.risk ||
          "Moderate";

        const matchesSearch =
          childName
            .toLowerCase()
            .includes(
              searchTerm
                .trim()
                .toLowerCase()
            );

        const matchesRisk =
          riskFilter === "All" ||
          risk === riskFilter;

        return (
          matchesSearch &&
          matchesRisk
        );
      })
      .sort((a, b) => {

        const dateA = new Date(
          a.createdAt
        ).getTime();

        const dateB = new Date(
          b.createdAt
        ).getTime();

        if (sortOrder === "newest") {
          return dateB - dateA;
        }

        return dateA - dateB;
      });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-blue-700 text-white rounded-3xl shadow-xl p-8">

          <button
            onClick={() =>
              navigate("/asha")
            }
            className="text-blue-100 hover:text-white font-semibold"
          >
            ← {t.back || "Back"}
          </button>

          <h1 className="text-4xl md:text-5xl font-black mt-5">
            📋 {t.reports || "Reports"}
          </h1>

          <p className="text-blue-100 mt-3 text-lg">
            {t.reportsDescription ||
              "View saved AI assessment reports for children."}
          </p>

        </div>

        {/* Search + Risk Filter + Sort */}

        {!loading &&
          !error &&
          assessments.length > 0 && (

            <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">

              <div className="grid md:grid-cols-3 gap-6">

                {/* Search */}

                <div>

                  <label className="block text-gray-700 font-bold mb-3">
                    🔍 Search reports by child name
                  </label>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Enter child name..."
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Risk Filter */}

                <div>

                  <label className="block text-gray-700 font-bold mb-3">
                    ⚠️ Filter by risk level
                  </label>

                  <select
                    value={riskFilter}
                    onChange={(e) =>
                      setRiskFilter(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                  >

                    <option value="All">
                      All Risk Levels
                    </option>

                    <option value="Low">
                      🟢 Low
                    </option>

                    <option value="Moderate">
                      🟡 Moderate
                    </option>

                    <option value="High">
                      🔴 High
                    </option>

                  </select>

                </div>

                {/* Sort */}

                <div>

                  <label className="block text-gray-700 font-bold mb-3">
                    📅 Sort by
                  </label>

                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-800 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                  >

                    <option value="newest">
                      🆕 Newest First
                    </option>

                    <option value="oldest">
                      🕐 Oldest First
                    </option>

                  </select>

                </div>

              </div>

              {/* Clear Filters */}

              {(searchTerm ||
                riskFilter !== "All" ||
                sortOrder !== "newest") && (

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setRiskFilter("All");
                    setSortOrder("newest");
                  }}
                  className="mt-5 text-blue-700 font-bold hover:text-blue-900"
                >
                  ✕ Reset Filters & Sort
                </button>

              )}

            </div>
          )}

        {/* Loading */}

        {loading && (

          <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

            <div className="text-5xl">
              📋
            </div>

            <h2 className="text-2xl font-bold mt-5 text-blue-700">
              Loading reports...
            </h2>

            <p className="text-gray-500 mt-3">
              Please wait.
            </p>

          </div>

        )}

        {/* Error */}

        {!loading &&
          error && (

            <div className="bg-red-50 border border-red-200 rounded-3xl shadow-xl p-10 mt-8 text-center">

              <div className="text-5xl">
                ⚠️
              </div>

              <h2 className="text-2xl font-bold text-red-700 mt-5">
                {error}
              </h2>

              <button
                onClick={loadReports}
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold"
              >
                Try Again
              </button>

            </div>

          )}

        {/* No Reports */}

        {!loading &&
          !error &&
          assessments.length === 0 && (

            <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

              <div className="text-6xl">
                📋
              </div>

              <h2 className="text-2xl font-bold mt-5">
                No reports available
              </h2>

              <p className="text-gray-500 mt-3">
                Completed AI assessments
                will appear here.
              </p>

              <button
                onClick={() =>
                  navigate("/children")
                }
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold"
              >
                👶{" "}
                {t.children ||
                  "Children"}
              </button>

            </div>

          )}

        {/* No Matching Reports */}

        {!loading &&
          !error &&
          assessments.length > 0 &&
          filteredAssessments.length === 0 && (

            <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

              <div className="text-6xl">
                🔍
              </div>

              <h2 className="text-2xl font-bold mt-5">
                No matching reports
              </h2>

              <p className="text-gray-500 mt-3">
                No reports match the
                selected search and risk
                filter.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setRiskFilter("All");
                  setSortOrder("newest");
                }}
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold"
              >
                Reset
              </button>

            </div>

          )}

        {/* Reports */}

        {!loading &&
          !error &&
          filteredAssessments.length > 0 && (

            <div className="mt-8">

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-800">
                  🧠 Saved AI Assessments
                </h2>

                <p className="text-gray-500 mt-1">
                  {filteredAssessments.length}{" "}
                  report
                  {filteredAssessments.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found
                </p>

              </div>

              <div className="grid md:grid-cols-2 gap-8">

                {filteredAssessments.map(
                  (assessment) => {

                    const child =
                      getChild(
                        assessment
                          .answers
                          ?.childId
                      );

                    const childName =
                      child?.name ||
                      assessment.answers
                        ?.childName ||
                      "Child";

                    const risk =
                      assessment.report
                        ?.risk ||
                      "Moderate";

                    return (

                      <div
                        key={
                          assessment._id
                        }
                        className="bg-white rounded-3xl shadow-xl p-8"
                      >

                        {/* Child Header */}

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <div className="text-5xl">
                              👶
                            </div>

                            <h2 className="text-3xl font-black text-blue-700 mt-4">
                              {childName}
                            </h2>

                          </div>

                          <span
                            className={`px-4 py-2 rounded-full font-bold ${getRiskStyle(
                              risk
                            )}`}
                          >
                            {getRiskLabel(
                              risk
                            )}
                          </span>

                        </div>

                        {/* Child Information */}

                        <div className="bg-blue-50 rounded-2xl p-5 mt-6">

                          <h3 className="font-bold text-blue-700 text-lg">
                            👶{" "}
                            {t.childInformation ||
                              "Child Information"}
                          </h3>

                          <div className="mt-4 space-y-3">

                            <div className="flex justify-between gap-4">

                              <span className="font-semibold text-gray-500">
                                {t.age ||
                                  "Age"}
                              </span>

                              <span className="font-bold text-gray-800">
                                {calculateAge(
                                  child?.dateOfBirth
                                )}
                              </span>

                            </div>

                            <div className="flex justify-between gap-4">

                              <span className="font-semibold text-gray-500">
                                {t.gender ||
                                  "Gender"}
                              </span>

                              <span className="font-bold text-gray-800">
                                {child?.gender ||
                                  "N/A"}
                              </span>

                            </div>

                            <div className="flex justify-between gap-4">

                              <span className="font-semibold text-gray-500">
                                {t.motherGuardianName ||
                                  "Mother / Guardian"}
                              </span>

                              <span className="font-bold text-gray-800 text-right">
                                {child?.motherName ||
                                  "N/A"}
                              </span>

                            </div>

                            <div className="flex justify-between gap-4">

                              <span className="font-semibold text-gray-500">
                                {t.village ||
                                  "Village"}
                              </span>

                              <span className="font-bold text-gray-800 text-right">
                                {child?.village ||
                                  "N/A"}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* Assessment Details */}

                        <div className="bg-slate-50 rounded-2xl p-5 mt-5 space-y-4">

                          <div className="flex justify-between gap-4">

                            <span className="font-semibold text-gray-500">
                              Assessment Date
                            </span>

                            <span className="font-bold text-gray-800">
                              {formatDate(
                                assessment.createdAt
                              )}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4">

                            <span className="font-semibold text-gray-500">
                              Risk Level
                            </span>

                            <span
                              className={`font-bold ${
                                risk ===
                                "High"
                                  ? "text-red-600"
                                  : risk ===
                                    "Moderate"
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {getRiskLabel(
                                risk
                              )}
                            </span>

                          </div>

                          <div className="flex justify-between gap-4">

                            <span className="font-semibold text-gray-500">
                              Language
                            </span>

                            <span className="font-bold text-gray-800">
                              {getLanguageLabel(
                                assessment.language
                              )}
                            </span>

                          </div>

                        </div>

                        {/* Summary */}

                        <div className="bg-blue-50 rounded-2xl p-5 mt-5">

                          <h3 className="font-bold text-blue-700">
                            📋{" "}
                            {t.assessmentSummary ||
                              "Assessment Summary"}
                          </h3>

                          <p className="text-gray-700 mt-3 leading-7">
                            {assessment
                              .report
                              ?.summary ||
                              "No summary available."}
                          </p>

                        </div>

                        {/* View Report */}

                        <button
                          onClick={() =>
                            handleViewReport(
                              assessment,
                              child
                            )
                          }
                          className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-xl font-bold"
                        >
                          📋{" "}
                          {t.viewReport ||
                            "View Full Report"}
                        </button>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          )}

      </div>

    </div>
  );
}

export default Reports;