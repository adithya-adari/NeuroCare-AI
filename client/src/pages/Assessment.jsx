import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import questions from "../services/questions";

function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAnswer = async (answer) => {
    const updated = {
      ...answers,
      [questions[step].id]: answer,
    };

    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/ai/analyze", {
        answers: updated,
      });

      navigate("/report", {
        state: {
          report: res.data.report,
        },
      });
    } catch (error) {
      console.log(error);
      alert("Unable to generate AI report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex justify-center items-center">

        <div className="bg-white shadow-2xl rounded-3xl p-12 w-[600px] text-center">

          <div className="text-7xl animate-pulse">
            🧠
          </div>

          <h1 className="text-4xl font-extrabold text-blue-700 mt-6">
            NeuroCare AI
          </h1>

          <p className="text-gray-600 mt-4 text-lg">
            AI is analyzing your child's developmental assessment...
          </p>

          <div className="mt-10 space-y-4 text-left text-lg">

            <p>✅ Reviewing developmental milestones...</p>

            <p>✅ Checking symptom patterns...</p>

            <p>✅ Comparing responses with pediatric guidelines...</p>

            <p>✅ Generating personalized recommendations...</p>

          </div>

          <div className="mt-10 w-full bg-gray-200 rounded-full h-5 overflow-hidden">

            <div className="bg-blue-600 h-5 rounded-full animate-pulse w-full"></div>

          </div>

          <p className="mt-6 text-gray-500">
            Please wait a few seconds...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex justify-center items-center p-6">

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-10">

        <h1 className="text-5xl font-extrabold text-center text-blue-700">
          🧠 NeuroCare AI Assessment
        </h1>

        <p className="text-center mt-4 text-gray-500 text-lg">
          Question <span className="font-bold">{step + 1}</span> of{" "}
          <span className="font-bold">{questions.length}</span>
        </p>

        <div className="w-full h-4 bg-gray-200 rounded-full mt-8">

          <div
            className="bg-blue-700 h-4 rounded-full transition-all duration-500"
            style={{
              width: `${((step + 1) / questions.length) * 100}%`,
            }}
          ></div>

        </div>

        <div className="mt-12">

          <h2 className="text-3xl font-bold text-center leading-relaxed text-gray-800">
            {questions[step].question}
          </h2>

        </div>

        <div className="grid grid-cols-2 gap-8 mt-14">

          <button
            onClick={() => handleAnswer("Yes")}
            className="bg-green-600 hover:bg-green-700 text-white py-5 rounded-2xl text-2xl font-bold duration-300 shadow-lg hover:scale-105"
          >
            ✅ YES
          </button>

          <button
            onClick={() => handleAnswer("No")}
            className="bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl text-2xl font-bold duration-300 shadow-lg hover:scale-105"
          >
            ❌ NO
          </button>

        </div>

      </div>

    </div>
  );
}

export default Assessment;