import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Learn from "./pages/Learn";
import About from "./pages/About";
import Results from "./pages/Results";
import AIChat from "./pages/AIChat";
import Report from "./pages/Report";
import ASHADashboard from "./pages/ASHADashboard";
import AddMother from "./pages/AddMother";
import AddChild from "./pages/AddChild";
import Children from "./pages/Children";
import FollowUps from "./pages/FollowUps";
import Mothers from "./pages/Mothers";
import MotherFollowUps from "./pages/MotherFollowUps";
import NeedAttention from "./pages/NeedAttention";
import FollowUpsToday from "./pages/FollowUpsToday";
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
      <Route
        path="/asha"
        element={<ASHADashboard />}
      />
      <Route
        path="/add-mother"
        element={<AddMother />}
      />
      <Route
        path="/add-child"
        element={<AddChild />}
      />
      <Route
        path="/children"
        element={<Children />}
      />
      <Route
        path="/follow-ups"
        element={<FollowUps />}
      />
      <Route
        path="/mothers"
        element={<Mothers />}
      />
      <Route
        path="/mother-follow-ups"
        element={<MotherFollowUps />}
      />
      <Route
        path="/need-attention"
        element={<NeedAttention />}
      />
      <Route
        path="/follow-ups-today"
        element={<FollowUpsToday />}
      />

    </Routes>
  );
}

export default App;