const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const sauceCtrl = require('../controllers/sauce.controller');
const isOwner = require('../middlewares/isOwner');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.listSauces);
router.get('/:id', auth, sauceCtrl.getSauce);
router.delete('/:id', auth, isOwner, sauceCtrl.deleteSauce);
router.put('/:id', auth, isOwner, multer, sauceCtrl.updateSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;