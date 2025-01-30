import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
    address: "",
    phone: "",
    website: "",
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
      address: "",
      phone: "",
      website: "",
    });
  }, [userType]);

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
  };

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url =
      userType === "candidate"
        ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/signup`
        : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/signup`;

    let data;
    if (userType === "candidate") {
      data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("experienceLevel", formData.experienceLevel);
      data.append("jobType", formData.jobType);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("profilePhoto", formData.profilePhoto);
      data.append("resume", formData.resume);
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

    console.log(data);

    if (formData.password !== formData.confirmPassword) {
      setPopup((prevState) => ({
        ...prevState,
        visible: true,
        message: "Passwords do not match!",
        isError: true,
      }));
      setTimeout(() => {
        setPopup({ visible: false, message: "", isError: false });
      }, 3000);
      setLoading(false);
      return;
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
      setPopup((prevState) => ({
        ...prevState,
        visible: true,
        message: "Signup successful!",
        isError: false,
      }));

      setTimeout(() => {
        setPopup({ visible: false, message: "", isError: false });
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error.response.data);
      setPopup({
        visible: true,
        message: error.response.data.msg || "Signup failed!",
        isError: true,
      });

      // Auto-close popup after a delay
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
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {userType === "candidate" ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm" htmlFor="firstName">
                First name
              </label>
              <div className="relative">
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm" htmlFor="lastName">
                Last name
              </label>
              <div className="relative">
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword.password ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
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
          </div>
          <div className="space-y-2">
            <label className="text-sm" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
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
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            userType !== "candidate" ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          <div className="space-y-2">
            <label className="text-sm" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phoneNumber"
                type="tel"
                maxLength="10"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />

              <Phone className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
          </div>
          {userType !== "candidate" && (
            <div className="space-y-2">
              <label className="text-sm" htmlFor="website">
                Website
              </label>
              <div className="relative">
                <input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website"
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <User className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm" htmlFor="level">
            {userType === "candidate" ? "Experience Level" : "Join Type"}
          </label>
          <div className="relative">
            <select
              id="level"
              name={userType === "candidate" ? "experienceLevel" : "joinType"}
              value={
                userType === "candidate"
                  ? formData.experienceLevel
                  : formData.joinType
              }
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {userType === "candidate" ? (
                <>
                  <option value="">Select experience level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Entry-Level">Entry Level</option>
                  <option value="Mid-Level">Mid Level</option>
                  <option value="Senior-Level">Senior Level</option>
                </>
              ) : (
                <>
                  <option value="">Select join type</option>
                  <option value="company">Company</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="agency">Agency</option>
                </>
              )}
            </select>
            <Briefcase className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          </div>
        </div>

        {userType === "candidate" && (
          <div className="space-y-2">
            <label className="text-sm" htmlFor="jobType">
              Job Type
            </label>
            <div className="relative">
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full Time</option>
                <option value="Part-time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
              <Briefcase className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            </div>
          </div>
        )}

        {userType === "candidate" && (
          <>
            <div className="space-y-2">
              <label className="text-sm">Upload profile photo</label>
              <div className="relative">
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <Image className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
              <p className="text-xs text-gray-500">No file chosen</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Upload CV</label>
              <div className="relative">
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <File className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              </div>
              <p className="text-xs text-gray-500">No file chosen</p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {loading ? <div className="spinner"></div> : "Sign Up"}
        </button>
      </form>
      {popup.visible && (
        <div
          className={`fixed top-0 left-1/2 transform -translate-x-1/2 mt-10 px-4 py-2 rounded-lg shadow-lg text-white ${
            popup.isError ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {popup.message}
        </div>
      )}
    </>
  );
}

export default SignupForm;
