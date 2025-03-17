
// // //apply+application

// // const Application = require('../models/application.model');
// // const Job = require('../models/job.model');
// // const Candidate = require('../models/candidate.model');
// // const CandidateProfile = require('../models/candidate.profile.model');

// // const applyJob = async (req, res) => {
// //     try {
// //         console.log("Job ID:", req.params.id);
// //         const job = await Job.findById(req.params.id);

// //         if (!job) {
// //             console.log("Job not found");
// //             return res.status(404).json({ message: "Job not found" });
// //         }

// //         console.log("User Email:", req.user?.email);
// //         const email = req.user.email;
// //         const candidate = await Candidate.findOne({ email });

// //         if (!candidate) {
// //             console.log("Candidate not found");
// //             return res.status(404).json({ message: "Candidate not found" });
// //         }

// //         console.log("Candidate ID:", candidate._id);

// //         // Check if the candidate has already applied
// //         const existingApplication = await Application.findOne({
// //             candidateId: candidate._id,
// //             jobId: job._id,
// //         });

// //         if (req.method === "GET") {
// //             // If it's a GET request, return application status
// //             if (existingApplication) {
// //                 return res.json({ applied: true, message: "You have already applied for this job" });
// //             } else {
// //                 return res.json({ applied: false, message: "You have not applied for this job" });
// //             }
// //         }

// //         // If it's a POST request, proceed with applying
// //         if (existingApplication) {
// //             console.log("Duplicate application detected");
// //             return res.status(400).json({ message: "You have already applied for this job" });
// //         }

// //         const candidateProfile = await CandidateProfile.findOne({ candidateId: candidate._id });
// //         if (!candidateProfile) {
// //             console.log("Candidate profile not found");
// //             return res.status(400).json({ message: "Candidate profile not found" });
// //         }

// //         console.log("Candidate Profile Skills:", candidateProfile.skills);
// //         console.log("Job Skills:", job.skills);

// //         const matchingSkills = job.skills.filter(skill => candidateProfile.skills.includes(skill));
// //         console.log("Matching Skills:", matchingSkills);

// //         const application = new Application({
// //             jobId: job._id,
// //             candidateId: candidate._id,
// //             skillsMatching: matchingSkills,
// //             status: "pending",
// //             dateApplied: new Date(),
// //             jobName:job.title,
// //             companyName:job.company,
// //         });

// //         await application.save();
// //         console.log("Application saved successfully");

// //         job.applicationCount++;
// //         job.viewCount++;
// //         await job.save();

// //         console.log("Job application and view counts updated");

// //         res.json({ message: "Applied successfully" });

// //     } catch (err) {
// //         console.error("Server Error:", err);
// //         res.status(500).json({ message: "Server error", error: err.message });
// //     }
// // };

// // const getMyApplications = async (req, res) => {
// //     try {
// //         const candidate = await Candidate.findOne({ email:req.user.email });  
// //         if (!candidate) {
// //             return res.status(400).json({ message: "Candidate not found" });
// //         }
// //         console.log("Candidate ID:", candidate._id);
// //         const applications = await Application.find({ 
// //             candidateId: candidate._id
// //          });
// //         res.status(200).json(applications);
// //     } catch (error) {
// //         res.status(500).json({ message: "Server error", error: error.message });
// //     }
// // };



// // module.exports = { applyJob,getMyApplications };



// //apply+application

// const Application = require('../models/application.model');
// const Job = require('../models/job.model');
// const Candidate = require('../models/candidate.model');
// const CandidateProfile = require('../models/candidate.profile.model');

// const applyJob = async (req, res) => {
//     try {
//         console.log("Job ID:", req.params.id);
//         const job = await Job.findById(req.params.id);

//         if (!job) {
//             console.log("Job not found");
//             return res.status(404).json({ message: "Job not found" });
//         }
        
//         console.log("User Email:", req.user?.email);
//         const email = req.user.email;
//         const candidate = await Candidate.findOne({ email });
//         console.log("candidate id : ",candidate._id)
//         if (!candidate) {
//             console.log("Candidate not found");
//             return res.status(404).json({ message: "Candidate not found" });
//         }

//         console.log("Candidate ID:", candidate._id);

//         // Check if the candidate has already applied
//         const existingApplication = await Application.findOne({
//             candidateId: candidate._id,
//             jobId: job._id,
//         });

//         if (req.method === "GET") {
//             // If it's a GET request, return application status
//             if (existingApplication) {
//                 return res.json({ applied: true, message: "You have already applied for this job" });
//             } else {
//                 return res.json({ applied: false, message: "You have not applied for this job" });
//             }
//         }

