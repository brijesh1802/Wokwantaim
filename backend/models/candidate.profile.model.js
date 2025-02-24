const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/;

const candidateProfileSchema = new Schema({
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'candidates',
        required: true
    },
    about : {
        type: String,
        default: 'Hello there'

    },
    education: [
        {
            degree: {
                type: String,
                required: true
            },
            institution: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date
            },
            grade: {
                type: String
            },
            description: {
                type: String
            }
        }
    ],
    workExperience: [
        {
            jobTitle: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            industry: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date
            },
            isCurrentJob: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    skills: [
        {
            type: String,
            required: true
        }
    ],
    certifications: [
        {
            title: {
                type: String,
                required: true
            },
            issuingOrganization: {
                type: String,
                required: true
            },
            issueDate: {
                type: Date,
                required: true
            },
            expirationDate: {
                type: Date
            },
            credentialId: {
                type: String
            },
            credentialURL: {
                type: String,
                match: urlPattern
            }
        }
    ],
    personalProjects: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            technologiesUsed: [
                {
                    type: String
                }
            ],
            projectURL: {
                type: String,
                match: urlPattern
            },
            githubRepo: {
                type: String,
                match: urlPattern
            }
        }
    ],
    socialLinks: {
        linkedin: {
            type: String,
            match: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/ 
        },
        github: {
            type: String,
            match: /^(https?:\/\/)?(www\.)?github\.com\/.*$/ 
        },
        portfolio: {
            type: String,
            match: urlPattern 
        },
        other: {
            type: String,
            match: urlPattern 
        }
    }
}, {
    timestamps: true
});

const CandidateProfile = mongoose.model('candidateProfiles', candidateProfileSchema);

module.exports = CandidateProfile;
