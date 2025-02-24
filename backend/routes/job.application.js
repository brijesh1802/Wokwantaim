const express = require('express');
const router = express.Router();
const { applyJob } = require('../controllers/jobApplicationController');

router.post('/apply/:id', applyJob);

module.exports = router;
