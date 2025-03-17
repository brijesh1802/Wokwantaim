// //apply+application
// import React,{useState,useEffect} from "react";

// const application = [
//   {
//     company: "NiYO Solutions",
//     profile: "Software Development Intern",
//     appliedOn: "23 Dec '24",
//     applicants: 3758,
//     status: "Not selected",
//   },
//   {
//     company: "NiYO Solutions",
//     profile: "Software Development Intern",
//     appliedOn: "23 Dec '24",
//     applicants: 3758,
//     status: "Selected",
//   },
//   {
//     company: "OSCODE SOLUTION",
//     profile: "Front End Developer Intern",
//     appliedOn: "23 Dec '24",
//     applicants: 114,
//     status: "Response unlikely",
//   },
//   {
//     company: "Eduminatti",
//     profile: "Web Development Intern",
//     appliedOn: "23 Dec '24",
//     applicants: 1860,
//     status: "Not selected",
//   },
//   {
//     company: "BharatX",
//     profile: "Backend Development Intern",
//     appliedOn: "23 Dec '24",
//     applicants: 2519,
//     status: "Not selected",
//   },
//   {
//     company: "OYO Rooms",
//     profile: "Talent Acquisition Intern",
//     appliedOn: "22 Dec '24",
//     applicants: 781,
//     status: "Response unlikely",
//   },
//   {
//     company: "OYO Rooms",
//     profile: "Talent Acquisition Intern",
//     appliedOn: "22 Dec '24",
//     applicants: 781,
//     status: "Response unlikely",
//   },
//   {
//     company: "OYO Rooms",
//     profile: "Talent Acquisition Intern",
//     appliedOn: "22 Dec '24",
//     applicants: 781,
//     status: "Response unlikely",
//   },
//   {
//     company: "OYO Rooms",
//     profile: "Talent Acquisition Intern",
//     appliedOn: "22 Dec '24",
//     applicants: 781,
//     status: "Response unlikely",
//   },
// ];

// const getStatusStyle = (status) => {
//   switch (status) {
//     case "Not selected":
//       return "bg-red-100 text-red-700 border border-red-400";
//     case "pending":
//       return "bg-yellow-100 text-yellow-700 border border-yellow-400";
//     case "Selected":
//       return "bg-green-100 text-green-700 border border-green-400";
//     default:
//       return "bg-gray-100 text-gray-700 border border-gray-400";
//   }
// };

// const JobApplications = () => {

//   const [applications, setApplications] = useState([]);
//   useEffect(() => {
//     const fetchUserApplications = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/applications/myApplications`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch user applications");
//         }

//         const data = await response.json();
//         setApplications(data);
//       } catch (error) {
//         console.error("Error fetching user applications:", error);
//       }
//     };

//     fetchUserApplications();
//   }, []);

//   useEffect(()=>{
//     console.log('applications : ',applications)
//   },[applications])

//   return (
//     <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//         My Applications
//       </h2>

//       {/* Table for Larger Screens */}
//       <div className="hidden md:block">
//         <table className="w-full text-sm text-left border-collapse">
//           <thead className="bg-gray-200 text-gray-800 uppercase">
//             <tr>
//               <th className="p-4 text-left">Company</th>
//               <th className="p-4 text-left">Profile</th>
//               <th className="p-4 text-left">Applied On</th>
//               <th className="p-4 text-left">Applicants</th>
//               <th className="p-4 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y">
//             {applications.map((app, index) => (
//               <tr
//                 key={index}
//                 className="hover:bg-gray-100 transition duration-200"
//               >
//                 <td className="p-4">{app.companyName}</td>
//                 <td className="p-4">{app.jobName}</td>
//                 <td className="p-4">{new Date(app.dateApplied).toLocaleDateString()}</td>
//                 <td className="p-4">100</td>
//                 <td className="p-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
//                       app.status
//                     )}`}
//                   >
//                     {app.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Stacked Layout for Small Screens */}
//       <div className="md:hidden space-y-4">
//         {applications.map((app, index) => (
//           <div
//             key={index}
//             className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
//           >
//             <h3 className="text-lg font-semibold text-gray-700">
//               {app.company}
//             </h3>
//             <p className="text-sm text-gray-600">
//               <span className="font-semibold">Profile:</span> {app.jobId}
//             </p>
//             <p className="text-sm text-gray-500">
//               <span className="font-semibold">Applied On:</span> {new Date(app.dateApplied).toLocaleDateString()}
//             </p>
//             <p className="text-sm text-gray-500">
//               <span className="font-semibold">Applicants:</span>{" "}
//               100
//             </p>
//             <span
//               className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
//                 app.status
//               )}`}
//             >
//               {app.status}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default JobApplications;

//apply+application
import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import { ChevronLeft } from "lucide-react";

const getStatusStyle = (status) => {
  switch (status) {
    case "Not selected":
      return "bg-red-100 text-red-700 border border-red-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-600";
    case "Selected":
      return "bg-green-100 text-green-700 border border-green-600";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-600";
  }
};

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/applications/myApplications`,
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

    fetchUserApplications();
  }, []);

  const navigate = useNavigate();
  const handleNavClick=()=>{
    navigate('/joblist')
  }

  const handleJobClick = (jobId) => {
    console.log('job navigation-jobId ',jobId)
    navigate('/jobdetail', { state: { jobId } });
  };
  
  useEffect(() => {
    console.log("applications : ", applications);
  }, [applications]);

  

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-md rounded-lg cursor-pointer">
      <div className="flex">
        <p className="hover:text-orange-900 text-orange-500 cursor-pointer font-sans"
        onClick={handleNavClick}><ChevronLeft size={32}/></p>
        <h2 className="text-2xl font-semibold text-orange-500 font-sans mb-6">
          My Applications
        </h2>
      </div>
      {applications.length === 0 ? 
      (<div className="w-full h-28 flex items-center justify-center my-10">You haven't applied to any jobs yet. Start applying now!</div>):
  (<>
    {/* Table for Larger Screens */}
    
      <div className="hidden md:block">
        <table className="w-full text-sm text-left border-collapse mb-10">
          <thead className="bg-gray-200 text-gray-800 uppercase">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Profile</th>
              <th className="p-4 text-left">Applied On</th>
              <th className="p-4 text-left">Applicants</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications.map((app, index) => (
              <tr
                key={index}
                onClick={()=>handleJobClick(app.jobId)}
                className="hover:bg-gray-100 hover:scale-[1.01] transition duration-200"
              >
                <td className="p-4">{app.companyName}</td>
                <td className="p-4">{app.jobName}</td>
                <td className="p-4">
                  {new Date(app.dateApplied).toLocaleDateString()}
                </td>
                <td className="p-4">100</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked Layout for Small Screens */}
      <div className="md:hidden space-y-4 mb-10 mt-2">
        {applications.map((app, index) => (
          <div
            key={index}
            onClick={()=>{handleJobClick(app.jobId)
            }}
            className="p-4 border bg-gray-50 border-gray-200 rounded-lg shadow-sm py-6  hover:bg-gray-100 hover:scale-[1.01] transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
            <h3 className="text-lg mb-1 font-bold">
              {app.companyName}
            </h3>
            <p className="text-sm text-gray-800">
              <span className="font-bold">Profile:</span> {app.jobName}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-bold">Applied On:</span>{" "}
              {new Date(app.dateApplied).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-bold">Applicants:</span> 100
            </p>
            </div>
            <span
              className={`inline-block mt-2 h-8 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                app.status
              )}`}
            >
              {app.status}
            </span>
            </div>
          </div>
        ))}
      </div>
</>)}
    </div>
  );
};

export default JobApplications;
