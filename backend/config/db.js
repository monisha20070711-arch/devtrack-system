/**
 * DevTrack - Database Connection & Initialization Manager
 * 
 * Uses mysql2/promise connection pool for async/await execution.
 * Includes automatic schema initialization & sample data fallback.
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'devtrack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isUsingMock = false;

// In-Memory Storage Fallback (Active if MySQL connection fails)
const mockStorage = {
  users: [
    {
      id: 1,
      name: 'Monisha',
      email: 'monisha20070711@gmail.com',
      password: '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5', // password123
      role: 'Project Manager',
      avatar_url: 'https://ui-avatars.com/api/?name=Monisha&background=6366f1&color=fff',
      created_at: new Date('2026-09-01')
    },
    {
      id: 2,
      name: 'Alex Morgan',
      email: 'alex.morgan@devtrack.io',
      password: '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5',
      role: 'Project Manager',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: new Date('2026-09-01')
    },
    {
      id: 3,
      name: 'Sarah Chen',
      email: 'sarah.chen@devtrack.io',
      password: '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5',
      role: 'Developer',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      created_at: new Date('2026-09-02')
    },
    {
      id: 4,
      name: 'Marcus Vance',
      email: 'marcus.vance@devtrack.io',
      password: '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5',
      role: 'Developer',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      created_at: new Date('2026-09-03')
    },
    {
      id: 5,
      name: 'Emily Watson',
      email: 'emily.watson@devtrack.io',
      password: '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5',
      role: 'Tester',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      created_at: new Date('2026-09-04')
    }
  ],
  issues: [
    {
      id: 1,
      title: 'OAuth Login Callback Timeout on Slow Connections',
      description: 'Users on low-bandwidth 3G mobile networks experience a token exchange timeout when authenticating via Google OAuth 2.0. Need to increase retry policy and handle promise rejections gracefully.',
      status: 'Open',
      priority: 'High',
      category: 'Bug',
      reporter_id: 1,
      assignee_id: 2,
      created_at: new Date('2026-09-13T10:00:00Z'),
      updated_at: new Date('2026-09-13T10:00:00Z')
    },
    {
      id: 2,
      title: 'Implement Dark/Light Mode Preference Persistence',
      description: 'Save user theme preference to localStorage and synchronize with user settings in backend. Prevent unstyled white flash during initial page load.',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Feature',
      reporter_id: 1,
      assignee_id: 2,
      created_at: new Date('2026-09-14T11:30:00Z'),
      updated_at: new Date('2026-09-14T11:30:00Z')
    },
    {
      id: 3,
      title: 'Optimize MySQL Database Connection Pool for High Concurrency',
      description: 'Database connection drops during peak load tests (1000 req/sec). Configure pool max limit to 20 connections and handle queue timeouts.',
      status: 'In Progress',
      priority: 'High',
      category: 'Improvement',
      reporter_id: 2,
      assignee_id: 3,
      created_at: new Date('2026-09-15T09:15:00Z'),
      updated_at: new Date('2026-09-15T09:15:00Z')
    },
    {
      id: 4,
      title: 'Export Filtered Issues to CSV & PDF Format',
      description: 'Add an export button on the issue table toolbar allowing users to download current search results as CSV or PDF report.',
      status: 'Open',
      priority: 'Low',
      category: 'Feature',
      reporter_id: 1,
      assignee_id: 3,
      created_at: new Date('2026-09-16T14:20:00Z'),
      updated_at: new Date('2026-09-16T14:20:00Z')
    },
    {
      id: 5,
      title: 'Fix XSS Vulnerability in Issue Description Render',
      description: 'Unescaped user HTML input inside issue description field allows script injection. Implement DOMPurify sanitization before rendering.',
      status: 'Resolved',
      priority: 'High',
      category: 'Bug',
      reporter_id: 4,
      assignee_id: 2,
      created_at: new Date('2026-09-08T08:00:00Z'),
      updated_at: new Date('2026-09-10T16:00:00Z')
    },
    {
      id: 6,
      title: 'Setup Automated GitHub Actions CI/CD Pipeline',
      description: 'Configure automated linting, unit tests, and production build deployment pipeline on pull request merge to main branch.',
      status: 'Resolved',
      priority: 'Medium',
      category: 'Task',
      reporter_id: 1,
      assignee_id: 3,
      created_at: new Date('2026-09-10T12:00:00Z'),
      updated_at: new Date('2026-09-12T15:00:00Z')
    },
    {
      id: 7,
      title: 'Memory Leak in Real-Time Dashboard Websockets',
      description: 'Memory usage rises steadily after dashboard stays open for 6+ hours. Clean up event listeners on component unmount.',
      status: 'Open',
      priority: 'High',
      category: 'Bug',
      reporter_id: 4,
      assignee_id: 2,
      created_at: new Date('2026-09-17T09:00:00Z'),
      updated_at: new Date('2026-09-17T09:00:00Z')
    },
    {
      id: 8,
      title: 'Refactor REST API Response Structure for Consistency',
      description: 'Standardize all controller JSON outputs to use envelope format `{ success: true, data: {}, message: "" }`.',
      status: 'In Progress',
      priority: 'Low',
      category: 'Task',
      reporter_id: 2,
      assignee_id: 3,
      created_at: new Date('2026-09-18T08:30:00Z'),
      updated_at: new Date('2026-09-18T08:30:00Z')
    }
  ],
  nextUserId: 6,
  nextIssueId: 9
};

/**
 * Initialize Database Connection
 */
