

import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Header() {
  const { userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const[email,setEmail] = useState("")
  const [username, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [manageProfileOpen, setManageProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleLogout = () => {
    logout();
    setUserName("");
    setProfilePhoto(null);
    setNavOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const url =
          userType === "candidate"
            ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/profile`
            : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/profile`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          handleLogout();
          return;
        }

        const data = await response.json();
        setUserName(
          userType === "candidate" ? data.fullName.firstName : data.name
        );
        setProfilePhoto(data.profilePhoto);
         setEmail(data.email);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (userType) fetchUsername();
  }, [userType]);

  // Close dropdown when clicking outside or resizing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setManageProfileOpen(false);
      }
    };

    const handleResize = () => {
      setDropdownOpen(false);
      setManageProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navOpen]);

  return (
    <header className="fixed z-10 w-full bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo & Sidebar Button */}
        <div className="flex items-center space-x-4">
          {/* Show sidebar button only on small screens */}
          <button
            onClick={() => setNavOpen(true)}
            className="text-gray-700 lg:hidden"
          >
            <FaBars size={25} />
          </button>

          <img
            src={Logo}
            alt="Logo"
            className="h-8 hover:cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <nav className="items-center hidden space-x-6 lg:flex">
          <NavLink to="/" className="text-lg hover:text-gray-500">
            Home
          </NavLink>
          {userType === "candidate" || userType === null ? (
            <NavLink
              to="/joblist"
              className={({ isActive }) =>
                `text-xl ml-4 ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "text-gray-600 hover:text-orange-500"
                }`
              }
            >
              Job List
            </NavLink>
          ) : (
            <NavLink
              to="/addjobs"
              className={({ isActive }) =>
                `text-xl ml-4 mt-1 ${
                  isActive
                    ? "text-orange-500 font-semibold"
                    : "text-gray-600 hover:text-orange-500"
                }`
              }
            >
              Add Jobs
            </NavLink>
          )}
          <div className="relative" ref={dropdownRef}>
            {profilePhoto ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="object-cover w-10 h-10 rounded-full"
                />
              </button>
            ) : (
              <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                <NavLink to="/signup" className="text-white">
                  Sign Up
                </NavLink>
                <span className="mx-2 text-gray-400">/</span>
                <NavLink to="/login" className="text-white">
                  Login
                </NavLink>
              </button>
            )}
            {dropdownOpen && (
              <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-lg">
                {/* Profile with Submenu */}
                <button
                  className="flex items-center justify-between block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  onClick={() => setManageProfileOpen(!manageProfileOpen)}
                >
                  Profile{" "}
                  {manageProfileOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {manageProfileOpen && (
                  <div className="pl-4">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </NavLink>
                    {userType === "candidate" && (
                      <NavLink
                        to="/application"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Application
                      </NavLink>
                    )}
                  </div>
                )}

                {/* Safety Tips */}
                <NavLink
                  to="/safety"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Safety Tips
                </NavLink>

                {/* Log Out */}
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Sidebar Menu */}
      {navOpen && (
        <div className="fixed inset-0 z-20 bg-gray-700 bg-opacity-50">
          <div className="fixed top-0 left-0 z-30 h-full bg-white shadow-lg w-72">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute text-gray-700 top-4 right-4"
            >
              <FaTimes size={25} />
            </button>

            <div className="flex flex-col items-start px-4 py-6">
              {/* Section 1: Profile */}

              {profilePhoto ? (
                <button
                  onClick={() => {
                    setNavOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col ml-2 text-sm">
                    <span className="flex items-start">{username}</span>
                    <span>{email}</span>
                  </div>
                </button>
              ) : (
                ""
              )}
              <hr className="w-full my-2 border-gray-300" />

              {/* Section 2: Home & Job List */}
              <NavLink
                to="/"
                className="py-2 text-lg hover:text-orange-500"
                onClick={() => setNavOpen(false)}
              >
                Home
              </NavLink>

              {userType === "candidate" ? (
                <NavLink
                  to="/application"
                  className="py-2 text-lg hover:text-orange-500"
                  onClick={() => setNavOpen(false)}
                >
                  My Application
                </NavLink>
              ) : (
                ""
              )}

              {userType === "candidate" || userType === null ? (
                <NavLink
                  to="/joblist"
                  className="py-2 text-lg hover:text-orange-500"
                  onClick={() => setNavOpen(false)}
                >
                  Job List
                </NavLink>
              ) : (
                <NavLink
                  to="/addjobs"
                  className="py-2 text-lg hover:text-orange-500"
                  onClick={() => setNavOpen(false)}
                >
                  Add Jobs
                </NavLink>
              )}
              <hr className="w-full my-2 border-gray-300" />

              {/* Section 3: More (Dropdown) */}
              <button
                className="flex items-center justify-between w-full py-2 text-lg hover:text-orange-500"
                onClick={() => setMoreOpen(!moreOpen)}
              >
                More {moreOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {moreOpen && (
                <div className="pl-4">
                  <NavLink
                    to="/safety"
                    className="block py-2 text-lg hover:text-orange-500"
                    onClick={() => setNavOpen(false)}
                  >
                    Safety Tips
                  </NavLink>

                  {/* Manage Profile (Nested Dropdown) */}
                  <button
                    className="flex items-center justify-between w-full py-2 text-lg hover:text-orange-500"
                    onClick={() => setManageProfileOpen(!manageProfileOpen)}
                  >
                    Manage Profile{" "}
                    {manageProfileOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {manageProfileOpen && (
                    <div className="pl-4">
                      <NavLink
                        to="/delete-account"
                        className="block py-2 text-lg hover:text-orange-500"
                        onClick={() => setNavOpen(false)}
                      >
                        Delete My Account
                      </NavLink>
                      <NavLink
                        to="/change-password"
                        className="block py-2 text-lg hover:text-orange-500"
                        onClick={() => setNavOpen(false)}
                      >
                        Change Password
                      </NavLink>
                    </div>
                  )}
                </div>
              )}
              <hr className="w-full my-2 border-gray-300" />

              {/* Section 4: Logout or Sign-up/Login */}
              {userType ? (
                <button
                  onClick={handleLogout}
                  className="py-2 text-lg hover:text-orange-500"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <NavLink
                    to="/signup"
                    className="py-2 text-lg hover:text-orange-500"
                    onClick={() => setNavOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="py-2 text-lg hover:text-orange-500"
                    onClick={() => setNavOpen(false)}
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
