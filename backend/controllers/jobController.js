
const Job = require('../models/job.model');
const Company = require('../models/jobSettings/company.model');
const ExperienceLevel = require('../models/jobSettings/experience.model');
const JobType = require('../models/jobSettings/jobType.model');
const Industry = require('../models/jobSettings/industry.model');


const {uploadToCloudinary, deleteFromCloudinary} = require('../middleware/upload')
const Application  =  require('../models/application.model');

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();

        const jobData = await Promise.all(
            jobs.map(async (job) => {
                const company = job.company?._id ? await Company.findById(job.company._id) : null;
                const experienceLevel = job.experienceLevel?._id ? await ExperienceLevel.findById(job.experienceLevel._id) : null;
                const jobType = job.jobType?._id ? await JobType.findById(job.jobType._id) : null;
                const industry = job.industry?._id ? await Industry.findById(job.industry._id) : null;

                return {
                    job: {
                        id: job._id,
                        title: job.title,
                        companyLogo: company?.logo || '',
                        company: company?.name || 'Unknown',
                        location: job.location,
                        description: job.description,
                        requirements: job.requirements,
                        salary: job.salary,
                        jobType: jobType?.name || 'N/A',
                        experienceLevel: experienceLevel?.name || 'N/A',
                        skills: job.skills,
                        industry: industry?.name || 'N/A',
                        applicationDeadline: job.applicationDeadline,
                        applicationPostedDate: job.applicationPostedDate
                    }
                };
            })
        );

        res.json(jobData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getJobById = async (req, res) => {
    try {
        // Fetch the job by ID
        const job = await Job.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Fetch related data
        const company = await Company.findById(job.company._id);
        const experienceLevel = await ExperienceLevel.findById(job.experienceLevel._id);
        const jobType = await JobType.findById(job.jobType._id);
        const industry = await Industry.findById(job.industry._id);

        // Return the job data with related information
        const jobData = {
            id: job._id,
            title: job.title,
            companyLogo: company.logo,
            company: company.name,
            location: job.location,
            description: job.description,
            requirements: job.requirements,
            salary: job.salary,
            jobType: jobType.name,
            experienceLevel: experienceLevel.name,
            skills: job.skills,
            industry: industry.name,
            applicationDeadline: job.applicationDeadline,
            applicationPostedDate: job.applicationPostedDate
        };

        res.json(jobData);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error fetching job data", error: err });
    }
};



const getLimitedJobs = async (req, res) => {    
    try {
        const jobs = await Job.find().limit(7);
        res.json(jobs);
    } catch (err) {
        res.status(400).json(err);
    }
}

const addJob = async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        description,
        requirements,
        salary,
        jobType,
        experienceLevel,
        skills,
        industry,
        applicationDeadline,
        applicationPostedDate
      } = req.body;
  
      // Validate required fields
      if (!title || !company || !location || !description || !salary || !jobType || !experienceLevel || !industry || !applicationDeadline || !applicationPostedDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if(salary < 0){
        return res.status(400).json({ message: "Please enter valid salary" });
      }

    if(applicationDeadline < applicationPostedDate){
        return res.status(400).json({ message: "Application Deadline Date not valid" });
    }
    

  
      // Create a new job instance
      const newJob = new Job({
        title,
        company,
        location,
        description,
        requirements,
        salary: parseFloat(salary),
        jobType,
        experienceLevel,
        skills,
        industry,
        applicationDeadline: new Date(applicationDeadline),
        applicationPostedDate: new Date(applicationPostedDate)
      });
  
      // Save job to database
      const savedJob = await newJob.save();
      
      res.status(201).json({ message: "Job created successfully", job: savedJob });
    } catch (error) {
      console.error("Error adding job:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (job.companyLogo) {
            const companyLogoPublicId = getPublicIdFromUrl(candidate.companyLogo);
            await deleteFromCloudinary(companyLogoPublicId);
        }

        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(400).json(err);
    }
}





module.exports = { getAllJobs, getJobById, getLimitedJobs, addJob, deleteJob };