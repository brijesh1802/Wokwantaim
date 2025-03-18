import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProfileSection = ({ title, children, onAdd, contentExists }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  // return (
  //   <div className="p-6 bg-white rounded-lg shadow-lg w-full mt-5">
  //     <div className="flex justify-between items-center w-full">
  //       <div className="flex items-center">
  //         {isOpen ? (
  //           <ChevronUp
  //             onClick={toggleSection}
  //             className="mr-2 cursor-pointer"
  //           />
  //         ) : (
  //           <ChevronDown
  //             onClick={toggleSection}
  //             className="mr-2 cursor-pointer"
  //           />
  //         )}
  //         <h2 className="text-xl font-semibold">{title}</h2>
  //       </div>
  //       <button
  //         onClick={onAdd}
  //         className="text-blue-500 border-none p-1"
  //         disabled={contentExists && title === "Social Links"}
  //       >
  //         {contentExists && title === "Social Links"
  //           ? ""
  //           : contentExists
  //           ? "Add More"
  //           : "+Add"}
  //       </button>
  //     </div>

  //     {isOpen && <div className="mt-4">{children}</div>}
  //   </div>
  // );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full mt-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-center w-full">
        <div 
          className="flex items-center cursor-pointer group"
          onClick={toggleSection}
        >
          {isOpen ? (
            <ChevronUp className="mr-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          ) : (
            <ChevronDown className="mr-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
          )}
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">{title}</h2>
        </div>
        <button
          onClick={onAdd}
          disabled={contentExists && title === "Social Links"}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            contentExists && title === "Social Links"
              ? "hidden"
              : contentExists
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {contentExists && title === "Social Links"
            ? ""
            : contentExists
            ? "Add More"
            : "+ Add"}
        </button>
      </div>
  
      <div 
        className={`mt-4 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
  

};

export default ProfileSection;
