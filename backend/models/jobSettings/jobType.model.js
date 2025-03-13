const mongoose = require('mongoose');

const jobTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const JobType = mongoose.model('JobType', jobTypeSchema);

module.exports = JobType;
