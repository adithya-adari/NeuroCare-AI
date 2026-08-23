import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function Children() {
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();

  const [children, setChildren] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingAssessments, setLoadingAssessments] =
    useState(false);

  /* =====================================================
     LOAD CHILDREN FROM MONGODB
  ===================================================== */

  useEffect(() => {
    loadChildren();

    // Follow-ups remain in localStorage
    const savedFollowUps =
      JSON.parse(
        localStorage.getItem("neurocare_followups")
      ) || [];

    setFollowUps(savedFollowUps);
  }, []);

  /* =====================================================
     GET CHILDREN
  ===================================================== */

  const loadChildren = async () => {
    try {
      setLoadingChildren(true);

      const response = await API.get("/children");

      if (response.data?.success) {
        const mongoChildren =
          response.data.children || [];

        setChildren(mongoChildren);

        // Load assessments for MongoDB children
        loadAssessments(mongoChildren);
      } else {
        setChildren([]);
        setAssessments([]);
      }

    } catch (error) {
      console.error(
        "Unable to load children:",
        error
      );

      setChildren([]);
      setAssessments([]);

      alert(
        "Unable to load children. Please try again."
      );

    } finally {
      setLoadingChildren(false);
    }
  };

  /* =====================================================
     LOAD ASSESSMENTS FOR CHILDREN
  ===================================================== */

  const loadAssessments = async (
    savedChildren
  ) => {
    if (
      !savedChildren ||
      savedChildren.length === 0
    ) {
      setAssessments([]);
      return;
    }

    setLoadingAssessments(true);

    try {
      const results = await Promise.all(
        savedChildren.map(async (child) => {
          try {
            /*
              MongoDB children use _id.

              Old localStorage children used id.
              We support both so existing assessment
              records don't immediately break.
            */

            const childId =
              child._id || child.id;

            if (!childId) {
              return [];
            }

            const response =
              await API.get(
                `/ai/assessments/${childId}`
              );

            return (
              response.data.assessments || []
            );

          } catch (error) {
            console.log(
              `Unable to load assessments for child ${
                child._id || child.id
              }`,
              error
            );

            return [];
          }
        })
      );

      const allAssessments =
        results.flat();

      /*
        The API returns newest assessments first.
        Keep that order so the first assessment
        is the latest one.
      */

      setAssessments(allAssessments);

    } catch (error) {
      console.log(
        "Unable to load assessments:",
        error
      );

      setAssessments([]);

    } finally {
      setLoadingAssessments(false);
    }
  };

  /* =====================================================
     CALCULATE AGE
  ===================================================== */

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
      return t.ageUnavailable;
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

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} ${
        years > 1
          ? t.yearsOld
          : t.yearOld
      }`;
    }

    return `${months} ${
      months !== 1
        ? t.monthsOld
        : t.monthOld
    }`;
  };

  /* =====================================================
     GET CHILD ASSESSMENT
  ===================================================== */

  const getChildAssessment = (
    childId
  ) => {
    const childAssessments =
      assessments.filter(
        (item) =>
          String(
            item.answers?.childId
          ) === String(childId)
      );

    if (
      childAssessments.length === 0
    ) {
      return null;
    }

    return childAssessments[0];
  };

  /* =====================================================
     GET CHILD FOLLOW-UP

     FOLLOW-UPS REMAIN IN LOCALSTORAGE
  ===================================================== */

  const getChildFollowUp = (
    childId
  ) => {
    return followUps.find(
      (item) =>
        String(item.childId) ===
          String(childId) &&
        item.status !== "Completed"
    );
  };

  /* =====================================================
     RISK STYLE
  ===================================================== */

  const getRiskStyle = (risk) => {
    const riskText =
      String(risk || "").toLowerCase();

    if (
      riskText.includes("high")
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      riskText.includes("moderate")
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      riskText.includes("low")
    ) {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  /* =====================================================
     RISK TEXT
  ===================================================== */

  const getRiskText = (risk) => {
    const riskText =
      String(risk || "").toLowerCase();

    if (
      riskText.includes("high")
    ) {
      return t.high;
    }

    if (
      riskText.includes("moderate")
    ) {
      return t.moderate;
    }

    if (
      riskText.includes("low")
    ) {
      return t.low;
    }

    return risk;
  };

  /* =====================================================
     GENDER TEXT
  ===================================================== */

  const getGenderText = (
    gender
  ) => {
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

  /* =====================================================
     VIEW REPORT
  ===================================================== */

  const handleViewReport = (
    assessment,
    child
  ) => {
    const childId =
      child._id || child.id;

    navigate(
      `/report?assessmentId=${assessment._id}&childId=${childId}`
    );
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredChildren =
    children.filter((child) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return (
        child.name
          ?.toLowerCase()
          .includes(search) ||
        child.motherName
          ?.toLowerCase()
          .includes(search) ||
        child.village
          ?.toLowerCase()
          .includes(search)
      );
    });

  /* =====================================================
     LOADING CHILDREN
  ===================================================== */

  if (loadingChildren) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-5xl">
            👶
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Loading children...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we load registered children.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="bg-green-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() =>
                  navigate("/asha")
                }
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
                onChange={(e) =>
                  changeLanguage(
                    e.target.value
                  )
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

        {/* =================================================
            SEARCH
        ================================================= */}

        {children.length > 0 && (

          <div className="bg-white rounded-3xl shadow-xl p-6 mt-8">

            <label className="block font-bold text-gray-700 mb-2">
              🔍 {t.searchChildren}
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder={
                t.searchChildrenPlaceholder
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

        )}

        {/* =================================================
            LOADING ASSESSMENTS
        ================================================= */}

        {loadingAssessments &&
          children.length > 0 && (

            <div className="bg-blue-50 text-blue-700 rounded-2xl p-4 mt-6 text-center font-semibold">
              {t.loading ||
                "Loading assessments..."}
            </div>

          )}

        {/* =================================================
            NO CHILDREN
        ================================================= */}

        {children.length === 0 ? (

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
              onClick={() =>
                navigate("/add-child")
              }
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold"
            >
              + {t.registerChild}
            </button>

          </div>

        ) : filteredChildren.length ===
          0 ? (

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

          /* =================================================
             CHILD CARDS
          ================================================= */

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {filteredChildren.map(
              (child) => {

                /*
                  MongoDB uses _id.
                  Old localStorage data used id.
                */

                const childId =
                  child._id || child.id;

                const assessment =
                  getChildAssessment(
                    childId
                  );

                const followUp =
                  getChildFollowUp(
                    childId
                  );

                return (

                  <div
                    key={childId}
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
                          {calculateAge(
                            child.dateOfBirth
                          )}
                        </p>

                        <p className="text-gray-500">
                          {getGenderText(
                            child.gender
                          )}
                        </p>

                        <p className="text-gray-500">
                          {t.motherGuardian}:{" "}
                          {child.motherName}
                        </p>

                        <p className="text-gray-500">
                          {t.village}:{" "}
                          {child.village}
                        </p>

                      </div>

                      <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-semibold">
                        {t.registered}
                      </span>

                    </div>

                    {/* Latest Assessment */}

                    <div className="mt-6 bg-blue-50 rounded-2xl p-5">

                      <h3 className="font-bold text-blue-700">
                        🧠{" "}
                        {t.latestAssessment}
                      </h3>

                      {assessment ? (

                        <div className="mt-3">

                          <div className="flex items-center justify-between">

                            <span className="text-gray-600">
                              {t.riskLevel}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full font-bold ${getRiskStyle(
                                assessment.report?.risk
                              )}`}
                            >
                              {getRiskText(
                                assessment.report?.risk
                              )}
                            </span>

                          </div>

                          <p className="text-gray-500 text-sm mt-3">
                            {t.assessmentCompleted}
                          </p>

                          <button
                            onClick={() =>
                              handleViewReport(
                                assessment,
                                child
                              )
                            }
                            className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold"
                          >
                            📋{" "}
                            {t.viewReport ||
                              "View Full Report"}
                          </button>

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

                            {followUp.status ===
                            "Pending"
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
                          navigate(
                            `/assessment?childId=${childId}`
                          )
                        }
                        className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold"
                      >
                        🧠 {t.assessment}
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/follow-ups?childId=${childId}`
                          )
                        }
                        className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-bold"
                      >
                        📅 {t.followUp}
                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Children;