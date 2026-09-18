/**
 * DevTrack - User Model
 * Data access layer for MySQL user operations.
 */

const db = require('../config/db');

class UserModel {
  /**
   * Find user by Email
   */
  static async findByEmail(email) {
    if (!db.getIsUsingMock()) {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const rows = await db.query(sql, [email]);
      return rows && rows.length > 0 ? rows[0] : null;
    }

    // Mock storage fallback
    const user = db.mockStorage.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const numericId = parseInt(id, 10);
    if (!db.getIsUsingMock()) {
      const sql = 'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?';
      const rows = await db.query(sql, [numericId]);
      return rows && rows.length > 0 ? rows[0] : null;
    }

    // Mock storage fallback
    const user = db.mockStorage.users.find(u => u.id === numericId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Create new User
   */
  static async create({ name, email, password, role = 'Developer', avatar_url = null }) {
    if (!db.getIsUsingMock()) {
      const sql = `
        INSERT INTO users (name, email, password, role, avatar_url)
        VALUES (?, ?, ?, ?, ?)
      `;
      const result = await db.query(sql, [name, email, password, role, avatar_url]);
      return result.insertId;
    }

    // Mock storage fallback
    const newId = db.mockStorage.nextUserId++;
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role,
      avatar_url: avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      created_at: new Date()
    };
    db.mockStorage.users.push(newUser);
    return newId;
  }

  /**
   * Get all Users (for Developer dropdown select)
   */
  static async getAll() {
    if (!db.getIsUsingMock()) {
      const sql = 'SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY name ASC';
      return await db.query(sql);
    }

    // Mock storage fallback
    return db.mockStorage.users.map(({ password, ...rest }) => rest);
  }
}

module.exports = UserModel;
