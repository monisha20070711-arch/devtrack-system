# DevTrack System – Company-Style Project Development Process & Mayvel Technologies Interview Guide

**Project Name**: DevTrack System – Issue & Task Management System  
**Student Developer**: Monisha  
**Degree / Course**: B.Sc Information Technology (B.Sc IT)  
**Target Company**: Mayvel Technologies  
**GitHub Repository**: [https://github.com/monisha20070711-arch/devtrack-system](https://github.com/monisha20070711-arch/devtrack-system)  
**Live Web Application**: [https://devtrack-system.onrender.com](https://devtrack-system.onrender.com)  

---

## 1. Project Idea & Business Case

- **Why DevTrack**: Solves bug tracking visibility issues in software development teams by centralizing defect reports into a single full-stack web dashboard.
- **Target Users**: Software Engineers, QA Testers, Project Managers, Team Leads.
- **Real-World Business Use Case**: Agile software development teams tracking bug lifecycles from discovery to resolution.

---

## 2. Requirement Gathering

- **Functional Requirements**: User registration, login, JWT token stateless authorization, issue CRUD operations, developer assignment, live debounced search, multi-filters (Status, Priority, Category), Chart.js visual analytics charts.
- **Non-Functional Requirements**: High performance (<200ms API response), 10-round salted bcrypt security, parameterized SQL query injection prevention, 24/7 cloud availability on Render containers.

---

## 3. System Architecture (3-Tier MVC)

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

## 4. REST API Documentation

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

## 5. Mayvel Technologies Interview Explanations

### 30-Second Elevator Pitch
"DevTrack is a production-style full-stack issue and task management system built with Node.js, Express, MySQL, and Vanilla Web technologies. It allows engineering teams to track bug lifecycles, assign tasks to developers, monitor status transitions, and analyze workload distributions via interactive charts. It features JWT authentication, bcrypt encryption, and is deployed live on Render."

### 2-Minute Spoken Answer
*"DevTrack is a production-style full-stack issue and task management system built with Node.js, Express, MySQL, and Vanilla Web technologies. In software projects, tracking bugs across informal chats or spreadsheets leads to unassigned defects and missed deadlines. DevTrack solves this by providing a centralized web dashboard where issues are created, assigned to team developers, and tracked through statuses—Open, In Progress, and Resolved.*

*Technically, I selected Node.js and Express for the REST API and Vanilla JavaScript for the client interface to ensure fast load times without framework overhead. For security, I implemented bcrypt password hashing and JSON Web Tokens for stateless authorization. On the database side, I designed a relational MySQL schema with foreign keys linking tasks to team members, using SQL JOINs to fetch reporter and assignee details in a single query. I also integrated Chart.js for real-time analytics and deployed the live project on Render."*

---

**Live Web Application**: [https://devtrack-system.onrender.com](https://devtrack-system.onrender.com)  
**GitHub Repository**: [https://github.com/monisha20070711-arch/devtrack-system](https://github.com/monisha20070711-arch/devtrack-system)
