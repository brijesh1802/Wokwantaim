import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
const Certifications = ({ certifications, setCertifications }) => {
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");
  const [editStates, setEditStates] = useState({});

  const handleDelete = async (index) => {
    const updatedCertification = certifications.filter((_, i) => i !== index);
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
        body: JSON.stringify({ certifications: updatedCertification }),
      });
      if (!response.ok) throw new Error("Failed to delete certification");
      setCertifications(updatedCertification);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (index) => {
    setEditStates((prev) => ({ ...prev, [index]: certifications[index] }));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEditStates((prev) => ({
      ...prev,
      [index]: { ...prev[index], [name]: value },
    }));
  };

  const handleSave = async (index) => {
    const updatedCertification = certifications.map((cert, i) =>
      i === index ? editStates[index] : cert
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
        body: JSON.stringify({ certifications: updatedCertification }),
      });
      if (!response.ok) throw new Error("Failed to update certification");
      setCertifications(updatedCertification);
      setEditStates((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const isSaveDisabled = (index) => {
    return (
      !editStates[index]?.title?.trim() ||
      !editStates[index]?.issuingOrganization?.trim() ||
      !editStates[index]?.credentialId?.trim() ||
      !editStates[index]?.credentialURL?.trim() ||
      !editStates[index]?.issueDate?.trim() ||
      !editStates[index]?.expirationDate?.trim()
    );
  };

  const handleClose = (index) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="mt-10 space-y-6">
      {certifications.length > 0 ? (
        certifications.map((cert, index) => {
          const isEditing = editStates[index] !== undefined;
          return (
            <div
              key={index}
              className="border p-6 rounded-lg shadow-md bg-white"
            >
              <div className="relative flex justify-end space-x-1">
                {!isEditing && (
                  <>
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
                  </>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-4 bg-white p-6 rounded-xl">
                  {[
                    "title",
                    "issuingOrganization",
                    "credentialId",
                    "credentialURL",
                  ].map((field) => (
                    <input
                      key={field}
                      type="text"
                      name={field}
                      value={editStates[index]?.[field] || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 
                 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    />
                  ))}
                  {["issueDate", "expirationDate"].map((field) => (
                    <input
                      key={field}
                      type="date"
                      name={field}
                      value={editStates[index]?.[field] || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300
               focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                  ))}

                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => handleSave(index)}
                      disabled={isSaveDisabled(index)}
                      className={`px-5 py-2 rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 
  hover:from-orange-600 hover:to-orange-500 ${
    isSaveDisabled(index) ? "cursor-not-allowed" : ""
  }`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleClose(index)}
                      className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-400"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {cert.title}
                  </h3>
                  {[
                    "issuingOrganization",
                    "issueDate",
                    "expirationDate",
                    "credentialId",
                  ].map((field) =>
                    cert[field] ? (
                      <p key={field} className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">
                          {field.replace(/([A-Z])/g, " $1").trim()}:
                        </span>{" "}
                        {field.includes("Date")
                          ? new Date(cert[field]).toLocaleDateString("en-GB") //
                          : cert[field].replace(/^0+/, "")}{" "}
                        {/* Remove leading zeros */}
                      </p>
                    ) : null
                  )}
                  {cert.credentialURL && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Credential URL:</span>{" "}
                      <a
                        href={cert.credentialURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View Certificate
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">
          No certifications added yet. Add yours now!
        </p>
      )}
    </div>
  );
};

export default Certifications;
