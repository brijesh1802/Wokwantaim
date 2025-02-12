import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerifiedPage = () => {
  const { token } = useParams(); // Extract the token from URL params
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Call the backend API to verify the token
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/candidates/verify/${token}`, {
          method: 'GET',
        });
        const data = await response.json();
        console.log(data)

        if (response.ok) {
          setIsVerified(true);
          setTimeout(() => {
            // Redirect user to home page after successful verification
            navigate('/');
          }, 2000); // Optional delay before redirecting
        } else {
          setError(data.msg || 'Verification failed');
        }
      } catch (err) {
        setError('An error occurred');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded shadow-lg">
        {isVerified ? (
          <div>
            <h1 className="text-3xl font-semibold text-green-500">Email Verified Successfully!</h1>
            <p className="mt-4 text-lg text-gray-600">You will be redirected to the home page.</p>
          </div>
        ) : error ? (
          <div>
            <h1 className="text-3xl font-semibold text-red-500">Verification Failed!</h1>
            <p className="mt-4 text-lg text-gray-600">{error}</p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold text-blue-500">Verifying your email...</h1>
            <p className="mt-4 text-lg text-gray-600">Please wait a moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
