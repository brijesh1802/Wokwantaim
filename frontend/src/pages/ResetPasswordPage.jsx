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
      <div className="relative max-w-full p-8 bg-white rounded-lg shadow-lg sm:w-96">
        {/* Close Button */}
        <X
          className="absolute p-1 text-gray-900 rounded-full top-4 right-4 hover:cursor-pointer hover:bg-gray-200"
          onClick={() => navigate("/login")}
        />

        {/* Modal Title */}
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Reset Password
        </h2>

        {/* Popup Message */}
        {popup.visible && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg shadow-lg text-white ${
              popup.isError ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {popup.message}
          </div>
        )}

        {/* Password Field */}
        <div className="mt-5">
          <div className="relative">
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your password"
            />
            <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mt-5">
          <div className="relative">
            <input
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              required
              className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirm your password"
            />
            <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}

        <button
          onClick={handleSubmit}
          className={`mt-5 w-full py-2 text-white bg-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            !password || !confirmPassword
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-orange-600"
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
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
