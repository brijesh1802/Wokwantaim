// const Application = require("../models/application.model");
// const Job = require("../models/job.model");
// const Candidate = require("../models/candidate.model");
// const Admin = require("../models/admin.model");
// const Employer = require("../models/employer.model");
// const CandidateProfile = require("../models/candidate.profile.model");
// const sendEmail = require("../utils/emailService");

// // const applyJob = async (req, res) => {
// //   try {
// //     console.log("Job ID:", req.params.id);
// //     //const job = await Job.findById(req.params.id);
// //     const job = await Job.findById(req.params.id).populate("company", "name");
// //     console.log("Company Name:", job.company.name);

// //     if (!job) {
// //       console.log("Job not found");
// //       return res.status(404).json({ message: "Job not found" });
// //     }

// //     console.log("User Email:", req.user?.email);
// //     const email = req.user.email;
// //     const candidate = await Candidate.findOne({ email });
// //     console.log("candidate id : ", candidate._id);
// //     if (!candidate) {
// //       console.log("Candidate not found");
// //       return res.status(404).json({ message: "Candidate not found" });
// //     }
// //     if (!candidate.resume) {
// //       console.log("resume not found");
// //       return res.status(404).json({ message: "Resume not found" });
// //     }
// //     console.log("Candidate ID:", candidate._id);

// //     // Check if the candidate has already applied
// //     const existingApplication = await Application.findOne({
// //       candidateId: candidate._id,
// //       jobId: job._id,
// //     });

// //     if (req.method === "GET") {
// //       // If it's a GET request, return application status
// //       if (existingApplication) {
// //         return res.json({
// //           applied: true,
// //           message: "You have already applied for this job",
// //         });
// //       } else {
// //         return res.json({
// //           applied: false,
// //           message: "You have not applied for this job",
// //         });
// //       }
// //     }

// //     // If it's a POST request, proceed with applying
// //     if (existingApplication) {
// //       console.log("Duplicate application detected");
// //       return res
// //         .status(400)
// //         .json({ message: "You have already applied for this job" });
// //     }
// //     // console.log("candidate id : ",candidate._id)
// //     const candidateProfile = await CandidateProfile.findOne({
// //       candidateId: candidate._id,
// //     });
// //     if (!candidateProfile) {
// //       console.log("Candidate profile not found");
// //       return res
// //         .status(400)
// //         .json({
// //           message:
// //             "Candidate profile not found. Please enter your details on the profile section ",
// //         });
// //     }

// //     if (
// //       candidateProfile.skills.length === 0 ||
// //       candidateProfile.education.length === 0 ||
// //       candidateProfile.workExperience.length === 0 ||
// //       candidateProfile.personalProjects.length === 0
// //     ) {
// //       console.log("Update your profile section");
// //       return res
// //         .status(400)
// //         .json({ message: "Your profile section must be updated" });
// //     }
// //     console.log("Candidate Profile Skills:", candidateProfile.skills);
// //     console.log("Job Skills:", job.skills);

// //     const profileSkills = candidateProfile.skills.map((skill) =>
// //       skill.toLowerCase()
// //     );
// //     const matchingSkills = job.skills.filter((skill) =>
// //       profileSkills.includes(skill.toLowerCase())
// //     );
// //     console.log("Matching Skills :", matchingSkills);

// //     if (!matchingSkills || matchingSkills.length == 0) {
// //       console.log("Matching skills not found");
// //       return res
// //         .status(400)
// //         .json({ message: "Your skills don’t align with the job requirements" });
// //     }

// //     console.log(job);
// //     const application = new Application({
// //       jobId: job._id,
// //       candidateId: candidate._id,
// //       skillsMatching: matchingSkills,
// //       status: "pending",
// //       dateApplied: new Date(),
// //       jobName: job.title,
// //       companyName: job.company.name,
// //       resume: candidate.resume,
// //     });
// //     await application.save();
// //     console.log("Application saved successfully");
// //     console.log("job details : ", job.company);

// //     job.applicationCount++;
// //     job.viewCount++;
// //     await job.save();

// //     console.log("Job application and view counts updated");

