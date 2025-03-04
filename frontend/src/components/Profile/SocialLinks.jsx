import React, { useState } from "react";
import { LinkedinIcon, GithubIcon, Globe } from "lucide-react";

const SocialLinks = ({ socialLinks, setSocialLinks }) => {
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editLink, setEditLink] = useState({});
  const token = localStorage.getItem("authToken");

  const handleDelete = async (index) => {
    const updatedSocialLinks = socialLinks.filter((_, i) => i !== index);

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
        body: JSON.stringify({ socialLinks: updatedSocialLinks }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete Social Link");
      }

      console.log("Social Links deleted successfully");

      setSocialLinks(updatedSocialLinks);
    } catch (error) {
      console.error("Error deleting social Link:", error);
      setError(error.message);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditLink(socialLinks[index]);
  };

  const isSaveDisabled =
    !editLink.linkedin?.trim() &&
    !editLink.github?.trim() &&
    !editLink.portfolio?.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditLink((prevLink) => ({
      ...prevLink,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const updatedSocialLinks = socialLinks.map((link, index) =>
      index === editIndex ? editLink : link
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
        body: JSON.stringify({ socialLinks: updatedSocialLinks }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Social Link");
      }

      console.log("Social Links updated successfully");

      setSocialLinks(updatedSocialLinks);
      setEditIndex(null);
      setEditLink({});
    } catch (error) {
      console.error("Error updating social Link:", error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-3">
      {socialLinks.length > 0 ? (
        socialLinks.map((link, index) => (
          <div
            key={index}
            className="relative flex flex-col border border-gray-300 p-4 rounded-lg w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 "
          >
            {editIndex !== index && (
              <button
                onClick={() => handleDelete(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
              >
                ❌
              </button>
            )}
            {editIndex === index ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  name="linkedin"
                  value={editLink.linkedin || ""}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="github"
                  value={editLink.github || ""}
                  onChange={handleChange}
                  placeholder="GitHub URL"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="portfolio"
                  value={editLink.portfolio || ""}
                  onChange={handleChange}
                  placeholder="Portfolio URL"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    className={`px-4 py-2 rounded transition ${
                      isSaveDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="text-gray-700 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(index)}
                  className="absolute top-2 right-8 text-gray-500 hover:text-blue-600 transition"
                >
                  ✏️
                </button>
                {link.linkedin && (
                  <div className="flex items-center space-x-3 mb-2">
                    <a
                      href={link.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <LinkedinIcon className="w-5 h-5 mr-2" />
                      <span className="truncate text-base font-medium">
                        {link.linkedin}
                      </span>
                    </a>
                  </div>
                )}
                {link.github && (
                  <div className="flex items-center space-x-3 mb-2">
                    <a
                      href={link.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                      <GithubIcon className="w-5 h-5 mr-2" />
                      <span className="truncate text-base font-medium">
                        {link.github}
                      </span>
                    </a>
                  </div>
                )}
                {link.portfolio && (
                  <div className="flex items-center space-x-3">
                    <a
                      href={link.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      <span className="truncate text-base font-medium">
                        {link.portfolio}
                      </span>
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">Add your Social Profiles here</p>
      )}
    </div>
  );
};

export default SocialLinks;
