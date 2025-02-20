import React from "react";
import default_image from "../../assets/default_image.png";
const ProfileCard = ({ user }) => {
  return (
    <div className="p-6 text-center bg-white rounded-lg shadow-lg w-80 mr-8 ml-3 pt-14 xl:w-96 xl:h-96 mb-10 lg:sticky lg:top-20">
      <img
        src={user.profilePhoto|| default_image}
        alt="Profile"
        className="w-24 h-24 mx-auto border-4 border-blue-500 rounded-full"
      />
      <h2 className="mt-4 text-xl font-semibold">
        {user.fullName?.firstName || user.name||
        'Unknown'}
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
  );
};

export default ProfileCard;
