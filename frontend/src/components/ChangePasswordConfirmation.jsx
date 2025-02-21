import React, { useEffect, useState } from "react";

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
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="change-confirmation bg-white p-6 rounded-xl shadow-2xl w-96 text-center">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mt-3">
          {emailSent ? "Verification Email Sent" : "Confirm Password Reset"}
        </h2>

        {/* Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-md text-left">
          <div className="flex items-start">
            <p className="ml-3 text-sm text-yellow-700">
              {emailSent
                ? "A password reset email has been sent. Check your inbox and follow the instructions."
                : "You will be logged out, and a password reset email will be sent. Click the link in the email to create a new password, then log in again."}
            </p>
          </div>
        </div>

        {/* Buttons */}
        {!emailSent ? (
          <div className="mt-5 flex justify-center space-x-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition shadow-md disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangePasswordConfirmation;
