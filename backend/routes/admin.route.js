const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { signup, login, profile, getAll, deleteAdmin, editAdmin, getAdmin } = require('../controllers/adminController');

router.get('/getAll',authMiddleware, getAll);
router.get('/profile', authMiddleware, profile);
router.delete('/delete/:id', authMiddleware, deleteAdmin);
router.put('/edit/:id', authMiddleware, editAdmin);
router.get('/getAdmin/:id', authMiddleware, getAdmin);
router.post('/signup', signup);
router.post('/login', login);


module.exports = router;
