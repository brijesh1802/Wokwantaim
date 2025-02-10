import React from "react";

const Certifications = ({
  certifications,
  setCertifications,
  togglePopup,
  setPopupType,
  setPopupData,
}) => {
  // Edit a specific certification
  const handleEdit = (index) => {
    setPopupType("Certification");
    setPopupData({
      name: certifications[index].name,
      link: certifications[index].link,
      issuedDate: certifications[index].issuedDate,
      index, // Store index for updating
    });
    togglePopup();
  };

  // Delete a specific certification
  const handleDelete = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    localStorage.setItem(
      "certifications",
      JSON.stringify(updatedCertifications)
    );
    setCertifications(updatedCertifications);
  };

  return (
    <div className="mt-10">
      {certifications.length > 0 ? (
        certifications.map((cert, index) => (
          <div key={index} className="flex justify-between border-b pb-2 mb-2">
            <div>
              <p>
                <strong>Name:</strong> {cert.name}
              </p>
              <p>
                <strong>Link:</strong>
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 ml-1"
                >
                  {cert.link}
                </a>
              </p>
              <p>
                <strong>Issued Date:</strong> {cert.issuedDate}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Add your certifications here</p>
      )}
    </div>
  );
};

export default Certifications;
