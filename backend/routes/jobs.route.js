const express = require('express');
const router = express.Router();
const Job = require('../models/job.model');

router.get('/getAll', async (req, res) => {
    try{
        const jobs = await Job.find();
        res.json(jobs);
    }
    catch(err){
        res.status(400).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        res.status(400).json(err);
    }
});


module.exports = router;