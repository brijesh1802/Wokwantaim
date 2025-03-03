import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const circleVariants = {
    start: {
      y: '50%',
    },
    end: {
      y: '150%',
    },
  };

  const circleTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: 'easeInOut',
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100">
      <motion.div
        className="flex space-x-3"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="w-4 h-4 bg-orange-500 rounded-full"
            variants={circleVariants}
            transition={circleTransition}
          />
        ))}
      </motion.div>
      <motion.p
        className="text-gray-600 mt-8 text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;
