import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Logo from "../assets/Logo.png";

function Header() {
  const { userType, logout } = useContext(AuthContext);
  const [nav, setNav] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [username, setUserName] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const handleClick=()=>{
    navigate('/')
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setUserName("");
    setProfilePhoto(null);
    setNav(false);
  };

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
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setUserName(
          userType === "candidate"
            ? `${data.fullName.firstName} ${data.fullName.lastName}`
            : data.name
        );

        setProfilePhoto(data.profilePhoto);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (userType) fetchUsername();
  }, [userType]);

  return (
    <header className="flex bg-white shadow-sm z-1">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <div className="flex items-center space-x-6">
          <img src={Logo} alt="Logo" className="h-8" onClick={handleClick}/>
        </div>

        {/* Hamburger Icon for Mobile */}
        {isMobile && (
          <div className="flex text-gray-500 cursor-pointer md:hidden">
            <Link to="/profile" className="flex items-center mr-3 -mt-1">
              {profilePhoto && (
                <div>
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="object-cover w-10 h-10 rounded-full"
                  />
                </div>
              )}
            </Link>
            <div onClick={() => setNav(!nav)}>
              {nav ? <FaTimes size={25} /> : <FaBars size={25} />}
            </div>
          </div>
        )}

      {/* Desktop Links */}
      {!isMobile && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-6">
              {/* Home Link */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xl ml-4 font-medium ${
                    isActive
                      ? "text-orange-500 font-semibold"
                      : "text-gray-600 hover:text-orange-500"
                  }`
                }
              >
                Home
              </NavLink>

              {/* Conditional Rendering for Candidate or Employer */}
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
            </div>

            <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2">
                {profilePhoto && (
                  <div>
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="object-cover w-10 h-10 rounded-full"
                    />
                  </div>
                )}
                <span className="text-black">{username}</span>
              </Link>
              {userType ? (
                <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                  <Link to="/" onClick={handleLogout} className="text-white">
                    Log Out
                  </Link>
                </button>
              ) : (
                <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                  <Link to="/signup" className="text-white">
                    Sign Up
                  </Link>
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/login" className="text-white">
                    Login
                  </Link>
                </button>
              )}
              <a href="#" className="text-gray-600 hover:text-orange-500">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-500">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {nav && isMobile && (
        <ul className="absolute left-0 flex flex-col items-center w-full py-4 space-y-4 bg-white shadow-md top-16">
          <li>
            <Link
              to="/"
              onClick={() => setNav(false)}
              className="text-xl font-medium text-orange-500 hover:font-semibold"
            >
              Home
            </Link>
          </li>
          <li>
            {userType === "candidate" || userType === null ? (
              <Link
                to="/joblist"
                onClick={() => setNav(false)}
                className="text-gray-600 hover:text-orange-500 hover:font-semibold hover:text-xl"
              >
                Job List
              </Link>
            ) : (
              <Link
                to="/addjobs"
                onClick={() => setNav(false)}
                className="text-gray-600 hover:text-orange-500 hover:font-semibold hover:text-xl"
              >
                Add Jobs
              </Link>
            )}
          </li>
          <li>
            {userType ? (
              <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                <Link
                  to="/"
                  onClick={() => {
                    handleLogout();
                    setNav(false);
                  }}
                  className="text-white"
                >
                  Log Out
                </Link>
              </button>
            ) : (
              <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">
                <Link
                  to="/signup"
                  onClick={() => setNav(false)}
                  className="text-white"
                >
                  Sign Up
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to="/login"
                  onClick={() => setNav(false)}
                  className="text-white"
                >
                  Login
                </Link>
              </button>
            )}
          </li>
          <div className="flex gap-3">
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500"
                onClick={() => setNav(false)}
              >
                <Facebook className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500"
                onClick={() => setNav(false)}
              >
                <Twitter className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-500"
                onClick={() => setNav(false)}
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </li>
          </div>
        </ul>
      )}
    </header>
  );
}

export default Header;