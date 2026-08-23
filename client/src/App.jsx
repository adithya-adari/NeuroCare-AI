import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Learn from "./pages/Learn";
import About from "./pages/About";
import Results from "./pages/Results";
import AIChat from "./pages/AIChat";
import Report from "./pages/Report";
import Login from "./pages/Login";

import ASHADashboard from "./pages/ASHADashboard";
import AddMother from "./pages/AddMother";
import AddChild from "./pages/AddChild";
import Children from "./pages/Children";
import FollowUps from "./pages/FollowUps";
import Mothers from "./pages/Mothers";
import MotherFollowUps from "./pages/MotherFollowUps";
import NeedAttention from "./pages/NeedAttention";
import FollowUpsToday from "./pages/FollowUpsToday";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC ROUTES
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />

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

      {/* =================================================
          LOGIN
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =================================================
          PROTECTED ASHA WORKER ROUTES
      ================================================= */}

      <Route element={<ProtectedRoute />}>

        {/* ASHA Dashboard */}

        <Route
          path="/asha"
          element={<ASHADashboard />}
        />

        {/* Mother Registration */}

        <Route
          path="/add-mother"
          element={<AddMother />}
        />

        {/* Child Registration */}

        <Route
          path="/add-child"
          element={<AddChild />}
        />

        {/* Children */}

        <Route
          path="/children"
          element={<Children />}
        />

        {/* Follow-ups */}

        <Route
          path="/follow-ups"
          element={<FollowUps />}
        />

        {/* Mothers */}

        <Route
          path="/mothers"
          element={<Mothers />}
        />

        {/* Mother Follow-ups */}

        <Route
          path="/mother-follow-ups"
          element={<MotherFollowUps />}
        />

        {/* Need Attention */}

        <Route
          path="/need-attention"
          element={<NeedAttention />}
        />

        {/* Follow-ups Today */}

        <Route
          path="/follow-ups-today"
          element={<FollowUpsToday />}
        />

        {/* Reports */}

        <Route
          path="/reports"
          element={<Reports />}
        />

      </Route>

    </Routes>
  );
}

export default App;