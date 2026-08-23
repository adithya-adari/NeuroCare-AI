import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const { language, changeLanguage } =
    useLanguage();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOGIN TRANSLATIONS
  ===================================================== */

  const text = {
    en: {
      language: "Language",
      english: "English",
      telugu: "Telugu",
      hindi: "Hindi",

      workerLogin: "ASHA Worker Login",

      welcome: "Welcome Back 👋",

      description:
        "Sign in to continue to the ASHA dashboard.",

      email: "Email",
      emailPlaceholder:
        "Enter your email",

      password: "Password",
      passwordPlaceholder:
        "Enter your password",

      signIn: "🔐 Sign In",
      signingIn: "Signing in...",

      enterEmail:
        "Please enter your email.",

      enterPassword:
        "Please enter your password.",

      loginFailed:
        "Login failed.",

      loginError:
        "Unable to login. Please check your email and password.",

      authorized:
        "🔒 Authorized ASHA workers only",

      security:
        "NeuroCare AI provides AI-assisted screening support and does not replace professional medical diagnosis.",
    },

    te: {
      language: "భాష",
      english: "ఇంగ్లీష్",
      telugu: "తెలుగు",
      hindi: "హిందీ",

      workerLogin:
        "ఆశా కార్యకర్త లాగిన్",

      welcome:
        "తిరిగి స్వాగతం 👋",

      description:
        "ఆశా డాష్‌బోర్డ్‌ను కొనసాగించడానికి లాగిన్ చేయండి.",

      email:
        "ఇమెయిల్",

      emailPlaceholder:
        "మీ ఇమెయిల్ నమోదు చేయండి",

      password:
        "పాస్‌వర్డ్",

      passwordPlaceholder:
        "మీ పాస్‌వర్డ్ నమోదు చేయండి",

      signIn:
        "🔐 లాగిన్ చేయండి",

      signingIn:
        "లాగిన్ అవుతోంది...",

      enterEmail:
        "దయచేసి మీ ఇమెయిల్ నమోదు చేయండి.",

      enterPassword:
        "దయచేసి మీ పాస్‌వర్డ్ నమోదు చేయండి.",

      loginFailed:
        "లాగిన్ విఫలమైంది.",

      loginError:
        "లాగిన్ చేయడం సాధ్యపడలేదు. మీ ఇమెయిల్ మరియు పాస్‌వర్డ్‌ను తనిఖీ చేయండి.",

      authorized:
        "🔒 అధీకృత ఆశా కార్యకర్తలకు మాత్రమే",

      security:
        "న్యూరోకేర్ AI AI సహాయంతో స్క్రీనింగ్‌కు మద్దతు ఇస్తుంది మరియు వృత్తిపరమైన వైద్య నిర్ధారణకు ప్రత్యామ్నాయం కాదు.",
    },

    hi: {
      language: "भाषा",
      english: "अंग्रेज़ी",
      telugu: "तेलुगु",
      hindi: "हिंदी",

      workerLogin:
        "आशा कार्यकर्ता लॉगिन",

      welcome:
        "वापसी पर स्वागत है 👋",

      description:
        "आशा डैशबोर्ड पर जारी रखने के लिए साइन इन करें।",

      email:
        "ईमेल",

      emailPlaceholder:
        "अपना ईमेल दर्ज करें",

      password:
        "पासवर्ड",

      passwordPlaceholder:
        "अपना पासवर्ड दर्ज करें",

      signIn:
        "🔐 साइन इन करें",

      signingIn:
        "साइन इन हो रहा है...",

      enterEmail:
        "कृपया अपना ईमेल दर्ज करें।",

      enterPassword:
        "कृपया अपना पासवर्ड दर्ज करें।",

      loginFailed:
        "लॉगिन विफल हुआ।",

      loginError:
        "लॉगिन नहीं हो सका। कृपया अपना ईमेल और पासवर्ड जांचें।",

      authorized:
        "🔒 केवल अधिकृत आशा कार्यकर्ताओं के लिए",

      security:
        "न्यूरोकेयर AI AI-सहायता प्राप्त स्क्रीनिंग सहायता प्रदान करता है और पेशेवर चिकित्सा निदान का विकल्प नहीं है।",
    },
  };

  const t = text[language] || text.en;

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError(t.enterEmail);
      return;
    }

    if (!formData.password) {
      setError(t.enterPassword);
      return;
    }

    try {
      setLoading(true);

      const response =
        await API.post(
          "/auth/login",
          {
            email:
              formData.email.trim(),

            password:
              formData.password,
          }
        );

      if (
        !response.data?.success
      ) {
        setError(
          response.data?.message ||
            t.loginFailed
        );

        return;
      }

      /* -----------------------------------------------
         Save authentication
      ------------------------------------------------ */

      login({
        token:
          response.data.token,

        worker:
          response.data.worker,
      });

      /* -----------------------------------------------
         Go to ASHA Dashboard
      ------------------------------------------------ */

      navigate("/asha");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          t.loginError
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        {/* HEADER */}

        <div className="text-center mb-8">

          <div className="text-7xl">
            🧠
          </div>

          <h1 className="text-4xl font-black text-blue-700 mt-4">
            NeuroCare AI
          </h1>

          <p className="text-gray-500 mt-2">
            {t.workerLogin}
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          {/* LANGUAGE */}

          <div className="flex justify-end mb-6">

            <div>

              <label className="block text-sm font-semibold text-gray-500 mb-2">
                🌐 {t.language}
              </label>

              <select
                value={language}
                onChange={(e) =>
                  changeLanguage(
                    e.target.value
                  )
                }
                className="border border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-2 font-semibold outline-none"
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

          {/* TITLE */}

          <h2 className="text-2xl font-bold text-gray-800">
            {t.welcome}
          </h2>

          <p className="text-gray-500 mt-2">
            {t.description}
          </p>

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mt-6">
              ⚠️ {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6"
          >

            {/* EMAIL */}

            <div>

              <label className="block font-bold text-gray-700 mb-2">
                {t.email}
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
                placeholder={
                  t.emailPlaceholder
                }
                autoComplete="email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PASSWORD */}

            <div className="mt-5">

              <label className="block font-bold text-gray-700 mb-2">
                {t.password}
              </label>

              <input
                type="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder={
                  t.passwordPlaceholder
                }
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-7 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white py-4 rounded-xl font-bold text-lg transition"
            >
              {loading
                ? t.signingIn
                : t.signIn}
            </button>

          </form>

        </div>

        {/* SECURITY MESSAGE */}

        <div className="bg-white/70 rounded-2xl p-5 mt-6 text-center">

          <p className="text-sm text-gray-600">
            {t.authorized}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            {t.security}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;