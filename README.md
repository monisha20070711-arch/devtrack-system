# DevTrack – Issue & Task Management System 🚀

A production-style full-stack SaaS Web Application built with **Node.js, Express.js, MySQL, and modern Vanilla HTML/CSS/JavaScript**.

DevTrack delivers a sleek, modern UI combined with an easy-to-understand, interview-friendly code architecture ideal for software engineering portfolios, technical interviews, and junior developer demonstrations.

---

## 🌟 Key Features

- **SaaS-Style Dashboard**: 5 Real-time metric cards (Total, Open, In Progress, Resolved, High Priority Issues) and recent activity logs.
- **Interactive Visual Charts**: Dynamic Donut (Status Distribution) and Bar Charts (Priority Distribution) using Chart.js.
- **Complete Issue Lifecycle (CRUD)**: Create, View Details, Edit, and Delete issues with status tags and assignee developers.
- **Multi-Filter & Live Search**: Search titles/descriptions instantly, filter by Status, Priority, Category, and sort by date or priority.
- **JWT Authentication & Security**: Register, login with email/password, hashed using `bcryptjs`, protected API routes with JWT bearer tokens.
- **Team Developer Roster**: Assign registered team members to issues and view developer avatars.
- **Dark/Light Theme Toggle**: Seamless persistent theme switching with modern CSS variables & Glassmorphic UI.
- **Resilient Fallback Mode**: Auto-detects MySQL connections and gracefully operates out of the box with zero setup hurdles.

---

## 🏗️ Architecture & Technology Stack

```
Frontend (HTML5 / CSS3 / Vanilla JS) 
       │
       ▼
   REST API (JSON over HTTP)
       │
       ▼
Express.js Router & Controllers (Node.js)
       │
       ▼
SQL Data Access Layer (mysql2 / promise)
       │
       ▼
MySQL Relational Database (users & issues tables)
```

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, CSS Variables, Glassmorphism), Modern Vanilla JS (ES6+, Fetch API, DOM manipulation).
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS.
- **Database**: MySQL 8.0+ (`mysql2/promise` connection pool).

---

## 📁 Project Structure

```
devtrack-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool & fallback manager
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile controllers
│   │   ├── issueController.js    # Issue CRUD, search & filter controllers
│   │   ├── userController.js     # Team user roster controller
│   │   └── dashboardController.js # Analytics & metrics aggregator
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification middleware
│   │   └── errorMiddleware.js    # 404 & global error handling
│   ├── models/
│   │   ├── userModel.js          # Direct SQL queries for users table
│   │   └── issueModel.js         # Direct SQL queries & JOINs for issues
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── issueRoutes.js        # /api/issues endpoints
│   │   ├── userRoutes.js         # /api/users endpoints
│   │   └── dashboardRoutes.js    # /api/dashboard endpoints
│   └── server.js                 # Main Express server entry point
├── frontend/
│   ├── css/
│   │   ├── style.css             # Design tokens, layout, sidebar, modals, badges
│   │   └── dashboard.css         # Stat cards, charts & issue table styles
│   ├── js/
│   │   ├── config.js             # API base URL & constants
│   │   ├── api.js                # Centralized Fetch wrapper with JWT headers
│   │   ├── auth.js               # Auth state & session manager
│   │   ├── toast.js              # Toast notifications & confirmation dialogs
│   │   ├── charts.js             # Chart.js Donut & Bar chart renderer
│   │   ├── dashboard.js          # Stat card counters & recent activity
│   │   ├── issues.js             # Issue CRUD, live search & multi-filters
│   │   └── app.js                # View router, sidebar navigation & theme toggle
│   └── index.html                # Single Page Application HTML shell
├── database/
│   ├── schema.sql                # MySQL CREATE TABLE scripts & indexes
│   └── seed.sql                  # Realistic sample users and issues
├── .env.example                  # Environment template
├── package.json                  # Dependencies & npm scripts
└── README.md                     # Documentation & Interview guide
```

---

## ⚡ Quick Setup & Running Locally

### 1. Prerequisites
- **Node.js** v14.0 or higher
- **MySQL Server** 8.0+ (MySQL Workbench or command line)

### 2. Database Setup (MySQL)
Execute the SQL files inside your MySQL client:

```bash
# 1. Create tables and database
mysql -u root -p < database/schema.sql

# 2. Seed sample users and issues
mysql -u root -p < database/seed.sql
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy `.env.example`):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=devtrack_db

JWT_SECRET=devtrack_super_secret_jwt_key_2026_interview_demo
JWT_EXPIRES_IN=7d
```

### 4. Install Dependencies & Start
Open a terminal in the project directory:

```bash
# Install npm packages
npm install

# Start production / development server
npm start
```

Visit **`http://localhost:5000`** in your browser!

---

## 🔑 Demo Login Credentials

The sample seed script creates 4 pre-configured team accounts (Password for all accounts is `password123`):

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Project Manager** | Alex Morgan | `alex.morgan@devtrack.io` | `password123` |
| **Developer** | Sarah Chen | `sarah.chen@devtrack.io` | `password123` |
| **Developer** | Marcus Vance | `marcus.vance@devtrack.io` | `password123` |
| **QA Tester** | Emily Watson | `emily.watson@devtrack.io` | `password123` |

---

## 📡 REST API Reference

### Auth Endpoints (`/api/auth`)
- `POST /api/auth/register` - Create account (Name, Email, Password, Role)
- `POST /api/auth/login` - Authenticate & return JWT token
- `GET /api/auth/me` - Get profile of logged-in user (Requires Token)

### Issues Endpoints (`/api/issues`)
- `GET /api/issues` - List issues (Supports `?search=`, `?status=`, `?priority=`, `?category=`, `?sortBy=`)
- `GET /api/issues/:id` - Fetch issue details with reporter & assignee JOIN data
- `POST /api/issues` - Create issue (Title, Description, Status, Priority, Category, Assignee)
- `PUT /api/issues/:id` - Update existing issue
- `DELETE /api/issues/:id` - Delete issue

### Dashboard & Team Endpoints
- `GET /api/dashboard/stats` - Summary counts, status distribution & priority distribution
- `GET /api/users` - Roster of registered developers for assignment dropdowns

---

## 🎓 Software Interview Q&A Cheatsheet

When presenting **DevTrack** in a technical interview, use these key points:

### Q1: How is authentication implemented in DevTrack?
> *"Authentication uses JSON Web Tokens (JWT) combined with Bcrypt password hashing. When a user logs in, the Express server verifies the password hash stored in MySQL. If valid, a signed JWT is returned to the client and stored in `localStorage`. Subsequent API requests attach this token in the `Authorization: Bearer <token>` header, which is validated by our `authMiddleware` before granting access."*

### Q2: How are the database tables designed?
> *"We have two primary tables: `users` and `issues`. The `issues` table maintains foreign keys `reporter_id` and `assignee_id` referencing `users(id)` with `ON DELETE SET NULL`. This ensures referential integrity without accidentally losing issue history if a user account is removed."*

### Q3: How do SQL JOIN queries power the application?
> *"When fetching issues, we execute a SQL `LEFT JOIN` between `issues` and `users` twice (aliased as `reporter` and `assignee`). This allows us to fetch the developer's name, email, and avatar in a single query rather than making N+1 queries."*

### Q4: Why choose Vanilla JS over React/Angular for this project?
> *"Vanilla JavaScript demonstrates strong foundational knowledge of DOM manipulation, Fetch API handling, event bubbling, and custom component architecture without relying on third-party framework abstraction."*
