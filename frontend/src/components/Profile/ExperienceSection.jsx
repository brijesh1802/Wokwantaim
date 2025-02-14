import React from "react";

const ExperienceSection = ({
  experiences,
  setExperiences,
  togglePopup,
  setPopupType,
  setPopupData,
}) => {
  // Edit a specific experience entry
  const handleEdit = (index) => {
    setPopupType("Experience");
    setPopupData({
      company: experiences[index].company,
      role: experiences[index].role,
      industry: experiences[index].industry,
      fromDate: experiences[index].fromDate,
      toDate: experiences[index].toDate,
      index, // Store index for updating
    });
    togglePopup();
  };

  // Delete a specific experience entry
  const handleDelete = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    localStorage.setItem("experiences", JSON.stringify(updatedExperiences));
    setExperiences(updatedExperiences);
  };

  // Check if experiences have been loaded
  if (!experiences) {
    return <div>Loading...</div>; // Show loading indicator while experiences are being fetched
  }

  return (
    <div className="mt-10">
      {experiences.length > 0 ? (
        experiences.map((experience, index) => (
          <div key={index} className="flex justify-between border-b pb-2 mb-2">
            <div>
              <p>
                <strong>Company:</strong> {experience.company}
              </p>
              <p>
                <strong>Role:</strong> {experience.role}
              </p>
              <p>
                <strong>Industry:</strong> {experience.industry}
              </p>
              <p>
                <strong>From:</strong> {experience.fromDate}
              </p>
              <p>
                <strong>To:</strong> {experience.toDate}
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
        <p className="text-gray-500">Add your experiences here</p>
      )}
    </div>
  );
};

export default ExperienceSection;
