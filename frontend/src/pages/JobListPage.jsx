import { HomeIcon } from "lucide-react";
import React, { useState } from "react";

const jobs = [
  {
    position: "UI/UX Designer",
    company: "Pixelz Studio",
    location: "Yogyakarta",
    salary: "1000",
  },
  {
    position: "Product Designer",
    company: "Traveloka",
    location: "Jakarta",
    salary: "1500",
  },
  {
    position: "UX Designer",
    company: "Tokopedia",
    location: "Jakarta",
    salary: "1000",
  },
  {
    position: "Interaction Designer",
    company: "GoPay",
    location: "Jakarta",
    salary: "1000",
  },
  {
    position: "UI Designer",
    company: "Gojek",
    location: "Jakarta",
    salary: "900",
  },
  {
    position: "Sr. UI/UX Designer",
    company: "Shopee",
    location: "Jakarta",
    salary: "1000",
  },
  {
    position: "UX Writer",
    company: "OVO",
    location: "Jakarta",
    salary: "1100",
  },
  {
    position: "UI Engineer",
    company: "GoPay",
    location: "Jakarta",
    salary: "1200",
  },
];

const JobListPage = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const jobsPerPage = 4;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const currentJobs = jobs.slice(
    currentPage * jobsPerPage,
    currentPage * jobsPerPage + jobsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <>
      <div className="bg-gray-50 w-full py-20">
        {/* Header */}
        <div
          className="text-white py-6 text-center relative"
          style={{
            backgroundImage:
              'url("https://themetechmount.com/react/hireco/images/pagetitle-bg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "30px 0px 60px",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-950 opacity-45"></div>

          {/* Title */}
          <h1 className="mt-10 text-3xl font-semibold relative z-10">
            Job List
          </h1>
          <div className="mt-2 text-sm hover:cursor-pointer relative flex justify-center items-center space-x-2 z-10">
            <p className="flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home / <span className="ml-1 text-orange-400">job</span>
            </p>
          </div>
        </div>

        {/* Overlapping Section */}
        <div className="relative -mt-11 bg-white rounded-lg shadow-lg z-20 p-6 ">
          {/* Example Content */}
          <p className="text-gray-700">
            This is the overlapping content. You can add your JobList or any
            other component here.
          </p>
        </div>

        <div className="p-8 bg-gray-50">
          {/* Job Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="relative bg-white p-6 shadow-md rounded-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Job Content */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {job.position}
                  </h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                </div>

                {/* Salary and Button */}
                <div className="mt-4">
                  <p className="text-lg font-semibold text-green-600">
                    ${job.salary}/m
                  </p>
                  <button className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobListPage;
