
// //message
// import React, { useState, useEffect, useContext } from "react";
// import companyLogo from "../assets/comlogo-1.png";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// import {
//   Building2,
//   MapPin,
//   PersonStanding,
//   Calendar,
//   Briefcase,
//   HandCoins,
//   Loader2,
// } from "lucide-react";
// import Banner from "../components/Banner";
// // import { application } from "express";

// const AlertBox = ({ message, onClose }) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
//       <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
//         <h3 className="text-xl font-bold text-center text-orange-600">
//           {message}
//         </h3>
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const JobDetail = () => {
//   const [loading, setLoading] = useState(false);
//   const [job, setJob] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { userType } = useContext(AuthContext);

//   const jobId = location.state?.jobs;
//   const [message, setMessage] = useState("");
//   const [showMessage, setShowMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [isApplied, setIsApplied] = useState(false);
//   const [showApplied,setShowApplied]=useState(false);
//   const [deadlineDate, setDeadlineDate] = useState(null);

//   useEffect(() => {
//     console.log("message : ", message);
//     console.log("Job ID:", jobId);
//   }, []);

//   const onHandleClick = async () => {
//     setShowApplied(false);

//     if (userType !== "candidate") {
//         setShowAlert(true);
//         setMessage("Login to apply");
//         return;
//     }

//     const currentDate = new Date();
//     if (deadlineDate && currentDate > deadlineDate) {
//         setIsApplied(false);
//         setShowApplied(true);
//         setMessage("Application is closed!");
//         setShowMessage("Deadline for the application exceeded");
//         return;
//     }

//     setLoading(true);
//     try {
//         const token = localStorage.getItem("authToken");

//         // 1. Check if the candidate has already applied for this job
//         const checkResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/applications/apply/${jobId}`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         const existingApplications = await checkResponse.json();

//         if (checkResponse.ok && existingApplications.length > 0) {
//             setIsApplied(true);
//             setShowApplied(true);
//             setMessage("You have already applied for this job");
//             setShowMessage("Your application is already in progress!");
//             setLoading(false);
//             return;
//         }
        
//         // 2. If no existing application, proceed with applying
//         const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/applications/apply/${jobId}`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         const result = await response.json();

//         if (response.ok) {
//             setIsApplied(true);
//             setShowApplied(true);
//             setMessage("Application Submitted");
//             setShowMessage("Your application has been successfully submitted!");
//         } else {
//             setIsApplied(false);
//             setShowApplied(true);
//             setShowAlert(true);
//             setMessage(result.message || "Failed to apply");
//         }
//     } catch (error) {
//         console.error("Error applying for job:", error);
//         setIsApplied(false);
//         setShowApplied(false);
//         setShowAlert(true);
//         setMessage("An error occurred. Please try again.");
//     } finally {
//         setLoading(false);
//     }
// };


//   // Close the alert box
//   const closeAlert = () => {
//     setShowAlert(false);
//   };

//   useEffect(() => {
//     // Fetch job details based on the jobId
//     fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/${jobId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setJob(data);
//         setDeadlineDate(new Date(data.applicationDeadline));
//       })
//       .catch((error) => console.error("Error fetching job details:", error));
//   }, [jobId, navigate]);

//   if (!job) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {/* Banner Section */}
//       <Banner />

//       <div className="px-4 py-8 lg:mx-8">
//         <div className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
//           {/* Job Title & Company Info */}
//           <div className="flex items-center">
//             <div
//               className="flex-shrink-0 rounded-lg bg-slate-400"
//               style={{
//                 backgroundImage: `url(${job.companyLogo || companyLogo})`,
//                 backgroundPosition: "center",
//                 backgroundSize: "cover",
//                 height: "80px",
//                 width: "80px",
//               }}
//             ></div>
//             <div className="ml-6">
//               <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
//               <p className="text-xl font-medium text-gray-600">{job.company}</p>
//             </div>
//           </div>

//           {/* Job Information */}
//           <div className="mt-6">
//             <div className="flex items-center gap-4 text-lg text-gray-600">
//               <p className="flex items-center">
//                 <MapPin className="text-orange-500" />
//                 <span className="ml-1">{job.location}</span>
//               </p>
//               <p className="text-gray-600">| {job.experienceLevel}</p>
//               <p className="text-gray-600">| {job.jobType}</p>
//             </div>
//             <div className="flex gap-4 mt-3 text-xl font-medium">
//               <p className="text-green-600">
//                 ₹{job.salary.toLocaleString()} PM
//               </p>
//             </div>

//             {/* Job Description */}
//             <div className="mt-8">
//               <h3 className="text-xl font-bold text-gray-800">
//                 Job Description
//               </h3>
//               <p className="mt-2 text-gray-700">{job.description}</p>
//             </div>

//             {/* Requirements */}
//             <div className="mt-8">
//               <h3 className="text-xl font-bold text-gray-800">Requirements</h3>
//               <ul className="pl-6 mt-2 text-gray-700 list-disc">
//                 {job.requirements.map((resp, index) => (
//                   <li key={index} className="mt-2">
//                     {resp}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Skills */}
//             <div className="mt-8">
//               <h3 className="text-xl font-bold text-gray-800">Skills</h3>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {job.skills.map((skill, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 text-xs text-orange-700 bg-orange-100 rounded-full"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Additional Details */}
//             <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
//               <div>
//                 <div className="flex items-center gap-2 text-lg text-gray-600">
//                   <Calendar className="text-orange-500" />
//                   <span>
//                     Posted on:{" "}
//                     {new Date(job.applicationPostedDate).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2 text-lg text-gray-600">
//                   <HandCoins className="text-orange-500" />
//                   <span>Salary: ₹{job.salary.toLocaleString()} PM</span>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2 text-lg text-gray-600">
//                   <PersonStanding className="text-orange-500" />
//                   <span>Experience: {job.experienceLevel}</span>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2 text-lg text-gray-600">
//                   <Building2 className="text-orange-500" />
//                   <span>Industry: {job.industry}</span>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2 text-lg text-gray-600">
//                   <Calendar className="text-orange-500" />
//                   <span>
//                     Application Deadline:{" "}
//                     {new Date(job.applicationDeadline).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Apply Button */}
//           <div className="flex justify-center mt-8">
//             <button
//               onClick={onHandleClick}
//               className="px-8 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600"
//               disabled={loading}
//             >
//               <span className="absolute inset-0 bg-black translate-y-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>
//               <span className="relative z-10 flex items-center gap-2">
//                 {loading ? <Loader2 className="animate-spin" /> : "Apply Now"}
//               </span>
//             </button>
//           </div>
//           {showApplied && (
//             <div className="mt-6 flex items-center justify-center">
//             <div className={`w-full max-w-md p-5 ${isApplied?'bg-green-50 border border-green-400':'bg-red-100 border border-red-400'}  shadow-lg rounded-lg`}>
//               <div className="flex items-center gap-3">
//                 {isApplied && <svg
//                   className="w-8 h-8 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M5 13l4 4L19 7"
//                   ></path>
//                   </svg>
//                 }
//                 <h3 className={`text-lg font-semibold ${isApplied?'text-green-700':'text-red-700'} `}>
//                   {message}
//                 </h3>
//               </div>
//               <p className="mt-2 text-gray-700">
//                 {showMessage}
//               </p>
//             </div>
//           </div>
//           )}
            
        
//         </div>
//       </div>
//       {showAlert && <AlertBox message={message} onClose={closeAlert} />}
//     </div>
//   );
// };

// export default JobDetail;



//message
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Building2, MapPin, PersonStanding, Calendar, Briefcase, HandCoins,ArrowLeft } from "lucide-react";
import Banner from "../components/Banner";
import companyLogo from "../assets/comlogo-1.png";
import { motion } from "framer-motion";

