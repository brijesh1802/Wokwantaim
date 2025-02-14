const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String, 
    required: true,
    index: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String
  }],
  salary: {
    type: Number,
    required: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid-level', 'Senior', 'Lead', 'Executive'],
    required: true
  },
  skills: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'filled'],
    default: 'active'
  },
  industry: {
    type: String,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  applicationPostedDate: {
    type: Date,
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
