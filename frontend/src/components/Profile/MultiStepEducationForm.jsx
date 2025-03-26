// import { useState, useEffect } from "react";

// const EDUCATION_LEVELS = {
//   SSLC: "SSLC/10th",
//   PUC: "PUC/12th/Higher Secondary",
//   BACHELORS: "Bachelor's Degree",
//   MASTERS: "Master's Degree",
// };

// const MultiStepEducationForm = ({
//   toggleForm,
//   updateParentState,
//   data,
//   setData,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [qualifications, setQualifications] = useState([]);
//   const token = localStorage.getItem("authToken");
//   const [error, setError] = useState(null);
//   const [duplicateQualification, setDuplicateQualification] = useState(false);
//   const [currentQualification, setCurrentQualification] = useState({
//     id: "",
//     level: "",
//     institution: "",
//     fieldOfStudy: "",
//     yearOfStart: "",
//     yearOfCompletion: "",
//     percentage: "",
//   });

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 50 }, (_, i) =>
//     (currentYear - i).toString()
//   );

//   // Fetch existing education data on load
//   useEffect(() => {
//     const loadEducationData = async () => {
//       const existingEducation = await fetchExistingEducation();
//       setQualifications(existingEducation);
//     };

//     loadEducationData();
//   }, [setData]);

//   // Handle form input changes
//   const handleInputChange = (field, value) => {
//     setCurrentQualification({ ...currentQualification, [field]: value });
//     setError(null);
//   };

//   // Validate qualification dates and order
//   const validateDates = (newQualification) => {
//     const { yearOfStart, yearOfCompletion, level } = newQualification;

//     const startYear = parseInt(yearOfStart);
//     const endYear = parseInt(yearOfCompletion);

//     // 1️⃣ Validate start year < completion year
//     if (startYear >= endYear) {
//       return "Start year must be less than completion year.";
//     }

//     // 2️⃣ Enforce correct duration for each education level
//     const durationMap = {
//       SSLC: 1,
//       PUC: 2,
//       BACHELORS: 2, // Some bachelor's programs can be 2 years (like diploma)
//       MASTERS: 2,
//     };

//     const requiredDuration = durationMap[level];

//     if (endYear - startYear !== requiredDuration) {
//       return `${EDUCATION_LEVELS[level]} should be exactly ${requiredDuration} year(s) long.`;
//     }

//     // 3️⃣ Enforce chronological order and correct level order
//     const orderedLevels = ["SSLC", "PUC", "BACHELORS", "MASTERS"];
//     const allQualifications = [...qualifications, newQualification].sort(
//       (a, b) => parseInt(a.yearOfStart) - parseInt(b.yearOfStart)
//     );

//     let prevCompletionYear = 0;
//     let prevLevelIndex = -1;

//     for (let i = 0; i < allQualifications.length; i++) {
//       const current = allQualifications[i];
//       const currentLevelIndex = orderedLevels.indexOf(current.level);
//       const currentStartYear = parseInt(current.yearOfStart);
//       const currentEndYear = parseInt(current.yearOfCompletion);

//       // Check if start year is before previous qualification's completion year
//       if (currentStartYear < prevCompletionYear) {
//         return `Start year of ${
//           EDUCATION_LEVELS[current.level]
//         } (${currentStartYear}) must be after completion of the previous qualification (${prevCompletionYear}).`;
//       }

//       // Check if the current level is out of order
//       if (currentLevelIndex < prevLevelIndex) {
//         return `You cannot add ${EDUCATION_LEVELS[current.level]} after ${
//           EDUCATION_LEVELS[allQualifications[i - 1].level]
//         }. Please maintain the correct order of qualifications.`;
//       }

//       // Update previous values for the next iteration
//       prevCompletionYear = currentEndYear;
//       prevLevelIndex = currentLevelIndex;
//     }

//     return null; // No errors if everything is valid
//   };