//         // If it's a POST request, proceed with applying
//         if (existingApplication) {
//             console.log("Duplicate application detected");
//             return res.status(400).json({ message: "You have already applied for this job" });
//         }
//         // console.log("candidate id : ",candidate._id)
//         const candidateProfile = await CandidateProfile.findOne({ candidateId: candidate._id });
//         if (!candidateProfile) {
//             console.log("Candidate profile not found");
//             return res.status(400).json({ message: "Candidate profile not found. Please enter your details on the profile section " });
//         }
        
//         console.log("Candidate Profile Skills:", candidateProfile.skills);
//         console.log("Job Skills:", job.skills);

//         const matchingSkills = job.skills.filter(skill => candidateProfile.skills.includes(skill));
//         console.log("Matching Skills:", matchingSkills);

//         const application = new Application({
//             jobId: job._id,
//             candidateId: candidate._id,
//             skillsMatching: matchingSkills,
//             status: "pending",
//             dateApplied: new Date(),
//             jobName:job.title,
//             companyName:job.company,
//             resume:candidate.resume,
//         });

//         await application.save();
//         console.log("Application saved successfully");

//         job.applicationCount++;
//         job.viewCount++;
//         await job.save();

//         console.log("Job application and view counts updated");

//         res.json({ message: "Applied successfully" });

//     } catch (err) {
//         console.error("Server Error:", err);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// };

// const getMyApplications = async (req, res) => {
//     try {
//         const candidate = await Candidate.findOne({ email:req.user.email });  
//         if (!candidate) {
//             return res.status(400).json({ message: "Candidate not found" });
//         }
//         console.log("Candidate ID:", candidate._id);
//         const applications = await Application.find({ 
//             candidateId: candidate._id
//          });
//         res.status(200).json(applications);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };



// module.exports = { applyJob,getMyApplications };

//apply+application

const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Candidate = require('../models/candidate.model');
const CandidateProfile = require('../models/candidate.profile.model');

const applyJob = async (req, res) => {
    try {
        console.log("Job ID:", req.params.id);
        //const job = await Job.findById(req.params.id);
        const job = await Job.findById(req.params.id).populate("company", "name");
         console.log("Company Name:", job.company.name);


        if (!job) {
            console.log("Job not found");
            return res.status(404).json({ message: "Job not found" });
        }
        
        console.log("User Email:", req.user?.email);
        const email = req.user.email;
        const candidate = await Candidate.findOne({ email });
        console.log("candidate id : ",candidate._id)
        if (!candidate) {
            console.log("Candidate not found");
            return res.status(404).json({ message: "Candidate not found" });
        }

        console.log("Candidate ID:", candidate._id);

        // Check if the candidate has already applied
        const existingApplication = await Application.findOne({
            candidateId: candidate._id,
            jobId: job._id,
        });

        if (req.method === "GET") {
            // If it's a GET request, return application status
            if (existingApplication) {
                return res.json({ applied: true, message: "You have already applied for this job" });
            } else {
                return res.json({ applied: false, message: "You have not applied for this job" });
            }
        }

        // If it's a POST request, proceed with applying
        if (existingApplication) {
            console.log("Duplicate application detected");
            return res.status(400).json({ message: "You have already applied for this job" });
        }
        // console.log("candidate id : ",candidate._id)
        const candidateProfile = await CandidateProfile.findOne({ candidateId: candidate._id });
        if (!candidateProfile) {
            console.log("Candidate profile not found");
            return res.status(400).json({ message: "Candidate profile not found. Please enter your details on the profile section " });
        }
        
        console.log("Candidate Profile Skills:", candidateProfile.skills);
        console.log("Job Skills:", job.skills);

        const matchingSkills = job.skills.filter(skill => candidateProfile.skills.includes(skill));
        console.log("Matching Skills:", matchingSkills);
        console.log(job)
        const application = new Application({
            jobId: job._id,
            candidateId: candidate._id,
            skillsMatching: matchingSkills,
            status: "pending",
            dateApplied: new Date(),
            jobName:job.title,
            companyName:job.company.name,
            resume:candidate.resume,
        });
        await application.save();
        console.log("Application saved successfully");
        console.log("job details : ",job.company)

        job.applicationCount++;
        job.viewCount++;
        await job.save();

        console.log("Job application and view counts updated");

        res.json({ message: "Applied successfully" });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const candidate = await Candidate.findOne({ email:req.user.email });  
        if (!candidate) {
            return res.status(400).json({ message: "Candidate not found" });
        }
        console.log("Candidate ID:", candidate._id);
        const applications = await Application.find({ 
            candidateId: candidate._id
         });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
        .populate("candidateId","fullName")
        .lean();
        const formattedApplications = applications.map((app) => ({
            ...app,
            name: app.candidateId
              ? `${app.candidateId.fullName.firstName} ${app.candidateId.fullName.lastName}`
              : "Unknown",
          }));
      
          res.json(formattedApplications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



module.exports = { applyJob,getMyApplications,getAllApplications};