
// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { isTokenExpired } from "./auth";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [industry, setIndustry] = useState([]);
//   const [isTitleEmpty, setIsTitleEmpty] = useState(false);
//   const storedUserType = localStorage.getItem("userType");

//   const navigate = useNavigate();
//   const [currentJobRole, setcurrentJobRole] = useState({
//     DatePosted: [],
//     Industry: [],
//     JobRoles: [],
//     Salary: [],
//     Experience: [],
//     Title: [],
//     Location: [],
//     JobType: [],
//     TitleAndCompany: [],
//   });

//   const [jobs, setJobs] = useState([]);
//   useEffect(() => {
//     if (isTokenExpired()) {
//       console.log("Token Expired, Logging out");
//       localStorage.clear();
//       navigate("/");
//     } else {
//       console.log("Token is valid");
//     }

//     fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
//       .then((response) => response.json())
//       .then((data) => setJobs(data))
//       .catch((error) => console.error("Error fetching jobs:", error));
//   }, []);

//   const [userType, setUserType] = useState(
//     storedUserType ? storedUserType : null
//   );

//   const login = (type) => {
//     setUserType(type);
//     localStorage.setItem("userType", type); // Store userType in localStorage
//     console.log(type);
//   };

//   const logout = () => {
//     navigate("/");
//     // setUserData(null);
//     localStorage.clear();
//     window.location.reload();
//   };

//   useEffect(() => {
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, [storedUserType]);

//   const [selectedRadio, setSelectedRadio] = useState({});
//   const [checkedOptions, setCheckedOptions] = useState({});




//   const handleJobRoleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "radio") {
//       setSelectedRadio((prev) => ({
//         ...prev,
//         [name]: value, // Store selected value per category
//       }));

//       setcurrentJobRole((prev) => ({
//         ...prev,
//         [name]: [value], // Ensure only one value for radio button categories
//       }));
//     } else if (type === "checkbox") {
//       setCheckedOptions((prev) => ({
//         ...prev,
//         [value]: checked,
//       }));
//       console.log("checked options-auth : ", value);

//       setcurrentJobRole((prev) => ({
//         ...prev,
//         [name]: checked
//           ? [...(prev[name] || []), value]
//           : (prev[name] || []).filter((v) => v !== value),
//       }));
//     } else {
//       setcurrentJobRole((prev) => ({
//         ...prev,
//         [name]: [value],
//       }));
//     }
//   };
//   useEffect(() => {
//     const industryCountMap = new Map();
//     jobs.forEach((job) => {
//       industryCountMap.set(
//         job.industry,
//         (industryCountMap.get(job.industry) || 0) + 1
//       );
//     });
//     const industryArray = Array.from(industryCountMap, ([industry, count]) => ({
//       industry,
//       count,
//     }));
//     setIndustry(industryArray);
//   }, [jobs]);

//   const [showScroll, setShowScroll] = useState(false);
//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScroll(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   const [jobRole, setJobRole] = useState([]);

//   const [companyRole, setCompanyRole] = useState([]);
//   useEffect(() => {
//     const jobRoles = jobs.map((job) => job.title);
//     const companies = jobs.map((job) => job.company);
//     const uniqueJobRolesSet = new Set(jobRoles);
//     const uniqueCompanySet = new Set(companies);

//     setJobRole(Array.from(uniqueJobRolesSet));
//     setCompanyRole(Array.from(uniqueCompanySet));
//   }, [jobs]);
//   return (
//     <AuthContext.Provider
//       value={{
//         userType,
//         login,
//         logout,
//         handleJobRoleChange,
//         setcurrentJobRole,
//         jobs,
//         currentJobRole,
//         industry,
//         showScroll,
//         jobRole,
//         companyRole,
//         checkedOptions,
//         setCheckedOptions,
//         selectedRadio,
//         setSelectedRadio,
//         setIsTitleEmpty,
//         isTitleEmpty
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "./auth";

export const AuthContext = createContext();

const publicRoutes = ['/login', '/signup', '/admin/login', '/','/joblist']; // Added home route '/'

export const AuthProvider = ({ children }) => {
  const [industry, setIndustry] = useState([]);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const storedUserType = localStorage.getItem("userType");
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('adminToken') !== null);

  const navigate = useNavigate();
  const location = useLocation();

  const [currentJobRole, setCurrentJobRole] = useState({
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

  const [jobsInfo, setJobsInfo] = useState([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const adminToken = localStorage.getItem('adminToken');
    
    if (!publicRoutes.includes(currentPath) && !adminToken && isTokenExpired()) {
      console.log("Token Expired, Logging out");
      logout();
    } else {
      console.log("Token is valid or on a public route");
    }

    // Fetch jobs info
    const fetchJobsInfo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`);
        const data = await response.json();
        setJobsInfo(data);
      } catch (error) {
        console.error("Error fetching jobsinfo:", error);
      }
    };
    
    fetchJobsInfo();
  }, [navigate, location]);

  const [userType, setUserType] = useState(storedUserType ? storedUserType : null);

  const login = (type, isAdminLogin = false) => {
    setUserType(type);
    localStorage.setItem("userType", type);
    if (isAdminLogin) {
      setIsAdmin(true);
    }
  };

  const logout = () => {
    navigate("/");
    localStorage.clear();
    setIsAdmin(false);
    setUserType(null);
    window.location.reload();
  };

  useEffect(() => {
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [storedUserType]);

  const [selectedRadio, setSelectedRadio] = useState({});
  const [checkedOptions, setCheckedOptions] = useState({});




  const handleJobRoleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentJobRole((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" || type === "radio"
          ? checked
            ? [...(prev[name] || []), value]
            : (prev[name] || []).filter((v) => v !== value)
          : [value],
    }));
  };
  useEffect(() => {
    const industryCountMap = new Map();
    console.log(jobsInfo);

    jobsInfo.forEach((jobData) => {
      const industry = jobData.job.industry; // Now using jobData.job.industry, which is a string

      if (industry) {
        industryCountMap.set(
          industry, // Using industry name directly
          (industryCountMap.get(industry) || 0) + 1
        );
      }
    });

    // Convert the Map to an array to set it in state
    const industryArray = Array.from(industryCountMap, ([industry, count]) => ({
      industry,
      count,
    }));

    setIndustry(industryArray);
  }, [jobsInfo]);

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [jobRole, setJobRole] = useState([]);
  const [companyRole, setCompanyRole] = useState([]);

  useEffect(() => {
    const jobRoles = jobsInfo.map((jobData) => jobData.job.title); // Changed to jobData.job.title
    const companies = jobsInfo.map((jobData) => jobData.job.company.name); // Changed to jobData.job.company.name
    const uniqueJobRolesSet = new Set(jobRoles);
    const uniqueCompanySet = new Set(companies);

    setJobRole(Array.from(uniqueJobRolesSet));
    setCompanyRole(Array.from(uniqueCompanySet));
  }, [jobsInfo]);

  return (
    <AuthContext.Provider
      value={{
        userType,
        login,
        logout,
        handleJobRoleChange,
        jobsInfo,
        currentJobRole,
        industry,
        showScroll,
        jobRole,
        companyRole,
        isAdmin,
        checkedOptions,
        setCheckedOptions,
        selectedRadio,
        setSelectedRadio,
        setIsTitleEmpty,
        isTitleEmpty
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};