const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller');
const  combinedAuthMiddleware  = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema } = require('../validators/auth.validator');

router.post('/signup', validate(signupSchema), authController.signup)
router.post('/login', validate(loginSchema), authController.login)
router.post('/google-login', authController.googleLogin) 
router.get('/get-profile', combinedAuthMiddleware, authController.getProfile)
router.post('/make-payment',  authController.makePayment)
router.post('/payment/verfiy',  authController.verifyPayment)
router.post('/update-token',  authController.updateToken)

module.exports = router;