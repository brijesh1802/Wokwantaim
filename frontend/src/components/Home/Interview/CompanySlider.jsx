import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectCards } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const CompanySlider = ({ companies }) => {
  return (
    <div className="mt-8 md:hidden">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination, EffectCards]}
        className="company-slider"
      >
        {companies.map((company, index) => (
          <SwiperSlide key={index}>
            <Link
              to={`/interview/${company.id}`}
              className="block p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-200" 
                />
                <h3 className="text-xl font-bold text-gray-800">{company.name}</h3>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <p className="text-orange-600 font-semibold">
                  <span className="inline-block mr-2">📌</span>
                  {company.questions.length} Interview Questions
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Tap to explore</span>
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


export default CompanySlider;