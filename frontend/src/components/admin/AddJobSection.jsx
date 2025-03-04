import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiBriefcase, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';

const AddJobSection = () => {
  const [job, setJob] = useState({
    companyLogo: null,
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: [],
    jobType: '',
    experienceLevel: '',
    skills: [],
    industry: '',
    applicationDeadline: '',
    applicationPostedDate: new Date().toISOString().split('T')[0]
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob(prevJob => ({ ...prevJob, [name]: value }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setJob(prevJob => ({ ...prevJob, [name]: value.split(',').map(item => item.trim()) }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setJob(prevJob => ({ ...prevJob, companyLogo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
      setFormError('');
    } else {
      setFormError('Please select a valid image file');
      setJob(prevJob => ({ ...prevJob, companyLogo: null }));
      setPreviewLogo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!job.companyLogo) {
      setFormError('Please select a company logo');
      return;
    }

    const formData = new FormData();
    for (const key in job) {
      if (key === 'companyLogo') {
        formData.append(key, job[key], job[key].name);
      } else if (Array.isArray(job[key])) {
        formData.append(key, JSON.stringify(job[key]));
      } else {
        formData.append(key, job[key]);
      }
    }

    console.log('Job submitted:', formData);

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setJob({
      companyLogo: null,
      title: '',
      company: '',
      location: '',
      description: '',
      requirements: [],
      salary: '',
      jobType: '',
      experienceLevel: '',
      skills: [],
      industry: '',
      applicationDeadline: '',
      applicationPostedDate: new Date().toISOString().split('T')[0]
    });
    setPreviewLogo(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Add New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="companyLogo" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <FiUpload className="mr-2" /> Company Logo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="companyLogo"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {previewLogo && (
            <motion.img
              src={previewLogo}
              alt="Company Logo Preview"
              className="mt-2 h-20 w-20 object-contain rounded-full"
              whileHover={{ scale: 1.1 }}
            />
          )}
          {formError && <p className="text-red-500 text-sm mt-1">{formError}</p>}
        </div>
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <FiBriefcase className="mr-2" /> Job Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter job title"
            name="title"
            value={job.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">
            Company
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="company"
            type="text"
            placeholder="Enter company name"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <FiMapPin className="mr-2" /> Location
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            placeholder="Enter job location"
            name="location"
            value={job.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <FiDollarSign className="mr-2" /> Salary
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="salary"
            type="number"
            placeholder="Enter salary"
            name="salary"
            value={job.salary}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="jobType" className="block text-gray-700 text-sm font-bold mb-2">
            Job Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="jobType"
            name="jobType"
            value={job.jobType}
            onChange={handleChange}
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Temporary">Temporary</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label htmlFor="experienceLevel" className="block text-gray-700 text-sm font-bold mb-2">
            Experience Level
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="experienceLevel"
            name="experienceLevel"
            value={job.experienceLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select Experience Level</option>
            <option value="Entry">Entry</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
        <div>
          <label htmlFor="industry" className="block text-gray-700 text-sm font-bold mb-2">
            Industry
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="industry"
            type="text"
            placeholder="Enter industry"
            name="industry"
            value={job.industry}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Job Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Enter job description"
            name="description"
            value={job.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="requirements" className="block text-gray-700 text-sm font-bold mb-2">
            Requirements (comma-separated)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="requirements"
            placeholder="Enter job requirements, separated by commas"
            name="requirements"
            value={job.requirements.join(', ')}
            onChange={handleArrayChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="skills" className="block text-gray-700 text-sm font-bold mb-2">
            Skills (comma-separated)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="skills"
            placeholder="Enter required skills, separated by commas"
            name="skills"
            value={job.skills.join(', ')}
            onChange={handleArrayChange}
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="applicationDeadline" className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <FiCalendar className="mr-2" /> Application Deadline
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="applicationDeadline"
            type="date"
            name="applicationDeadline"
            value={job.applicationDeadline}
            onChange={handleChange}
            required
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:shadow-outline"
        >
          Add Job
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddJobSection;
