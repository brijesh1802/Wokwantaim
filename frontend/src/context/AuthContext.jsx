import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [industry, setIndustry] = useState([]);
  const storedUserType = localStorage.getItem("userType");

  const navigate = useNavigate();
  const [currentJobRole, setcurrentJobRole] = useState({
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
    navigate("/");
    window.location.reload();
    localStorage.clear();
  };

  useEffect(() => {
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [storedUserType]);

  const handleJobRoleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setcurrentJobRole((prev) => ({
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
    jobs.forEach((job) => {
      industryCountMap.set(
        job.industry,
        (industryCountMap.get(job.industry) || 0) + 1
      );
    });
    const industryArray = Array.from(industryCountMap, ([industry, count]) => ({
      industry,
      count,
    }));
    setIndustry(industryArray);
  }, [jobs]);

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
    const jobRoles = jobs.map((job) => job.title);
    const companies = jobs.map((job) => job.company);
    const uniqueJobRolesSet = new Set(jobRoles);
    const uniqueCompanySet = new Set(companies);

    setJobRole(Array.from(uniqueJobRolesSet));
    setCompanyRole(Array.from(uniqueCompanySet));
  }, [jobs]);
  return (
    <AuthContext.Provider
      value={{
        userType,
        login,
        logout,
        handleJobRoleChange,
        jobs,
        currentJobRole,
        industry,
        showScroll,
        jobRole,
        companyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
