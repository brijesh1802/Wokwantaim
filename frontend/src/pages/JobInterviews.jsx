import { Link } from "react-router-dom";
import companies from "../data/companies";
import CompanyGrid from "../components/Home/Interview/CompanyGrid";
import CompanySlider from "../components/Home/Interview/CompanySlider";

const JobInterviews = () => {
  return (
    <section className="py-16 ">
      <div className="container px-6 mx-auto">
        <h2 className="text-3xl font-bold text-center">
          🚀 Interview Questions By Company
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Get ready for your next big opportunity with real company interview
          questions.
        </p>

        {/* Desktop View */}
        <div className="hidden md:block">
        <CompanyGrid companies={companies} />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
        <CompanySlider companies={companies} />
        </div>
      </div>
    </section>
  );
};

export default JobInterviews;
