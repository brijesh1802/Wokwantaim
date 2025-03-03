import React, { useState, useEffect } from "react";

const ExperienceSection = ({ workExperience, setWorkExperience }) => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const [editStates, setEditStates] = useState({});

  const formatDate = (date) => {
    return date ? new Date(date).toISOString().split("T")[0] : "";
  };

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
      if (!response.ok) throw new Error("Failed to delete experience");
      setWorkExperience(updatedExperience);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (index) => {
    setEditStates((prev) => ({ ...prev, [index]: workExperience[index] }));
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setEditStates((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [name]: type === "checkbox" ? checked : value,
        toDate: name === "isCurrentJob" && checked ? "" : prev[index].toDate,
      },
    }));
  };

  const handleSave = async (index) => {
    const updatedExperience = workExperience.map((exp, i) =>
      i === index ? editStates[index] : exp
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
        body: JSON.stringify({ workExperience: updatedExperience }),
      });
      if (!response.ok) throw new Error("Failed to update experience");
      setWorkExperience(updatedExperience);
      setEditStates((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    } catch (error) {
      setError(error.message);
    }
  };
  const handleClose = (index) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const isSaveDisabled = (index) => {
    return (
      !editStates[index]?.company ||
      !editStates[index]?.role ||
      !editStates[index]?.industry ||
      !editStates[index]?.fromDate ||
      !editStates[index]?.toDate ||
      editStates[index]?.fromDate > editStates[index]?.toDate ||
      !editStates[index]?.description
    );
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="mt-10">
      {workExperience.length > 0 ? (
        workExperience.map((workExperience, index) => {
          const isEditing = editStates[index] !== undefined;
          return (
            <div
              key={index}
              className="border p-3 mb-2 rounded-lg bg-white"
            >
              <div className="relative flex justify-end space-x-1">
                {!isEditing && (
                  <>
                    <button
                      className="text-blue-600 "
                      onClick={() => handleEdit(index)}
                    >
                      ✏️
                    </button>
                    <button
                      className="text-red-600 "
                      onClick={() => handleDelete(index)}
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-4 bg-white p-6 rounded-xl">
                  {["company", "industry", "location"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={editStates[index]?.[field] || ""}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date:
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      value={formatDate(editStates[index]?.fromDate)}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date:
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      value={formatDate(editStates[index]?.toDate)}
                      onChange={(e) => handleChange(index, e)}
                      disabled={editStates[index]?.isCurrentJob}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isCurrentJob"
                      checked={editStates[index]?.isCurrentJob || false}
                      onChange={(e) => handleChange(index, e)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label className="text-sm text-gray-900">
                      Currently Working Here
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description:
                    </label>
                    <textarea
                      name="description"
                      value={editStates[index]?.description || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="4"
                    />
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => handleSave(index)}
                      className="px-5 py-2 rounded-lg text-white bg-orange-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() =>
                        setEditStates((prev) => ({
                          ...prev,
                          [index]: undefined,
                        }))
                      }
                      className="px-5 py-2 rounded-lg text-white bg-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg text-[15px]">
                  {/* Job Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {workExperience.jobTitle}
                  </h3>
                  {/* Details Grid - Compact 2-column layout */}
                  <div className="grid grid-cols-2 text-gray-800">
                    <p className="text-[14px] text-gray-500">Company</p>
                    <p className="font-medium text-gray-900">
                      {workExperience.company}
                    </p>

                    <p className="text-[14px] text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">
                      {workExperience.industry}
                    </p>

                    <p className="text-[14px] text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {workExperience.location}
                    </p>

                    <p className="text-[14px] text-gray-500">From</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(workExperience.Date)}
                    </p>

                    <p className="text-[14px] text-gray-500">To</p>
                    <p className="font-medium text-gray-900">
                      {workExperience.isCurrentJob
                        ? "Present"
                        : formatDate(workExperience.toDate)}
                    </p>
                  </div>

                  {/* Description */}
                  {workExperience.description && (
                    <div className="mt-3 border-t pt-2">
                      <p className="text-[14px] text-gray-500">Description</p>
                      <p className="text-gray-900 text-[14px] leading-tight">
                        {workExperience.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">Add your workExperience here</p>
      )}
    </div>
  );
};

export default ExperienceSection;
