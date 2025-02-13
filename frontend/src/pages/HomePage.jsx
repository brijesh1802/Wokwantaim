


// import { Link, useNavigate } from "react-router-dom";

// import {
//   Search,
//   Briefcase,
//   Users,
//   Building2,
//   TrendingUp,
//   BarChart2,
// } from "lucide-react";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import JobInterviews from "./JobInterviews";
// import FeaturedJobCategories from "../components/Home/Featured/FeaturedJobCategories";
// function HomePage() {
//   const { userType,handleJobRoleChange} = useContext(AuthContext);
//   const navigate=useNavigate();
//   const handleSearch=()=>{
//     navigate('/joblist')
//   }

  
//   return (
//     <div className="bg-gray-50">
//       {/* Hero Section */}
//       <section className="py-20 text-white bg-gradient-to-r from-orange-500 to-orange-600">
//         <div className="container px-4 mx-auto">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="mb-6 text-4xl font-bold md:text-5xl">
//               Find Your Dream Job Today
//             </h1>
//             <p className="mb-8 text-xl">
//               Connecting talented professionals with amazing opportunities
//             </p>
//             <div className="flex items-center p-1 bg-white rounded-lg">
//               <input
//                 type="text"
//                 placeholder="Job title, keywords, or company"
//                 className="flex-grow px-4 py-2 text-gray-800 cus:outline-none sm:z-1"
//                 onChange={handleJobRoleChange}
//               />
//               <button className="flex items-center max-w-xs px-4 py-2 m-1 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600 sm:max-w"
//               onClick={handleSearch}>
//                 <Search className="hidden w-5 h-5 mr-2 sm:block" />
//                 <span className="hidden sm:block">Search</span>
//                 <Search className="w-5 h-5 sm:hidden" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Featured Categories */}
//       <section className="py-16">
//         <FeaturedJobCategories
//           sectionTitle="Featured Job Categories"
//         />
//       </section>

//       <section className="py-16">
//         {userType === "candidate" ? <JobInterviews /> : null}
//       </section>

//       {/* Statistics Section */}
//       <section className="py-16 text-white bg-orange-500">
//         <div className="container px-4 mx-auto">
//           <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
//             {[
//               {
//                 icon: <Briefcase className="w-12 h-12 mx-auto mb-4" />,
//                 value: "10,000+",
//                 label: "Job Opportunities",
//               },
//               {
//                 icon: <Users className="w-12 h-12 mx-auto mb-4" />,
//                 value: "5,000+",
//                 label: "Talented Professionals",
//               },
//               {
//                 icon: <Building2 className="w-12 h-12 mx-auto mb-4" />,
//                 value: "1,000+",
//                 label: "Partner Companies",
//               },
//             ].map((stat, index) => (
//               <div key={index}>
//                 {stat.icon}
//                 <h3 className="mb-2 text-3xl font-bold">{stat.value}</h3>
//                 <p className="text-xl">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16">
//         <div className="container px-4 mx-auto">
//           <h2 className="mb-12 text-3xl font-bold text-center">How It Works</h2>
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//             {[
//               {
//                 icon: <Users className="w-12 h-12 text-orange-500" />,
//                 title: "Create an Account",
//                 description:
//                   "Sign up and complete your profile to showcase your skills and experience.",
//               },
//               {
//                 icon: <Search className="w-12 h-12 text-orange-500" />,
//                 title: "Search Jobs",
//                 description:
//                   "Browse through thousands of job listings or let our AI match you with the best opportunities.",
//               },
//               {
//                 icon: <BarChart2 className="w-12 h-12 text-orange-500" />,
//                 title: "Apply and Succeed",
//                 description:
//                   "Apply to your dream jobs with just a click and track your application status in real-time.",
//               },
//             ].map((step, index) => (
//               <div key={index} className="text-center">
//                 <div className="inline-block p-4 mb-4 bg-orange-100 rounded-full">
//                   {step.icon}
//                 </div>
//                 <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
//                 <p className="text-gray-600">{step.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {userType === null ? (
//         <section className="py-16 bg-gray-100">
//           <div className="container px-4 mx-auto text-center">
//             <h2 className="mb-4 text-3xl font-bold">
//               Ready to Start Your Journey?
//             </h2>
//             <p className="mb-8 text-xl text-gray-600">
//               Join thousands of professionals finding their dream jobs every day
//             </p>
//             <Link
//               to="/signup"
//               className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
//             >
//               Get Started
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-5 h-5 ml-2"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </Link>
//           </div>
//         </section>
//       ) : null}
//     </div>
//   );
// }

// export default HomePage;



import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  Briefcase,
  Users,
  Building2,
  BarChart2,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import JobInterviews from "./JobInterviews";
import FeaturedJobCategories from "../components/Home/Featured/FeaturedJobCategories";
function HomePage() {
  const { userType,handleJobRoleChange} = useContext(AuthContext);
 
  const navigate=useNavigate();
  const handleSearch=()=>{
    navigate('/joblist')
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Find Your Dream Job Today
            </h1>
            <p className="mb-8 text-xl">
              Connecting talented professionals with amazing opportunities
            </p>
            <div className="flex items-center p-1 bg-white rounded-lg">
              <input
                type="text"
                placeholder="Job title or company"
                className="flex-grow px-4 py-2 text-gray-800 cus:outline-none sm:z-1"
                name='TitleAndCompany'
                onChange={handleJobRoleChange}
              />
              <button className="flex items-center max-w-xs px-4 py-2 m-1 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600 sm:max-w"
              onClick={handleSearch}>
                <Search className="hidden w-5 h-5 mr-2 sm:block" />
                <span className="hidden sm:block">Search</span>
                <Search className="w-5 h-5 sm:hidden" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <FeaturedJobCategories
          sectionTitle="Featured Job Categories"
        />
      </section>

      <section className="py-16">
        {userType === "candidate" ? <JobInterviews /> : null}
      </section>

      {/* Statistics Section */}
      <section className="py-16 text-white bg-orange-500">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {[
              {
                icon: <Briefcase className="w-12 h-12 mx-auto mb-4" />,
                value: "10,000+",
                label: "Job Opportunities",
              },
              {
                icon: <Users className="w-12 h-12 mx-auto mb-4" />,
                value: "5,000+",
                label: "Talented Professionals",
              },
              {
                icon: <Building2 className="w-12 h-12 mx-auto mb-4" />,
                value: "1,000+",
                label: "Partner Companies",
              },
            ].map((stat, index) => (
              <div key={index}>
                {stat.icon}
                <h3 className="mb-2 text-3xl font-bold">{stat.value}</h3>
                <p className="text-xl">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Users className="w-12 h-12 text-orange-500" />,
                title: "Create an Account",
                description:
                  "Sign up and complete your profile to showcase your skills and experience.",
              },
              {
                icon: <Search className="w-12 h-12 text-orange-500" />,
                title: "Search Jobs",
                description:
                  "Browse through thousands of job listings or let our AI match you with the best opportunities.",
              },
              {
                icon: <BarChart2 className="w-12 h-12 text-orange-500" />,
                title: "Apply and Succeed",
                description:
                  "Apply to your dream jobs with just a click and track your application status in real-time.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-block p-4 mb-4 bg-orange-100 rounded-full">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {userType === null ? (
        <section className="py-16 bg-gray-100">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-xl text-gray-600">
              Join thousands of professionals finding their dream jobs every day
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2"
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
        </section>
      ) : null}
    </div>
  );
}

export default HomePage;