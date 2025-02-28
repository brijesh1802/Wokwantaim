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
      // case "Profile Update":
      //   return (
      //     <div className="max-h-96 overflow-y-auto  p-5">
      //       <label className="block mb-2">First Name:</label>
      //       <div className="relative">
      //         <input
      //           id="firstName"
      //           name="firstName"
      //           value={data.firstName}
      //           onChange={(e) => handleChange(e, "firstName")}
      //           placeholder="John Doe"
      //           className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //           required
      //         />
      //         <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //       </div>
      //       <label className="block mb-2">Last Name:</label>
      //       <div className="relative">
      //         <input
      //           type="text"
      //           value={data.lastName}
      //           onChange={(e) => handleChange(e, "lastName")}
      //           className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //         />
      //         <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2"></User>
      //       </div>

      //       <label className="block mb-2" htmlFor="password">
      //         Password:
      //       </label>
      //       <div className="relative">
      //         <input
      //           id="password"
      //           name="password"
      //           type={showPassword.password ? "text" : "password"}
      //           value={data.password}
      //           onChange={(e) => handleChange(e, "password")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //           required
      //         />
      //         <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //         <button
      //           type="button"
      //           onClick={() => togglePasswordVisibility("password")}
      //           className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
      //         >
      //           {showPassword.password ? (
      //             <EyeOff className="w-4 h-4" />
      //           ) : (
      //             <Eye className="w-4 h-4" />
      //           )}
      //         </button>
      //       </div>

      //       <label className="block mb-2" htmlFor="confirmPassword">
      //         Confirm Password:
      //       </label>
      //       <div className="relative">
      //         <input
      //           id="confirmPassword"
      //           name="confirmPassword"
      //           type={showPassword.confirmPassword ? "text" : "password"}
      //           value={data.confirmPassword}
      //           onChange={(e) => handleChange(e, "confirmPassword")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //           required
      //         />
      //         <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //         <button
      //           type="button"
      //           onClick={() => togglePasswordVisibility("confirmPassword")}
      //           className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
      //         >
      //           {showPassword.confirmPassword ? (
      //             <EyeOff className="w-4 h-4" />
      //           ) : (
      //             <Eye className="w-4 h-4" />
      //           )}
      //         </button>
      //       </div>

      //       <label className="block mb-2">Phone Number:</label>
      //       <div className="relative">
      //         <input
      //           type="text"
      //           value={data.phoneNumber}
      //           onChange={(e) => handleChange(e, "phoneNumber")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //         />
      //         <Phone className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //       </div>
      //       <label className="block mb-2">Experience Level:</label>
      //       <div className="relative">
      //         <select
      //           id="experienceLevel"
      //           name="experienceLevel"
      //           value={data.experienceLevel}
      //           onChange={(e) => handleChange(e, "experienceLevel")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //         >
      //           <option value="">Select experience level</option>
      //           <option value="Fresher">Fresher</option>
      //           <option value="Entry-Level">Entry Level</option>
      //           <option value="Mid-Level">Mid Level</option>
      //           <option value="Senior-Level">Senior Level</option>
      //         </select>
      //         <Briefcase className="absolute w-5 h-5  -translate-y-1/2  top-1/2 left-3 text-gray-300"></Briefcase>
      //       </div>
      //       <label className="block mb-2">Job Type:</label>
      //       <div className="relative">
      //         <select
      //           id="jobType"
      //           name="jobType"
      //           value={data.jobType}
      //           onChange={(e) => handleChange(e, "jobType")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
         
      //         >
      //           <option value="">Select job type</option>
      //           <option value="Full-time">Full Time</option>
      //           <option value="Part-time">Part Time</option>
      //           <option value="Internship">Internship</option>
      //           <option value="Contract">Contract</option>
      //         </select>
      //         <Briefcase className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //       </div>
      //       <label className="block mb-2">Profile Photo:</label>
      //       <input
      //         type="file"
      //         accept="image/*"
      //         onChange={(e) => handleChange(e, "profilePhoto")}
      //         className="w-full p-2 border border-gray-300 rounded mb-4"
      //       />
      //       <label className="block mb-2">Upload CV:</label>
      //       <input
      //         type="file"
      //         accept="application/pdf"
      //         onChange={(e) => handleChange(e, "resume")}
      //         className="w-full p-2 border border-gray-300 rounded mb-4"
      //       />
      //     </div>
      //   );
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
