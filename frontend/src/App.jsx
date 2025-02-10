import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import CompanyDetail from "./pages/CompanyDetail";
import Profile from "./components/Profile";
import InterviewPage from "./components/InterviewPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ScrollToTop from "./components/ScrollToTop";
import JobFilter from "./components/JobFilter";


function App() {
  const location = useLocation();
  const noPaths = ["/signup", "/login"];
  return (
    <AuthProvider>
      <ScrollToTop/>
      <div className="flex flex-col min-h-screen">
        {/* Conditionally render Header */}
        {!noPaths.includes(location.pathname) && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route path="*" element={<h1>Not Found</h1>} /> 
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/joblist' element={<JobList/>}/>
            <Route path='/jobdetail' element={<JobDetail/>}/>
            <Route path="/companydetail" element={<CompanyDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/interview/:companyId' element={<InterviewPage/>}/>
            <Route path='/reset-password' element={<ResetPasswordPage/>}/>
            <Route path='/jobfilter' element={<JobFilter/>}/>

          </Routes>
        </main>
        {!noPaths.includes(location.pathname) && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;