//   // Fetch existing education data
//   const fetchExistingEducation = async () => {
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/get`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!response.ok) throw new Error("Failed to fetch education data");

//       const result = await response.json();
//       return result.education || [];
//     } catch (error) {
//       console.error("Error fetching education:", error);
//       return [];
//     }
//   };

//   // Save or update qualification on button click
//   const handleSave = async () => {
//     setError(null);

//     // Check if all fields are filled
//     if (
//       !currentQualification.level ||
//       !currentQualification.institution ||
//       !currentQualification.fieldOfStudy ||
//       !currentQualification.percentage ||
//       !currentQualification.yearOfStart ||
//       !currentQualification.yearOfCompletion
//     ) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     // Validate date logic
//     const validationError = validateDates(currentQualification);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     const existingEducation = await fetchExistingEducation();
//     const duplicateQualification = existingEducation.find(
//       (q) => q.degree === currentQualification.level
//     );

//     if (duplicateQualification) {
//       setDuplicateQualification(true);
//       setError(
//         "Entry already present. Clicking save again will override the existing record."
//       );
//       return;
//     }

//     let updatedEducation;

//     if (duplicateQualification) {
//       // Override duplicate and update entry
//       updatedEducation = existingEducation.map((q) =>
//         q.degree === currentQualification.level
//           ? {
//               ...q,
//               institution: currentQualification.institution,
//               grade: currentQualification.percentage,
//               startDate: currentQualification.yearOfStart,
//               endDate: currentQualification.yearOfCompletion,
//               description: currentQualification.fieldOfStudy,
//             }
//           : q
//       );
//     } else {
//       // Add new qualification
//       updatedEducation = [
//         ...existingEducation,
//         {
//           institution: currentQualification.institution,
//           degree: currentQualification.level,
//           grade: currentQualification.percentage,
//           startDate: currentQualification.yearOfStart,
//           endDate: currentQualification.yearOfCompletion,
//           description: currentQualification.fieldOfStudy,
//         },
//       ];
//     }

//     await submitUpdatedEducation(updatedEducation);
//     setQualifications(updatedEducation);

//     // Clear form after save
//     setCurrentQualification({
//       id: "",
//       level: "",
//       institution: "",
//       fieldOfStudy: "",
//       yearOfStart: "",
//       yearOfCompletion: "",
//       percentage: "",
//     });
//   };

//   // Submit updated education to the backend
//   const submitUpdatedEducation = async (education) => {
//     const payload = {
//       ...data,
//       education: education,
//     };

//     try {
//       const updateUrl = `${
//         import.meta.env.VITE_BASE_URL
//       }/api/v1/candidates/info/update`;

//       const response = await fetch(updateUrl, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) throw new Error("Failed to update education");

//       const updatedData = await response.json();
//       setData((prevData) => ({ ...prevData, education }));
//       updateParentState(updatedData);
//     } catch (error) {
//       console.error("Error updating education:", error);
//       setError("Failed to update education.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-md shadow-lg w-96">
//         <h3 className="text-xl font-semibold mb-4">Education Details</h3>
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//         <div className="space-y-2">
//           <select
//             className="border p-2 w-full"
//             value={currentQualification.level}
//             onChange={(e) => handleInputChange("level", e.target.value)}
//           >
//             <option value="">Select Level</option>
//             {Object.entries(EDUCATION_LEVELS).map(([key, value]) => (
//               <option key={key} value={key}>
//                 {value}
//               </option>
//             ))}
//           </select>

//           <input
//             className="border p-2 w-full"
//             type="text"
//             placeholder="Institution"
//             value={currentQualification.institution}
//             onChange={(e) => handleInputChange("institution", e.target.value)}
//           />
//           <input
//             className="border p-2 w-full"
//             type="text"
//             placeholder="Field of Study"
//             value={currentQualification.fieldOfStudy}
//             onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
//           />

//           <select
//             className="border p-2 w-full"
//             value={currentQualification.yearOfStart}
//             onChange={(e) => handleInputChange("yearOfStart", e.target.value)}
//           >
//             <option value="">Select Start Year</option>
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>

//           <select
//             className="border p-2 w-full"
//             value={currentQualification.yearOfCompletion}
//             onChange={(e) =>
//               handleInputChange("yearOfCompletion", e.target.value)
//             }
//           >
//             <option value="">Select Completion Year</option>
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>

//           <input
//             className="border p-2 w-full"
//             type="text"
//             placeholder="Percentage/CGPA"
//             value={currentQualification.percentage}
//             onChange={(e) => handleInputChange("percentage", e.target.value)}
//           />
//         </div>

//         {/* Save and Cancel Buttons */}
//         <button
//           className="w-full bg-green-500 text-white p-2 rounded-md mt-4"
//           onClick={handleSave}
//         >
//           {duplicateQualification ? "Override & Save" : "Save"}
//         </button>

//         <button
//           className="w-full bg-gray-400 text-white p-2 rounded-md mt-4"
//           onClick={toggleForm}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MultiStepEducationForm;
import { useState, useEffect } from "react";

const EDUCATION_LEVELS = {
  SSLC: "SSLC/10th",
  PUC: "PUC/12th/Higher Secondary",
  BACHELORS: "Bachelor's Degree",
  MASTERS: "Master's Degree",
};

const MultiStepEducationForm = ({
  toggleForm,
  updateParentState,
  data,
  setData,
}) => {
  const [loading, setLoading] = useState(false);
  const [qualifications, setQualifications] = useState([]);
  const [error, setError] = useState(null);
  const [overrideMode, setOverrideMode] = useState(false); // Flag to track override mode

  const token = localStorage.getItem("authToken");

  const [currentQualification, setCurrentQualification] = useState({
    level: "",
    institution: "",
    fieldOfStudy: "",
    yearOfStart: "",
    yearOfCompletion: "",
    percentage: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );

  useEffect(() => {
    const loadEducationData = async () => {
      const existingEducation = await fetchExistingEducation();
      setQualifications(existingEducation);
    };
    loadEducationData();
  }, [setData]);

  const handleInputChange = (field, value) => {
    setCurrentQualification((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setOverrideMode(false);
  };

  const validateDates = (newQualification) => {
    const { yearOfStart, yearOfCompletion, level } = newQualification;
    const startYear = parseInt(yearOfStart);
    const endYear = parseInt(yearOfCompletion);

    if (startYear >= endYear)
      return "Start year must be less than completion year.";

    const durationMap = { SSLC: 1, PUC: 2, BACHELORS: 3, MASTERS: 2 };
    const requiredDuration = durationMap[level];

    if (endYear - startYear !== requiredDuration) {
      return `${EDUCATION_LEVELS[level]} should be exactly ${requiredDuration} year(s) long.`;
    }

    return null;
  };

  const fetchExistingEducation = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch education data");
      const result = await response.json();
      return result.education || [];
    } catch (error) {
      console.error("Error fetching education:", error);
      return [];
    }
  };

  const handleSave = async () => {
    setError(null);

    if (
      !currentQualification.level ||
      !currentQualification.institution ||
      !currentQualification.fieldOfStudy ||
      !currentQualification.percentage ||
      !currentQualification.yearOfStart ||
      !currentQualification.yearOfCompletion
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const validationError = validateDates(currentQualification);
    if (validationError) {
      setError(validationError);
      return;
    }

    const existingEducation = await fetchExistingEducation();
    let isDuplicate = false;

    // Check if the selected level already exists
    existingEducation.forEach((q) => {
      if (q.degree === currentQualification.level) {
        isDuplicate = true;
      }
    });

    if (isDuplicate && !overrideMode) {
      setError("A qualification for this level already exists.");
      setOverrideMode(true);
      
      return;
    }

    const updatedEducation = existingEducation.filter(
      (q) => q.degree !== currentQualification.level
    );

    updatedEducation.push({
      institution: currentQualification.institution,
      degree: currentQualification.level,
      grade: currentQualification.percentage,
      startDate: currentQualification.yearOfStart,
      endDate: currentQualification.yearOfCompletion,
      description: currentQualification.fieldOfStudy,
    });

    await submitUpdatedEducation(updatedEducation);
    setQualifications(updatedEducation);

    setCurrentQualification({
      level: "",
      institution: "",
      fieldOfStudy: "",
      yearOfStart: "",
      yearOfCompletion: "",
      percentage: "",
    });

    setOverrideMode(false);
  };

  const submitUpdatedEducation = async (education) => {
    const payload = { ...data, education };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update education");

      const updatedData = await response.json();
      setData((prevData) => ({ ...prevData, education }));
      updateParentState(updatedData);
      toggleForm();
    } catch (error) {
      console.error("Error updating education:", error);
      setError("Failed to update education.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Education Details</h3>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="space-y-2">
          <select
            className="border p-2 w-full"
            value={currentQualification.level}
            onChange={(e) => handleInputChange("level", e.target.value)}
          >
            <option value="">Select Level</option>
            {Object.entries(EDUCATION_LEVELS).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Institution"
            value={currentQualification.institution}
            onChange={(e) => handleInputChange("institution", e.target.value)}
          />
          <input
            className="border p-2 w-full"
            type="text"
            placeholder="Field of Study"
            value={currentQualification.fieldOfStudy}
            onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
          />

          <select
            className="border p-2 w-full"
            value={currentQualification.yearOfStart}
            onChange={(e) => handleInputChange("yearOfStart", e.target.value)}
          >
            <option value="">Select Start Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="border p-2 w-full"
            value={currentQualification.yearOfCompletion}
            onChange={(e) =>
              handleInputChange("yearOfCompletion", e.target.value)
            }
          >
            <option value="">Select Completion Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
            <input
            className="border p-2 w-full"
            type="text"
            placeholder="Percentage/CGPA"
            value={currentQualification.percentage}
            onChange={(e) => handleInputChange("percentage", e.target.value)}
          />
        </div>

        <button
          className={`p-2 mt-4 w-full rounded ${
            overrideMode ? "bg-red-500" : "bg-blue-500"
          } text-white`}
          onClick={handleSave}
        >
          {loading ? "Saving..." : overrideMode ? "Override and Save" : "Save"}
        </button>

        <button
          className="w-full bg-gray-400 text-white p-2 rounded-md mt-4"
          onClick={toggleForm}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MultiStepEducationForm;