// //     res.json({ message: "Applied successfully" });
// //     const mail = candidate.email;
// //     const subject = "Application Confirmation";
// //     const body = ``
// //     await sendEmail(mail, subject, body);
// //   } catch (err) {
// //     console.error("Server Error:", err);
// //     res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // };

// const applyJob = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const userEmail = req.user?.email;

//     console.log("Job ID:", jobId);
//     if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

//     const job = await Job.findById(jobId).populate("company", "name");
//     if (!job) {
//       console.log("Job not found");
//       return res.status(404).json({ message: "Job not found" });
//     }
//     console.log("Company Name:", job.company?.name);

//     const candidate = await Candidate.findOne({ email: userEmail });
//     if (!candidate) {
//       console.log("Candidate not found");
//       return res.status(404).json({ message: "Candidate not found" });
//     }
//     if (!candidate.resume) {
//       console.log("Resume not found");
//       return res.status(400).json({ message: "Resume not found" });
//     }
//     console.log("Candidate ID:", candidate._id);

//     const existingApplication = await Application.findOne({
//       candidateId: candidate._id,
//       jobId: job._id,
//     });

//     if (req.method === "GET") {
//       return res.json({
//         applied: !!existingApplication,
//         message: existingApplication
//           ? "You have already applied for this job"
//           : "You have not applied for this job",
//       });
//     }

//     if (existingApplication) {
//       console.log("Duplicate application detected");
//       return res.status(400).json({ message: "You have already applied for this job" });
//     }

//     const candidateProfile = await CandidateProfile.findOne({
//       candidateId: candidate._id,
//     });

//     if (!candidateProfile || isIncompleteProfile(candidateProfile)) {
//       console.log("Incomplete profile");
//       return res.status(400).json({
//         message: "Please complete your profile (skills, education, experience, projects) before applying.",
//       });
//     }

//     const matchingSkills = getMatchingSkills(candidateProfile.skills, job.skills);
//     if (matchingSkills.length === 0) {
//       console.log("No matching skills found");
//       return res.status(400).json({
//         message: "Your skills don’t align with the job requirements",
//       });
//     }

//     const application = new Application({
//       jobId: job._id,
//       candidateId: candidate._id,
//       skillsMatching: matchingSkills,
//       status: "pending",
//       dateApplied: new Date(),
//       jobName: job.title,
//       companyName: job.company.name,
//       resume: candidate.resume,
//     });

//     await application.save();
//     console.log("Application saved successfully");

//     job.applicationCount++;
//     job.viewCount++;
//     await job.save();
//     console.log("Job stats updated");

//     const emailSubject = "✅ Application Received – " + job.title;

//     const emailBody = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           color: #333;
//           line-height: 1.6;
//           background-color: #f9f9f9;
//           padding: 20px;
//         }
//         .container {
//           background-color: #fff;
//           border-radius: 8px;
//           padding: 30px;
//           box-shadow: 0 0 10px rgba(0,0,0,0.1);
//           max-width: 600px;
//           margin: auto;
//         }
//         h2 {
//           color: #2c3e50;
//         }
//         p {
//           margin: 10px 0;
//         }
//         .footer {
//           margin-top: 30px;
//           font-size: 12px;
//           color: #888;
//           text-align: center;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <h2>🎉 Application Submitted Successfully</h2>
//         <p>Hi <strong>${candidate.name}</strong>,</p>
//         <p>Thank you for applying for the position of <strong>${job.title}</strong> at <strong>${job.company.name}</strong>.</p>
//         <p>We’ve received your application and our team will review it shortly. If your profile matches the requirements, we’ll reach out to you for the next steps.</p>
//         <p>Good luck!</p>
//         <br/>
//         <p>Best regards,<br/><strong>Job Portal Team</strong></p>
//         <div class="footer">
//           This is an automated message, please do not reply.
//         </div>
//       </div>
//     </body>
//     </html>
//     `;

//     await sendEmail(candidate.email, emailSubject, emailBody);
//     return res.json({ message: "Applied successfully" });

//   } catch (err) {
//     console.error("Server Error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 🔧 Helper Functions

// function isIncompleteProfile(profile) {
//   return (
//     !profile.skills?.length ||
//     !profile.education?.length ||
//     !profile.workExperience?.length ||
//     !profile.personalProjects?.length
//   );
// }

