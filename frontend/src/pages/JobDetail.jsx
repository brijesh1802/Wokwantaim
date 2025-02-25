
// //message
// import React, { useState, useEffect, useContext } from "react";
// import banner from "../assets/banner1.png";
// import { Link } from "react-router-dom";
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
//   }, [message]);

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
//         const token = localStorage.getItem("token");

//         // 1. Check if the candidate has already applied for this job
//         const checkResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/applications?jobId=${jobId}`, {
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
import { Link } from "react-router-dom";
import companyLogo from "../assets/comlogo-1.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  Building2,
  MapPin,
  PersonStanding,
  Calendar,
  Briefcase,
  HandCoins,
  Loader2,
} from "lucide-react";
import Banner from "../components/Banner";
// import { application } from "express";

const AlertBox = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-center text-orange-600">
          {message}
        </h3>
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const JobDetail = () => {
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useContext(AuthContext);

  const jobId = location.state?.jobs;
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplied,setShowApplied]=useState(false);
  const [deadlineDate, setDeadlineDate] = useState(null);

  useEffect(() => {
    console.log("message : ", message);
  }, [message]);

  const onHandleClick = async () => {
    setShowApplied(false);

    if (userType !== "candidate") {
        setShowAlert(true);
        setMessage("Login to apply");
        return;
    }

    const currentDate = new Date();
    if (deadlineDate && currentDate > deadlineDate) {
        setIsApplied(false);
        setShowApplied(true);
        setMessage("Application is closed!");
        setShowMessage("Deadline for the application exceeded");
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem("authToken");

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
            setShowMessage("Your application has been successfully submitted!");
        } else {
            setIsApplied(false);
            setShowApplied(true);
            setShowAlert(true);
            setMessage(result.message || "Failed to apply");
        }
    } catch (error) {
        console.error("Error applying for job:", error);
        setIsApplied(false);
        setShowApplied(false);
        setShowAlert(true);
        setMessage("An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
};




  // Close the alert box
  const closeAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    // Fetch job details based on the jobId
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/${jobId}`)
      .then((response) => response.json())
      .then((data) => {
        setJob(data);
        setDeadlineDate(new Date(data.applicationDeadline));
      })
      .catch((error) => console.error("Error fetching job details:", error));
  }, [jobId, navigate]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Banner Section */}
      <Banner />

      <div className="px-4 py-8 lg:mx-8">
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
          {/* Job Title & Company Info */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 rounded-lg bg-slate-400"
              style={{
                backgroundImage: `url(${job.companyLogo || companyLogo})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "80px",
                width: "80px",
              }}
            ></div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
              <p className="text-xl font-medium text-gray-600">{job.company}</p>
            </div>
          </div>

          {/* Job Information */}
          <div className="mt-6">
            <div className="flex items-center gap-4 text-lg text-gray-600">
              <p className="flex items-center">
                <MapPin className="text-orange-500" />
                <span className="ml-1">{job.location}</span>
              </p>
              <p className="text-gray-600">| {job.experienceLevel}</p>
              <p className="text-gray-600">| {job.jobType}</p>
            </div>
            <div className="flex gap-4 mt-3 text-xl font-medium">
              <p className="text-green-600">
                ₹{job.salary.toLocaleString()} PM
              </p>
            </div>

            {/* Job Description */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">
                Job Description
              </h3>
              <p className="mt-2 text-gray-700">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Requirements</h3>
              <ul className="pl-6 mt-2 text-gray-700 list-disc">
                {job.requirements.map((resp, index) => (
                  <li key={index} className="mt-2">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs text-orange-700 bg-orange-100 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Calendar className="text-orange-500" />
                  <span>
                    Posted on:{" "}
                    {new Date(job.applicationPostedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <HandCoins className="text-orange-500" />
                  <span>Salary: ₹{job.salary.toLocaleString()} PM</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <PersonStanding className="text-orange-500" />
                  <span>Experience: {job.experienceLevel}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Building2 className="text-orange-500" />
                  <span>Industry: {job.industry}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Calendar className="text-orange-500" />
                  <span>
                    Application Deadline:{" "}
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onHandleClick}
              className="px-8 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600"
              disabled={loading}
            >
              <span className="absolute inset-0 bg-black translate-y-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>
              <span className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : "Apply Now"}
              </span>
            </button>
          </div>
          {showApplied && (
            <div className="mt-6 flex items-center justify-center">
            <div className={`w-full max-w-md p-5 ${isApplied?'bg-green-50 border border-green-400':'bg-red-100 border border-red-400'}  shadow-lg rounded-lg`}>
              <div className="flex items-center gap-3">
                {isApplied && <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                  </svg>
                }
                <h3 className={`text-lg font-semibold ${isApplied?'text-green-700':'text-red-700'} `}>
                  {message}
                </h3>
              </div>
              <p className="mt-2 text-gray-700">
                {showMessage}
              </p>
            </div>
          </div>
          )}
            
        
        </div>
      </div>
      {showAlert && <AlertBox message={message} onClose={closeAlert} />}
    </div>
  );
};

export default JobDetail;
