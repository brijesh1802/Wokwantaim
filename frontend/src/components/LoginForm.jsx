import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm({ userType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear the form when userType changes
    setEmail("");
    setPassword("");
  }, [userType]);

  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    isError: false,
  });

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, candidate, message } = await response.json();
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(candidate));

        setPopup({
          visible: true,
          message: message || "Login successful!",
          isError: false,
        });

        setTimeout(() => {
          setPopup({ visible: false, message: "", isError: false });
          navigate("/");
        }, 1500);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.msg || "An unexpected error occurred";

        setPopup({
          visible: true,
          message: errorMessage,
          isError: true,
        });

        // Auto-close the popup after a delay
        setTimeout(() => {
          setPopup({ visible: false, message: "", isError: false });
        }, 3000);
      }
    } catch (err) {
      console.error(`Network error: ${err.message}`);
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
    <>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
            />
            <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
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

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {loading ? <div className="spinner"></div> : "Log In"}
        </button>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-orange-500 hover:text-orange-600"
          >
            Sign up
          </Link>
        </p>
      </form>

      {popup.visible && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-10 px-4 py-2 rounded-lg shadow-lg text-white ${
            popup.isError ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {popup.message}
        </div>
      )}
    </>
  );
}

export default LoginForm;
