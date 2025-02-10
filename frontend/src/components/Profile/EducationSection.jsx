import React, { useEffect } from "react";

const EducationSection = ({
  educations,
  setEducations,
  togglePopup,
  setPopupType,
  setPopupData,
}) => {
  // Initialize educations from localStorage
  useEffect(() => {
    const storedEducations =
      JSON.parse(localStorage.getItem("educations")) || [];
    console.log("Stored educations from localStorage:", storedEducations);
    setEducations(storedEducations);
  }, [setEducations]);

  // Edit a specific education entry
  const handleEdit = (index) => {
    setPopupType("Education");
    setPopupData({
      name: educations[index].name,
      degree: educations[index].degree,
      fromDate: educations[index].fromDate,
      toDate: educations[index].toDate,
      index, // Store index for updating
    });
    togglePopup();
  };

  // Delete a specific education entry
  const handleDelete = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    localStorage.setItem("educations", JSON.stringify(updatedEducations));
    setEducations(updatedEducations);
  };

  // Check if educations have been loaded
  if (!educations) {
    return <div>Loading...</div>; // Show loading indicator while educations are being fetched
  }

  return (
    <div className="mt-10">
      {educations.length > 0 ? (
        educations.map((education, index) => (
          <div key={index} className="flex justify-between border-b pb-2 mb-2">
            <div>
              <p>
                <strong>Name:</strong> {education.name}
              </p>
              <p>
                <strong>Percentage/CGPA:</strong> {education.grade}
              </p>
              <p>
                <strong>Duration:</strong> {education.fromDate} -{" "}
                {education.toDate}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Add your education details here</p>
      )}
    </div>
  );
};

export default EducationSection;
