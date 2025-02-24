import React, { useState, useEffect } from "react";

const EditableSection = ({ title, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/candidates/info/get`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (data && data.about) {
          setText(data.about);
        } else {
          setText("No about information available.");
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
        throw new Error(`Error: ${response.status} ${data.message || response.statusText}`);
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
  

  return (
    <div className="w-full p-6 mt-0 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold">{title}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-blue-500 border-2 border-blue-300 "
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
            className="w-full p-2 mt-2 border-rounded"
          />
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            onClick={handleSave}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Save
            </span>
          </button>
        </div>
      ) : (
        <p className="p-2 mt-2 text-gray-600 border-2 border-none">
          {text || "No data"}
        </p>
      )}
    </div>
  );
};

export default EditableSection;