const AlertBox = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-xs max-h-full text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{message}</h3>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Close
      </button>
    </div>
  </div>
);

const JobDetail = () => {
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useContext(AuthContext);
  const jobId = location.state?.jobId;
  const [showAlert, setShowAlert] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const onHandleClick = () => {
    if (userType !== "candidate") {
      setShowAlert(true);
    } else {
      setIsApplied(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/${jobId}`)
      .then((response) => response.json())
      .then((data) => {
        setJob(data);
        setDeadlineDate(new Date(data.applicationDeadline));
      })
      .catch((error) => console.error("Error fetching job details:", error));
  }, [jobId, navigate]);

  if (!job) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Banner />

      <div className="container mx-auto px-4 py-8">

      <motion.button
          onClick={() => navigate('/joblist')}
          className="mb-4 flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-300"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Job List
        </motion.button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div
                className="w-20 h-20 rounded-full bg-white flex-shrink-0"
                style={{
                  backgroundImage: `url(${job.companyLogo || companyLogo})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
              <div>
                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-xl opacity-90">{job.company}</p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6">
            {/* Job Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin size={18} className="mr-2 text-orange-500" />
                <span className="ml-1">{job.location}</span>
              </div>
              <div className="flex items-center">
                <Briefcase size={18} className="mr-2 text-orange-500" />
                <span>{job.experienceLevel}</span>
              </div>
              <div className="flex items-center">
                <HandCoins size={18} className="mr-2 text-orange-500" />
                <span>₹{job.salary.toLocaleString()} PM</span>
              </div>
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-orange-500" />
                <span>{job.jobType}</span>
              </div>
            </div>

            {/* Job Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </section>

            {/* Requirements */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>

            {/* Skills */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-orange-500" />
                <span>Posted: {new Date(job.applicationPostedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-orange-500" />
                <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <PersonStanding size={18} className="mr-2 text-orange-500" />
                <span>Experience: {job.experienceLevel}</span>
              </div>
              <div className="flex items-center">
                <Building2 size={18} className="mr-2 text-orange-500" />
                <span>Industry: {job.industry}</span>
              </div>
            </div>

            {/* Apply Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={onHandleClick}
                className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                Apply Now
              </button>
            </div>
            {isApplied && (
              <div className="mt-4 text-center text-green-600 font-semibold bg-green-100 p-3 rounded-lg">
                You have successfully applied for this job!
              </div>
            )}
          </div>
        </div>
      </div>
      {showAlert && <AlertBox message="Please Login to Apply for the Job" onClose={closeAlert} />}
    </div>
  );
};

export default JobDetail;
