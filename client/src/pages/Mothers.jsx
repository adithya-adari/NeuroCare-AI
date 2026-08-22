import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Mothers() {
  const navigate = useNavigate();

  const { language, changeLanguage, t } = useLanguage();

  const [mothers, setMothers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [followUps, setFollowUps] = useState([]);

  useEffect(() => {
    const savedMothers =
      JSON.parse(localStorage.getItem("neurocare_mothers")) || [];

    const savedFollowUps =
      JSON.parse(localStorage.getItem("neurocare_mother_followups")) || [];

    setMothers(savedMothers);
    setFollowUps(savedFollowUps);
  }, []);

  const getStatusStyle = (status) => {
    if (status === "Pregnant") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Postpartum") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const getMotherFollowUp = (motherId) => {
    return followUps.find(
      (item) =>
        String(item.motherId) === String(motherId) &&
        item.status !== "Completed"
    );
  };

  const filteredMothers = mothers.filter((mother) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      mother.name?.toLowerCase().includes(search) ||
      mother.village?.toLowerCase().includes(search) ||
      mother.mobile?.includes(search)
    );
  });

  const getPregnancyStatusText = (status) => {
    if (status === "Pregnant") {
      return t.pregnant;
    }

    if (status === "Postpartum") {
      return t.postpartum;
    }

    if (status === "Not Pregnant") {
      return t.notPregnant;
    }

    return status;
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-blue-700 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                onClick={() => navigate("/asha")}
                className="text-blue-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                👩 {t.mothers}
              </h1>

              <p className="mt-3 text-blue-100">
                {t.mothersPageDescription}
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

        {/* Register Mother Button */}
        <div className="flex justify-end mt-8">

          <button
            onClick={() => navigate("/add-mother")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
          >
            {t.registerMotherButton}
          </button>

        </div>

        {/* Search */}
        {mothers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              🔍 {t.searchMothers}
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchMothersPlaceholder}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>
        )}

        {/* Main Content */}
        {mothers.length === 0 ? (

          /* No Mothers */
          <div className="bg-white rounded-3xl shadow-xl p-10 mt-6 text-center">

            <div className="text-6xl">
              👩‍🍼
            </div>

            <h2 className="text-2xl font-bold mt-5">
              {t.noMothers}
            </h2>

            <p className="text-gray-500 mt-3">
              {t.noMothersDescription}
            </p>

            <button
              onClick={() => navigate("/add-mother")}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold"
            >
              {t.registerMotherButton}
            </button>

          </div>

        ) : filteredMothers.length === 0 ? (

          /* No Search Results */
          <div className="bg-white rounded-3xl shadow-xl p-10 mt-6 text-center">

            <div className="text-5xl">
              🔍
            </div>

            <h2 className="text-2xl font-bold mt-4">
              {t.noMothersFound}
            </h2>

            <p className="text-gray-500 mt-2">
              {t.noMothersFoundDescription}
            </p>

          </div>

        ) : (

          /* Mother Cards */
          <div className="grid md:grid-cols-2 gap-6 mt-6">

            {filteredMothers.map((mother) => {

              const followUp = getMotherFollowUp(mother.id);

              return (
                <div
                  key={mother.id}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >

                  {/* Mother Information */}
                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="text-5xl">
                        👩‍🍼
                      </div>

                      <h2 className="text-2xl font-bold mt-4">
                        {mother.name}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        {t.age}: {mother.age}
                      </p>

                      <p className="text-gray-500">
                        📱 {mother.mobile || t.mobileNotProvided}
                      </p>

                      <p className="text-gray-500">
                        📍 {mother.village}
                      </p>

                    </div>

                    <span
                      className={`px-3 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                        mother.pregnancyStatus
                      )}`}
                    >
                      {getPregnancyStatusText(
                        mother.pregnancyStatus
                      )}
                    </span>

                  </div>

                  {/* Pregnancy Information */}
                  <div className="mt-6 bg-blue-50 rounded-2xl p-5">

                    <h3 className="font-bold text-blue-700">
                      🤰 {t.pregnancyInformation}
                    </h3>

                    {mother.pregnancyStatus === "Pregnant" ? (

                      <div className="mt-3">

                        <p className="text-gray-700">
                          <strong>
                            {t.expectedDeliveryDate}:
                          </strong>{" "}
                          {mother.expectedDeliveryDate ||
                            t.notProvided}
                        </p>

                      </div>

                    ) : (

                      <p className="text-gray-600 mt-3">
                        {t.pregnancyStatusText}:{" "}
                        {getPregnancyStatusText(
                          mother.pregnancyStatus
                        )}
                      </p>

                    )}

                  </div>

                  {/* Follow-up */}
                  <div className="mt-4 bg-yellow-50 rounded-2xl p-5">

                    <h3 className="font-bold text-yellow-700">
                      📅 {t.followUp}
                    </h3>

                    {followUp ? (

                      <div className="mt-3">

                        <p className="text-gray-700">
                          <strong>
                            {t.followUpDate}:
                          </strong>{" "}
                          {followUp.date}
                        </p>

                        <p className="text-gray-600 mt-1">
                          {followUp.note}
                        </p>

                        <span className="inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {followUp.status === "Pending"
                            ? t.pending
                            : followUp.status}
                        </span>

                      </div>

                    ) : (

                      <p className="text-gray-500 mt-3">
                        {t.noPendingFollowUp}
                      </p>

                    )}

                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    <button
                      onClick={() =>
                        navigate(
                          `/mother-follow-ups?motherId=${mother.id}`
                        )
                      }
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-bold"
                    >
                      📅 {t.followUp}
                    </button>

                    <button
                      onClick={() => navigate("/add-mother")}
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-bold"
                    >
                      {t.registerMotherButton}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}

export default Mothers;