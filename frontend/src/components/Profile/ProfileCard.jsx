import React, { useState } from "react";
import { motion } from "framer-motion";
import { SquarePen, Briefcase, Phone, FileText, MapPin } from "lucide-react";

const ProfileCard = ({ user }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleEditClick = () => setIsPopupOpen(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl mb-3 shadow-xl overflow-hidden w-full max-w-sm mx-auto mt-7 
    lg:sticky lg:top-24 lg:mb-8
    md:max-w-md 
    sm:max-w-sm 
    xs:max-w-xs"
    >
      <div className="relative h-40 bg-gradient-to-r from-orange-400 to-orange-600">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          onClick={handleEditClick}
        >
          <SquarePen className="w-5 h-5 text-orange-500" />
        </motion.button>
      </div>
      
      <div className="relative px-6 pb-6">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={user.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>
        
        <div className="pt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.fullName?.firstName || user.name || "Unknown"}
          </h2>
          <p className="text-gray-600 mt-1">{user.email}</p>
          
          {user.modeofLogin === "email" && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center text-gray-700">
                <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                <span>{user.experienceLevel || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                <span>{user.jobType || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <Phone className="w-5 h-5 mr-2 text-orange-500" />
                <span>{user.phoneNumber || "Not provided"}</span>
              </div>
              {user.resume && (
                <motion.a
                  href={user.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Resume
                </motion.a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
