import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get("token");

    if (authToken) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userType", "candidate");
    }


    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-800">Signing you in...</h1>
        <p className="mt-4 text-xl text-gray-600">Redirecting you to the homepage...</p>
        <div className="mt-6">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
}

export default RedirectPage;
