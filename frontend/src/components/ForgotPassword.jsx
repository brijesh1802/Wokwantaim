import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md p-8 bg-white rounded-xl shadow-2xl"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 p-1 text-gray-500 rounded-full hover:bg-gray-100"
          onClick={closeModal}
        >
          <X className="w-6 h-6" />
        </motion.button>

        <h2 className="mb-6 text-3xl font-bold text-gray-800">Reset Password</h2>

        <div className="relative mb-6">
          <Mail className="absolute top-3 left-3 w-6 h-6 text-gray-400" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!email || loading}
          className={`w-full py-3 text-white bg-orange-500 rounded-lg transition-colors ${
            !email || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
          }`}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-t-2 border-white rounded-full"
            />
          ) : (
            'Send Reset Link'
          )}
        </motion.button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remember your password?{' '}
          <motion.span
            whileHover={{ color: '#f97316' }}
            className="font-medium text-orange-500 cursor-pointer"
            onClick={closeModal}
          >
            Back to Login
          </motion.span>
        </p>
      </motion.div>

      <AnimatePresence>
        {popup.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
              popup.isError ? 'bg-red-500' : 'bg-green-500'
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ForgotPassword;
