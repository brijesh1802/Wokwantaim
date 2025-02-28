import React, { useState } from "react";

const PersonalProjects = ({ personalProjects, setPersonalProjects }) => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  const handleDelete = async (index) => {
    const updatedPersonalProjects = personalProjects.filter(
      (_, i) => i !== index
    );

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
        body: JSON.stringify({ personalProjects: updatedPersonalProjects }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete skill");
      }

      console.log("Project deleted successfully");
      // Update the skills state to reflect the change
      setPersonalProjects(updatedPersonalProjects);
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
      {personalProjects.length > 0 ? (
        personalProjects.map((project, index) => (
          <div
            key={index}
            className="relative w-full flex flex-col gap-2 p-4 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
            >
              ❌
            </button>

            <h3 className="text-lg font-semibold text-gray-900">
              {project.title}
            </h3>

            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-gray-700 text-sm">
              <p className="font-medium text-gray-800">Description:</p>
              <p>{project.description}</p>

              <p className="font-medium text-gray-800">Technologies:</p>
              <p>{project.technologiesUsed.join(", ")}</p>
            </div>

            <div className="flex gap-2 mt-2">
              {project.projectURL && (
                <a
                  href={project.projectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-400 rounded-md hover:bg-blue-50 transition"
                >
                  🌐 Live
                </a>
              )}
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 transition"
                >
                  💻 Code
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Add your personal projects here</p>
      )}
    </div>
  );
};

export default PersonalProjects;
