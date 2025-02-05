import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom"; // Import Link for routing
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import companies from "../data/companies";

const JobInterviews = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container px-6 mx-auto">
        <h2 className="text-3xl font-bold text-center">
          🚀 Interview Questions By Company
        </h2>
        <p className="mt-2 text-center text-gray-600">
          Get ready for your next big opportunity with real company interview
          questions.
        </p>

        {/* Desktop Grid */}
        <div className="items-center justify-center hidden mt-8 md:flex">
          <div className="grid grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <Link
                key={index}
                to={`/interview/${company.id}`} // Navigate to the interview page of the selected company
                className="flex items-center p-6 space-x-4 transition duration-300 transform bg-white border border-gray-300 cursor-pointer rounded-xl hover:scale-105"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-14 h-14"
                />
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-gray-600">
                    📌 {company.questions.length} Questions
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Slider */}
        <Swiper
          slidesPerView={1.2}
          spaceBetween={15}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mt-8 md:hidden"
        >
          {companies.map((company, index) => (
            <SwiperSlide key={index}>
              <Link
                to={`/interview/${company.id}`} // Navigate to the interview page on mobile as well
                className="flex items-center p-6 space-x-4 bg-white border border-gray-300 rounded-xl"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-14 h-14"
                />
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-gray-300">
                    📌 {company.questions.length} Interview Questions
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default JobInterviews;
