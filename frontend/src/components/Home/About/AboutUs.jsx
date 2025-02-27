import { motion } from "framer-motion";
import about3 from "../../../assets/Aboutus/about3.jpg";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className=" text-gray-800 p-6 mt-16 md:p-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold mb-6 mt-6 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
          Welcome to Wokwontaim
        </h1>
        <p className="text-lg text-gray-700 max-w-5xl mx-auto text-justify">
          Connecting <span className="font-semibold">top talent</span> with{" "}
          <span className="font-semibold">leading employers</span> through a
          seamless and efficient job-matching platform. We help professionals
          discover{" "}
          <span className="font-semibold">exciting career opportunities</span>{" "}
          while enabling companies to find{" "}
          <span className="font-semibold">skilled individuals</span>
          who drive success. Whether you're an experienced professional looking
          for growth or a company searching for the perfect fit, our platform
          simplifies the process, making hiring and job-seeking smooth and
          effective.
        </p>
      </motion.div>

      {/* Collage Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-14 flex flex-col md:flex-row items-center w-full mx-auto"
      >
        <div className="grid gap-2 relative md:w-1/2 lg:w-1/3 lg:ml-28">
          <div className="relative col-span-2 row-span-2">
            <img
              src={`${about3}`}
              alt="Collage 1"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="lg:w-1/2 md:pl-8 mt-6 md:mt-0 text-gray-600 text-lg w-full">
          <h2 className="text-3xl font-semibold mb-4 text-orange-500">
            Why Choose Us?
          </h2>
          <p className="text-justify">
            We simplify job matching, making hiring and job-seeking more
            accessible, efficient, and effective for everyone.
          </p>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="mt-12 grid md:grid-cols-2 gap-12">
        {/* Candidates Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-3xl font-semibold mb-4 text-orange-500">
            For Candidates
          </h2>
          <p className="text-gray-600 mb-4 text-justify">
            Unlock new career opportunities tailored to your skills. Access top
            recruiters, industry insights, and guidance to shape your
            professional journey.
          </p>
        </motion.div>

        {/* Employers Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h2 className="text-3xl font-semibold mb-4 text-orange-500">
            For Employers
          </h2>
          <p className="text-gray-600 mb-4 ">
            Find the perfect candidates through our streamlined recruitment
            platform. Simplify hiring, access verified talent, and make informed
            hiring decisions.
          </p>
        </motion.div>
      </div>

      {/* Our Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-semibold mb-6 text-orange-600">
          Our Mission
        </h2>
        <p className="text-gray-600 text-lg">
          We are dedicated to revolutionizing the job market by simplifying
          hiring and empowering individuals with meaningful career
          opportunities.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mt-16 grid md:grid-cols-3 gap-8"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-orange-500">
            Smart Job Matching
          </h3>
          <p className="text-gray-600">
            Our platform helps job seekers and employers connect efficiently,
            reducing hiring time and improving job satisfaction.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-orange-500">
            Seamless Experience
          </h3>
          <p className="text-gray-600">
            User-friendly interface for effortless navigation, ensuring smooth
            job searching and recruitment processes.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-3 text-orange-500">
            Verified Employers
          </h3>
          <p className="text-gray-600">
            We list only trusted companies, ensuring a high-quality and
            spam-free job market experience.
          </p>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-16 text-center"
      >
        <h2 className="text-4xl font-semibold mb-6 text-orange-600">
          Join Us Today!
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Whether you're a job seeker or an employer, start your journey with
          Wokwontaim today and experience a smarter way to hire and get hired.
        </p>
        <Link
          className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
          to="/signup"
        >
          Get Started
        </Link>
      </motion.div>
    </div>
  );
};

export default AboutUs;
