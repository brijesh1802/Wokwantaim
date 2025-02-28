import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Briefcase,
  Image,
  Phone,
  File,
} from "lucide-react";

const AnimatedInput = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon,
  showPassword,
  togglePasswordVisibility,
  required,
  maxLength,
  accept,
}) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500">{icon}</span>
      </div>
      <input
        type={type}
        name={name}
        id={id}
        className="block w-full py-3 pl-10 pr-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        accept={accept}
      />
      {showPassword && (
        <motion.button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </motion.button>
      )}
    </div>
  </motion.div>
);

const AnimatedSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  icon,
  required,
}) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500">{icon}</span>
      </div>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full py-3 pl-10 pr-3 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </motion.div>
);

const AnimatedFileUpload = ({ label, id, name, accept, onChange, icon, filename }) => {
  const truncateFilename = (name, maxLength) => {
    if (!name) return '';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3">
            <label
              htmlFor={id}
              className="cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              <input
                id={id}
                name={name}
                type="file"
                accept={accept}
                onChange={onChange}
                className="sr-only"
              />
              <span className="px-3 py-2 border border-gray-300 rounded-md inline-block">Choose file</span>
            </label>
            {filename && <span className="ml-2 text-sm text-gray-500">{truncateFilename(filename, 20)}</span>}
          </div>
        </div>
        <p className="text-xs text-gray-500 ml-4">
          {accept === ".pdf" ? "PDF up to 5MB" : "PNG, JPG, JPEG up to 5MB"}
        </p>
      </div>
    </motion.div>
  );
};





function SignupForm({ userType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    experienceLevel: "",
    jobType: "",
    phoneNumber: "",
    profilePhoto: null,
    resume: null,
    name: "",
    website: "",
    joinType: "",
  });

  useEffect(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      experienceLevel: "",
      jobType: "",
      phoneNumber: "",
      profilePhoto: null,
      resume: null,
      name: "",
      website: "",
      joinType: "",
    });
  }, [userType]);

  const [fileNames, setFileNames] = useState({
    profilePhoto: null,
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
    setFileNames({
      ...fileNames,
      [name]: files[0] ? files[0].name : null,
    });
  };;

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPopup({
        visible: true,
        message: "Passwords do not match!",
        isError: true,
      });
      setTimeout(() => {
        setPopup({ visible: false, message: "", isError: false });
      }, 3000);
      return;
    }

    setLoading(true);
    const url =
      userType === "candidate"
        ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/signup`
        : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/signup`;

    let data = new FormData();
    if (userType === "candidate") {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });
    } else {
      data = {
        name: formData.name,
        phone: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        joinType: formData.joinType,
        website: formData.website,
      };
    }
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type":
            userType === "candidate"
              ? "multipart/form-data"
              : "application/json",
        },
      });
      console.log("Signup successful:", response.data);
      setPopup({
        visible: true,
        message: "Email sent for verification!",
        isError: false,
      });
      setRedirect(true);
      setTimeout(() => {
        setPopup({ visible: false, message: "", isError: false });
        setRedirect(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
      setPopup({
        visible: true,
        message:
          error.response?.data?.message || error.message || "Signup failed!",
        isError: true,
      });

      setTimeout(() => {
        setPopup({ visible: false, message: "", isError: false });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  const popupVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <motion.div
      className="p-8 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.form
        className="space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        {userType === "candidate" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatedInput
              label="First name"
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
              icon={<User className="h-5 w-5" />}
            />
            <AnimatedInput
              label="Last name"
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              icon={<User className="h-5 w-5" />}
            />
          </div>
        ) : (
          <AnimatedInput
            label="Full Name"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            icon={<User className="h-5 w-5" />}
          />
        )}

        <AnimatedInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          required
          icon={<Mail className="h-5 w-5" />}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <AnimatedInput
            label="Password"
            id="password"
            name="password"
            type={showPassword.password ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            icon={<Lock className="h-5 w-5" />}
            showPassword={showPassword.password}
            togglePasswordVisibility={() => togglePasswordVisibility("password")}
          />
          <AnimatedInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword.confirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            icon={<Lock className="h-5 w-5" />}
            showPassword={showPassword.confirmPassword}
            togglePasswordVisibility={() =>
              togglePasswordVisibility("confirmPassword")
            }
          />
        </div>

        <div
          className={`grid gap-6 ${
            userType !== "candidate" ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          <AnimatedInput
            label="Phone Number"
            id="phone"
            name="phoneNumber"
            type="tel"
            maxLength={10}
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            icon={<Phone className="h-5 w-5" />}
          />
          {userType !== "candidate" && (
            <AnimatedInput
              label="Website"
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website"
              required
              icon={<User className="h-5 w-5" />}
            />
          )}
        </div>

        <AnimatedSelect
          label={userType === "candidate" ? "Experience Level" : "Join Type"}
          id="level"
          name={userType === "candidate" ? "experienceLevel" : "joinType"}
          value={
            userType === "candidate"
              ? formData.experienceLevel
              : formData.joinType
          }
          onChange={handleChange}
          options={
            userType === "candidate"
              ? [
                  { value: "", label: "Select experience level" },
                  { value: "Fresher", label: "Fresher" },
                  { value: "Entry-Level", label: "Entry Level" },
                  { value: "Mid-Level", label: "Mid Level" },
                  { value: "Senior-Level", label: "Senior Level" },
                ]
              : [
                  { value: "", label: "Select join type" },
                  { value: "company", label: "Company" },
                  { value: "recruiter", label: "Recruiter" },
                  { value: "agency", label: "Agency" },
                ]
          }
          icon={<Briefcase className="h-5 w-5" />}
          required
        />

        {userType === "candidate" && (
          <AnimatedSelect
            label="Job Type"
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            options={[
              { value: "", label: "Select job type" },
              { value: "Full-time", label: "Full Time" },
              { value: "Part-time", label: "Part Time" },
              { value: "Internship", label: "Internship" },
              { value: "Contract", label: "Contract" },
            ]}
            icon={<Briefcase className="h-5 w-5" />}
            required
          />
        )}

        {userType === "candidate" && (
          <>
            <AnimatedFileUpload
              label="Upload profile photo"
              id="profilePhoto"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              icon={<Image className="h-5 w-5" />}
              filename={fileNames.profilePhoto}
            />

            <AnimatedFileUpload
              label="Upload CV"
              id="resume"
              name="resume"
              accept=".pdf"
              onChange={handleFileChange}
              icon={<File className="h-5 w-5" />}
              filename={fileNames.resume}
            />
          </>
        )}


        <motion.button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <div className="spinner"></div>
          ) : redirect ? (
            "Redirecting..."
          ) : (
            "Sign Up"
          )}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {popup.visible && (
          <motion.div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white ${
              popup.isError ? "bg-red-500" : "bg-green-500"
            }`}
            variants={popupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SignupForm;
