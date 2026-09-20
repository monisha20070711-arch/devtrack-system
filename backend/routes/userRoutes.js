/**
 * DevTrack - User Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, userController.getUsers);
router.post('/', authenticateToken, userController.createUser);

module.exports = router;