// function getMatchingSkills(profileSkills = [], jobSkills = []) {
//   const lowerProfileSkills = profileSkills.map((s) => s.toLowerCase());
//   return jobSkills.filter((skill) =>
//     lowerProfileSkills.includes(skill.toLowerCase())
//   );
// }

// const getMyApplications = async (req, res) => {
//   try {
//     const candidate = await Candidate.findOne({ email: req.user.email });
//     if (!candidate) {
//       return res.status(400).json({ message: "Candidate not found" });
//     }
//     console.log("Candidate ID:", candidate._id);
//     const applications = await Application.find({
//       candidateId: candidate._id,
//     });
//     res.status(200).json(applications);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const getApplications = async (req, res) => {
//   try {
//     let user = await Admin.findOne({ email: req.user.email });
//     if (!user) {
//        user = await Employer.findOne({ email: req.user.email });
//     }
//     if (!user) {
//       return res.status(400).json({ message: "user not found" });
//     }
//     const userID=user._id;

//     const jobs=await Job.find({addedBy:userID}).select('_id');
//     const jobIDs=jobs.map((job)=>job._id.toString());
//     if (jobIDs.length === 0) {
//         return res.status(200).json([]);
//       }

//     const applications = await Application.find({
//       jobId: { $in: jobIDs },
//     }).populate("candidateId", "fullName")
//     .lean();
//     const formattedApplications = applications.map((app) => ({
//         ...app,
//         name: app.candidateId
//           ? `${app.candidateId.fullName.firstName} ${app.candidateId.fullName.lastName}`
//           : "Unknown",
//         }));

//     // console.log("controller-applications : ",formattedApplications)
//     res.status(200).json(formattedApplications);
//   } catch (error) {
//     console.log("server error", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const getAllApplications = async (req, res) => {
//   try {
//     const applications = await Application.find()
//       .populate("candidateId", "fullName")
//       .lean();
//     const formattedApplications = applications.map((app) => ({
//       ...app,
//       name: app.candidateId
//         ? `${app.candidateId.fullName.firstName} ${app.candidateId.fullName.lastName}`
//         : "Unknown",
//     }));

//     res.json(formattedApplications);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // const editApplication = async (req, res) => {
// //   try {
// //     const { applicationId } = req.params;
// //     const { status } = req.body;

// //     console.log("Received Request to Edit Application");
// //     console.log("Application ID:", applicationId);
// //     console.log("New Status:", status);

// //     if (!applicationId) {
// //       return res.status(400).json({ message: "Application ID is required" });
// //     }

// //     if (!status) {
// //       return res.status(400).json({ message: "Status field is required" });
// //     }

// //     const application = await Application.findByIdAndUpdate(
// //       applicationId,
// //       { status },
// //       { new: true }
// //     ).populate("candidateId", "fullName");

// //     if (!application) {
// //       console.log("Application not found");
// //       return res.status(404).json({ message: "Application not found" });
// //     }
// //     const formattedApplication = {
// //       ...application.toObject(),
// //       name: application.candidateId
// //         ? `${application.candidateId.fullName.firstName} ${application.candidateId.fullName.lastName}`
// //         : "Unknown",
// //     };

// //     res.json({
// //       message: "Application updated successfully",
// //       application: formattedApplication,
// //     });
// //   } catch (error) {
// //     console.error("Error updating application:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };

// // const editApplication = async (req, res) => {
// //   try {
// //     const { applicationId } = req.params;
// //     const { status } = req.body;

// //     console.log("Received Request to Edit Application");
// //     console.log("Application ID:", applicationId);
// //     console.log("New Status:", status);

// //     if (!applicationId) {
// //       return res.status(400).json({ message: "Application ID is required" });
// //     }

// //     if (!status) {
// //       return res.status(400).json({ message: "Status field is required" });
// //     }

// //     const application = await Application.findByIdAndUpdate(
// //       applicationId,
// //       { status },
// //       { new: true }
// //     ).populate("candidateId", "fullName email");

// //     if (!application) {
// //       console.log("Application not found");
// //       return res.status(404).json({ message: "Application not found" });
// //     }

// //     const candidateName = application.candidateId
// //       ? `${application.candidateId.fullName.firstName} ${application.candidateId.fullName.lastName}`
// //       : "Candidate";

