
const Job = require('../models/job.model');
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




module.exports = { getAllJobs, getJobById, getLimitedJobs };