

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {BriefcaseBusiness, ArrowRight } from 'lucide-react'
import { AuthContext } from "../../../context/AuthContext";

const FeaturedJobCategories = ({ sectionTitle }) => {
  const { industry, handleJobRoleChange } = useContext(AuthContext);

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="mb-12 text-4xl font-bold text-center text-gray-800">
          <span className="text-orange-500">{sectionTitle}</span>
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {industry.map(({ industry, count }, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-full text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <BriefcaseBusiness size={24} />
                </div>
                <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-600">
                  {count} Jobs
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors duration-300">
                {industry}
              </h3>
              <p className="mb-4 text-gray-600 text-sm">
                Explore opportunities in {industry} and advance your career.
              </p>
              <Link
                to="/joblist"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors duration-300"
                onClick={() => handleJobRoleChange({ target: { name: "Industry", value: industry, type: "text" } })}
              >
                View Jobs
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default FeaturedJobCategories;