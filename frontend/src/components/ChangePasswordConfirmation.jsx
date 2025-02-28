import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function ChangePasswordConfirmation({ onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event) => {
      if (!event.target.closest(".change-confirmation")) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      onConfirm();
    }, 3000); // Simulating API call delay
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          {emailSent ? (
            <CheckCircle className="w-8 h-8 text-orange-500" />
          ) : (
            <AlertCircle className="w-8 h-8 text-orange-500" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          {emailSent ? "Verification Email Sent" : "Confirm Password Reset"}
        </h2>

        {/* Message */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-md text-left">
          <p className="text-sm text-orange-700 leading-relaxed">
            {emailSent
              ? "A password reset email has been sent. Check your inbox and follow the instructions to reset your password."
              : "You will be logged out, and a password reset email will be sent. Click the link in the email to create a new password, then log in again."}
          </p>
        </div>

        {/* Buttons */}
        {!emailSent ? (
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 sm:px-6 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={onCancel}
            className="w-full px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

export default ChangePasswordConfirmation;
