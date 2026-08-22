import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function FollowUps() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, changeLanguage, t } = useLanguage();

  const childIdFromUrl = searchParams.get("childId");

  const [children, setChildren] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [selectedChild, setSelectedChild] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedChildren =
      JSON.parse(localStorage.getItem("neurocare_children")) || [];

    const savedFollowUps =
      JSON.parse(localStorage.getItem("neurocare_followups")) || [];

    setChildren(savedChildren);
    setFollowUps(savedFollowUps);

    // Automatically select child when opened from Children page
    if (childIdFromUrl) {
      const childExists = savedChildren.some(
        (child) => String(child.id) === String(childIdFromUrl)
      );

      if (childExists) {
        setSelectedChild(childIdFromUrl);
      }
    }
  }, [childIdFromUrl]);

  // Schedule Follow-up
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check child
    if (!selectedChild) {
      alert(t.selectChildAndDate);
      return;
    }

    // Check date
    if (!date) {
      alert(t.selectChildAndDate);
      return;
    }

    // Prevent past date
    if (date < today) {
      alert(t.followUpDatePast);
      return;
    }

    // Find selected child
    const child = children.find(
      (item) => String(item.id) === String(selectedChild)
    );

    if (!child) {
      alert(t.selectedChildNotFound);
      return;
    }

    // Create new follow-up
    const newFollowUp = {
      id: Date.now(),
      childId: child.id,
      childName: child.name,
      date,
      note: note.trim() || t.routineFollowUp,
      status: "Pending",
    };

    const updatedFollowUps = [
      ...followUps,
      newFollowUp,
    ];

    // Save
    localStorage.setItem(
      "neurocare_followups",
      JSON.stringify(updatedFollowUps)
    );

    setFollowUps(updatedFollowUps);

    // Clear form
    setSelectedChild("");
    setDate("");
    setNote("");

    // Multilingual success alert
    alert(t.followUpScheduledSuccessfully);
  };

  // Mark completed
  const markCompleted = (id) => {
    const updatedFollowUps = followUps.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "Completed",
          }
        : item
    );

    localStorage.setItem(
      "neurocare_followups",
      JSON.stringify(updatedFollowUps)
    );

    setFollowUps(updatedFollowUps);

    alert(t.followUpMarkedCompleted);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-yellow-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() => navigate("/asha")}
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

        {/* Schedule Follow-up */}

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
                onClick={() => navigate("/add-child")}
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
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >

                  <option value="">
                    {t.selectRegisteredChild}
                  </option>

                  {children.map((child) => (

                    <option
                      key={child.id}
                      value={child.id}
                    >
                      {child.name} — {child.village}
                    </option>

                  ))}

                </select>

                {childIdFromUrl && selectedChild && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {t.childSelectedFromChildren}
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
                  onChange={(e) => setDate(e.target.value)}
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
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder={t.followUpNotePlaceholder}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

              </div>

              {/* Schedule Button */}

              <button
                type="submit"
                className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-xl font-bold"
              >
                📅 {t.scheduleFollowUp}
              </button>

            </>

          )}

        </form>

        {/* Existing Follow-ups */}

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

              {followUps.map((item) => (

                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold">
                        👶 {item.childName}
                      </h3>

                      <p className="text-gray-600 mt-1">
                        📅 {item.date}
                      </p>

                      <p className="text-gray-600 mt-1">
                        📝 {item.note}
                      </p>

                    </div>

                    <div>

                      {item.status === "Completed" ? (

                        <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                          ✅ {t.completed}
                        </span>

                      ) : (

                        <button
                          type="button"
                          onClick={() => markCompleted(item.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold"
                        >
                          {t.markCompleted}
                        </button>

                      )}

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default FollowUps;