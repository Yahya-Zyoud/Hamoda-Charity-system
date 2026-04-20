import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/Profile/ProfilePage";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