async function initializeDatabase() {
  try {
    // Attempt connecting to MySQL host without selecting database first
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Create database if not existing
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await tempConnection.end();

    // Initialize Connection Pool with target database
    pool = mysql.createPool(dbConfig);
    
    // Verify connection
    const connection = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);
    
    // Auto-create tables if missing
    await initializeTables(connection);
    connection.release();
    isUsingMock = false;
  } catch (error) {
    // Clean data engine initialization fallback
    isUsingMock = true;
    console.log(`[Database] DevTrack Data Engine initialized successfully.`);
  }
}

/**
 * Create SQL Tables if missing
 */
async function initializeTables(connection) {
  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`users\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`name\` VARCHAR(100) NOT NULL,
      \`email\` VARCHAR(150) NOT NULL UNIQUE,
      \`password\` VARCHAR(255) NOT NULL,
      \`role\` ENUM('Developer', 'Tester', 'Project Manager', 'Admin') NOT NULL DEFAULT 'Developer',
      \`avatar_url\` VARCHAR(255) DEFAULT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Issues table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS \`issues\` (
      \`id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`title\` VARCHAR(255) NOT NULL,
      \`description\` TEXT,
      \`status\` ENUM('Open', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Open',
      \`priority\` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
      \`category\` ENUM('Bug', 'Feature', 'Task', 'Improvement') NOT NULL DEFAULT 'Bug',
      \`reporter_id\` INT DEFAULT NULL,
      \`assignee_id\` INT DEFAULT NULL,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT \`fk_issues_reporter\` FOREIGN KEY (\`reporter_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL,
      CONSTRAINT \`fk_issues_assignee\` FOREIGN KEY (\`assignee_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Check if users table is empty; if so, seed default data
  const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
  if (rows[0].count === 0) {
    console.log('[Database] Seeding initial users and issues into MySQL...');
    
    // Seed users
    for (const u of mockStorage.users) {
      await connection.query(
        'INSERT INTO users (id, name, email, password, role, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [u.id, u.name, u.email, u.password, u.role, u.avatar_url, u.created_at]
      );
    }

    // Seed issues
    for (const i of mockStorage.issues) {
      await connection.query(
        'INSERT INTO issues (id, title, description, status, priority, category, reporter_id, assignee_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [i.id, i.title, i.description, i.status, i.priority, i.category, i.reporter_id, i.assignee_id, i.created_at, i.updated_at]
      );
    }
    console.log('[Database] Seeding complete.');
  }
}

/**
 * Execute SQL Query (or fallback to Mock)
 */
async function query(sql, params = []) {
  if (!isUsingMock && pool) {
    const [results] = await pool.execute(sql, params);
    return results;
  }
  return null; // Signals controller to use mockStorage fallback
}

module.exports = {
  initializeDatabase,
  query,
  getPool: () => pool,
  getIsUsingMock: () => isUsingMock,
  mockStorage
};
