const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();
const { upload } = require('../middleware/upload');
const { getAllJobs, getJobById, getLimitedJobs, addJob, deleteJob, getAllJob } = require('../controllers/jobController');

router.get('/getAll',getAllJobs);
router.get('/getAllJob',authMiddleware,getAllJob);

router.get('/getJob/:id', getJobById);

router.get('/getsome', getLimitedJobs)

router.post('/addJob', addJob);

router.delete('/delete/:id', deleteJob);

module.exports = router;