# DevTrack System – Official Project Documentation

**Project Name**: DevTrack System – Issue & Task Management System  
**Student Name**: Monisha  
**Degree / Course**: B.Sc Information Technology (B.Sc IT)  
**Project Purpose**: Full-Stack SaaS Task & Defect Lifecycle Management Suite  
**Technology Stack**: Node.js, Express.js, MySQL, Vanilla JavaScript, HTML5, CSS3, Chart.js  
**GitHub Repository**: [https://github.com/monisha20070711-arch/devtrack-system](https://github.com/monisha20070711-arch/devtrack-system)  
**Live Web Application**: [https://devtrack-system.onrender.com](https://devtrack-system.onrender.com)  

---

## 2. Abstract

**DevTrack System** is a production-grade full-stack issue and task management web application designed for modern software development environments. Software projects frequently suffer from fragmented bug reports, unassigned defects, and lack of status visibility when managed over informal communications or spreadsheets. DevTrack addresses this problem by providing a secure, centralized web application where team members can log issues, assign tasks to registered developers, update task resolution statuses (Open, In Progress, Resolved), evaluate priority levels (Low, Medium, High), search and filter issues in real time, and view workload metrics through interactive visual charts.

The application is built using a clean 3-tier Model-View-Controller (MVC) architecture. The client interface is a single-page Vanilla HTML5/CSS3/JavaScript application featuring custom glassmorphic styling, persistent Light/Dark themes, and Chart.js analytics. The backend server is implemented in Node.js and Express.js, providing stateless JSON Web Token (JWT) authentication, bcrypt password hashing, input validation, and REST API endpoints. Data is stored in a relational MySQL database utilizing parameterized queries and SQL JOINs between issues and user rosters. The system is version-controlled on GitHub and deployed live on Render cloud infrastructure.

---

## 4. Problem Statement

> **Official Problem Statement**:  
> "Software engineering teams frequently encounter communication delays, unassigned defect backlogs, and lost issue history when managing bugs across informal chat channels, emails, or spreadsheets. Modern software development requires a centralized, secure, and real-time issue management system to streamline developer assignment, enforce status transition visibility (Open, In Progress, Resolved), and deliver real-time visual analytics for project managers."

---

## 7. Proposed System (DevTrack Solution)

| Manual System Limitations | DevTrack System Solution |
| :--- | :--- |
| Scattered email/chat bug reports | Centralized MySQL database storage with unique issue IDs |
| Unassigned bug responsibilities | Explicit developer assignment linked to team user roster |
| Unknown resolution progress | Strict Status badges (Open, In Progress, Resolved) |
| Difficulty finding specific defects | Instant debounced keyword search and multi-select filters |
| No team metrics or charts | Interactive Donut and Bar analytics charts powered by Chart.js |

---

## 10. Technology Stack

| Layer / Component | Technology Used | Purpose & Where Used |
| :--- | :--- | :--- |
| **Frontend UI** | HTML5 & Vanilla CSS3 | Single Page Application structure and SaaS glassmorphic design system (`index.html`, `style.css`). |
| **Frontend Logic** | Vanilla JS (ES6+) | DOM manipulation, event listeners, dynamic API requests (`app.js`, `issues.js`, `api.js`). |
| **Backend Runtime** | Node.js & Express.js | Asynchronous web server, middleware pipeline, and REST API routing (`server.js`, `controllers/`). |
| **Database** | MySQL & `mysql2/promise` | Relational storage, connection pool management, and SQL JOIN queries (`config/db.js`, `models/`). |
| **Authentication** | JWT & `bcryptjs` | Stateless Bearer token authorization and salted password hashing (`authMiddleware.js`). |
| **Charts & Graphics** | Chart.js CDN | Donut and Bar canvas charts for dashboard metrics (`charts.js`). |
| **Deployment Platform** | Render Cloud Web Service | Linux container hosting for live public application (`devtrack-system.onrender.com`). |
| **Version Control** | Git & GitHub | Source code versioning (`github.com/monisha20070711-arch/devtrack-system`). |

---

## 11. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 1: PRESENTATION LAYER                      │
│     Single Page Client (HTML5 / Vanilla CSS3 / Vanilla JavaScript)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Fetch JSON (JWT Bearer Header)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        TIER 2: APPLICATION LAYER                       │
│     Express Server ➔ CORS & JSON Parsers ➔ JWT Auth Middleware         │
│     Express Routers ➔ Controllers (Auth, Issue, User, Dashboard)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized SQL Queries (mysql2)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        TIER 3: DATABASE LAYER                          │
│     MySQL Database Pool ➔ `users` Table ↔ `issues` Table (Foreign Keys)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 16. REST API Documentation

| Method | Endpoint | Auth? | Request Data | Response Payload |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | No | `{ name, email, password, role }` | HTTP 201: `{ success, token, user }` |
| `POST` | `/api/auth/login` | No | `{ email, password }` | HTTP 200: `{ success, token, user }` |
| `GET` | `/api/auth/me` | Yes | Header: Bearer Token | HTTP 200: `{ success, user }` |
| `GET` | `/api/users` | Yes | Header: Bearer Token | HTTP 200: `{ success, count, users }` |
| `GET` | `/api/issues` | Yes | Query Params: search, status, priority, category, sortBy | HTTP 200: `{ success, count, issues }` |
| `GET` | `/api/issues/:id` | Yes | Header: Bearer Token | HTTP 200: `{ success, issue }` |
| `POST` | `/api/issues` | Yes | `{ title, description, status, priority, category, assignee_id }` | HTTP 201: `{ success, message, issue }` |
| `PUT` | `/api/issues/:id` | Yes | `{ title, description, status, priority, category, assignee_id }` | HTTP 200: `{ success, message, issue }` |
| `DELETE` | `/api/issues/:id` | Yes | Header: Bearer Token | HTTP 200: `{ success, message }` |
| `GET` | `/api/dashboard/stats` | Yes | Header: Bearer Token | HTTP 200: `{ success, data: { summary, statusDist, priorityDist, recent } }` |

---

## 17. Database Design

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

## 35. Project Summary for Resume

- Developed and deployed a full-stack SaaS Issue & Task Management System using Node.js, Express, MySQL, and Vanilla JavaScript with JWT authentication and bcrypt encryption.
- Engineered a 3-tier MVC architecture with parameterized SQL queries, connection pooling, and double LEFT JOINs for developer team assignment tracking.
- Built a responsive SPA interface featuring Chart.js status/priority charts, real-time debounced keyword search, multi-criteria filters, and persistent Light/Dark themes; hosted live on Render.

---

## 36. 2-Minute Interview Spoken Explanation

*"DevTrack is a production-style full-stack issue and task management system built with Node.js, Express, MySQL, and Vanilla Web technologies. In software projects, tracking bugs across informal chats or spreadsheets leads to unassigned defects and missed deadlines. DevTrack solves this by providing a centralized web dashboard where issues are created, assigned to team developers, and tracked through statuses—Open, In Progress, and Resolved.*

*Technically, I selected Node.js and Express for the REST API and Vanilla JavaScript for the client interface to ensure fast load times without framework overhead. For security, I implemented bcrypt password hashing and JSON Web Tokens for stateless authorization. On the database side, I designed a relational MySQL schema with foreign keys linking tasks to team members, using SQL JOINs to fetch reporter and assignee details in a single query. I also integrated Chart.js for real-time analytics and deployed the live project on Render."*

---

**Live Web Application**: [https://devtrack-system.onrender.com](https://devtrack-system.onrender.com)  
**GitHub Repository**: [https://github.com/monisha20070711-arch/devtrack-system](https://github.com/monisha20070711-arch/devtrack-system)
