import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiPhone, FiBriefcase, FiX, FiClock, FiUser, FiCalendar, FiCheckCircle, FiFileText, FiAlertTriangle } from 'react-icons/fi';

const SearchCandidatesSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candToDelete, setCandToDelete] = useState(null);

    const initiateDelete = (candId) => {
      setCandToDelete(candId);
      setShowDeleteModal(true);
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                setError(null);

                const url = `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/getAll`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data && data.candidates) {
                    setCandidates(data.candidates);
                    setFilteredCandidates(data.candidates);
                } else {
                    throw new Error("Invalid data format received from the API");
                }
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    useEffect(() => {
        const filtered = candidates.filter(candidate => {
            if (!candidate || !candidate.fullName) {
                return false;
            }

            const fullName = candidate.fullName;
            const candidateName = fullName
                ? `${fullName.firstName || ''} ${fullName.lastName || ''}`.trim().toLowerCase()
                : '';

            const candidateSkills = candidate.skills || [];
            const candidateLocation = candidate.location || '';

            return (
                candidateName.includes(searchTerm.toLowerCase()) ||
                (candidateSkills && candidateSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                candidateLocation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setFilteredCandidates(filtered);
    }, [searchTerm, candidates]);

    const openModal = (candidate) => {
      setSelectedCandidate(candidate);
  };

  const closeModal = () => {
      setSelectedCandidate(null);
  };

  

  const handleDelete = async () => {
    if (candToDelete) {
      try {
        setError(null);

        const url = `${import.meta.env.VITE_BASE_URL}/api/v1/admin/deleteCandidate/${candToDelete}`;
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        if (!response.ok) throw new Error('Failed to delete candidate');
        setCandidates(prev => prev.filter(candidate => candidate._id !== candToDelete));
        setFilteredCandidates(prev => prev.filter(candidate => candidate._id !== candToDelete));
        setShowDeleteModal(false);
        setCandToDelete(null);
        closeModal();
      } catch (err) {
        console.error('Error deleting candidate:', err);
        setError(err.message);
      }
    }
  };

  return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Search Candidates</h2>
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search by name, skills...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 px-6 pl-12 border-2 border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 text-lg transition-all duration-300"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
        {loading && <div className="text-center text-gray-500">Loading...</div>}
        {error && <div className="text-center text-red-500">Error: {error}</div>}
        {filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => {
              const fullName = candidate.fullName;
              const candidateName = fullName
                ? `${fullName.firstName || ''} ${fullName.lastName || ''}`.trim()
                : 'N/A';
    
              return (
                <div key={candidate._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer" onClick={() => openModal(candidate)}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-xl mr-4">
                      {candidateName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{candidateName}</h3>
                      <p className="text-sm text-gray-500">{candidate.experienceLevel || 'Experience N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiMail className="mr-2 text-orange-500" /> {candidate.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <FiPhone className="mr-2 text-orange-500" /> {candidate.phoneNumber || 'N/A'}
                    </p>
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              +{candidate.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl">No candidates found.</p>
        )}

        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {`${selectedCandidate.fullName.firstName || ''} ${selectedCandidate.fullName.lastName || ''}`}
                  </h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <FiX size={28} />
                  </button>
                </div>
              </div>
              
              <div className="px-8 py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-600">
                        <FiMail className="mr-3 text-orange-500" size={20} /> {selectedCandidate.email}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <FiPhone className="mr-3 text-orange-500" size={20} /> {selectedCandidate.phoneNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-3">Professional Details</h4>
                    <div className="space-y-3">
                      <p className="flex items-center text-gray-600">
                        <FiBriefcase className="mr-3 text-orange-500" size={20} /> {selectedCandidate.experienceLevel || 'N/A'}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <FiClock className="mr-3 text-orange-500" size={20} /> {selectedCandidate.jobType || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Additional Information</h4>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-600">
                      <FiUser className="mr-3 text-orange-500" size={20} /> Gender: {selectedCandidate.gender || 'N/A'}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FiCalendar className="mr-3 text-orange-500" size={20} /> Joined: {selectedCandidate.createdAt ? new Date(selectedCandidate.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FiCheckCircle className="mr-3 text-orange-500" size={20} /> Verified: {selectedCandidate.isVerified ? 'Yes' : 'No'}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FiFileText className="mr-3 text-orange-500 " size={20} /> <a href={selectedCandidate.resume} className='text-blue-500 cursor-pointer'  target='_blank'>View Resume</a>
                    </p>
                  </div>
                </div>
                

              </div>
            
                <div className="flex justify-end p-6 bg-gray-50 rounded-b-3xl">
                  <button
                    onClick={() => initiateDelete(selectedCandidate._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 focus:outline-none focus:shadow-outline"
                  >
                    Delete Candidate
                  </button>
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
              Are you sure you want to delete this candidate? This action cannot be undone.
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

export default SearchCandidatesSection;
