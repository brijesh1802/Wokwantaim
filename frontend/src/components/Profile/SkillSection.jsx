import React from "react";

const SkillSection = ({
  skills,
  setSkills,
  togglePopup,
  setPopupType,
  setPopupData,
}) => {
  // Edit a specific skill entry
  const handleEdit = (index) => {
    setPopupType("Skills");
    setPopupData({
      skill: skills[index].skill,
      proficiency: skills[index].proficiency,
      index, // Store index for updating
    });
    togglePopup();
  };

  // Delete a specific skill entry
  const handleDelete = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    localStorage.setItem("skills", JSON.stringify(updatedSkills));
    setSkills(updatedSkills);
  };

  // Check if skills have been loaded
  if (!skills) {
    return <div>Loading...</div>; // Show loading indicator while skills are being fetched
  }

  return (
    <div className="mt-10">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <div key={index} className="flex justify-between border-b pb-2 mb-2">
            <div>
              <p>
                <strong>Skill:</strong> {skill.skill}
              </p>
              <p>
                <strong>Proficiency:</strong> {skill.proficiency}
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
        <p className="text-gray-500">Add your skills here</p>
      )}
    </div>
  );
};

export default SkillSection;
