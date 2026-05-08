import { BrowserRouter, Routes, Route } from "react-router-dom";
import HelpRequest from "./pages/HelpRequest";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/help-request" element={<HelpRequest />} />
        <Route path="/about-us" element={<AboutUs />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;