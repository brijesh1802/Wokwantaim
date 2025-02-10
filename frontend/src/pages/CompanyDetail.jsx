import React from 'react'
import banner from "../assets/banner1.png";
import { Link } from "react-router-dom";
import {
  House,
  Files
} from "lucide-react";

const skills=['javascript','React','Angular']
const CompanyDetail = () => {
  return (
    <div>
      <div
        className="relative flex flex-col items-center justify-center p-12 mt-6 bg-center bg-cover shadow-lg bg-banner lg:h-72 min-h-52"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        {/*orange hue*/}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        ></div>
        <div className="relative flex flex-col items-center">
          <p className="text-4xl font-bold text-white">Company Details</p>
          <div className="flex gap-2 mt-4 ">
            <Link
              to="/"
              className="flex gap-1 text-white hover:scale-[1.01] transition-all"
            >
              <House size={20} />
              Home
            </Link>
            <span className="text-xl text-white">/</span>
            <Link
              to="/joblist"
              className="flex gap-1 text-white hover:scale-[1.01] transition-all"
            >
              Job List
            </Link>
            <span className="text-xl text-white">/</span>
            <Link
              to="/jobdetail"
              className="flex gap-1 text-white hover:scale-[1.01] transition-all"
            >
              ..
            </Link>
            <span className="text-xl text-white">/</span>
            <p className="font-semibold text-orange-500">Company Details</p>
          </div>
        </div>
      </div>

    <div className='flex flex-col'>
    <div className='flex flex-col'>
      {/*Company Information */}
      <div className="px-2 pt-6 mx-4 mt-12 bg-gray-100 rounded-md lg:w-full ">
        <div className="flex gap-3 p-3 text-lg font-semibold border-b-2 border-l-4 border-l-orange-400">
          <Files color="orange" size={30} />
          <p className='lg:text-xs'>Company Information</p>
        </div>
        <div className="flex flex-col gap-6 p-6 text-gray-500">
          <div className="flex gap-3 px-4 pb-3 border-b-2 sm:flex-row">
            <p className="font-bold">Establishment date : </p>
            <p>2024-07-31</p>
          </div>
          <div className="flex gap-3 px-4 pb-3 border-b-2">
            <p className="font-bold">Website : </p>
            <a href='#' className='hover:text-orange-400'>https://example.com/</a>
          </div>
          <div className="flex gap-3 px-4 pb-3 border-b-2">
            <p className="font-bold">Type : </p>
            <p>test</p>
          </div>
          <div className="flex gap-3 px-4 pb-3 border-b-2">
            <p className="font-bold">Size : </p>
            <p>30</p>
          </div>
          <div className="flex gap-3 px-4">
            <p className="font-bold">HeadQuarters :</p>
            <p>New Delhi</p>
          </div>
        </div>
      </div>

      

      {/*Profile Description*/}
      <div className="flex flex-col justify-start mx-4 my-10 border-2 rounded-lg lg:w-full ">
        <div className="p-4 bg-gray-100">
          <p className="text-xl font-semibold">Profile Description</p>
        </div>
        <div className="bg-white">
          <p className="p-6 ">
          Profile Description
          </p>
        </div>
      </div>
      
    </div>
     </div>



    </div>
  )
}

export default CompanyDetail