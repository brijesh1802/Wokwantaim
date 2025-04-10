import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import {
  SquarePen,
  Briefcase,
  Phone,
  FileText,
  MapPin,
  Camera,
  User,
  Loader2,
} from "lucide-react";

const ProfileCard = ({ user }) => {
  const { userType } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.fullName?.firstName || "",
    lastName: user.fullName?.lastName || "",
    gender: user.gender || "",
    phoneNumber: user.phoneNumber || "",
    experienceLevel: user.experienceLevel || "",
    jobType: user.jobType || "",
    profilePhoto: user.profilePhoto || default_image,
    resume: user.resume || "",
  });

  const [tempFormData, setTempFormData] = useState({ ...formData });

  const handleChange = (e, field) => {
    //console.log("e",e.target)
    const file = e.target.files?.[0];

    if (field === "resume" && file) {
      const fileURL = URL.createObjectURL(file);
      setTempFormData((prevData) => ({
        ...prevData,
        resume: fileURL, // Set as object URL
      }));
    } else if (field === "profilePhoto" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempFormData((prevData) => ({
          ...prevData,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
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
    !tempFormData.gender?.trim() ||
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
      formData.append("gender", tempFormData.gender);

      if (
        tempFormData.profilePhoto &&
        tempFormData.profilePhoto.startsWith("data:image")
      ) {
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
    setTempFormData({ ...formData });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl mb-3 shadow-xl overflow-hidden w-full max-w-sm mx-auto mt-7 
    lg:sticky lg:top-24 lg:mb-8
    md:max-w-md 
    sm:max-w-sm 
    xs:max-w-xs"
    >
      <div className="relative h-40 bg-gradient-to-r from-orange-400 to-orange-600">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          onClick={handleEditClick}
        >
          <SquarePen
            className="w-5 h-5 text-orange-500"
            onClick={handleEditClick}
          />
        </motion.button>
      </div>

      <div className="relative px-6 pb-6">
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src={formData.profilePhoto || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        <div className="pt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {formData.firstName || "Unknown"}
          </h2>
          <p className="text-gray-600 mt-1">{user.email}</p>

          {
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-center text-gray-700">
                <Briefcase className="w-5 h-5 mr-2 text-orange-500" />
                <span>{formData.experienceLevel || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                <span>{formData.jobType || "Not specified"}</span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <Phone className="w-5 h-5 mr-2 text-orange-500" />
                <span>{formData.phoneNumber || "Not provided"}</span>
              </div>
              {formData.resume && (
                <motion.a
                  href={formData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Resume
                </motion.a>
              )}
            </div>
          }
          {isPopupOpen && (
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

                  <label className="block mb-2 text-left">First Name:</label>
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
                    <User className="absolute w-5 h-5 text-orange-500 -translate-y-1/2 left-3 top-1/2" />
                  </div>
                  <label className="block mb-2 text-left">Last Name:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tempFormData.lastName}
                      onChange={(e) => handleChange(e, "lastName")}
                      className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <User className="absolute w-5 h-5 text-orange-500 -translate-y-1/2 left-3 top-1/2"></User>
                  </div>
                  <label className="block mb-2 text-left">Phone Number:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tempFormData.phoneNumber}
                      onChange={(e) => handleChange(e, "phoneNumber")}
                      className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Phone className="absolute w-5 h-5 text-orange-500 -translate-y-1/2 left-3 top-1/2" />
                  </div>
                  <label className="block mb-2 text-left">Gender:</label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={tempFormData.gender}
                      onChange={(e) => handleChange(e, "gender")}
                      className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <User className="absolute w-5 h-5 text-orange-500 -translate-y-1/2 left-3 top-1/2" />
                  </div>
                  <label className="block mb-2 text-left">
                    Experience Level:
                  </label>
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
                    <Briefcase className="absolute w-5 h-5  -translate-y-1/2  top-1/2 left-3 text-orange-500"></Briefcase>
                  </div>
                  <label className="block mb-2 text-left">Job Type:</label>
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
                    <Briefcase className="absolute w-5 h-5  -translate-y-1/2  top-1/2 left-3 text-orange-500" />
                  </div>

                  <label className=" -ml-44 -mr-5 text-left">
                    Upload CV :{" "}
                  </label>
                  {formData.resume && (
                    <a
                      href={formData.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-5 inline-flex px-2 py-1 mb-1 mt-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Current resume
                    </a>
                  )}

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
                    className="px-4 py-2  bg-orange-500 text-white rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    className={`px-4 py-2 w-24 rounded ${
                      isSaveDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin ml-5" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;