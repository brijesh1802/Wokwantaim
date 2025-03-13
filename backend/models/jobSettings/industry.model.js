const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Industry = mongoose.model('Industry', industrySchema);

module.exports = Industry;
