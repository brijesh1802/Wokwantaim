
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/getAll`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/jobs/delete/${jobToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete job');
      setJobs(jobs.filter(job => job.job.id !== jobToDelete));
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const viewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const closeDetails = () => {
    setSelectedJob(null);
  };

  const filteredJobs = jobs.filter(job =>
    job.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl shadow-xl max-h-[85vh] overflow-y-hidden">
      <h2 className="text-4xl font-bold text-orange-600 mb-8">Search Jobs</h2>
      <div className="mb-8 relative">
        <input
          className="w-full py-4 px-6 pl-12 border-2 border-orange-200 rounded-full shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-gray-700 text-lg transition-all duration-300"
          type="text"
          placeholder="Search for jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 text-xl" />
      </div>
  
      <div className="overflow-x-auto max-h-[60vh] rounded-xl shadow-md">
        {filteredJobs.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-xl">No jobs found</div>
        ) : (
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-orange-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {filteredJobs.map((job) => (
                <tr key={job.job.id} className="hover:bg-orange-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={job.job.companyLogo} alt={job.job.company} className="h-10 w-10 rounded-full mr-3" />
                      <span className="text-sm font-medium text-gray-900">{job.job.company}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{job.job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{job.job.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${job.job.salary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-800 mr-3 transition-colors duration-200" onClick={() => viewJobDetails(job.job)}>
                      <FiEye size={20} />
                    </button>
                    <button onClick={() => initiateDelete(job.job.id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-center text-red-500 mb-6">
              <FiAlertTriangle size={56} />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 text-center mb-8">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
  
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeDetails}>
          <div className="bg-white rounded-2xl p-8 max-h-[60vh] w-[70vw] max-w-3xl overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeDetails} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <FiX size={28} />
            </button>
            <div className="text-center mb-6">
              <img src={selectedJob.companyLogo} alt={selectedJob.company} className="h-20 w-20 mx-auto rounded-full mb-4 shadow-md" />
              <h3 className="text-3xl font-bold text-orange-600">{selectedJob.title}</h3>
              <p className="text-xl text-gray-600">{selectedJob.company} - {selectedJob.location}</p>
            </div>
            <div className="space-y-6 text-gray-700">
              <p className="text-2xl font-semibold text-orange-500">Salary: ${selectedJob.salary.toLocaleString()}</p>
              <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
              <p><strong>Experience Level:</strong> {selectedJob.experienceLevel}</p>
              <p><strong>Industry:</strong> {selectedJob.industry}</p>
              <div>
                <strong>Description:</strong>
                <p className="mt-2">{selectedJob.description}</p>
              </div>
              <div>
                <strong>Requirements:</strong>
                <ul className="list-disc list-inside mt-2">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Skills:</strong>
                <ul className="list-disc list-inside mt-2">
                  {selectedJob.skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Application Deadline:</strong> {new Date(selectedJob.applicationDeadline).toDateString()}</p>
              <p><strong>Posted Date:</strong> {new Date(selectedJob.applicationPostedDate).toDateString()}</p>
            </div>
            <button onClick={closeDetails} className="mt-8 w-full px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 text-lg font-semibold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default SearchJobsSection;