// //message
// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { Building2, MapPin, PersonStanding, Calendar, Briefcase, HandCoins,ArrowLeft } from "lucide-react";
// import Banner from "../components/Banner";
// import companyLogo from "../assets/comlogo-1.png";
// import { motion } from "framer-motion";

// const AlertBox = ({ message, onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//     <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-xs max-h-full text-center">
//       <h3 className="text-xl font-bold text-gray-900 mb-4">{message}</h3>
//       <button
//         onClick={onClose}
//         className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// );

// const JobDetail = () => {
//   const [loading, setLoading] = useState(false);
//   const [job, setJob] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { userType } = useContext(AuthContext);
//   const jobId = location.state?.jobId;
//   const [showAlert, setShowAlert] = useState(false);
//   const [isApplied, setIsApplied] = useState(false);

//   const onHandleClick = () => {
//     if (userType !== "candidate") {
//       setShowAlert(true);
//     } else {
//       setIsApplied(true);
//     }
//   };

//   const closeAlert = () => {
//     setShowAlert(false);
//   };

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/${jobId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setJob(data);
//         setDeadlineDate(new Date(data.applicationDeadline));
//       })
//       .catch((error) => console.error("Error fetching job details:", error));
//   }, [jobId, navigate]);

//   if (!job) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Banner />

//       <div className="container mx-auto px-4 py-8">

//       <motion.button
//           onClick={() => navigate('/joblist')}
//           className="mb-4 flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-300"
//           whileHover={{ x: -5 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <ArrowLeft className="mr-2" size={20} />
//           Back to Job List
//         </motion.button>

//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
//             <div className="flex items-center space-x-4">
//               <div
//                 className="w-20 h-20 rounded-full bg-white flex-shrink-0"
//                 style={{
//                   backgroundImage: `url(${job.companyLogo || companyLogo})`,
//                   backgroundPosition: 'center',
//                   backgroundSize: 'cover',
//                 }}
//               />
//               <div>
//                 <h1 className="text-3xl font-bold">{job.title}</h1>
//                 <p className="text-xl opacity-90">{job.company}</p>
//               </div>
//             </div>
//           </div>

//           {/* Job Details */}
//           <div className="p-6">
//             {/* Job Information */}
//             <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
//               <div className="flex items-center">
//                 <MapPin size={18} className="mr-2 text-orange-500" />
//                 <span className="ml-1">{job.location}</span>
//               </div>
//               <div className="flex items-center">
//                 <Briefcase size={18} className="mr-2 text-orange-500" />
//                 <span>{job.experienceLevel}</span>
//               </div>
//               <div className="flex items-center">
//                 <HandCoins size={18} className="mr-2 text-orange-500" />
//                 <span>₹{job.salary.toLocaleString()} PM</span>
//               </div>
//               <div className="flex items-center">
//                 <Calendar size={18} className="mr-2 text-orange-500" />
//                 <span>{job.jobType}</span>
//               </div>
//             </div>

//             {/* Job Description */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
//               <p className="text-gray-700 leading-relaxed">{job.description}</p>
//             </section>

//             {/* Requirements */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
//               <ul className="list-disc pl-5 text-gray-700 space-y-2">
//                 {job.requirements.map((req, index) => (
//                   <li key={index}>{req}</li>
//                 ))}
//               </ul>
//             </section>

//             {/* Skills */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
//               <div className="flex flex-wrap gap-2">
//                 {job.skills.map((skill, index) => (
//                   <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </section>

//             {/* Additional Details */}
//             <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
//               <div className="flex items-center">
//                 <Calendar size={18} className="mr-2 text-orange-500" />
//                 <span>Posted: {new Date(job.applicationPostedDate).toLocaleDateString()}</span>
//               </div>
//               <div className="flex items-center">
//                 <Calendar size={18} className="mr-2 text-orange-500" />
//                 <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
//               </div>
//               <div className="flex items-center">
//                 <PersonStanding size={18} className="mr-2 text-orange-500" />
//                 <span>Experience: {job.experienceLevel}</span>
//               </div>
//               <div className="flex items-center">
//                 <Building2 size={18} className="mr-2 text-orange-500" />
//                 <span>Industry: {job.industry}</span>
//               </div>
//             </div>

//             {/* Apply Button */}
//             <div className="flex justify-center mt-8">
//               <button
//                 onClick={onHandleClick}
//                 className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//               >
//                 Apply Now
//               </button>
//             </div>
//             {isApplied && (
//               <div className="mt-4 text-center text-green-600 font-semibold bg-green-100 p-3 rounded-lg">
//                 You have successfully applied for this job!
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       {showAlert && <AlertBox message="Please Login to Apply for the Job" onClose={closeAlert} />}
//     </div>
//   );
// };

// export default JobDetail;



// //message
// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { Building2, MapPin, PersonStanding, Calendar, Briefcase, HandCoins,ArrowLeft } from "lucide-react";
// import Banner from "../components/Banner";
// import companyLogo from "../assets/comlogo-1.png";
// import { motion } from "framer-motion";

// const AlertBox = ({ message, onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//     <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-xs max-h-full text-center">
//       <h3 className="text-xl font-bold text-gray-900 mb-4">{message}</h3>
//       <button
//         onClick={onClose}
//         className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105"
//       >
//         Close
//       </button>
//     </div>
//   </div>
// );

// const JobDetail = () => {
//   const [loading, setLoading] = useState(false);
//   const [job, setJob] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { userType } = useContext(AuthContext);
//   const jobId = location.state?.jobId;
//   const [message, setMessage] = useState("");
//   const [showMessage, setShowMessage] = useState("");
//   const [showAlert, setShowAlert] = useState(false);
//   const [isApplied, setIsApplied] = useState(false);
//   const [showApplied,setShowApplied]=useState(false);
//   const [deadlineDate, setDeadlineDate] = useState(null);


//   const onHandleClick = async () => {
//     setShowApplied(false);
//     if (userType !== "candidate") {
//         setShowAlert(true);
//         setMessage("Login to apply");
//         return;
//     }

//     const currentDate = new Date();
//     if (deadlineDate && currentDate > deadlineDate) {
//         setIsApplied(true);
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
//             // setIsApplied(false);
//             // setShowApplied(true);
//             setShowAlert(true);
//             setMessage(result.message || "Failed to apply");
//         }
//     } catch (error) {
//         console.error("Error applying for job:", error);
//         setShowAlert(true);
//         setMessage("An error occurred. Please try again.");
//     } finally {
//         setLoading(false);
//     }
// };


//   const closeAlert = () => {
//     setShowAlert(false);
//   };

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/${jobId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setJob(data);
//         setDeadlineDate(new Date(data.applicationDeadline));
//       })
//       .catch((error) => console.error("Error fetching job details:", error));
//   }, [jobId, navigate]);

//   if (!job) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       <Banner />

//       <div className="container mx-auto px-4 py-8">

//       <motion.button
//           onClick={() => navigate('/joblist')}
//           className="mb-4 flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-300"
//           whileHover={{ x: -5 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <ArrowLeft className="mr-2" size={20} />
//           Back to Job List
//         </motion.button>

//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
//             <div className="flex items-center space-x-4">
//               <div
//                 className="w-20 h-20 rounded-full bg-white flex-shrink-0"
//                 style={{
//                   backgroundImage: `url(${job.companyLogo || companyLogo})`,
//                   backgroundPosition: 'center',
//                   backgroundSize: 'cover',
//                 }}
//               />
//               <div>
//                 <h1 className="text-3xl font-bold">{job.title}</h1>
//                 <p className="text-xl opacity-90">{job.company}</p>
//               </div>
//             </div>
//           </div>

//           {/* Job Details */}
//           <div className="p-6">
//             {/* Job Information */}
//             <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
//               <div className="flex items-center">
//                 <MapPin size={18} className="mr-2 text-orange-500" />
//                 <span className="ml-1">{job.location}</span>
//               </div>
//               <div className="flex items-center">
//                 <Briefcase size={18} className="mr-2 text-orange-500" />
//                 <span>{job.experienceLevel}</span>
//               </div>
//               <div className="flex items-center">
//                 <HandCoins size={18} className="mr-2 text-orange-500" />
//                 <span>₹{job.salary.toLocaleString()} PM</span>
//               </div>
//               <div className="flex items-center">
//                 <Calendar size={18} className="mr-2 text-orange-500" />
//                 <span>{job.jobType}</span>
//               </div>
//             </div>

//             {/* Job Description */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
//               <p className="text-gray-700 leading-relaxed">{job.description}</p>
//             </section>

//             {/* Requirements */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
//               <ul className="list-disc pl-5 text-gray-700 space-y-2">
//                 {job.requirements.map((req, index) => (
//                   <li key={index}>{req}</li>
//                 ))}
//               </ul>
//             </section>

//             {/* Skills */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
//               <div className="flex flex-wrap gap-2">
//                 {job.skills.map((skill, index) => (
//                   <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </section>

//             {/* Additional Details */}
//             <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
//               <div className="flex items-center">
//                 <Calendar size={18} className="mr-2 text-orange-500" />
//                 <span>Posted: {new Date(job.applicationPostedDate).toLocaleDateString()}</span>
//               </div>
//               <div className="flex items-center">
//                 <Calendar size={18} className="mr-2 text-orange-500" />
//                 <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
//               </div>
//               <div className="flex items-center">
//                 <PersonStanding size={18} className="mr-2 text-orange-500" />
//                 <span>Experience: {job.experienceLevel}</span>
//               </div>
//               <div className="flex items-center">
//                 <Building2 size={18} className="mr-2 text-orange-500" />
//                 <span>Industry: {job.industry}</span>
//               </div>
//             </div>

//             {/* Apply Button */}
//             <div className="flex justify-center mt-8">
//               <button
//                 onClick={onHandleClick}
//                 className="px-8 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
//               >
//                 Apply Now
//               </button>
//             </div>
//             {showApplied && isApplied && (
//               <div className="mt-4 text-center text-green-600 font-semibold bg-green-100 p-3 rounded-lg">
//                 {message}
//               </div>
//             )}
//           </div>
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
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplied,setShowApplied]=useState(false);
  const [deadlineDate, setDeadlineDate] = useState(null);


  const onHandleClick = async () => {
    setShowApplied(false);
    if (userType !== "candidate") {
        setShowAlert(true);
        setMessage("Login to apply");
        return;
    }

    const currentDate = new Date();
    if (deadlineDate && currentDate > deadlineDate) {
        setShowApplied(true);
        setMessage("Application is closed!");
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem("authToken");
        const checkResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/applications/apply/${jobId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const existingApplications = await checkResponse.json();

        if (checkResponse.ok && existingApplications.length > 0) {
            setMessage("You have already applied for this job");
            setLoading(false);
            return;
        }
        
        // 2. If no existing application, proceed with applying
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/applications/apply/${jobId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (response.ok) {
            setIsApplied(true);
            setShowApplied(true);
            setMessage("Application Submitted");
        } else {
            setShowAlert(true);
            setMessage(result.message || "Failed to apply");
        }
    } catch (error) {
        console.error("Error applying for job:", error);
        setShowAlert(true);
        setMessage("An error occurred. Please try again.");
    } finally {
        setLoading(false);
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
            {showApplied &&(
              <div className={`mt-4 text-center ${isApplied?'text-green-600 bg-green-100':'text-red-600 bg-red-100'} font-semibold  p-3 rounded-lg`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      {showAlert && <AlertBox message={message} onClose={closeAlert} />}
    </div>
  );
};

export default JobDetail;