const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updatePassword, updateUsername } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Rute yang dilindungi
router.put('/updatepassword', protect, updatePassword);
router.put('/updateusername', protect, updateUsername); // <-- RUTE BARU

module.exports = router;