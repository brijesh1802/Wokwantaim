
import React, { useState ,useEffect} from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { AlertTriangle } from 'lucide-react';
const ApplicationsSection = () => {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const [isDelete,setDelete]=useState(false);
  const [newStatus, setNewStatus] = useState("");
   const [loading, setLoading] = useState(true);

  useEffect(()=>{
    console.log("applications",applications);
    
  },[applications])

  useEffect(() => {
      const fetchApplications = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("adminToken");
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/v1/applications/getAllApplications`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (!response.ok) {
            throw new Error("Failed to fetch user applications");
          }
  
          const data = await response.json();


          setApplications(data);
        } catch (error) {
          console.error("Error fetching user applications:", error);
        }
        finally {
          setLoading(false);
        }
      };
  
      fetchApplications();
    }, []);

    const handleEdit = (application) => {
      setEditingApplication(application);
      setNewStatus(application.status);
    };

    useEffect(()=>{
      console.log("status : ",newStatus);
      
    },[newStatus])
  
    const handleSaveEdit = async () => {
      if (!editingApplication) return;
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/applications/editApplication/${editingApplication._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to update application");
        }
  
        const updatedApp = await response.json();
        setApplications((prevApps) =>
          prevApps.map((app) =>
            
            app._id === editingApplication._id ? {...app,...updatedApp.application} : app
          )
        );
        setEditingApplication(null);
      } catch (error) {
        console.error("Error updating application:", error);
      }
    };

    const handleDelete=(applicationId)=>{
      setApplicationToDelete(applicationId);
      setDelete(true);
    }
    const deleteApplication = async (applicationId) => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/applications/deleteApplication/${applicationId}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
    
        if (!response.ok) {
          throw new Error("Failed to delete application");
        }
    
        setApplications((prevApps) => prevApps.filter((app) => app._id !== applicationId));
        setDelete(false);
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    };
    
    if (loading) return <div className="text-center py-10">Loading...</div>;
   

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-bold text-orange-600 mb-8">
        Job Applications
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
                Applicant
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
                Job
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
                Applied On
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => (
              <motion.tr
                key={application.id || `app-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-orange-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FiUser className="text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-800">
                      {application.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FiBriefcase className="text-orange-500 mr-3" />
                    <span className="text-sm text-gray-600">
                      <div className="font-bold">{application.companyName}</div>
                      <div>{application.jobName}</div>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FiCalendar className="text-orange-500 mr-3" />
                    <span className="text-sm text-gray-600">
                      {new Date(application.dateApplied).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${
                      application.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : application.status === "interview"
                        ? "bg-blue-100 text-blue-800"
                        : application.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.status === "pending" ? (
                      <FiClock className="mr-1 text-yellow-800" />
                    ) : application.status === "interview" ? (
                      <FiEye className="mr-1 text-blue-800" />
                    ) : (
                      <FiCheckCircle className="mr-1 text-green-800" />
                    )}
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-8 flex text-orange-500 gap-3">
                  <button onClick={() => handleEdit(application)}>
                    <FiEdit
                      size={22}
                      className="hover:scale-110 hover:text-orange-600 transition-all"
                    />
                  </button>
                  <button onClick={() => handleDelete(application._id)}>
                    <FiTrash2
                      size={24}
                      className="hover:scale-110 hover:text-orange-600 transition-all"
                    />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setEditingApplication(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Edit Application Status
            </h2>

            <label className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>

            <select
              defaultValue={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none px-2 py-2 text-gray-700 bg-white "
            >
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={handleSaveEdit}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl transition duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setEditingApplication(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              {/* Uncomment if using icon */}
              {/* <FiAlertTriangle size={24} className="text-red-600" /> */}
              <h2 className="text-xl font-semibold text-orange-600">
                Confirm Deletion
              </h2>
            </div>

            <p className="text-gray-600 text-sm"></p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-5 rounded-md flex items-start space-x-3">
              <AlertTriangle className="text-yellow-400 w-6 h-6" />
              <div>
                <p className="text-sm text-yellow-700">
                  Are you sure you want to delete this application? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => deleteApplication(applicationToDelete)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition duration-200"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setDelete(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ApplicationsSection

