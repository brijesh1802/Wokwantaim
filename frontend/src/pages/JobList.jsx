

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Banner from "../components/Banner";
// import JobFilter from "../components/JobFilter";
// import JobResults from "../components/JobResults";

// const JobList = () => {
//   const countries = ["India", "USA", "Canada", "UK"]; // Example country data
//   const jobTypes = ["Full Time", "Part Time", "Contract"]; // Example job type data
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [industry, setIndustry] = useState([]);
//   const [jobRole, setJobRole] = useState([]);
//   const [currentJobRole, setcurrentJobRole] = useState({
//     DatePosted: [],
//     Industry: [],
//     JobRoles: [],
//     Salary: [],
//     Experience: [],
//   });
//   const [filteredJobRole, setFilteredJobRole] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query

//   const handleJobRoleChange = (e) => {
//     const { name, value, checked } = e.target;
//     setcurrentJobRole((prev) => ({
//       ...prev,
//       [name]: checked
//         ? [...(prev[name] || []), value]
//         : (prev[name] || []).filter((v) => v !== value),
//     }));
//   };

//   const handleClick = (jobs) => {
//     navigate("/jobdetail", { state: { jobs } });
//   };
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value.toLowerCase());
//   };

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
//       .then((response) => response.json())
//       .then((data) => setJobs(data))
//       .catch((error) => console.error("Error fetching jobs:", error));
//   }, []);

//   useEffect(() => {
    
//     const industries = jobs.map((job) => job.industry);
//     const jobRoles = jobs.map((job) => job.title);
//     const uniqueIndustriesSet = new Set(industries);
//     const uniqueJobRolesSet = new Set(jobRoles);
//     setIndustry(Array.from(uniqueIndustriesSet));
//     setJobRole(Array.from(uniqueJobRolesSet));
//   }, [jobs]);

//   useEffect(() => {
//     const getDaysDifference = (jobDate) => {
//       // Ensure jobDate is in the correct format
//       const currentDate = new Date();
//       const jobDateObj = new Date(jobDate);
      
//       // Check if jobDate is a valid date
//       if (isNaN(jobDateObj)) {
//         console.error("Invalid job date:", jobDate);
//         return 0;
//       }
      
//       const diffTime = currentDate - jobDateObj; // Difference in milliseconds
//       return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
//     };
  
//     setFilteredJobRole(
//       jobs.filter((job) => {
//         const daysAgo = getDaysDifference(job.applicationPostedDate); // Ensure this is the correct field
  
//         console.log(`Job: ${job.title}, Date Posted: ${job.applicationPostedDate}, Days Ago: ${daysAgo}`);
  
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
  
//         const matchExperience =
//           !currentJobRole.Experience.length ||
//           currentJobRole.Experience.some((range) => {
//             if (range === "0-2 years")
//               return job.experienceYearsMin >= 0 && job.experienceYearsMin <= 2;
//             if (range === "3-5 years")
//               return job.experienceYearsMin >= 2 && job.experienceYearsMin <= 5;
//             if (range === "5+ years") return job.experienceYearsMin >= 5;
//             return false;
//           });
  
//         return (
//           matchDate &&
//           matchIndustry &&
//           matchJobRole &&
//           matchSalary &&
//           matchExperience
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
//               placeholder="Job Title"
//               style={{ fontFamily: "Poppins, sans-serif" }}
//             />
//             <select
//               className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
//               defaultValue=""
//               style={{ fontFamily: "Poppins, sans-serif" }}
//             >
//               <option value="" disabled>
//                 Select Country
//               </option>
//               {countries.map((country, index) => (
//                 <option key={index} value={country}>
//                   {country}
//                 </option>
//               ))}
//             </select>
//             <select
//               className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
//               defaultValue=""
//               style={{ fontFamily: "Poppins, sans-serif" }}
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
//           <div className="flex justify-center mt-4">
//             <button className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600">
//               Find Jobs
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row">
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


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import JobFilter from "../components/JobFilter";
import JobResults from "../components/JobResults";

const JobList = () => {
  const countries = ["India", "USA", "Canada", "UK"]; // Example country data
  const jobTypes = ["Full-time", "Part-Time", "Contract"]; // Example job type data
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [currentJobRole, setcurrentJobRole] = useState({
    DatePosted: [],
    Industry: [],
    JobRoles: [],
    Salary: [],
    Experience: [],
    Title:[],
    Location:[],
    JobType:[]
  });
  const [filteredJobRole, setFilteredJobRole] = useState([]);

  const [title,setTitle]=useState("");
  const [location,setLocation]=useState("");
  const [jobType,setJobType]=useState("");

  const handleJobRoleChange = (e) => {
    const { name, value, checked } = e.target;
    setcurrentJobRole((prev) => ({
      ...prev,
      [name]: checked
        ? [...(prev[name] || []), value]
        : (prev[name] || []).filter((v) => v !== value),
    }));
  };

  const handleClick = (jobs) => {
    navigate("/jobdetail", { state: { jobs } });
  };

  // Handle search input change
  const handleSearchChange = () => {
    console.log('searching for : ',{title,location,jobType})
    const filteredJobs = jobs.filter((job) => {
      const matchTitle = title ? job.title.toLowerCase().includes(title.toLowerCase()) : true;
      const matchLocation = location ? job.location.toLowerCase().includes(location.toLowerCase()) : true;
      const matchJobType = jobType ? job.jobType.toLowerCase().includes(jobType.toLowerCase()) : true;
    
      return matchTitle && matchLocation && matchJobType;
    });
    console.log('filtered jobs: ',{filteredJobs})
    setFilteredJobRole(filteredJobs)
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  useEffect(() => {
    const industries = jobs.map((job) => job.industry);
    const jobRoles = jobs.map((job) => job.title);
    const uniqueIndustriesSet = new Set(industries);
    const uniqueJobRolesSet = new Set(jobRoles);
    setIndustry(Array.from(uniqueIndustriesSet));
    setJobRole(Array.from(uniqueJobRolesSet));
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
        const daysAgo = getDaysDifference(job.applicationPostedDate);

        const matchDate =
          !currentJobRole.DatePosted.length ||
          (currentJobRole.DatePosted.includes("Last 24 hours") && daysAgo <= 1) ||
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
              return job.experienceYearsMin >= 0 && job.experienceYearsMin <= 2;
            if (range === "3-5 years")
              return job.experienceYearsMin >= 2 && job.experienceYearsMin <= 5;
            if (range === "5+ years") return job.experienceYearsMin >= 5;
            return false;
          });

        

        return (
          matchDate &&
          matchIndustry &&
          matchJobRole &&
          matchSalary &&
          matchExperience
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
              onChange={(e)=>setTitle(e.target.value)}
            />
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
              defaultValue=""
              style={{ fontFamily: "Poppins, sans-serif" }}
              onChange={(e)=>setLocation(e.target.value)}
            >
              <option value="" disabled>
                Select Country
              </option >
              {countries.map((country, index) => (
                <option key={index} value={country} >
                  {country}
                </option>
              ))}
            </select>
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
              defaultValue=""
              style={{ fontFamily: "Poppins, sans-serif" }}
              onChange={(e)=>setJobType(e.target.value)}
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
          <div className="flex justify-center mt-4">
            <button className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600"
            onClick={handleSearchChange}>
              Find Jobs
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
