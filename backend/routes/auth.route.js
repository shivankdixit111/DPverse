const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller');
const  authMiddleware  = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema } = require('../validators/auth.validator'); 

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// ✅ Firebase login → returns JWT
router.post('/google-login', authController.googleLogin);

// 🔒 Protected routes → ONLY JWT
router.get('/get-profile', authMiddleware, authController.getProfile);

router.post('/make-payment', authController.makePayment);
router.post('/payment/verify', authController.verifyPayment);
router.post('/update-token', authController.updateToken);

module.exports = router;