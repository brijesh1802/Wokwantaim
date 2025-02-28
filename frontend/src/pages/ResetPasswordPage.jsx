import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, Lock } from "lucide-react";
import "../index.css"; // Import spinner CSS

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false); // Controls "Resetting..."
  const [redirecting, setRedirecting] = useState(false); // Controls "Password Reset!" spinner
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setPopup({
        visible: true,
        message: "Please fill out all fields.",
        isError: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      setPopup({
        visible: true,
        message: "Passwords do not match.",
        isError: true,
      });
      return;
    }

    setLoading(true); // Show "Resetting..."

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setPopup({
          visible: true,
          message: "Password reset successful.",
          isError: false,
        });
          setRedirecting(true);
        // Show "Password Reset!" with spinner, then redirect
        setTimeout(() => {
          setRedirecting(true); // Start spinner
          setTimeout(() => navigate("/login"), 3000); // Redirect after 2s
        }, 1000);
      } else {
        setPopup({
          visible: true,
          message: data.message || "Failed to reset password.",
          isError: true,
        });
        setLoading(false);
      }
    } catch (err) {
      setPopup({ visible: true, message: "An error occurred.", isError: true });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
  <div className="relative w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
    {/* Close Button */}
    <button
      className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
      onClick={() => navigate("/login")}
    >
      <X size={20} />
    </button>

    {/* Modal Title */}
    <h2 className="mb-6 text-3xl font-bold text-gray-800 text-center">
      Reset Password
    </h2>

    {/* Popup Message */}
    {popup.visible && (
      <div
        className={`mb-6 px-4 py-3 rounded-lg shadow-md text-white text-center ${
          popup.isError ? "bg-red-500" : "bg-green-500"
        }`}
      >
        {popup.message}
      </div>
    )}

    {/* Password Fields */}
    {["password", "confirmPassword"].map((field, index) => (
      <div key={field} className={`mt-${index === 0 ? '6' : '4'}`}>
        <div className="relative">
          <input
            id={field}
            value={field === "password" ? password : confirmPassword}
            onChange={(e) => field === "password" ? setPassword(e.target.value) : setConfirmPassword(e.target.value)}
            type={field === "password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")}
            required
            className="w-full py-3 pl-12 pr-10 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200"
            placeholder={field === "password" ? "Enter your password" : "Confirm your password"}
          />
          <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
          <button
            type="button"
            onClick={() => field === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
            className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
          >
            {(field === "password" ? showPassword : showConfirmPassword) ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    ))}

    {/* Submit Button */}
    <button
      onClick={handleSubmit}
      className={`mt-8 w-full py-3 text-white bg-orange-500 rounded-lg transition-all duration-200 ${
        !password || !confirmPassword || loading || redirecting
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-orange-600 hover:shadow-lg"
      }`}
      disabled={!password || !confirmPassword || loading || redirecting}
    >
      {!redirecting && !loading ? (
        "Reset Password"
      ) : redirecting ? (
        <div className="flex items-center justify-center">
          <span className="mr-2">
            <div className="spinner mr-1"> </div>
          </span>
          Redirecting...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="mr-2">
            <div className="spinner mr-1"> </div>
          </span>
          Resetting...
        </div>
      )}
    </button>
  </div>
</div>

  );
}

export default ResetPasswordPage;
