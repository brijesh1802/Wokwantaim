import { Link } from "react-router-dom";

const CompanyGrid = ({ companies }) => {
  return (
    <div className="items-center justify-center hidden mt-8 md:flex">
      <div className="grid grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <Link
            key={index}
            to={`/interview/${company.id}`}
            className="flex items-center p-6 space-x-4 transition duration-300 transform bg-white border border-gray-300 cursor-pointer rounded-xl hover:scale-105"
          >
            <img src={company.logo} alt={company.name} className="w-14 h-14" />
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
  );
};

export default CompanyGrid;
