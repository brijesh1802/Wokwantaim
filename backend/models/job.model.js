const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', 
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobType', 
    required: true
  },
  experienceLevel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExperienceLevel',
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
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
