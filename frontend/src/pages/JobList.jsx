import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, House, Briefcase, HandCoins, Building2, PersonStanding, MapPin, ChevronUp, ChevronDown } from 'lucide-react';
import banner from "../assets/banner1.png";
import companyLogo from "../assets/comlogo-1.png"


const JobList = () => {
  const [visibleSection, setVisibleSection] = useState({
    DatePosted: false,
    JobRoles: false,
    Salary: false,
    Industry: false,
    Experience: false,
  });

  const [showMore, setShowMore] = useState({
    DatePosted: false,
    JobRoles: false,
    Salary: false,
    Industry: false,
    Experience: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 7;

  const countries = ['India', 'USA', 'Canada', 'UK']; // Example country data
  const jobTypes = ['Full Time', 'Part Time', 'Contract']; // Example job type data
  const DatePosted = ['Last 24 hours', 'Last Week', 'Last Month', 'Older'];
  const JobRoles = ['Developer', 'Designer', 'Manager', 'Tester'];
  const Salary = ['₹10,000 - ₹20,000', '₹20,000 - ₹30,000', '₹30,000 - ₹50,000'];
  const Industry = ['IT', 'Finance', 'Healthcare', 'Marketing'];
  const Experience = ['0-2 years', '3-5 years', '5+ years'];

  const handleSection = (section) => {
    setVisibleSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleShowMore = (section) => {
    setShowMore((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const navigate=useNavigate();

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  // console.log(jobs)

  const handleClick=(jobs)=>{
    navigate('/jobdetail',{state:{jobs}})
  }

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const firstJobIndex = indexOfFirstJob + 1; // Adding 1 to make it 1-based index
  const lastJobIndex = indexOfLastJob > jobs.length ? jobs.length : indexOfLastJob; 

  console.log(totalPages);

  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
        <div
          className="flex flex-col items-center justify-center p-8 mt-6 bg-center bg-cover shadow-lg lg:h-72 min-h-52"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
        </div>

          <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
            <div className="flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
              <input
                className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
                placeholder="Job Title"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
              <select
                className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
                defaultValue=""
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <option value="" disabled>
            Select Country
                </option>
                {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
                ))}
              </select>
              <select
                className="flex-1 w-full p-3 border border-gray-300 rounded-md md:w-1/4"
                defaultValue=""
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <option value="" disabled>
            Select Job Type
                </option>
                {jobTypes.map((jobtype, index) => (
            <option key={index} value={jobtype}>
              {jobtype}
            </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
          <div className="flex justify-center mt-4">
            <button className="w-full p-3 text-white transition-all bg-orange-500 rounded-md md:w-1/3 hover:bg-orange-600">
              Find Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Filter Section */}
        <div className="flex flex-col gap-2 px-5 py-5 bg-gray-100 rounded-lg mx-7 lg:w-1/3">
          {/* Date Posted Section */}
          <div onClick={() => handleSection('DatePosted')} className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md">
            <div className="flex items-center w-full gap-2">
              <Calendar color="orange" size={30} />
              <p className="font-mono font-bold cursor-default">Date Posted</p>
            </div>
            <div>{visibleSection.DatePosted ? <ChevronUp /> : <ChevronDown />}</div>
          </div>
          <div
            className={`w-full flex flex-col justify-center items-left gap-2 px-14 ${
              visibleSection.DatePosted ? 'block' : 'hidden'
            }`}
          >
            {DatePosted.slice(0, showMore.DatePosted ? DatePosted.length : 4).map((option, index) => (
              <label key={index} className="flex gap-4 text-lg text-gray-400">
                <input type="radio" name="DatePosted" value={option} />
                <span>{option}</span>
              </label>
            ))}
            <button
              className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
              onClick={() => handleShowMore('DatePosted')}
            >
              {DatePosted.length > 4 ? (showMore.DatePosted ? 'View less' : 'View more') : ''}
            </button>
          </div>

          {/* Job Role Section */}
          <div onClick={() => handleSection('JobRoles')} className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md">
            <div className="flex items-center w-full gap-2">
              <Briefcase color="orange" size={30} />
              <p className="font-mono font-bold cursor-default">Job Role</p>
            </div>
            <div>{visibleSection.JobRoles ? <ChevronUp /> : <ChevronDown />}</div>
          </div>
          <div
            className={`w-full flex flex-col justify-center items-left px-14 gap-2 ${
              visibleSection.JobRoles ? 'block' : 'hidden'
            }`}
          >
            {JobRoles.slice(0, showMore.JobRoles ? JobRoles.length : 4).map((option, index) => (
              <label key={index} className="flex gap-4 text-lg text-gray-400">
                <input type="checkbox" name="jobrole" value={option} />
                <span>{option}</span>
              </label>
            ))}
            <button
              className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
              onClick={() => handleShowMore('JobRoles')}
            >
              {JobRoles.length > 4 ? (showMore.JobRoles ? 'View less' : 'View more') : ''}
            </button>
          </div>

          {/* Salary Section */}
          <div onClick={() => handleSection('Salary')} className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md">
            <div className="flex items-center w-full gap-2">
              <HandCoins color="orange" size={30} />
              <p className="font-mono font-bold cursor-default">Salary</p>
            </div>
            <div>{visibleSection.Salary ? <ChevronUp /> : <ChevronDown />}</div>
          </div>
          <div
            className={`flex flex-col justify-center items-left w-full px-14 gap-2 ${
              visibleSection.Salary ? 'block' : 'hidden'
            }`}
          >
            {Salary.slice(0, showMore.Salary ? Salary.length : 4).map((option, index) => (
              <label key={index} className="flex gap-4 text-lg text-gray-400">
                <input type="radio" name="salary" value={option} />
                <span>{option}</span>
              </label>
            ))}
            <button
              className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
              onClick={() => handleShowMore('Salary')}
            >
              {Salary.length > 4 ? (showMore.Salary ? 'View less' : 'View more') : ''}
            </button>
          </div>

          {/* Industry Section */}
          <div onClick={() => handleSection('Industry')} className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md">
            <div className="flex items-center w-full gap-2">
              <Building2 color="orange" size={30} />
              <p className="font-mono font-bold cursor-default">Industry</p>
            </div>
            <div>{visibleSection.Industry ? <ChevronUp /> : <ChevronDown />}</div>
          </div>
          <div
            className={`mt-2 w-full flex flex-col justify-center items-left px-14 gap-2 ${
              visibleSection.Industry ? 'block' : 'hidden'
            }`}
          >
            {Industry.slice(0, showMore.Industry ? Industry.length : 4).map((option, index) => (
              <label key={index} className="flex gap-4 text-lg text-gray-400">
                <input type="checkbox" name="industry" value={option} />
                <span>{option}</span>
              </label>
            ))}
            <button
              className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
              onClick={() => handleShowMore('Industry')}
            >
              {Industry.length > 4 ? (showMore.Industry ? 'View less' : 'View more') : ''}
            </button>
          </div>

          {/* Experience Section */}
          <div onClick={() => handleSection('Experience')} className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md">
            <div className="flex items-center w-full gap-2">
              <PersonStanding color="orange" size={30} />
              <p className="font-mono font-bold cursor-default">Experience</p>
            </div>
            <div>{visibleSection.Experience ? <ChevronUp /> : <ChevronDown />}</div>
          </div>
          <div
            className={`w-full flex flex-col justify-center items-left px-14 gap-2 ${
              visibleSection.Experience ? 'block' : 'hidden'
            }`}
          >
            {Experience.slice(0, showMore.Experience ? Experience.length : 4).map((option, index) => (
              <label key={index} className="flex gap-4 text-lg text-gray-400">
                <input type="checkbox" name="experience" value={option} />
                <span>{option}</span>
              </label>
            ))}
            <button
              className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
              onClick={() => handleShowMore('Experience')}
            >
              {Experience.length > 4 ? (showMore.Experience ? 'View less' : 'View more') : ''}
            </button>
          </div>
        </div>

        {/* Job Results */}
        <div className="flex flex-col mb-10 lg:w-3/4 mt-9 lg:mt-0">
          <div className="flex items-center justify-between mx-4 rounded-md lg:bg-gray-100 lg:h-20">
          <p className="text-sm">
            Showing {firstJobIndex}-{lastJobIndex} of {jobs.length} Job Results:
          </p>
            <div>
              <span className="text-sm">Sort By : </span>
              <select className="text-gray-400 bg-transparent">
                <option value="" disabled>
                  Select
                </option>
                <option value="ascending">A-Z</option>
                <option value="decending">Z-A</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-full gap-3 py-5 mx-5 mt-3 rounded">
              {currentJobs.map((job, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between w-full max-w-3xl p-4 mx-4 my-3 transition bg-white shadow-md hover:shadow-lg"
                  onClick={()=>handleClick(job._id)}
                >
                  {/* Job details */}
                  <div className="flex-shrink-0 rounded-lg bg-slate-400" style={{
                    backgroundImage: `url(${job.companyLogo || companyLogo})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    height: "60px",
                    width: "60px",
                  }}></div>
                  
                  <div className="flex-1 ml-4">
                    {/* Company and Title */}
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-800 cursor-pointer hover:text-orange-500">
                        {job.company}
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        ₹{job.salary.toLocaleString()} PM
                      </p>
                    </div>
                    <p className="mt-1 text-base font-medium text-gray-700">{job.title}</p>

                    {/* Location, Experience, Job Type */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="text-orange-500" />
                        <span className="ml-1">{job.location}</span>
                      </p>
                      <p className="text-gray-600">| {job.experienceLevel}</p>
                      <p className="text-gray-600">| {job.jobType}</p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-full">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination Controls */}
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-l-md"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-r-md"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
      </div>
      </div>
     </div>
  );
};


export default JobList;