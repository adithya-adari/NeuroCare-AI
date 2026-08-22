import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AddChild() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    motherName: "",
    village: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Child name validation
    if (!formData.name.trim()) {
      alert(t.enterChildName);
      return;
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      alert(t.enterDateOfBirth);
      return;
    }

    // Future date validation
    if (formData.dateOfBirth > today) {
      alert(t.dateOfBirthFuture);
      return;
    }

    // Gender validation
    if (!formData.gender) {
      alert(t.selectGender);
      return;
    }

    // Mother / Guardian validation
    if (!formData.motherName.trim()) {
      alert(t.enterMotherGuardianName);
      return;
    }

    // Village validation
    if (!formData.village.trim()) {
      alert(t.enterVillageName);
      return;
    }

    const existingChildren =
      JSON.parse(localStorage.getItem("neurocare_children")) || [];

    const newChild = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "neurocare_children",
      JSON.stringify([...existingChildren, newChild])
    );

    alert(t.childRegisteredSuccessfully);

    navigate("/asha");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Header */}

        <div className="bg-green-600 text-white rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            <div>

              <button
                type="button"
                onClick={() => navigate("/asha")}
                className="text-green-100 hover:text-white font-semibold"
              >
                ← {t.back}
              </button>

              <h1 className="text-4xl font-black mt-5">
                👶 {t.registerChild}
              </h1>

              <p className="mt-3 text-green-100">
                {t.childHealthInformation}
              </p>

            </div>

            {/* Language Selector */}

            <div className="bg-white/10 rounded-2xl p-4">

              <label className="block text-sm font-semibold text-green-100 mb-2">
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

          {/* Child Name */}

          <div>

            <label className="block font-bold text-gray-700 mb-2">
              {t.childName}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.enterChildName}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Date of Birth */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.dateOfBirth}
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={today}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <p className="text-sm text-gray-500 mt-2">
              {t.futureDatesCannotBeSelected}
            </p>

          </div>

          {/* Gender */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.gender}
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >

              <option value="">
                {t.selectGender}
              </option>

              <option value="Male">
                {t.male}
              </option>

              <option value="Female">
                {t.female}
              </option>

              <option value="Other">
                {t.other}
              </option>

            </select>

          </div>

          {/* Mother Name */}

          <div className="mt-6">

            <label className="block font-bold text-gray-700 mb-2">
              {t.motherGuardianName}
            </label>

            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              placeholder={t.enterMotherGuardianName}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              placeholder={t.enterVillageName}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">

            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg"
            >
              {t.saveChild}
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

export default AddChild;