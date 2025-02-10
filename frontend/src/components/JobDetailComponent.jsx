import React from 'react'

import {
  House,
  Building2,
  MapPin,
  PersonStanding,
  Calendar,
  Briefcase,
  HandCoins,
} from "lucide-react";
import companyLogo from "../assets/comlogo-1.png";
const JobDetailComponent = ({job,onHandleClick,isApplied}) => {
  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
          {/* Job Title & Company Info */}
          <div className="flex items-center">
            <div
              className="flex-shrink-0 rounded-lg bg-slate-400"
              style={{
                backgroundImage: `url(${job.companyLogo || companyLogo})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: "80px",
                width: "80px",
              }}
            ></div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold text-gray-800">{job.title}</h2>
              <p className="text-xl font-medium text-gray-600">{job.company}</p>
            </div>
          </div>

          {/* Job Information */}
          <div className="mt-6">
            <div className="flex items-center gap-4 text-lg text-gray-600">
              <p className="flex items-center">
                <MapPin className="text-orange-500" />
                <span className="ml-1">{job.location}</span>
              </p>
              <p className="text-gray-600">| {job.experienceLevel}</p>
              <p className="text-gray-600">| {job.jobType}</p>
            </div>
            <div className="flex gap-4 mt-3 text-xl font-medium">
              <p className="text-green-600">
                ₹{job.salary.toLocaleString()} PM
              </p>
            </div>

            {/* Job Description */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">
                Job Description
              </h3>
              <p className="mt-2 text-gray-700">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Requirements</h3>
              <ul className="pl-6 mt-2 text-gray-700 list-disc">
                {job.requirements.map((resp, index) => (
                  <li key={index} className="mt-2">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs text-orange-700 bg-orange-100 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Calendar className="text-orange-500" />
                  <span>
                    Posted on:{" "}
                    {new Date(job.applicationPostedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <HandCoins className="text-orange-500" />
                  <span>Salary: ₹{job.salary.toLocaleString()} PM</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <PersonStanding className="text-orange-500" />
                  <span>Experience: {job.experienceLevel}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Building2 className="text-orange-500" />
                  <span>Industry: {job.industry}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg text-gray-600">
                  <Calendar className="text-orange-500" />
                  <span>
                    Application Deadline:{" "}
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={onHandleClick}
              className="px-8 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Apply Now
            </button>
          </div>
          {isApplied && (
            <div className="mt-4 text-xl font-semibold text-center text-green-600">
              You have successfully applied for the job!
            </div>
          )}
        </div>
  )
}

export default JobDetailComponent
