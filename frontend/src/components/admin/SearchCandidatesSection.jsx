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
        <div className="bg-gradient-to-br from-orange-50 to-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold text-orange-600 mb-10">Search Candidates</h2>
        <div className="mb-10 relative">
          <input
            type="text"
            placeholder="Search by name, skills...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-5 px-8 pl-14 border-2 border-orange-200 rounded-full shadow-lg focus:ring-4 focus:ring-orange-300 focus:border-orange-400 text-gray-700 text-xl transition-all duration-300"
          />
          <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-orange-400 text-2xl" />
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
                <div key={candidate._id} className="bg-white overflow-hidden p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer " onClick={() => openModal(candidate)}>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300" onClick={closeModal}>
          <div className="bg-white rounded-3xl shadow-2xl mt-20 max-w-3xl md:w-[60vh] md:ml-40 lg:w-full lg:ml-60  max-h-[90vh] overflow-hidden animate-modal-appear" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 z-10 px-8 py-6">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-bold text-white">
                  {`${selectedCandidate.fullName.firstName || ''} ${selectedCandidate.fullName.lastName || ''}`}
                </h3>
                <button onClick={closeModal} className="text-white hover:text-orange-200 transition-colors">
                  <FiX size={28} />
                </button>
              </div>
            </div>
            
            <div className="px-8 py-6 space-y-8 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-8">
                <div className="bg-orange-50  p-6 rounded-2xl shadow-inner">
                  <h4 className="text-2xl font-semibold text-orange-700 mb-4">Contact Information</h4>
                  <div className="space-y-4">
                    <p className="flex items-center text-gray-700">
                      <FiMail className="mr-3 text-orange-500" size={24} /> {selectedCandidate.email}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FiPhone className="mr-3 text-orange-500" size={24} /> {selectedCandidate.phoneNumber || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-2xl shadow-inner">
                  <h4 className="text-2xl font-semibold text-orange-700 mb-4">Professional Details</h4>
                  <div className="space-y-4">
                    <p className="flex items-center text-gray-700">
                      <FiBriefcase className="mr-3 text-orange-500" size={24} /> {selectedCandidate.experienceLevel || 'N/A'}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <FiClock className="mr-3 text-orange-500" size={24} /> {selectedCandidate.jobType || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-2xl shadow-inner">
                <h4 className="text-2xl font-semibold text-orange-700 mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="flex items-center text-gray-700">
                    <FiUser className="mr-3 text-orange-500" size={24} /> Gender: {selectedCandidate.gender || 'N/A'}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <FiCalendar className="mr-3 text-orange-500" size={24} /> Joined: {selectedCandidate.createdAt ? new Date(selectedCandidate.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="flex items-center text-gray-700">
                    <FiCheckCircle className="mr-3 text-orange-500" size={24} /> Verified: {selectedCandidate.isVerified ? 'Yes' : 'No'}
                  </p>
                  {selectedCandidate.resume && (
                    <p className="flex items-center text-gray-700">
                      <FiFileText className="mr-3 text-orange-500" size={24} /> 
                      <a href={selectedCandidate.resume} className="text-orange-600 hover:text-orange-800 font-semibold transition-colors" target="_blank" rel="noopener noreferrer">View Resume</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          
            <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => initiateDelete(selectedCandidate._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
                >
                  Delete Candidate
                </button>
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
