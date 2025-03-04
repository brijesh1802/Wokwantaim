import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiEye, FiX, FiAlertTriangle } from 'react-icons/fi';

const SearchJobsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const initiateDelete = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (jobToDelete) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/delete/${jobToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to delete job');
        setJobs(jobs.filter(job => job._id !== jobToDelete));
        setShowDeleteModal(false);
        setJobToDelete(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const closeDetails = () => {
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lgmax-h-[80vh]  overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Search Jobs</h2>
      <div className="mb-8 relative">
        <input
          className="w-full py-4 px-6 pl-12 border-2 border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 text-lg transition-all duration-300"
          type="text"
          placeholder="Search for jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      </div>
      <div className="overflow-x-auto max-h-[50vh]">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.experienceLevel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${job.salary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => viewJobDetails(job)}>
                    <FiEye size={18} />
                  </button>
                  <button onClick={() => initiateDelete(job._id)} className="text-red-600 hover:text-red-900">
                  <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-l shadow-2xl max-w-3xl w-full max-h-[65vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-bold text-gray-800">{selectedJob.title}</h3>
                <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FiX size={28} />
                </button>
              </div>
              <p className="text-lg text-gray-600 mt-2">{selectedJob.company} • {selectedJob.location} 📍</p>
            </div>
            <div className="px-8 py-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-orange-700 mb-2">Job Type 📝</h4>
                  <p className="text-gray-700">{selectedJob.jobType}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Experience 💼</h4>
                  <p className="text-gray-700">{selectedJob.experienceLevel}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Salary 💸</h4>
                  <p className="text-gray-700">${selectedJob.salary}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-2xl font-semibold text-gray-800 mb-4">Job Description 📄</h4>
                <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>
              
              <div>
                <h4 className="text-2xl font-semibold text-gray-800 mb-4">Requirements 📝</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {selectedJob.requirements.map((requirement, index) => (
                    <li key={index} className="leading-relaxed">{requirement}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-2xl font-semibold text-gray-800 mb-4">Skills Required 🎯</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                <div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Additional Information 📊</h4>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Industry:</span> {selectedJob.industry}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Application Deadline:</span> {new Date(selectedJob.applicationDeadline).toLocaleDateString()} 📆
                    </p>
                    <p className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Posted Date:</span> {new Date(selectedJob.applicationPostedDate).toLocaleDateString()} 📆
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Statistics 📊</h4>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Application Count:</span> {selectedJob.applicationCount} 📈
                    </p>
                    <p className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">View Count:</span> {selectedJob.viewCount} 👀
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Custom Delete Confirmation Modal */}
        {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <FiAlertTriangle size={48} />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default SearchJobsSection;
