import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function ASHADashboard() {
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();

  const [motherCount, setMotherCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [followUpTodayCount, setFollowUpTodayCount] = useState(0);
  const [needAttentionCount, setNeedAttentionCount] = useState(0);

  useEffect(() => {
    const mothers =
      JSON.parse(localStorage.getItem("neurocare_mothers")) || [];

    const children =
      JSON.parse(localStorage.getItem("neurocare_children")) || [];

    const childFollowUps =
      JSON.parse(localStorage.getItem("neurocare_followups")) || [];

    const motherFollowUps =
      JSON.parse(
        localStorage.getItem("neurocare_mother_followups")
      ) || [];

    const today = new Date().toISOString().split("T")[0];

    // Follow-ups scheduled for today
    const childToday = childFollowUps.filter(
      (item) =>
        item.date === today &&
        item.status === "Pending"
    );

    const motherToday = motherFollowUps.filter(
      (item) =>
        item.date === today &&
        item.status === "Pending"
    );

    // Overdue pending follow-ups
    const childOverdue = childFollowUps.filter(
      (item) =>
        item.date < today &&
        item.status === "Pending"
    );

    const motherOverdue = motherFollowUps.filter(
      (item) =>
        item.date < today &&
        item.status === "Pending"
    );

    setMotherCount(mothers.length);
    setChildCount(children.length);

    setFollowUpTodayCount(
      childToday.length + motherToday.length
    );

    setNeedAttentionCount(
      childOverdue.length + motherOverdue.length
    );
  }, []);

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-blue-700 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <p className="text-blue-200 text-sm font-semibold">
                {t.appName}
              </p>

              <h1 className="text-4xl font-black mt-2">
                {t.ashaDashboard}
              </h1>

              <p className="mt-3 text-blue-100">
                {t.welcomeAsha} 👩‍⚕️
              </p>

              <p className="mt-1 text-blue-100">
                {t.maternalChildTracking}
              </p>

            </div>

            {/* Language Selector */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-blue-100 mb-2">
                🌐 {t.language}
              </label>

              <select
                value={language}
                onChange={handleLanguageChange}
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

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          {/* Mothers */}

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <p className="text-gray-500 font-medium">
              👩 {t.mothers}
            </p>

            <h2 className="text-4xl font-black text-blue-700 mt-2">
              {motherCount}
            </h2>

          </div>

          {/* Children */}

          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <p className="text-gray-500 font-medium">
              👶 {t.children}
            </p>

            <h2 className="text-4xl font-black text-green-600 mt-2">
              {childCount}
            </h2>

          </div>

          {/* Need Attention */}

          <button
            onClick={() => navigate("/need-attention")}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition text-left w-full"
          >

            <p className="text-gray-500 font-medium">
              ⚠️ {t.needAttention}
            </p>

            <h2 className="text-4xl font-black text-red-600 mt-2">
              {needAttentionCount}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              {t.viewOverdueCases} →
            </p>

          </button>

          {/* Follow-ups Today */}

          <button
            onClick={() => navigate("/follow-ups-today")}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition text-left w-full"
          >

            <p className="text-gray-500 font-medium">
              📅 {t.followUpsToday}
            </p>

            <h2 className="text-4xl font-black text-yellow-600 mt-2">
              {followUpTodayCount}
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              {t.viewTodaysFollowUps} →
            </p>

          </button>

        </div>

        {/* Main Actions */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

          {/* Add Mother */}

          <button
            onClick={() => navigate("/add-mother")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition text-left"
          >

            <div className="text-4xl">
              👩‍🍼
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.registerMother}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.maternalHealthInformation}
            </p>

          </button>

          {/* Mothers */}

          <button
            onClick={() => navigate("/mothers")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition text-left"
          >

            <div className="text-4xl">
              👩
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.mothers}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.maternalHealthTracking}
            </p>

          </button>

          {/* Add Child */}

          <button
            onClick={() => navigate("/add-child")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition text-left"
          >

            <div className="text-4xl">
              👶
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.registerChild}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.childHealthInformation}
            </p>

          </button>

          {/* Children */}

          <button
            onClick={() => navigate("/children")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition text-left"
          >

            <div className="text-4xl">
              👶
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.children}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.childHealthInformation}
            </p>

          </button>

          {/* Follow-ups */}

          <button
            onClick={() => navigate("/follow-ups")}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition text-left"
          >

            <div className="text-4xl">
              📅
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.followUps}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.followUp}
            </p>

          </button>

        </div>

        {/* Recent Cases */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

          <h2 className="text-2xl font-bold">
            Recent Cases
          </h2>

          {childCount === 0 && motherCount === 0 ? (

            <div className="mt-6 bg-slate-50 rounded-2xl p-6 text-center">

              <p className="text-gray-500">
                No cases registered yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              <div className="bg-slate-50 rounded-2xl p-5">

                <h3 className="font-bold">
                  Registered Records
                </h3>

                <p className="text-gray-500 text-sm mt-1">

                  {motherCount} {t.mothers.toLowerCase()}{" "}
                  {motherCount !== 1 ? "" : ""}

                  {" and "}

                  {childCount} {t.children.toLowerCase()}

                  {" currently registered."}

                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default ASHADashboard;