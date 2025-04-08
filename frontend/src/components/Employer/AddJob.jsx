// import React, { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import { FiBriefcase, FiMapPin, FiCalendar, FiChevronDown, FiDollarSign, FiFileText, FiTool } from "react-icons/fi";
// import axios from "axios";

// const AddJob = () => {
//   const [job, setJob] = useState({
//     title: "",
//     company: "",
//     location: "",
//     salary: "",
//     description: "",
//     requirements: "",
//     jobType: "",
//     experienceLevel: "",
//     skills: "",
//     industry: "",
//     applicationDeadline: "",
//     applicationPostedDate: new Date().toISOString().split("T")[0],
//   });

//   const [formError, setFormError] = useState("");
//   const [jobTypes, setJobTypes] = useState([]);
//   const [experienceLevels, setExperienceLevels] = useState([]);
//   const [industries, setIndustries] = useState([]);
//   const [companies, setCompanies] = useState([]);
  
  
//   const [isOpen, setIsOpen] = useState({
//     company: false,
//     jobType: false,
//     experienceLevel: false,
//     industry: false,
//   });
  
//   const dropdownRefs = {
//     company: useRef(null),
//     jobType: useRef(null),
//     experienceLevel: useRef(null),
//     industry: useRef(null),
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [jobTypeRes, expLevelRes, industryRes, companyRes] =
//           await Promise.all([
//             axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getJobTypes`),
//             axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getExperienceLevels`),
//             axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getIndustries`),
//             axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getCompanies`),
//           ]);

