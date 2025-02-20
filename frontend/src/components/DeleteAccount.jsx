import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Trash2 } from "lucide-react";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteAccount = () => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const { userType } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userEmail = user?.email || "user@example.com"; // Simulated user email

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const url =
          userType === "candidate"
            ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/profile`
            : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/profile`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userType) fetchUserProfile();
  }, [userType, token]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scrolling on unmount
    };
  }, []);

  const handleDelete = () => {
    if (password === "test123") {
      alert("Account deleted successfully!");
      navigate("/"); // Redirect home after deletion
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container (Scrollable) */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Step 1: Confirmation */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-medium text-center text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mt-4 text-lg font-normal text-gray-900">
              Are you sure you want to delete your account?
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 mt-4 rounded-md">
              <div className="flex items-start">
                <FaExclamationTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                <p className="ml-4 text-base text-yellow-700">
                  This action is <strong>permanent</strong> and cannot be
                  undone. All your data, including saved preferences, will be
                  lost.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md 
                hover:bg-gray-600 hover:scale-105 transition-transform duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="bg-red-700 text-white px-5 py-2 rounded-lg shadow-md 
                hover:bg-red-800 hover:scale-105 transition-transform duration-300"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* Step 2: Enter Password */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-medium text-center text-gray-800">
              Enter Password
            </h2>
            <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
              🔒 <strong>For security reasons</strong>, please confirm your
              identity by entering your password.
            </p>
            <p className="mt-3 text-md font-semibold text-gray-900">
              {userEmail}
            </p>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mt-4 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md 
                hover:bg-gray-600 hover:scale-105 transition-transform duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-700 text-white px-5 py-2 rounded-lg shadow-md 
                hover:bg-red-800 hover:scale-105 transition-transform duration-300 flex items-center space-x-2"
              >
                <Trash2 />
                <span>Yes, Confirm Delete</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAccount;
