import React, { useEffect } from "react";

function LogoutConfirmation({ onConfirm, onCancel }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleClickOutside = (event) => {
      if (!event.target.closest(".logout-confirmation")) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="logout-connfirmation bg-white p-6 rounded-lg shadow-xl w-80 sm:w-96 animate-fadeIn">
        {/* Icon and Title */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Confirm Logout
          </h2>
          <p className="text-gray-600 mt-2">
            Are you sure you want to log out?
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 w-1/2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 w-1/2 ml-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmation;
