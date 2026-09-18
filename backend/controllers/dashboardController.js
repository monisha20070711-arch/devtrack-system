/**
 * DevTrack - Dashboard Controller
 * Aggregates summary statistics, status/priority distributions, and recent metrics.
 */

const IssueModel = require('../models/issueModel');

/**
 * Get dashboard stats
 * GET /api/dashboard/stats
 */
async function getDashboardStats(req, res, next) {
  try {
    const stats = await IssueModel.getDashboardStats();
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats
};
