// import React, { useState, useEffect, useContext, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // For Icons
// import Banner from "../components/Banner";
// import JobFilter from "../components/JobFilter";
// import JobResults from "../components/JobResults";
// import { AuthContext } from "../context/AuthContext";

// const JobList = () => {
//   const { handleJobRoleChange, currentJobRole, jobs, jobRole } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [industry, setIndustry] = useState([]);
//   const [jobcountry, setCountry] = useState([]);
//   const [jobTypes, setJobTypes] = useState([]);
//   const [filteredJobRole, setFilteredJobRole] = useState([]);
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [jobType, setJobType] = useState("");
//   const [filteredSearchJob, setFilteredSearchJob] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   const dropdownRef = useRef(null); // Ref for click outside

//   // Click outside dropdown hook
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleJobClick = (jobId) => {
//     navigate("/jobdetail", { state: { jobId } });
//   };

//   const handleSearchTitleChange = (e) => {
//     const value = e.target.value;
//     setTitle(value);

//     if (value.trim() === "") {
//       setFilteredSearchJob([]);
//       setShowDropdown(false);
//       return;
//     }
//     const filtered = jobRole.filter((role) =>
//       role.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredSearchJob(filtered);
//     setShowDropdown(filtered.length > 0);
//   };

//   const handleDropdownSelect = (jobTitle) => {
//     setTitle(jobTitle);
//     setFilteredSearchJob([]);
//     setShowDropdown(false);
//     console.log(title);
//   };

//   const handleSearchChange = () => {
//     console.log("searching for : ", { title, location, jobType });
//     const filteredJobs = jobs.filter((job) => {
//       const matchTitle = title
//         ? job.title.toLowerCase().includes(title.toLowerCase())
//         : true;
//       const matchLocation = location
//         ? job.location.toLowerCase().includes(location.toLowerCase())
//         : true;
//       const matchJobType = jobType
//         ? job.jobType.toLowerCase().includes(jobType.toLowerCase())
//         : true;

//       return matchTitle && matchLocation && matchJobType;
//     });
//     console.log("filtered jobs: ", { filteredJobs });
//     setFilteredJobRole(filteredJobs);
//   };

//   useEffect(() => {
//     const industries = [...new Set(jobs.map((job) => job.industry))];
//     const countries = [...new Set(jobs.map((job) => job.location))];
//     const jobtypes = [...new Set(jobs.map((job) => job.jobType))];

//     setIndustry(industries);
//     setCountry(countries);
//     setJobTypes(jobtypes);
//   }, [jobs]);

//   useEffect(() => {
//     const getDaysDifference = (jobDate) => {
//       const currentDate = new Date();
//       const jobDateObj = new Date(jobDate);
//       if (isNaN(jobDateObj)) {
//         console.error("Invalid job date:", jobDate);
//         return 0;
//       }
//       const diffTime = currentDate - jobDateObj;
//       return Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     };

//     setFilteredJobRole(
//       jobs.filter((job) => {
//         const daysAgo = getDaysDifference(job.applicationPostedDate);

//         const matchDate =
//           !currentJobRole.DatePosted.length ||
//           (currentJobRole.DatePosted.includes("Last 24 hours") && daysAgo <= 1) ||
//           (currentJobRole.DatePosted.includes("Last Week") && daysAgo <= 7) ||
//           (currentJobRole.DatePosted.includes("Last Month") && daysAgo <= 30) ||
//           (currentJobRole.DatePosted.includes("Older") && daysAgo > 30);

//         const matchIndustry =
//           !currentJobRole.Industry.length ||
//           currentJobRole.Industry.includes(job.industry);

//         const matchJobRole =
//           !currentJobRole.JobRoles.length ||
//           currentJobRole.JobRoles.some((role) =>
//             job.title.toLowerCase().includes(role.toLowerCase())
//           );

//         const matchSalary =
//           !currentJobRole.Salary.length ||
//           currentJobRole.Salary.some((range) => {
//             if (range === "₹10,000 - ₹20,000")
//               return job.salary >= 10000 && job.salary < 20000;
//             if (range === "₹20,000 - ₹30,000")
//               return job.salary >= 20000 && job.salary < 30000;
//             if (range === "₹30,000 - ₹50,000")
//               return job.salary >= 30000 && job.salary <= 50000;
//             if (range === "Above ₹50,000") return job.salary > 20000;
//             return false;
//           });

//         return (
//           matchDate && matchIndustry && matchJobRole && matchSalary
//         );
//       })
//     );
//   }, [currentJobRole, jobs]);

//   console.log(currentJobRole);

//   return (
//     <motion.div
//       className="min-h-screen bg-gray-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Banner Section */}
//       <Banner />

//       {/* Search and Filter Section */}
//       <motion.div
//   className="container w-3/4 mx-auto px-4 py-8 mt-8 rounded-lg shadow-md bg-white/90"
//   initial={{ y: -20, opacity: 0 }}
//   animate={{ y: 0, opacity: 1 }}
//   transition={{ duration: 0.5 }}
// >
//   <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
//     <motion.div
//       className="flex-grow relative"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5, delay: 0.2 }}
//     >
//       <input
//         className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//         placeholder="Search Job Title"
//         value={title}
//         onChange={handleSearchTitleChange}
//       />
//       <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//       {showDropdown && (
//         <motion.div
//           ref={dropdownRef}
//           className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 mt-1"
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 10 }}
//           transition={{ duration: 0.2 }}
//         >
//           {filteredSearchJob.map((jobTitle, index) => (
//             <motion.div
//               key={index}
//               className="p-2 cursor-pointer hover:bg-gray-200"
//               onClick={() => handleDropdownSelect(jobTitle)}
//               whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
//               transition={{ duration: 0.1 }}
//             >
//               {jobTitle}
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </motion.div>

