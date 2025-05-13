# Contributing to DebtMate

Thank you for your interest in DebtMate.
At this time, we are **not accepting public contributions**. Only internal group members from the project team are permitted to contribute directly to this repository.

If you are not a part of the team, you're welcome to explore the codebase, fork the repository, and use it as a reference or foundation for your own projects.

---
Thank you for your interest in DebtMate.
At this time, we are **not accepting public contributions**. Only internal group members from the project team are permitted to contribute directly to this repository.

If you are not a part of the team, you're welcome to explore the codebase, fork the repository, and use it as a reference or foundation for your own projects.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Development Setup](#development-setup)
* [Project Structure](#project-structure)
* [Coding Standards](#coding-standards)
* [Contribution Workflow](#contribution-workflow)
* [Pull Request Guidelines](#pull-request-guidelines)
* [Testing](#testing)
* [Documentation](#documentation)

---

## Project Overview

**DebtMate** is a full-stack web application for managing shared expenses and debts among friends or groups.
**DebtMate** is a full-stack web application for managing shared expenses and debts among friends or groups.

| Component          | Technology Stack                                       |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | React 19, Tailwind CSS, Vite                           |
| **Backend**        | Hono.js, TypeScript, Prisma ORM                        |
| **Database**       | SQLite (on `main` branch)                              |
| **Infrastructure** | Docker + PostgreSQL (only on `docker/postgres` branch) |

> ⚠️ **Note**: Docker and PostgreSQL are only configured in the `docker/postgres` branch. The `main` branch uses SQLite with Prisma and does not require Docker for local development.
| Component          | Technology Stack                                       |
| ------------------ | ------------------------------------------------------ |
| **Frontend**       | React 19, Tailwind CSS, Vite                           |
| **Backend**        | Hono.js, TypeScript, Prisma ORM                        |
| **Database**       | SQLite (on `main` branch)                              |
| **Infrastructure** | Docker + PostgreSQL (only on `docker/postgres` branch) |

> ⚠️ **Note**: Docker and PostgreSQL are only configured in the `docker/postgres` branch. The `main` branch uses SQLite with Prisma and does not require Docker for local development.

---

## Development Setup

### Prerequisites

Ensure the following tools are installed on your machine:
Ensure the following tools are installed on your machine:

1. **Node.js & npm** – [Download here](https://nodejs.org/)
2. **(Optional)** Docker Desktop – Required _only_ if working on the `docker/postgres` branch

### Initial Setup
### Initial Setup

```bash
# Clone the repository
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# Install dependencies
# Install dependencies
npm run setup

# Set up backend environment variables
# Set up backend environment variables
cd backend
cp .env.example .env
# Edit the .env file as needed
# Edit the .env file as needed
cd ..
```

---

## Development Modes
---

## Development Modes

| Mode                     | Command                                    |
| ------------------------ | ------------------------------------------ |
| SQLite mode (default)    | `npm run dev`                              |
| PostgreSQL mode (Docker) | Only available on `docker/postgres` branch |
| Mode                     | Command                                    |
| ------------------------ | ------------------------------------------ |
| SQLite mode (default)    | `npm run dev`                              |
| PostgreSQL mode (Docker) | Only available on `docker/postgres` branch |

---

## Project Structure

```bash
/
├── src/                  # Frontend code
│   ├── Component/        # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── Component/        # Reusable UI components
│   ├── pages/            # Page-level components
│   ├── context/          # React context providers
│   └── App.jsx           # Main application entry point
│   └── App.jsx           # Main application entry point
│
├── backend/              # Backend code
├── backend/              # Backend code
│   ├── src/
│   │   ├── models/       # Prisma models
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Request handlers and business logic
│   │   ├── middleware/   # Middleware functions
│   │   ├── models/       # Prisma models
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Request handlers and business logic
│   │   ├── middleware/   # Middleware functions
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Environment and runtime config
│   │   └── server.ts     # Application entry point
│   ├── .env              # Environment variables (required)
│   └── .env.example      # Example environment file
│   │   ├── config/       # Environment and runtime config
│   │   └── server.ts     # Application entry point
│   ├── .env              # Environment variables (required)
│   └── .env.example      # Example environment file
│
├── database/             # (Only in docker/postgres) DB setup scripts
├── database/             # (Only in docker/postgres) DB setup scripts
│
├── package.json          # Project scripts and dependencies
└── docker-compose.yml    # (docker/postgres branch only)
├── package.json          # Project scripts and dependencies
└── docker-compose.yml    # (docker/postgres branch only)
```

---

## Coding Standards

### Frontend

- Use **functional components** with React hooks
- Name components using **PascalCase** (e.g., `ExpenseList.jsx`)
- Ensure file names match component names
- Style using **Tailwind CSS**
- Clearly document component **props**, especially for reusable components

### Backend

- Use **TypeScript** consistently
- Document public functions with **JSDoc comments**
- Use `async/await` for asynchronous logic
- Keep controllers clean and business-focused
- Delegate DB operations to Prisma models
- Maintain support for **SQLite** (main) and **PostgreSQL** (in `docker/postgres`)

### General

- Run `npm run lint` before pushing code
- Follow established patterns for error handling and responses
- Use meaningful, descriptive variable and function names

---

## Contribution Workflow (For Team Members)
## Contribution Workflow (For Team Members)

1. Choose or create an issue to work on
2. Create a new branch from `main` using a descriptive name:

   - Feature: `feature/add-expense-tracking`
   - Bugfix: `fix/login-validation`

3. Make your changes, write relevant tests and documentation
4. Push your branch and open a pull request

---

## Pull Request Guidelines

When submitting a PR:

- Reference any related issues
- Clearly describe the changes made
- Make sure all checks pass (linting, etc.)
- Request reviews from relevant teammates
- Update documentation if required
- Include screenshots for frontend changes

---

## Testing

We are currently in the process of implementing automated tests.

In the meantime:
We are currently in the process of implementing automated tests.

In the meantime:

- Write **unit tests** for backend controllers and utilities
- Test with both **SQLite** (default) and PostgreSQL (if on `docker/postgres`)
- For frontend, focus on **component behavior**

---

## Documentation

- Use **JSDoc** to document functions and modules
- Update `README.md` if features are added or changed
- Document new API endpoints in backend code

---

## API Development

To add a new API endpoint:
To add a new API endpoint:

1. Create a new file in `routes/`
2. Implement logic in a new or existing controller
3. Add required methods in Prisma models if needed
4. Register the route in `routes/index.ts`
5. Confirm compatibility with both SQLite and PostgreSQL
1. Create a new file in `routes/`
2. Implement logic in a new or existing controller
3. Add required methods in Prisma models if needed
4. Register the route in `routes/index.ts`
5. Confirm compatibility with both SQLite and PostgreSQL

---

## Frontend Development

When building new UI features:
When building new UI features:

- Reusable components go in `Component/`
- Page-level components go in `pages/`
- Add new routes in `App.jsx`
- Ensure proper mobile and desktop responsiveness

---

## Questions?

If you have any questions or need help understanding any part of the project, please open an issue with the label `"question"`.
If you have any questions or need help understanding any part of the project, please open an issue with the label `"question"`.

---

Thanks again for supporting the project. Internal team members, happy building! 🚀