// //     const email = application.candidateId?.email;

// //     const formattedApplication = {
// //       ...application.toObject(),
// //       name: candidateName,
// //     };

// //     // ✉️ Send email notification
// //     if (email) {
// //       const subject = `📢 Application Status Updated – ${status.toUpperCase()}`;

// //       const body = `
// // <!DOCTYPE html>
// // <html>
// // <head>
// //   <style>
// //     body {
// //       font-family: Arial, sans-serif;
// //       background-color: #f4f4f4;
// //       padding: 20px;
// //     }
// //     .email-container {
// //       background-color: #ffffff;
// //       border-radius: 8px;
// //       padding: 30px;
// //       max-width: 600px;
// //       margin: auto;
// //       box-shadow: 0 0 10px rgba(0,0,0,0.1);
// //     }
// //     h2 {
// //       color: #2c3e50;
// //     }
// //     p {
// //       color: #333;
// //     }
// //     .status {
// //       font-weight: bold;
// //       color: #2980b9;
// //     }
// //     .footer {
// //       margin-top: 30px;
// //       font-size: 12px;
// //       text-align: center;
// //       color: #aaa;
// //     }
// //   </style>
// // </head>
// // <body>
// //   <div class="email-container">
// //     <h2>Hello ${candidateName},</h2>
// //     <p>Your job application status has been updated.</p>
// //     <p>New Status: <span class="status">${status.toUpperCase()}</span></p>
// //     <p>Please log in to your account to view further details or next steps.</p>
// //     <br/>
// //     <p>Best regards,<br/>Job Portal Team</p>
// //     <div class="footer">
// //       This is an automated message. Please do not reply.
// //     </div>
// //   </div>
// // </body>
// // </html>
// // `;

// //       await sendEmail(email, subject, body);
// //       console.log("Status change email sent to candidate:", email);
// //     }

// //     res.json({
// //       message: "Application updated successfully",
// //       application: formattedApplication,
// //     });
// //   } catch (error) {
// //     console.error("Error updating application:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };

// const editApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;
//     const { status } = req.body;

//     console.log("Received Request to Edit Application");
//     console.log("Application ID:", applicationId);
//     console.log("New Status:", status);

//     if (!applicationId) {
//       return res.status(400).json({ message: "Application ID is required" });
//     }

//     if (!status) {
//       return res.status(400).json({ message: "Status field is required" });
//     }

//     const application = await Application.findByIdAndUpdate(
//       applicationId,
//       { status },
//       { new: true }
//     )
//       .populate("candidateId", "fullName email")
//       .populate("jobId", "title companyName");

//     if (!application) {
//       console.log("Application not found");
//       return res.status(404).json({ message: "Application not found" });
//     }

//     const candidateName = application.candidateId
//       ? `${application.candidateId.fullName.firstName} ${application.candidateId.fullName.lastName}`
//       : "Candidate";

//     const email = application.candidateId?.email;
//     const jobTitle = application.jobId?.title || "Unknown Role";
//     const companyName = application.jobId?.companyName || "Unknown Company";

//     const formattedApplication = {
//       ...application.toObject(),
//       name: candidateName,
//     };

//     // ✉️ Send email notification
//     if (email) {
//       const subject = `📢 Your Application Status for ${jobTitle} at ${companyName} is Now ${status.toUpperCase()}`;

//       const body = `
// <!DOCTYPE html>
// <html>
// <head>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f4f4f4;
//       padding: 20px;
//     }
//     .email-container {
//       background-color: #ffffff;
//       border-radius: 8px;
//       padding: 30px;
//       max-width: 600px;
//       margin: auto;
//       box-shadow: 0 0 10px rgba(0,0,0,0.1);
//     }
//     h2 {
//       color: #2c3e50;
//     }
//     p {
//       color: #333;
//     }
//     .status {
//       font-weight: bold;
//       color: #2980b9;
//     }
//     .footer {
//       margin-top: 30px;
//       font-size: 12px;
//       text-align: center;
//       color: #aaa;
//     }
//   </style>
// </head>
// <body>
//   <div class="email-container">
//     <h2>Hello ${candidateName},</h2>
//     <p>We wanted to let you know that the status of your job application has changed.</p>
//     <p><strong>Position:</strong> ${jobTitle}</p>
//     <p><strong>Company:</strong> ${companyName}</p>
//     <p><strong>New Status:</strong> <span class="status">${status.toUpperCase()}</span></p>
//     <p>Please log in to your account to view more details or next steps.</p>
//     <br/>
//     <p>Best regards,<br/>Job Portal Team</p>
//     <div class="footer">
//       This is an automated message. Please do not reply.
//     </div>
//   </div>
// </body>
// </html>
// `;

