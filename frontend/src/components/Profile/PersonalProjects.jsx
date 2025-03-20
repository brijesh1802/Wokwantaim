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

  // return (
  //   <div className="mt-5 flex flex-wrap gap-2">
  //     {personalProjects.length > 0 ? (
  //       personalProjects.map((project, index) => (
  //         <div
  //           key={index}
  //           className="relative w-full flex flex-col gap-2 p-4 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
  //         >
  //           <button
  //             onClick={() => handleDelete(index)}
  //             className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
  //           >
  //             ❌
  //           </button>

  //           <h3 className="text-lg font-semibold text-gray-900">
  //             {project.title}
  //           </h3>

  //           <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-gray-700 text-sm">
  //             <p className="font-medium text-gray-800">Description:</p>
  //             <p>{project.description}</p>

  //             <p className="font-medium text-gray-800">Technologies:</p>
  //             <p>{project.technologiesUsed.join(", ")}</p>
  //           </div>

  //           <div className="flex gap-2 mt-2">
  //             {project.projectURL && (
  //               <a
  //                 href={project.projectURL}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-400 rounded-md hover:bg-blue-50 transition"
  //               >
  //                 🌐 Live
  //               </a>
  //             )}
  //             {project.githubRepo && (
  //               <a
  //                 href={project.githubRepo}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 transition"
  //               >
  //                 💻 Code
  //               </a>
  //             )}
  //           </div>
  //         </div>
  //       ))
  //     ) : (
  //       <p className="text-gray-500">Add your personal projects here</p>
  //     )}
  //   </div>
  // );

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {personalProjects.length > 0 ? (
        personalProjects.map((project, index) => (
          <div
            key={index}
            className="relative flex flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
              aria-label="Delete project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
  
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {project.title}
            </h3>
  
            <div className="space-y-3 text-gray-600 flex-grow">
              <p className="text-sm leading-relaxed">{project.description}</p>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Technologies:</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologiesUsed.map((tech, techIndex) => (
                    <span key={techIndex} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
  
            <div className="flex gap-3 mt-4">
              {project.projectURL && (
                <a
                  href={project.projectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Live Demo
                </a>
              )}
              {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View Code
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic col-span-full text-center">Add your personal projects here</p>
      )}
    </div>
    );
  
  }

export default PersonalProjects;
