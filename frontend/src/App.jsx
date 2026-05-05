import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToHash from "./Components/ScrollToHash";

import Project from "./pages/Project";
import TeamWork from "./pages/TeamWork";

function App() {
  return (
    <>
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/team" element={<TeamWork />} />
      </Routes>
    </>
  );
}

export default App;