//       await sendEmail(email, subject, body);
//       console.log("Status update email sent to candidate:", email);
//     }

//     res.json({
//       message: "Application updated successfully",
//       application: formattedApplication,
//     });
//   } catch (error) {
//     console.error("Error updating application:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const deleteApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;

//     // Find and delete the application
//     const deletedApplication = await Application.findByIdAndDelete(
//       applicationId
//     );

//     if (!deletedApplication) {
//       return res.status(404).json({ message: "Application not found" });
//     }

//     res.status(200).json({ message: "Application deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting application:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   applyJob,
//   getMyApplications,
//   getAllApplications,
//   editApplication,
//   deleteApplication,
//   getApplications,
// };

const Application = require("../models/application.model");
const Job = require("../models/job.model");
const Candidate = require("../models/candidate.model");
const Admin = require("../models/admin.model");
const Employer = require("../models/employer.model");
const CandidateProfile = require("../models/candidate.profile.model");
const sendEmail = require("../utils/emailService");
const { request } = require("express");

// 🔧 Helper Functions
function isIncompleteProfile(profile) {
  return (
    !profile.skills?.length ||
    !profile.education?.length ||
    !profile.workExperience?.length ||
    !profile.personalProjects?.length
  );
}

function getMatchingSkills(profileSkills = [], jobSkills = []) {
  const lowerProfileSkills = profileSkills.map((s) => s.toLowerCase());
  return jobSkills.filter((skill) =>
    lowerProfileSkills.includes(skill.toLowerCase())
  );
}

// const applyJob = async (req, res) => {
//   try {
//     const jobId = req.params.id;
//     const userEmail = req.user?.email;

//     if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

//     const job = await Job.findById(jobId).populate("company", "name");
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     const candidate = await Candidate.findOne({ email: userEmail });
//     if (!candidate) return res.status(404).json({ message: "Candidate not found" });
//     if (!candidate.resume) return res.status(400).json({ message: "Resume not found" });

//     const existingApplication = await Application.findOne({
//       candidateId: candidate._id,
//       jobId: job._id,
//     });

//     if (req.method === "GET") {
//       return res.json({
//         applied: !!existingApplication,
//         message: existingApplication
//           ? "You have already applied for this job"
//           : "You have not applied for this job",
//       });
//     }

//     if (existingApplication) {
//       return res.status(400).json({ message: "You have already applied for this job" });
//     }

//     const candidateProfile = await CandidateProfile.findOne({ candidateId: candidate._id });
//     if (!candidateProfile || isIncompleteProfile(candidateProfile)) {
//       return res.status(400).json({
//         message: "Please complete your profile (skills, education, experience, projects) before applying.",
//       });
//     }

//     const matchingSkills = getMatchingSkills(candidateProfile.skills, job.skills);
//     if (matchingSkills.length === 0) {
//       return res.status(400).json({ message: "Your skills don’t align with the job requirements" });
//     }

//     const application = new Application({
//       jobId: job._id,
//       candidateId: candidate._id,
//       skillsMatching: matchingSkills,
//       status: "pending",
//       dateApplied: new Date(),
//       jobName: job.title,
//       companyName: job.company.name,
//       resume: candidate.resume,
//     });

//     await application.save();

//     job.applicationCount++;
//     job.viewCount++;
//     await job.save();

//     const emailSubject = `✅ Application Received – ${job.title}`;
//     const emailBody = `
//       <html>
//         <body style="font-family: Arial, sans-serif; padding: 20px;">
//           <div style="max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
//             <h2>🎉 Application Submitted</h2>
//             <p>Hello <strong>${candidate.name}</strong>,</p>
//             <p>Thank you for applying to <strong>${job.title}</strong> at <strong>${job.company.name}</strong>.</p>
//             <p>We'll review your profile and get back to you if you're shortlisted.</p>
//             <p>Good luck!</p>
//             <p>Best regards,<br/>Job Portal Team</p>
//           </div>
//         </body>
//       </html>
//     `;

