const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    description: String,
    isCurrentRole: {
        type: Boolean,
        default: false
    }
});

const educationSchema = new Schema({
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    grade: String
});

const certificationSchema = new Schema({
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
});

const candidateProfileSchema = new Schema({
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'candidates',
        required: true,
        unique: true
    },
    aboutMe: {
        type: String,
        default: null
    },
    experience: {
        type: [experienceSchema],
        default: []
    },
    education: {
        type: [educationSchema],
        default: []
    },
    socialLinks: {
        github: {
            type: String,
            default: null,
            validate: {
                validator: function(v) {
                    return v === null || /^https:\/\/github\.com\//.test(v);
                },
                message: 'Must be a valid GitHub URL'
            }
        },
        linkedin: {
            type: String,
            default: null,
            validate: {
                validator: function(v) {
                    return v === null || /^https:\/\/[a-z]{2,}\.linkedin\.com\//.test(v);
                },
                message: 'Must be a valid LinkedIn URL'
            }
        }
    },
    certifications: {
        type: [certificationSchema],
        default: []
    },
    skills: {
        type: [{
            name: String,
            level: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
            }
        }],
        default: []
    },
    completionStatus: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


const CandidateProfile = mongoose.model('candidate_profiles', candidateProfileSchema);

module.exports = CandidateProfile;