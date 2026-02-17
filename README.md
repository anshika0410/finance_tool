# Finance Tool

A simple personal finance tool to record and review expenses.

## Features
- Record expenses with amount, category, description, and date.
- View list of expenses.
- Filter by category.
- Sort by date (newest first).
- Persistence via SQLite.
- Idempotency support for unreliable networks.

## Design Decisions
- **Backend**: Express.js for simplicity and flexibility.
- **Database**: SQLite. Chosen for zero-configuration, reliability (ACID), and ease of use in a "production-like" assignment environment without needing a separate database server process.
- **Frontend**: React (Vite) for a modern, responsive UI.
- **Idempotency**: The client generates a UUID for each expense attempt. The server uses this UUID to prevent duplicate entries if the client retries the request.

## Setup
1. **Server**:
   ```bash
   cd server
   npm install
   npm start
   ```
2. **Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
