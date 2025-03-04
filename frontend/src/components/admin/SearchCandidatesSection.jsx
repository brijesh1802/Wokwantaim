import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiPhone, FiBriefcase, FiMapPin, FiX, FiDollarSign, FiCalendar, FiClock, FiUser, FiCheckCircle } from 'react-icons/fi';

const SearchCandidatesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
              const url = `${import.meta.env.VITE_BASE_URL}/api/v1/candidates/getAll`;
              const response = await fetch(url,{
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                method: 'GET'
              });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                if (data && data.candidates) {
                    setCandidates(data.candidates);
                    setFilteredCandidates(data.candidates);  // Initialize with all candidates
                } else {
                    throw new Error("Invalid data format received from the API");
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching candidates:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    useEffect(() => {
        const filtered = candidates.filter(candidate => {
            const fullName = candidate.fullName;
            const candidateName = fullName
                ? `${fullName.firstName || ''} ${fullName.lastName || ''}`.trim().toLowerCase()
                : ''.toLowerCase();
            const candidateSkills = candidate.skills || [];
            const candidateLocation = candidate.location || '';

            return (
                candidateName.includes(searchTerm.toLowerCase()) ||
                candidateSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
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

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;


    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Search Candidates</h2>
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search by name, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 px-6 pl-12 border-2 border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 text-lg transition-all duration-300"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
        {filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => {
              const fullName = candidate.fullName;
              const candidateName = fullName
                ? `${fullName.firstName || ''} ${fullName.lastName || ''}`.trim()
                : 'N/A';
    
              return (
                <div key={candidate._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 " onClick={() => openModal(candidate)}>
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
      {/* Modal for detailed candidate information */}
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
                      <FiPhone className="mr-3 text-orange-500" size={20} /> {selectedCandidate.phoneNumber}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Professional Details</h4>
                  <div className="space-y-3">
                    <p className="flex items-center text-gray-600">
                      <FiBriefcase className="mr-3 text-orange-500" size={20} /> {selectedCandidate.experienceLevel}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <FiClock className="mr-3 text-orange-500" size={20} /> {selectedCandidate.jobType}
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
                    <FiCalendar className="mr-3 text-orange-500" size={20} /> Joined: {new Date(selectedCandidate.createdAt || 'N/A').toLocaleDateString()}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <FiCheckCircle className="mr-3 text-orange-500" size={20} /> Verified: {selectedCandidate.isVerified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              {/* {selectedCandidate.profilePhoto && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Profile Photo</h4>
                  <img src={selectedCandidate.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                </div>
              )} */}
              
              {selectedCandidate.resume && (
                <div>
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">Resume</h4>
                  <a href={selectedCandidate.resume} target="_blank" 
                  rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        )}


        </div>
    );
};

export default SearchCandidatesSection;
