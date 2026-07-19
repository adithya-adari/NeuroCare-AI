import { useLocation } from "react-router-dom";

function Results() {
  const location = useLocation();

  const result = location.state;

  if (!result) {
    return (
      <div className="min-h-screen flex justify-center items-center text-3xl">
        No Assessment Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-8">

      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl">

        <h1 className="text-5xl font-bold text-center text-blue-700">

          AI Assessment Result

        </h1>

        <div className="mt-10 text-center">

          <h2 className="text-3xl font-bold">

            {result.level}

          </h2>

          <p className="mt-8 text-xl leading-9">

            {result.message}

          </p>

        </div>

      </div>

    </div>
  );
}

export default Results;