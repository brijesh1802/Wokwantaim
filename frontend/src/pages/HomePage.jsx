import { Link, useNavigate } from 'react-router-dom'
import { Search, Briefcase, Users, Building2, TrendingUp, BarChart2 } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from "../context/AuthContext";


function HomePage() {

  const {userType}=useContext(AuthContext);
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Find Your Dream Job Today</h1>
            <p className="mb-8 text-xl">Connecting talented professionals with amazing opportunities</p>
            <div className="flex items-center p-2 bg-white rounded-lg">
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="flex-grow px-4 py-2 text-gray-800 focus:outline-none"
              />
              <button className="flex items-center px-6 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <h2 className="mb-12 text-3xl font-bold text-center">Featured Job Categories</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Briefcase className="w-8 h-8" />, title: "Business & Management", count: 235 },
            { icon: <TrendingUp className="w-8 h-8" />, title: "Marketing & Sales", count: 184 },
            { icon: <Users className="w-8 h-8" />, title: "Human Resources", count: 142 },
            { icon: <Building2 className="w-8 h-8" />, title: "Project Management", count: 165 },
            { icon: <Briefcase className="w-8 h-8" />, title: "Finance & Accounting", count: 120 },
            { icon: <TrendingUp className="w-8 h-8" />, title: "Customer Service", count: 98 },
            { icon: <Users className="w-8 h-8" />, title: "IT & Software", count: 210 },
            { icon: <Building2 className="w-8 h-8" />, title: "Engineering", count: 175 },
          ].map((category, index) => (
            <div key={index} className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
              <div className="mb-4 text-orange-500">{category.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{category.title}</h3>
              <p className="text-gray-600 mb-2">{category.count} jobs available</p>
              {userType==='candidate' || userType===null?(
             <Link to ='/joblist' className='text-orange-400 hover:text-orange-600'>View Jobs!</Link>)
                  :(<Link to ='/addjob' className='text-orange-400 hover:text-orange-600'>Add Jobs!</Link>)}
            </div>
          ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
      <section className="py-16 text-white bg-orange-500">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            {[
              { icon: <Briefcase className="w-12 h-12 mx-auto mb-4" />, value: "10,000+", label: "Job Opportunities" },
              { icon: <Users className="w-12 h-12 mx-auto mb-4" />, value: "5,000+", label: "Talented Professionals" },
              { icon: <Building2 className="w-12 h-12 mx-auto mb-4" />, value: "1,000+", label: "Partner Companies" },
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
              { icon: <Users className="w-12 h-12 text-orange-500" />, title: "Create an Account", description: "Sign up and complete your profile to showcase your skills and experience." },
              { icon: <Search className="w-12 h-12 text-orange-500" />, title: "Search Jobs", description: "Browse through thousands of job listings or let our AI match you with the best opportunities." },
              { icon: <BarChart2 className="w-12 h-12 text-orange-500" />, title: "Apply and Succeed", description: "Apply to your dream jobs with just a click and track your application status in real-time." },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-block p-4 mb-4 bg-orange-100 rounded-full">{step.icon}</div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mb-8 text-xl text-gray-600">Join thousands of professionals finding their dream jobs every day</p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

