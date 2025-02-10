import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ProfileSection = ({ title, children, onAdd, contentExists }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full mt-5">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          {isOpen ? (
            <ChevronUp
              onClick={toggleSection}
              className="mr-2 cursor-pointer"
            />
          ) : (
            <ChevronDown
              onClick={toggleSection}
              className="mr-2 cursor-pointer"
            />
          )}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <button
          onClick={onAdd}
          className="text-blue-500 border-2 border-blue-300 p-1"
        >
          {contentExists ? "✏️Edit" : "+Add"}
        </button>
      </div>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default ProfileSection;
