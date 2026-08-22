import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function MotherFollowUps() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const today = new Date().toISOString().split("T")[0];

  const [searchParams] = useSearchParams();
  const motherIdFromUrl = searchParams.get("motherId");

  const [mothers, setMothers] = useState([]);
  const [followUps, setFollowUps] = useState([]);

  const [selectedMother, setSelectedMother] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const savedMothers =
      JSON.parse(localStorage.getItem("neurocare_mothers")) || [];

    const savedFollowUps =
      JSON.parse(
        localStorage.getItem("neurocare_mother_followups")
      ) || [];

    setMothers(savedMothers);
    setFollowUps(savedFollowUps);

    // Automatically select mother when opened from Mothers page
    if (motherIdFromUrl) {
      const motherExists = savedMothers.some(
        (mother) =>
          String(mother.id) === String(motherIdFromUrl)
      );

      if (motherExists) {
        setSelectedMother(motherIdFromUrl);
      }
    }
  }, [motherIdFromUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Empty field validation
    if (!selectedMother || !date) {
      alert(t.motherFollowUpRequired);
      return;
    }

    // Past date validation
    if (date < today) {
      alert(t.motherFollowUpDatePast);
      return;
    }

    const mother = mothers.find(
      (item) =>
        String(item.id) === String(selectedMother)
    );

    if (!mother) {
      alert(t.motherNotFound);
      return;
    }

    const newFollowUp = {
      id: Date.now(),
      motherId: mother.id,
      motherName: mother.name,
      date,
      note: note.trim() || t.routineMaternalFollowUp,
      status: "Pending",
    };

    const updatedFollowUps = [
      ...followUps,
      newFollowUp,
    ];

    localStorage.setItem(
      "neurocare_mother_followups",
      JSON.stringify(updatedFollowUps)
    );

    setFollowUps(updatedFollowUps);

    setSelectedMother("");
    setDate("");
    setNote("");

    alert(t.motherFollowUpScheduled);
  };

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
      "neurocare_mother_followups",
      JSON.stringify(updatedFollowUps)
    );

    setFollowUps(updatedFollowUps);

    alert(t.followUpMarkedCompleted);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-blue-700 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() => navigate("/mothers")}
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

            {/* Language Selector */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-blue-100 mb-2">
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
            {t.scheduleNewMotherFollowUp}
          </h2>

          {mothers.length === 0 ? (

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl p-5">

              <p className="text-blue-800 font-medium">
                {t.noMothersRegistered}
              </p>

              <button
                type="button"
                onClick={() => navigate("/add-mother")}
                className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
              >
                {t.registerMotherButton}
              </button>

            </div>

          ) : (

            <>

              {/* Mother */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.selectMother}
                </label>

                <select
                  value={selectedMother}
                  onChange={(e) =>
                    setSelectedMother(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    {t.selectRegisteredMother}
                  </option>

                  {mothers.map((mother) => (

                    <option
                      key={mother.id}
                      value={mother.id}
                    >
                      {mother.name} — {mother.village}
                    </option>

                  ))}

                </select>

                {motherIdFromUrl && selectedMother && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {t.motherSelectedFromMothersPage}
                  </p>
                )}

              </div>

              {/* Date */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.followUpDate}
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-sm text-gray-500 mt-2">
                  {t.followUpDateFuture}
                </p>

              </div>

              {/* Note */}

              <div className="mt-6">

                <label className="block font-bold text-gray-700 mb-2">
                  {t.followUpNote}
                </label>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder={t.motherFollowUpNotePlaceholder}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <button
                type="submit"
                className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold"
              >
                📅 {t.scheduleFollowUp}
              </button>

            </>

          )}

        </form>

        {/* Existing Follow-ups */}

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

              {followUps.map((item) => (

                <div
                  key={item.id}
                  className="bg-slate-50 rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold">
                        👩 {item.motherName}
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
                          onClick={() =>
                            markCompleted(item.id)
                          }
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

export default MotherFollowUps;