
const Job = require('../models/job.model');
const {uploadToCloudinary, deleteFromCloudinary} = require('../middleware/upload')
const Application  =  require('../models/application.model');

const getAllJobs = async (req, res) => {    
    try{
        const jobs = await Job.find();
        res.json(jobs);
    }
    catch(err){
        res.status(400).json(err);
    }
}


const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(400).json(err);
    }
}


const getLimitedJobs = async (req, res) => {    
    try {
        const jobs = await Job.find().limit(7);
        res.json(jobs);
    } catch (err) {
        res.status(400).json(err);
    }
}

const addJob = async (req, res) => {    
    const { title, company, location, description, requirements, salary, jobType, experienceLevel, skills, industry, applicationDeadline } = req.body;  
    const companyLogo = req.files['companyLogo'][0].buffer;
    const companyLogoUpload = await uploadToCloudinary(companyLogo, 'uploads/companyLogos','image');

    try {
        const job = new Job(
            {
            companyLogo: companyLogoUpload.url,
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
            applicationDeadline
            }
        );

        await job.save();
        res.status(201).json("Job added successfully");
        } catch (err) {
            res.status(500).json({ message: 'Internal Server Error', details: err.message });
        }
}

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