import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import companyLogo from "../assets/comlogo-1.png";

const JobResults = ({ filteredJob }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");
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
    setCurrentPage(1);  
  }, [sortOrder, filteredJob]);

  const handleJobClick = (jobId) => {
    navigate("/jobdetail", { state: { jobId } });
  };

  const JobCard = ({ job }) => (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onClick={() => handleJobClick(job._id)}
    >
      <div className="flex items-start space-x-4">
        <div
          className="w-16 h-16 rounded-lg bg-slate-200 flex-shrink-0"
          style={{
            backgroundImage: `url(${job.companyLogo || companyLogo})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-800 hover:text-orange-500 transition-colors">
              {job.company}
            </h3>
            <span className="text-sm font-semibold text-green-600">
              ₹{job.salary.toLocaleString()} PM
            </span>
          </div>
          <p className="mt-1 text-base font-medium text-gray-700">{job.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
            <span className="flex items-center">
              <MapPin size={16} className="text-orange-500 mr-1" />
              {job.location}
            </span>
            <span>| {job.experienceLevel}</span>
            <span>| {job.jobType}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col space-y-6 lg:w-3/4 mt-9 lg:mt-0">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-2 sm:mb-0">
          Showing <span className="font-semibold">{indexOfFirstJob + 1}-{Math.min(indexOfLastJob, sortedJobs.length)}</span> of <span className="font-semibold">{sortedJobs.length}</span> Job Results
        </p>
        {/* <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort By:</span>
          <select
            className="p-2 text-sm text-gray-700 bg-white rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Default</option>
            <option value="ascending">A-Z</option>
            <option value="descending">Z-A</option>
          </select>
        </div> */}
      </div>

      <div className="space-y-4">
        {currentJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
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
