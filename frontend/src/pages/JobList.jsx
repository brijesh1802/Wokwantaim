import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";

const JobList = () => {
  

  const countries = ["India", "USA", "Canada", "UK"]; // Example country data
  const jobTypes = ["Full Time", "Part Time", "Contract"]; // Example job type data

  const navigate = useNavigate();

  

  // console.log(jobs)

  const handleClick = (jobs) => {
    navigate("/jobdetail", { state: { jobs } });
  };
  const [jobs, setJobs] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [jobRole,setJobRole]=useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  useEffect(() => {
    const industries = jobs.map((job) => job.industry);
    const jobRole = jobs.map((job) => job.title);
    const uniqueIndustriesSet = new Set(industries);
    const uniqueJobRoleSet = new Set(jobRole);
    setIndustry(Array.from(uniqueIndustriesSet));
    setJobRole(Array.from(uniqueJobRoleSet));
  });
  
  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
        <Banner />
        <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
          <div className="flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
            <input
              className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
              placeholder="Job Title"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
              defaultValue=""
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
              defaultValue=""
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <option value="" disabled>
                Select Job Type
              </option>
              {jobTypes.map((jobtype, index) => (
                <option key={index} value={jobtype}>
                  {jobtype}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex justify-center mt-4">
            <button className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600">
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Filter Section */}
        <JobFilter industry={industry} jobRole={jobRole}/>
        {/* Job Results */}
        <JobResults/>
      </div>
    </div>
  );
};

export default JobList;
