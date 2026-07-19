import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Learn from "./pages/Learn";
import About from "./pages/About";
import Results from "./pages/Results";
import AIChat from "./pages/AIChat";
import Report from "./pages/Report";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route
        path="/assessment"
        element={<Assessment />}
      />

      <Route
        path="/report"
        element={<Report />}
      />

      <Route
        path="/learn"
        element={<Learn />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/results"
        element={<Results />}
      />

      <Route
        path="/chat"
        element={<AIChat />}
      />

    </Routes>
  );
}

export default App;