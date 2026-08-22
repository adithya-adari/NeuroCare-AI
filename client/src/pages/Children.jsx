import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Children() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [children, setChildren] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedChildren =
      JSON.parse(localStorage.getItem("neurocare_children")) || [];

    const savedAssessments =
      JSON.parse(localStorage.getItem("neurocare_assessments")) || [];

    const savedFollowUps =
      JSON.parse(localStorage.getItem("neurocare_followups")) || [];

    setChildren(savedChildren);
    setAssessments(savedAssessments);
    setFollowUps(savedFollowUps);
  }, []);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return t.ageUnavailable;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${
        years > 1 ? t.yearsOld : t.yearOld
      }`;
    }

    return `${months} ${
      months !== 1 ? t.monthsOld : t.monthOld
    }`;
  };

  const getChildAssessment = (childId) => {
    return assessments.find(
      (item) => String(item.childId) === String(childId)
    );
  };

  const getChildFollowUp = (childId) => {
    return followUps.find(
      (item) =>
        String(item.childId) === String(childId) &&
        item.status !== "Completed"
    );
  };

  const getRiskStyle = (risk) => {
    const riskText = String(risk || "").toLowerCase();

    if (riskText.includes("high")) {
      return "bg-red-100 text-red-700";
    }

    if (riskText.includes("moderate")) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (riskText.includes("low")) {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  const getRiskText = (risk) => {
    const riskText = String(risk || "").toLowerCase();

    if (riskText.includes("high")) {
      return t.high;
    }

    if (riskText.includes("moderate")) {
      return t.moderate;
    }

    if (riskText.includes("low")) {
      return t.low;
    }

    return risk;
  };

  const getGenderText = (gender) => {
    if (gender === "Male") {
      return t.male;
    }

    if (gender === "Female") {
      return t.female;
    }

    if (gender === "Other") {
      return t.other;
    }

    return gender;
  };

  const filteredChildren = children.filter((child) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      child.name?.toLowerCase().includes(search) ||
      child.motherName?.toLowerCase().includes(search) ||
      child.village?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-green-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() => navigate("/asha")}
                className="text-green-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                👶 {t.children}
              </h1>

              <p className="mt-3 text-green-100">
                {t.childrenPageDescription}
              </p>

            </div>

            {/* Language Selector */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-green-100 mb-2">
                🌐 {t.language}
              </label>

              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
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

        {/* Search */}

        {children.length > 0 && (

          <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">

            <label className="block font-bold text-gray-700 mb-2">
              🔍 {t.searchChildren}
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchChildrenPlaceholder}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

        )}

        {/* Main Content */}

        {children.length === 0 ? (

          /* No Children */

          <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

            <div className="text-6xl">
              👶
            </div>

            <h2 className="text-2xl font-bold mt-5">
              {t.noChildren}
            </h2>

            <p className="text-gray-500 mt-3">
              {t.registerChildFirst}
            </p>

            <button
              onClick={() => navigate("/add-child")}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold"
            >
              + {t.registerChild}
            </button>

          </div>

        ) : filteredChildren.length === 0 ? (

          /* No Search Results */

          <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.noChildrenFound}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.tryDifferentSearch}
            </p>

          </div>

        ) : (

          /* Child Cards */

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {filteredChildren.map((child) => {

              const assessment = getChildAssessment(child.id);
              const followUp = getChildFollowUp(child.id);

              return (

                <div
                  key={child.id}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >

                  {/* Child Information */}

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="text-5xl">
                        👶
                      </div>

                      <h2 className="text-2xl font-bold mt-4">
                        {child.name}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        {calculateAge(child.dateOfBirth)}
                      </p>

                      <p className="text-gray-500">
                        {getGenderText(child.gender)}
                      </p>

                      <p className="text-gray-500">
                        {t.motherGuardian}: {child.motherName}
                      </p>

                      <p className="text-gray-500">
                        {t.village}: {child.village}
                      </p>

                    </div>

                    <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-semibold">
                      {t.registered}
                    </span>

                  </div>

                  {/* Latest Assessment */}

                  <div className="mt-6 bg-blue-50 rounded-2xl p-5">

                    <h3 className="font-bold text-blue-700">
                      🧠 {t.latestAssessment}
                    </h3>

                    {assessment ? (

                      <div className="mt-3">

                        <div className="flex items-center justify-between">

                          <span className="text-gray-600">
                            {t.riskLevel}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full font-bold ${getRiskStyle(
                              assessment.risk
                            )}`}
                          >
                            {getRiskText(assessment.risk)}
                          </span>

                        </div>

                        <p className="text-gray-500 text-sm mt-3">
                          {t.assessmentCompleted}
                        </p>

                      </div>

                    ) : (

                      <p className="text-gray-500 mt-3">
                        {t.noAssessment}
                      </p>

                    )}

                  </div>

                  {/* Follow-up */}

                  <div className="mt-4 bg-yellow-50 rounded-2xl p-5">

                    <h3 className="font-bold text-yellow-700">
                      📅 {t.followUp}
                    </h3>

                    {followUp ? (

                      <div className="mt-3">

                        <p className="text-gray-700">
                          <strong>
                            {t.followUpDate}:
                          </strong>{" "}
                          {followUp.date}
                        </p>

                        <p className="text-gray-600 mt-1">
                          {followUp.note}
                        </p>

                        <span className="inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {followUp.status === "Pending"
                            ? t.pending
                            : followUp.status}
                        </span>

                      </div>

                    ) : (

                      <p className="text-gray-500 mt-3">
                        {t.noPendingFollowUp}
                      </p>

                    )}

                  </div>

                  {/* Actions */}

                  <div className="grid sm:grid-cols-2 gap-3 mt-6">

                    <button
                      onClick={() =>
                        navigate(`/assessment?childId=${child.id}`)
                      }
                      className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold"
                    >
                      🧠 {t.assessment}
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/follow-ups?childId=${child.id}`)
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-bold"
                    >
                      📅 {t.followUp}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default Children;