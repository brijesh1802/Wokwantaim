// import { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // Check if there's a saved userType in localStorage
//   const storedUserType = localStorage.getItem("userType");

//   const [userType, setUserType] = useState(storedUserType ? storedUserType : null);

//   const login = (type) => {
//     setUserType(type);
//     localStorage.setItem("userType", type); // Store userType in localStorage
//     console.log(type);
//   };

//   const logout = () => {
//     setUserType(null);
//     localStorage.removeItem("userType"); // Remove userType from localStorage
//     localStorage.clear(); // Optional: Remove all other localStorage data
//   };

//   useEffect(() => {
//     // If there's a userType in localStorage on page load, set it
//     if (storedUserType) {
//       setUserType(storedUserType);
//     }
//   }, [storedUserType]);

//   return (
//     <AuthContext.Provider value={{ userType, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [industry, setIndustry] = useState([]);
  const storedUserType = localStorage.getItem("userType");
  const [currentJobRole, setcurrentJobRole] = useState({
    DatePosted: [],
    Industry: [],
    JobRoles: [],
    Salary: [],
    Experience: [],
    Title: [],
    Location: [],
    JobType: [],
    TitleAndCompany:[]
  });

  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  const [userType, setUserType] = useState(
    storedUserType ? storedUserType : null
  );

  const login = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type); // Store userType in localStorage
    console.log(type);
  };

  const logout = () => {
    setUserType(null);
    localStorage.removeItem("userType"); // Remove userType from localStorage
    localStorage.clear(); // Optional: Remove all other localStorage data
  };

  useEffect(() => {
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [storedUserType]);

  const handleJobRoleChange = (e) => {
    const { name, value, type,checked } = e.target;
    setcurrentJobRole((prev) => ({
      ...prev,
      [name]: 
      type==='checkbox' || type==='radio'?
      checked
        ? [...(prev[name] || []), value]
        : (prev[name] || []).filter((v) => v !== value):
        [value]
    }));
  };

useEffect(() => {
    const industries = jobs.map((job) => job.industry);
    const uniqueIndustriesSet = new Set(industries);
    setIndustry(Array.from(uniqueIndustriesSet));
  }, [jobs]);

  return (
    <AuthContext.Provider value={{ userType, login, logout,handleJobRoleChange,jobs,currentJobRole,industry }}>
      {children}
    </AuthContext.Provider>
  );
};
