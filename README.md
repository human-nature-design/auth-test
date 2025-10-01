# Auth Test App

Next.js application with Neon Postgres, Stack Auth, and Row Level Security (RLS).

## Features

- **Authentication**: Stack Auth integration with sign-in/sign-up
- **Database**: Neon Postgres with Drizzle ORM
- **Row Level Security**: RLS policies ensure users only access their own data
- **CRUD Operations**: Full Create, Read, Update, Delete for `foo_bar` table
- **Protected Routes**: Dashboard requires authentication

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Stack Auth
- Neon Postgres
- Drizzle ORM
- Tailwind CSS

## Database Schema

```sql
CREATE TABLE "foo_bar" (
  "id" serial PRIMARY KEY,
  "user_id" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Row Level Security enabled
ALTER TABLE "foo_bar" ENABLE ROW LEVEL SECURITY;
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env.local`

3. Run migrations (if needed):
```bash
DATABASE_URL='your_database_url' npm run db:migrate
```

4. Start development server:
```bash
npm run dev
```

5. Visit http://localhost:3000

## Usage

1. **Sign Up**: Create a new account at `/handler/sign-up`
2. **Sign In**: Log in at `/handler/sign-in`
3. **Dashboard**: Access protected CRUD interface at `/dashboard`
4. **CRUD Operations**:
   - Create new items
   - View all your items
   - Update existing items
   - Delete items

## Row Level Security

The app implements RLS to ensure data isolation:
- Each `foo_bar` record has a `user_id` column
- RLS policies enforce that users can only access their own records
- The `app.current_user_id` session variable is set before each query

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate new migration
- `npm run db:migrate` - Run migrations