//     await sendEmail(candidate.email, emailSubject, emailBody);
//     res.json({ message: "Applied successfully" });

//   } catch (err) {
//     console.error("Server Error:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const applyJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userEmail = req.user?.email;

    if (!userEmail) return res.status(401).json({ message: "Unauthorized" });

    const candidate = await Candidate.findOne({ email: userEmail });
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    if (!candidate.resume)
      return res.status(400).json({ message: "Resume not found" });

    const job = await Job.findById(jobId)
      .populate("company", "name")
      .populate("jobType", "name")
      .populate("experienceLevel", "level");

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.method === "GET") {
      const existingApplication = await Application.findOne({
        candidateId: candidate._id,
        jobId,
      });

      return res.json({
        applied: !!existingApplication,
        message: "You have already applied for this job"
      });
    }
    if (req.method === "POST") {
      const candidateProfile = await CandidateProfile.findOne({
        candidateId: candidate._id,
      });
      if (!candidateProfile || isIncompleteProfile(candidateProfile)) {
        return res.status(400).json({
          message:
            "Please complete your profile (skills, education, experience, projects) before applying.",
        });
      }

      const matchingSkills = getMatchingSkills(
        candidateProfile.skills,
        job.skills
      );
      if (matchingSkills.length === 0) {
        return res.status(400).json({
          message: "Your skills don’t align with the job requirements",
        });
      }

      console.log("candidate ",candidate);
      const application = new Application({
        jobId: job._id,
        candidateId: candidate._id,
        skillsMatching: matchingSkills,
        status: "pending",
        dateApplied: new Date(),
        jobName: job.title,
        companyName: job.company.name,
        resume: candidate.resume,
      });

      await application.save();

      job.applicationCount += 1;
      job.viewCount += 1;
      await job.save();

      // Define the dashboard URL (you can change this to your real dashboard link)
      const dashboardURL = "https://wokwantaim.com/dashboard";
      const unsubscribeURL = `${dashboardURL}/unsubscribe`;

      const emailSubject = `✅ Application Received – ${job.title}`;
      const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">🎉 Application Submitted</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Hello <strong>${candidate.fullName.firstName } ${candidate.fullName.lastName}</strong>,<br/><br/>
            Thank you for applying to <strong>${job.title}</strong> at <strong>${job.company.name}</strong>.<br/><br/>
            We'll review your profile and get back to you if you're shortlisted.<br/><br/>
            Good luck!<br/><br/>
            Best regards,<br/>Job Portal Team
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            Need help? <a href="mailto:support@wokwantaim.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
          </p>
        </div>
        <div>
          <p>If you no longer wish to receive these emails, <a href="${unsubscribeURL}">Unsubscribe here</a>.</p>
        </div>
      </div>
    `;

      await sendEmail(candidate.email, emailSubject, emailBody);

      res.json({ message: "Applied successfully" });
    }
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ email: req.user.email });
    if (!candidate)
      return res.status(400).json({ message: "Candidate not found" });

    const applications = await Application.find({ candidateId: candidate._id });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getApplications = async (req, res) => {
  try {
    let user =
      (await Admin.findOne({ email: req.user.email })) ||
      (await Employer.findOne({ email: req.user.email }));
    if (!user) return res.status(400).json({ message: "User not found" });

    const jobs = await Job.find({ addedBy: user._id }).select("_id");
    const jobIDs = jobs.map((job) => job._id.toString());

    if (!jobIDs.length) return res.status(200).json([]);

    const applications = await Application.find({ jobId: { $in: jobIDs } })
      .populate("candidateId", "fullName")
      .lean();

    const formattedApplications = applications.map((app) => ({
      ...app,
      name: app.candidateId
        ? `${app.candidateId.fullName.firstName} ${app.candidateId.fullName.lastName}`
        : "Unknown",
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("candidateId", "fullName")
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

// const editApplication = async (req, res) => {
//   try {
//     const { applicationId } = req.params;
//     const { status } = req.body;

//     if (!applicationId || !status)
//       return res.status(400).json({ message: "Application ID and status are required" });

//     const application = await Application.findByIdAndUpdate(
//       applicationId,
//       { status },
//       { new: true }
//     )
//       .populate("candidateId", "fullName email")
//       .populate("jobId", "title companyName");

//     if (!application) return res.status(404).json({ message: "Application not found" });

//     const candidateName = application.candidateId
//       ? `${application.candidateId.fullName.firstName} ${application.candidateId.fullName.lastName}`
//       : "Candidate";

//     const email = application.candidateId?.email;
//     const jobTitle = application.jobId?.title || "Unknown Role";
//     const companyName = application.jobId?.companyName || "Unknown Company";

//     const emailSubject = `📢 Status Update – ${jobTitle} at ${companyName}`;
//     const emailBody = `
//       <html>
//         <body style="font-family: Arial, sans-serif; padding: 20px;">
//           <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
//             <h2>Hello ${candidateName},</h2>
//             <p>Your job application status has been updated.</p>
//             <p><strong>Position:</strong> ${jobTitle}</p>
//             <p><strong>Company:</strong> ${companyName}</p>
//             <p><strong>New Status:</strong> <span style="color: #2980b9; font-weight: bold;">${status.toUpperCase()}</span></p>
//             <p>Log in to your account for more details.</p>
//             <p>Best regards,<br/>Job Portal Team</p>
//           </div>
//         </body>
//       </html>
//     `;

//     if (email) await sendEmail(email, emailSubject, emailBody);

//     res.json({ message: "Application updated successfully", application });
//   } catch (error) {
//     console.error("Error editing application:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const editApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!applicationId || !status)
      return res
        .status(400)
        .json({ message: "Application ID and status are required" });

    // Step 1: Find and update the application status
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate("candidateId", "fullName email");

    const applicationDetails = await Application.findById(applicationId);

    const candidateName = application.candidateId
      ? `${application.candidateId.fullName.firstName} ${application.candidateId.fullName.lastName}`
      : "Candidate";

    const email = application.candidateId?.email;

    // Step 2: Find the corresponding job using jobId from application
    const job = await Job.findById(application.jobId).populate(
      "company",
      "companyName"
    ); // Populate company to get companyName from the Company model

    if (!job) return res.status(404).json({ message: "Job not found" });

    const jobTitle = job.title;
    const companyName = applicationDetails.companyName || "Unknown Company";
    DateApplied = applicationDetails.dateApplied || "Unknown Date";
    const formattedDateApplied = new Date(DateApplied).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    // Define the dashboard URL (you can change this to your real dashboard link)
    const dashboardURL = "https://wokwantaim.com/dashboard";
    const unsubscribeURL = `${dashboardURL}/unsubscribe`;

    const emailSubject = `📢 Status Update – ${jobTitle} at ${companyName}`;
    const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 40px; background-color: #f4f4f4; text-align: center;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hello ${candidateName},</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            Your job application status has been updated.<br/><br/>
            <strong>Position:</strong> ${jobTitle}<br/>
            <strong>Company:</strong> ${companyName}<br/><br/>
            <strong>Date Applied:</strong> ${formattedDateApplied}<br/>
            <strong>Status Updated:</strong> <span style="color: #2980b9; font-weight: bold;">${status.toUpperCase()}</span><br/><br/>

            <p>You will be contacted by the employer for further steps.<br/>
            Log in to your account for more details.<br/><br/>
            Best regards,<br/>Job Portal Team
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            Need help? <a href="mailto:support@wokwantaim.com" style="color: #007bff; text-decoration: none;">Contact Support</a>
          </p>
        </div>
        <div>
          <p>If you no longer wish to receive these emails, <a href="${unsubscribeURL}">Unsubscribe here</a>.</p>
        </div>
      </div>
    `;

    // Send the email if a valid email address exists
    await sendEmail(email, emailSubject, emailBody);

    res.json({ message: "Application updated successfully", application });
  } catch (error) {
    console.error("Error editing application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const deleted = await Application.findByIdAndDelete(applicationId);

    if (!deleted)
      return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getAllApplications,
  editApplication,
  deleteApplication,
  getApplications,
};
