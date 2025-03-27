import React, { useState } from "react";
import {
  LinkedinIcon,
  GithubIcon,
  Globe,
  Pencil,
  X,
  Check,
  ChartCandlestick,
} from "lucide-react";

const SocialLinks = ({ socialLinks, setSocialLinks }) => {
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editLink, setEditLink] = useState({});
  const token = localStorage.getItem("authToken");

  const updateSocialLinks = async (updatedLinks) => {
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
        body: JSON.stringify({ socialLinks: updatedLinks }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Social Links");
      }

      setSocialLinks(updatedLinks);
      return true;
    } catch (error) {
      console.error("Error updating social Links:", error);
      setError(error.message);
      return false;
    }
  };

  // ✅ Updated delete function to remove only a specific link
  const handleDelete = async (index, platform) => {
    const updatedSocialLinks = socialLinks
      .map((link, i) => {
        if (i === index) {
          const newLink = { ...link };
          delete newLink[platform]; // Remove only the selected platform link

          return Object.keys(newLink).length > 0 ? newLink : null; // Remove empty objects
        }
        return link;
      })
      .filter(Boolean); // Remove null entries

    const success = await updateSocialLinks(updatedSocialLinks);
    if (success) {
      console.log(`Deleted ${platform} link successfully`);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditLink(socialLinks[index]);
  };

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
    const success = await updateSocialLinks(updatedSocialLinks);
    if (success) {
      console.log("Social Links updated successfully");
      setEditIndex(null);
      setEditLink({});
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isSaveDisabled = !Object.values(editLink).some((value) =>
    value?.trim()
  );

  const EditForm = ({ link, onChange, onSave, onCancel, isSaveDisabled }) => (
    <div className="relative space-y-3 ">
      {["linkedin", "github", "portfolio"].map((platform) => (
        <div key={platform} className="relative">
          <label
            htmlFor={platform}
            className="top-2 left-4 text-gray-[800] text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base"
          >
            {/* {field.replace(/([A-Z])/g, " $1").trim()} */}
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </label>
          <input
            id={platform}
            type="text"
            name={platform}
            value={link[platform] || ""}
            onChange={onChange}
            placeholder={`${
              platform.charAt(0).toUpperCase() + platform.slice(1)
            } URL`}
            className="w-full px-4 pt-2 pb-2 rounded-lg border border-gray-300 
            focus:ring-2 focus:ring-orange-300 focus:outline-none transition peer"
          />
        </div>
      ))}
      <div className="absolute -top-7 right-4 flex justify-end space-x-2 ">
        <button
          onClick={onSave}
          disabled={isSaveDisabled}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isSaveDisabled
              ? "bg-gray-200 text-gray-400"
              : "text-gray-400 hover:text-green-500 transition"
          }`}
        >
          <Check size={20} />
        </button>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );

  const platformColors = {
    linkedin: "bg-blue-100",
    github: "bg-gray-100",
    portfolio: "bg-green-100",
  };

  const DisplayLinks = ({ link, index, onEdit, onDelete }) => (
    <div className="relative py-3 -mt-6">
      {/* Pencil Icon - Positioned properly */}
      <button
        onClick={onEdit}
        className="absolute top-2 right-2 flex items-center space-x-1 text-gray-400 hover:text-blue-500"
      >
        <span>Add/Edit</span>
        <Pencil size={18} />
      </button>

      {/* Social Links */}
      <div className="space-y-2 mt-6">
        {Object.entries(link).map(
          ([platform, url]) =>
            url && (
              <div
                key={platform}
                className={`flex flex-row items-center justify-between  px-2 rounded-full py-1 w-full max-w-[450px] ${
                  platformColors[platform] || "bg-gray-200"
                }`}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <PlatformIcon platform={platform} />
                  <span className="truncate">{url}</span>
                </a>
                <button
                  onClick={() => onDelete(index, platform)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );

  const PlatformIcon = ({ platform }) => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="w-5 h-5" />;
      case "github":
        return <GithubIcon className="w-5 h-5" />;
      case "portfolio":
        return <Globe className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {socialLinks.length > 0 ? (
        socialLinks.map((link, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            {editIndex === index ? (
              <EditForm
                link={editLink}
                onChange={handleChange}
                onSave={handleSave}
                onCancel={() => setEditIndex(null)}
                isSaveDisabled={isSaveDisabled}
              />
            ) : (
              <DisplayLinks
                link={link}
                index={index}
                onEdit={() => handleEdit(index)}
                onDelete={handleDelete}
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">
          Add your Social Profiles here
        </p>
      )}
    </div>
  );
};

export default SocialLinks;
