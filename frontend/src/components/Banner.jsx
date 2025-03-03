import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Banner = () => {
  const location = useLocation();
  const [pageInfo, setPageInfo] = useState({ heading: "", description: "", icon: null });


  return (
    <div className="relative flex flex-col items-center justify-center mt-6 lg:h-72 min-h-52 overflow-hidden">
      {/* Stylish background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-orange-300/20 to-orange-100/20 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Banner;
