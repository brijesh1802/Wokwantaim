import React, { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
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
    <div className="overflow-y-auto max-h-[380px]  mt-5 space-y-6">
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
                <div className="relative space-y-4 bg-white p-6 rounded-xl">
                  {[
                    "title",
                    "issuingOrganization",
                    "credentialId",
                    "credentialURL",
                  ].map((field) => (
                    <div key={field} className="relative">
                      <label
                        htmlFor={field}
                        className="absolute top-2 left-4 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
                      >
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        id={field}
                        type="text"
                        name={field}
                        value={editStates[index]?.[field] || ""}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full px-4 pt-6 pb-2 rounded-lg bg-gray-50 border border-gray-300 
                     focus:ring-2 focus:ring-blue-400 focus:outline-none transition peer"
                        placeholder=" " // Keep placeholder empty for floating effect
                      />
                    </div>
                  ))}
                  {["issueDate", "expirationDate"].map((field) => (
                    <div key={field} className="relative">
                      <label
                        htmlFor={field}
                        className="absolute top-2 left-4 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
                      >
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        id={field}
                        type="date"
                        name={field}
                        value={editStates[index]?.[field] || ""}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full px-4 pt-6 pb-2 rounded-lg bg-gray-50 border border-gray-300
                     focus:ring-2 focus:ring-blue-400 focus:outline-none transition peer"
                      />
                    </div>
                  ))}

                  <div className="flex absolute space-x-2 pt-2 -top-7 right-1">
                    <button
                      onClick={() => handleSave(index)}
                      disabled={isSaveDisabled(index)}
                      className={`text-gray-400 hover:text-green-500 transition ${
                        isSaveDisabled(index) ? "cursor-not-allowed" : ""
                      }`}
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
        <p className="text-gray-500 italic col-span-full text-center">
          No certifications added yet. Add yours now!
        </p>
      )}
    </div>
  );
};

export default Certifications;
