import { useState } from "react";
import { X } from "lucide-react";

const ForgotPassword = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    setPopup({ visible: false, message: "", isError: false }); // Reset popup before submit

    const url = `${import.meta.env.VITE_BASE_URL}/api/v1/auth/request-password-reset`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response Data:", data); // Debugging response

      if (response.ok) {
        setPopup({
          visible: true,
          message: "Password reset link sent to your email successfully!",
          isError: false,
        });
        setTimeout(() => {
          setPopup({ visible: false, message: "", isError: false });
          closeModal(); // Close modal after success
        }, 3000);
      } else {
        setPopup({
          visible: true,
          message: data.message || "An error occurred. Please try again.",
          isError: true,
        });
        setTimeout(() => {
          setPopup({ visible: false, message: "", isError: false });
        }, 3000);
      }
    } catch (err) {
      console.error("Network error:", err);
      setPopup({
        visible: true,
        message: "Network error. Please try again later.",
        isError: true,
      });
      setTimeout(() => {
        setPopup({ visible: false, message: "", isError: false });
      }, 3000);
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

      {/* Popup Message */}
      {popup.visible && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-10 px-4 py-2 rounded-lg shadow-lg text-white ${
            popup.isError ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
