const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');
const { signup, login, profile, getAll, deleteAdmin, editAdmin, getAdmin, deleteCandidate, addCompany, deleteCompany, getCompanies, addIndustry, deleteIndustry, getIndustries, addJobType, deleteJobType, getJobTypes, addExperienceLevel, deleteExperienceLevel, getExperienceLevels } = require('../controllers/adminController');

//get All Admins
router.get('/getAll',authMiddleware, getAll);

//get Current Admin Profile
router.get('/profile', authMiddleware, profile);

//delete Admin
router.delete('/delete/:id', authMiddleware, deleteAdmin);

//edit Admin Details
router.put('/edit/:id', authMiddleware, editAdmin);

//get Admin Details
router.get('/getAdmin/:id', authMiddleware, getAdmin);

//Admin signup and login
router.post('/signup', signup);
router.post('/login', login);

//delete specific candidate
router.delete('/deleteCandidate/:id', authMiddleware, deleteCandidate);


//Company, Industry, JobType, ExperienceLevel
router.post('/addCompany', upload.fields([{ name: 'logo', maxCount: 1 }]),authMiddleware, addCompany);
router.delete('/deleteCompany/:id', authMiddleware, deleteCompany);
router.get('/getCompanies', getCompanies);

router.post('/addIndustry', authMiddleware, addIndustry);
router.delete('/deleteIndustry/:id', authMiddleware, deleteIndustry);
router.get('/getIndustries', getIndustries);

router.post('/addJobType', authMiddleware, addJobType);
router.delete('/deleteJobType/:id', authMiddleware, deleteJobType);
router.get('/getJobTypes', getJobTypes);

router.post('/addExperienceLevel', authMiddleware, addExperienceLevel);
router.delete('/deleteExperienceLevel/:id', authMiddleware, deleteExperienceLevel);
router.get('/getExperienceLevels', getExperienceLevels);


module.exports = router;
