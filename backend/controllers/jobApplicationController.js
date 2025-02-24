const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Candidate  = require('../models/candidate.model');
const CandidateProfile = require('../models/candidate.profile.model');

const applyJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        const email = req.user.email;

        const candidate = await Candidate.findOne
        ({
            email: email
        });
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const candidateProfile = await CandidateProfile.findOne({ candidateId: candidate._id });

        if (!candidateProfile) {
            return res.status(400).json({ message: 'Candidate profile not found' });
        }

        const matchingSkills = job.skills.filter(skill => candidateProfile.skills.includes(skill));

        const application = new Application({
            jobId: job._id,
            resume: candidate.resume,
            status: 'pending',
            dateApplied: new Date(Date.now()),
            candidateId: candidate._id,
            matchingSkills: matchingSkills
        });

        await application.save();

        job.applicationCount++;
        job.viewCount++;
        await job.save();

        res.json({ message: 'Applied successfully' });

    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = { applyJob };