const express = require('express')
const router = express.Router();
const problemController = require('../controllers/problem.controller');
const  combinedAuthMiddleware  = require('../middlewares/auth.middleware');

router.post('/create-problem', combinedAuthMiddleware, problemController.createProblem)
router.post('/get-all-problems', combinedAuthMiddleware, problemController.getAllProblems)
router.get('/get-all-problems2', combinedAuthMiddleware, problemController.getAllProblems2)
router.post('/update', combinedAuthMiddleware, problemController.updateProblem)
router.get('/leaderboard', problemController.displayLeaderBoard)
router.post('/get', problemController.getAIAnswer)

module.exports = router;