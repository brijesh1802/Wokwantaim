import React, { useState, useEffect } from "react";

const EditableSection = ({ title, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  // Load saved text from localStorage when the component mounts
  useEffect(() => {
    const savedText = localStorage.getItem("aboutMe");
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Save text to localStorage and exit editing mode
  const handleSave = () => {
    localStorage.setItem("aboutMe", text);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full mt-0">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold">{title}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 border-2 border-blue-300 p-1 "
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
            className="w-full mt-2 p-2 border rounded"
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
        <p className="mt-2 text-gray-600 border-2 rounded-md p-2 border-blue-300">
          {text || `Hey there! I am ${user.fullName?.firstName} `}
        </p>
      )}
    </div>
  );
};

export default EditableSection;
