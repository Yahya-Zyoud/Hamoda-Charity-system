import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToHash from "./Components/ScrollToHash";

import Project from "./pages/Project";
import TeamWork from "./pages/TeamWork";

function App() {
  return (
    <>
      <ScrollToHash />

      <Routes>
        <Route path="/projects" element={<Project />} />
        <Route path="/team" element={<TeamWork />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;