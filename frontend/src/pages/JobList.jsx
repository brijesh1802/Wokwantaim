import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobFilter from "../components/JobFilter";
import JobResults from '../components/JobResults'
import {
  Calendar,
  House,
  Briefcase,
  HandCoins,
  Building2,
  PersonStanding,
  MapPin,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import companyLogo from "../assets/comlogo-1.png";
import Banner from "../components/Banner";

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

 
  const countries = ["India", "USA", "Canada", "UK"]; // Example country data
  const jobTypes = ["Full Time", "Part Time", "Contract"]; // Example job type data
  const DatePosted = ["Last 24 hours", "Last Week", "Last Month", "Older"];
  const JobRoles = ["Administrator", "Specialist", "Manager", "Engineer"];
  const Salary = [
    "₹10,000 - ₹20,000",
    "₹20,000 - ₹30,000",
    "₹30,000 - ₹50,000",
  ];
  const Industry = ["IT", "Finance", "Healthcare", "Marketing"];
  const Experience = ["0-2 years", "3-5 years", "5+ years"];

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

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [currentJoleRole, setcurrentJoleRole] = useState([]);
  const [filteredJobRole, setFilteredJobRole] = useState([]);
  const handleJobRoleChange = (e) => {
    const { value, checked } = e.target;
    setcurrentJoleRole((prev) =>
      checked
        ? [...prev, value]
        : prev.filter((v) => v!== value)
    );
  };
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  // console.log(jobs)

  
  useEffect(() => {
    setFilteredJobRole(
      jobs.filter((job) =>
        currentJoleRole.some((role) =>
          job.title.toLowerCase().includes(role.toLowerCase()||job.industry.toLowerCase().includes(role.toLowerCase))
        )
      )
    );
  }, [currentJoleRole, jobs]);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 7;

  
  const filteredJob=filteredJobRole.length>0?filteredJobRole:jobs
  

  //console.log(totalPages);
  console.log(currentJoleRole)

  return (
    <div>
      <div className="gap-4">
        {/* Banner Section */}
       

    <Banner/>

        <div className="px-4 py-8 -mt-10 bg-gray-100 rounded-md lg:mx-8 lg:-mt-16">
          <div className="flex flex-col flex-wrap w-full gap-4 text-lg md:flex-row justify-evenly">
            <input
              className="w-full p-3 border border-gray-300 rounded-md md:w-1/3 focus:outline-none"
              placeholder="Job Title"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <select
              className="flex-1 w-full p-3 border border-gray-300 rounded-md cursor-pointer md:w-1/4"
              defaultValue=""
              style={{ fontFamily: "Poppins, sans-serif" }}
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
              style={{ fontFamily: "Poppins, sans-serif" }}
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
        <JobFilter handleJobRoleChange={handleJobRoleChange}/>
        {/* Job Results */}
        <JobResults  filteredJob={filteredJob} />
      </div>
    </div>
  );
};

export default JobList;
