# Finance Tool

A simple personal finance tool to record and review expenses.

## Features
- Record expenses with amount, category, description, and date.
- View list of expenses.
- Filter by category.
- Sort by date (newest first).
- Persistence via SQLite.
- Idempotency support for unreliable networks.

## Data Model
- **Expenses Table**:
  - `id`: Integer (Primary Key)
  - `amount`: Integer (in cents)
  - `category`: Text
  - `description`: Text
  - `date`: Text (ISO 8601 Date String)
  - `idempotency_key`: Text (Unique, for retry handling)
  - `created_at`: DateTime

## API Endpoints
- `GET /expenses`: List expenses. Supports `?category=X` and `?sort=date_desc`.
- `POST /expenses`: Create expense. Requires `amount`, `category`, `description`, `date`. Optional `idempotencyKey`.

## Design Decisions
- **Backend structure**: Refactored into `controllers` and `routes` for better separation of concerns.
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
   npm run dev
   ```

## Design & Trade-offs

### Key Design Decisions
- **Architecture**: Separated Client (React) and Server (Express) to demonstrate a full-stack approach with clear separation of concerns.
- **Database**: Chosen **SQLite** for its zero-configuration and ACID compliance. It mimics a real relational database without the overhead of running a separate server process for this assignment.
- **Idempotency**: Implemented a robust retry mechanism using client-generated UUIDs (`idempotency-key` header) to handle potential network failures without duplicating expenses.

### Trade-offs (Timebox & Scope)
- **Persistence on Serverless**: Deployed to Vercel for ease of access, but with the known trade-off that **SQLite data is ephemeral** in a serverless environment. A production app would use an external DB (e.g., Supabase, Turso).
- **Authentication**: Omitted user accounts/login to focus purely on the core expense tracking value and robust API logic within the timeframe.
- **Testing**: Focused on **Backend Integration Tests** (Jest/Supertest) to cover the critical business logic and reliability features. UI tests were omitted in favor of manual verification for the visual components.

### Intentionally Omitted
- **Complex State Management**: Used React functionality (State/Effect) instead of Redux, as the app state is simple enough to not warrant the extra boilerplate.
- **Visualizations**: Charts/Graphs were skipped in favor of a clean, text-based Category Summary grid to keep the UI lightweight and accessible.

