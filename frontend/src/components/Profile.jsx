import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Assuming you have an AuthContext

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userType } = useContext(AuthContext); 
  const token = localStorage.getItem("authToken"); 

  useEffect(() => {
    if (!token) {
      console.error("No authentication token found.");
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
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

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userType) fetchUserProfile();
  }, [userType, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-gray-200 rounded-lg animate-pulse w-80">
          <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full"></div>
          <div className="w-3/4 h-6 mx-auto mt-4 bg-gray-300"></div>
          <div className="w-1/2 h-4 mx-auto mt-2 bg-gray-300"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">User not found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 text-center bg-white rounded-lg shadow-lg w-80">
        <img
          src={user.profilePhoto}
          alt="Profile"
          className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full"
        />
        <h2 className="mt-4 text-xl font-semibold">
          {user.fullName?.firstName} {user.fullName?.lastName}
        </h2>
        <p className="text-gray-600">{user.email}</p>
        <p className="mt-2 text-sm text-gray-500">
          {user.experienceLevel} - {user.jobType}
        </p>
        <p className="text-sm text-gray-500">📞 {user.phoneNumber}</p>
        {user.resume && (
          <a
            href={user.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-500"
          >
            View Resume
          </a>
        )}
      </div>
    </div>
  );
};

export default Profile;
