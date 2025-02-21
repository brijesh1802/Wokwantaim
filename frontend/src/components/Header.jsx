import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes ,FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useContext,useRef } from "react";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import default_img from "../assets/default_image.png";
import LogoutConfirmation from "./LogoutConfirmation";
import ChangePasswordConfirmation from "./ChangePasswordConfirmation";
import Loading from "./Loading";

function Header() {
  const { userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [manageProfileOpen, setManageProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePasswordConfirmOpen, setChangePasswordConfirmOpen] =
    useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const sideNavRef = useRef(null);

  const handleSubmit = async () => {
    const email = userData.email;
    if (!email) return;

    const url = `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/auth/request-password-reset`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("Response Data:", data);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleLogout = () => {
    logout();
    setUserData(null);
    setNavOpen(false);
  };


  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLoading(true);
    setLogoutConfirmOpen(false);
    setTimeout(() => {
      handleLogout(); // Call your logout function

      setLoading(false); // Hide loading after logout
    }, 3000);
  };

  const handleLogoutCancel = () => {
    setLogoutConfirmOpen(false);
  };

  const handleChangePasswordClick = () => {
    setChangePasswordConfirmOpen(true);
  };

  const handleChangePasswordConfirm = () => {
    handleSubmit();
    handleLogout();
    navigate("/login");
    setChangePasswordConfirmOpen(false);
  };

  const handleChangePasswordCancel = () => {
    setChangePasswordConfirmOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setNavOpen(false);
        setDropdownOpen(false);
        setMoreOpen(false);
        setManageProfileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
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
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userType && !userData) fetchUserData();
  }, [userType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        setNavOpen(false);
        setDropdownOpen(false);
        setMoreOpen(false);
        setManageProfileOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navOpen]);

  return (

    <header className="fixed z-10 w-full bg-white shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
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
                `text-xl ml-4 ${
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
            {userType && userData ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={userData.profilePhoto || default_img}
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
              <div className="absolute right-0 min-w-max py-2 mt-2 bg-white rounded-md shadow-lg">
                <button
                  className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex justify-between items-center"
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
                        to="/applications"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Application
                      </NavLink>
                    )}
                    <NavLink
                      to="delete-account"
                      className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Delete My Account
                    </NavLink>
                    {userData?.modeofLogin === "email" && (
                      <NavLink
                        onClick={() => {
                          setDropdownOpen(false);
                          {
                            handleChangePasswordClick();
                          }
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                      >
                        Change Password
                      </NavLink>
                    )}
                  </div>
                )}

                <NavLink
                  to="/safety"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Safety Tips
                </NavLink>

                <button
                  onClick={handleLogoutClick}
                  className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {navOpen && (
        <div className="fixed inset-0 z-20 bg-gray-700 bg-opacity-50">
          <div
            ref={sideNavRef}
            className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg w-72 transform ${
              navOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out overflow-y-auto max-h-screen`}
          >
            <button
              onClick={() => setNavOpen(false)}
              className="absolute text-gray-700 top-4 right-4"
            >
              <FaTimes size={25} />
            </button>

            <div className="flex flex-col items-start px-4 py-6">
              {userType && userData ? (
                <div
                  className="flex flex-col ml-2 text-sm hover:cursor-pointer"
                  onClick={() => {
                    navigate("/profile");
                    setNavOpen(false);
                  }}
                >
                  <img
                    src={userData.profilePhoto || default_img}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <span className="flex items-start">
                    {userData?.fullName?.firstName ||
                      userData?.name ||
                      "Unknown"}
                  </span>
                  <span>{userData?.email || "No email provided"}</span>
                  <hr className="w-full my-2 border-gray-300" />
                </div>
              ) : null}

              <NavLink
                to="/"
                className="py-2 text-lg hover:text-orange-500"
                onClick={() => setNavOpen(false)}
              >
                Home
              </NavLink>

              {userType === "candidate" && userData != null ? (
                <NavLink
                  to="/applications"
                  className="py-2 text-lg hover:text-orange-500"
                  onClick={() => {
                    navigate("/applications");
                    setNavOpen(false);
                  }}
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
                    onClick={() => {
                      setNavOpen(false);
                      setMoreOpen(false);
                    }}
                  >
                    Safety Tips
                  </NavLink>

                  {userData !== null ? (
                    <button
                      className="flex items-center justify-between w-full py-2 text-lg hover:text-orange-500"
                      onClick={() => setManageProfileOpen(!manageProfileOpen)}
                    >
                      Manage Profile
                      {manageProfileOpen ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown className="ml-10" />
                      )}
                    </button>
                  ) : (
                    ""
                  )}

                  {manageProfileOpen && (
                    <div className="w-48 pl-2">
                      <NavLink
                        to="/delete-account"
                        className="block py-2 text-lg hover:text-orange-500 w-full text-left"
                        onClick={() => {
                          setNavOpen(false);
                          setManageProfileOpen(false);
                          setMoreOpen(false);
                        }}
                      >
                        Delete My Account
                      </NavLink>
                      {userData?.modeofLogin === "email" && (
                        <button
                          className="block py-2 text-lg hover:text-orange-500"
                          onClick={handleChangePasswordClick}
                        >
                          Change Password
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              <hr className="w-full my-2 border-gray-300" />

              {userData !== null ? (
                <button
                  onClick={handleLogoutClick}
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

      {logoutConfirmOpen && (
        <LogoutConfirmation
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}

      {changePasswordConfirmOpen && (
        <ChangePasswordConfirmation
          onConfirm={handleChangePasswordConfirm}
          onCancel={handleChangePasswordCancel}
        />
      )}

      {loading && <Loading />}
    </header>
  );
}

export default Header;
