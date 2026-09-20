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

/**
 * Add a new developer / team member by name
 * POST /api/users
 */
async function createUser(req, res, next) {
  try {
    const { name, email, role } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Developer name is required.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = (email && email.trim() !== '') 
      ? email.trim().toLowerCase() 
      : `${cleanName.toLowerCase().replace(/\s+/g, '.')}@devtrack.io`;

    // Check existing email
    const existing = await UserModel.findByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `User with email '${cleanEmail}' already exists.`
      });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const userId = await UserModel.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'Developer',
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=6366f1&color=fff`
    });

    const newUser = await UserModel.findById(userId);

    return res.status(201).json({
      success: true,
      message: `Team member '${cleanName}' added successfully!`,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  createUser
};
