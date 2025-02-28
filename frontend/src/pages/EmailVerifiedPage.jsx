import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const EmailVerifiedPage = () => {
  const { token } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const candidateResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/verify/${token}`,
          { method: "GET" }
        );

        if (candidateResponse.ok) {
          setIsVerified(true);
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        const employerResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/employers/verify/${token}`,
          { method: "GET" }
        );

        if (employerResponse.ok) {
          setIsVerified(true);
          setTimeout(() => navigate("/"), 3000);
        } else {
          setError("Verification failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { delay: 0.2, type: "spring", stiffness: 200 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.div
        className="p-8 bg-white rounded-lg shadow-xl max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isLoading ? (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="mx-auto text-blue-500 w-20 h-20" />
            </motion.div>
            <h1 className="mt-6 text-3xl font-bold text-gray-800">
              Verifying Your Email
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Please wait while we confirm your email address.
            </p>
          </div>
        ) : isVerified ? (
          <div className="text-center">
            <motion.div variants={iconVariants} initial="hidden" animate="visible">
              <CheckCircle className="mx-auto text-green-500 w-20 h-20" />
            </motion.div>
            <h1 className="mt-6 text-3xl font-bold text-gray-800">
              Email Verified Successfully!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              You will be redirected to the home page shortly.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <motion.div variants={iconVariants} initial="hidden" animate="visible">
              <XCircle className="mx-auto text-red-500 w-20 h-20" />
            </motion.div>
            <h1 className="mt-6 text-3xl font-bold text-gray-800">
              Verification Failed
            </h1>
            <p className="mt-4 text-lg text-red-600">{error}</p>
            <motion.button
              className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              Go to Home Page
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmailVerifiedPage;
