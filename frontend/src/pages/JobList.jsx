import React, { useState } from "react";
import banner from "../assets/banner1.png";
import { Link } from "react-router-dom";
import { countries } from "../components/Countries";
import {
  House,
  Calendar,
  ChevronDown,
  ChevronUp,
  Briefcase,
  HandCoins,
  Folder,
  Building,
  Building2,
  PersonStanding,
} from "lucide-react";

const JobList = () => {
  const jobTypes = ["Part time", "Permanent", "Contract"];
  const [visibleSection, setVisibleSection] = useState({});
  const [showMore, setShowMore] = useState({});

  const handleSection = (section) => {
    setVisibleSection((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleShowMore = (section) => {
    setShowMore((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const DatePosted = [
    "Today",
    "Last 7 Days",
    "Last 14 Days",
    "Last 21 Days",
    "Last 30 Days",
  ];
  const JobRoles = [
    "Software",
    "Office Manager",
    "Senior Accountant",
    "Tradesman Fitter",
    "License Electrician",
  ];
  const Industry = [
    "HR",
    "Payroll Management",
    "Financial Reporting",
    "Accounts",
  ];
  const Experience = ["5+ Years", "4-5 Years", "2-3 Years", "0-1 Years"];
  const Salary = ["10000-20000", "20000-30000", "30000-60000", "Above 60000"];
  return (
    <div>
      {/*Job search*/}
      <div className="gap-4">
        <div
          className="mt-6 bg-banner lg:h-72 bg-cover bg-center min-h-52 p-12 flex flex-col items-center justify-center shadow-lg relative"
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

          <div className="relative z-10">
            <p className="font-bold text-4xl text-white">Job List</p>
            <div className=" mt-4 flex gap-2">
              <Link to="/" className="flex gap-1 text-white">
                <House size={20} />
                Home
              </Link>
              <span className="text-xl text-white">/</span>
              <p className="text-orange-500 font-semibold">Job List</p>
            </div>
          </div>

          {/*Input*/}
        </div>
        <div>
          <div className="bg-gray-100 my-10 mx-7 rounded-md lg:-mt-20 flex flex-col px-5 py-5 justify-center items-center relative z-10">
            <div className="px-10 text-lg py-2 w-full flex flex-wrap mx-5 md:flex-row flex-col justify-evenly gap-3">
              <input className=" p-3 md:w-2/4" placeholder="Job Title"></input>
              <select className="p-3 cursor-pointer flex-1">
                <option value="" disabled>
                  Select Country
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <select className="p-3 flex-1">
                <option value="" disabled>
                  Select Job Type
                </option>
                {jobTypes.map((jobtype, index) => (
                  <option key={index} value={jobtype}>
                    {jobtype}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button className=" bg-orange-500 p-2 w-40 lg:w-52 lg:h-12 mt-2 text-white rounded hover:bg-orange-600">
                Find Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col">
          {/*Entries */}
          <div className=" bg-gray-100 flex flex-col rounded-lg py-5 gap-2 px-5 mx-7 lg:w-1/3">
            <div className="flex flex-col items-center">
              {/*Date Posted*/}
              <div onClick={() => handleSection("DatePosted")} className=" border-l-4 border-orange-400 bg-white shadow-md mb-5 h-16 w-full px-10 items-center flex justify-between">
                <div className="flex gap-2 items-center w-full">
                  <Calendar s color="orange" size={30}></Calendar>
                  <p className="font-bold font-mono cursor-default">Date Posted</p>
                </div>
                <div>
                  {visibleSection.DatePosted ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              <div
                className={`w-full flex flex-col justify-center items-left gap-2 px-14 ${
                  visibleSection.DatePosted ? "block" : "hidden"
                }`}
              >
                {DatePosted.slice(
                  0,
                  showMore.DatePosted ? DatePosted.length : 4
                ).map((option, index) => (
                  <label
                    key={index}
                    className="flex gap-4 text-gray-400 text-lg"
                  >
                    <input type="radio" name="DatePosted" value={option} />
                    <span>{option}</span>
                  </label>
                ))}
                <button
                  className="pl-5 pt-2 w-fit text-blue-700 hover:text-orange-400 "
                  onClick={() => handleShowMore("DatePosted")}
                >
                  {DatePosted.length > 4
                    ? showMore.DatePosted
                      ? "View less"
                      : "View more"
                    : ""}
                </button>
              </div>
            </div>

            <div className=" flex flex-col gap-2 items-center mb-5">
              {/*Job Role*/}
              <div onClick={() => handleSection("JobRoles")} className=" border-l-4 border-orange-400 bg-white shadow-md h-16 w-full px-10 items-center flex justify-between">
                <div className="flex gap-2 items-center w-full">
                  <Briefcase color="orange" size={30}></Briefcase>
                  <p className="font-bold font-mono cursor-default">Job Role</p>
                </div>
                <div>
                  {visibleSection.JobRoles ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              <div
                className={`w-full flex flex-col justify-center items-left px-14 gap-2 ${
                  visibleSection.JobRoles ? "block" : "hidden"
                }`}
              >
                {JobRoles.slice(0, showMore.JobRoles ? JobRoles.length : 4).map(
                  (option, index) => (
                    <label
                      key={index}
                      className="flex gap-4 text-gray-400 text-lg"
                    >
                      <input type="checkbox" name="jobrole" value={option} />
                      <span>{option}</span>
                    </label>
                  )
                )}
                <button
                  className="pl-5 pt-2 w-fit text-blue-700 hover:text-orange-400 "
                  onClick={() => handleShowMore("JobRoles")}
                >
                  {JobRoles.length > 4
                    ? showMore.JobRoles
                      ? "View less"
                      : "View more"
                    : ""}
                </button>
              </div>
            </div>

            <div className=" flex flex-col gap-2 items-center">
              {/*Salary*/}
              <div onClick={() => handleSection("Salary")} className=" border-l-4 border-orange-400 bg-white shadow-md h-16 px-10 w-full items-center flex justify-between">
                <div className="flex gap-2 items-center w-full">
                  <HandCoins color="orange" size={30}></HandCoins>
                  <p className="font-bold font-mono cursor-default">Salary</p>
                </div>
                <div>
                  {visibleSection.Salary ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              <div
                className={`flex flex-col justify-center items-left w-full px-14 gap-2 ${
                  visibleSection.Salary ? "block" : "hidden"
                }`}
              >
                {Salary.slice(0, showMore.Salary ? Salary.length : 4).map(
                  (option, index) => (
                    <label
                      key={index}
                      className="flex gap-4 text-gray-400 text-lg"
                    >
                      <input type="radio" name="salary" value={option} />
                      <span>{option}</span>
                    </label>
                  )
                )}
                <button
                  className="pl-5 pt-2 w-fit text-blue-700 hover:text-orange-400 "
                  onClick={() => handleShowMore("Salary")}
                >
                  {Salary.length > 4
                    ? showMore.Salary
                      ? "View less"
                      : "View more"
                    : ""}
                </button>
              </div>

              <div className=" flex flex-col items-center w-full mt-5">
                {/*Industry*/}
                <div onClick={() => handleSection("Industry")} className=" border-l-4 border-orange-400 bg-white shadow-md h-16 w-full px-10 items-center flex justify-between">
                  <div className="flex gap-2 items-center w-full">
                    <Building2 color="orange" size={30}></Building2>
                    <p className="font-bold font-mono cursor-default">Industry</p>
                  </div>
                  <div>
                    {visibleSection.Industry ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                <div
                  className={`mt-2 w-full flex flex-col justify-center items-left px-14 gap-2 ${
                    visibleSection.Industry ? "block" : "hidden"
                  }`}
                >
                  {Industry.slice(
                    0,
                    showMore.Industry ? Industry.length : 4
                  ).map((option, index) => (
                    <label
                      key={index}
                      className="flex gap-4 text-gray-400 text-lg"
                    >
                      <input type="checkbox" name="jobrole" value={option} />
                      <span>{option}</span>
                    </label>
                  ))}
                  <button
                    className="pl-5 pt-2 w-fit text-blue-700 hover:text-orange-400 "
                    onClick={() => handleShowMore("Industry")}
                  >
                    {Industry.length > 4
                      ? Industry.JobRoles
                        ? "View less"
                        : "View more"
                      : ""}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center mb-5 w-full mt-5">
                {/*Experience*/}
                <div  onClick={() => handleSection("Experience")} className=" border-l-4 border-orange-400 bg-white shadow-md h-16 w-full px-10 items-center flex justify-between">
                  <div className="flex gap-2 items-center w-full">
                    <PersonStanding color="orange" size={30}></PersonStanding>
                    <p className="font-bold font-mono cursor-default">Experience</p>
                  </div>
                  <div>
                    {visibleSection.Experience ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                </div>

                <div
                  className={`w-full flex flex-col justify-center items-left px-14 gap-2 ${
                    visibleSection.Experience ? "block" : "hidden"
                  }`}
                >
                  {Experience.slice(
                    0,
                    showMore.Experience ? Experience.length : 4
                  ).map((option, index) => (
                    <label
                      key={index}
                      className="flex gap-4 text-gray-400 text-lg"
                    >
                      <input type="checkbox" name="jobrole" value={option} />
                      <span>{option}</span>
                    </label>
                  ))}
                  <button
                    className="pl-5 pt-2 w-fit text-blue-700 hover:text-orange-400 "
                    onClick={() => handleShowMore("JobRoles")}
                  >
                    {Experience.length > 4
                      ? showMore.Experience
                        ? "View less"
                        : "View more"
                      : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/*Search and result */}
          <div className=" flex flex-col lg:w-3/4 mt-9 lg:mt-0">
            {/*Search */}
            <div className="lg:bg-gray-100 lg:h-20 px-5 flex items-center justify-between mx-7 rounded-md">
              <p>Showing 1-7 of 3 Job Results:</p>
              <div>
                <span>Sort By : </span>
                <select className="text-gray-400 bg-transparent">
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="ascending">A-Z</option>
                  <option value="decending">Z-A</option>
                </select>
              </div>
            </div>

            {/*Result */}
            <div className="flex justify-center my-10 mx-7 py-5 rounded">
              <p className="text-7xl">Result</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
