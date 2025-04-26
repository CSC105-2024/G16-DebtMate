# Contributing to DebtMate

Thank you for your interest in contributing to DebtMate! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Contribution Workflow](#contribution-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Project Overview

DebtMate is a full-stack application for tracking shared expenses and debts among friends and groups. The project uses:

| Component          | Technologies Used                     |
| ------------------ | ------------------------------------- |
| **Frontend**       | React 19, Tailwind CSS, Vite          |
| **Backend**        | Hono.js, PostgreSQL/In-memory storage |
| **Infrastructure** | Docker, Docker Compose                |

---

## Development Setup

### Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **Docker Desktop** (optional) - [Download here](https://www.docker.com/products/docker-desktop/)
   - Required for PostgreSQL mode, not needed for memory mode

### First-time Setup

```bash
# Clone the repository
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# Install dependencies for frontend and backend
npm run setup

# Set up environment file
cd backend
cp .env.example .env
# Edit .env as needed
cd ..
```

### Development Modes

| Mode                                 | Command                |
| ------------------------------------ | ---------------------- |
| **Memory Mode** (No Docker Required) | `npm run dev:memory`   |
| **PostgreSQL Mode** (With Docker)    | `npm run dev:postgres` |

---

## Project Structure

```bash
/
├── src/                  # Frontend code
│   ├── Component/        # Reusable components
│   ├── pages/            # Page components
│   ├── context/          # React context providers
│   └── App.jsx           # Main app component
│
├── backend/              # Backend API
│   ├── src/
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Request middleware
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration files
│   │   └── server.ts     # Entry point
│   ├── .env              # Backend config (must be created)
│   └── .env.example      # Example environment variables
│
├── database/             # Database setup
│   └── init/             # Initialization SQL scripts
│
├── package.json          # Project dependencies and scripts
└── docker-compose.yml    # Docker configuration
```

---

## Coding Standards

### Frontend

- Use **functional components** with React hooks
- Follow component naming conventions:
  - Components should be **PascalCase** (e.g., `FriendCard.jsx`)
  - Files should match component names
- Use **Tailwind CSS** for styling
- Document **component props**, especially for reusable components

### Backend

- Follow **TypeScript** best practices
- Document public functions with **JSDoc comments**
- Use `async/await` for asynchronous operations
- Keep **controllers** focused on business logic, delegate data access to **models**
- Ensure both **database implementations** (memory and PostgreSQL) are maintained

### General

- Run `npm run lint` before submitting PRs to ensure code quality
- Follow **existing patterns** for error handling
- Use **descriptive variable and function names**

---

## Contribution Workflow

1. Choose an **issue** to work on or create a new one.
2. Create a **new branch** from `main` with a descriptive name:
   - **Feature:** `feature/add-expense-tracking`
   - **Bugfix:** `fix/login-validation-error`
3. Make your **changes** with appropriate tests and documentation.
4. **Push** your branch and create a **pull request**.

---

## Pull Request Guidelines

When submitting a PR:

✔ Reference any **related issues**  
✔ Provide a **clear description** of your changes  
✔ Ensure all **checks pass** (linting, tests)  
✔ Request **reviews** from appropriate team members  
✔ Update **documentation** if necessary  
✔ Include **screenshots** for UI changes

---

## Testing

Currently, the project does not have automated tests. When implementing:

- Write **unit tests** for backend controllers and utilities
- Test **both database modes** (memory and PostgreSQL)
- For frontend, focus on **component behavior testing**

---

## Documentation

- **Add JSDoc comments** to functions and components
- **Update README.md** when adding new features or modifying existing ones
- **Document API endpoints** in backend code

---

## API Development

When extending the API:

1. Create a **new route file** in `routes/`
2. Implement **controller logic** in `controllers/`
3. Add necessary **model methods** in `models/`
4. Register new **routes** in `server.ts`
5. Ensure both **database implementations** (memory and PostgreSQL) support the feature

---

## Frontend Development

When adding new UI features:

✔ Determine whether to **create a new component** or extend an existing one  
✔ Place **reusable components** in `Component/`  
✔ Place **page components** in `pages/`  
✔ Update **routes** in `App.jsx` when adding new pages  
✔ Ensure **responsive design** (mobile, tablet, desktop)

---

## Questions?

If you have any questions or need clarification on these guidelines, please open an **issue** with the label `"question"`.

Thank you for contributing to DebtMate!
