import React, { useState, useEffect, useContext } from "react";
import banner from "../assets/banner1.png";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import Banner from "../components/Banner";
import JobDetailComponent from "../components/JobDetailComponent";

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
      <Banner />

      <div className="px-4 py-8 lg:mx-8">
        <JobDetailComponent job={job} onHandleClick={onHandleClick} isApplied={isApplied}/>
      </div>
      {showAlert && (
        <AlertBox
          message="Please Login to Apply for the Job"
          onClose={closeAlert}
        />
      )}
    </div>
  );
};

export default JobDetail;
