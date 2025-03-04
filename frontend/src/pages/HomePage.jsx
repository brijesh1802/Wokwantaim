import { Link } from "react-router-dom";

import {
  Search,
  Briefcase,
  Users,
  Building2,
  BarChart2,
  ArrowRight,
} from "lucide-react";
import { useContext ,useEffect,useState} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import JobInterviews from "./JobInterviews";
import FeaturedJobCategories from "../components/Home/Featured/FeaturedJobCategories";

function HomePage() {
  const AlertBox = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="w-full max-w-sm p-5 bg-white rounded-md shadow-lg">
          <h3 className="text-lg text-center text-orange-600">{message}</h3>
          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const { userType, handleJobRoleChange, jobRole, companyRole } =
    useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSearchJob, setFilteredSearchJob] = useState("");
  const [showDropdown, setShowDropDown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setShowAlert(true);
    } else {
      navigate("/joblist");
    }
  };
  const closeAlert = () => {
    setShowAlert(false);
  };
  useEffect(() => {
    console.log("searchTerm : ", searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredSearchJob([]);
      setShowDropDown(false);
      return;
    }
    const filteredJobRole = jobRole.filter((role) =>
      role.toLowerCase().includes(value.toLowerCase())
    );
    const filteredCompanyRole = companyRole.filter((role) =>
      role.toLowerCase().includes(value.toLowerCase())
    );
    const combinedFilteredRole = Array.from(
      new Set([...filteredJobRole, ...filteredCompanyRole])
    );
    console.log(combinedFilteredRole.length);
    setFilteredSearchJob(combinedFilteredRole);
    setShowDropDown(combinedFilteredRole.length > 0);
  };


  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setFilteredSearchJob([]);
    setShowDropDown(false);
    console.log(searchTerm);
  };
  useEffect(() => {
    if (searchTerm) {
      handleJobRoleChange({
        target: { name: "TitleAndCompany", value: searchTerm, type: "text" },
      });
    }
  }, [searchTerm]);
  useEffect(() => {
    console.log("Search Term Updated:", searchTerm);
    console.log("Filtered Jobs:", filteredSearchJob);
    console.log("Dropdown State:", showDropdown);
  }, [searchTerm, filteredSearchJob, showDropdown]);

  const StatItem = ({ icon, value, label }) => (
    <div className="flex flex-col items-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 hover:bg-opacity-20 hover:transform hover:scale-105 w-64">
      {icon}
      <CountUp 
        end={parseInt(value.replace(/,/g, ''))} 
        duration={2.5}
        separator=","
        className="my-2 text-3xl font-bold"
      />
      <p className="text-xl font-medium text-center text-orange-100">{label}</p>
    </div>
  );

  const stats = [
      {
        icon: <Briefcase className="w-12 h-12 mx-auto mb-4 text-orange-300" />,
        value: "10,000+",
        label: "Job Opportunities",
      },
      {
        icon: <Users className="w-12 h-12 mx-auto mb-4 text-orange-300" />,
        value: "5,000+",
        label: "Talented Professionals",
      },
      {
        icon: <Building2 className="w-12 h-12 mx-auto mb-4 text-orange-300" />,
        value: "1,000+",
        label: "Partner Companies",
      },
    ];


  const steps = [
        {
          icon: <Users className="w-12 h-12 text-orange-500" />,
          title: "Create an Account",
          description: "Sign up and complete your profile to showcase your skills and experience.",
        },
        {
          icon: <Search className="w-12 h-12 text-orange-500" />,
          title: "Search Jobs",
          description: "Browse through thousands of job listings or let our AI match you with the best opportunities.",
        },
        {
          icon: <BarChart2 className="w-12 h-12 text-orange-500" />,
          title: "Apply and Succeed",
          description: "Apply to your dream jobs with just a click and track your application status in real-time.",
        },
      ];

  return (
    <div >
      {/* Hero Section */}
      <section className="py-24 text-white bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 mt-10">
  <div className="container px-4 mx-auto">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl">
        Discover Your Dream Career
      </h1>
      <p className="mb-10 text-xl font-light text-orange-100">
        Connecting ambitious professionals with extraordinary opportunities
      </p>
      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center p-1 bg-white bg-opacity-40 backdrop-blur-lg rounded-full shadow-2xl">
          <input
            type="text"
            placeholder="Search job title or company"
            className="flex-grow px-4 py-3 text-white bg-transparent rounded-full focus:outline-none placeholder-white placeholder-opacity-70"
            name='TitleAndCompany'
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
            onFocus={() => setShowDropDown(filteredSearchJob.length > 0)}
          />
          <button 
            className="flex items-center px-5 py-3 font-medium text-orange-500 mr-1 transition-all duration-300 bg-white rounded-full hover:bg-orange-50 hover:shadow-lg"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5 mr-1 stroke-[3]" />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && (
          <div className="absolute left-0 w-full mt-3 bg-white bg-opacity-95 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-2xl top-full max-h-80 overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">Suggestions</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {filteredSearchJob.map((title, index) => (
                  <div
                    key={index}
                    className="group flex items-center px-4 py-3 cursor-pointer rounded-xl hover:bg-orange-50 transition-all duration-300 ease-in-out"
                    onClick={() => handleSuggestionClick(title)}
                  >
                    <div className="ml-4">
                      <p className="text-gray-800 font-medium">{title}</p>
                    </div>
                    <div className="ml-auto">
                      <ArrowRight className="w-5 h-5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"  />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</section>



      {/* Featured Categories */}
      <section className="py-5 px-5 bg-gradient-to-b from-orange-50 to-white">
        <FeaturedJobCategories sectionTitle="Featured Job Categories" />
      </section>

      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        {userType === "candidate" ? <JobInterviews /> : null}
      </section>

      {/* Statistics Section */}
      <section className="py-10 text-white bg-gradient-to-br from-orange-500 to-orange-600 overflow-hidden relative">
        <div className="container  mx-auto relative ">
          <h2 className="mb-16 text-4xl font-bold text-center">Our Impact in Numbers</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {stats.map((stat, index) => (
              <StatItem key={index} {...stat} />
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-64 h-64 bg-orange-400 rounded-full opacity-20 absolute -top-32 -left-32"></div>
          <div className="w-64 h-64 bg-orange-300 rounded-full opacity-20 absolute -bottom-32 -right-32"></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container px-4 mx-auto">
        <h2 className="mb-16 text-4xl font-bold text-center text-gray-800">
          How It <span className="text-orange-500">Works</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center max-w-xs">
              <div className="flex items-center justify-center w-24 h-24 mb-6 bg-white rounded-full shadow-lg">
                <div className="flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">{step.title}</h3>
              <p className="text-center text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {userType === null && (
  <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
    <div className="container px-4 mx-auto text-center relative z-10">
      <h2 className="mb-6 text-4xl font-extrabold text-gray-800 leading-tight">
        Ready to <span className="text-orange-500">Elevate</span> Your Career?
      </h2>
      <p className="mb-10 text-xl text-gray-600 max-w-2xl mx-auto">
        Join thousands of professionals discovering exciting opportunities and landing their dream jobs every day.
      </p>
      <Link
        to="/signup"
        className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-orange-500 rounded-full hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-1"
      >
        Get Started Now
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
    
    {/* Background decorative elements */}
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-0 left-0 w-48 h-48 bg-orange-300 rounded-full opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-400 rounded-full opacity-20 transform translate-x-1/4 translate-y-1/4"></div>
    </div>
  </section>
      )}

    </div>
  );
}

export default HomePage;
