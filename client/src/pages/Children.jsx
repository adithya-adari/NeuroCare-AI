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
  const [loadingFollowUps, setLoadingFollowUps] =
    useState(false);

  /* =====================================================
     LOAD PAGE DATA
  ===================================================== */

  useEffect(() => {
    loadChildren();
    loadChildFollowUps();
  }, []);

  /* =====================================================
     GET CHILDREN FROM MONGODB
  ===================================================== */

  const loadChildren = async () => {
    try {
      setLoadingChildren(true);

      const response = await API.get("/children");

      if (response.data?.success) {
        const mongoChildren =
          response.data.children || [];

        setChildren(mongoChildren);

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
     GET CHILD FOLLOW-UPS FROM MONGODB
  ===================================================== */

  const loadChildFollowUps = async () => {
    try {
      setLoadingFollowUps(true);

      const response =
        await API.get("/child-followups");

      if (response.data?.success) {
        const mongoFollowUps =
          response.data.followUps || [];

        setFollowUps(mongoFollowUps);

        console.log(
          "Child follow-ups loaded:",
          mongoFollowUps
        );
      } else {
        setFollowUps([]);
      }
    } catch (error) {
      console.error(
        "Unable to load child follow-ups:",
        error
      );

      /*
       * Fallback to old localStorage data.
       * This prevents old records from disappearing
       * if the API temporarily fails.
       */
      try {
        const savedFollowUps =
          JSON.parse(
            localStorage.getItem(
              "neurocare_followups"
            )
          ) || [];

        setFollowUps(savedFollowUps);
      } catch {
        setFollowUps([]);
      }
    } finally {
      setLoadingFollowUps(false);
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
              response.data?.assessments || []
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

      setAssessments(allAssessments);
    } catch (error) {
      console.error(
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
     
     FOLLOW-UPS COME FROM MONGODB
  ===================================================== */

  const getChildFollowUp = (
    childId
  ) => {
    const matchingFollowUps =
      followUps.filter((item) => {

        /*
         * MongoDB may return:
         *
         * childId: "123"
         *
         * OR:
         *
         * childId: {
         *   _id: "123",
         *   name: "Child"
         * }
         */

        const followUpChildId =
          item.childId?._id ||
          item.childId;

        const sameChild =
          String(followUpChildId) ===
          String(childId);

        const status =
          String(
            item.status || ""
          )
            .trim()
            .toLowerCase();

        return (
          sameChild &&
          status !== "completed"
        );
      });

    if (
      matchingFollowUps.length === 0
    ) {
      return null;
    }

    /*
     * If multiple pending follow-ups exist,
     * show the nearest scheduled date.
     */

    matchingFollowUps.sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

    return matchingFollowUps[0];
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
     FORMAT FOLLOW-UP DATE
  ===================================================== */

  const formatFollowUpDate = (
    date
  ) => {
    if (!date) {
      return "N/A";
    }

    /*
     * Keep YYYY-MM-DD values stable
     * without timezone shifting.
     */

    const dateText =
      String(date).substring(0, 10);

    const parts =
      dateText.split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateText;
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

  /* =====================================================
     MAIN UI
  ===================================================== */

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

            {/* LANGUAGE */}

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
            LOADING FOLLOW-UPS
        ================================================= */}

        {loadingFollowUps &&
          children.length > 0 && (

            <div className="bg-yellow-50 text-yellow-700 rounded-2xl p-4 mt-4 text-center font-semibold">
              Loading follow-ups...
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

                    {/* =================================================
                        CHILD INFORMATION
                    ================================================= */}

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

                    {/* =================================================
                        LATEST ASSESSMENT
                    ================================================= */}

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

                    {/* =================================================
                        FOLLOW-UP
                    ================================================= */}

                    <div className="mt-4 bg-yellow-50 rounded-2xl p-5">

                      <div className="flex items-center justify-between gap-3">

                        <h3 className="font-bold text-yellow-700">
                          📅 {t.followUp}
                        </h3>

                        {followUp && (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                            {String(
                              followUp.status
                            )
                              .toLowerCase() ===
                            "pending"
                              ? t.pending
                              : followUp.status}
                          </span>
                        )}

                      </div>

                      {followUp ? (

                        <div className="mt-4">

                          {/* SCHEDULED DATE */}

                          <div className="bg-white rounded-xl p-4 border border-yellow-200">

                            <p className="text-gray-500 text-sm">
                              {t.followUpDate}
                            </p>

                            <p className="text-lg font-bold text-gray-800 mt-1">
                              📅{" "}
                              {formatFollowUpDate(
                                followUp.date
                              )}
                            </p>

                          </div>

                          {/* NOTE */}

                          {followUp.note && (
                            <p className="text-gray-600 mt-3">
                              <strong>
                                Note:
                              </strong>{" "}
                              {followUp.note}
                            </p>
                          )}

                          {/* STATUS */}

                          <div className="mt-3">

                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                String(
                                  followUp.status ||
                                    ""
                                )
                                  .toLowerCase() ===
                                "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {String(
                                followUp.status ||
                                  ""
                              )
                                .toLowerCase() ===
                              "pending"
                                ? `🕒 ${t.pending}`
                                : `✓ ${followUp.status}`}
                            </span>

                          </div>

                        </div>

                      ) : (

                        <div className="mt-3">

                          <p className="text-gray-500">
                            {t.noPendingFollowUp}
                          </p>

                          <p className="text-gray-400 text-sm mt-2">
                            No pending child follow-up is currently scheduled.
                          </p>

                        </div>

                      )}

                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

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