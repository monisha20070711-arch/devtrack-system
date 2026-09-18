-- DevTrack Database Seed Script
-- Realistic sample users and issues for demonstration & interview presentation

USE `devtrack_db`;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `issues`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Sample Users
-- Password for all seed users is: password123 (hashed using bcrypt cost factor 10)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar_url`) VALUES
(1, 'Monisha', 'monisha20070711@gmail.com', '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5', 'Project Manager', 'https://ui-avatars.com/api/?name=Monisha&background=6366f1&color=fff'),
(2, 'Alex Morgan', 'alex.morgan@devtrack.io', '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5', 'Project Manager', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(3, 'Sarah Chen', 'sarah.chen@devtrack.io', '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5', 'Developer', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
(4, 'Marcus Vance', 'marcus.vance@devtrack.io', '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5', 'Developer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(5, 'Emily Watson', 'emily.watson@devtrack.io', '$2a$10$wT4nZ3L9d.v2RzB5z6m4.e3U7kF9W0x.6z8QGv1r1X3S1Y2Z3A4B5', 'Tester', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');

-- 2. Insert Sample Issues
INSERT INTO `issues` (`id`, `title`, `description`, `status`, `priority`, `category`, `reporter_id`, `assignee_id`, `created_at`) VALUES
(1, 'OAuth Login Callback Timeout on Slow Connections', 'Users on low-bandwidth 3G mobile networks experience a token exchange timeout when authenticating via Google OAuth 2.0. Need to increase retry policy and handle promise rejections gracefully.', 'Open', 'High', 'Bug', 1, 2, DATE_SUB(NOW(), INTERVAL 5 DAY)),

(2, 'Implement Dark/Light Mode Preference Persistence', 'Save user theme preference to localStorage and synchronize with user settings in backend. Prevent unstyled white flash during initial page load.', 'In Progress', 'Medium', 'Feature', 1, 2, DATE_SUB(NOW(), INTERVAL 4 DAY)),

(3, 'Optimize MySQL Database Connection Pool for High Concurrency', 'Database connection drops during peak load tests (1000 req/sec). Configure pool max limit to 20 connections and handle queue timeouts.', 'In Progress', 'High', 'Improvement', 2, 3, DATE_SUB(NOW(), INTERVAL 3 DAY)),

(4, 'Export Filtered Issues to CSV & PDF Format', 'Add an export button on the issue table toolbar allowing users to download current search results as CSV or PDF report.', 'Open', 'Low', 'Feature', 1, 3, DATE_SUB(NOW(), INTERVAL 2 DAY)),

(5, 'Fix XSS Vulnerability in Issue Description Render', 'Unescaped user HTML input inside issue description field allows script injection. Implement DOMPurify sanitization before rendering.', 'Resolved', 'High', 'Bug', 4, 2, DATE_SUB(NOW(), INTERVAL 10 DAY)),

(6, 'Setup Automated GitHub Actions CI/CD Pipeline', 'Configure automated linting, unit tests, and production build deployment pipeline on pull request merge to main branch.', 'Resolved', 'Medium', 'Task', 1, 3, DATE_SUB(NOW(), INTERVAL 8 DAY)),

(7, 'Memory Leak in Real-Time Dashboard Websockets', 'Memory usage rises steadily after dashboard stays open for 6+ hours. Clean up event listeners on component unmount.', 'Open', 'High', 'Bug', 4, 2, DATE_SUB(NOW(), INTERVAL 1 DAY)),

(8, 'Refactor REST API Response Structure for Consistency', 'Standardize all controller JSON outputs to use envelope format `{ success: true, data: {}, message: "" }`.', 'In Progress', 'Low', 'Task', 2, 3, NOW());
