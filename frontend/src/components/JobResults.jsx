import React from "react";
import { useState, useEffect } from "react";
import companyLogo from "../assets/comlogo-1.png";
import {
    MapPin,
  } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobResults = ({filteredJob}) => {
  const navigate=useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 7;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJob.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJob.length / jobsPerPage);

  const firstJobIndex = indexOfFirstJob + 1; // Adding 1 to make it 1-based index
  const lastJobIndex =
    indexOfLastJob > filteredJob.length ? filteredJob.length : indexOfLastJob;

  console.log(totalPages);

  const handleClick=(jobs)=>{
    navigate("/jobdetail",{state:{jobs}})
  }
  return (
    <div className="flex flex-col mb-10 lg:w-3/4 mt-9 lg:mt-0">
      <div className="flex items-center justify-between mx-4 rounded-md lg:bg-gray-100 lg:h-20">
        <p className="text-sm">
          Showing {firstJobIndex}-{lastJobIndex} of {filteredJob.length} Job Results:
        </p>
        <div>
          <span className="text-sm">Sort By : </span>
          <select className="text-gray-400 bg-transparent">
            <option value="" disabled>
              Select
            </option>
            <option value="ascending">A-Z</option>
            <option value="decending">Z-A</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-full gap-3 py-5 mx-5 mt-3 rounded">
        {filteredJob.map((job, index) => (
          <div
            key={index}
            className="flex items-start justify-between w-full max-w-3xl p-4 mx-4 my-3 transition bg-white shadow-md hover:shadow-lg"
            onClick={() => handleClick(job._id)}
          >
            {/* Job details */}
            <div
              className="flex-shrink-0 rounded-lg bg-slate-400"
              style={{
                backgroundImage: `url(${job.companyLogo || companyLogo})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "60px",
                width: "60px",
              }}
            ></div>

            <div className="flex-1 ml-4">
              {/* Company and Title */}
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-800 cursor-pointer hover:text-orange-500">
                  {job.company}
                </p>
                <p className="text-sm font-medium text-green-600">
                  ₹{job.salary.toLocaleString()} PM
                </p>
              </div>
              <p className="mt-1 text-base font-medium text-gray-700">
                {job.title}
              </p>

              {/* Location, Experience, Job Type */}
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <MapPin className="text-orange-500" />
                  <span className="ml-1">{job.location}</span>
                </p>
                <p className="text-gray-600">| {job.experienceLevel}</p>
                <p className="text-gray-600">| {job.jobType}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mt-2">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full"
                  >
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
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-5">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-l-md"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-100">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-r-md"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobResults;



