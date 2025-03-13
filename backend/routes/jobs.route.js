const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { getAllJobs, getJobById, getLimitedJobs, addJob, deleteJob } = require('../controllers/jobController');

router.get('/getAll', getAllJobs);

router.get('/getJob/:id', getJobById);

router.get('/getsome', getLimitedJobs)

router.post('/addJob', addJob);

router.delete('/delete/:id', deleteJob);

module.exports = router;