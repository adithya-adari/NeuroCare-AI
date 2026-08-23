import { Link } from "react-router-dom";
import hero from "../assets/hero.png";
import { useLanguage } from "../context/LanguageContext";

function Hero() {
  const { language, changeLanguage } = useLanguage();

  const text = {
    en: {
      language: "Language",
      english: "English",
      telugu: "Telugu",
      hindi: "Hindi",

      badge: "ASHA Worker Health Support",

      title1: "Empowering ASHA",
      title2: "Workers for Better",
      title3: "Maternal & Child Health",

      description:
        "NeuroCare AI is a digital health support platform designed to help ASHA workers register mothers and children, conduct AI-assisted child assessments, manage follow-ups, and identify cases that require further medical attention.",

      maternal: "Maternal Health",
      child: "Child Health",
      ai: "AI-Assisted Screening",
      followUp: "Follow-up Tracking",

      login: "ASHA Worker Login",
      resources: "Health Resources",
    },

    te: {
      language: "భాష",
      english: "ఇంగ్లీష్",
      telugu: "తెలుగు",
      hindi: "హిందీ",

      badge: "ఆశా కార్యకర్త ఆరోగ్య సహాయం",

      title1: "ఆశా కార్యకర్తలకు",
      title2: "మెరుగైన తల్లి మరియు",
      title3: "శిశు ఆరోగ్యానికి సహాయం",

      description:
        "న్యూరోకేర్ AI అనేది తల్లులు మరియు పిల్లలను నమోదు చేయడం, AI సహాయంతో పిల్లల అసెస్‌మెంట్‌లు నిర్వహించడం, ఫాలో-అప్‌లను నిర్వహించడం మరియు మరింత వైద్య శ్రద్ధ అవసరమైన కేసులను గుర్తించడంలో ఆశా కార్యకర్తలకు సహాయపడే డిజిటల్ ఆరోగ్య వేదిక.",

      maternal: "తల్లి ఆరోగ్యం",
      child: "శిశు ఆరోగ్యం",
      ai: "AI సహాయంతో స్క్రీనింగ్",
      followUp: "ఫాలో-అప్ పర్యవేక్షణ",

      login: "ఆశా కార్యకర్త లాగిన్",
      resources: "ఆరోగ్య వనరులు",
    },

    hi: {
      language: "भाषा",
      english: "अंग्रेज़ी",
      telugu: "तेलुगु",
      hindi: "हिंदी",

      badge: "आशा कार्यकर्ता स्वास्थ्य सहायता",

      title1: "आशा कार्यकर्ताओं को",
      title2: "बेहतर मातृ एवं",
      title3: "शिशु स्वास्थ्य के लिए सशक्त बनाना",

      description:
        "न्यूरोकेयर AI एक डिजिटल स्वास्थ्य मंच है जो आशा कार्यकर्ताओं को माताओं और बच्चों का पंजीकरण करने, AI-सहायता प्राप्त बाल आकलन करने, फॉलो-अप प्रबंधित करने और आगे चिकित्सा ध्यान की आवश्यकता वाले मामलों की पहचान करने में मदद करता है।",

      maternal: "मातृ स्वास्थ्य",
      child: "शिशु स्वास्थ्य",
      ai: "AI-सहायता प्राप्त स्क्रीनिंग",
      followUp: "फॉलो-अप निगरानी",

      login: "आशा कार्यकर्ता लॉगिन",
      resources: "स्वास्थ्य संसाधन",
    },
  };

  const t = text[language] || text.en;

  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center pt-24 pb-20"
      style={{
        backgroundImage: `url(${hero})`,
      }}
    >

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-cyan-600/35"></div>

      {/* Content */}

      <div className="relative z-10 w-full px-8 md:px-20">

        <div className="max-w-3xl">

          {/* Language Selector */}

          <div className="mb-8">

            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-lg rounded-2xl p-3">

              <span className="text-white font-semibold">
                🌐 {t.language}
              </span>

              <select
                value={language}
                onChange={(e) =>
                  changeLanguage(e.target.value)
                }
                className="bg-white text-gray-800 rounded-xl px-4 py-2 font-semibold outline-none cursor-pointer"
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

          {/* Badge */}

          <span className="inline-block bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-lg">
            👩‍⚕️ {t.badge}
          </span>

          {/* Heading */}

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mt-8">

            {t.title1}

            <br />

            {t.title2}

            <br />

            {t.title3}

          </h1>

          {/* Description */}

          <p className="text-blue-100 text-xl leading-10 mt-8">
            {t.description}
          </p>

          {/* Feature Tags */}

          <div className="flex flex-wrap gap-4 mt-8">

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              👩‍🍼 {t.maternal}
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              👶 {t.child}
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              🧠 {t.ai}
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-5 py-3 rounded-xl text-white font-semibold">
              📅 {t.followUp}
            </div>

          </div>

          {/* Buttons */}

          <div className="flex flex-wrap gap-6 mt-10">

            <Link
              to="/login"
              className="bg-white text-blue-700 px-8 py-5 rounded-xl text-lg font-bold hover:scale-105 duration-300 shadow-xl"
            >
              👩‍⚕️ {t.login}
            </Link>

            <Link
              to="/learn"
              className="border-2 border-white text-white px-8 py-5 rounded-xl text-lg font-bold hover:bg-white hover:text-blue-700 duration-300"
            >
              📚 {t.resources}
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;