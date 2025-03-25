import React, { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
const ExperienceSection = ({ workExperience, setWorkExperience }) => {
  const [error, setError] = useState(null);
  const [editStates, setEditStates] = useState({});
  const token = localStorage.getItem("authToken");

  // Format date to YYYY-MM-DD for inputs
  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
  };

  // Validate fields before save
  const validateExperience = (experience) => {
    const {
      company,
      jobTitle,
      industry,
      location,
      startDate,
      endDate,
      description,
      isCurrentJob,
    } = experience;

    if (
      !company ||
      !jobTitle ||
      !industry ||
      !location ||
      !startDate ||
      (!isCurrentJob && !endDate)
    ) {
      return "All fields are required.";
    }

    if (
      startDate &&
      endDate &&
      !isCurrentJob &&
      new Date(startDate) >= new Date(endDate)
    ) {
      return "From date must be before the to date.";
    }

    if (description?.length < 10) {
      return "Description must be at least 10 characters.";
    }

    return null;
  };

  // Prevent duplicate entries
  const isDuplicateEntry = (newExperience, index) => {
    return workExperience.some(
      (exp, i) =>
        i !== index &&
        exp.company === newExperience.company &&
        exp.jobTitle === newExperience.jobTitle &&
        exp.startDate === newExperience.startDate
    );
  };

  // Delete an experience
  const handleDelete = async (index) => {
    const updatedExperience = workExperience.filter((_, i) => i !== index);
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
        body: JSON.stringify({ workExperience: updatedExperience }),
      });
      if (!response.ok) throw new Error("Failed to delete experience.");
      setWorkExperience(updatedExperience);
    } catch (error) {
      setError(error.message || "Error deleting experience.");
    }
  };

  // Start editing a row
  const handleEdit = (index) => {
    setEditStates((prev) => ({
      ...prev,
      [index]: { ...workExperience[index] },
    }));
  };
 
  // Handle input changes while editing
  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setEditStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: type === "checkbox" ? checked : value,
        endDate: name === "isCurrentJob" && checked ? "" : prev[index].endDate,
      },
    }));
    setError(null); // ✅ Clear error when editing starts
  };

  // Save updated experience
  const handleSave = async (index) => {
    console.log("clicked" ,editStates[index]);
    const updatedExperience = editStates[index];
    if (!updatedExperience) return;

    const validationError = validateExperience(updatedExperience);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (isDuplicateEntry(updatedExperience, index)) {
      setError("Duplicate work experience detected.");
      return;
    }

    const updatedWorkExperience = workExperience.map((exp, i) =>
      i === index ? updatedExperience : exp
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
        body: JSON.stringify({ workExperience: updatedWorkExperience }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(result.message || "Failed to update experience.");
      }

      console.log("API Response:", result);

      setWorkExperience([...updatedWorkExperience]); // Ensure state updates
      handleClose(index);
    } catch (error) {
      setError(error.message || "Error saving experience.");
    }
  };


  // Close editing mode
  const handleClose = (index) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  return (
    <div className="overflow-y-auto max-h-[500px] rounded-xl p-4">
      {workExperience.length > 0 ? (
        workExperience.map((experience, index) => {
          const isEditing = editStates[index] !== undefined;

          return (
            <div
              key={index}
              className="relative bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg mt-5 p-6"
            >
              {/* Edit and Delete Buttons Positioned on Top-Right */}
              {!isEditing && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    className="text-gray-400 hover:text-blue-500 transition"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-red-500 transition"
                    onClick={() => handleDelete(index)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}

              {/* Editing Mode */}
              {isEditing ? (
                <div className="relative space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["company", "jobTitle", "industry", "location"].map(
                      (field) => (
                        <div key={field} className="relative mt-5">
                          <input
                            type="text"
                            name={field}
                            value={editStates[index]?.[field] || ""}
                            onChange={(e) => handleChange(index, e)}
                            className="peer w-full px-3 py-2 text-sm border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-all"
                            placeholder=" "
                          />
                          <label className="absolute left-0 -top-3.5 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                        </div>
                      )
                    )}

                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formatDate(editStates[index]?.startDate)}
                        onChange={(e) => handleChange(index, e)}
                        className="peer w-full px-3 py-2 text-sm border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-all"
                      />
                      <label className="absolute left-0 -top-3.5 text-sm text-gray-600">
                        From Date
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="date"
                        name="endDate"
                        value={formatDate(editStates[index]?.endDate)}
                        onChange={(e) => handleChange(index, e)}
                        disabled={editStates[index]?.isCurrentJob}
                        className="peer w-full px-3 py-2 text-sm border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                      />
                      <label className="absolute left-0 -top-3.5 text-sm text-gray-600">
                        To Date
                      </label>
                    </div>
                  </div>

                  {/* Currently Working Checkbox */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isCurrentJob"
                      checked={editStates[index]?.isCurrentJob || false}
                      onChange={(e) => handleChange(index, e)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition duration-150 ease-in-out"
                    />
                    <label className="text-sm text-gray-700">
                      Currently Working Here
                    </label>
                  </div>

                  {/* Description */}
                  <div className="relative">
                    <textarea
                      name="description"
                      value={editStates[index]?.description || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-all resize-none"
                      rows="4"
                      placeholder=" "
                    />
                    <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600">
                      Description
                    </label>
                  </div>

                  {/* Save and Cancel Buttons */}
                  <div className="absolute -top-2 right-3 flex gap-2">
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
                  </div>
                </div>
              ) : (
                // Display Mode (Experience Card)
                <div className="space-y-4">
                  <header className="border-b border-gray-100 pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {experience.jobTitle}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {experience.company}
                    </p>
                  </header>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Industry", value: experience.industry },
                      { label: "Location", value: experience.location },
                      {
                        label: "From",
                        value: formatDate(experience.startDate),
                      },
                      {
                        label: "To",
                        value: experience.isCurrentJob ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            Present
                          </span>
                        ) : (
                          formatDate(experience.endDate)
                        ),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {label}
                        </label>
                        <p className="text-gray-800 font-medium">{value}</p>
                      </div>
                    ))}
                  </div>

                  {experience.description && (
                    <div className="pt-4 border-t border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                        Description
                      </label>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {experience.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 italic col-span-full text-center">
          Add your work experience here
        </p>
      )}
    </div>
  );
};

export default ExperienceSection;
