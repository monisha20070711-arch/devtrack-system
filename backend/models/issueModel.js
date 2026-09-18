/**
 * DevTrack - Issue Model
 * Data access layer for MySQL issue operations with SQL JOINs, filtering, search & stats queries.
 */

const db = require('../config/db');

class IssueModel {
  /**
   * Get all issues with optional filtering, search, and sorting
   */
  static async getAll({ search, status, priority, category, sortBy = 'newest' }) {
    if (!db.getIsUsingMock()) {
      let sql = `
        SELECT 
          i.id, i.title, i.description, i.status, i.priority, i.category,
          i.reporter_id, i.assignee_id, i.created_at, i.updated_at,
          r.name as reporter_name, r.email as reporter_email,
          a.name as assignee_name, a.email as assignee_email, a.avatar_url as assignee_avatar, a.role as assignee_role
        FROM issues i
        LEFT JOIN users r ON i.reporter_id = r.id
        LEFT JOIN users a ON i.assignee_id = a.id
        WHERE 1=1
      `;

      const params = [];

      if (status && status !== 'All') {
        sql += ` AND i.status = ?`;
        params.push(status);
      }

      if (priority && priority !== 'All') {
        sql += ` AND i.priority = ?`;
        params.push(priority);
      }

      if (category && category !== 'All') {
        sql += ` AND i.category = ?`;
        params.push(category);
      }

      if (search && search.trim() !== '') {
        sql += ` AND (i.title LIKE ? OR i.description LIKE ?)`;
        const searchTerm = `%${search.trim()}%`;
        params.push(searchTerm, searchTerm);
      }

      // Ordering
      if (sortBy === 'oldest') {
        sql += ` ORDER BY i.created_at ASC`;
      } else if (sortBy === 'priority_high') {
        sql += ` ORDER BY FIELD(i.priority, 'High', 'Medium', 'Low'), i.created_at DESC`;
      } else if (sortBy === 'title') {
        sql += ` ORDER BY i.title ASC`;
      } else {
        sql += ` ORDER BY i.created_at DESC`; // Default 'newest'
      }

      return await db.query(sql, params);
    }

    // Mock storage fallback
    let list = db.mockStorage.issues.map(issue => {
      const reporter = db.mockStorage.users.find(u => u.id === issue.reporter_id);
      const assignee = db.mockStorage.users.find(u => u.id === issue.assignee_id);
      return {
        ...issue,
        reporter_name: reporter ? reporter.name : 'Unknown',
        reporter_email: reporter ? reporter.email : '',
        assignee_name: assignee ? assignee.name : 'Unassigned',
        assignee_email: assignee ? assignee.email : '',
        assignee_avatar: assignee ? assignee.avatar_url : null,
        assignee_role: assignee ? assignee.role : ''
      };
    });

    if (status && status !== 'All') {
      list = list.filter(i => i.status === status);
    }
    if (priority && priority !== 'All') {
      list = list.filter(i => i.priority === priority);
    }
    if (category && category !== 'All') {
      list = list.filter(i => i.category === category);
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }

    if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'priority_high') {
      const map = { High: 3, Medium: 2, Low: 1 };
      list.sort((a, b) => map[b.priority] - map[a.priority]);
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return list;
  }

  /**
   * Find issue by ID with user JOINs
   */
  static async findById(id) {
    const numericId = parseInt(id, 10);
    if (!db.getIsUsingMock()) {
      const sql = `
        SELECT 
          i.id, i.title, i.description, i.status, i.priority, i.category,
          i.reporter_id, i.assignee_id, i.created_at, i.updated_at,
          r.name as reporter_name, r.email as reporter_email,
          a.name as assignee_name, a.email as assignee_email, a.avatar_url as assignee_avatar, a.role as assignee_role
        FROM issues i
        LEFT JOIN users r ON i.reporter_id = r.id
        LEFT JOIN users a ON i.assignee_id = a.id
        WHERE i.id = ?
      `;
      const rows = await db.query(sql, [numericId]);
      return rows && rows.length > 0 ? rows[0] : null;
    }

    // Mock fallback
    const issue = db.mockStorage.issues.find(i => i.id === numericId);
    if (!issue) return null;

    const reporter = db.mockStorage.users.find(u => u.id === issue.reporter_id);
    const assignee = db.mockStorage.users.find(u => u.id === issue.assignee_id);
    return {
      ...issue,
      reporter_name: reporter ? reporter.name : 'Unknown',
      reporter_email: reporter ? reporter.email : '',
      assignee_name: assignee ? assignee.name : 'Unassigned',
      assignee_email: assignee ? assignee.email : '',
      assignee_avatar: assignee ? assignee.avatar_url : null,
      assignee_role: assignee ? assignee.role : ''
    };
  }

