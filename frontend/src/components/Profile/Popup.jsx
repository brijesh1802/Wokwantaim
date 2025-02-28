import { useState, useEffect } from "react";

const Popup = ({ type, data, setData, togglePopup, updateParentState }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isSaveDisabled =
    (type === "socialLinks" &&
      !data.linkedin?.trim() &&
      !data.github?.trim() &&
      !data.portfolio?.trim()) ||
    (type === "Skills" && !data.skill?.trim()) ||
    (type === "personalProjects" &&
      (!data.title?.trim() ||
        !data.description?.trim() ||
        !data.technologiesUsed?.trim() ||
        !data.projectURL?.trim() ||
        !data.githubRepo?.trim()));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fetchUrl = `${
        import.meta.env.VITE_BASE_URL
      }/api/v1/candidates/info/get`;

      const fetchResponse = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch existing data");
      }

      const existingData = await fetchResponse.json();

      const payload = {
        ...existingData,
        ...data,
        skills:
          type === "Skills"
            ? [...(existingData.skills || []), data.skill]
            : existingData.skills,
        personalProjects:
          type === "personalProjects"
            ? [
                ...(existingData.personalProjects || []),
                {
                  title: data.title,
                  description: data.description,
                  technologiesUsed: data.technologiesUsed
                    ? data.technologiesUsed
                        .split(",")
                        .map((tech) => tech.trim())
                    : [],
                  projectURL: data.projectURL,
                  githubRepo: data.githubRepo,
                },
              ]
            : existingData.personalProjects,
        socialLinks:
          type === "socialLinks"
            ? [
                ...(existingData.socialLinks || []),
                {
                  linkedin: data.linkedin,
                  github: data.github,
                  portfolio: data.portfolio,
                },
              ]
            : existingData.SocialLinks,
      };
      console.log(payload);

      const updateUrl = `${
        import.meta.env.VITE_BASE_URL
      }/api/v1/candidates/info/update`;

      const updateResponse = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) {
        setError(updateResponse.error || "Failed to update profile");
      }

      const updatedData = await updateResponse.json();

      setData((prevData) => ({
        ...prevData,
        ...updatedData,
      }));
      updateParentState(updatedData);

      togglePopup(); // Close popup after saving
    } catch (error) {
      console.error("Error saving data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case "socialLinks":
        return (
          <>
            <label className="block mb-2">LinkedIn URL:</label>
            <input
              type="text"
              name="linkedin"
              value={data.linkedin || ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">GitHub URL:</label>
            <input
              type="text"
              name="github"
              value={data.github || ""}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Personal Portfolio:</label>
            <input
              type="text"
              name="portfolio"
              value={data.portfolio || ""}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Skills":
        return (
          <>
            <label className="block mb-2">Skill:</label>
            <input
              type="text"
              name="skill"
              value={data.skill || ""}
              onChange={handleChange}
              placeholder="Enter your skill"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "personalProjects":
        return (
          <>
            <label className="block mb-2">Project Title:</label>
            <input
              type="text"
              name="title"
              value={data.title || ""}
              onChange={handleChange}
              placeholder="Enter project title"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={data.description || ""}
              onChange={handleChange}
              placeholder="Enter project description"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">
              Technologies Used (comma separated):
            </label>
            <input
              type="text"
              name="technologiesUsed"
              value={data.technologiesUsed || ""}
              onChange={handleChange}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Project URL:</label>
            <input
              type="text"
              name="projectURL"
              value={data.projectURL || ""}
              onChange={handleChange}
              placeholder="https://projecturl.com"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">GitHub Repository:</label>
            <input
              type="text"
              name="githubRepo"
              value={data.githubRepo || ""}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="popup-content bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">{type} Details</h3>

        <form onSubmit={handleSave}>
          {renderFormFields()}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={togglePopup}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaveDisabled || loading}
              className={`px-4 py-2 rounded transition-colors ${
                isSaveDisabled || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
