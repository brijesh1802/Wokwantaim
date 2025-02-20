import React from "react";

const Loading = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-150"></div>
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-300"></div>
    </div>
    <p className="text-gray-600 mt-3">Processing...</p>
  </div>
);

export default Loading;
