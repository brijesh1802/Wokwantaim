import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get("token");

    if (authToken) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userType", "candidate");
    }


    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Loader className="w-16 h-16 text-orange-500 mx-auto" />
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Signing you in...
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Redirecting you to the homepage
          </motion.p>
          
          <motion.div 
            className="flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-orange-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
  );
}

export default RedirectPage;
