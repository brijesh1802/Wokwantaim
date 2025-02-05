import React, { useState, useEffect, useContext } from "react";
import banner from "../assets/banner1.png";
import { Link } from "react-router-dom";
import companyLogo from "../assets/comlogo-1.png";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { House, Building2, MapPin, PersonStanding, Calendar, Briefcase, HandCoins } from "lucide-react";

const AlertBox = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-center text-orange-600">{message}</h3>
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
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useContext(AuthContext);

  const jobId = location.state?.jobs;
  const [showAlert, setShowAlert] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  // Handler for Apply Button click
  const onHandleClick = () => {
    if (userType !== "candidate") {
      setShowAlert(true); // Show alert box if user is not a candidate
    } else {
      setIsApplied(true); // Show "Applied" message if user is a candidate
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
      .then((data) => setJob(data))
      .catch((error) => console.error("Error fetching job details:", error));
  }, [jobId, navigate]);


  if (!job) {
    return <div>Loading...</div>; 
  }
return (
  <div>
    {/* Banner Section */}
    <div
      className="flex flex-col items-center justify-center p-8 mt-6 bg-center bg-cover shadow-lg lg:h-72 min-h-52"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    ></div>

    <div className="px-4 py-8 lg:mx-8">
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
        {/* Job Title & Company Info */}
        <div className="flex items-center">
          <div
            className="flex-shrink-0 rounded-lg bg-slate-400"
            style={{
              backgroundImage: `url(${job.companyLogo || companyLogo})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              height: '80px',
              width: '80px',
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
            <p className="text-green-600">₹{job.salary.toLocaleString()} PM</p>
          </div>

          {/* Job Description */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Job Description</h3>
            <p className="mt-2 text-gray-700">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800">Requirements</h3>
            <ul className="pl-6 mt-2 text-gray-700 list-disc">
              {job.requirements.map((resp, index) => (
                <li key={index} className="mt-2">{resp}</li>
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
                <span>Posted on: {new Date(job.applicationPostedDate).toLocaleDateString()}</span>
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
                <span>Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex justify-center mt-8">
          <button onClick={onHandleClick} className="px-8 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600">
            Apply Now
          </button>
        </div>
        {isApplied && (
            <div className="mt-4 text-xl font-semibold text-center text-green-600">
              You have successfully applied for the job!
            </div>
          )}
      </div>
    </div>
    {showAlert && <AlertBox message="Please Login to Apply for the Job" onClose={closeAlert} />}
  </div>
);
}

export default JobDetail;