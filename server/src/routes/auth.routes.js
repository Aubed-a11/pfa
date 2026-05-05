// auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/admin/login', auth.adminLogin);
router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);
router.get('/me', verifyToken, auth.getMe);
router.put('/profile', verifyToken, auth.updateProfile);

module.exports = router;


