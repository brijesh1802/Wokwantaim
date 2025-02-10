import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const CompanySlider = ({ companies }) => {
  return (
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
            to={`/interview/${company.id}`}
            className="flex items-center p-6 space-x-4 bg-white border border-gray-300 rounded-xl"
          >
            <img src={company.logo} alt={company.name} className="w-14 h-14" />
            <div>
              <h3 className="text-lg font-semibold">{company.name}</h3>
              <p className="text-gray-600">
                📌 {company.questions.length} Interview Questions
              </p>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CompanySlider;
