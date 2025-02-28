

import React, { useState, useContext, useEffect } from "react";
import default_image from "../../assets/default_image.png";
import { AuthContext } from "../../context/AuthContext";
import { SquarePen, Loader2, Camera } from "lucide-react";
import Popup from "./Popup";
import { Eye, EyeOff, User, Lock, Phone, Briefcase } from "lucide-react";

const ProfileCard = ({ user }) => {
  const { userType } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.fullName?.firstName || "",
    lastName: user.fullName?.lastName || "",

    phoneNumber: user.phoneNumber || "",
    experienceLevel: user.experienceLevel || "",
    jobType: user.jobType || "",
    profilePhoto: user.profilePhoto || default_image,
    resume: user.resume || "",
  });
  const [tempFormData, setTempFormData] = useState({ ...formData });

  const handleChange = (e, field) => {
    if (field === "profilePhoto") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setTempFormData((prevData) => ({
            ...prevData,
            profilePhoto: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else if (field === "resume") {
      const file = e.target.files[0];
      if (file) {
        setTempFormData((prevData) => ({
          ...prevData,
          resume: file,
        }));
      }
    } else {
      setTempFormData((prevData) => ({
        ...prevData,
        [field]: e.target.value,
      }));
    }
  };

  const isSaveDisabled =
    !tempFormData.firstName?.trim() ||
    !tempFormData.phoneNumber?.trim() ||
    !tempFormData.experienceLevel?.trim() ||
    !tempFormData.jobType?.trim();

    const handleSave = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token is missing! Please log in again.");
          return;
        }
    
        const url =
          userType === "candidate"
            ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/update`
            : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/update`;
    
        const formData = new FormData();
    
        // Append individual fullName fields
        formData.append("fullName[firstName]", tempFormData.firstName);
        formData.append("fullName[lastName]", tempFormData.lastName);
    
        // Append other fields
        formData.append("phoneNumber", tempFormData.phoneNumber);
        formData.append("experienceLevel", tempFormData.experienceLevel);
        formData.append("jobType", tempFormData.jobType);
        if (tempFormData.profilePhoto && tempFormData.profilePhoto.startsWith("data:image")) {
          const response = await fetch(tempFormData.profilePhoto);
          const blob = await response.blob();
          const file = new File([blob], "profilePhoto.jpg", { type: blob.type });
          formData.append("profilePhoto", file);
        } else if (tempFormData.profilePhoto instanceof File) {
          formData.append("profilePhoto", tempFormData.profilePhoto);
        }
        if (tempFormData.resume instanceof File) {
          formData.append("resume", tempFormData.resume);
        }
    
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to update profile: ${response.status} - ${errorText}`
          );
        }
    
        const updatedProfile = await response.json();
        console.log("Profile updated successfully:", updatedProfile);
    
        setFormData(tempFormData);
        handleClosePopup();
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    };
    
    

  const handleEditClick = () => {
    setTempFormData({...formData})
    setIsPopupOpen(true);
   
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      {user.modeofLogin === "google" && (
        <div className="p-6 bg-white rounded-lg shadow-lg w-80 mr-8 ml-3 pt-14 xl:w-96 xl:h-80 mb-10 lg:sticky lg:top-20 relative">
          <SquarePen
            className="w-6 h-6 text-blue-500 absolute top-4 right-4 cursor-pointer"
            onClick={handleEditClick}
          />
          <div className="text-center mb-2">
            <img
              src={formData.profilePhoto}
              alt="Profile"
              className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full object-cover"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      )}
      {isPopupOpen && (
        // <Popup
        //   type="Profile Update"
        //   data={formData}
        //   setData={setFormData}
        //   togglePopup={handleClosePopup}
        // />
        <div className="popup-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="popup-content bg-white p-6 rounded-md shadow-lg w-[32rem]">
            <h3 className="text-xl font-semibold mb-4">
              Profile Update Details
            </h3>

            <div className="max-h-96 overflow-y-auto  p-5">
              <div className="flex justify-center items-center">
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-500 bg-blue-500 flex justify-center items-center">
                  <img
                    src={tempFormData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute bottom-0 right-5 bg-gray-800 p-2 rounded-full cursor-pointer">
                    <Camera className="w-6 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleChange(e, "profilePhoto")}
                    />
                  </label>
                </div>
              </div>

              <label className="block mb-2">First Name:</label>
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  value={tempFormData.firstName}
                  onChange={(e) => handleChange(e, "firstName")}
                  placeholder="John Doe"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
              <label className="block mb-2">Last Name:</label>
              <div className="relative">
                <input
                  type="text"
                  value={tempFormData.lastName}
                  onChange={(e) => handleChange(e, "lastName")}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2"></User>
              </div>
              <label className="block mb-2">Phone Number:</label>
              <div className="relative">
                <input
                  type="text"
                  value={tempFormData.phoneNumber}
                  onChange={(e) => handleChange(e, "phoneNumber")}
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Phone className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
              <label className="block mb-2">Experience Level:</label>
              <div className="relative">
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={tempFormData.experienceLevel}
                  onChange={(e) => handleChange(e, "experienceLevel")}
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select experience level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid Level</option>
                  <option value="Senior-Level">Senior Level</option>
                </select>
                <Briefcase className="absolute w-5 h-5  -translate-y-1/2  top-1/2 left-3 text-gray-300"></Briefcase>
              </div>
              <label className="block mb-2">Job Type:</label>
              <div className="relative">
                <select
                  id="jobType"
                  name="jobType"
                  value={tempFormData.jobType}
                  onChange={(e) => handleChange(e, "jobType")}
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select job type</option>
                  <option value="Full-time">Full Time</option>
                  <option value="Part-time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
                <Briefcase className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>

              <label className="block mb-2">Upload CV:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleChange(e, "resume")}
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`px-4 py-2 rounded ${
                  isSaveDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
