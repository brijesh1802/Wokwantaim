import { useState, useEffect, useContext } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ForgotPassword from "./ForgotPassword";

function LoginForm({ userType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forget, setForget] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [userType]);

  const frogetclose = () => setForget(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const url =
        userType === "candidate"
          ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/login`
          : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, message } = data;
        const userKey = userType === "candidate" ? "user" : "userEmployer";

        localStorage.setItem("authToken", token);
        localStorage.setItem(userKey, JSON.stringify(data[userKey]));

        setPopup({
          visible: true,
          message: message || "Login successful!",
          isError: false,
        });

        setRedirect(true);
        setTimeout(() => {
          setPopup({ visible: false, message: "", isError: false });
          login(userType);
          navigate("/");
        }, 2000);
      } else {
        setPopup({
          visible: true,
          message: data.msg || "Login failed",
          isError: true,
        });
        setTimeout(
          () => setPopup({ visible: false, message: "", isError: false }),
          3000
        );
      }
    } catch (err) {
      setPopup({
        visible: true,
        message: "Network error. Please try again.",
        isError: true,
      });
      setTimeout(
        () => setPopup({ visible: false, message: "", isError: false }),
        3000
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full py-3 pl-12 pr-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <Mail className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full py-3 pl-12 pr-10 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <Lock className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setForget(true)}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          {loading ? "Logging in..." : redirect ? "Redirecting..." : "Log In"}
        </motion.button>

        {/* Sign-up Link */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </motion.form>

      {/* Toast Notification */}
      <AnimatePresence>
        {popup.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-10 px-6 py-3 rounded-lg shadow-lg text-white ${
              popup.isError ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={frogetclose}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ForgotPassword closeModal={frogetclose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default LoginForm;
