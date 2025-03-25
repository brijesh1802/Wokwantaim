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
        !data.githubRepo?.trim())) ||
    (type === "certifications" &&
      (!data.title?.trim() ||
        !data.issuingOrganization?.trim() ||
        !data.issueDate?.trim() ||
        !data.expirationDate?.trim() ||
        !data.credentialId?.trim() ||
        !data.credentialURL?.trim())) ||
    (type === "workExperience" &&
      (!data.jobTitle?.trim() ||
        !data.company?.trim() ||
        !data.industry?.trim() ||
        !data.location?.trim() ||
        !data.startDate?.trim() ||
        (!data.isCurrentJob && !data.endDate?.trim()) ||
        (data.startDate > data.endDate && !data.isCurrentJob) ||
        !data.description?.trim()));

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

      if (type.toLowerCase() === "skills") {
        const existingSkills = existingData.skills || [];

        // Convert all existing skills to lowercase for case-insensitive comparison
        const normalizedSkills = existingSkills.map((skill) =>
          skill.toLowerCase()
        );

        if (normalizedSkills.includes(data.skill.toLowerCase())) {
          setError("Skill already exists.");
          setLoading(false);
          return;
        }
      }


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
        certifications:
          type === "certifications"
            ? [
                ...(existingData.certifications || []),
                {
                  title: data.title,
                  issueDate: data.issueDate,
                  issuingOrganization: data.issuingOrganization,
                  credentialId: data.credentialId,
                  credentialURL: data.credentialURL,
                  expirationDate: data.expirationDate,
                },
              ]
            : existingData.certifications,
        workExperience:
          type === "workExperience"
            ? [
                ...(existingData.workExperience || []),
                {
                  jobTitle: data.jobTitle,
                  company: data.company,
                  industry: data.industry,
                  location: data.location,
                  startDate: data.startDate,
                  endDate: data.isCurrentJob ? null : data.endDate, // Set endDate to null if isCurrentJob is true
                  isCurrentJob: data.isCurrentJob || false, // Ensure boolean value
                  description: data.description,
                },
              ]
            : existingData.workExperience,
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
            {error && <></>}
          </>
        );
      case "certifications":
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-x-auto max-h-[450px] p-4">
            <label className="block mb-2">Certification Title:</label>
            <input
              type="text"
              name="title"
              value={data.title || ""}
              onChange={handleChange}
              placeholder="Enter certification name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Issued Organization:</label>
            <input
              type="text"
              name="issuingOrganization"
              value={data.issuingOrganization || ""}
              onChange={handleChange}
              placeholder="Enter issuing organization"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Issued Date:</label>
            <input
              type="date"
              name="issueDate"
              value={data.issueDate || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Expiration Date:</label>
            <input
              type="date"
              name="expirationDate"
              value={data.expirationDate || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Credential Id:</label>
            <input
              type="text"
              name="credentialId"
              value={data.credentialId || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Credential URL:</label>
            <input
              type="text"
              name="credentialURL"
              value={data.credentialURL || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </div>
        );
      case "workExperience":
        return (
          <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-x-auto p-4">
            <div className="flex flex-wrap gap-5 max-h-96 pb-4">
              {[
                {
                  label: "Job Title",
                  name: "jobTitle",
                  type: "text",
                  placeholder: "Enter job title",
                },
                {
                  label: "Company",
                  name: "company",
                  type: "text",
                  placeholder: "Enter company name",
                },
                {
                  label: "Industry",
                  name: "industry",
                  type: "text",
                  placeholder: "Enter industry",
                },
                {
                  label: "Location",
                  name: "location",
                  type: "text",
                  placeholder: "Enter location",
                },
                { label: "Start Date", name: "startDate", type: "date" },
                {
                  label: "End Date",
                  name: "endDate",
                  type: "date",
                  disabled: data.isCurrentJob,
                },
              ].map(({ label, name, type, placeholder, disabled }) => (
                <div key={name} className="flex-1 min-w-[250px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}:
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={data[name] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    disabled={disabled}
                  />
                </div>
              ))}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isCurrentJob"
                  checked={data.isCurrentJob || false}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      isCurrentJob: e.target.checked,
                      endDate: e.target.checked ? "" : prevData.endDate,
                    }))
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-900">
                  Currently Working Here
                </label>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={data.description || ""}
                  onChange={handleChange}
                  placeholder="Enter job description"
                  rows="4"
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case "personalProjects":
        return (
           <div className="max-w-4xl mx-auto bg-white rounded-lg overflow-x-auto max-h-[450px] p-4">
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
          </div>
        );
      default:
        return null;
    }
  };

  // return (
  //   <div className="popup-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
  //     <div className="popup-content bg-white p-6 rounded-md shadow-lg w-96">
  //       <h3 className="text-xl font-semibold mb-4">{type} Details</h3>

  //       <form onSubmit={handleSave}>
  //         {renderFormFields()}

  //         {error && <div className="text-red-500 mb-4">{error}</div>}

  //         <div className="flex justify-between">
  //           <button
  //             type="button"
  //             onClick={togglePopup}
  //             className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             type="submit"
  //             disabled={isSaveDisabled || loading}
  //             className={`px-4 py-2 rounded transition-colors ${
  //               isSaveDisabled || loading
  //                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
  //                 : "bg-blue-500 text-white hover:bg-blue-600"
  //             }`}
  //           >
  //             {loading ? "Saving..." : "Save"}
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );

  return (
    <div className="popup-overlay fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="popup-content bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {type} Details
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          {renderFormFields()}

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-between items-center space-x-4">
            <button
              type="button"
              onClick={togglePopup}
              className="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaveDisabled || loading}
              className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-300 ${
                isSaveDisabled || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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