//         setJobTypes(jobTypeRes.data || []);
//         setExperienceLevels(expLevelRes.data || []);
//         setIndustries(industryRes.data || []);
//         setCompanies(companyRes.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       Object.keys(dropdownRefs).forEach((key) => {
//         if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
//           setIsOpen(prev => ({ ...prev, [key]: false }));
//         }
//       });
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setJob((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSearch = (field, searchTerm) => {
//     // Clear the ID if search term doesn't match current selection
//     const currentItem = companies.find(item => item._id === job[field]);
//     if (!currentItem?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//       setJob(prev => ({ ...prev, [field]: '' }));
//     }
//     // Update search filter
//     const filtered = data.filter(item =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredData(prev => ({ ...prev, [field]: filtered }));
//   };
  
//   const handleSelect = (field, id) => {
//     setJob(prev => ({
//       ...prev,
//       [field]: id // Store the ID in state
//     }));
//     setIsOpen(prev => ({ ...prev, [field]: false }));
//   };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     const requiredFields = [
//       'title', 'company', 'location', 'salary', 'description',
//       'jobType', 'experienceLevel', 'industry', 'applicationDeadline'
//     ];
    
//     if (requiredFields.some(field => !job[field])) {
//       setFormError("Please fill in all required fields.");
//       return;
//     }

//     const formattedJob = {
//       ...job,
//       requirements: job.requirements.split(",").map(req => req.trim()),
//       skills: job.skills.split(",").map(skill => skill.trim()),
//       salary: parseFloat(job.salary),
//       applicationDeadline: new Date(job.applicationDeadline).toISOString(),
//       applicationPostedDate: new Date().toISOString()
//     };

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BASE_URL}/api/v1/jobs/addJob`,
//         formattedJob
//       );

//       console.log("Job added successfully:", response.data);
//       // Reset form
//       setJob({
//         title: "",
//         company: "",
//         location: "",
//         salary: "",
//         description: "",
//         requirements: "",
//         jobType: "",
//         experienceLevel: "",
//         skills: "",
//         industry: "",
//         applicationDeadline: "",
//         applicationPostedDate: new Date().toISOString().split("T")[0],
//       });
      
//     } catch (error) {
//       console.error("Error adding job:", error);
//       setFormError(error.response?.data?.message || "Failed to add job. Please try again.");
//     }
//   };

//   const renderDropdown = (field, data, placeholder) => {
//     // Find selected item to display its name
//     const selectedItem = data.find(item => item._id === job[field]);
    
//     return (
//       <div className="relative" ref={dropdownRefs[field]}>
//         <div className="relative">
//           <input
//             className="border rounded w-full py-2 px-3 pr-8"
//             type="text"
//             placeholder={placeholder}
//             value={selectedItem?.name || ''} // Display name instead of ID
//             onChange={(e) => handleSearch(field, e.target.value)}
//             onClick={() => setIsOpen(prev => ({ ...prev, [field]: true }))}
//             required
//           />
//           <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
//         </div>
        
//         {isOpen[field] && (
//           <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
//             {data.filter(item => 
//               item.name.toLowerCase().includes(job[field].toLowerCase())
//             ).map(item => (
//               <div
//                 key={item._id}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => handleSelect(field, item._id, item.name)}
//               >
//                 {item.name}
//               </div>
//             ))}
//             {data.filter(item => 
//               item.name.toLowerCase().includes(job[field].toLowerCase())
//             ).length === 0 && (
//               <div className="px-4 py-2 text-gray-500">No options found</div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };
  

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto"
//     >
//       <h2 className="text-4xl font-bold text-orange-600 mb-8">Add New Job</h2>
//       {formError && (
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-red-500 mb-6 p-4 bg-red-100 rounded-lg"
//         >
//           {formError}
//         </motion.p>
//       )}
  
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Job Title */}
//           <div className="col-span-2">
//             <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//               <FiBriefcase className="mr-2 text-orange-500" /> Job Title
//             </label>
//             <input
//               className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//               type="text"
//               placeholder="Enter job title"
//               name="title"
//               value={job.title}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
//           {/* Company */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Company</label>
//             {renderDropdown('company', companies, "Search company...")}
//           </div>
  
//           {/* Location */}
//           <div>
//             <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//               <FiMapPin className="mr-2 text-orange-500" /> Location
//             </label>
//             <input
//               className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//               type="text"
//               placeholder="Enter location"
//               name="location"
//               value={job.location}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
//           {/* Industry */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Industry</label>
//             {renderDropdown('industry', industries, "Select Industry")}
//           </div>
  
//           {/* Salary */}
//           <div>
//             <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//               <FiDollarSign className="mr-2 text-orange-500" /> Salary Per Annum (INR)
//             </label>
//             <input
//               className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//               type="number"
//               placeholder="Enter salary"
//               name="salary"
//               value={job.salary}
//               onChange={handleChange}
//               required
//             />
//           </div>
  
//           {/* Job Type */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Job Type</label>
//             {renderDropdown('jobType', jobTypes, "Select Job Type")}
//           </div>
  
//           {/* Experience Level */}
//           <div>
//             <label className="block text-gray-700 text-sm font-semibold mb-2">Experience Level</label>
//             {renderDropdown('experienceLevel', experienceLevels, "Select Experience Level")}
//           </div>
  
//           {/* Application Deadline */}
//           <div>
//             <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//               <FiCalendar className="mr-2 text-orange-500" /> Application Deadline
//             </label>
//             <input
//               className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//               type="date"
//               name="applicationDeadline"
//               value={job.applicationDeadline}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>
  
//         {/* Description */}
//         <div>
//           <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//             <FiFileText className="mr-2 text-orange-500" /> Description
//           </label>
//           <textarea
//             className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//             placeholder="Enter job description"
//             name="description"
//             value={job.description}
//             onChange={handleChange}
//             required
//             rows="4"
//           />
//         </div>
  
//         {/* Requirements */}
//         <div>
//           <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//             <FiTool className="mr-2 text-orange-500" /> Requirements (comma-separated)
//           </label>
//           <input
//             className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//             type="text"
//             placeholder="Enter requirements"
//             name="requirements"
//             value={job.requirements}
//             onChange={handleChange}
//           />
//         </div>
  
//         {/* Skills */}
//         <div>
//           <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
//             <FiTool className="mr-2 text-orange-500" /> Skills (comma-separated)
//           </label>
//           <input
//             className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
//             type="text"
//             placeholder="Enter skills"
//             name="skills"
//             value={job.skills}
//             onChange={handleChange}
//           />
//         </div>
  
//         {/* Submit Button */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           type="submit"
//           className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl w-full transition-colors duration-300 shadow-lg hover:shadow-xl"
//         >
//           Add Job
//         </motion.button>
//       </form>
//     </motion.div>
//   );
  
// };

// export default AddJob;


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiMapPin, FiCalendar, FiChevronDown, FiDollarSign, FiFileText, FiTool } from "react-icons/fi";
import axios from "axios";

const AddJob = () => {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    jobType: "",
    experienceLevel: "",
    skills: "",
    industry: "",
    applicationDeadline: "",
    applicationPostedDate: new Date().toISOString().split("T")[0],
  });

  const [formError, setFormError] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employerJobIds,setEmployerJobIds]=useState([]);
  
  const [isOpen, setIsOpen] = useState({
    company: false,
    jobType: false,
    experienceLevel: false,
    industry: false,
  });
  
  const dropdownRefs = {
    company: useRef(null),
    jobType: useRef(null),
    experienceLevel: useRef(null),
    industry: useRef(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobTypeRes, expLevelRes, industryRes, companyRes] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getJobTypes`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getExperienceLevels`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getIndustries`),
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/admin/getCompanies`),
          ]);

        setJobTypes(jobTypeRes.data || []);
        setExperienceLevels(expLevelRes.data || []);
        setIndustries(industryRes.data || []);
        setCompanies(companyRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((key) => {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setIsOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (field, searchTerm) => {
    // Clear the ID if search term doesn't match current selection
    const currentItem = companies.find(item => item._id === job[field]);
    if (!currentItem?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      setJob(prev => ({ ...prev, [field]: '' }));
    }
    // Update search filter
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(prev => ({ ...prev, [field]: filtered }));
  };
  
  const handleSelect = (field, id) => {
    setJob(prev => ({
      ...prev,
      [field]: id // Store the ID in state
    }));
    setIsOpen(prev => ({ ...prev, [field]: false }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const requiredFields = [
      'title', 'company', 'location', 'salary', 'description',
      'jobType', 'experienceLevel', 'industry', 'applicationDeadline'
    ];
    
    if (requiredFields.some(field => !job[field])) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const formattedJob = {
      ...job,
      requirements: job.requirements.split(",").map(req => req.trim()),
      skills: job.skills.split(",").map(skill => skill.trim()),
      salary: parseFloat(job.salary),
      applicationDeadline: new Date(job.applicationDeadline).toISOString(),
      applicationPostedDate: new Date().toISOString()
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/jobs/addJob`,
        formattedJob
      );

      console.log("Job added successfully:", response.data);
      // Reset form
      setJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        requirements: "",
        jobType: "",
        experienceLevel: "",
        skills: "",
        industry: "",
        applicationDeadline: "",
        applicationPostedDate: new Date().toISOString().split("T")[0],
      });
      
    } catch (error) {
      console.error("Error adding job:", error);
      setFormError(error.response?.data?.message || "Failed to add job. Please try again.");
    }
  };

  const renderDropdown = (field, data, placeholder) => {
    // Find selected item to display its name
    const selectedItem = data.find(item => item._id === job[field]);
    
    return (
      <div className="relative" ref={dropdownRefs[field]}>
        <div className="relative">
          <input
            className="border rounded w-full py-2 px-3 pr-8"
            type="text"
            placeholder={placeholder}
            value={selectedItem?.name || ''} // Display name instead of ID
            onChange={(e) => handleSearch(field, e.target.value)}
            onClick={() => setIsOpen(prev => ({ ...prev, [field]: true }))}
            required
          />
          <FiChevronDown className="absolute right-3 top-3 text-gray-500" />
        </div>
        
        {isOpen[field] && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {data.filter(item => 
              item.name.toLowerCase().includes(job[field].toLowerCase())
            ).map(item => (
              <div
                key={item._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(field, item._id, item.name)}
              >
                {item.name}
              </div>
            ))}
            {data.filter(item => 
              item.name.toLowerCase().includes(job[field].toLowerCase())
            ).length === 0 && (
              <div className="px-4 py-2 text-gray-500">No options found</div>
            )}
          </div>
        )}
      </div>
    );
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-bold text-orange-600 mb-8">Add New Job</h2>
      {formError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-6 p-4 bg-red-100 rounded-lg"
        >
          {formError}
        </motion.p>
      )}
  
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="col-span-2">
            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <FiBriefcase className="mr-2 text-orange-500" /> Job Title
            </label>
            <input
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              type="text"
              placeholder="Enter job title"
              name="title"
              value={job.title}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Company */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Company</label>
            {renderDropdown('company', companies, "Search company...")}
          </div>
  
          {/* Location */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <FiMapPin className="mr-2 text-orange-500" /> Location
            </label>
            <input
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              type="text"
              placeholder="Enter location"
              name="location"
              value={job.location}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Industry */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Industry</label>
            {renderDropdown('industry', industries, "Select Industry")}
          </div>
  
          {/* Salary */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <FiDollarSign className="mr-2 text-orange-500" /> Salary Per Annum (INR)
            </label>
            <input
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              type="number"
              placeholder="Enter salary"
              name="salary"
              value={job.salary}
              onChange={handleChange}
              required
            />
          </div>
  
          {/* Job Type */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Job Type</label>
            {renderDropdown('jobType', jobTypes, "Select Job Type")}
          </div>
  
          {/* Experience Level */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">Experience Level</label>
            {renderDropdown('experienceLevel', experienceLevels, "Select Experience Level")}
          </div>
  
          {/* Application Deadline */}
          <div>
            <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <FiCalendar className="mr-2 text-orange-500" /> Application Deadline
            </label>
            <input
              className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
              type="date"
              name="applicationDeadline"
              value={job.applicationDeadline}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
  
        {/* Description */}
        <div>
          <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FiFileText className="mr-2 text-orange-500" /> Description
          </label>
          <textarea
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            placeholder="Enter job description"
            name="description"
            value={job.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>
  
        {/* Requirements */}
        <div>
          <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FiTool className="mr-2 text-orange-500" /> Requirements (comma-separated)
          </label>
          <input
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            type="text"
            placeholder="Enter requirements"
            name="requirements"
            value={job.requirements}
            onChange={handleChange}
          />
        </div>
  
        {/* Skills */}
        <div>
          <label className="text-gray-700 text-sm font-semibold mb-2 flex items-center">
            <FiTool className="mr-2 text-orange-500" /> Skills (comma-separated)
          </label>
          <input
            className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            type="text"
            placeholder="Enter skills"
            name="skills"
            value={job.skills}
            onChange={handleChange}
          />
        </div>
  
        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl w-full transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          Add Job
        </motion.button>
      </form>
    </motion.div>
  );
  
};

export default AddJob;
