import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function FollowUpsToday() {
  const navigate = useNavigate();

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const [followUps, setFollowUps] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* =====================================================
     LOAD TODAY'S FOLLOW-UPS FROM MONGODB
  ===================================================== */

  const loadTodayFollowUps = async () => {
    try {
      setLoading(true);

      /* -----------------------------------------------
         GET CHILD FOLLOW-UPS
      ------------------------------------------------ */

      const childResponse =
        await API.get(
          "/child-followups"
        );

      const childFollowUps =
        childResponse.data?.success
          ? childResponse.data.followUps || []
          : [];

      /* -----------------------------------------------
         GET MOTHER FOLLOW-UPS
      ------------------------------------------------ */

      const motherResponse =
        await API.get(
          "/mother-followups"
        );

      const motherFollowUps =
        motherResponse.data?.success
          ? motherResponse.data.followUps || []
          : [];

      /* -----------------------------------------------
         TODAY
      ------------------------------------------------ */

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      /* -----------------------------------------------
         CHILD FOLLOW-UPS FOR TODAY
      ------------------------------------------------ */

      const childToday =
        childFollowUps
          .filter(
            (item) =>
              item.date === today &&
              item.status === "Pending"
          )
          .map((item) => ({
            ...item,
            type: "Child",
            name: item.childName,
          }));

      /* -----------------------------------------------
         MOTHER FOLLOW-UPS FOR TODAY
      ------------------------------------------------ */

      const motherToday =
        motherFollowUps
          .filter(
            (item) =>
              item.date === today &&
              item.status === "Pending"
          )
          .map((item) => ({
            ...item,
            type: "Mother",
            name: item.motherName,
          }));

      /* -----------------------------------------------
         COMBINE
      ------------------------------------------------ */

      setFollowUps([
        ...childToday,
        ...motherToday,
      ]);

    } catch (error) {
      console.error(
        "Unable to load today's follow-ups:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load today's follow-ups."
      );

      setFollowUps([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayFollowUps();
  }, []);

  /* =====================================================
     MARK COMPLETED
  ===================================================== */

  const markCompleted = async (
    item
  ) => {
    try {
      let response;

      /* -----------------------------------------------
         CHILD
      ------------------------------------------------ */

      if (item.type === "Child") {
        response =
          await API.put(
            `/child-followups/${item._id}/complete`
          );
      }

      /* -----------------------------------------------
         MOTHER
      ------------------------------------------------ */

      else {
        response =
          await API.put(
            `/mother-followups/${item._id}/complete`
          );
      }

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to complete follow-up."
        );
      }

      /* -----------------------------------------------
         REMOVE FROM TODAY'S LIST
      ------------------------------------------------ */

      setFollowUps(
        (prev) =>
          prev.filter(
            (followUp) =>
              followUp._id !==
              item._id
          )
      );

      alert(
        t.followUpCompletedSuccessfully
      );

    } catch (error) {
      console.error(
        "Complete follow-up error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to mark follow-up as completed."
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-6xl">
            📅
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Loading today's follow-ups...
          </h2>

          <p className="text-gray-500 mt-3">
            Please wait.
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

        <div className="bg-yellow-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() =>
                  navigate("/asha")
                }
                className="text-yellow-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                📅 {t.todaysFollowUps}
              </h1>

              <p className="mt-3 text-yellow-100">
                {t.todaysFollowUpsDescription}
              </p>

            </div>

            {/* LANGUAGE SELECTOR */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-yellow-100 mb-2">
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
            SUMMARY
        ================================================= */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                {t.todaysSchedule}
              </h2>

              <p className="text-gray-500 mt-2">
                {t.pendingFollowUpsToday}
              </p>

            </div>

            <div className="bg-yellow-100 text-yellow-700 rounded-2xl px-6 py-4 text-center">

              <p className="text-sm font-semibold">
                {t.followUps}
              </p>

              <p className="text-3xl font-black">
                {followUps.length}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            FOLLOW-UP CARDS
        ================================================= */}

        {followUps.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

            <div className="text-6xl">
              ✅
            </div>

            <h2 className="text-2xl font-bold mt-5">
              {t.noFollowUpsToday}
            </h2>

            <p className="text-gray-500 mt-3">
              {t.noPendingFollowUpsTodayDescription}
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {followUps.map(
              (item) => (

                <div
                  key={`${item.type}-${item._id}`}
                  className="bg-white rounded-3xl shadow-xl p-8"
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
                        {item.name}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        {item.type ===
                        "Child"
                          ? t.childFollowUp
                          : t.motherFollowUp}
                      </p>

                    </div>

                    <span className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full font-semibold">
                      {t.pending}
                    </span>

                  </div>

                  {/* DATE */}

                  <div className="bg-yellow-50 rounded-2xl p-5 mt-6">

                    <p className="text-yellow-700 font-bold">
                      📅 {t.scheduledToday}
                    </p>

                  </div>

                  {/* NOTE */}

                  <div className="bg-slate-50 rounded-2xl p-5 mt-4">

                    <p className="font-semibold text-gray-700">
                      📝 {t.followUpNote}
                    </p>

                    <p className="text-gray-600 mt-2">
                      {item.note ||
                        "No note available."}
                    </p>

                  </div>

                  {/* COMPLETE */}

                  <button
                    onClick={() =>
                      markCompleted(
                        item
                      )
                    }
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                  >
                    ✅ {t.markCompleted}
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default FollowUpsToday;