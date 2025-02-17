
// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Banner from "../components/Banner";
// import JobFilter from "../components/JobFilter";
// import JobResults from "../components/JobResults";
// import { AuthContext } from "../context/AuthContext";
// import { RefreshCcw} from "lucide-react";

// const JobList = () => {
//   const { handleJobRoleChange, currentJobRole, jobs} = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [industry, setIndustry] = useState([]);
//   const [jobcountry, setCountry] = useState([]);
//   const [jobRole, setJobRole] = useState([]);
//   const [jobTypes, setJobTypes] = useState([]);

//   const [filteredJobRole, setFilteredJobRole] = useState([]);

//   const [title, setTitle] = useState("");
//   const [location, setLocation] = useState("");
//   const [jobType, setJobType] = useState("");

//   const [isRefreshed, setIsRefresh] = useState(false);

//   const handleClick = (jobs) => {
//     navigate("/jobdetail", { state: { jobs } });
//   };

//   const handleRefresh = () => {
//     console.log("before refresh : ", { title, location, jobType });
//     setIsRefresh(true);
//     setFilteredJobRole(jobs);
//     console.log("after refresh : ", { title, location, jobType });
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
//     const industries = jobs.map((job) => job.industry);
//     const countries = jobs.map((job) => job.location);
//     const jobtypes = jobs.map((job) => job.jobType);
//     const jobRoles = jobs.map((job) => job.title);
//     const uniqueIndustriesSet = new Set(industries);
//     const uniqueJobRolesSet = new Set(jobRoles);
//     const uniqueCountrySet = new Set(countries);
//     const uniqueJobTypeSet = new Set(jobtypes);
//     setIndustry(Array.from(uniqueIndustriesSet));
//     setJobRole(Array.from(uniqueJobRolesSet));
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
//       jobs.filter((job) => {
//         console.log(isRefreshed);
//         setIsRefresh(false);
//         console.log(isRefreshed);
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
//   }, [currentJobRole, jobs]);

//   return (
//     <div>
//       <div className="gap-4">
//         {/* Banner Section */}
//         <Banner />
//         <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
//           <div className="flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
//             <input
//               className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
//               placeholder="Search Job Title"
//               style={{ fontFamily: "Poppins, sans-serif" }}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <select
//               className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
//               defaultValue={isRefreshed?undefined:location}
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
//               defaultValue={isRefreshed?"":jobType}
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
//           <div className="flex justify-center items-center gap-3 mt-4">
//             <button
//               className="p-3 w-full text-white transition-all bg-orange-500 rounded-md hover:bg-orange-600"
//               onClick={handleSearchChange}
//             >
//               Find Jobs
//             </button>
//             <button className="hover:text-orange-500" onClick={handleRefresh}>
//               <RefreshCcw />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row mt-5 lg:p-3">
//         {/* Filter Section */}
//         <JobFilter
//           industry={industry}
//           jobRole={jobRole}
//           handleJobRoleChange={handleJobRoleChange}
//         />
//         {/* Job Results */}
//         <JobResults filteredJob={filteredJobRole} handleClick={handleClick} />
//       </div>
//     </div>
//   );
// };

// export default JobList;



import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";
import { AuthContext } from "../context/AuthContext";
import { RefreshCcw} from "lucide-react";

const JobList = () => {
  const { handleJobRoleChange, currentJobRole, jobs} = useContext(AuthContext);
  const navigate = useNavigate();

  const [industry, setIndustry] = useState([]);
  const [jobcountry, setCountry] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [filteredJobRole, setFilteredJobRole] = useState([]);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [isRefreshed, setIsRefresh] = useState(false);

  const handleClick = (jobs) => {
    navigate("/jobdetail", { state: { jobs } });
  };

  const handleRefresh = () => {
    console.log("before refresh : ", { title, location, jobType });
    setIsRefresh(true);
    setFilteredJobRole(jobs);
    console.log("after refresh : ", { title, location, jobType });
  };


  const handleSearchChange = () => {
    console.log("searching for : ", { title, location, jobType });
    const filteredJobs = jobs.filter((job) => {
      const matchTitle = title
        ? job.title.toLowerCase().includes(title.toLowerCase())
        : true;
      const matchLocation = location
        ? job.location.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchJobType = jobType
        ? job.jobType.toLowerCase().includes(jobType.toLowerCase())
        : true;

      return matchTitle && matchLocation && matchJobType;
    });
    console.log("filtered jobs: ", { filteredJobs });
    setFilteredJobRole(filteredJobs);
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
      if (isNaN(jobDateObj)) {
        console.error("Invalid job date:", jobDate);
        return 0;
      }
      const diffTime = currentDate - jobDateObj;
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    setFilteredJobRole(
      jobs.filter((job) => {
        console.log(isRefreshed);
        setIsRefresh(false);
        console.log(isRefreshed);
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
          matchJobRole &&
          matchSalary &&
          matchExperience &&
          matchTitleAndCompany
        );
      })
    );
  }, [currentJobRole, jobs]);

  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
        <Banner />
        <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
          <div className="flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
            <input
              className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
              placeholder="Search Job Title"
              style={{ fontFamily: "Poppins, sans-serif" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
              defaultValue={isRefreshed?undefined:location}
              style={{ fontFamily: "Poppins, sans-serif" }}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="" disabled>
                Select Country
              </option>
              {jobcountry.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
              defaultValue={isRefreshed?"":jobType}
              style={{ fontFamily: "Poppins, sans-serif" }}
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

          {/* Search Button */}
          <div className="flex justify-center items-center gap-3 mt-4">
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



