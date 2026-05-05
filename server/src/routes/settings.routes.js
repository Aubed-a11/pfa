const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settings.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/public/promo', ctrl.getPublicPromo);   // public
router.get('/', verifyToken, isAdmin, ctrl.get);     // admin
router.post('/', verifyToken, isAdmin, ctrl.set);    // admin
module.exports = router;


