import React, { useState, useEffect } from "react";

const EditableSection = ({ title, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/get`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.about) {
          setText(data.about);
        } else {
          setText(`Hey there I am ${user.fullName?.firstName}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
        setText("Failed to load profile information.");
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ about: text }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Error: ${response.status} ${data.message || response.statusText}`
        );
      }

      if (data) {
        setText(data.about);
      } else {
        setText("Hey");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setText("Failed to update profile information.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  return (
    <div className="w-full p-6 mt-0 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold">{title}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-gradient-to-r text-blue-500 border-2 border-blue-300  hover:from-blue-600 hover:to-blue-400 hover:text-white transition"
          >
            ✏️ Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 mt-2 border-2 border-orange-100 rounded-md focus:ring-2"
          />
          <div className="flex justify-end mt-3 gap-2">
            <button
              className="px-4 py-2 font-medium text-white bg-gradient-to-r from-orange-400 to-red-500 rounded-md shadow-sm hover:from-red-500 hover:to-orange-400 focus:ring-2 focus:ring-blue-300 transition"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 font-medium bg-gradient-to-r text-gray-800 from-gray-200 to-gray-300 rounded-md shadow-md hover:from-gray-300 hover:to-gray-200"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="p-2 mt-2 text-gray-700 border-2 border-none">
          {text || `Hey there I am ${user.fullName?.firstName}`}
        </p>
      )}
    </div>
  );
};

export default EditableSection;
