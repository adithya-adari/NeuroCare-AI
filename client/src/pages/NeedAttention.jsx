import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function NeedAttention() {
  const navigate = useNavigate();

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const [overdueCases, setOverdueCases] =
    useState([]);

  const [highRiskCases, setHighRiskCases] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadNeedAttentionCases();
  }, []);

  /* =========================================================
     LOAD NEED ATTENTION DATA
  ========================================================= */

  const loadNeedAttentionCases =
    async () => {
      try {
        setLoading(true);

        /* =====================================================
           1. LOAD CURRENT MOTHERS
        ===================================================== */

        const motherResponse =
          await API.get("/mothers");

        const mothers =
          motherResponse.data?.success
            ? motherResponse.data.mothers || []
            : [];

        /* =====================================================
           2. LOAD CURRENT CHILDREN
        ===================================================== */

        const childResponse =
          await API.get("/children");

        const children =
          childResponse.data?.success
            ? childResponse.data.children || []
            : [];

        /* =====================================================
           3. LOAD CHILD FOLLOW-UPS FROM MONGODB
        ===================================================== */

        const childFollowUpResponse =
          await API.get(
            "/child-followups"
          );

        const childFollowUps =
          childFollowUpResponse.data?.success
            ? childFollowUpResponse.data.followUps || []
            : [];

        /* =====================================================
           4. LOAD MOTHER FOLLOW-UPS FROM MONGODB
        ===================================================== */

        const motherFollowUpResponse =
          await API.get(
            "/mother-followups"
          );

        const motherFollowUps =
          motherFollowUpResponse.data?.success
            ? motherFollowUpResponse.data.followUps || []
            : [];

        /* =====================================================
           5. TODAY
        ===================================================== */

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        /* =====================================================
           6. FIND OVERDUE CHILD FOLLOW-UPS
        ===================================================== */

        const childOverdue =
          childFollowUps
            .filter(
              (item) =>
                item.date < today &&
                item.status === "Pending"
            )
            .map((item) => {

              const child =
                children.find(
                  (child) =>
                    String(child._id) ===
                    String(item.childId)
                );

              return {
                ...item,

                type: "Child",

                childName:
                  child?.name ||
                  item.childName ||
                  "Child",

                childId:
                  child?._id ||
                  item.childId,
              };
            });

        /* =====================================================
           7. FIND OVERDUE MOTHER FOLLOW-UPS
        ===================================================== */

        const motherOverdue =
          motherFollowUps
            .filter(
              (item) =>
                item.date < today &&
                item.status === "Pending"
            )
            .map((item) => {

              const mother =
                mothers.find(
                  (mother) =>
                    String(mother._id) ===
                    String(item.motherId)
                );

              return {
                ...item,

                type: "Mother",

                motherName:
                  mother?.name ||
                  item.motherName ||
                  "Mother",

                motherId:
                  mother?._id ||
                  item.motherId,
              };
            });

        /* =====================================================
           8. SET OVERDUE CASES
        ===================================================== */

        setOverdueCases([
          ...childOverdue,
          ...motherOverdue,
        ]);

        /* =====================================================
           9. LOAD AI ASSESSMENTS
        ===================================================== */

        const assessmentResponse =
          await API.get(
            "/ai/assessments"
          );

        const assessments =
          assessmentResponse.data
            ?.assessments || [];

        /* =====================================================
           10. FIND LATEST ASSESSMENT
               FOR EACH CHILD
        ===================================================== */

        const latestByChild =
          new Map();

        assessments.forEach(
          (assessment) => {

            const childId =
              assessment.answers
                ?.childId;

            const childName =
              assessment.answers
                ?.childName;

            const key = childId
              ? `id-${String(
                  childId
                )}`
              : childName
              ? `name-${String(
                  childName
                )
                  .trim()
                  .toLowerCase()}`
              : null;

            if (!key) {
              return;
            }

            const existing =
              latestByChild.get(key);

            if (
              !existing ||
              new Date(
                assessment.createdAt
              ).getTime() >
                new Date(
                  existing.createdAt
                ).getTime()
            ) {
              latestByChild.set(
                key,
                assessment
              );
            }
          }
        );

        /* =====================================================
           11. FIND HIGH-RISK CASES
        ===================================================== */

        const highRisk = [];

        latestByChild.forEach(
          (assessment) => {

            const risk =
              String(
                assessment.report
                  ?.risk || ""
              )
                .trim()
                .toLowerCase();

            if (risk !== "high") {
              return;
            }

            const assessmentChildId =
              assessment.answers
                ?.childId;

            const child =
              children.find(
                (item) =>
                  String(item._id) ===
                  String(
                    assessmentChildId
                  )
              );

            /*
             * Only show high-risk cases
             * for children that still
             * exist in MongoDB.
             */

            if (!child) {
              return;
            }

            highRisk.push({
              ...assessment,
              type: "HighRisk",
              child,
            });
          }
        );

        /* =====================================================
           12. SORT HIGH-RISK CASES
        ===================================================== */

        highRisk.sort(
          (a, b) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        );

        setHighRiskCases(
          highRisk
        );

      } catch (error) {

        console.error(
          "ERROR LOADING NEED ATTENTION:",
          error
        );

        setOverdueCases([]);
        setHighRiskCases([]);

      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     MARK FOLLOW-UP COMPLETED
  ========================================================= */

  const markCompleted = async (
    item
  ) => {

    const confirmed =
      window.confirm(
        `Mark this ${item.type.toLowerCase()} follow-up as completed?`
      );

    if (!confirmed) {
      return;
    }

    try {

      let response;

      /* CHILD */

      if (
        item.type === "Child"
      ) {

        response =
          await API.put(
            `/child-followups/${item._id}/complete`
          );
      }

      /* MOTHER */

      else if (
        item.type === "Mother"
      ) {

        response =
          await API.put(
            `/mother-followups/${item._id}/complete`
          );
      }

      if (
        !response?.data?.success
      ) {
        throw new Error(
          response?.data?.message ||
            "Unable to complete follow-up."
        );
      }

      /* REMOVE FROM SCREEN */

      setOverdueCases(
        (current) =>
          current.filter(
            (caseItem) =>
              caseItem._id !==
                item._id ||
              caseItem.type !==
                item.type
          )
      );

      alert(
        t.followUpMarkedCompleted ||
          "Follow-up marked as completed."
      );

    } catch (error) {

      console.error(
        "Complete follow-up error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to mark follow-up as completed."
      );
    }
  };

  /* =========================================================
     REMOVE FOLLOW-UP
  ========================================================= */

  const removeFollowUp = async (
    item
  ) => {

    const confirmed =
      window.confirm(
        `Remove this ${item.type.toLowerCase()} follow-up permanently?`
      );

    if (!confirmed) {
      return;
    }

    try {

      let response;

      /* CHILD */

      if (
        item.type === "Child"
      ) {

        response =
          await API.delete(
            `/child-followups/${item._id}`
          );
      }

      /* MOTHER */

      else if (
        item.type === "Mother"
      ) {

        response =
          await API.delete(
            `/mother-followups/${item._id}`
          );
      }

      if (
        !response?.data?.success
      ) {
        throw new Error(
          response?.data?.message ||
            "Unable to remove follow-up."
        );
      }

      /* REMOVE FROM SCREEN */

      setOverdueCases(
        (current) =>
          current.filter(
            (caseItem) =>
              caseItem._id !==
                item._id ||
              caseItem.type !==
                item.type
          )
      );

      alert(
        "Follow-up removed successfully."
      );

    } catch (error) {

      console.error(
        "Remove follow-up error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to remove follow-up."
      );
    }
  };

  /* =========================================================
     DAYS OVERDUE
  ========================================================= */

  const getDaysOverdue = (
    date
  ) => {

    const today =
      new Date();

    const followUpDate =
      new Date(date);

    const difference =
      today.getTime() -
      followUpDate.getTime();

    return Math.max(
      1,
      Math.floor(
        difference /
          (1000 *
            60 *
            60 *
            24)
      )
    );
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     OPEN FULL REPORT
  ========================================================= */

  const handleViewReport = (
    assessment,
    child
  ) => {

    const reportChild =
      child || {
        name:
          assessment.answers
            ?.childName ||
          "Child",

        id:
          assessment.answers
            ?.childId ||
          null,
      };

    navigate(
      "/report",
      {
        state: {
          report:
            assessment.report,

          child:
            reportChild,

          assessmentId:
            assessment._id,
        },
      }
    );
  };

  /* =========================================================
     TOTAL CASES
  ========================================================= */

  const totalCases =
    overdueCases.length +
    highRiskCases.length;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-red-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() =>
                  navigate("/asha")
                }
                className="text-red-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                ⚠️ {t.needAttention}
              </h1>

              <p className="mt-3 text-red-100">
                {t.needAttentionDescription}
              </p>

            </div>

            {/* LANGUAGE */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-red-100 mb-2">
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

        {/* SUMMARY */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                {t.overdueCases}
              </h2>

              <p className="text-gray-500 mt-2">
                {t.overdueCasesDescription}
              </p>

            </div>

            <div className="bg-red-100 text-red-700 rounded-2xl px-6 py-4 text-center">

              <p className="text-sm font-semibold">
                {t.cases}
              </p>

              <p className="text-3xl font-black">
                {totalCases}
              </p>

            </div>

          </div>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

            <div className="text-6xl">
              ⏳
            </div>

            <h2 className="text-2xl font-bold mt-5">
              Loading cases...
            </h2>

            <p className="text-gray-500 mt-3">
              Checking assessments and
              follow-ups.
            </p>

          </div>

        )}

        {/* HIGH RISK */}

        {!loading &&
          highRiskCases.length > 0 && (

            <div className="mt-8">

              <h2 className="text-2xl font-bold text-red-700">
                🔴 High-Risk AI Assessments
              </h2>

              <p className="text-gray-500 mt-2">
                Children whose latest AI
                screening result is High Risk.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                {highRiskCases.map(
                  (assessment) => {

                    const child =
                      assessment.child;

                    const childName =
                      child?.name ||
                      assessment.answers
                        ?.childName ||
                      "Child";

                    return (
                      <div
                        key={
                          assessment._id
                        }
                        className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-red-500"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <div className="text-5xl">
                              👶
                            </div>

                            <h2 className="text-2xl font-bold mt-4">
                              {childName}
                            </h2>

                            <p className="text-gray-500 mt-2">
                              High-risk AI
                              screening result
                            </p>

                          </div>

                          <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full font-bold">
                            High Risk
                          </span>

                        </div>

                        {/* ASSESSMENT DATE */}

                        <div className="bg-red-50 rounded-2xl p-5 mt-6">

                          <p className="text-red-700 font-bold">
                            ⚠️ AI Risk Level:
                            High
                          </p>

                          <p className="text-red-600 mt-2">
                            📅 Assessment:{" "}
                            {formatDate(
                              assessment.createdAt
                            )}
                          </p>

                        </div>

                        {/* CHILD INFORMATION */}

                        <div className="bg-slate-50 rounded-2xl p-5 mt-4">

                          <p className="font-semibold text-gray-700">
                            👶 Child Information
                          </p>

                          <div className="mt-3 space-y-2 text-gray-600">

                            <p>
                              <strong>
                                Child ID:
                              </strong>{" "}
                              {assessment
                                .answers
                                ?.childId ||
                                "N/A"}
                            </p>

                            <p>
                              <strong>
                                Gender:
                              </strong>{" "}
                              {child?.gender ||
                                "N/A"}
                            </p>

                            <p>
                              <strong>
                                Mother /
                                Guardian:
                              </strong>{" "}
                              {child?.motherName ||
                                "N/A"}
                            </p>

                            <p>
                              <strong>
                                Village:
                              </strong>{" "}
                              {child?.village ||
                                "N/A"}
                            </p>

                          </div>

                        </div>

                        {/* SUMMARY */}

                        <div className="bg-blue-50 rounded-2xl p-5 mt-4">

                          <p className="font-semibold text-blue-700">
                            📋 Assessment Summary
                          </p>

                          <p className="text-gray-600 mt-2 leading-7">
                            {assessment
                              .report
                              ?.summary ||
                              "No summary available."}
                          </p>

                        </div>

                        {/* VIEW REPORT */}

                        <button
                          onClick={() =>
                            handleViewReport(
                              assessment,
                              child
                            )
                          }
                          className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold"
                        >
                          📋 View Full Report
                        </button>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        {/* OVERDUE FOLLOW-UPS */}

        {!loading &&
          overdueCases.length > 0 && (

            <div className="mt-10">

              <h2 className="text-2xl font-bold text-red-700">
                ⚠️ Overdue Follow-ups
              </h2>

              <p className="text-gray-500 mt-2">
                These follow-ups are pending
                and past their scheduled date.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">

                {overdueCases.map(
                  (item) => (

                    <div
                      key={`${item.type}-${item._id}`}
                      className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-red-500"
                    >

                      {/* PERSON */}

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <div className="text-5xl">
                            {item.type ===
                            "Child"
                              ? "👶"
                              : "👩"}
                          </div>

                          <h2 className="text-2xl font-bold mt-4">
                            {item.type ===
                            "Child"
                              ? item.childName
                              : item.motherName}
                          </h2>

                          <p className="text-gray-500 mt-2">
                            {item.type ===
                            "Child"
                              ? t.childFollowUp
                              : t.motherFollowUp}
                          </p>

                        </div>

                        <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full font-semibold">
                          {t.pending}
                        </span>

                      </div>

                      {/* DATE */}

                      <div className="bg-red-50 rounded-2xl p-5 mt-6">

                        <p className="text-red-700 font-bold">
                          📅 {t.scheduled}:{" "}
                          {item.date}
                        </p>

                        <p className="text-red-600 mt-2">
                          ⏰{" "}
                          {getDaysOverdue(
                            item.date
                          )}{" "}
                          {getDaysOverdue(
                            item.date
                          ) !== 1
                            ? t.daysOverdue
                            : t.dayOverdue}
                        </p>

                      </div>

                      {/* NOTE */}

                      <div className="bg-slate-50 rounded-2xl p-5 mt-4">

                        <p className="font-semibold text-gray-700">
                          📝{" "}
                          {t.followUpNote}
                        </p>

                        <p className="text-gray-600 mt-2">
                          {item.note ||
                            "No note available."}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="grid sm:grid-cols-2 gap-4 mt-5">

                        <button
                          type="button"
                          onClick={() =>
                            markCompleted(
                              item
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold transition"
                        >
                          ✅{" "}
                          {t.markCompleted ||
                            "Mark Completed"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeFollowUp(
                              item
                            )
                          }
                          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl font-bold transition"
                        >
                          🗑️ Remove
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        {/* NO CASES */}

        {!loading &&
          totalCases === 0 && (

            <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

              <div className="text-6xl">
                ✅
              </div>

              <h2 className="text-2xl font-bold mt-5">
                No cases need attention
              </h2>

              <p className="text-gray-500 mt-3">
                There are no high-risk
                assessments or overdue
                follow-ups.
              </p>

            </div>

          )}

      </div>

    </div>
  );
}

export default NeedAttention;