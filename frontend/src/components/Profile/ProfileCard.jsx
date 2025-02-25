import React, { useState } from "react";
import default_image from "../../assets/default_image.png";
import { SquarePen } from "lucide-react";

const ProfileCard = ({ user }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    gender: user.gender || "",
    dob: user.dob || "",
    city: user.city || "",
    state: user.state || "",
    experienceLevel: user.experienceLevel || "",
    jobType: user.jobType || "",
    phoneNumber: user.phoneNumber || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {user.modeofLogin === "email" && (
        <div className="p-6 bg-white rounded-lg shadow-lg w-80 mr-8 ml-3 pt-14 xl:w-96 xl:h-96 mb-10 lg:sticky lg:top-20 relative">
          <SquarePen
            className="w-6 h-6 text-blue-500 absolute top-4 right-4 cursor-pointer"
            onClick={handleEditClick}
          />
          <div className="text-center">
            <img
              src={user.profilePhoto || default_image}
              alt="Profile"
              className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full object-cover"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {user.fullName?.firstName || user.name || "Unknown"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-2 text-sm text-gray-500 flex justify-center">
              <span className="font-semibold">Experience Level:</span>
              <span className="ml-1">{user.experienceLevel}</span>
            </div>
            <div className="text-sm text-gray-500 flex justify-center">
              <span className="font-semibold">Job Type:</span>
              <span className="ml-1">{user.jobType}</span>
            </div>
            <p className="text-sm text-gray-500">📞 {user.phoneNumber}</p>
            {user.resume && (
              <a
                href={user.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-blue-500 hover:underline"
              >
                View Resume
              </a>
            )}
          </div>
        </div>
      )}

      {user.modeofLogin === "google" && (
        <div className="p-6 bg-white rounded-lg shadow-lg w-80 mr-8 ml-3 pt-14 xl:w-96 xl:h-80 mb-10 lg:sticky lg:top-20 relative">
          <SquarePen
            className="w-6 h-6 text-blue-500 absolute top-4 right-4 cursor-pointer"
            onClick={handleEditClick}
          />
          <div className="text-center mb-2">
            <img
              src={user.profilePhoto || default_image}
              alt="Profile"
              className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full object-cover"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {user.fullName?.firstName || user.name || "Unknown"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
