// SplashScreen.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background animations */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-orange-200 opacity-20"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: Math.random() * 2 + 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-10"></div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center z-10"
          >
            {/* <motion.h1 
              className="text-5xl font-bold text-orange-500 mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              WorkWomtaim
            </motion.h1> */}
            <motion.p 
              className="text-2xl text-gray-800 mb-8"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Loading...
            </motion.p>
            <motion.div
              className="h-2 w-48 bg-orange-200 rounded-full overflow-hidden mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 192 }}
              transition={{ duration: 3, ease: "linear" }}
            >
              <motion.div
                className="h-full bg-orange-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </motion.div>
            <motion.div
              className="mt-4 flex justify-center space-x-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-4 h-4 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
