import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiUserCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AddAdminSection = () => {
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prevAdmin => ({ ...prevAdmin, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No admin token found");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add new admin');
      }

      setSuccess('New admin added successfully');
      setNewAdmin({ username: '', email: '', password: '', role: '' });
    } catch (error) {
      console.error('Error adding new admin:', error);
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-xl max-w-md mx-auto"
    >
      <h2 className="text-3xl font-bold text-orange-600 mb-8">Add New Admin</h2>
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-6 p-4 bg-red-100 rounded-lg"
        >
          {error}
        </motion.p>
      )}
      
      {success && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-500 mb-6 p-4 bg-green-100 rounded-lg"
        >
          {success}
        </motion.p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <input
              className="w-full py-3 px-4 pl-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              id="username"
              type="text"
              placeholder="Enter admin username"
              name="username"
              value={newAdmin.username}
              onChange={handleChange}
              required
            />
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              className="w-full py-3 px-4 pl-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              id="email"
              type="email"
              placeholder="Enter admin email"
              name="email"
              value={newAdmin.email}
              onChange={handleChange}
              required
            />
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full py-3 px-4 pl-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              id="password"
              type="password"
              placeholder="Enter admin password"
              name="password"
              value={newAdmin.password}
              onChange={handleChange}
              required
            />
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="role">
            Role
          </label>
          <div className="relative">
            <select
              className="w-full py-3 px-4 pl-12 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 appearance-none"
              id="role"
              name="role"
              value={newAdmin.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <FiUserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl"
          type="submit"
        >
          Add Admin
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddAdminSection;
