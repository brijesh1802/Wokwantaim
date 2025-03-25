import React, { useState ,useEffect} from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiEye } from 'react-icons/fi';


const ApplicationsSection = () => {
  const [applications, setApplications] = useState([]);
  useEffect(() => {
      const fetchApplications = async () => {
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
      };
  
      fetchApplications();
    }, []);


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
                      {application.jobName}
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
                      application.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : application.status === "Reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {application.status === "Pending" ? (
                      <FiClock className="mr-1 text-yellow-800" />
                    ) : application.status === "Reviewed" ? (
                      <FiEye className="mr-1 text-blue-800" />
                    ) : (
                      <FiCheckCircle className="mr-1 text-green-800" />
                    )}
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-orange-500 hover:text-orange-700 transition-colors duration-200">
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ApplicationsSection

