import React from 'react';
import { motion } from "framer-motion";

const Error = ({ message }) => {
  return (
    <motion.div
      className="flex items-center justify-center h-screen"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <p className="text-red-500 font-semibold text-lg">{message}</p>
    </motion.div>
  );
};

export default Error;
