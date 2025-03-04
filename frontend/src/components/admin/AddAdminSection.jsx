import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiUserCheck } from 'react-icons/fi';

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Admin</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter admin username"
              name="username"
              value={newAdmin.username}
              onChange={handleChange}
              required
            />
            <FiUser className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter admin email"
              name="email"
              value={newAdmin.email}
              onChange={handleChange}
              required
            />
            <FiMail className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter admin password"
              name="password"
              value={newAdmin.password}
              onChange={handleChange}
              required
            />
            <FiLock className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <div className="relative">
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <FiUserCheck className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdminSection;
