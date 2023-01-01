const express = require('express');
const limiter = require('../middlewares/rate-limit');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');



router.post('/signup', userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;