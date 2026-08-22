import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function FollowUpsToday() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [followUps, setFollowUps] = useState([]);

  const loadTodayFollowUps = () => {
    const childFollowUps =
      JSON.parse(localStorage.getItem("neurocare_followups")) || [];

    const motherFollowUps =
      JSON.parse(
        localStorage.getItem("neurocare_mother_followups")
      ) || [];

    const today = new Date().toISOString().split("T")[0];

    const childToday = childFollowUps
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

    const motherToday = motherFollowUps
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

    setFollowUps([
      ...childToday,
      ...motherToday,
    ]);
  };

  useEffect(() => {
    loadTodayFollowUps();
  }, []);

  const markCompleted = (item) => {
    if (item.type === "Child") {
      const childFollowUps =
        JSON.parse(
          localStorage.getItem("neurocare_followups")
        ) || [];

      const updatedFollowUps = childFollowUps.map((followUp) =>
        followUp.id === item.id
          ? {
              ...followUp,
              status: "Completed",
            }
          : followUp
      );

      localStorage.setItem(
        "neurocare_followups",
        JSON.stringify(updatedFollowUps)
      );
    } else {
      const motherFollowUps =
        JSON.parse(
          localStorage.getItem("neurocare_mother_followups")
        ) || [];

      const updatedFollowUps = motherFollowUps.map((followUp) =>
        followUp.id === item.id
          ? {
              ...followUp,
              status: "Completed",
            }
          : followUp
      );

      localStorage.setItem(
        "neurocare_mother_followups",
        JSON.stringify(updatedFollowUps)
      );
    }

    // Remove completed follow-up from today's list
    setFollowUps((prev) =>
      prev.filter(
        (followUp) =>
          !(
            followUp.id === item.id &&
            followUp.type === item.type
          )
      )
    );

    alert(t.followUpCompletedSuccessfully);
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
                📅 {t.todaysFollowUps}
              </h1>

              <p className="mt-3 text-yellow-100">
                {t.todaysFollowUpsDescription}
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
                  changeLanguage(e.target.value)
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

        {/* Summary */}

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

        {/* Follow-up Cards */}

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

            {followUps.map((item) => (

              <div
                key={`${item.type}-${item.id}`}
                className="bg-white rounded-3xl shadow-xl p-8"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="text-5xl">
                      {item.type === "Child"
                        ? "👶"
                        : "👩"}
                    </div>

                    <h2 className="text-2xl font-bold mt-4">
                      {item.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {item.type === "Child"
                        ? t.childFollowUp
                        : t.motherFollowUp}
                    </p>

                  </div>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full font-semibold">
                    {t.pending}
                  </span>

                </div>

                {/* Date */}

                <div className="bg-yellow-50 rounded-2xl p-5 mt-6">

                  <p className="text-yellow-700 font-bold">
                    📅 {t.scheduledToday}
                  </p>

                </div>

                {/* Note */}

                <div className="bg-slate-50 rounded-2xl p-5 mt-4">

                  <p className="font-semibold text-gray-700">
                    📝 {t.followUpNote}
                  </p>

                  <p className="text-gray-600 mt-2">
                    {item.note}
                  </p>

                </div>

                {/* Complete Button */}

                <button
                  onClick={() => markCompleted(item)}
                  className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                >
                  ✅ {t.markCompleted}
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default FollowUpsToday;