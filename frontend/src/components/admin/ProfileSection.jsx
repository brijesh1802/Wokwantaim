import React, { useState, useEffect, useContext } from 'react';
import { FiUser, FiMail, FiLogOut, FiEdit } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProfileSection = () => {
  const [profile, setProfile] = useState({});
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          console.log("No admin token found");
          return;
        }
        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/admin/profile`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          console.log("Unauthorized access, logging out");
          handleLogout();
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfile(data.admin);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/admin/login');
  };

  const name = profile.username ||''

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Profile</h2>
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-40 h-40 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-6xl mr-4 mb-4"
        >
          {name.charAt(0).toUpperCase()}
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-700">{profile.username || 'Loading...'}</h3>
        <p className="text-gray-500 mt-2">{profile.role || 'Admin'}</p>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg gap-3">
          <FiMail className="w-4 h-6 text-orange-500" />
          <div>
            {/* <p className="text-sm text-gray-500">Email</p> */}
            <p className="sm:text-l text-lg font-medium text-gray-700">{profile.email || 'Loading...'}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center font-medium hover:bg-red-600 transition duration-300"
        >
          <FiLogOut className="mr-2" /> Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfileSection;
