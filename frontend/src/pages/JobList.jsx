import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";
import { RefreshCcw } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const JobList = () => {
  const {
    jobs,
    jobRole,
    isTitleEmpty,
    selectedRadio,
    checkedOptions,
    currentJobRole,
    setIsTitleEmpty,
    setSelectedRadio,
    setcurrentJobRole,
    setCheckedOptions,
    handleJobRoleChange,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [industry, setIndustry] = useState([]);
  const [jobcountry, setCountry] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [visibleSection, setVisibleSection] = useState({});
  const [loading, setLoading] = useState(false);

  const [filteredJobRole, setFilteredJobRole] = useState([]);
  const [filteredSearchJobRole, setFilteredSearchJobRole] = useState([]); //filtering main search
  const [title, setTitle] = useState("");

  const [filteredSearchJob, setFilteredSearchJob] = useState("");
  const [showDropdown, setShowDropDown] = useState(false);

  const handleClick = (jobs) => {
    navigate("/jobdetail", { state: { jobs } });
  };

  // useEffect(() => {
  //   handleRefresh();
  // }, [location.pathname]);

  const handleRefresh = () => {
    console.log("Before Reset:", checkedOptions, selectedRadio); // Debugging
    setSelectedRadio("");
    setCheckedOptions({});
    setFilteredJobRole(jobs);
    setFilteredSearchJob("");
    setIsTitleEmpty(false);
    setTitle("");
    setcurrentJobRole({
      DatePosted: [],
      Industry: [],
      JobRoles: [],
      Salary: [],
      Experience: [],
      Title: [],
      Location: [],
      JobType: [],
      TitleAndCompany: [],
    });
    setVisibleSection((prev) => 
      Object.fromEntries(Object.keys(prev).map((key) => [key, false]))
    );
    
    console.log("After Reset:", checkedOptions, selectedRadio); // Debugging
  };

  const handleSearchTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (value.trim() === "") {
      setFilteredSearchJob([]);
      setShowDropDown(false);
      return;
    }
    const filtered = jobRole.filter((role) =>
      role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSearchJob(filtered);
    setShowDropDown(filtered.length > 0);
  };
  const handleDropdownSelect = (jobTitle) => {
    setTitle(jobTitle);
    setFilteredSearchJob([]);
    setShowDropDown(false);
    console.log(searchTerm);
  };

  // Handle search input change
  const handleSearchChange = () => {
    setLoading(true)
      setTimeout(()=>
      {
        setLoading(false)
      
      },500)
    setIsTitleEmpty(title.trim()==="")
    console.log("searching for : ", { title });
    const filteredJobs = jobs.filter((job) => {
      const matchTitle = title
        ? job.title.toLowerCase().includes(title.toLowerCase())
        : true;
      return matchTitle;
    });
    console.log("filtered jobs: ", { filteredJobs });
    setFilteredSearchJobRole(filteredJobs);
  };

  useEffect(() => {
    const industries = jobs.map((job) => job.industry);
    const countries = jobs.map((job) => job.location);
    const jobtypes = jobs.map((job) => job.jobType);

    const uniqueIndustriesSet = new Set(industries);

    const uniqueCountrySet = new Set(countries);
    const uniqueJobTypeSet = new Set(jobtypes);
    setIndustry(Array.from(uniqueIndustriesSet));

    setCountry(Array.from(uniqueCountrySet));
    setJobTypes(Array.from(uniqueJobTypeSet));
  }, [jobs]);

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
      (title.trim() !== "" ? filteredSearchJobRole : jobs).filter((job) => {
        const daysAgo = getDaysDifference(job.applicationPostedDate);

        const matchDate =
          !currentJobRole.DatePosted.length ||
          (currentJobRole.DatePosted.includes("Last 24 hours") &&
            daysAgo <= 1) ||
          (currentJobRole.DatePosted.includes("Last Week") && daysAgo <= 7) ||
          (currentJobRole.DatePosted.includes("Last Month") && daysAgo <= 30) ||
          (currentJobRole.DatePosted.includes("Older") && daysAgo > 30);

        const matchIndustry =
          !currentJobRole.Industry.length ||
          currentJobRole.Industry.includes(job.industry);

        const matchJobType =
          !currentJobRole.JobTypes?.length ||
          currentJobRole.JobTypes.includes(job.jobType);

        const matchLocation =
          !currentJobRole.Location.length ||
          currentJobRole.Location.some((location) =>
            job.location.toLowerCase().includes(location.toLowerCase())
          );

        const matchSalary =
          !currentJobRole.Salary.length ||
          currentJobRole.Salary.some((range) => {
            if (range === "₹10,000 - ₹20,000")
              return job.salary >= 10000 && job.salary < 20000;
            if (range === "₹20,000 - ₹30,000")
              return job.salary >= 20000 && job.salary < 30000;
            if (range === "₹30,000 - ₹50,000")
              return job.salary >= 30000 && job.salary <= 50000;
            if (range === "Above ₹50,000") return job.salary > 20000;
            return false;
          });

        const matchTitleAndCompany =
          !currentJobRole.TitleAndCompany.length ||
          currentJobRole.TitleAndCompany.some(
            (role) =>
              role.toLowerCase().includes(job.title.toLowerCase()) ||
              role.toLowerCase().includes(job.company.toLowerCase())
          );

        const matchExperience =
          !currentJobRole.Experience.length ||
          currentJobRole.Experience.some((range) => {
            if (range === "0-2 years")
              return job.experienceYearsMin >= 0 && job.experienceYearsMax <= 2;
            if (range === "3-5 years")
              return job.experienceYearsMin >= 2 && job.experienceYearsMax <= 5;
            if (range === "5+ years") return job.experienceYearsMax >= 5;
            return false;
          });

        return (
          matchDate &&
          matchIndustry &&
          matchJobType &&
          matchSalary &&
          matchExperience &&
          matchTitleAndCompany &&
          matchLocation
        );
      })
    );
  }, [currentJobRole, jobs, filteredSearchJobRole]);

  console.log(currentJobRole);
  console.log("Filtered jobs", filteredJobRole);
  console.log("Filtered Seach Job role", filteredSearchJobRole);
  console.log("in main", checkedOptions, selectedRadio);

  useEffect(() => {
    console.log("filteredjobrole : ", filteredJobRole);
  }, [filteredJobRole]);

  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
        <Banner />
        <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16 md:shadow-xl">
          <div className=" relative flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
            <div className="relative w-full">
              <input
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Search Job Title"
                value={title}
                style={{ fontFamily: "Poppins, sans-serif" }}
                onChange={handleSearchTitleChange}
              />
              {showDropdown && (
                <div className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 top-full mt-1">
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
            </div>
          </div>
          <p className={`text-red-500 text-md font-medium ${isTitleEmpty?"block":"hidden"} `}>Job title cannot be empty. Please enter a title to search!</p>
          {/* Search Button */}
          <div className="flex justify-center mt-4 md:mx-40 gap-3">
            <button
              className={`w-full p-3 text-white transition-all bg-orange-500 rounded-md hover:bg-orange-600 ${isTitleEmpty?'bg-orange-600':""}`}
              onClick={handleSearchChange}
            >
              Find Jobs
            </button>
            <button className="hover:text-orange-500" onClick={handleRefresh}>
              <RefreshCcw />{" "}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-16 lg:p-3 ">
        {/* Filter Section */}
        <JobFilter
          industry={industry}
          location={jobcountry}
          jobTypes={jobTypes}
          handleJobRoleChange={handleJobRoleChange}
          selectedRadio={selectedRadio}
          checkedOptions={checkedOptions}
          visibleSection={visibleSection}
          setVisibleSection={setVisibleSection}
        />
        {/* Job Results */}
        {loading?<div className="w-3/4 text-center text-lg font-semibold text-gray-500 mt-7 mb-7">Searching...</div>:(
          <JobResults filteredJob={filteredJobRole} handleClick={handleClick} loading={loading} />)}
      </div>
    </div>
  );
};

export default JobList;
