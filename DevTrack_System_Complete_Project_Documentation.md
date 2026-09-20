# DevTrack System – Complete Full-Stack Project Documentation

**Document Title**: DevTrack System – Complete Full-Stack Project Documentation  
**Developer**: Monisha  
**GitHub Repository**: [https://github.com/monisha20070711-arch/devtrack-system](https://github.com/monisha20070711-arch/devtrack-system)  
**Live Application**: [https://devtrack-system.onrender.com](https://devtrack-system.onrender.com)  

---

## 1. Project Overview

- **Project Name**: DevTrack System – Issue & Task Management System
- **Meaning of DevTrack**: Developer Task and Issue Tracker.
- **Application Overview**: A production-style SaaS issue and task tracking web application. It enables software engineering teams, project managers, and QA testers to log software defects, assign tasks to developers, update status transitions (Open, In Progress, Resolved), monitor priority levels (Low, Medium, High), and analyze workload distribution metrics through dynamic charts.
- **Target Users**: Software Engineers, QA Testers, Project Managers, Team Leads.
- **Real-World Use Case**: Centralized issue lifecycle management in agile software teams.

---

## 2. Problem Statement

"Software development teams frequently experience communication gaps, unassigned defects, and project delays due to informal bug reporting scattered across emails, chat channels, or unorganized spreadsheets. Modern software projects require a centralized, secure, and real-time issue tracking system to eliminate unassigned bug backlogs, streamline developer assignment, enforce status transition visibility, and provide metrics-driven dashboard analytics for engineering teams."

---

## 3. Proposed Solution

| Traditional Problem | DevTrack Solution |
| :--- | :--- |
| Scattered email/chat bug reports | Centralized issue database with unique issue IDs and metadata |
| Unclear task ownership | Explicit developer assignment linked to team user roster |
| Unknown bug resolution status | Strict Status badges (Open, In Progress, Resolved) |
| Difficulty prioritizing critical fixes | Priority tags (Low, Medium, High) with priority sorting |
| No workload metrics | Interactive Donut and Bar distribution charts powered by Chart.js |

---

## 4. Project Objectives

- Provide secure user authentication using bcrypt password hashing and JSON Web Tokens (JWT).
- Enable complete CRUD (Create, Read, Update, Delete) operations for issue management.
- Support real-time multi-criteria filtering (Status, Priority, Category) and live keyword search.
- Implement relational MySQL storage linking issues to reporters and assignees via SQL foreign keys.
- Deliver a responsive SaaS interface supporting Light/Dark themes and dynamic analytics charts.
- Deploy the full-stack system onto cloud infrastructure (Render) for public accessibility.

---

## 5. Project Scope

### Current Implemented Features
- User Registration, Login, Profile retrieval, and Logout.
- Issue Creation, Inline Editing, Detail Modal View, and Confirmation Delete.
- Developer Roster dropdown selection.
- Dashboard Stat Counters (Total, Open, In Progress, Resolved, High Priority).
- Visual Charts: Status Donut Chart & Priority Bar Chart.
- Light/Dark Mode toggle with local storage persistence.

### Future Enhancements (Ideas)
- Automated Email Notifications upon issue assignment.
- File upload attachments (e.g. bug screenshots).
- Threaded issue discussion comments.
- Role-based access control (RBAC) permissions.

---

## 6. Technology Stack

| Technology | Purpose | Where Used | Why Selected |
| :--- | :--- | :--- | :--- |
| **HTML5 & Vanilla CSS3** | Structure & Styling | Frontend (`index.html`, `style.css`) | Maximum performance and design control without framework overhead. |
| **Vanilla JS (ES6+)** | App Logic & DOM | Frontend (`app.js`, `issues.js`, `api.js`) | Demonstrates deep JavaScript fundamental skills (Async/Await, Fetch API). |
| **Node.js & Express.js** | Backend Server & REST API | Backend (`server.js`, `controllers/`) | Asynchronous I/O, lightweight middleware architecture, clean routing. |
| **MySQL & mysql2/promise** | Relational Database Storage | Database (`config/db.js`, `models/`) | Strict relational integrity, SQL JOINs, and connection pool optimization. |
| **JWT & bcryptjs** | Security & Auth | Middleware (`authMiddleware.js`) | Stateless token authentication and salted password hashing. |
| **Chart.js** | Visual Analytics Charts | Dashboard (`charts.js`) | Interactive Canvas rendering for Donut and Bar distribution charts. |
| **Render** | Cloud Hosting Platform | Deployment Target (`onrender.com`) | Seamless GitHub integration and production Node environment hosting. |

---

## 7. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER / CLIENT                           │
│  Single Page Application (HTML5 / Vanilla CSS3 / Vanilla JavaScript)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                        HTTP Fetch (JSON REST API)
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        EXPRESS.JS BACKEND SERVER                       │
│  CORS Middleware ➔ Auth Middleware (JWT) ➔ Express Routers             │
├────────────────────────────────────────────────────────────────────────┤
│  Controllers: authController, issueController, dashboardController     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Parameterized SQL Queries
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        MYSQL RELATIONAL DATABASE                       │
│  Connection Pool (mysql2/promise) ➔ `users` Table ↔ `issues` Table      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. REST API Documentation

| Method | Endpoint | Auth? | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | Registers a new user (Name, Email, Password, Role) |
| `POST` | `/api/auth/login` | No | Authenticates user and returns JWT token & profile |
| `GET` | `/api/auth/me` | Yes | Fetches profile of currently logged-in user |
| `GET` | `/api/users` | Yes | Lists all registered users for developer assignment |
| `GET` | `/api/issues` | Yes | Lists issues (Supports `?search=`, `?status=`, `?priority=`, `?category=`, `?sortBy=`) |
| `GET` | `/api/issues/:id` | Yes | Fetches detailed issue data with reporter & assignee JOINs |
| `POST` | `/api/issues` | Yes | Creates a new issue (Title, Description, Status, Priority, Category, Assignee) |
| `PUT` | `/api/issues/:id` | Yes | Updates existing issue fields |
| `DELETE` | `/api/issues/:id` | Yes | Deletes an issue permanently |
| `GET` | `/api/dashboard/stats` | Yes | Aggregates summary counts and chart distributions |

---

## 9. Database Design

```sql
-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('Developer', 'Tester', 'Project Manager', 'Admin') NOT NULL DEFAULT 'Developer',
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  CONSTRAINT `fk_issues_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_issues_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
);
```

---

## 10. Interview Project Pitch

### 30-Second Pitch
"DevTrack is a production-style full-stack issue and task management system built with Node.js, Express, MySQL, and Vanilla Web technologies. It allows engineering teams to track bug lifecycles, assign tasks to developers, monitor status transitions, and analyze workload distributions via interactive charts. It features JWT authentication, bcrypt encryption, and is deployed live on Render."

### 1-Minute Pitch
"I built DevTrack to solve problem visibility in software task management. The backend is built with Node.js and Express following an MVC pattern, serving a modern single-page Vanilla JS interface statically. Authentication uses bcrypt password hashing and JSON Web Tokens. Database queries interact with MySQL via a connection pool using SQL JOINs between issues and user rosters. I implemented live keyword search, status and priority filters, and visual analytics charts using Chart.js. The project is version-controlled on GitHub and deployed live on Render."

---

## 11. Live Project Verification URLs

- **Live Render Application**: [https://devtrack-system.onrender.com](https://devtrack-system.onrender.com)
- **GitHub Repository**: [https://github.com/monisha20070711-arch/devtrack-system](https://github.com/monisha20070711-arch/devtrack-system)
