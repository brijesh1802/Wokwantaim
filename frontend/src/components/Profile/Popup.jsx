import { useState } from "react";
import { Eye, EyeOff, User, Lock, Phone, Briefcase } from "lucide-react";
const Popup = ({ type, data, setData, handleSave, togglePopup }) => {
  // Handle inputs based on the type of data (social, certifications, etc.)
  const handleChange = (e, field) => {
    const updatedData = { ...data, [field]: e.target.value };
    setData(updatedData);
  };
  // const [showPassword, setShowPassword] = useState({
  //   password: false,
  //   confirmPassword: false,
  // });
  // const togglePasswordVisibility = (field) => {
  //   setShowPassword((prevState) => ({
  //     ...prevState,
  //     [field]: !prevState[field],
  //   }));
  // };
  // Check if all required fields are filled
  const isSaveDisabled =
    (type === "Social Links" &&
      !data.linkedin?.trim() &&
      !data.github?.trim()) ||
    (type === "Certification" &&
      (!data.name?.trim() || !data.link?.trim() || !data.issuedDate?.trim())) ||
    (type === "Education" &&
      (!data.name?.trim() ||
        !data.grade?.trim() ||
        !data.fromDate?.trim() ||
        !data.toDate?.trim())) ||
    (type === "Skills" && (!data.skill?.trim() || !data.proficiency?.trim())) ||
    (type === "Experience" &&
      (!data.company?.trim() ||
        !data.role?.trim() ||
        !data.industry?.trim() ||
        !data.fromDate?.trim() ||
        !data.toDate?.trim()))

  const renderFormFields = () => {
    switch (type) {
      case "Social Links":
        return (
          <>
            <label className="block mb-2">LinkedIn URL:</label>
            <input
              type="url"
              value={data.linkedin}
              onChange={(e) => handleChange(e, "linkedin")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">GitHub URL:</label>
            <input
              type="url"
              value={data.github}
              onChange={(e) => handleChange(e, "github")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Certification":
        return (
          <>
            <label className="block mb-2">Certification Name:</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange(e, "name")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Certification Link:</label>
            <input
              type="url"
              value={data.link}
              onChange={(e) => handleChange(e, "link")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Issued Date:</label>
            <input
              type="date"
              value={data.issuedDate}
              onChange={(e) => handleChange(e, "issuedDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Education":
        return (
          <>
            <label className="block mb-2">Institution Name:</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange(e, "name")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Percentage/CGPA:</label>
            <input
              type="number"
              value={data.grade}
              onChange={(e) => handleChange(e, "grade")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">From:</label>
            <input
              type="date"
              value={data.fromDate}
              onChange={(e) => handleChange(e, "fromDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">To:</label>
            <input
              type="date"
              value={data.toDate}
              onChange={(e) => handleChange(e, "toDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Skills":
        return (
          <>
            <label className="block mb-2">Skill:</label>
            <input
              type="text"
              value={data.skill}
              onChange={(e) => handleChange(e, "skill")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Proficiency:</label>
            <input
              type="text"
              value={data.proficiency}
              onChange={(e) => handleChange(e, "proficiency")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      case "Experience":
        return (
          <>
            <label className="block mb-2">Company Name:</label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => handleChange(e, "company")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Role:</label>
            <input
              type="text"
              value={data.role}
              onChange={(e) => handleChange(e, "role")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">Industry:</label>
            <input
              type="text"
              value={data.industry}
              onChange={(e) => handleChange(e, "industry")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">From:</label>
            <input
              type="date"
              value={data.fromDate}
              onChange={(e) => handleChange(e, "fromDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <label className="block mb-2">To:</label>
            <input
              type="date"
              value={data.toDate}
              onChange={(e) => handleChange(e, "toDate")}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </>
        );
      // case "Profile Update":
      //   return (
      //     <div className="max-h-96 overflow-y-auto  p-5">
      //       <label className="block mb-2">First Name:</label>
      //       <div className="relative">
      //         <input
      //           id="firstName"
      //           name="firstName"
      //           value={data.firstName}
      //           onChange={(e) => handleChange(e, "firstName")}
      //           placeholder="John Doe"
      //           className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //           required
      //         />
      //         <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //       </div>
      //       <label className="block mb-2">Last Name:</label>
      //       <div className="relative">
      //         <input
      //           type="text"
      //           value={data.lastName}
      //           onChange={(e) => handleChange(e, "lastName")}
      //           className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //         />
      //         <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2"></User>
      //       </div>

      //       <label className="block mb-2" htmlFor="password">
      //         Password:
      //       </label>
      //       <div className="relative">
      //         <input
      //           id="password"
      //           name="password"
      //           type={showPassword.password ? "text" : "password"}
      //           value={data.password}
      //           onChange={(e) => handleChange(e, "password")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //           required
      //         />
      //         <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //         <button
      //           type="button"
      //           onClick={() => togglePasswordVisibility("password")}
      //           className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
      //         >
      //           {showPassword.password ? (
      //             <EyeOff className="w-4 h-4" />
      //           ) : (
      //             <Eye className="w-4 h-4" />
      //           )}
      //         </button>
      //       </div>

      //       <label className="block mb-2" htmlFor="confirmPassword">
      //         Confirm Password:
      //       </label>
      //       <div className="relative">
      //         <input
      //           id="confirmPassword"
      //           name="confirmPassword"
      //           type={showPassword.confirmPassword ? "text" : "password"}
      //           value={data.confirmPassword}
      //           onChange={(e) => handleChange(e, "confirmPassword")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //           required
      //         />
      //         <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //         <button
      //           type="button"
      //           onClick={() => togglePasswordVisibility("confirmPassword")}
      //           className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
      //         >
      //           {showPassword.confirmPassword ? (
      //             <EyeOff className="w-4 h-4" />
      //           ) : (
      //             <Eye className="w-4 h-4" />
      //           )}
      //         </button>
      //       </div>

      //       <label className="block mb-2">Phone Number:</label>
      //       <div className="relative">
      //         <input
      //           type="text"
      //           value={data.phoneNumber}
      //           onChange={(e) => handleChange(e, "phoneNumber")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //         />
      //         <Phone className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //       </div>
      //       <label className="block mb-2">Experience Level:</label>
      //       <div className="relative">
      //         <select
      //           id="experienceLevel"
      //           name="experienceLevel"
      //           value={data.experienceLevel}
      //           onChange={(e) => handleChange(e, "experienceLevel")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      //         >
      //           <option value="">Select experience level</option>
      //           <option value="Fresher">Fresher</option>
      //           <option value="Entry-Level">Entry Level</option>
      //           <option value="Mid-Level">Mid Level</option>
      //           <option value="Senior-Level">Senior Level</option>
      //         </select>
      //         <Briefcase className="absolute w-5 h-5  -translate-y-1/2  top-1/2 left-3 text-gray-300"></Briefcase>
      //       </div>
      //       <label className="block mb-2">Job Type:</label>
      //       <div className="relative">
      //         <select
      //           id="jobType"
      //           name="jobType"
      //           value={data.jobType}
      //           onChange={(e) => handleChange(e, "jobType")}
      //           className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
         
      //         >
      //           <option value="">Select job type</option>
      //           <option value="Full-time">Full Time</option>
      //           <option value="Part-time">Part Time</option>
      //           <option value="Internship">Internship</option>
      //           <option value="Contract">Contract</option>
      //         </select>
      //         <Briefcase className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      //       </div>
      //       <label className="block mb-2">Profile Photo:</label>
      //       <input
      //         type="file"
      //         accept="image/*"
      //         onChange={(e) => handleChange(e, "profilePhoto")}
      //         className="w-full p-2 border border-gray-300 rounded mb-4"
      //       />
      //       <label className="block mb-2">Upload CV:</label>
      //       <input
      //         type="file"
      //         accept="application/pdf"
      //         onChange={(e) => handleChange(e, "resume")}
      //         className="w-full p-2 border border-gray-300 rounded mb-4"
      //       />
      //     </div>
      //   );
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="popup-content bg-white p-6 rounded-md shadow-lg w-[32rem]">
        <h3 className="text-xl font-semibold mb-4">{type} Details</h3>

        {renderFormFields()}

        <div className="flex justify-between mt-4">
          <button
            onClick={togglePopup}
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