//     <motion.select
//       className="w-full md:w-1/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//       value={location}
//       onChange={(e) => setLocation(e.target.value)}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5, delay: 0.4 }}
//     >
//       <option value="" disabled>Select Country</option>
//       {jobcountry.map((country, index) => (
//         <option key={index} value={country}>{country}</option>
//       ))}
//     </motion.select>

//     <motion.select
//       className="w-full md:w-1/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
//       value={jobType}
//       onChange={(e) => setJobType(e.target.value)}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5, delay: 0.6 }}
//     >
//       <option value="" disabled>Select Job Type</option>
//       {jobTypes.map((jobType, index) => (
//         <option key={index} value={jobType}>{jobType}</option>
//       ))}
//     </motion.select>
//   </div>

//   <motion.button
//     className="w-full p-3 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center justify-center space-x-2"
//     onClick={handleSearchChange}
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//   >
//     <FaSearch /> <span>Find Jobs</span>
//   </motion.button>
//       </motion.div>

//       {/* Job Listings and Filters */}
//       <div className="container mx-auto px-4 mt-8 flex">
//         <JobFilter
//           industry={industry}
//           jobRole={jobRole}
//           handleJobRoleChange={handleJobRoleChange}
//         />
//         <JobResults
//           filteredJob={filteredJobRole}
//           handleClick={handleJobClick}
//         />
//       </div>
//     </motion.div>
//   );
// };

// export default JobList;

