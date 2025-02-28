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
    <div className="mt-5 flex flex-wrap gap-2">
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border border-gray-700 px-3 py-1 rounded-full"
          >
            <span className="text-gray-700 font-medium">{skill}</span>
            <button
              className="text-red-500 hover:text-red-700 font-extrabold"
              onClick={() => handleDelete(index)}
            >
              ✕
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Add your skills here</p>
      )}
    </div>
  );
};

export default SkillSection;
