import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from 'lucide-react';

const BacktoHome = () => {
  return (
    <>
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/">
          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-full shadow-lg"
            whileHover={{ scale: 1.05, backgroundColor: "#f97316" }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} />
            <span className="hidden md:inline">Back to Home</span>
          </motion.button>
        </Link>
      </motion.div>
    </>
  );
}

export default BacktoHome;
