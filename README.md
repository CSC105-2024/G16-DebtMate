# DebtMate 💸

## what's this?

DebtMate helps you:

- Track who owes what
- Create groups
- Keep tabs without the drama

## getting started

### first-time setup

```bash
# clone it
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# install dependencies
npm install
```

### dev environment

```bash
# run frontend + backend together
npm run dev:all

# or separately
npm run dev         # frontend only
npm run server      # backend only
```

Frontend runs at http://localhost:5173
Backend API at http://localhost:3000

## tech stack

- **frontend**: react 19, tailwind, vite
- **backend**: hono (express-like), in-memory db for now
- **tooling**: eslint, concurrently

## environment setup

coming soon...

## folder structure

```
/
├── src/               # frontend code
│   ├── Component/     # reusable components
│   ├── pages/         # page components
│   └── App.jsx        # main app component
│
├── backend/           # backend api
│   ├── src/
│   │   ├── models/    # data models
│   │   ├── routes/    # api routes
│   │   ├── controllers/ # business logic
│   │   └── server.ts  # entry point
│   └── .env           # backend config
│
└── public/            # static assets
    └── assets/        # icons, images, etc.
```

## todo list

- [ ] replace in-memory user store with actual database
- [ ] add JWT auth
- [ ] implement group creation
- [ ] add expense features

## contributing

just make it work ¯\_(ツ)\_/¯

## license

mit, do whatever
