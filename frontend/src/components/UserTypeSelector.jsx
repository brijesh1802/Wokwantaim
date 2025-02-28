import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';

function UserTypeSelector({ selectedType, onSelect }) {
  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
      <motion.button
        onClick={() => onSelect("candidate")}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`flex items-center gap-4 p-3 border-2 rounded-xl transition-all duration-300 ${
          selectedType === "candidate" 
            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md" 
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
      >
        <div className={`p-3 rounded-full ${selectedType === "candidate" ? "bg-orange-100" : "bg-gray-100"}`}>
          <User className="w-6 h-6" />
        </div>
        <div className="text-left">
          <div className={`text-sm ${selectedType === "candidate" ? "text-orange-500" : "text-gray-500"}`}>Candidate</div>
          <div className="font-semibold text-lg">Singup as Candidate</div>
        </div>
      </motion.button>
      
      <motion.button
        onClick={() => onSelect("employer")}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`flex items-center gap-4 p-3 border-2 rounded-xl transition-all duration-300 ${
          selectedType === "employer" 
            ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md" 
            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
      >
        <div className={`p-3 rounded-full ${selectedType === "employer" ? "bg-orange-100" : "bg-gray-100"}`}>
          <Building2 className="w-6 h-6" />
        </div>
        <div className="text-left">
          <div className={`text-sm ${selectedType === "employer" ? "text-orange-500" : "text-gray-500"}`}>Employer</div>
          <div className="font-semibold text-lg">Singup as Employer</div>
        </div>
      </motion.button>
    </div>
  );
}

export default UserTypeSelector;
