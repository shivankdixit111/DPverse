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

module.exports = router;