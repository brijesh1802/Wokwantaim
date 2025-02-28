import { Link } from "react-router-dom";

const CompanyGrid = ({ companies }) => {
  return (
    <div className="mt-12 md:mt-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company, index) => (
          <Link
            key={index}
            to={`/interview/${company.id}`}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0"></div>
            <div className="relative p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="w-16 h-16 object-cover rounded-full border-2 border-orange-200 group-hover:border-white transition-colors duration-300" 
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-500  transition-colors duration-300">{company.name}</h3>
                <p className="text-gray-600  transition-colors duration-300">
                  <span className="inline-block mr-2">📌</span>
                  {company.questions.length} Questions
                </p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400  transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};


export default CompanyGrid;
