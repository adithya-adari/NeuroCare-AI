import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";

function FollowUps() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    language,
    changeLanguage,
    t,
  } = useLanguage();

  const childIdFromUrl =
    searchParams.get("childId");

  const [children, setChildren] =
    useState([]);

  const [followUps, setFollowUps] =
    useState([]);

  const [selectedChild, setSelectedChild] =
    useState("");

  const [date, setDate] =
    useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /* =====================================================
     LOAD CHILDREN + FOLLOW-UPS FROM MONGODB
  ===================================================== */

  useEffect(() => {
    loadData();
  }, [childIdFromUrl]);

  const loadData = async () => {
    try {
      setLoading(true);

      /* -----------------------------------------------
         GET CHILDREN
      ------------------------------------------------ */

      const childResponse =
        await API.get("/children");

      const savedChildren =
        childResponse.data?.success
          ? childResponse.data.children || []
          : [];

      setChildren(savedChildren);

      /* -----------------------------------------------
         GET CHILD FOLLOW-UPS
      ------------------------------------------------ */

      const followUpResponse =
        await API.get(
          "/child-followups"
        );

      const savedFollowUps =
        followUpResponse.data?.success
          ? followUpResponse.data.followUps || []
          : [];

      setFollowUps(savedFollowUps);

      /* -----------------------------------------------
         SELECT CHILD FROM URL
      ------------------------------------------------ */

      if (childIdFromUrl) {
        const childExists =
          savedChildren.some(
            (child) =>
              String(child._id) ===
              String(childIdFromUrl)
          );

        if (childExists) {
          setSelectedChild(
            childIdFromUrl
          );
        }
      }

    } catch (error) {
      console.error(
        "Unable to load follow-up data:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load follow-ups. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SCHEDULE FOLLOW-UP
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* -----------------------------------------------
       CHECK CHILD
    ------------------------------------------------ */

    if (!selectedChild) {
      alert(t.selectChildAndDate);
      return;
    }

    /* -----------------------------------------------
       CHECK DATE
    ------------------------------------------------ */

    if (!date) {
      alert(t.selectChildAndDate);
      return;
    }

    /* -----------------------------------------------
       PREVENT PAST DATE
    ------------------------------------------------ */

    if (date < today) {
      alert(t.followUpDatePast);
      return;
    }

    /* -----------------------------------------------
       FIND SELECTED CHILD
    ------------------------------------------------ */

    const child =
      children.find(
        (item) =>
          String(item._id) ===
          String(selectedChild)
      );

    if (!child) {
      alert(t.selectedChildNotFound);
      return;
    }

    try {
      setSaving(true);

      /* ---------------------------------------------
         SAVE TO MONGODB
      --------------------------------------------- */

      const response =
        await API.post(
          "/child-followups",
          {
            childId:
              child._id,
            date,
            note:
              note.trim() ||
              t.routineFollowUp,
          }
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to schedule follow-up."
        );
      }

      /* ---------------------------------------------
         ADD NEW FOLLOW-UP TO UI
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

      setSelectedChild("");
      setDate("");
      setNote("");

      alert(
        t.followUpScheduledSuccessfully
      );

    } catch (error) {
      console.error(
        "Schedule follow-up error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to schedule follow-up."
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
          `/child-followups/${id}/complete`
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

          <div className="text-5xl">
            📅
          </div>

          <h2 className="text-2xl font-bold mt-5">
            Loading follow-ups...
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
                📅 {t.followUps}
              </h1>

              <p className="mt-3 text-yellow-100">
                {t.scheduleAndTrackChildFollowUps}
              </p>

            </div>

            {/* Language Selector */}

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
            SCHEDULE FOLLOW-UP
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-xl p-8 mt-8"
        >

          <h2 className="text-2xl font-bold">
            {t.scheduleFollowUp}
          </h2>

          {children.length === 0 ? (

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-5">

              <p className="text-yellow-800 font-medium">
                {t.noChildren}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/add-child")
                }
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-bold"
              >
                + {t.registerChild}
              </button>

            </div>

          ) : (

            <>

              {/* Select Child */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.selectChild}
                </label>

                <select
                  value={selectedChild}
                  onChange={(e) =>
                    setSelectedChild(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >

                  <option value="">
                    {t.selectRegisteredChild}
                  </option>

                  {children.map(
                    (child) => (

                      <option
                        key={child._id}
                        value={child._id}
                      >
                        {child.name} —{" "}
                        {child.village}
                      </option>

                    )
                  )}

                </select>

                {childIdFromUrl &&
                  selectedChild && (

                    <p className="text-sm text-green-600 mt-2 font-medium">
                      ✓{" "}
                      {t.childSelectedFromChildren}
                    </p>

                  )}

              </div>

              {/* Follow-up Date */}

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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                <p className="text-sm text-gray-500 mt-2">
                  {t.followUpDateFuture}
                </p>

              </div>

              {/* Follow-up Note */}

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
                    t.followUpNotePlaceholder
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

              </div>

              {/* Schedule Button */}

              <button
                type="submit"
                disabled={saving}
                className={`mt-6 text-white px-8 py-4 rounded-xl font-bold ${
                  saving
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700"
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
            {t.scheduledFollowUps}
          </h2>

          {followUps.length === 0 ? (

            <div className="mt-6 bg-slate-50 rounded-2xl p-6 text-center">

              <p className="text-gray-500">
                {t.noFollowUpsScheduled}
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
                          👶{" "}
                          {item.childName}
                        </h3>

                        <p className="text-gray-600 mt-1">
                          📅{" "}
                          {item.date}
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
                            ✅{" "}
                            {t.completed}
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

export default FollowUps;