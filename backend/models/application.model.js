const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    skillsMatching: [
        {
            type: String, 
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'interview', 'accepted', 'rejected'],
        default: 'pending' 
    },
    dateApplied: {
        type: Date,
        default: Date.now, 
    }
}, {
    timestamps: true 
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
