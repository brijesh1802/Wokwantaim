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

          <div className="relative">
            <p className="text-4xl font-bold text-white">Job List</p>
            <div className="flex gap-2 mt-4 ">
              <Link to="/" className="flex gap-1 text-white">
                <House size={20} />
                Home
              </Link>
              <span className="text-xl text-white">/</span>
              <p className="font-semibold text-orange-500">Job List</p>
            </div>
          </div>

          {/*Input*/}
        </div>
        <div>
          <div className="relative flex flex-col items-center justify-center px-5 py-5 my-10 bg-gray-100 rounded-md mx-7 lg:-mt-20">
            <div className="flex flex-col flex-wrap w-full gap-3 px-10 py-2 mx-5 text-lg md:flex-row justify-evenly">
              <input className="p-3 md:w-2/4" placeholder="Job Title"></input>
              <select className="flex-1 p-3 cursor-pointer">
                <option value="" disabled>
                  Select Country
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <select className="flex-1 p-3">
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
              <button className="w-40 p-2 mt-2 text-white bg-orange-500 rounded lg:w-52 lg:h-12 hover:bg-orange-600">
                Find Jobs
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/*Entries */}
          <div className="flex flex-col gap-2 px-5 py-5 bg-gray-100 rounded-lg mx-7 lg:w-1/3">
            <div className="flex flex-col items-center">
              {/*Date Posted*/}
              <div onClick={() => handleSection("DatePosted")} className="flex items-center justify-between w-full h-16 px-10 mb-5 bg-white border-l-4 border-orange-400 shadow-md ">
                <div className="flex items-center w-full gap-2">
                  <Calendar  color="orange" size={30}></Calendar>
                  <p className="font-mono font-bold cursor-default">Date Posted</p>
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
                    className="flex gap-4 text-lg text-gray-400"
                  >
                    <input type="radio" name="DatePosted" value={option} />
                    <span>{option}</span>
                  </label>
                ))}
                <button
                  className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400 "
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

            <div className="flex flex-col items-center gap-2 mb-5 ">
              {/*Job Role*/}
              <div onClick={() => handleSection("JobRoles")} className="flex items-center justify-between w-full h-16 px-10 bg-white border-l-4 border-orange-400 shadow-md ">
                <div className="flex items-center w-full gap-2">
                  <Briefcase color="orange" size={30}></Briefcase>
                  <p className="font-mono font-bold cursor-default">Job Role</p>
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
                      className="flex gap-4 text-lg text-gray-400"
                    >
                      <input type="checkbox" name="jobrole" value={option} />
                      <span>{option}</span>
                    </label>
                  )
                )}
                <button
                  className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400 "
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

            <div className="flex flex-col items-center gap-2 ">
              {/*Salary*/}
              <div onClick={() => handleSection("Salary")} className="flex items-center justify-between w-full h-16 px-10 bg-white border-l-4 border-orange-400 shadow-md ">
                <div className="flex items-center w-full gap-2">
                  <HandCoins color="orange" size={30}></HandCoins>
                  <p className="font-mono font-bold cursor-default">Salary</p>
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
                      className="flex gap-4 text-lg text-gray-400"
                    >
                      <input type="radio" name="salary" value={option} />
                      <span>{option}</span>
                    </label>
                  )
                )}
                <button
                  className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400 "
                  onClick={() => handleShowMore("Salary")}
                >
                  {Salary.length > 4
                    ? showMore.Salary
                      ? "View less"
                      : "View more"
                    : ""}
                </button>
              </div>

              <div className="flex flex-col items-center w-full mt-5 ">
                {/*Industry*/}
                <div onClick={() => handleSection("Industry")} className="flex items-center justify-between w-full h-16 px-10 bg-white border-l-4 border-orange-400 shadow-md ">
                  <div className="flex items-center w-full gap-2">
                    <Building2 color="orange" size={30}></Building2>
                    <p className="font-mono font-bold cursor-default">Industry</p>
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
                      className="flex gap-4 text-lg text-gray-400"
                    >
                      <input type="checkbox" name="jobrole" value={option} />
                      <span>{option}</span>
                    </label>
                  ))}
                  <button
                    className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400 "
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

              <div className="flex flex-col items-center w-full gap-2 mt-5 mb-5">
                {/*Experience*/}
                <div  onClick={() => handleSection("Experience")} className="flex items-center justify-between w-full h-16 px-10 bg-white border-l-4 border-orange-400 shadow-md ">
                  <div className="flex items-center w-full gap-2">
                    <PersonStanding color="orange" size={30}></PersonStanding>
                    <p className="font-mono font-bold cursor-default">Experience</p>
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
                      className="flex gap-4 text-lg text-gray-400"
                    >
                      <input type="checkbox" name="jobrole" value={option} />
                      <span>{option}</span>
                    </label>
                  ))}
                  <button
                    className="pt-2 pl-5 text-blue-700 w-fit hover:text-orange-400 "
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
          <div className="flex flex-col lg:w-3/4 mt-9 lg:mt-0">
            {/*Search */}
            <div className="flex items-center justify-between px-5 rounded-md lg:bg-gray-100 lg:h-20 mx-7">
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
            <div className="flex justify-center py-5 my-10 rounded mx-7">
              <p className="text-7xl">Result</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
