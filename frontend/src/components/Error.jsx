import React from 'react'

const Error = ({ message }) => (
  <div className="flex items-center justify-center h-screen">
    <p className="text-red-500">{message}</p>
  </div>
);

export default Error;
