import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";
import { AuthContext } from "../context/AuthContext";

const JobList = () => {
  const { handleJobRoleChange, currentJobRole, jobsInfo, jobRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const [industry, setIndustry] = useState([]);
  const [jobCountry, setCountry] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [filteredJobRole, setFilteredJobRole] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [filteredSearchJob, setFilteredSearchJob] = useState([]);
  const [showDropdown, setShowDropDown] = useState(false);

  const handleClick = (jobsInfo) => {
    navigate("/jobdetail", { state: { jobsInfo } });
  };

  const handleSearchTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (value.trim() === "") {
      setFilteredSearchJob([]);
      setShowDropDown(false);
      return;
    }

    const filtered = jobRole.filter((role) => role.toLowerCase().includes(value.toLowerCase()));
    setFilteredSearchJob(filtered);
    setShowDropDown(filtered.length > 0);
  };

  const handleDropdownSelect = (jobTitle) => {
    setTitle(jobTitle);
    setFilteredSearchJob([]);
    setShowDropDown(false);
  };

  const handleSearchChange = () => {
    const filteredJobs = jobsInfo.filter((data) => {
      const matchTitle = title ? data.job.title.toLowerCase().includes(title.toLowerCase()) : true;
      const matchLocation = location ? data.job.location.toLowerCase().includes(location.toLowerCase()) : true;
      const matchJobType = jobType ? data.job.jobType.toLowerCase().includes(jobType.toLowerCase()) : true;

      return matchTitle && matchLocation && matchJobType;
    });
    setFilteredJobRole(filteredJobs);
  };

  useEffect(() => {
    const industries = jobsInfo.map((job) => job.job.industry);
    const countries = jobsInfo.map((job) => job.job.location);
    const jobtypes = jobsInfo.map((job) => job.job.jobType);

    const uniqueIndustriesSet = new Set(industries);
    const uniqueCountrySet = new Set(countries);
    const uniqueJobTypeSet = new Set(jobtypes);

    setIndustry(Array.from(uniqueIndustriesSet));
    setCountry(Array.from(uniqueCountrySet));
    setJobTypes(Array.from(uniqueJobTypeSet));
  }, [jobsInfo]);

  useEffect(() => {
    const getDaysDifference = (jobDate) => {
      const currentDate = new Date();
      const jobDateObj = new Date(jobDate);
      if (isNaN(jobDateObj)) {
        console.error("Invalid job date:", jobDate);
        return 0;
      }
      const diffTime = currentDate - jobDateObj;
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    setFilteredJobRole(
      jobsInfo.filter((job) => {
        const daysAgo = getDaysDifference(job.job.applicationPostedDate);

        const matchDate =
          !currentJobRole.DatePosted.length ||
          (currentJobRole.DatePosted.includes("Last 24 hours") && daysAgo <= 1) ||
          (currentJobRole.DatePosted.includes("Last Week") && daysAgo <= 7) ||
          (currentJobRole.DatePosted.includes("Last Month") && daysAgo <= 30) ||
          (currentJobRole.DatePosted.includes("Older") && daysAgo > 30);

        const matchIndustry =
          !currentJobRole.Industry.length || currentJobRole.Industry.includes(job.job.industry);

        const matchJobRole =
          !currentJobRole.JobRoles.length || currentJobRole.JobRoles.some((role) =>
            job.job.title.toLowerCase().includes(role.toLowerCase())
          );

        const matchSalary =
          !currentJobRole.Salary.length ||
          currentJobRole.Salary.some((range) => {
            if (range === "₹10,000 - ₹20,000") return job.job.salary >= 10000 && job.job.salary < 20000;
            if (range === "₹20,000 - ₹30,000") return job.job.salary >= 20000 && job.job.salary < 30000;
            if (range === "₹30,000 - ₹50,000") return job.job.salary >= 30000 && job.job.salary <= 50000;
            if (range === "Above ₹50,000") return job.job.salary > 50000;
            return false;
          });

        const matchTitleAndCompany =
          !currentJobRole.TitleAndCompany.length ||
          currentJobRole.TitleAndCompany.some(
            (role) =>
              role.toLowerCase().includes(job.job.title.toLowerCase()) ||
              role.toLowerCase().includes(job.job.company.toLowerCase())
          );

        const matchExperience =
          !currentJobRole.Experience.length ||
          currentJobRole.Experience.some((range) => {
            if (range === "0-2 years")
              return job.job.experienceYearsMin >= 0 && job.job.experienceYearsMax <= 2;
            if (range === "3-5 years")
              return job.job.experienceYearsMin >= 2 && job.job.experienceYearsMax <= 5;
            if (range === "5+ years") return job.job.experienceYearsMax >= 5;
            return false;
          });

        return (
          matchDate &&
          matchIndustry &&
          matchJobRole &&
          matchSalary &&
          matchExperience &&
          matchTitleAndCompany
        );
      })
    );
  }, [currentJobRole, jobsInfo]);


  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
        <Banner />
        <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
          <div className="relative flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
            <input
              className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
              placeholder="Search Job Title"
              value={title}
              onChange={handleSearchTitleChange}
            />
            {showDropdown && (
              <div className="absolute left-0 w-full md:w-1/3 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 top-full mt-1">
                {filteredSearchJob.map((jobTitle, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleDropdownSelect(jobTitle)}
                  >
                    {jobTitle}
                  </div>
                ))}
              </div>
            )}
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
              defaultValue=""
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="" disabled>
                Select Country
              </option>
              {jobCountry.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
              defaultValue=""
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="" disabled>
                Select Job Type
              </option>
              {jobTypes.map((jobType, index) => (
                <option key={index} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600"
              onClick={handleSearchChange}
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-16 lg:p-3">
        {/* Filter Section */}
        <JobFilter
          industry={industry}
          jobRole={jobRole}
          handleJobRoleChange={handleJobRoleChange}
        />
        {/* Job Results */}
        <JobResults filteredJob={filteredJobRole} handleClick={handleClick} />
      </div>
    </div>
  );
};

export default JobList;