import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa"; // For Icons
import { RefreshCcw } from "lucide-react";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";
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
  const [filteredJobRole, setFilteredJobRole] = useState([]);
  const [filteredSearchJobRole, setFilteredSearchJobRole] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [filteredSearchJob, setFilteredSearchJob] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
   const [activeFilter, setActiveFilter] = useState(null);

  const dropdownRef = useRef(null); // Ref for click outside
  const handleRefresh = () => {
    console.log("Before Reset:", checkedOptions, selectedRadio); // Debugging
    setSelectedRadio("");
    setCheckedOptions({});
    setFilteredJobRole(jobs);
    setFilteredSearchJob("");
    setIsTitleEmpty(false);
    setTitle("");
    setLocation("");
    setJobType("");
    setActiveFilter(null);
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
    console.log('refresh-currentjob',currentJobRole);
    
    setVisibleSection((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, false]))
    );

    console.log("After Reset:", checkedOptions, selectedRadio); // Debugging
  };

  // Click outside dropdown hook
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleJobClick = (jobId) => {
    navigate("/jobdetail", { state: { jobId } });
  };
  const handleSearchTitleChange = (e) => {
    
    const value = e.target.value;
    setTitle(value);

    if(value.trim()==="")
    {
      setFilteredSearchJob([])
      setShowDropdown(false)
      return
    }
    const filtered = jobRole.filter((role) => role.toLowerCase().includes(value.toLowerCase()));
    setFilteredSearchJob(filtered);
    setShowDropdown(filtered.length > 0);
  };
  const handleDropdownSelect=(jobTitle)=>
  {
    setTitle(jobTitle);
    setFilteredSearchJob([]);
    setShowDropdown(false)
    console.log(searchTerm)
  }

  // Handle search input change
  const handleSearchChange = () => {
    console.log('searching for : ',{title,location,jobType})
    const filteredJobs = jobs.filter((job) => {
      const matchTitle = title ? job.title.toLowerCase().includes(title.toLowerCase()) : true;
      const matchLocation = location ? job.location.toLowerCase().includes(location.toLowerCase()) : true;
      const matchJobType = jobType ? job.jobType.toLowerCase().includes(jobType.toLowerCase()) : true;
    
      return matchTitle && matchLocation && matchJobType;
    });
    console.log("filtered jobs: ", { filteredJobs });
    setFilteredSearchJobRole(filteredJobs);
  };


  
  useEffect(() => {
    const industries = [...new Set(jobs.map((job) => job.industry))];
    const countries = [...new Set(jobs.map((job) => job.location))];
    const jobtypes = [...new Set(jobs.map((job) => job.jobType))];
    const uniqueIndustriesSet = new Set(industries);
    const uniqueCountrySet = new Set(countries);
    const uniqueJobTypeSet = new Set(jobtypes);
    setIndustry([...uniqueIndustriesSet]);
    setCountry([...uniqueCountrySet]);
    setJobTypes([...uniqueJobTypeSet]);
  }, [jobs]);

  console.log('current job role',currentJobRole);
  console.log('filtered search job',filteredSearchJob);
  console.log('filtered jobs',filteredJobRole);
  

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
      ((title.trim() !== "" || location.trim() !== "" || jobType.trim() !== "")
        ? filteredSearchJobRole
        : jobs
      ).filter((job) => {
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

        const matchJobRole =
          !currentJobRole.JobRoles.length ||
          currentJobRole.JobRoles.some((role) =>
            job.title.toLowerCase().includes(role.toLowerCase())
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

          const matchTitleAndCompany =
          !currentJobRole.TitleAndCompany.length ||
          currentJobRole.TitleAndCompany.some(
            (role) =>
              role.toLowerCase().includes(job.title.toLowerCase()) ||
              role.toLowerCase().includes(job.company.toLowerCase())
          );

        return (
          matchDate &&
          matchIndustry &&
          matchExperience &&
          matchJobRole &&
          matchSalary &&
          matchTitleAndCompany
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
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Banner Section */}
      <Banner />

      {/* Search and Filter Section */}
      <motion.div
        className="container w-3/4 mx-auto px-4 py-8 mt-8 rounded-lg shadow-md bg-white/90"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <motion.div
            className="flex-grow relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Search Job Title"
              value={title}
              onChange={handleSearchTitleChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {filteredSearchJob.map((jobTitle, index) => (
                  <motion.div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleDropdownSelect(jobTitle)}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                    transition={{ duration: 0.1 }}
                  >
                    {jobTitle}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.select
            className="w-full md:w-1/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <option value="" disabled>
              Select Country
            </option>
            {jobcountry.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </motion.select>

          <motion.select
            className="w-full md:w-1/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <option value="" disabled>
              Select Job Type
            </option>
            {jobTypes.map((jobType, index) => (
              <option key={index} value={jobType}>
                {jobType}
              </option>
            ))}
          </motion.select>
        </div>
        <div className="flex justify-center gap-2">
          <motion.button
            className="w-full p-3 mt-4 text-white bg-orange-500 rounded-md hover:bg-orange-600 flex items-center justify-center space-x-2"
            onClick={handleSearchChange}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaSearch /> <span>Find Jobs</span>
          </motion.button>
          <button className="hover:text-orange-500 mt-3" onClick={handleRefresh}>
            <RefreshCcw />{" "}
          </button>
        </div>
      </motion.div>

      {/* Job Listings and Filters */}
      <div className="container mx-auto px-4 mt-8 flex">
        <JobFilter
          industry={industry}
          location={jobcountry}
          jobTypes={jobTypes}
          jobRole={jobRole}
          handleJobRoleChange={handleJobRoleChange}
          selectedRadio={selectedRadio}
          checkedOptions={checkedOptions}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        {/* Job Results */}
        <JobResults filteredJob={filteredJobRole} handleClick={handleJobClick} />
      </div>
    </motion.div>
  );
};

export default JobList;
