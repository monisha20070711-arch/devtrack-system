/**
 * DevTrack - User Controller
 * Handles user management and team roster listing.
 */

const UserModel = require('../models/userModel');

/**
 * Get all registered users (for developer assignment dropdowns)
 * GET /api/users
 */
async function getUsers(req, res, next) {
  try {
    const users = await UserModel.getAll();
    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers
};
