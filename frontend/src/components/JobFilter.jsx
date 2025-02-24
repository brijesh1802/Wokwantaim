
// import React, { useContext, useEffect, useState } from "react";
// import {
//   Calendar,
//   Briefcase,
//   HandCoins,
//   Building2,
//   PersonStanding,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";

// const JobFilter = ({ industry, location,jobTypes, handleJobRoleChange,selectedRadio,checkedOptions={}}) => {
//   const filters = [
//     {
//       id: "DatePosted",
//       label: "Date Posted",
//       icon: <Calendar color="orange" size={30} />,
//       options: ["Last 24 hours", "Last Week", "Last Month", "Older"],
//       type: "radio",
//     },
//     {
//       id: "JobTypes",
//       label: "Job Types",
//       icon: <Briefcase color="orange" size={30} />,
//       options: jobTypes,
//       type: "checkbox",
//     },
//     {
//       id: "Location",
//       label: "Location",
//       icon: <Briefcase color="orange" size={30} />,
//       options: location,
//       type: "checkbox",
//     },
//     {
//       id: "Salary",
//       label: "Salary",
//       icon: <HandCoins color="orange" size={30} />,
//       options: ["₹10,000 - ₹20,000", "₹20,000 - ₹30,000", "₹30,000 - ₹50,000","Above ₹50,000"],
//       type: "radio",
//     },
//     {
//       id: "Industry",
//       label: "Industry",
//       icon: <Building2 color="orange" size={30} />,
//       options: industry,
//       type: "checkbox",
//     },
//     {
//       id: "Experience",
//       label: "Experience",
//       icon: <PersonStanding color="orange" size={30} />,
//       options: ["0-2 years", "3-5 years", "5+ years"],
//       type: "checkbox",
//     },
//   ];

//   const [visibleSection, setVisibleSection] = useState({});
//   const [showMore, setShowMore] = useState({});
//   const {selectedIndustry}=useContext(AuthContext)

//   const toggleSection = (id) => {
//     setVisibleSection((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const toggleShowMore = (id) => {
//     setShowMore((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };


//   return (
//     <div className="flex flex-col gap-2 px-5 py-5 bg-gray-100 rounded-lg mx-7 lg:w-1/3">
//       {filters.map(({ id, label, icon, options, type }) => (
//         <div key={id}>
//           {/* Section Header */}
//           <div
//             onClick={() => toggleSection(id)}
//             className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md cursor-pointer"
//           >
//             <div className="flex items-center w-full gap-2">
//               {icon}
//               <p className="font-mono font-bold">{label}</p>
//             </div>
//             <div>{visibleSection[id] ? <ChevronUp /> : <ChevronDown />}</div>
//           </div>

//           {/* Section Content */}
//           <div
//             className={`w-full flex flex-col justify-center items-left px-14 gap-2 ${
//               visibleSection[id] ? "block" : "hidden"
//             }`}
//           >
//             {Array.isArray(options)
//               ? options
//                   .slice(0, showMore[id] ? options.length : 4)
//                   .map((option, index) => (
//                     <label key={index} className="flex gap-4 text-lg text-gray-400">
//                       <input
//                         type={type}
//                         name={id}
//                         value={option}
//                         checked={ type === "radio"
//                           ? selectedRadio?.[id] === option
//                           : type === "checkbox"
//                           ? Boolean(checkedOptions?.[option])
//                           : false}
//                         onChange={handleJobRoleChange}
//                       />
//                       <span>{option}</span>
//                     </label>
//                   ))
//               : console.error("Expected options to be an array, got:", options)}
//             {options.length > 4 && (
//               <button
//                 className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
//                 onClick={() => toggleShowMore(id)}
//               >
//                 {showMore[id] ? "View less" : "View more"}
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default JobFilter;


import React, { useContext, useEffect, useState } from "react";
import {
  Calendar,
  Briefcase,
  HandCoins,
  Building2,
  PersonStanding,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const JobFilter = ({ industry, location,jobTypes, handleJobRoleChange,selectedRadio,checkedOptions={},setVisibleSection,visibleSection}) => {
  const filters = [
    {
      id: "DatePosted",
      label: "Date Posted",
      icon: <Calendar color="orange" size={30} />,
      options: ["Last 24 hours", "Last Week", "Last Month", "Older"],
      type: "radio",
    },
    {
      id: "JobTypes",
      label: "Job Types",
      icon: <Briefcase color="orange" size={30} />,
      options: jobTypes,
      type: "checkbox",
    },
    {
      id: "Location",
      label: "Location",
      icon: <Briefcase color="orange" size={30} />,
      options: location,
      type: "checkbox",
    },
    {
      id: "Salary",
      label: "Salary",
      icon: <HandCoins color="orange" size={30} />,
      options: ["₹10,000 - ₹20,000", "₹20,000 - ₹30,000", "₹30,000 - ₹50,000","Above ₹50,000"],
      type: "radio",
    },
    {
      id: "Industry",
      label: "Industry",
      icon: <Building2 color="orange" size={30} />,
      options: industry,
      type: "checkbox",
    },
    {
      id: "Experience",
      label: "Experience",
      icon: <PersonStanding color="orange" size={30} />,
      options: ["0-2 years", "3-5 years", "5+ years"],
      type: "checkbox",
    },
  ];

  const [showMore, setShowMore] = useState({});
  const {selectedIndustry}=useContext(AuthContext)

  const toggleSection = (id) => {
    setVisibleSection((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleShowMore = (id) => {
    setShowMore((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  return (
    <div className="flex flex-col gap-2 px-5 py-5 bg-gray-100 rounded-lg mx-7 lg:w-1/3">
      {filters.map(({ id, label, icon, options, type }) => (
        <div key={id}>
          {/* Section Header */}
          <div
            onClick={() => toggleSection(id)}
            className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md cursor-pointer"
          >
            <div className="flex items-center w-full gap-2">
              {icon}
              <p className="font-mono font-bold">{label}</p>
            </div>
            <div>{visibleSection[id] ? <ChevronUp /> : <ChevronDown />}</div>
          </div>

          {/* Section Content */}
          <div
            className={`w-full flex flex-col justify-center items-left px-14 gap-2 ${
              visibleSection[id] ? "block" : "hidden"
            }`}
          >
            {Array.isArray(options)
              ? options
                  .slice(0, showMore[id] ? options.length : 4)
                  .map((option, index) => (
                    <label key={index} className="flex gap-4 text-lg text-gray-400">
                      <input
                        type={type}
                        name={id}
                        value={option}
                        checked={ type === "radio"
                          ? selectedRadio?.[id] === option
                          : type === "checkbox"
                          ? Boolean(checkedOptions?.[option])
                          : false}
                        onChange={handleJobRoleChange}
                      />
                      <span>{option}</span>
                    </label>
                  ))
              : console.error("Expected options to be an array, got:", options)}
            {options.length > 4 && (
              <button
                className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400"
                onClick={() => toggleShowMore(id)}
              >
                {showMore[id] ? "View less" : "View more"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobFilter;


