import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, Briefcase, Clock } from "lucide-react";
import companyLogo from "../assets/comlogo-1.png";

const JobResults = ({ filteredJob }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(""); // Default to empty string or other default sorting
  const [sortedJobs, setSortedJobs] = useState([]);

  const jobsPerPage = 7;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);

  useEffect(() => {
    let sorted = [...filteredJob];
    if (sortOrder === "ascending") {
      sorted.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sortOrder === "descending") {
      sorted.sort((a, b) => b.company.localeCompare(a.company));
    }
    setSortedJobs(sorted);
    setCurrentPage(1);  // Reset to first page when filteredJob or sorting changes
  }, [sortOrder, filteredJob]);

  const handleJobClick = (jobId) => {
    navigate("/jobdetail", { state: { jobId } });
  };



  const JobCard = ({ job }) => {
    const skills = Array.isArray(job.job.skills) ? job.job.skills : [];
  
    return (
      <motion.div
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 ml-2"
        whileHover={{ scale: 1.01 }}
        onClick={() => handleJobClick(job.job.id)}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex-shrink-0"
                style={{
                  backgroundImage: `url(${job.job.companyLogo || companyLogo})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                alt={`${job.job.company} logo`}
              />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  {job.job.company}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{job.job.location}</p>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <span className="text-base sm:text-lg font-bold text-green-600">₹{(job.job.salary / 10000)}K</span>
              <span className="text-xs sm:text-sm text-gray-600">per month</span>
            </div>
          </div>
    
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800">{job.job.title}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase size={14} className="mr-1" />
                {job.job.experienceLevel}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                {job.job.jobType}
              </span>
            </div>
          </div>
    
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 sm:px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  

  return (
    <div className="flex flex-col space-y-6 lg:w-3/4 mt-9 lg:mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 rounded-lg ml-2">
        <p className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing <span className="font-semibold">{indexOfFirstJob + 1}-{Math.min(indexOfLastJob, sortedJobs.length)}</span> of <span className="font-semibold">{sortedJobs.length}</span> Job Results
        </p>
      </div>

      <div className="space-y-4">
        {currentJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-2 p-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-2 bg-orange-100 text-orange-600 rounded-full disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-2 bg-orange-100 text-orange-600 rounded-full disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default JobResults;