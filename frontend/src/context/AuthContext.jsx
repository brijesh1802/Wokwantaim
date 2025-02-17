

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

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

 

  const navigate = useNavigate();

  const [userType, setUserType] = useState(storedUserType ? storedUserType : null);

  const login = (type) => {
    setUserType(type);
    localStorage.setItem("userType", type); // Store userType in localStorage
    console.log(type);
  };

  const logout = () => {
    navigate("/")
    localStorage.clear();
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
    const industryCountMap = new Map();
    jobs.forEach((job) => {
        industryCountMap.set(job.industry, (industryCountMap.get(job.industry) || 0) + 1);
    });
    const industryArray = Array.from(industryCountMap, ([industry, count]) =>({industry,count}));
    setIndustry(industryArray);
  }, [jobs]);

  const [showScroll,setShowScroll]=useState(false)
  useEffect(()=>{
    const handleScroll=()=>{
      setShowScroll(window.scrollY>50);
    };
    window.addEventListener("scroll", handleScroll);    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AuthContext.Provider value={{ userType, login, logout,handleJobRoleChange,jobs,currentJobRole,industry,showScroll }}>
      {children}
    </AuthContext.Provider>
  );
};