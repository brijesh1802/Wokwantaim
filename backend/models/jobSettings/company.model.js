const mongoose = require('mongoose');
const Job = require('../job.model');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    logo: {
        type: String,
    },
});

companySchema.pre('findOneAndDelete', async function (next) {
    const company = await this.model.findOne(this.getQuery()); 
    if (company) {
        const result = await Job.deleteMany({ company: company._id });
        console.log(`${result.deletedCount} job(s) deleted.`);
    }
    next();
});


const Company = mongoose.model('Company', companySchema);

module.exports = Company;
