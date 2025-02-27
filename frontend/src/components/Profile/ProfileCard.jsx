// import React, { useState } from "react";
// import default_image from "../../assets/default_image.png";
// import { SquarePen } from "lucide-react";

// const ProfileCard = ({ user }) => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     gender: user.gender || "",
//     dob: user.dob || "",
//     city: user.city || "",
//     state: user.state || "",
//     experienceLevel: user.experienceLevel || "",
//     jobType: user.jobType || "",
//     phoneNumber: user.phoneNumber || "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleEditClick = () => {
//     setIsPopupOpen(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   return (
//     <>
//       {user.modeofLogin === "email" && (
//         <div className="p-6 bg-white rounded-lg shadow-lg w-80 mr-8 ml-3 pt-14 xl:w-96 xl:h-96 mb-10 lg:sticky lg:top-20 relative">
//           <SquarePen
//             className="w-6 h-6 text-blue-500 absolute top-4 right-4 cursor-pointer"
//             onClick={handleEditClick}
//           />
//           <div className="text-center">
//             <img
//               src={user.profilePhoto || default_image}
//               alt="Profile"
//               className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full object-cover"
//             />
//             <h2 className="mt-4 text-2xl font-bold text-gray-800">
//               {user.fullName?.firstName || user.name || "Unknown"}
//             </h2>
//             <p className="text-gray-600">{user.email}</p>
//             <div className="mt-2 text-sm text-gray-500 flex justify-center">
//               <span className="font-semibold">Experience Level:</span>
//               <span className="ml-1">{user.experienceLevel}</span>
//             </div>
//             <div className="text-sm text-gray-500 flex justify-center">
//               <span className="font-semibold">Job Type:</span>
//               <span className="ml-1">{user.jobType}</span>
//             </div>
//             <p className="text-sm text-gray-500">📞 {user.phoneNumber}</p>
//             {user.resume && (
//               <a
//                 href={user.resume}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block mt-4 text-blue-500 hover:underline"
//               >
//                 View Resume
//               </a>
//             )}
//           </div>
//         </div>
//       )}

//       {user.modeofLogin === "google" && (
//         <div className="p-6 bg-white rounded-lg shadow-lg w-80 mr-8 ml-3 pt-14 xl:w-96 xl:h-80 mb-10 lg:sticky lg:top-20 relative">
//           <SquarePen
//             className="w-6 h-6 text-blue-500 absolute top-4 right-4 cursor-pointer"
//             onClick={handleEditClick}
//           />
//           <div className="text-center mb-2">
//             <img
//               src={user.profilePhoto || default_image}
//               alt="Profile"
//               className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full object-cover"
//             />
//             <h2 className="mt-4 text-2xl font-bold text-gray-800">
//               {user.fullName?.firstName || user.name || "Unknown"}
//             </h2>
//             <p className="text-gray-600">{user.email}</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProfileCard;

import React, { useState } from "react";
import default_image from "../../assets/default_image.png";
import { SquarePen } from "lucide-react";
import Popup from "./Popup";
import { Eye, EyeOff, User, Lock, Phone, Briefcase } from "lucide-react";

const ProfileCard = ({ user }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.fullName?.firstName || "",
    lastName: user.fullName?.lastName || "",
    password: "",
    confirmPassword: "",
    phoneNumber: user.phoneNumber || "",
    experienceLevel: user.experienceLevel || "",
    jobType: user.jobType || "",
    profilePhoto: user.profilePhoto || default_image,
    resume: user.resume || "",
  });
  const isSaveDisabled=
 
    (!formData.firstName?.trim() ||
      !formData.lastName?.trim() ||
      !formData.password?.trim() ||
      !formData.confirmPassword?.trim() ||
      !formData.phoneNumber?.trim() ||
      !formData.experienceLevel?.trim() ||
      !formData.jobType?.trim())

  const handleEditClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
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
        <h3 className="text-xl font-semibold mb-4">Profile Update Details</h3>

        <div className="max-h-96 overflow-y-auto  p-5">
            <label className="block mb-2">First Name:</label>
            <div className="relative">
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
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
                value={formData.lastName}
                onChange={(e) => handleChange(e, "lastName")}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2"></User>
            </div>

            <label className="block mb-2" htmlFor="password">
              Password:
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword.password ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange(e, "password")}
                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
              >
                {showPassword.password ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <label className="block mb-2" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange(e, "confirmPassword")}
                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
              >
                {showPassword.confirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <label className="block mb-2">Phone Number:</label>
            <div className="relative">
              <input
                type="text"
                value={formData.phoneNumber}
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
                value={formData.experienceLevel}
                onChange={(e) => handleChange(e, "experienceLevel")}
                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select experience level</option>
                <option value="Fresher">Fresher</option>
                <option value="Entry-Level">Entry Level</option>
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
                value={formData.jobType}
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
            <label className="block mb-2">Profile Photo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange(e, "profilePhoto")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
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
            // onClick={handleSave}
            disabled={isSaveDisabled}
            className={`px-4 py-2 rounded ${
              isSaveDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Save
          </button>
        </div>
        </div>
      </div>
      )}
    </>
  );
};

export default ProfileCard;
