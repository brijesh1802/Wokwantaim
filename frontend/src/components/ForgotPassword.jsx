import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { X } from "lucide-react";

const ForgotPassword = ({ closeModal }) => {
  const { userType } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    const url = `${import.meta.env.VITE_BASE_URL}/api/v1/auth/request-password-reset`;
      // userType === "candidate"
      //   ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/forgot-password`
      //   : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/forgot-password`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email}),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password reset link sent to mail successfully!"); // Show success alert
        closeModal(); 
      } else {
        setError(data.msg || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative max-w-full p-8 bg-white rounded-lg shadow-lg sm:w-96">
        {/* Close Button */}
        <X
          className="absolute p-1 text-gray-900 rounded-full top-4 right-4 hover:cursor-pointer hover:bg-gray-200"
          onClick={closeModal}
        />

        {/* Modal Title */}
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Forgot Password
        </h2>

        {/* Input Field */}
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-2 pl-4 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Error Message Inside Modal */}
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-2 text-white bg-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            !email ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
          }`}
          disabled={!email}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <p className="mt-4 text-sm text-gray-500">
          Remember your password?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={closeModal}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;