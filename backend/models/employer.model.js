const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    joinType:{
        type: String,
        required: true,
        enum: ['company', 'recruiter', 'agency']
    },
    verificationToken:{
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetToken: { 
        type: String, 
        default: null 
    },
    resetTokenExpiry: { 
        type: Date, 
        default: null 
    },
    lastResetRequest: { 
        type: Date, 
        default: null 
    },
}, {
    timestamps: true
});

const Employer = mongoose.model('employers', employerSchema);

module.exports = Employer;