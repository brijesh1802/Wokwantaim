import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from "lucide-react";

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:8181/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('An error occurred.');
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
                onClick={() => navigate('/login')}
            />

            {/* Modal Title */}
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Reset Password
            </h2>

            {/* Error Message */}
            {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
            {message && <p className="mb-2 text-sm text-green-500">{message}</p>}

            {/* Password Field */}
            <div className="relative mb-4">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 pl-4 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? "🙈" : "👁️"}
                </span>
            </div>

            {/* Confirm Password Field */}
            <div className="relative mb-4">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-2 pl-4 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <span
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? "🙈" : "👁️"}
                </span>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className={`w-full py-2 text-white bg-orange-500 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    (!password || !confirmPassword) ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
                }`}
                disabled={!password || !confirmPassword}
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </div>
    </div>
);
}

export default ResetPasswordPage;
