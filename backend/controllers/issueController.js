/**
 * DevTrack - Issue Controller
 * CRUD Operations for Issues: List, View Single, Create, Update, Delete.
 */

const IssueModel = require('../models/issueModel');

/**
 * Get all issues (supports search, status, priority, category filters & sorting)
 * GET /api/issues
 */
async function getIssues(req, res, next) {
  try {
    const { search, status, priority, category, sortBy } = req.query;

    const issues = await IssueModel.getAll({
      search,
      status,
      priority,
      category,
      sortBy
    });

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single issue by ID
 * GET /api/issues/:id
 */
async function getIssueById(req, res, next) {
  try {
    const { id } = req.params;
    const issue = await IssueModel.findById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID #${id} was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      issue
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new issue
 * POST /api/issues
 */
async function createIssue(req, res, next) {
  try {
    const { title, description, status, priority, category, assignee_id } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Issue title is a required field.'
      });
    }

    // Reporter ID comes from JWT user payload
    const reporter_id = req.user.id;

    const issueId = await IssueModel.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Open',
      priority: priority || 'Medium',
      category: category || 'Bug',
      reporter_id,
      assignee_id: assignee_id || null
    });

    const newIssue = await IssueModel.findById(issueId);

    return res.status(201).json({
      success: true,
      message: 'New issue created successfully!',
      issue: newIssue
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update existing issue
 * PUT /api/issues/:id
 */
async function updateIssue(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, status, priority, category, assignee_id } = req.body;

    // Check existence
    const existingIssue = await IssueModel.findById(id);
    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID #${id} not found.`
      });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Issue title cannot be empty.'
      });
    }

    const updated = await IssueModel.update(id, {
      title: title.trim(),
      description: description !== undefined ? description.trim() : existingIssue.description,
      status: status || existingIssue.status,
      priority: priority || existingIssue.priority,
      category: category || existingIssue.category,
      assignee_id: assignee_id !== undefined ? assignee_id : existingIssue.assignee_id
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update issue.'
      });
    }

    const refreshedIssue = await IssueModel.findById(id);

    return res.status(200).json({
      success: true,
      message: `Issue #${id} updated successfully!`,
      issue: refreshedIssue
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete issue
 * DELETE /api/issues/:id
 */
async function deleteIssue(req, res, next) {
  try {
    const { id } = req.params;
    
    const existingIssue = await IssueModel.findById(id);
    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: `Issue with ID #${id} not found.`
      });
    }

    const deleted = await IssueModel.delete(id);
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete issue.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Issue #${id} was deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue
};
