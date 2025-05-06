// import React, { useState ,useEffect} from 'react';
// import { motion } from 'framer-motion';
// import { FiUser, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiEye } from 'react-icons/fi';


// const ApplicationsSection = () => {
//   const [applications, setApplications] = useState([]);
//   useEffect(() => {
//       const fetchApplications = async () => {
//         try {
//           const token = localStorage.getItem("adminToken");
//           const response = await fetch(
//             `${import.meta.env.VITE_BASE_URL}/api/v1/applications/getAllApplications`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
  
//           if (!response.ok) {
//             throw new Error("Failed to fetch user applications");
//           }
  
//           const data = await response.json();


//           setApplications(data);
//         } catch (error) {
//           console.error("Error fetching user applications:", error);
//         }
//       };
  
//       fetchApplications();
//     }, []);


//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-white p-8 rounded-2xl shadow-lg"
//     >
//       <h2 className="text-3xl font-bold text-orange-600 mb-8">
//         Job Applications
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-orange-100">
//               <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
//                 Applicant
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
//                 Job
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
//                 Applied On
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
//                 Status
//               </th>
//               <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.map((application, index) => (
//               <motion.tr
//                 key={application.id || `app-${index}`}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="hover:bg-orange-50 transition-colors duration-200"
//               >
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <FiUser className="text-orange-500 mr-3" />
//                     <span className="text-sm font-medium text-gray-800">
//                       {application.name}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <FiBriefcase className="text-orange-500 mr-3" />
//                     <span className="text-sm text-gray-600">
//                       {application.jobName}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <FiCalendar className="text-orange-500 mr-3" />
//                     <span className="text-sm text-gray-600">
//                       {new Date(application.dateApplied).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${
//                       application.status === "Pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : application.status === "Reviewed"
//                         ? "bg-blue-100 text-blue-800"
//                         : "bg-green-100 text-green-800"
//                     }`}
//                   >
//                     {application.status === "Pending" ? (
//                       <FiClock className="mr-1 text-yellow-800" />
//                     ) : application.status === "Reviewed" ? (
//                       <FiEye className="mr-1 text-blue-800" />
//                     ) : (
//                       <FiCheckCircle className="mr-1 text-green-800" />
//                     )}
//                     {application.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <button className="text-orange-500 hover:text-orange-700 transition-colors duration-200">
//                     View Details
//                   </button>
//                 </td>
//               </motion.tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// export default ApplicationsSection

import React, { useState ,useEffect} from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBriefcase, FiCalendar, FiCheckCircle, FiClock, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
const ApplicationSection = () => {
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
      setLoading(true);
      const fetchApplications = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/api/v1/applications/getApplications`,
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
        const token = localStorage.getItem("authToken");
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
        console.log("updatedApp",updatedApp);
        setApplications((prevApps) =>
          prevApps.map((app) =>
            
            app._id === editingApplication._id ?{...app, ...updatedApp.application} : app
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
        const token = localStorage.getItem("authToken");
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
                      <div className='font-bold'>{application.companyName}</div>
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
                        :application.status === "accepted"? "bg-green-100 text-green-800" :"bg-red-100 text-red-800"
                    }`}
                  >
                    {application.status === "pending" ? (
                      <FiClock className="mr-1 text-yellow-800" />
                    ) : application.status === "interview" ? (
                      <FiEye className="mr-1 text-blue-800" />
                    ) : (
                      <FiCheckCircle className={`mr-1${
                        application.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "interview"
                          ? "bg-blue-100 text-blue-800"
                          :application.status === "accepted"? "bg-green-100 text-green-800" :"bg-red-100 text-red-800"
                      }`} />)}
                    {application.status }
                  </span>
                </td>
                <td className="px-6 py-8 flex text-orange-500 gap-3">
                  <button onClick={()=>handleEdit(application)}><FiEdit size={22} className='hover:scale-110 hover:text-orange-600 transition-all'/></button>
                  <button onClick={() => handleDelete(application._id)}><FiTrash2 size={24} className='hover:scale-110 hover:text-orange-600 transition-all'/></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    {/* Edit Modal */}
    {editingApplication && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setEditingApplication(null)}>
          <div className="bg-white p-6 rounded-lg shadow-md ml-40 w-2/5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Edit Application Status</h2>
            <select defaultValue={newStatus} onChange={(e) => setNewStatus(e.target.value)}  className='w-full border-2 p-2 mt-4 mb-2' >
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <div className="flex justify-end mt-4">
              <button onClick={handleSaveEdit} className="mr-2 bg-blue-500 text-white px-2 py-2 rounded">Save</button>
              <button onClick={() => setEditingApplication(null)} className="bg-gray-500 text-white px-2 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {isDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md ml-40 w-2/4  ">
            <div className='flex gap-2 items-baseline'>
            {/* <FiAlertTriangle size={28} className='text-red-800'/> */}
            <h2 className="text-2xl text-orange-600 font-bold mb-1">Confirm deletion</h2>
            </div>
            <p className='text-sm font-light'>Are you sure you want to continue?</p>
            <div className="flex justify-end mt-6">
              <button onClick={()=>deleteApplication(applicationToDelete)} className="mr-2 bg-blue-500 text-white px-3 py-2 rounded ">Yes, continue</button>
              <button onClick={()=>setDelete(false)} className="bg-gray-500 text-white px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ApplicationSection

