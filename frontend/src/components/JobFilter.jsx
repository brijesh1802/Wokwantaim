import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Briefcase,
  HandCoins,
  Building2,
  PersonStanding,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const FilterSection = ({ id, label, icon, options, type, handleJobRoleChange ,visibleSection,setVisibleSection,selectedRadio,checkedOptions}) => {
  const isOpen = visibleSection === id;
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    console.log("FilterSection - selectedRadio:", selectedRadio);
    console.log("FilterSection - checkedOptions:", checkedOptions);
  }, [selectedRadio, checkedOptions]);
  

  const toggleSection = () => {
    setVisibleSection(isOpen ? null : id); // Close if already open, open otherwise
  };
  const toggleShowAll = () => setShowAll(!showAll);

  const visibleOptions = showAll ? options : options.slice(0, 4);

  return (
    <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
      <motion.button
        className="flex items-center justify-between w-full p-4 text-left focus:outline-none"
        onClick={toggleSection}
      >
        <div className="flex items-center space-x-3">
          {React.cloneElement(icon, { className: "text-orange-500" })}
          <span className="font-semibold text-gray-700">{label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            {visibleOptions.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 py-2">
                <input
                  type={type}
                  name={id}
                  value={option}
                  checked={
                    type === "radio"
                      ? selectedRadio?.[id] === option
                      : type === "checkbox"
                      ? Boolean(checkedOptions?.[option] ?? false)
                      : false
                  }
                  onChange={handleJobRoleChange}
                  autoComplete="off"

                  className="form-checkbox text-orange-500 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
            {options.length > 4 && (
              <button
                className="mt-2 text-sm text-orange-500 hover:text-orange-600 focus:outline-none"
                onClick={toggleShowAll}
              >
                {showAll ? "Show less" : "Show more"}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JobFilter = ({ industry, jobRole, handleJobRoleChange,setVisibleSection,visibleSection,experienceRole,selectedRadio,checkedOptions={} }) => {
  const filters = [
    {
      id: "DatePosted",
      label: "Date Posted",
      icon: <Calendar />,
      options: ["Last 24 hours", "Last Week", "Last Month", "Older"],
      type: "radio",
    },
    {
      id: "JobRoles",
      label: "Job Role",
      icon: <Briefcase />,
      options: jobRole,
      type: "checkbox",
    },
    {
      id: "Salary",
      label: "Salary",
      icon: <HandCoins />,
      options: ["₹10,000 - ₹20,000", "₹20,000 - ₹30,000", "₹30,000 - ₹50,000", "Above ₹50,000"],
      type: "radio",
    },
    {
      id: "Industry",
      label: "Industry",
      icon: <Building2 />,
      options: industry,
      type: "checkbox",
    },
    {
      id: "Experience",
      label: "Experience",
      icon: <PersonStanding />,
      options:experienceRole,
      type: "checkbox",
    },
  ];
  useEffect(()=>{
    console.log("JobFilter - selectedRadio:", selectedRadio);
    console.log("JobFilter - checkedOptions:", checkedOptions);

  },[selectedRadio,checkedOptions])
  return (
    <div className="bg-gray-100 p-6 rounded-lg lg:w-1/3">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Filters</h2>
      {filters.map((filter) => (
        <FilterSection
          key={filter.id}
          {...filter}
          handleJobRoleChange={handleJobRoleChange}
          visibleSection={visibleSection}
          setVisibleSection={setVisibleSection}
          selectedRadio={selectedRadio}
          checkedOptions={checkedOptions}
        />
      ))}
    </div>
  );
};

export default JobFilter;