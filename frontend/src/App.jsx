import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const location = useLocation();
  const noPaths = ["/signup", "/login"];
  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render Header */}
      {!noPaths.includes(location.pathname) && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      {!noPaths.includes(location.pathname) && <Footer />}
    </div>
  );
} 

export default App;
