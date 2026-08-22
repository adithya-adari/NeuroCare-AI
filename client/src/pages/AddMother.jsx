import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddMother() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobile: "",
    village: "",
    pregnancyStatus: "Pregnant",
    expectedDeliveryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mother name validation
    if (!formData.name.trim()) {
      alert(t.enterMotherName);
      return;
    }

    // Age validation
    if (!formData.age) {
      alert(t.enterMotherAge);
      return;
    }

    if (Number(formData.age) < 18 || Number(formData.age) > 60) {
      alert(t.motherAgeRange);
      return;
    }

    // Mobile validation
    if (!formData.mobile) {
      alert(t.enterMobileNumber);
      return;
    }

    if (formData.mobile.length !== 10) {
      alert(t.mobileMustBe10Digits);
      return;
    }

    // Village validation
    if (!formData.village.trim()) {
      alert(t.enterVillage);
      return;
    }

    // Expected delivery date validation
    if (
      formData.pregnancyStatus === "Pregnant" &&
      !formData.expectedDeliveryDate
    ) {
      alert(t.enterExpectedDeliveryDate);
      return;
    }

    if (
      formData.pregnancyStatus === "Pregnant" &&
      formData.expectedDeliveryDate < today
    ) {
      alert(t.expectedDeliveryDatePast);
      return;
    }

    // Temporary demo storage.
    // We will connect this to MongoDB later.
    const existingMothers =
      JSON.parse(localStorage.getItem("neurocare_mothers")) || [];

    const newMother = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "neurocare_mothers",
      JSON.stringify([...existingMothers, newMother])
    );

    alert(t.motherRegisteredSuccessfully);

    navigate("/asha");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <div className="bg-blue-700 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                type="button"
                onClick={() => navigate("/asha")}
                className="text-blue-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                👩‍🍼 {t.registerMother}
              </h1>

              <p className="mt-3 text-blue-100">
                {t.maternalHealthInformation}
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

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl shadow-xl p-8 mt-8"
        >

          {/* Mother Name */}

          <div>

            <label className="block font-bold text-gray-700 mb-2">
              {t.motherName}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.motherName}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Age */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.age}
            </label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder={t.age}
              min="18"
              max="60"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Mobile */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.mobileNumber}
            </label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                if (value.length <= 10) {
                  setFormData((prev) => ({
                    ...prev,
                    mobile: value,
                  }));
                }
              }}
              placeholder={t.mobilePlaceholder}
              maxLength="10"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Village */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.village}
            </label>

            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder={t.village}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Pregnancy Status */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.pregnancyStatus}
            </label>

            <select
              name="pregnancyStatus"
              value={formData.pregnancyStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="Pregnant">
                {t.pregnant}
              </option>

              <option value="Postpartum">
                {t.postpartum}
              </option>

              <option value="Not Pregnant">
                {t.notPregnant}
              </option>

            </select>

          </div>

          {/* Expected Delivery Date */}

          {formData.pregnancyStatus === "Pregnant" && (

            <div className="mt-6">

              <label className="block font-bold text-gray-700 mb-2">
                {t.expectedDeliveryDate}
              </label>

              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                min={today}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-sm text-gray-500 mt-2">
                {t.expectedDeliveryDateFuture}
              </p>

            </div>

          )}

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              type="submit"
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-bold text-lg"
            >
              {t.saveMother}
            </button>

            <button
              type="button"
              onClick={() => navigate("/asha")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-4 rounded-xl font-bold text-lg"
            >
              {t.cancel}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddMother;