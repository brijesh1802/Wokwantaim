import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";
import { AuthContext } from "../context/AuthContext";
import { LogIn, RefreshCcw } from "lucide-react";

const JobList = () => {
  const {
    handleJobRoleChange,
    currentJobRole,
    jobs,
    selectedRadio,
    checkedOptions,
    setSelectedRadio,
    setCheckedOptions,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [industry, setIndustry] = useState([]);
  const [jobcountry, setCountry] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [filteredJobRole, setFilteredJobRole] = useState([]);
  const [searchFilteredJobRole, setSearchFilteredJobRole] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [isRefreshed, setIsRefresh] = useState(false);

  const handleClick = (jobs) => {
    navigate("/jobdetail", { state: { jobs } });
  };
   useEffect(()=>{
    console.log('title ',title);

   },[title])

  const handleRefresh = () => {
    console.log("checked options :  ", checkedOptions || {});
    console.log("selected radio  :  ", selectedRadio);
    setIsRefresh(true);
    setSelectedRadio("");
    setCheckedOptions({});
    setFilteredJobRole(jobs);
    setTitle("");
  };

  const handleSearchChange = () => {
    const filteredJobsForSearch = jobs.filter((job) => {
      const matchTitle = title
        ? job.title.toLowerCase().includes(title.toLowerCase())
        : true;
      return matchTitle;
    });
    setSearchFilteredJobRole(filteredJobsForSearch);
  };

  useEffect(() => {
    const industries = jobs.map((job) => job.industry);
    const countries = jobs.map((job) => job.location);
    const jobtypes = jobs.map((job) => job.jobType);
    const jobRoles = jobs.map((job) => job.title);
    const uniqueIndustriesSet = new Set(industries);
    const uniqueJobRolesSet = new Set(jobRoles);
    const uniqueCountrySet = new Set(countries);
    const uniqueJobTypeSet = new Set(jobtypes);
    setIndustry(Array.from(uniqueIndustriesSet));
    setJobRole(Array.from(uniqueJobRolesSet));
    setCountry(Array.from(uniqueCountrySet));
    setJobTypes(Array.from(uniqueJobTypeSet));
  }, [jobs]);

useEffect(() => {
  const getDaysDifference = (jobDate) => {
    const currentDate = new Date();
    const jobDateObj = new Date(jobDate);
    const diffTime = currentDate - jobDateObj;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  setFilteredJobRole(
    (title.trim() !== "" ? searchFilteredJobRole : jobs).filter((job) => {
      const daysAgo = getDaysDifference(job.applicationPostedDate);

      const matchDate =
        !currentJobRole.DatePosted.length ||
        (currentJobRole.DatePosted.includes("Last 24 hours") &&
          daysAgo <= 1) ||
        (currentJobRole.DatePosted.includes("Last Week") && daysAgo <= 7) ||
        (currentJobRole.DatePosted.includes("Last Month") && daysAgo <= 30) ||
        (currentJobRole.DatePosted.includes("Older") && daysAgo > 30);

        const matchJobType =
!currentJobRole.JobTypes?.length ||
currentJobRole.JobTypes.includes(job.jobType);

      const matchTitleAndCompany =
        !currentJobRole.TitleAndCompany.length ||
        currentJobRole.TitleAndCompany.some(
          (role) =>
            role.toLowerCase().includes(job.title.toLowerCase()) ||
            role.toLowerCase().includes(job.company.toLowerCase())
        );

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

      const matchIndustry =
        !currentJobRole.Industry.length ||
        currentJobRole.Industry.includes(job.industry);

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
}, [currentJobRole, jobs, searchFilteredJobRole]);

  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
        <Banner />
        <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Search Job Title"
              style={{ fontFamily: "Poppins, sans-serif" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

          {/* Search Button */}
          <div className="flex justify-center items-center gap-3 mt-4 ">
            <button
              className="p-3 w-full text-white transition-all bg-orange-500 rounded-md hover:bg-orange-600"
              onClick={handleSearchChange}
            >
              Find Jobs
            </button>
            <button className="hover:text-orange-500" onClick={handleRefresh}>
              <RefreshCcw />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-5 lg:p-3">
        {/* Filter Section */}
        <JobFilter
          industry={industry}
          location={jobcountry}
          jobTypes={jobTypes}
          handleJobRoleChange={handleJobRoleChange}
          selectedRadio={selectedRadio}
          checkedOptions={checkedOptions}
        />
        {
          /* Job Results */
          console.log("AuthContext values:", { checkedOptions, selectedRadio })
        }
        <JobResults filteredJob={filteredJobRole} handleClick={handleClick} />
      </div>
    </div>
  );
};

export default JobList;

// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Banner from "../components/Banner";
// import JobFilter from "../components/JobFilter";
// import JobResults from "../components/JobResults";
// import { RefreshCcw } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";

// const JobList = () => {
//   const {
//     handleJobRoleChange,
//     currentJobRole,
//     jobs,
//     jobRole,
//     selectedRadio,
//     checkedOptions,
//     setSelectedRadio,
//     setCheckedOptions,
//   } = useContext(AuthContext);
//   // const jobTypes = ["Full-time", "Part-Time", "Contract"]; // Example job type data
//   const navigate = useNavigate();

//   const [industry, setIndustry] = useState([]);
//   const [jobcountry, setCountry] = useState([]);

//   const [jobTypes, setJobTypes] = useState([]);

//   const [filteredJobRole, setFilteredJobRole] = useState([]);
//   const [filteredSearchJobRole, setFilteredSearchJobRole] = useState([]); //filtering main search
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [jobType, setJobType] = useState("");

//   const [filteredSearchJob, setFilteredSearchJob] = useState("");
//   const [showDropdown, setShowDropDown] = useState(false);

//   const [isRefreshed, setIsRefresh] = useState(false);
//   const handleClick = (jobs) => {
//     navigate("/jobdetail", { state: { jobs } });
//   };

//   const handleRefresh = () => {
//     console.log("Before Reset:", checkedOptions, selectedRadio); // Debugging

//     setIsRefresh(true);
//     setSelectedRadio("");
//     setCheckedOptions({}); // Ensure everything resets

//     // Force a re-render to clear selections

//     setFilteredJobRole(jobs);
//     setTitle("");
//     setLocation("");
//     setJobType("");

//     console.log("After Reset:", checkedOptions, selectedRadio); // Debugging
//   };

//   const handleSearchTitleChange = (e) => {
//     const value = e.target.value;
//     setTitle(value);

//     if (value.trim() === "") {
//       setFilteredSearchJob([]);
//       setShowDropDown(false);
//       return;
//     }
//     const filtered = jobRole.filter((role) =>
//       role.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredSearchJob(filtered);
//     setShowDropDown(filtered.length > 0);
//   };
//   const handleDropdownSelect = (jobTitle) => {
//     setTitle(jobTitle);
//     setFilteredSearchJob([]);
//     setShowDropDown(false);
//     console.log(searchTerm);
//   };

//   // Handle search input change
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
//     setFilteredSearchJobRole(filteredJobs);
//   };

//   useEffect(() => {
//     const industries = jobs.map((job) => job.industry);
//     const countries = jobs.map((job) => job.location);
//     const jobtypes = jobs.map((job) => job.jobType);

//     const uniqueIndustriesSet = new Set(industries);

//     const uniqueCountrySet = new Set(countries);
//     const uniqueJobTypeSet = new Set(jobtypes);
//     setIndustry(Array.from(uniqueIndustriesSet));

//     setCountry(Array.from(uniqueCountrySet));
//     setJobTypes(Array.from(uniqueJobTypeSet));
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
//       (location.trim() !== "" || title.trim() !== "" || jobType.trim() !== ""
//         ? filteredSearchJobRole
//         : jobs
//       ).filter((job) => {
//         const daysAgo = getDaysDifference(job.applicationPostedDate);

//         const matchDate =
//           !currentJobRole.DatePosted.length ||
//           (currentJobRole.DatePosted.includes("Last 24 hours") &&
//             daysAgo <= 1) ||
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

//         const matchTitleAndCompany =
//           !currentJobRole.TitleAndCompany.length ||
//           currentJobRole.TitleAndCompany.some(
//             (role) =>
//               role.toLowerCase().includes(job.title.toLowerCase()) ||
//               role.toLowerCase().includes(job.company.toLowerCase())
//           );

//         const matchExperience =
//           !currentJobRole.Experience.length ||
//           currentJobRole.Experience.some((range) => {
//             if (range === "0-2 years")
//               return job.experienceYearsMin >= 0 && job.experienceYearsMax <= 2;
//             if (range === "3-5 years")
//               return job.experienceYearsMin >= 2 && job.experienceYearsMax <= 5;
//             if (range === "5+ years") return job.experienceYearsMax >= 5;
//             return false;
//           });

//         return (
//           matchDate &&
//           matchIndustry &&
//           matchJobRole &&
//           matchSalary &&
//           matchExperience &&
//           matchTitleAndCompany
//         );
//       })
//     );
//   }, [currentJobRole, jobs, filteredSearchJobRole]);

//   console.log(currentJobRole);
//   console.log("Filtered jobs", filteredJobRole);
//   console.log("Filtered Seach Job role", filteredSearchJobRole);
//   console.log("in main", checkedOptions, selectedRadio);

//   return (
//     <div>
//       <div className="gap-4">
//         {/* Banner Section */}
//         <Banner />
//         <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
//           <div className=" relative flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
//               placeholder="Search Job Title"
//               value={title}
//               style={{ fontFamily: "Poppins, sans-serif" }}
//               onChange={handleSearchTitleChange}
//             />
//             {showDropdown && (
//               <div className="absolute left-0 w-full md:w-1/3 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 top-full mt-1">
//                 {filteredSearchJob.map((jobTitle, index) => (
//                   <div
//                     key={index}
//                     className="p-2 cursor-pointer hover:bg-gray-200"
//                     onClick={() => handleDropdownSelect(jobTitle)}
//                   >
//                     {jobTitle}
//                   </div>
//                 ))}
//               </div>
//             )}
//             <select
//               className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
//               defaultValue=""
//               value={location}
//               style={{ fontFamily: "Poppins, sans-serif" }}
//               onChange={(e) => setLocation(e.target.value)}
//             >
//               <option value="" disabled>
//                 Select Country
//               </option>
//               {jobcountry.map((country, index) => (
//                 <option key={index} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//             <select
//               className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
//               defaultValue=""
//               style={{ fontFamily: "Poppins, sans-serif" }}
//               onChange={(e) => setJobType(e.target.value)}
//             >
//               <option value="" disabled>
//                 Select Job Type
//               </option>
//               {jobTypes.map((jobType, index) => (
//                 <option key={index} value={jobType}>
//                   {jobType}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Search Button */}
//           <div className="flex justify-center mt-4 gap-3">
//             <button
//               className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600"
//               onClick={handleSearchChange}
//             >
//               Find Jobs
//             </button>
//             <button className="hover:text-orange-500" onClick={handleRefresh}>
//               <RefreshCcw />{" "}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row mt-16 lg:p-3">
//         {/* Filter Section */}
//         <JobFilter
//           industry={industry}
//           jobRole={jobRole}
//           handleJobRoleChange={handleJobRoleChange}
//           selectedRadio={selectedRadio}
//           checkedOptions={checkedOptions}
//         />
//         {/* Job Results */}
//         <JobResults filteredJob={filteredJobRole} handleClick={handleClick} />
//       </div>
//     </div>
//   );
// };

// export default JobList;

// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Banner from "../components/Banner";
// import JobFilter from "../components/JobFilter";
// import JobResults from "../components/JobResults";
// import { RefreshCcw } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";

// const JobList = () => {
//   const {
//     handleJobRoleChange,
//     currentJobRole,
//     jobs,
//     jobRole,
//     selectedRadio,
//     checkedOptions,
//     setSelectedRadio,
//     setCheckedOptions,
//   } = useContext(AuthContext);
//   // const jobTypes = ["Full-time", "Part-Time", "Contract"]; // Example job type data
//   const navigate = useNavigate();

//   const [industry, setIndustry] = useState([]);
//   const [jobcountry, setCountry] = useState([]);

//   const [jobTypes, setJobTypes] = useState([]);

//   const [filteredJobRole, setFilteredJobRole] = useState([]);
//   const [filteredSearchJobRole, setFilteredSearchJobRole] = useState([]); //filtering main search
//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [jobType, setJobType] = useState("");

//   const [filteredSearchJob, setFilteredSearchJob] = useState("");
//   const [showDropdown, setShowDropDown] = useState(false);

//   const [isRefreshed, setIsRefresh] = useState(false);
//   const handleClick = (jobs) => {
//     navigate("/jobdetail", { state: { jobs } });
//   };

//   const handleRefresh = () => {
//     console.log("Before Reset:", checkedOptions, selectedRadio); // Debugging

//     setIsRefresh(true);
//     setSelectedRadio("");
//     setCheckedOptions({}); // Ensure everything resets

//     // Force a re-render to clear selections

//     setFilteredJobRole(jobs);
//     setTitle("");
//     setLocation("");
//     setJobType("");

//     console.log("After Reset:", checkedOptions, selectedRadio); // Debugging
//   };

//   const handleSearchTitleChange = (e) => {
//     const value = e.target.value;
//     setTitle(value);

//     if (value.trim() === "") {
//       setFilteredSearchJob([]);
//       setShowDropDown(false);
//       return;
//     }
//     const filtered = jobRole.filter((role) =>
//       role.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredSearchJob(filtered);
//     setShowDropDown(filtered.length > 0);
//   };
//   const handleDropdownSelect = (jobTitle) => {
//     setTitle(jobTitle);
//     setFilteredSearchJob([]);
//     setShowDropDown(false);
//     console.log(searchTerm);
//   };

//   // Handle search input change
//   const handleSearchChange = () => {
//     console.log("searching for : ", { title, location, jobType });
//     const filteredJobs = jobs.filter((job) => {
//       const matchTitle = title
//         ? job.title.toLowerCase().includes(title.toLowerCase())
//         : true;
//       return matchTitle;
//     });
//     console.log("filtered jobs: ", { filteredJobs });
//     setFilteredSearchJobRole(filteredJobs);
//   };

//   useEffect(() => {
//     const industries = jobs.map((job) => job.industry);
//     const countries = jobs.map((job) => job.location);
//     const jobtypes = jobs.map((job) => job.jobType);

//     const uniqueIndustriesSet = new Set(industries);

//     const uniqueCountrySet = new Set(countries);
//     const uniqueJobTypeSet = new Set(jobtypes);
//     setIndustry(Array.from(uniqueIndustriesSet));

//     setCountry(Array.from(uniqueCountrySet));
//     setJobTypes(Array.from(uniqueJobTypeSet));
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
//       (title.trim() !== "" ? filteredSearchJobRole : jobs).filter((job) => {
//         const daysAgo = getDaysDifference(job.applicationPostedDate);

//         const matchDate =
//           !currentJobRole.DatePosted.length ||
//           (currentJobRole.DatePosted.includes("Last 24 hours") &&
//             daysAgo <= 1) ||
//           (currentJobRole.DatePosted.includes("Last Week") && daysAgo <= 7) ||
//           (currentJobRole.DatePosted.includes("Last Month") && daysAgo <= 30) ||
//           (currentJobRole.DatePosted.includes("Older") && daysAgo > 30);

//         const matchJobType =
//           !currentJobRole.JobTypes?.length ||
//           currentJobRole.JobTypes.includes(job.jobType);

//         const matchLocation =
//           !currentJobRole.Location.length ||
//           currentJobRole.Location.some((location) =>
//             job.location.toLowerCase().includes(location.toLowerCase())
//           );

//         const matchIndustry =
//           !currentJobRole.Industry.length ||
//           currentJobRole.Industry.includes(job.industry);

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

//         const matchTitleAndCompany =
//           !currentJobRole.TitleAndCompany.length ||
//           currentJobRole.TitleAndCompany.some(
//             (role) =>
//               role.toLowerCase().includes(job.title.toLowerCase()) ||
//               role.toLowerCase().includes(job.company.toLowerCase())
//           );

//         const matchExperience =
//           !currentJobRole.Experience.length ||
//           currentJobRole.Experience.some((range) => {
//             if (range === "0-2 years")
//               return job.experienceYearsMin >= 0 && job.experienceYearsMax <= 2;
//             if (range === "3-5 years")
//               return job.experienceYearsMin >= 2 && job.experienceYearsMax <= 5;
//             if (range === "5+ years") return job.experienceYearsMax >= 5;
//             return false;
//           });

//         return (
//           matchDate &&
//           matchIndustry &&
//           matchJobType &&
//           matchSalary &&
//           matchExperience &&
//           matchTitleAndCompany &&
//           matchLocation
//         );
//       })
//     );
//   }, [currentJobRole, jobs, filteredSearchJobRole]);

//   console.log(currentJobRole);
//   console.log("Filtered jobs", filteredJobRole);
//   console.log("Filtered Seach Job role", filteredSearchJobRole);
//   console.log("in main", checkedOptions, selectedRadio);

//   return (
//     <div>
//       <div className="gap-4">
//         {/* Banner Section */}
//         <Banner />
//         <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
//           <div className=" relative flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md  focus:outline-none"
//               placeholder="Search Job Title"
//               value={title}
//               style={{ fontFamily: "Poppins, sans-serif" }}
//               onChange={handleSearchTitleChange}
//             />
//             {showDropdown && (
//               <div className="absolute left-0 w-full md:w-1/3 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-50 top-full mt-1">
//                 {filteredSearchJob.map((jobTitle, index) => (
//                   <div
//                     key={index}
//                     className="p-2 cursor-pointer hover:bg-gray-200"
//                     onClick={() => handleDropdownSelect(jobTitle)}
//                   >
//                     {jobTitle}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Search Button */}
//           <div className="flex justify-center mt-4 gap-3">
//             <button
//               className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600"
//               onClick={handleSearchChange}
//             >
//               Find Jobs
//             </button>
//             <button className="hover:text-orange-500" onClick={handleRefresh}>
//               <RefreshCcw />{" "}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row mt-16 lg:p-3">
//         {/* Filter Section */}
//         <JobFilter
//           industry={industry}
//           jobTypes={jobTypes}
//           location={jobcountry}
//           handleJobRoleChange={handleJobRoleChange}
//           selectedRadio={selectedRadio}
//           checkedOptions={checkedOptions}
//         />
//         {/* Job Results */}
//         <JobResults filteredJob={filteredJobRole} handleClick={handleClick} />
//       </div>
//     </div>
//   );
// };

// export default JobList;
