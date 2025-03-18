import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, Calendar } from "lucide-react";

const getStatusStyle = (status) => {
  switch (status) {
    case "Not selected":
      return "bg-red-100 text-red-700 border border-red-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-600";
    case "selected":
      return "bg-green-100 text-green-700 border border-green-600";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-600";
  }
};

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateSort, setDateSort] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const fetchUserApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/applications/myApplications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching user applications:", error);
      }
    };

    fetchUserApplications();
  }, []);

  const navigate = useNavigate();

  const handleNavClick = () => {
    navigate("/joblist");
  };

  const handleJobClick = (jobId) => {
    navigate("/jobdetail", { state: { jobId } });
  };

  let filteredApplications = [...applications];

  if (statusFilter) {
    filteredApplications = filteredApplications.filter(
      (app) => app.status === statusFilter
    );
  }

  if (dateSort) {
    filteredApplications.sort((a, b) => {
      const dateA = new Date(a.dateApplied);
      const dateB = new Date(b.dateApplied);
      return dateSort === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-2 mb-6">
        <ChevronLeft
          size={32}
          className="text-orange-500 cursor-pointer"
          onClick={handleNavClick}
        />
        <h2 className="text-2xl font-semibold text-orange-500">
          My Applications
        </h2>
      </div>

      {/* Filter UI */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {["", "Not selected", "pending", "selected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 font-medium text-sm rounded-full border transition-all ${
                statusFilter === status
                  ? "bg-orange-500 text-white border-orange-600"
                  : "bg-white text-orange-700 border-orange-400"
              }`}
            >
              {status === ""
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative">
          {/* Sort Button */}
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center text-small space-x-2 bg-gray-100 px-2 py-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-200 transition"
          >
            <Calendar size={16} />
            <span>Sort: {dateSort === "asc" ? "Oldest" : "Newest"}</span>
            <ChevronDown size={16} />
          </button>

          {/* Dropdown Menu */}
          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-md">
              {["asc", "desc"].map((order) => (
                <button
                  key={order}
                  onClick={() => {
                    setDateSort(order);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition 
                ${
                  dateSort === order
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
                >
                  {order === "asc" ? "Oldest First" : "Newest First"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="w-full h-28 flex items-center justify-center my-10 text-gray-600">
          No applications match the filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse mb-10">
            <thead className="bg-gray-200 text-gray-800 uppercase">
              <tr>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Profile</th>
                <th className="p-4 text-left">Applied On</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredApplications.map((app, index) => (
                <tr
                  key={index}
                  onClick={() => handleJobClick(app.jobId)}
                  className="hover:bg-gray-100 transition duration-200 cursor-pointer"
                >
                  <td className="p-4">{app.companyName}</td>
                  <td className="p-4">{app.jobName}</td>
                  <td className="p-4">
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
