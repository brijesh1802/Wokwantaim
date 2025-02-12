const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, getLimitedJobs } = require('../controllers/jobController');

router.get('/getAll', getAllJobs);

router.get('/:id', getJobById);

router.get('/getsome', getLimitedJobs)

module.exports = router;