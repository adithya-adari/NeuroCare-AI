import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function NeedAttention() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [overdueCases, setOverdueCases] = useState([]);

  useEffect(() => {
    const childFollowUps =
      JSON.parse(localStorage.getItem("neurocare_followups")) || [];

    const motherFollowUps =
      JSON.parse(
        localStorage.getItem("neurocare_mother_followups")
      ) || [];

    const today = new Date().toISOString().split("T")[0];

    const childOverdue = childFollowUps
      .filter(
        (item) =>
          item.date < today &&
          item.status === "Pending"
      )
      .map((item) => ({
        ...item,
        type: "Child",
      }));

    const motherOverdue = motherFollowUps
      .filter(
        (item) =>
          item.date < today &&
          item.status === "Pending"
      )
      .map((item) => ({
        ...item,
        type: "Mother",
      }));

    setOverdueCases([
      ...childOverdue,
      ...motherOverdue,
    ]);
  }, []);

  const getDaysOverdue = (date) => {
    const today = new Date();
    const followUpDate = new Date(date);

    const difference =
      today.getTime() - followUpDate.getTime();

    return Math.max(
      1,
      Math.floor(
        difference / (1000 * 60 * 60 * 24)
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-red-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() => navigate("/asha")}
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

            {/* Language Selector */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-red-100 mb-2">
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
                {overdueCases.length}
              </p>

            </div>

          </div>

        </div>

        {/* Cases */}

        {overdueCases.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-10 mt-8 text-center">

            <div className="text-6xl">
              ✅
            </div>

            <h2 className="text-2xl font-bold mt-5">
              {t.noOverdueCases}
            </h2>

            <p className="text-gray-500 mt-3">
              {t.allFollowUpsUpToDate}
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            {overdueCases.map((item) => (

              <div
                key={`${item.type}-${item.id}`}
                className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-red-500"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <div className="text-5xl">
                      {item.type === "Child"
                        ? "👶"
                        : "👩"}
                    </div>

                    <h2 className="text-2xl font-bold mt-4">
                      {item.type === "Child"
                        ? item.childName
                        : item.motherName}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {item.type === "Child"
                        ? t.childFollowUp
                        : t.motherFollowUp}
                    </p>

                  </div>

                  <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full font-semibold">
                    {t.pending}
                  </span>

                </div>

                <div className="bg-red-50 rounded-2xl p-5 mt-6">

                  <p className="text-red-700 font-bold">
                    📅 {t.scheduled}: {item.date}
                  </p>

                  <p className="text-red-600 mt-2">
                    ⏰ {getDaysOverdue(item.date)}{" "}
                    {getDaysOverdue(item.date) !== 1
                      ? t.daysOverdue
                      : t.dayOverdue}
                  </p>

                </div>

                <div className="bg-slate-50 rounded-2xl p-5 mt-4">

                  <p className="font-semibold text-gray-700">
                    📝 {t.followUpNote}
                  </p>

                  <p className="text-gray-600 mt-2">
                    {item.note}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default NeedAttention;