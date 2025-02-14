// import React, { useState, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";

// import { AuthContext } from "../context/AuthContext";
// import { useContext } from "react";
// import Logo from "../assets/Logo.png";

// function Header() {
//   const { userType, logout } = useContext(AuthContext);
//   const [nav, setNav] = useState(false);
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [username, setUserName] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setNav(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     setUserName("");
//     setProfilePhoto(null);
//     setNav(false);
//   };

//   useEffect(() => {
//     const fetchUsername = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const url =
//           userType === "candidate"
//             ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/profile`
//             : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/profile`;

//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 401) {
//           console.error("Unauthorized: Invalid or expired token");
//           handleLogout(); // Log out the user if the token is invalid
//           return;
//         }

//         if (!response.ok) throw new Error("Failed to fetch data");

//         const data = await response.json();
//         setUserName(
//           userType === "candidate" ? `${data.fullName.firstName}` : data.name
//         );

//         setProfilePhoto(data.profilePhoto);
//       } catch (error) {
//         console.error("Error fetching username:", error);
//       }
//     };

//     if (userType) fetchUsername();
//   }, [userType]);

//   return (
//     <header className="flex bg-white shadow-sm z-10">
//       <div className="container flex items-center justify-between px-4 py-4 mx-auto">
//         <div className="flex items-center space-x-6">
//           <img src={Logo} alt="Logo" className="h-8" />
//         </div>

//         {/* Hamburger Icon for Mobile */}
//           {isMobile && (
//             <div className="flex text-gray-500 cursor-pointer md:hidden">
//               <button onClick={() => setNav(!nav)}>
//                 {nav ? <FaTimes size={25} /> : <FaBars size={25} />}
//               </button>
//             </div>
//           )}

//           {/* Desktop Links */}
//         {!isMobile && (
//           <div className="flex items-center justify-end w-full space-x-3 pr-5">
//             {/* Home Link */}
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `text-xl ml-4 font-medium ${
//                   isActive
//                     ? "text-orange-500 font-semibold"
//                     : "text-gray-600 hover:text-orange-500"
//                 }`
//               }
//             >
//               Home
//             </NavLink>

//             {/* Conditional Rendering for Candidate or Employer */}
//             {userType === "candidate" || userType === null ? (
//               <NavLink
//                 to="/joblist"
//                 className={({ isActive }) =>
//                   `text-xl ml-4 ${
//                     isActive
//                       ? "text-orange-500 font-semibold"
//                       : "text-gray-600 hover:text-orange-500"
//                   }`
//                 }
//               >
//                 Job List
//               </NavLink>
//             ) : (
//               <NavLink
//                 to="/addjobs"
//                 className={({ isActive }) =>
//                   `text-xl ml-4 mt-1 ${
//                     isActive
//                       ? "text-orange-500 font-semibold"
//                       : "text-gray-600 hover:text-orange-500"
//                   }`
//                 }
//               >
//                 Add Jobs
//               </NavLink>
//             )}

//             <div className="relative">
//               <button
//                 onClick={() => setNav(!nav)}
//                 className="flex items-center focus:outline-none xl:ml-3 md:-mr-8 lg:-mr-3"
//               >
//                 {profilePhoto && (
//                   <div className="flex items-center ">
//                     <img
//                       src={profilePhoto}
//                       alt="Profile"
//                       className="object-cover w-10 h-10 rounded-full"
//                     />
//                   </div>
//                 )}
//               </button>
//               {nav && (
//                 <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-lg">
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
//                     onClick={() => setNav(false)}
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setNav(false);
//                     }}
//                     className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
//                   >
//                     Log Out
//                   </button>
//                 </div>
//               )}
//             </div>

//             {userType ? (
//               ""
//             ) : (
//               <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
//                 <Link to="/signup" className="text-white">
//                   Sign Up
//                 </Link>
//                 <span className="mx-2 text-gray-400">/</span>
//                 <Link to="/login" className="text-white">
//                   Login
//                 </Link>
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Mobile Menu */}
//       {nav && isMobile && (
//         <ul className="absolute left-0 flex flex-col items-start pl-4 w-full py-3 space-y-2 bg-white shadow-md top-16">
//           <li>
//             <Link
//               to="/profile"
//               className="flex flex-col items-center"
//               onClick={() => setNav(false)}
//             >
//               {profilePhoto /*
//                 <div className="flex flex-col items-center">
//                   <img
//                     src={profilePhoto}
//                     alt="Profile"
//                     className="object-cover w-12 h-12 rounded-full hover:shadow-orange-400 hover:shadow-2xl"
//                   />
//                   <span className="mt-1 text-lg font-semibold text-black">
//                     {username}
//                   </span>
//                 </div>*/ && <p>Profile</p>}
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/"
//               onClick={() => setNav(false)}
//               className="text-lg font-medium text-orange-500 hover:font-semibold"
//             >
//               Home
//             </Link>
//           </li>
//           <li>
//             {userType === "candidate" || userType === null ? (
//               <Link
//                 to="/joblist"
//                 onClick={() => setNav(false)}
//                 className="text-gray-600 hover:text-orange-500 hover:font-semibold"
//               >
//                 Job List
//               </Link>
//             ) : (
//               <Link
//                 to="/addjobs"
//                 onClick={() => setNav(false)}
//                 className="text-gray-600 hover:text-orange-500 hover:font-semibold"
//               >
//                 Add Jobs
//               </Link>
//             )}
//           </li>
//           <li>
//             {userType ? (
//               <button className="px-5 py-2 mt-2 text-white bg-orange-500 rounded-md shadow-lg hover:bg-orange-600">
//                 <Link
//                   to="/"
//                   onClick={() => {
//                     handleLogout();
//                     setNav(false);
//                   }}
//                   className="text-white"
//                 >
//                   Log Out
//                 </Link>
//               </button>
//             ) : (
//               <button className="px-5 py-2 mt-2 text-white bg-orange-500 rounded-md shadow-lg hover:bg-orange-600">
//                 <Link
//                   to="/signup"
//                   onClick={() => setNav(false)}
//                   className="text-white"
//                 >
//                   Sign Up
//                 </Link>
//                 <span className="mx-2 text-gray-400">/</span>
//                 <Link
//                   to="/login"
//                   onClick={() => setNav(false)}
//                   className="text-white"
//                 >
//                   Login
//                 </Link>
//               </button>
//             )}
//           </li>
//         </ul>
//       )}
//     </header>
//   );
// }

