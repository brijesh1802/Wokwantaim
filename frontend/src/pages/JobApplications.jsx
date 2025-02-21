import React from "react";

const applications = [
  {
    company: "NiYO Solutions",
    profile: "Software Development Intern",
    appliedOn: "23 Dec '24",
    applicants: 3758,
    status: "Not selected",
  },
  {
    company: "NiYO Solutions",
    profile: "Software Development Intern",
    appliedOn: "23 Dec '24",
    applicants: 3758,
    status: "Selected",
  },
  {
    company: "OSCODE SOLUTION",
    profile: "Front End Developer Intern",
    appliedOn: "23 Dec '24",
    applicants: 114,
    status: "Response unlikely",
  },
  {
    company: "Eduminatti",
    profile: "Web Development Intern",
    appliedOn: "23 Dec '24",
    applicants: 1860,
    status: "Not selected",
  },
  {
    company: "BharatX",
    profile: "Backend Development Intern",
    appliedOn: "23 Dec '24",
    applicants: 2519,
    status: "Not selected",
  },
  {
    company: "OYO Rooms",
    profile: "Talent Acquisition Intern",
    appliedOn: "22 Dec '24",
    applicants: 781,
    status: "Response unlikely",
  },
  {
    company: "OYO Rooms",
    profile: "Talent Acquisition Intern",
    appliedOn: "22 Dec '24",
    applicants: 781,
    status: "Response unlikely",
  },
  {
    company: "OYO Rooms",
    profile: "Talent Acquisition Intern",
    appliedOn: "22 Dec '24",
    applicants: 781,
    status: "Response unlikely",
  },
  {
    company: "OYO Rooms",
    profile: "Talent Acquisition Intern",
    appliedOn: "22 Dec '24",
    applicants: 781,
    status: "Response unlikely",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Not selected":
      return "bg-red-100 text-red-700 border border-red-400";
    case "Response unlikely":
      return "bg-yellow-100 text-yellow-700 border border-yellow-400";
    case "Selected":
      return "bg-green-100 text-green-700 border border-green-400";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-400";
  }
};

const JobApplications = () => {
  return (
    <div className="max-w-6xl mx-auto mt-20 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        My Applications
      </h2>

      {/* Table for Larger Screens */}
      <div className="hidden md:block">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200 text-gray-800 uppercase">
            <tr>
              <th className="p-4 text-left">Company</th>
              <th className="p-4 text-left">Profile</th>
              <th className="p-4 text-left">Applied On</th>
              <th className="p-4 text-left">Applicants</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {applications.map((app, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="p-4">{app.company}</td>
                <td className="p-4">{app.profile}</td>
                <td className="p-4">{app.appliedOn}</td>
                <td className="p-4">{app.applicants.toLocaleString()}</td>
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

      {/* Stacked Layout for Small Screens */}
      <div className="md:hidden space-y-4">
        {applications.map((app, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <h3 className="text-lg font-semibold text-gray-700">
              {app.company}
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Profile:</span> {app.profile}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Applied On:</span> {app.appliedOn}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Applicants:</span>{" "}
              {app.applicants.toLocaleString()}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                app.status
              )}`}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobApplications;
