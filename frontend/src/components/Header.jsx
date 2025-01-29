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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    username = "";
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
        if (userType == "candidate") {
          setUserName(`${data.fullName.firstName} ${data.fullName.lastName}`); // Set full name to state
          console.log(
            "Full Name:",
            `${data.fullName.firstName} ${data.fullName.lastName}`
          ); // Log full name in the console
        } else {
          setUserName(`${data.name}`); // Set full name to state
          console.log("Full Name:", `${data.name}`);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <header className="flex bg-white shadow-sm">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <div className="flex items-center space-x-6">
        <img src={Logo} alt="Logo" className="h-8" />
          <Link to="/" className="text-xl font-medium text-orange-500">
            Home
          </Link>
          {userType === "candidate" || userType === "undefined" ? (
            <Link to="/joblist" state={{userType:userType}} className="text-gray-600 hover:text-orange-500">
              Job List
            </Link>
          ) : (
            <Link to="/addjobs" className="text-gray-600 hover:text-orange-500">
              Add Jobs
            </Link>
          )}
        </div>
        <div className="flex items-center ">
          <div className="flex items-center">
            {userType === "candidate" || userType === "employer" ? (
              <Link onClick={handleOnCLick}
                className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
              >
                Log Out
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Sign Up
                </Link>
                <span className="mx-2 text-gray-400">/</span>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white transition-colors bg-orange-500 rounded-md hover:bg-orange-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>


      <div className="flex items-center space-x-4">
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
    </header>
  );
}

export default Header;
