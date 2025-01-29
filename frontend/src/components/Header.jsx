import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Logo from "../assets/Logo.png";

function Header() {
    const { userType, logout } = useContext(AuthContext);
    const [nav, setNav] = useState(false);
    const [username, setUserName] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Initialize with the screen size
  
    // Effect to handle window resize and set the screen size state
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setNav(false); // Close mobile menu on switching to desktop
        }
      };
  
      // Listen to window resize
      window.addEventListener("resize", handleResize);
  
      return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
    }, []);
  
    const handleLogout = () => {
      logout();
      setUserName(""); // Clear the username state
      setNav(false); // Close the menu after logging out
    };
  
    useEffect(() => {
      const fetchUsername = async () => {
        try {
          const token = localStorage.getItem("authToken"); // Adjust this based on your storage method
  
          if (!token) {
            console.log("No token found, please log in.");
            return;
          }
  
          // Dynamically choose the API URL based on userType
          const url =
            userType === "candidate"
              ? `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/profile`
              : `${import.meta.env.VITE_BASE_URL}/api/v1/employers/profile`;
  
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token here
            },
          });
  
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
  
          const data = await response.json();
          if (userType === "candidate") {
            setUserName(`${data.fullName.firstName} ${data.fullName.lastName}`); // Set full name to state
          } else {
            setUserName(`${data.name}`); // Set full name to state
          }
          console.log("Username fetched successfully:", username);
        } catch (error) {
          console.error("Error fetching username:", error);
        }
      };
  
      if (userType) {
        fetchUsername(); // Fetch username only if there's a userType
      }
    }, [userType]);
  

  return (
    <header className="fixed z-50 w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div>
          <img src={Logo} alt="Logo" className="h-8" />
        </div>

        {/* Hamburger Icon for Mobile */}
        {isMobile && (
          <div
            className="text-gray-500 cursor-pointer md:hidden"
            onClick={() => setNav(!nav)}
          >
            {nav ? <FaTimes size={25} /> : <FaBars size={25} />}
          </div>
        )}

        {/* Desktop Links */}
        {!isMobile && (
          <div className="flex items-center justify-between w-full">
            {/* Left Section */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-xl font-medium text-orange-500">
                Home
              </Link>
              {userType === "candidate" || userType === null ? (
                <Link
                  to="/joblist"
                  state={{ userType: userType }}
                  className="text-gray-600 hover:text-orange-500"
                >
                  Job List
                </Link>
              ) : (
                <Link
                  to="/addjobs"
                  className="text-gray-600 hover:text-orange-500"
                >
                  Add Jobs
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-black">{username}</span>
              {userType === "candidate" || userType === "employer" ? (
                <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="text-white hover:text-orange-500"
                  >
                    Log Out
                  </Link>
                </button>
              ) : (
                <>
                  <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
                    <Link
                      to="/signup"
                      className="text-white hover:bg-orange-600"
                    >
                      Sign Up
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      to="/login"
                      className="text-white hover:bg-orange-600"
                    >
                      Login
                    </Link>
                  </button>
                </>
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
              className="text-xl font-medium text-orange-500"
            >
              Home
            </Link>
          </li>
          <li>
            {userType === "candidate" || userType === null ? (
              <Link
                to="/joblist"
                state={{ userType: userType }}
                onClick={() => setNav(false)}
                className="text-gray-600 hover:text-orange-500"
              >
                Job List
              </Link>
            ) : (
              <Link
                to="/addjobs"
                onClick={() => setNav(false)}
                className="text-gray-600 hover:text-orange-500"
              >
                Add Jobs
              </Link>
            )}
          </li>
          <li>
            {userType === "candidate" || userType === "employer" ? (
              <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
                <Link
                  to="/"
                  onClick={() => {
                    handleLogout();
                    setNav(false);
                  }}
                  className="text-white hover:bg-orange-600"
                >
                  Log Out
                </Link>
              </button>
            ) : (
              <>
                <button className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600">
                  <Link
                    to="/signup"
                    onClick={() => setNav(false)}
                    className="text-gray-600 hover:bg-orange-600"
                  >
                    Sign Up
                  </Link>
                  <span className="mx-2 text-gray-400">/</span>
                  <Link
                    to="/login"
                    onClick={() => setNav(false)}
                    className="text-gray-600 hover:bg-orange-600"
                  >
                    Login
                  </Link>
                </button>
              </>
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
  )
}

export default Header;