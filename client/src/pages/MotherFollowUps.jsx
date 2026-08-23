import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function MotherFollowUps() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const today =
    new Date().toISOString().split("T")[0];

  const [searchParams] = useSearchParams();
  const motherIdFromUrl =
    searchParams.get("motherId");

  const [mothers, setMothers] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [selectedMother, setSelectedMother] =
    useState("");

  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /* =====================================================
     LOAD MOTHERS + FOLLOW-UPS FROM MONGODB
  ===================================================== */

  useEffect(() => {
    loadData();
  }, [motherIdFromUrl]);

  const loadData = async () => {
    try {
      setLoading(true);

      /* -----------------------------------------------
         GET MOTHERS
      ------------------------------------------------ */

      const motherResponse =
        await API.get("/mothers");

      const savedMothers =
        motherResponse.data?.success
          ? motherResponse.data.mothers || []
          : [];

      setMothers(savedMothers);

      /* -----------------------------------------------
         GET MOTHER FOLLOW-UPS
      ------------------------------------------------ */

      const followUpResponse =
        await API.get(
          "/mother-followups"
        );

      const savedFollowUps =
        followUpResponse.data?.success
          ? followUpResponse.data.followUps || []
          : [];

      setFollowUps(savedFollowUps);

      /* -----------------------------------------------
         AUTO SELECT MOTHER
      ------------------------------------------------ */

      if (motherIdFromUrl) {
        const motherExists =
          savedMothers.some(
            (mother) =>
              String(mother._id) ===
              String(motherIdFromUrl)
          );

        if (motherExists) {
          setSelectedMother(
            motherIdFromUrl
          );
        }
      }

    } catch (error) {
      console.error(
        "Unable to load mother follow-up data:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load mother follow-ups. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SCHEDULE MOTHER FOLLOW-UP
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* -----------------------------------------------
       VALIDATION
    ------------------------------------------------ */

    if (!selectedMother || !date) {
      alert(t.motherFollowUpRequired);
      return;
    }

    if (date < today) {
      alert(t.motherFollowUpDatePast);
      return;
    }

    /* -----------------------------------------------
       FIND SELECTED MOTHER
    ------------------------------------------------ */

    const mother =
      mothers.find(
        (item) =>
          String(item._id) ===
          String(selectedMother)
      );

    if (!mother) {
      alert(t.motherNotFound);
      return;
    }

    try {
      setSaving(true);

      /* ---------------------------------------------
         SAVE TO MONGODB
      --------------------------------------------- */

      const response =
        await API.post(
          "/mother-followups",
          {
            motherId:
              mother._id,

            date,

            note:
              note.trim() ||
              t.routineMaternalFollowUp,
          }
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to schedule mother follow-up."
        );
      }

      /* ---------------------------------------------
         ADD TO UI
      --------------------------------------------- */

      const newFollowUp =
        response.data.followUp;

      setFollowUps(
        (current) => [
          ...current,
          newFollowUp,
        ]
      );

      /* ---------------------------------------------
         CLEAR FORM
      --------------------------------------------- */

      setSelectedMother("");
      setDate("");
      setNote("");

      alert(
        t.motherFollowUpScheduled
      );

    } catch (error) {
      console.error(
        "Schedule mother follow-up error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to schedule mother follow-up."
      );

    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     MARK COMPLETED
  ===================================================== */

  const markCompleted = async (
    id
  ) => {
    try {
      const response =
        await API.put(
          `/mother-followups/${id}/complete`
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to complete follow-up."
        );
      }

      const updatedFollowUp =
        response.data.followUp;

      setFollowUps(
        (current) =>
          current.map((item) =>
            item._id ===
            updatedFollowUp._id
              ? updatedFollowUp
              : item
          )
      );

      alert(
        t.followUpMarkedCompleted
      );

    } catch (error) {
      console.error(
        "Complete mother follow-up error:",
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

          <div className="text-5xl">
            👩📅
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Loading mother follow-ups...
          </h2>

          <p className="text-gray-500 mt-2">
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

        {/* =================================================
            SCHEDULE FOLLOW-UP
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-xl p-8 mt-8"
        >

          <h2 className="text-2xl font-bold">
            {t.scheduleNewMotherFollowUp}
          </h2>

          {mothers.length === 0 ? (

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl p-5">

              <p className="text-blue-800 font-medium">
                {t.noMothersRegistered}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/add-mother")
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
                    (mother) => (

                      <option
                        key={mother._id}
                        value={mother._id}
                      >
                        {mother.name} —{" "}
                        {mother.village}
                      </option>

                    )
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
                disabled={saving}
                className={`mt-6 text-white px-8 py-4 rounded-xl font-bold ${
                  saving
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {saving
                  ? "Saving..."
                  : `📅 ${t.scheduleFollowUp}`}
              </button>

            </>

          )}

        </form>

        {/* =================================================
            EXISTING FOLLOW-UPS
        ================================================= */}

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
                (item) => (

                  <div
                    key={item._id}
                    className="bg-slate-50 rounded-2xl p-6"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-bold">
                          👩{" "}
                          {item.motherName}
                        </h3>

                        <p className="text-gray-600 mt-1">
                          📅 {item.date}
                        </p>

                        <p className="text-gray-600 mt-1">
                          📝{" "}
                          {item.note}
                        </p>

                      </div>

                      <div>

                        {item.status ===
                        "Completed" ? (

                          <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                            ✅ {t.completed}
                          </span>

                        ) : (

                          <button
                            type="button"
                            onClick={() =>
                              markCompleted(
                                item._id
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

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MotherFollowUps;