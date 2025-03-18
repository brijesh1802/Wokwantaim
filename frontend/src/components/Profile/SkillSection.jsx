import React, { useState } from "react";

const SkillSection = ({ skills, setSkills }) => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  // Delete a specific skill entry
  const handleDelete = async (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);

    try {
      const url = `${
        import.meta.env.VITE_BASE_URL
      }/api/v1/candidates/info/update`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills: updatedSkills }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      console.log("Skill deleted successfully");
      // Update the skills state to reflect the change
      setSkills(updatedSkills);
    } catch (error) {
      console.error("Error deleting skill:", error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <span className="text-gray-800 font-medium">{skill}</span>
            <button
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              onClick={() => handleDelete(index)}
              aria-label="Delete skill"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">Add your skills here</p>
      )}
    </div>
  );
  

};

export default SkillSection;
