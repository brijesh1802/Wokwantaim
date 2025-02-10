// FeaturedJobCategories.js
import React from "react";
import { Link } from "react-router-dom";

const FeaturedJobCategories = ({ sectionTitle, categories }) => {
  return (
    <section className="py-4">
      <div className="container px-4 mx-auto slike-slide">
        <h2 className="mb-12 text-3xl font-bold text-center">{sectionTitle}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <div className="mb-4 text-orange-500">{category.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{category.title}</h3>
              <p className="mb-2 text-gray-600">
                {category.count} jobs available
              </p>
              <Link
                to="/joblist"
                className="text-orange-400 hover:text-orange-600"
              >
                View Jobs!
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobCategories;
