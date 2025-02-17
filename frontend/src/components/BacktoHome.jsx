import React from 'react'
import { Link } from "react-router-dom";
const BacktoHome = () => {
  return (
    <>
    <div className="hidden lg:flex fixed bottom-6 right-6 p-4 bg-orange-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
          <Link to="/" className="flex items-center space-x-2">
            <svg width="0" height="0">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10l4 4m0 0l4-4m-4 4V3m7 7l4 4m0 0l4-4m-4 4V3"
              />
            </svg>

            <span>Go to Homepage</span>
          </Link>
        </div>
    

      <div className="mt-6 text-center lg:hidden">
        <Link to="/" className="text-orange-500 hover:underline">
          Go to Homepage
        </Link>
      </div>
      </>
  )
}

export default BacktoHome