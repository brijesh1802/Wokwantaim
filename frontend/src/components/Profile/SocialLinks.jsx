

import React from "react";
import { LinkedinIcon, GithubIcon } from "lucide-react";
const SocialLinks = ({ socialLinks }) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-3 mt-4">
        {socialLinks.linkedin && (
          <div className="flex items-center space-x-3">

            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"

              className="flex items-center hover:text-blue-800 transition-colors duration-200 "
            >
              <LinkedinIcon className="w-5 h-5 mr-2" />
              <span className="truncate mt-1">{socialLinks.linkedin}</span>
            </a>
          </div>
        )}
        {socialLinks.github && (
          <div className="flex items-center space-x-3">

            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-800 hover:text-black transition-colors duration-200"
            >
              <GithubIcon className="w-5 h-5 mr-2" />

              <span className="truncate mt-1">{socialLinks.github}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;