  /**
   * Create new Issue
   */
  static async create({ title, description, status = 'Open', priority = 'Medium', category = 'Bug', reporter_id, assignee_id }) {
    if (!db.getIsUsingMock()) {
      const sql = `
        INSERT INTO issues (title, description, status, priority, category, reporter_id, assignee_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await db.query(sql, [title, description, status, priority, category, reporter_id || null, assignee_id || null]);
      return result.insertId;
    }

    // Mock storage fallback
    const newId = db.mockStorage.nextIssueId++;
    const newIssue = {
      id: newId,
      title,
      description,
      status,
      priority,
      category,
      reporter_id: reporter_id ? parseInt(reporter_id, 10) : null,
      assignee_id: assignee_id ? parseInt(assignee_id, 10) : null,
      created_at: new Date(),
      updated_at: new Date()
    };
    db.mockStorage.issues.unshift(newIssue);
    return newId;
  }

  /**
   * Update Issue
   */
  static async update(id, { title, description, status, priority, category, assignee_id }) {
    const numericId = parseInt(id, 10);
    if (!db.getIsUsingMock()) {
      const sql = `
        UPDATE issues 
        SET title = ?, description = ?, status = ?, priority = ?, category = ?, assignee_id = ?
        WHERE id = ?
      `;
      const result = await db.query(sql, [title, description, status, priority, category, assignee_id || null, numericId]);
      return result.affectedRows > 0;
    }

    // Mock storage fallback
    const index = db.mockStorage.issues.findIndex(i => i.id === numericId);
    if (index === -1) return false;

    db.mockStorage.issues[index] = {
      ...db.mockStorage.issues[index],
      title,
      description,
      status,
      priority,
      category,
      assignee_id: assignee_id ? parseInt(assignee_id, 10) : null,
      updated_at: new Date()
    };
    return true;
  }

  /**
   * Delete Issue
   */
  static async delete(id) {
    const numericId = parseInt(id, 10);
    if (!db.getIsUsingMock()) {
      const sql = 'DELETE FROM issues WHERE id = ?';
      const result = await db.query(sql, [numericId]);
      return result.affectedRows > 0;
    }

    // Mock storage fallback
    const initialLength = db.mockStorage.issues.length;
    db.mockStorage.issues = db.mockStorage.issues.filter(i => i.id !== numericId);
    return db.mockStorage.issues.length < initialLength;
  }

  /**
   * Get Dashboard Metrics (Counts & Distributions)
   */
  static async getDashboardStats() {
    if (!db.getIsUsingMock()) {
      // Direct SQL aggregate queries
      const [totalRow] = await db.query('SELECT COUNT(*) as count FROM issues');
      const [openRow] = await db.query("SELECT COUNT(*) as count FROM issues WHERE status = 'Open'");
      const [inProgressRow] = await db.query("SELECT COUNT(*) as count FROM issues WHERE status = 'In Progress'");
      const [resolvedRow] = await db.query("SELECT COUNT(*) as count FROM issues WHERE status = 'Resolved'");
      const [highPriorityRow] = await db.query("SELECT COUNT(*) as count FROM issues WHERE priority = 'High'");

      // Distributions
      const statusDist = await db.query(`
        SELECT status, COUNT(*) as count 
        FROM issues 
        GROUP BY status
      `);

      const priorityDist = await db.query(`
        SELECT priority, COUNT(*) as count 
        FROM issues 
        GROUP BY priority
      `);

      // Recent 5 issues
      const recentIssues = await IssueModel.getAll({ sortBy: 'newest' });

      return {
        summary: {
          total: totalRow ? totalRow.count : 0,
          open: openRow ? openRow.count : 0,
          inProgress: inProgressRow ? inProgressRow.count : 0,
          resolved: resolvedRow ? resolvedRow.count : 0,
          highPriority: highPriorityRow ? highPriorityRow.count : 0
        },
        statusDistribution: statusDist,
        priorityDistribution: priorityDist,
        recentIssues: recentIssues.slice(0, 5)
      };
    }

    // Mock storage calculation
    const all = db.mockStorage.issues;
    const summary = {
      total: all.length,
      open: all.filter(i => i.status === 'Open').length,
      inProgress: all.filter(i => i.status === 'In Progress').length,
      resolved: all.filter(i => i.status === 'Resolved').length,
      highPriority: all.filter(i => i.priority === 'High').length
    };

    const statusMap = { Open: 0, 'In Progress': 0, Resolved: 0 };
    all.forEach(i => { statusMap[i.status] = (statusMap[i.status] || 0) + 1; });
    const statusDistribution = Object.keys(statusMap).map(k => ({ status: k, count: statusMap[k] }));

    const priorityMap = { High: 0, Medium: 0, Low: 0 };
    all.forEach(i => { priorityMap[i.priority] = (priorityMap[i.priority] || 0) + 1; });
    const priorityDistribution = Object.keys(priorityMap).map(k => ({ priority: k, count: priorityMap[k] }));

    const recentIssues = await IssueModel.getAll({ sortBy: 'newest' });

    return {
      summary,
      statusDistribution,
      priorityDistribution,
      recentIssues: recentIssues.slice(0, 5)
    };
  }
}

module.exports = IssueModel;
