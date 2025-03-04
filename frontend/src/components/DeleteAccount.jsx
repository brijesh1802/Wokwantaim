import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Trash2, AlertTriangle, Lock } from "lucide-react";
import Loading from "./Loading";
import { motion, AnimatePresence } from "framer-motion";

const DeleteAccount = () => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const { userType } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

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
        setUser(data.candidate || data.employer || data);
        console.log("User Profile:", data.candidate.modeofLogin);
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

  const handleDelete = async () => {
    if (user?.modeofLogin === "email" && !password) {
      setError("Password cannot be empty.");
      return;
    }

    const url =
      userType === "candidate"
        ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/deleteProfile`
        : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/deleteProfile`;

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Response Data:", data);
      localStorage.clear();
      setTimeout(() => {
        setLoading(false);
        navigate("/"); // Redirect to home page after deletion
      }, 2000);
    } catch (err) {
      console.error("Network error:", err);
      setError(
        err.message ||
          "An error occurred while deleting the account. Please try again."
      );
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (event.target === event.currentTarget) {
      onClose(); // Call the onClose prop to close the modal
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 py-8 px-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              Loading...
            </motion.div>
          ) : (
            <>
              {step === 1 && (
                <motion.div
                  key={1}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Confirm Deletion
                    </h2>
                    <p className="mt-3 text-gray-600">
                      Are you sure you want to delete your account?
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-5 rounded-md flex items-start space-x-3">
                    <AlertTriangle className="text-yellow-400 w-6 h-6" />
                    <div>
                      <p className="text-sm text-yellow-700">
                        This action is <strong>permanent</strong> and cannot be
                        undone.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => navigate("/")}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key={2}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Confirm Deletion
                    </h2>
                  </div>

                  {user?.modeofLogin === "email" ? (
                    <div className="mt-5">
                      <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md flex items-center space-x-2">
                        <Lock className="text-yellow-500 w-4 h-4" />
                        <span>
                          For security reasons, please confirm your identity by
                          entering your password.
                        </span>
                      </p>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 mt-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md flex items-center space-x-2">
                      <AlertTriangle className="text-yellow-500 w-4 h-4" />
                      <span>
                        Confirm your action by clicking{" "}
                        <strong>Yes, Confirm Delete</strong>.
                      </span>
                    </p>
                  )}

                  {error && (
                    <p className="mt-3 text-sm text-red-600">{error}</p>
                  )}

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => navigate("/")}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Yes, Confirm Delete</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DeleteAccount;
