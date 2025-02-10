import React from 'react'
import banner from "../assets/banner1.png";


const Banner = () => {
  return (
    <div
          className="flex flex-col items-center justify-center p-8 mt-6 bg-center bg-cover shadow-lg lg:h-72 min-h-52"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
        </div>
  )
}

export default Banner