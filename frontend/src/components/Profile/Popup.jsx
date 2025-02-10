const Popup = ({ type, data, setData, handleSave, togglePopup }) => {
  // Handle inputs based on the type of data (social, certifications, etc.)
  const handleChange = (e, field) => {
    const updatedData = { ...data, [field]: e.target.value };
    setData(updatedData);
  };

  // Check if all required fields are filled
  const isSaveDisabled =
    (type === "Social Links" &&
      !data.linkedin?.trim() &&
      !data.github?.trim()) ||
    (type === "Certification" &&
      (!data.name?.trim() || !data.link?.trim() || !data.issuedDate?.trim())) ||
    (type === "Education" &&
      (!data.name?.trim() ||
        !data.grade?.trim() ||
        !data.fromDate?.trim() ||
        !data.toDate?.trim())) ||
    (type === "Skills" && (!data.skill?.trim() || !data.proficiency?.trim())) ||
    (type === "Experience" &&
      (!data.company?.trim() ||
        !data.role?.trim() ||
        !data.industry?.trim() ||
        !data.fromDate?.trim() ||
        !data.toDate?.trim()));

  const renderFormFields = () => {
    switch (type) {
      case "Social Links":
        return (
          <>
            <label className="block mb-2">LinkedIn URL:</label>
            <input
              type="url"
              value={data.linkedin}
              onChange={(e) => handleChange(e, "linkedin")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">GitHub URL:</label>
            <input
              type="url"
              value={data.github}
              onChange={(e) => handleChange(e, "github")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Certification":
        return (
          <>
            <label className="block mb-2">Certification Name:</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange(e, "name")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Certification Link:</label>
            <input
              type="url"
              value={data.link}
              onChange={(e) => handleChange(e, "link")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Issued Date:</label>
            <input
              type="date"
              value={data.issuedDate}
              onChange={(e) => handleChange(e, "issuedDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Education":
        return (
          <>
            <label className="block mb-2">Institution Name:</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange(e, "name")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Percentage/CGPA:</label>
            <input
              type="number"
              value={data.grade}
              onChange={(e) => handleChange(e, "grade")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">From:</label>
            <input
              type="date"
              value={data.fromDate}
              onChange={(e) => handleChange(e, "fromDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">To:</label>
            <input
              type="date"
              value={data.toDate}
              onChange={(e) => handleChange(e, "toDate")}
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
              value={data.skill}
              onChange={(e) => handleChange(e, "skill")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Proficiency:</label>
            <input
              type="text"
              value={data.proficiency}
              onChange={(e) => handleChange(e, "proficiency")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Experience":
        return (
          <>
            <label className="block mb-2">Company Name:</label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => handleChange(e, "company")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Role:</label>
            <input
              type="text"
              value={data.role}
              onChange={(e) => handleChange(e, "role")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Industry:</label>
            <input
              type="text"
              value={data.industry}
              onChange={(e) => handleChange(e, "industry")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">From:</label>
            <input
              type="date"
              value={data.fromDate}
              onChange={(e) => handleChange(e, "fromDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">To:</label>
            <input
              type="date"
              value={data.toDate}
              onChange={(e) => handleChange(e, "toDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="popup-content bg-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">{type} Details</h3>

        {renderFormFields()}

        <div className="flex justify-between">
          <button
            onClick={togglePopup}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`px-4 py-2 rounded ${
              isSaveDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
