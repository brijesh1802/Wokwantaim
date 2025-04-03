import React, { useState, useEffect, useCallback } from 'react';
import { FiUser, FiMail, FiEdit, FiTrash2, FiUserCheck, FiX, FiAlertTriangle } from 'react-icons/fi';

const ViewEmployersSection = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // New state for delete confirmation modal
  const [adminToDelete, setAdminToDelete] = useState(null); // New state to hold the admin ID to delete

  const fetchAdmins = useCallback(async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No admin token found");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getAll`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

    const fetchAdminDetails = useCallback(async (adminId) => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No admin token found");

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getAdmin/${adminId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          method: 'GET'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setEditingAdmin(data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setError(error.message);
      }
    }, []);

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
          console.log("Unauthorized access");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchAdmins();
    fetchUserData();
  }, [fetchAdmins]);

  const handleEdit = async (adminId) => {
    await fetchAdminDetails(adminId);
    setIsModalOpen(true);
  };

  const openDeleteModal = (adminId) => {
    setAdminToDelete(adminId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAdminToDelete(null);
  };

  const handleDelete = useCallback(async () => {
    if (!adminToDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/delete/${adminToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update state after successful deletion
      setAdmins(admins.filter(admin => admin._id !== adminToDelete));
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      fetchAdmins(); // Refresh admins list
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError(error.message);
    }
  }, [fetchAdmins, admins, adminToDelete]);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    try {
      console.log("Editing admin:", editingAdmin);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/edit/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingAdmin)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsModalOpen(false);
      fetchAdmins() 
      console.log("Admin updated successfully");
    } catch (error) {;
      console.error("Error updating admin:", error);
      setError(error.message);
    }
  }, [editingAdmin, fetchAdmins]);

  let isSuperAdmin = false;
  let role = profile?.admin?.role;
    if(profile){
     isSuperAdmin = role === 'superadmin';
    }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl shadow-xl">
  <h2 className="text-4xl font-bold text-orange-600 mb-8">All Admins</h2>
  <div className="overflow-x-auto rounded-2xl shadow-lg">
    <table className="w-full bg-white">
      <thead>
        <tr className="bg-orange-100">
          <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">
            Username
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              {isSuperAdmin && (
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
          {admins.map((admin) => (
          <tr key={admin._id} className="hover:bg-orange-50 transition-colors duration-200">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <FiUser className="mr-3 text-orange-500" />
                <div className="text-sm font-medium text-gray-900">{admin.username}</div>
              </div>
            </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-400" />
                    <div className="text-sm leading-5 font-medium text-gray-900">{admin.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                  <div className="flex items-center">
                    <FiUserCheck className="mr-2 text-gray-400" />
                    <div className="text-sm leading-5 text-gray-900">{admin.role}</div>
                  </div>
                </td>
                {isSuperAdmin && (
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                    <button onClick={() => handleEdit(admin._id)} className="text-blue-600 hover:text-blue-900 mr-2">
                      <FiEdit />
                    </button>
                    <button onClick={() => openDeleteModal(admin._id)} className="text-red-600 hover:text-red-900">
                      <FiTrash2 />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
             {editingAdmin ? (
               <form onSubmit={handleSave}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={editingAdmin.username}
                        onChange={(e) => setEditingAdmin({...editingAdmin, username: e.target.value})}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        readOnly={true}
                        value={editingAdmin.email}
                        onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})}
                        className="cursor-not-allowed shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        Role
                      </label>
                      <select
                        id="role"
                        value={editingAdmin.role}
                        onChange={(e) => setEditingAdmin({...editingAdmin, role: e.target.value})}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                      Save
                    </button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
                  ) : (
                    
                      <div className="p-4">Loading admin details...</div>
                 
                    
                  )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <FiAlertTriangle size={48} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete this admin? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEmployersSection;
