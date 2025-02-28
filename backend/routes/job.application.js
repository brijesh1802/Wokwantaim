
// //apply+application

// const express = require('express');
// const router = express.Router();
// const { applyJob,getMyApplications } = require('../controllers/jobApplicationController');
// const authMiddleware = require('../middleware/authMiddleware'); // Ensure authentication

// // router.post('/apply/:id', authMiddleware, applyJob);
// router.route('/apply/:id')
//     .get(authMiddleware, applyJob)
//     .post(authMiddleware, applyJob);
// router.get('/myApplications', authMiddleware, getMyApplications);

// module.exports = router;



//apply+application

const express = require('express');
const router = express.Router();
const { applyJob,getMyApplications } = require('../controllers/jobApplicationController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure authentication

// router.post('/apply/:id', authMiddleware, applyJob);
router.route('/apply/:id')
    .get(authMiddleware, applyJob)
    .post(authMiddleware, applyJob);
router.get('/myApplications', authMiddleware, getMyApplications);

module.exports = router;










