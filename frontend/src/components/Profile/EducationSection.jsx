import React, { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";

const EducationSection = ({ educations, setEducations }) => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const [editStates, setEditStates] = useState({});
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleDelete = async (index) => {
    const updatedEducation = educations.filter((_, i) => i !== index);

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
        body: JSON.stringify({ education: updatedEducation }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete education");
      }

      console.log("Education deleted successfully");
      setEducations(updatedEducation);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEditStates((prev) => ({
      ...prev,
      [index]: { ...prev[index], [name]: value },
    }));
  };

  const handleClose = (index) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleEdit = (index) => {
    setEditStates((prev) => ({ ...prev, [index]: educations[index] }));
  };

  const handleSave = async (index) => {
    const updatedEducation = educations.map((edu, i) =>
      i === index ? editStates[index] : edu
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
        body: JSON.stringify({ education: updatedEducation }),
      });

      if (!response.ok) {
        throw new Error("Failed to update education");
      }

      console.log("Education updated successfully");
      setEducations(updatedEducation);
      handleClose(index);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {educations.length > 0 ? (
        educations.map((education, index) => (
          <div
            key={index}
            className="relative w-full flex flex-col gap-4 p-6 border border-gray-200 bg-white"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              {editStates[index] ? (
                <>
                  <button
                    onClick={() => handleSave(index)}
                    className="text-gray-400 hover:text-green-500 transition"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => handleClose(index)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-gray-400 hover:text-blue-500 transition"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              )}
            </div>

            {editStates[index] ? (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree:
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={editStates[index].degree}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution:
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={editStates[index].institution}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Year:
                  </label>
                  <select
                    name="startDate"
                    value={new Date(editStates[index].startDate).getFullYear()}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Year:
                  </label>
                  <select
                    name="endDate"
                    value={new Date(editStates[index].endDate).getFullYear()}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Percentage/CGPA:
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={editStates[index].grade}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Field Of Study:
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={editStates[index].description}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900">
                  {education.degree}
                </h3>

                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-gray-600 text-sm">
                  <p className="font-medium text-gray-800">Institution:</p>
                  <p>{education.institution}</p>

                  <p className="font-medium text-gray-800">Start Year:</p>
                  <p>
                    {education.startDate
                      ? new Date(education.startDate).getFullYear()
                      : "N/A"}
                  </p>

                  <p className="font-medium text-gray-800">End Year:</p>
                  <p>
                    {education.endDate
                      ? new Date(education.endDate).getFullYear()
                      : "N/A"}
                  </p>

                  <p className="font-medium text-gray-800">Percentage/CGPA:</p>
                  <p>{education.grade}</p>

                  <p className="font-medium text-gray-800">Field Of Study:</p>
                  <p className="text-justify">{education.description}</p>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          Add your Educational Qualification here
        </p>
      )}
    </div>
  );
};

export default EducationSection;