// export default Header;

import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Logo.png";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

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
    <header className="bg-white shadow-md fixed w-full z-10">
      <div className="flex justify-between items-center px-6 py-4">
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

        <nav className="hidden lg:flex space-x-6 items-center">
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
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex justify-between items-center"
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
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
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
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-20">
          <div className="fixed left-0 top-0 w-72 h-full bg-white shadow-lg z-30">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute top-4 right-4 text-gray-700"
            >
              <FaTimes size={25} />
            </button>

            <div className="flex flex-col items-start py-6 px-4">
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
              <hr className="w-full border-gray-300 my-2" />

              {/* Section 2: Home & Job List */}
              <NavLink
                to="/"
                className="text-lg py-2 hover:text-orange-500"
                onClick={() => setNavOpen(false)}
              >
                Home
              </NavLink>

              {userType === "candidate" ? (
                <NavLink
                  to="/application"
                  className="text-lg py-2 hover:text-orange-500"
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
                  className="text-lg py-2 hover:text-orange-500"
                  onClick={() => setNavOpen(false)}
                >
                  Job List
                </NavLink>
              ) : (
                <NavLink
                  to="/addjobs"
                  className="text-lg py-2 hover:text-orange-500"
                  onClick={() => setNavOpen(false)}
                >
                  Add Jobs
                </NavLink>
              )}
              <hr className="w-full border-gray-300 my-2" />

              {/* Section 3: More (Dropdown) */}
              <button
                className="text-lg py-2 hover:text-orange-500 w-full flex justify-between items-center"
                onClick={() => setMoreOpen(!moreOpen)}
              >
                More {moreOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {moreOpen && (
                <div className="pl-4">
                  <NavLink
                    to="/safety"
                    className="text-lg py-2 hover:text-orange-500 block"
                    onClick={() => setNavOpen(false)}
                  >
                    Safety Tips
                  </NavLink>

                  {/* Manage Profile (Nested Dropdown) */}
                  <button
                    className="text-lg py-2 hover:text-orange-500 w-full flex justify-between items-center"
                    onClick={() => setManageProfileOpen(!manageProfileOpen)}
                  >
                    Manage Profile{" "}
                    {manageProfileOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {manageProfileOpen && (
                    <div className="pl-4">
                      <NavLink
                        to="/delete-account"
                        className="text-lg py-2 hover:text-orange-500 block"
                        onClick={() => setNavOpen(false)}
                      >
                        Delete My Account
                      </NavLink>
                      <NavLink
                        to="/change-password"
                        className="text-lg py-2 hover:text-orange-500 block"
                        onClick={() => setNavOpen(false)}
                      >
                        Change Password
                      </NavLink>
                    </div>
                  )}
                </div>
              )}
              <hr className="w-full border-gray-300 my-2" />

              {/* Section 4: Logout or Sign-up/Login */}
              {userType ? (
                <button
                  onClick={handleLogout}
                  className="text-lg py-2 hover:text-orange-500"
                >
                  Log Out
                </button>
              ) : (
                <>
                  <NavLink
                    to="/signup"
                    className="text-lg py-2 hover:text-orange-500"
                    onClick={() => setNavOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="text-lg py-2 hover:text-orange-500"
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
