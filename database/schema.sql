-- DevTrack Database Schema Script
-- Run this in MySQL Workbench or MySQL CLI to set up the database

CREATE DATABASE IF NOT EXISTS `devtrack_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `devtrack_db`;

-- Drop existing tables to allow clean initialization if needed
DROP TABLE IF EXISTS `issues`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Developer', 'Tester', 'Project Manager', 'Admin') NOT NULL DEFAULT 'Developer',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Issues Table
CREATE TABLE `issues` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `status` ENUM('Open', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Open',
  `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  `category` ENUM('Bug', 'Feature', 'Task', 'Improvement') NOT NULL DEFAULT 'Bug',
  `reporter_id` INT DEFAULT NULL,
  `assignee_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_issues_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_issues_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexes for optimized querying in issue filters & searches
CREATE INDEX `idx_issues_status` ON `issues` (`status`);
CREATE INDEX `idx_issues_priority` ON `issues` (`priority`);
CREATE INDEX `idx_issues_category` ON `issues` (`category`);
CREATE INDEX `idx_issues_assignee` ON `issues` (`assignee_id`);
