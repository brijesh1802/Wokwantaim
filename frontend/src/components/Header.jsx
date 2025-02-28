import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import default_img from "../assets/default_image.png";
import LogoutConfirmation from "./LogoutConfirmation";
import ChangePasswordConfirmation from "./ChangePasswordConfirmation";
import DeleteAccount from "./DeleteAccount";
import Loading from "./Loading";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const { userType, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [manageProfileOpen, setManageProfileOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [deleteAccountConfirmOpen, setDeleteAccountConfirmOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [changePasswordConfirmOpen, setChangePasswordConfirmOpen] =
    useState(false);
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
      handleLogout();

      setLoading(false);
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
        console.log("Fetched user data:", data);
        setUserData(data.candidate || data.employer);
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

  const NavLinkWithAnimation = ({ children, ...props }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <NavLink className="block py-2 text-lg hover:text-orange-500" {...props}>
        {children}
      </NavLink>
    </motion.div>
  );
  

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <motion.header
          className="fixed z-10 w-full bg-white shadow-md"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo and Hamburger */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setNavOpen(true)}
                className="text-gray-700 transition-transform transform lg:hidden hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaBars size={25} />
              </motion.button>
              <motion.div
                onClick={() => navigate("/")}
                className="text-xl font-bold text-gray-700 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                WOKWANTAIM
              </motion.div>
            </div>

            <nav className="items-center hidden space-x-6 lg:flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xl ml-4 ${
                    isActive
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-orange-500"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/aboutus"
                className={({ isActive }) =>
                  `text-xl ml-4 ${
                    isActive
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-orange-500"
                  }`
                }
               >
              About Us
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

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {userType && userData ? (
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center focus:outline-none"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <img
                      src={userData.profilePhoto || default_img}
                      alt="Profile"
                      className="object-cover w-10 h-10 rounded-full"
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <NavLink to="/signup" className="text-white">
                      Sign Up
                    </NavLink>
                    <span className="mx-2 text-gray-400">/</span>
                    <NavLink to="/login" className="text-white">
                      Login
                    </NavLink>
                  </motion.button>
                )}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 py-2 mt-2 bg-white rounded-md shadow-lg min-w-max"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {/* Profile Manage Section */}
                      <motion.button
                        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                        onClick={() => setManageProfileOpen(!manageProfileOpen)}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        transition={{ duration: 0.2 }}
                      >
                        Profile{" "}
                        {manageProfileOpen ? <FaChevronUp /> : <FaChevronDown />}
                      </motion.button>

                      <AnimatePresence>
                        {manageProfileOpen && (
                          <motion.div
                            className="pl-4 overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
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
                              <motion.button
                                onClick={() => {
                                  setDropdownOpen(false);
                                  handleChangePasswordClick();
                                }}
                                className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                whileHover={{ backgroundColor: "#f3f4f6" }}
                                transition={{ duration: 0.2 }}
                              >
                                Change Password
                              </motion.button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <NavLink
                        to="/safety"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Safety Tips
                      </NavLink>
                      <motion.button
                        onClick={handleLogoutClick}
                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        transition={{ duration: 0.2 }}
                      >
                        Log Out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          {/* Mobile Navigation - Side Drawer */}
          <AnimatePresence>
            {navOpen && (
              <motion.div
                className="fixed inset-0 z-20 bg-gray-700 bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div
                  ref={sideNavRef}
                  className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg w-72 transform ${
                    navOpen ? "translate-x-0" : "-translate-x-full"
                  } transition-transform duration-500 ease-in-out overflow-y-auto max-h-screen`}
                  initial={{ x: -300 }}
                  animate={{ x: navOpen ? 0 : -300 }}
                  exit={{ x: -300 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <motion.button
                    onClick={() => setNavOpen(false)}
                    className="absolute text-gray-700 top-4 right-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes size={25} />
                  </motion.button>

                  <motion.div
                    className="flex flex-col items-start px-4 py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {userType && userData ? (
                      <motion.div
                        className="flex flex-col ml-2 text-sm hover:cursor-pointer"
                        onClick={() => {
                          navigate("/profile");
                          setNavOpen(false);
                        }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
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
                      </motion.div>
                    ) : null}

                    <NavLink
                      to="/"
                      className="py-2 text-lg hover:text-orange-500"
                      onClick={() => setNavOpen(false)}
                    >
                      Home
                    </NavLink>

                    <NavLink
                      to="/about"
                      className="py-2 text-lg hover:text-orange-500"
                      onClick={() => setNavOpen(false)}
                    >
                      About Us
                    </NavLink>

                    {userType === "candidate" && userData != null ? (
                      <NavLink
                        to="/applications"
                        className="py-2 text-lg hover:text-orange-500"
                        onClick={() => setNavOpen(false)}
                      >
                        My Application
                      </NavLink>
                    ) : null}

                    <NavLink
                      to={
                        userType === "candidate" || userType === null
                          ? "/joblist"
                          : "/addjobs"
                      }
                      className="py-2 text-lg hover:text-orange-500"
                      onClick={() => setNavOpen(false)}
                    >
                      {userType === "candidate" || userType === null
                        ? "Job List"
                        : "Add Jobs"}
                    </NavLink>

                    <hr className="w-full my-2 border-gray-300" />

                    <motion.button
                      className="flex items-center justify-between w-full py-2 text-lg hover:text-orange-500"
                      onClick={() => setMoreOpen(!moreOpen)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      More {moreOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </motion.button>

                    <AnimatePresence>
                      {moreOpen && (
                        <motion.div
                          className="pl-4"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
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

                          {userData !== null && (
                            <motion.button
                              className="flex items-center justify-between w-full py-2 text-lg hover:text-orange-500"
                              onClick={() => setManageProfileOpen(!manageProfileOpen)}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              Manage Profile{" "}
                              {manageProfileOpen ? <FaChevronUp /> : <FaChevronDown />}
                            </motion.button>
                          )}

                          <AnimatePresence>
                            {manageProfileOpen && (
                              <motion.div
                                className="w-48 pl-2"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <NavLink
                                  to="/delete-account"
                                  className="block w-full py-2 text-lg text-left hover:text-orange-500"
                                  onClick={() => {
                                    setNavOpen(false);
                                    setManageProfileOpen(false);
                                    setMoreOpen(false);
                                  }}
                                >
                                  Delete My Account
                                </NavLink>
                                {userData?.modeofLogin === "email" && (
                                  <motion.button
                                    className="block py-2 text-lg hover:text-orange-500"
                                    onClick={handleChangePasswordClick}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    Change Password
                                  </motion.button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <hr className="w-full my-2 border-gray-300" />

                    {userType ? (
              <motion.button
                onClick={handleLogoutClick}
                className="py-2 text-lg hover:text-orange-400 bg-orange-500 text-white rounded-md p-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Log Out
              </motion.button>
            ) : (
              <>
                <motion.button
                  className="py-2 text-lg hover:text-orange-400 bg-orange-500 text-white rounded-md p-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink to="/login">Login</NavLink>
                </motion.button>
                <motion.button
                  className="mt-4 py-2 text-lg hover:text-orange-400 bg-orange-500 text-white rounded-md p-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <NavLink to="/signup">Signup</NavLink>
                </motion.button>
              </>
            )}

                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
        </motion.header>
      )}
    </>
  );
}

export default Header;
