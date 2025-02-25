

// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import {BriefcaseBusiness } from 'lucide-react'
// import { AuthContext } from "../../../context/AuthContext";

// const FeaturedJobCategories = ({ sectionTitle}) => {
//   const {industry,handleJobRoleChange}=useContext(AuthContext)
//   return (
//     <section className="py-4">
//       <div className="container px-4 mx-auto slike-slide">
//         <h2 className="mb-12 text-3xl font-bold text-center">{sectionTitle}</h2>
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//           {industry.map(({industry,count}, index) => (
//             <div
//               key={index}
//               className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
//             >
//                <div className="mb-2 text-orange-500"><BriefcaseBusiness size={30}/></div>
//               <h3 className="mb-2 text-xl font-semibold">{industry}</h3>
//               <p className="mb-2 text-gray-600">
//                {count} Jobs available!
//               </p>
//               <Link
//                 to="/joblist"
//                 className="text-orange-400 hover:text-orange-600"  
//                 onClick={() =>{
//                    handleJobRoleChange(
//                   { target: { name: "Industry", value:industry, type: "text" } }
//                 )}}
//               >
//                 View Jobs!
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default FeaturedJobCategories;

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const FeaturedJobCategories = ({ sectionTitle }) => {
  const {
    industry,
    handleJobRoleChange,
    setcurrentJobRole,
    setCheckedOptions,
  } = useContext(AuthContext);
  return (
    <section className="py-4">
      <div className="container px-4 mx-auto slike-slide">
        <h2 className="mb-12 text-3xl font-bold text-center">{sectionTitle}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {industry.map(({ industry, count }, index) => (
            <div
              key={index}
              className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
            >
              <div className="mb-2 text-orange-500">
                <BriefcaseBusiness size={30} />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{industry}</h3>
              <p className="mb-2 text-gray-600">{count} Jobs available!</p>
              <Link
                to="/joblist"
                className="text-orange-400 hover:text-orange-600"
                onClick={() => {
                  setCheckedOptions({ [industry]: true }); // Reset previous selections
                  setcurrentJobRole({
                    Industry: [industry], // Only update Industry
                    DatePosted: [],
                    JobRoles: [],
                    Salary: [],
                    Experience: [],
                    JobType: [],
                    Location: [],
                    Title: [],
                    TitleAndCompany: [],
                  });
                  
                  handleJobRoleChange({
                    target: {
                      name: "Industry",
                      value: industry,
                      type: "checkbox",
                      checked: true,
                    },
                  });
                }}
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