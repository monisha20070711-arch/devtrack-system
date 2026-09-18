/**
 * DevTrack - Issue Routes
 */

const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken); // Protect all issue routes with JWT auth

router.get('/', issueController.getIssues);
router.get('/:id', issueController.getIssueById);
router.post('/', issueController.createIssue);
router.put('/:id', issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);

module.exports = router;
