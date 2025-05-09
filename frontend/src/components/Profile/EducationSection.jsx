import React, { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="overflow-y-auto max-h-[380px]  mt-5 space-y-6">
      {educations.length > 0 ? (
        educations.map((education, index) => (
          <motion.div
            key={index}
            className="relative w-full flex flex-col gap-4 p-6 border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Action Buttons */}
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

            {/* Editable Form */}
            {editStates[index] ? (
              <div className="grid grid-cols-1 gap-4">
                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree:
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={editStates[index].degree}
                    // onChange={(e) => handleChange(index, e)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 cursor-not-allowed"
                  />
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution:
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={editStates[index].institution}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>

                {/* Start Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Year:
                  </label>
                  <select
                    name="startDate"
                    value={new Date(editStates[index].startDate).getFullYear()}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* End Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Year:
                  </label>
                  <select
                    name="endDate"
                    value={new Date(editStates[index].endDate).getFullYear()}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Percentage/CGPA:
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={editStates[index].grade}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>

                {/* Field of Study */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Field Of Study:
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={editStates[index].description}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                  />
                </div>
              </div>
            ) : (
              <div>
                {/* Display Education Details */}
                <h3 className="text-xl font-semibold text-gray-900">
                  {education.degree}
                </h3>

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-[10px] text-gray-[600] text-sm">
                  {/* Institution */}
                  <p className="font-medium text-gray-[800]">Institution:</p>
                  <p>{education.institution}</p>

                  {/* Start Year */}
                  <p className="font-medium text-gray-[800]">Start Year:</p>
                  <p>
                    {education.startDate
                      ? new Date(education.startDate).getFullYear()
                      : "N/A"}
                  </p>

                  {/* End Year */}
                  <p className="font-medium text-gray-[800]">End Year:</p>
                  <p>
                    {education.endDate
                      ? new Date(education.endDate).getFullYear()
                      : "N/A"}
                  </p>

                  {/* Grade */}
                  <p className="font-medium text-gray-[800]">
                    Percentage/CGPA:
                  </p>
                  <p>{education.grade}</p>

                  {/* Field of Study */}
                  <p className="font-medium text-gray-[800]">Field Of Study:</p>
                  <p>{education.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))
      ) : (
        <div className="h-[200]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-500 italic col-span-full text-center"
          >
            Add your Educational Qualification here
          </motion.p>
        </div>
      )}
    </div>
  );
};

export default EducationSection;
