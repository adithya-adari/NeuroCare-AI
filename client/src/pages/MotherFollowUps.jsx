import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function MotherFollowUps() {
  const navigate = useNavigate();

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [searchParams] =
    useSearchParams();

  const motherIdFromUrl =
    searchParams.get("motherId");

  const [mothers, setMothers] =
    useState([]);

  const [followUps, setFollowUps] =
    useState([]);

  const [selectedMother, setSelectedMother] =
    useState("");

  const [date, setDate] =
    useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadData();
  }, [motherIdFromUrl]);

  const loadData = async () => {
    try {
      setLoading(true);

      /* -----------------------------------------------
         LOAD MOTHERS
      ------------------------------------------------ */

      const motherResponse =
        await API.get("/mothers");

      let motherList = [];

      if (
        motherResponse.data?.success
      ) {
        motherList =
          motherResponse.data.mothers ||
          [];
      }

      setMothers(motherList);

      /* -----------------------------------------------
         LOAD FOLLOW-UPS
      ------------------------------------------------ */

      const followUpResponse =
        await API.get(
          "/mother-followups"
        );

      let followUpList = [];

      if (
        followUpResponse.data?.success
      ) {
        followUpList =
          followUpResponse.data.followUps ||
          [];
      }

      setFollowUps(
        followUpList
      );

      /* -----------------------------------------------
         SELECT MOTHER FROM URL
      ------------------------------------------------ */

      if (motherIdFromUrl) {

        const selected =
          motherList.find(
            (mother) => {

              const motherId =
                mother._id ||
                mother.id;

              return (
                String(motherId) ===
                String(
                  motherIdFromUrl
                )
              );
            }
          );

        if (selected) {

          setSelectedMother(
            String(
              selected._id ||
                selected.id
            )
          );

        }

      }

    } catch (error) {

      console.error(
        "Failed to load mother follow-up data:",
        error
      );

      setMothers([]);
      setFollowUps([]);

    } finally {

      setLoading(false);

    }
  };

  /* =====================================================
     SCHEDULE FOLLOW-UP
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !selectedMother ||
      !date
    ) {
      alert(
        t.motherFollowUpRequired
      );
      return;
    }

    if (date < today) {
      alert(
        t.motherFollowUpDatePast
      );
      return;
    }

    const mother =
      mothers.find(
        (item) => {

          const motherId =
            item._id ||
            item.id;

          return (
            String(motherId) ===
            String(
              selectedMother
            )
          );

        }
      );

    if (!mother) {
      alert(
        t.motherNotFound
      );
      return;
    }

    const motherId =
      mother._id ||
      mother.id;

    try {

      const response =
        await API.post(
          "/mother-followups",
          {
            motherId:
              String(motherId),

            motherName:
              mother.name,

            date,

            note:
              note.trim() ||
              t.routineMaternalFollowUp,
          }
        );

      if (
        !response.data?.success
      ) {

        alert(
          response.data?.message ||
            "Failed to schedule follow-up."
        );

        return;

      }

      /* -----------------------------------------------
         RELOAD FOLLOW-UPS FROM DATABASE
      ------------------------------------------------ */

      await loadData();

      setSelectedMother("");
      setDate("");
      setNote("");

      alert(
        t.motherFollowUpScheduled
      );

    } catch (error) {

      console.error(
        "Failed to schedule mother follow-up:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to schedule follow-up."
      );

    }

  };

  /* =====================================================
     MARK COMPLETED
  ===================================================== */

  const markCompleted = async (
    followUpId
  ) => {

    try {

      const response =
        await API.put(
          `/mother-followups/${followUpId}/complete`
        );

      if (
        !response.data?.success
      ) {

        alert(
          response.data?.message ||
            "Failed to complete follow-up."
        );

        return;

      }

      await loadData();

      alert(
        t.followUpMarkedCompleted
      );

    } catch (error) {

      console.error(
        "Failed to complete follow-up:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to complete follow-up."
      );

    }

  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-blue-700 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() =>
                  navigate("/mothers")
                }
                className="text-blue-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                📅 {t.motherFollowUps}
              </h1>

              <p className="mt-3 text-blue-100">
                {t.motherFollowUpsDescription}
              </p>

            </div>

            {/* LANGUAGE */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-blue-100 mb-2">
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

        {/* SCHEDULE */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-xl p-8 mt-8"
        >

          <h2 className="text-2xl font-bold">
            {t.scheduleNewMotherFollowUp}
          </h2>

          {loading ? (

            <div className="mt-6 bg-blue-50 rounded-2xl p-6 text-center">

              <div className="text-4xl">
                ⏳
              </div>

              <p className="text-blue-700 font-semibold mt-3">
                Loading mothers...
              </p>

            </div>

          ) : mothers.length === 0 ? (

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl p-5">

              <p className="text-blue-800 font-medium">
                {t.noMothersRegistered}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/add-mother"
                  )
                }
                className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
              >
                {t.registerMotherButton}
              </button>

            </div>

          ) : (

            <>

              {/* MOTHER */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.selectMother}
                </label>

                <select
                  value={selectedMother}
                  onChange={(e) =>
                    setSelectedMother(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    {t.selectRegisteredMother}
                  </option>

                  {mothers.map(
                    (mother) => {

                      const motherId =
                        mother._id ||
                        mother.id;

                      return (
                        <option
                          key={motherId}
                          value={motherId}
                        >
                          {mother.name} —{" "}
                          {mother.village}
                        </option>
                      );

                    }
                  )}

                </select>

                {motherIdFromUrl &&
                  selectedMother && (

                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓{" "}
                      {t.motherSelectedFromMothersPage}
                    </p>

                  )}

              </div>

              {/* DATE */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.followUpDate}
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                  min={today}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-sm text-gray-500 mt-2">
                  {t.followUpDateFuture}
                </p>

              </div>

              {/* NOTE */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.followUpNote}
                </label>

                <textarea
                  value={note}
                  onChange={(e) =>
                    setNote(
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder={
                    t.motherFollowUpNotePlaceholder
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold"
              >
                📅{" "}
                {t.scheduleFollowUp}
              </button>

            </>

          )}

        </form>

        {/* EXISTING FOLLOW-UPS */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <h2 className="text-2xl font-bold">
            {t.scheduledMotherFollowUps}
          </h2>

          {followUps.length === 0 ? (

            <div className="mt-6 bg-slate-50 rounded-2xl p-6 text-center">

              <p className="text-gray-500">
                {t.noMotherFollowUps}
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {followUps.map(
                (item) => {

                  const followUpId =
                    item._id ||
                    item.id;

                  return (

                    <div
                      key={followUpId}
                      className="bg-slate-50 rounded-2xl p-6"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                          <h3 className="text-xl font-bold">
                            👩{" "}
                            {item.motherName}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            📅{" "}
                            {item.date}
                          </p>

                          <p className="text-gray-600 mt-1">
                            📝{" "}
                            {item.note ||
                              t.routineMaternalFollowUp}
                          </p>

                          <span
                            className={
                              item.status ===
                              "Completed"
                                ? "inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold"
                                : "inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold"
                            }
                          >
                            {item.status ===
                            "Completed"
                              ? `✅ ${t.completed}`
                              : `⏳ ${t.pending}`}
                          </span>

                        </div>

                        <div>

                          {item.status ===
                          "Completed" ? (

                            <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                              ✅{" "}
                              {t.completed}
                            </span>

                          ) : (

                            <button
                              type="button"
                              onClick={() =>
                                markCompleted(
                                  followUpId
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold"
                            >
                              {t.markCompleted}
                            </button>

                          )}

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MotherFollowUps;