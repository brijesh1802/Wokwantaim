import React, { useState } from "react";
import { LinkedinIcon, GithubIcon, Globe,Pencil,X } from "lucide-react";

const SocialLinks = ({ socialLinks, setSocialLinks }) => {
  const [error, setError] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editLink, setEditLink] = useState({});
  const token = localStorage.getItem("authToken");

  const updateSocialLinks = async (updatedLinks) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/update`;
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

  const handleDelete = async (index) => {
    const updatedSocialLinks = socialLinks.filter((_, i) => i !== index);
    const success = await updateSocialLinks(updatedSocialLinks);
    if (success) {
      console.log("Social Link deleted successfully");
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

  const isSaveDisabled = !Object.values(editLink).some(value => value?.trim());

  const EditForm = ({ link, onChange, onSave, onCancel, isSaveDisabled }) => (
    <div className="space-y-3">
      {['linkedin', 'github', 'portfolio'].map(platform => (
        <input
          key={platform}
          type="text"
          name={platform}
          value={link[platform] || ""}
          onChange={onChange}
          placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
          className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ))}
      <div className="flex justify-end space-x-2">
        <button
          onClick={onSave}
          disabled={isSaveDisabled}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            isSaveDisabled ? "bg-gray-200 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
  
  const DisplayLinks = ({ link, onEdit, onDelete }) => (
    <div className="relative">
      <div className="absolute top-0 right-0 space-x-2">
        <button onClick={onEdit} className="text-gray-400 hover:text-blue-500">
          <Pencil size={20}/>
        </button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500">
          <X size={20} />
        </button>
      </div>
      {Object.entries(link).map(([platform, url]) => url && (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 mb-2 text-gray-700 hover:text-blue-600"
        >
          <PlatformIcon platform={platform} />
          <span className="truncate">{url}</span>
        </a>
      ))}
    </div>
  );
  
  const EditIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
  
  const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
  
  const PlatformIcon = ({ platform }) => {
    switch (platform) {
      case 'linkedin':
        return <LinkedinIcon className="w-5 h-5" />;
      case 'github':
        return <GithubIcon className="w-5 h-5" />;
      case 'portfolio':
        return <Globe className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {socialLinks.length > 0 ? (
        socialLinks.map((link, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
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
                onEdit={() => handleEdit(index)} 
                onDelete={() => handleDelete(index)} 
              />
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">Add your Social Profiles here</p>
      )}
    </div>
  );
};

export default SocialLinks;
