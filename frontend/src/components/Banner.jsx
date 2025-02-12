import React, { useEffect, useState } from "react";
import banner from "../assets/banner1.png";
import { Link,useLocation} from "react-router-dom";

const Banner = () => {
  const location = useLocation();
  const [heading, setHeading] = useState("");

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === "/joblist") {
      setHeading("JobList");
    } else if (location.pathname === "/jobdetail") setHeading("JobDetails");
    else setHeading("Company Detail");
  });

  const navLinks = () => {
    if (location.pathname === "/joblist") {
      return(
        <>
        <h1 className="text-white font-bold text-3xl lg:text-4xl">{heading}</h1>
        <p className="text-white lg:text-xl"><Link to='/' className=" hover:text-orange-700 ">Home</Link><span>/</span>JobList</p>
        </>
      )
    }
    else if (location.pathname === "/jobdetail") {
      return(
        <>
        <h1 className="text-white font-bold text-3xl lg:text-4xl">{heading}</h1>
        <p className="text-white  lg:text-xl"><Link to='/' className="hover:text-orange-700">Home</Link><span>/</span><Link to='/joblist' className="hover:text-orange-800">JobList</Link><span>/</span>JobDetails</p>
        </>
      )
    }
    else {
      return(
        <>
        <h1 className="text-white font-bold text-3xl lg:text-4xl ">{heading}</h1>
        <p className="text-white lg:text-xl"><Link to='/' className="hover:text-orange-700">Home</Link><span>/</span><Link to='/joblist' className="hover:text-orange-800">JobList</Link><span>/</span><Link to='jobdetails' className="hover:text-orange-800">JobDetails<span>/</span>CompanyDetails</Link></p>
        </>
      )
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-8 mt-6 bg-center bg-cover shadow-lg lg:h-72 min-h-52"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {navLinks()}
    </div>
  );
};

export default Banner;
