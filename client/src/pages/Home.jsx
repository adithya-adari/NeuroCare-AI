import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Home() {
  const { language, changeLanguage } = useLanguage();

  const text = {
    en: {
      language: "Language",
      english: "English",
      telugu: "Telugu",
      hindi: "Hindi",

      maternalHealth: "Maternal Health",
      maternalDesc: "Register and monitor mothers",

      childHealth: "Child Health",
      childDesc: "Track registered children",

      followUp: "Follow-up Tracking",
      followUpDesc: "Manage scheduled follow-ups",

      attention: "Need Attention",
      attentionDesc: "Identify cases requiring attention",

      supportTitle: "ASHA Worker Health Support",
      supportDesc:
        "NeuroCare AI supports ASHA workers in organizing maternal and child health records, assessments, follow-ups, and cases requiring attention.",

      maternalFeature:
        "Register mothers and maintain essential maternal health information for easier monitoring and follow-up management.",

      childFeature:
        "Register children, conduct developmental assessments, and keep their health information organized in one place.",

      aiTitle: "AI-Assisted Screening",
      aiDesc:
        "AI-assisted assessment helps identify cases that may require further attention and professional medical evaluation.",

      followUpTitle: "Follow-up Management",
      followUpFeature:
        "Keep track of scheduled mother and child follow-ups and identify pending or overdue cases.",

      attentionTitle: "Need Attention",
      attentionFeature:
        "Quickly identify overdue follow-ups and high-risk assessment cases so they can be reviewed and acted upon.",

      reportsTitle: "Health Reports",
      reportsDesc:
        "Access organized health information and assessment reports to support better follow-up and decision-making.",

      howTitle: "How NeuroCare AI Supports ASHA Workers",
      howDesc:
        "A simple digital workflow for maternal and child health monitoring.",

      register: "Register",
      registerDesc:
        "Register mothers and children in the system.",

      assess: "Assess",
      assessDesc:
        "Conduct child developmental assessments when required.",

      monitor: "Monitor",
      monitorDesc:
        "Track follow-ups and cases requiring attention.",

      refer: "Refer & Follow Up",
      referDesc:
        "Support timely medical evaluation and continued follow-up.",

      ctaTitle: "ASHA Worker Health Support",
      ctaDesc:
        "A digital platform designed to help ASHA workers manage maternal and child health information, assessments, and follow-ups.",

      login: "ASHA Worker Login",
      resources: "Health Resources",

      disclaimer:
        "AI-assisted information is intended to support healthcare workers and does not replace professional medical diagnosis or clinical judgment.",

      footer:
        "Digital health support platform for ASHA workers focused on maternal and child health monitoring, AI-assisted screening, and follow-up management.",
    },

    te: {
      language: "భాష",
      english: "ఇంగ్లీష్",
      telugu: "తెలుగు",
      hindi: "హిందీ",

      maternalHealth: "తల్లి ఆరోగ్యం",
      maternalDesc: "తల్లులను నమోదు చేసి పర్యవేక్షించండి",

      childHealth: "శిశు ఆరోగ్యం",
      childDesc: "నమోదైన పిల్లలను పర్యవేక్షించండి",

      followUp: "ఫాలో-అప్ పర్యవేక్షణ",
      followUpDesc: "షెడ్యూల్ చేసిన ఫాలో-అప్‌లను నిర్వహించండి",

      attention: "శ్రద్ధ అవసరం",
      attentionDesc: "శ్రద్ధ అవసరమైన కేసులను గుర్తించండి",

      supportTitle: "ఆశా కార్యకర్త ఆరోగ్య సహాయం",
      supportDesc:
        "తల్లి మరియు శిశు ఆరోగ్య రికార్డులు, అసెస్‌మెంట్‌లు, ఫాలో-అప్‌లు మరియు శ్రద్ధ అవసరమైన కేసులను నిర్వహించడంలో న్యూరోకేర్ AI ఆశా కార్యకర్తలకు సహాయపడుతుంది.",

      maternalFeature:
        "తల్లులను నమోదు చేసి, తల్లి ఆరోగ్య సమాచారాన్ని పర్యవేక్షించడానికి మరియు ఫాలో-అప్ నిర్వహించడానికి సహాయపడుతుంది.",

      childFeature:
        "పిల్లలను నమోదు చేసి, అభివృద్ధి అసెస్‌మెంట్‌లు నిర్వహించి, వారి ఆరోగ్య సమాచారాన్ని ఒకే చోట నిర్వహించండి.",

      aiTitle: "AI సహాయంతో స్క్రీనింగ్",
      aiDesc:
        "మరింత శ్రద్ధ మరియు వైద్య నిపుణుల మూల్యాంకనం అవసరమయ్యే కేసులను గుర్తించడంలో AI సహాయపడుతుంది.",

      followUpTitle: "ఫాలో-అప్ నిర్వహణ",
      followUpFeature:
        "తల్లి మరియు పిల్లల షెడ్యూల్ చేసిన ఫాలో-అప్‌లను పర్యవేక్షించి, పెండింగ్ లేదా ఆలస్యమైన కేసులను గుర్తించండి.",

      attentionTitle: "శ్రద్ధ అవసరం",
      attentionFeature:
        "ఆలస్యమైన ఫాలో-అప్‌లు మరియు అధిక ప్రమాద కేసులను త్వరగా గుర్తించి అవసరమైన చర్యలకు సహాయపడుతుంది.",

      reportsTitle: "ఆరోగ్య నివేదికలు",
      reportsDesc:
        "మెరుగైన ఫాలో-అప్ మరియు నిర్ణయాలకు సహాయపడే ఆరోగ్య సమాచారం మరియు అసెస్‌మెంట్ నివేదికలను చూడండి.",

      howTitle: "న్యూరోకేర్ AI ఆశా కార్యకర్తలకు ఎలా సహాయపడుతుంది",
      howDesc:
        "తల్లి మరియు శిశు ఆరోగ్య పర్యవేక్షణ కోసం సులభమైన డిజిటల్ విధానం.",

      register: "నమోదు",
      registerDesc:
        "వ్యవస్థలో తల్లులు మరియు పిల్లలను నమోదు చేయండి.",

      assess: "అసెస్‌మెంట్",
      assessDesc:
        "అవసరమైనప్పుడు పిల్లల అభివృద్ధి అసెస్‌మెంట్‌లను నిర్వహించండి.",

      monitor: "పర్యవేక్షణ",
      monitorDesc:
        "ఫాలో-అప్‌లు మరియు శ్రద్ధ అవసరమైన కేసులను పర్యవేక్షించండి.",

      refer: "రిఫర్ & ఫాలో-అప్",
      referDesc:
        "సకాలంలో వైద్య మూల్యాంకనం మరియు నిరంతర ఫాలో-అప్‌కు సహాయపడండి.",

      ctaTitle: "ఆశా కార్యకర్త ఆరోగ్య సహాయం",
      ctaDesc:
        "తల్లి మరియు శిశు ఆరోగ్య సమాచారం, అసెస్‌మెంట్‌లు మరియు ఫాలో-అప్‌లను నిర్వహించడంలో ఆశా కార్యకర్తలకు సహాయపడే డిజిటల్ వేదిక.",

      login: "ఆశా కార్యకర్త లాగిన్",
      resources: "ఆరోగ్య వనరులు",

      disclaimer:
        "AI సహాయంతో అందించే సమాచారం ఆరోగ్య కార్యకర్తలకు సహాయపడటానికి మాత్రమే ఉద్దేశించబడింది. ఇది వైద్య నిర్ధారణ లేదా వైద్య నిపుణుల నిర్ణయానికి ప్రత్యామ్నాయం కాదు.",

      footer:
        "తల్లి మరియు శిశు ఆరోగ్య పర్యవేక్షణ, AI సహాయంతో స్క్రీనింగ్ మరియు ఫాలో-అప్ నిర్వహణ కోసం ఆశా కార్యకర్తలకు డిజిటల్ ఆరోగ్య సహాయ వేదిక.",
    },

    hi: {
      language: "भाषा",
      english: "अंग्रेज़ी",
      telugu: "तेलुगु",
      hindi: "हिंदी",

      maternalHealth: "मातृ स्वास्थ्य",
      maternalDesc: "माताओं का पंजीकरण और निगरानी करें",

      childHealth: "शिशु स्वास्थ्य",
      childDesc: "पंजीकृत बच्चों की निगरानी करें",

      followUp: "फॉलो-अप निगरानी",
      followUpDesc: "निर्धारित फॉलो-अप प्रबंधित करें",

      attention: "ध्यान देने की आवश्यकता",
      attentionDesc: "ध्यान देने योग्य मामलों की पहचान करें",

      supportTitle: "आशा कार्यकर्ता स्वास्थ्य सहायता",
      supportDesc:
        "न्यूरोकेयर AI आशा कार्यकर्ताओं को मातृ और शिशु स्वास्थ्य रिकॉर्ड, आकलन, फॉलो-अप और ध्यान देने योग्य मामलों को व्यवस्थित करने में सहायता करता है।",

      maternalFeature:
        "माताओं का पंजीकरण करें और मातृ स्वास्थ्य जानकारी को आसानी से मॉनिटर और फॉलो-अप करें।",

      childFeature:
        "बच्चों का पंजीकरण करें, विकासात्मक आकलन करें और उनकी स्वास्थ्य जानकारी को एक स्थान पर व्यवस्थित रखें।",

      aiTitle: "AI-सहायता प्राप्त स्क्रीनिंग",
      aiDesc:
        "AI ऐसे मामलों की पहचान करने में मदद करता है जिन पर आगे ध्यान और स्वास्थ्य विशेषज्ञ द्वारा मूल्यांकन की आवश्यकता हो सकती है।",

      followUpTitle: "फॉलो-अप प्रबंधन",
      followUpFeature:
        "माता और बच्चे के निर्धारित फॉलो-अप को ट्रैक करें और लंबित या विलंबित मामलों की पहचान करें।",

      attentionTitle: "ध्यान देने की आवश्यकता",
      attentionFeature:
        "विलंबित फॉलो-अप और उच्च जोखिम वाले मामलों की तुरंत पहचान करने में सहायता करता है।",

      reportsTitle: "स्वास्थ्य रिपोर्ट",
      reportsDesc:
        "बेहतर फॉलो-अप और निर्णय लेने में सहायता के लिए स्वास्थ्य जानकारी और आकलन रिपोर्ट देखें।",

      howTitle: "न्यूरोकेयर AI आशा कार्यकर्ताओं की कैसे सहायता करता है",
      howDesc:
        "मातृ और शिशु स्वास्थ्य निगरानी के लिए सरल डिजिटल कार्यप्रवाह।",

      register: "पंजीकरण",
      registerDesc:
        "सिस्टम में माताओं और बच्चों का पंजीकरण करें।",

      assess: "आकलन",
      assessDesc:
        "आवश्यकता होने पर बच्चों का विकासात्मक आकलन करें।",

      monitor: "निगरानी",
      monitorDesc:
        "फॉलो-अप और ध्यान देने योग्य मामलों की निगरानी करें।",

      refer: "रेफर और फॉलो-अप",
      referDesc:
        "समय पर चिकित्सा मूल्यांकन और निरंतर फॉलो-अप में सहायता करें।",

      ctaTitle: "आशा कार्यकर्ता स्वास्थ्य सहायता",
      ctaDesc:
        "आशा कार्यकर्ताओं को मातृ एवं शिशु स्वास्थ्य जानकारी, आकलन और फॉलो-अप प्रबंधित करने में सहायता करने वाला डिजिटल मंच।",

      login: "आशा कार्यकर्ता लॉगिन",
      resources: "स्वास्थ्य संसाधन",

      disclaimer:
        "AI-सहायता प्राप्त जानकारी स्वास्थ्य कार्यकर्ताओं की सहायता के लिए है और पेशेवर चिकित्सा निदान या चिकित्सकीय निर्णय का विकल्प नहीं है।",

      footer:
        "मातृ और शिशु स्वास्थ्य निगरानी, AI-सहायता प्राप्त स्क्रीनिंग और फॉलो-अप प्रबंधन के लिए आशा कार्यकर्ताओं हेतु डिजिटल स्वास्थ्य सहायता मंच।",
    },
  };

  const t = text[language] || text.en;

  return (
    <>
      <Navbar />

      <Hero />

      {/* Language Selector */}

      <div className="bg-white py-5 flex justify-center">

        <div className="flex items-center gap-3">

          <span className="font-semibold text-gray-700">
            🌐 {t.language}
          </span>

          <select
            value={language}
            onChange={(e) =>
              changeLanguage(e.target.value)
            }
            className="bg-slate-100 border border-gray-200 rounded-xl px-4 py-2 font-semibold text-gray-700 outline-none cursor-pointer"
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

      {/* Statistics */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-8">

          <div className="bg-blue-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-blue-700">
              👩‍🍼
            </h1>

            <p className="mt-4 text-gray-600 font-semibold">
              {t.maternalHealth}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {t.maternalDesc}
            </p>

          </div>

          <div className="bg-green-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-green-700">
              👶
            </h1>

            <p className="mt-4 text-gray-600 font-semibold">
              {t.childHealth}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {t.childDesc}
            </p>

          </div>

          <div className="bg-yellow-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-yellow-700">
              📅
            </h1>

            <p className="mt-4 text-gray-600 font-semibold">
              {t.followUp}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {t.followUpDesc}
            </p>

          </div>

          <div className="bg-red-50 rounded-3xl shadow-lg p-8 text-center hover:scale-105 duration-300">

            <h1 className="text-5xl font-black text-red-700">
              ⚠️
            </h1>

            <p className="mt-4 text-gray-600 font-semibold">
              {t.attention}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {t.attentionDesc}
            </p>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="py-24 bg-slate-100">

        <div className="max-w-7xl mx-auto px-8">

          <h1 className="text-5xl font-black text-center text-blue-700">
            {t.supportTitle}
          </h1>

          <p className="text-center text-gray-600 mt-5 text-xl max-w-3xl mx-auto">
            {t.supportDesc}
          </p>

          <div className="grid md:grid-cols-3 gap-10 mt-16">

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                👩‍🍼
              </div>

              <h2 className="text-3xl font-bold mt-6">
                {t.maternalHealth}
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                {t.maternalFeature}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                👶
              </div>

              <h2 className="text-3xl font-bold mt-6">
                {t.childHealth}
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                {t.childFeature}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                🧠
              </div>

              <h2 className="text-3xl font-bold mt-6">
                {t.aiTitle}
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                {t.aiDesc}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                📅
              </div>

              <h2 className="text-3xl font-bold mt-6">
                {t.followUpTitle}
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                {t.followUpFeature}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                ⚠️
              </div>

              <h2 className="text-3xl font-bold mt-6">
                {t.attention}
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                {t.attentionFeature}
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 hover:-translate-y-2 duration-300">

              <div className="text-6xl">
                📊
              </div>

              <h2 className="text-3xl font-bold mt-6">
                {t.reportsTitle}
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                {t.reportsDesc}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* How It Works */}

      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-8">

          <h1 className="text-5xl font-black text-center text-blue-700">
            {t.howTitle}
          </h1>

          <p className="text-center text-gray-600 mt-5 text-xl">
            {t.howDesc}
          </p>

          <div className="grid md:grid-cols-4 gap-10 mt-20">

            <div className="text-center">

              <div className="text-6xl">
                1️⃣
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {t.register}
              </h2>

              <p className="text-gray-500 mt-3">
                {t.registerDesc}
              </p>

            </div>

            <div className="text-center">

              <div className="text-6xl">
                2️⃣
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {t.assess}
              </h2>

              <p className="text-gray-500 mt-3">
                {t.assessDesc}
              </p>

            </div>

            <div className="text-center">

              <div className="text-6xl">
                3️⃣
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {t.monitor}
              </h2>

              <p className="text-gray-500 mt-3">
                {t.monitorDesc}
              </p>

            </div>

            <div className="text-center">

              <div className="text-6xl">
                4️⃣
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {t.refer}
              </h2>

              <p className="text-gray-500 mt-3">
                {t.referDesc}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24 bg-gradient-to-r from-blue-700 to-cyan-500 text-center text-white">

        <h1 className="text-5xl md:text-6xl font-black">
          {t.ctaTitle}
        </h1>

        <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto px-6">
          {t.ctaDesc}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

          <Link to="/login">

            <button className="bg-white text-blue-700 px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 duration-300">
              👩‍⚕️ {t.login}
            </button>

          </Link>

          <Link to="/learn">

            <button className="bg-blue-900 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 duration-300">
              📚 {t.resources}
            </button>

          </Link>

        </div>

      </section>

      {/* Footer */}

      <footer className="bg-slate-900 text-white py-10 text-center">

        <h1 className="text-3xl font-bold">
          NeuroCare AI
        </h1>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto px-6">
          {t.footer}
        </p>

        <p className="mt-6 text-gray-500">
          © 2026 NeuroCare AI • Idea2Impact Hackathon
        </p>

        <p className="mt-3 text-xs text-gray-600 max-w-xl mx-auto px-6">
          {t.disclaimer}
        </p>

      </footer>

    </>
  );
}

export default Home;