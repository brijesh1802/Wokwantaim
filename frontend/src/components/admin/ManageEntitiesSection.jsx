import React, { useState, useEffect, useCallback } from 'react';
import { FiBriefcase, FiTool, FiFile, FiPlus, FiSearch, FiTrash2, FiUser, FiAlertTriangle, FiX, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ManageEntitiesSection = () => {
    const [activeEntity, setActiveEntity] = useState('company');
    const [searchTerm, setSearchTerm] = useState('');
    const [newEntityName, setNewEntityName] = useState('');
    const [newEntityLogo, setNewEntityLogo] = useState('');
    const [companies, setCompanies] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [experienceLevels, setExperienceLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [entityToDeleteId, setEntityToDeleteId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);

    useEffect(() => {
        fetchEntities();
    }, [activeEntity]);

    const fetchEntities = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const entityMap = {
                company: { apiEndpoint: '/api/v1/admin/getCompanies', setter: setCompanies },
                industry: { apiEndpoint: '/api/v1/admin/getIndustries', setter: setIndustries },
                jobType: { apiEndpoint: '/api/v1/admin/getJobTypes', setter: setJobTypes },
                experienceLevel: { apiEndpoint: '/api/v1/admin/getExperienceLevels', setter: setExperienceLevels }
            };
            const { apiEndpoint, setter } = entityMap[activeEntity];
            const url = `${import.meta.env.VITE_BASE_URL}${apiEndpoint}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                method: 'GET'
            });
            if (!response.ok) throw new Error(`Failed to fetch ${activeEntity}: ${response.status} ${response.statusText}`);
            const data = await response.json();
            setter(data);
            if (data.length === 0) setError(`No ${entityNameMap[activeEntity]} found.`);
        } catch (err) {
            console.error(`Error fetching ${activeEntity}:`, err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [activeEntity]);

    const handleAddEntity = async () => {
        setLoadingAction(true);
        try {
            setError(null);
            const entityMap = {
                company: { apiEndpoint: '/api/v1/admin/addCompany', setter: setCompanies },
                industry: { apiEndpoint: '/api/v1/admin/addIndustry', setter: setIndustries },
                jobType: { apiEndpoint: '/api/v1/admin/addJobType', setter: setJobTypes },
                experienceLevel: { apiEndpoint: '/api/v1/admin/addExperienceLevel', setter: setExperienceLevels }
            };
            const { apiEndpoint } = entityMap[activeEntity];
            const url = `${import.meta.env.VITE_BASE_URL}${apiEndpoint}`;
    
            let formData;
    
            if (activeEntity === 'company' && newEntityLogo) {
                // File size validation (e.g., max 5MB)
                const maxFileSize = 5 * 1024 * 1024; // 5MB
                if (newEntityLogo.size > maxFileSize) {
                    setError("File size is too large. Please upload a file smaller than 5MB.");
                    return;
                }
    
                formData = new FormData();
                formData.append('name', newEntityName);
                formData.append('logo', newEntityLogo); // For file upload
            } else {
                formData = JSON.stringify({ name: newEntityName });
            }
    
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    // Do not set Content-Type when using FormData
                },
                body: formData, // The body is either FormData (for company with logo) or JSON
            });
    
            if (!response.ok) throw new Error(`Failed to add ${activeEntity}: ${response.status} ${response.statusText}`);
    
            setNewEntityName('');
            setNewEntityLogo(null);
            setShowAddModal(false);
            fetchEntities(); // Fetch the updated list of entities
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingAction(false);
        }
    };
    


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewEntityLogo(file);
        }
    };
    

    const openDeleteConfirmation = (entityId) => {
        setEntityToDeleteId(entityId);
        setShowDeleteModal(true);
    };

    const closeDeleteConfirmation = () => {
        setShowDeleteModal(false);
        setEntityToDeleteId(null);
        fetchEntities();
    };

    const handleDeleteEntity = async () => {
        try {
            setError(null);
            const entityMap = {
                company: { apiEndpoint: '/api/v1/admin/deleteCompany', setter: setCompanies },
                industry: { apiEndpoint: '/api/v1/admin/deleteIndustry', setter: setIndustries },
                jobType: { apiEndpoint: '/api/v1/admin/deleteJobType', setter: setJobTypes },
                experienceLevel: { apiEndpoint: '/api/v1/admin/deleteExperienceLevel', setter: setExperienceLevels }
            };
            const { apiEndpoint } = entityMap[activeEntity];
            const url = `${import.meta.env.VITE_BASE_URL}${apiEndpoint}/${entityToDeleteId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
            });
            if (!response.ok) throw new Error(`Failed to delete ${activeEntity}: ${response.status} ${response.statusText}`);
            closeDeleteConfirmation();
            fetchEntities();
        } catch (err) {
            setError(err.message);
        }
    };

    const getIcon = (entity) => {
        switch (entity) {
            case 'company': return <FiBriefcase className="mr-2" size={20} />;
            case 'industry': return <FiTool className="mr-2" size={20} />;
            case 'jobType': return <FiFile className="mr-2" size={20} />;
            case 'experienceLevel': return <FiUser className="mr-2" size={20} />;
            default: return <FiUser className="mr-2" size={20} />;
        }
    };

    const getEntities = () => {
        switch (activeEntity) {
            case 'company': return companies;
            case 'industry': return industries;
            case 'jobType': return jobTypes;
            case 'experienceLevel': return experienceLevels;
            default: return [];
        }
    };

    const filteredEntities = getEntities().filter(entity =>
        entity.name && entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const entityNameMap = {
        company: "Companies",
        industry: "Industries",
        jobType: "Job Types",
        experienceLevel: "Experience Levels",
    };

    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-gray-50 p-8 rounded-3xl shadow-lg flex flex-col h-full"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Entities</h2>
    
          {/* Top Navigation */}
          <div className="flex space-x-6 mb-10">
            {['company', 'industry', 'jobType', 'experienceLevel'].map(entity => (
              <motion.button
                key={entity}
                className={`py-3 px-6 rounded-full font-semibold transition-all duration-300
                          ${activeEntity === entity
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-200 shadow-sm'
                          }`}
                onClick={() => setActiveEntity(entity)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getIcon(entity)}
                {entityNameMap[entity]}
              </motion.button>
            ))}
          </div>
    
          {/* Search and Add Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 mr-4">
              <input
                type="text"
                placeholder={`Search ${entityNameMap[activeEntity]}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 border-2 border-gray-300 rounded-full shadow-inner text-gray-700 transition-all duration-300 pl-12"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="inline-block mr-2" /> Add {entityNameMap[activeEntity]}
            </motion.button>
          </div>
    
          {/* Entity List */}
          {loading ? (
            <div className="text-center text-gray-500 flex-grow flex items-center justify-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 flex-grow flex items-center justify-center">{error}</div>
          ) : filteredEntities.length === 0 ? (
            <div className="text-center text-gray-500 flex-grow flex items-center justify-center">No data to show.</div>
          ) : (
            <motion.ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-grow overflow-y-auto" layout>
              {filteredEntities.map(entity => (
                <motion.li
                  key={entity._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex flex-col items-center text-center"
                  layout
                  whileHover={{ scale: 1.05 }}
                >
                  {activeEntity === 'company' &&
                    <motion.img
                      src={entity.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyWN150bkFW7HuP4a7uuf9yb8fIIM7CXEv9g&s'}
                      alt={entity.name}
                      className="w-24 h-24 object-cover rounded-full mb-3"
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                    />
                  }
                  <span className="text-lg font-semibold text-gray-800">{entity.name}</span>
                  <motion.button
                    onClick={() => openDeleteConfirmation(entity._id)}
                    className="mt-3 text-red-500 hover:text-red-700 transition-colors p-2 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiTrash2 size={20} />
                  </motion.button>
                </motion.li>
              ))}
            </motion.ul>
          )}
    
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <div className="text-red-500 mb-4">
                    <FiAlertTriangle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to delete this item?</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={closeDeleteConfirmation}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteEntity}
                      className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      {loadingAction ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
    
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 max-w-sm w-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Add {entityNameMap[activeEntity].slice(0, -1)}</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                      <FiX size={24} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder={`Enter ${entityNameMap[activeEntity].slice(0, -1)} name`}
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg mb-4"
                  />
                  {activeEntity === 'company' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                      {newEntityLogo && (
                        <p className="mt-2 text-sm text-gray-500">
                          Selected file: {newEntityLogo.name}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddEntity}
                      className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                    >
                      {loadingAction ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };
    
    export default ManageEntitiesSection;
