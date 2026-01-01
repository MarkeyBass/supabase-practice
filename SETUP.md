# Setup Guide: Local Supabase Development

This guide will help you set up a local Supabase instance for practicing Supabase query language conversions.

## Prerequisites

**Docker Desktop must be installed and running** before proceeding. Supabase CLI uses Docker containers to run the local Supabase stack.

- Download Docker Desktop: https://www.docker.com/products/docker-desktop/
- Make sure Docker Desktop is running (you should see the Docker icon in your system tray/menu bar)

## Step 1: Install Dependencies

Install all project dependencies (including Supabase CLI as a dev dependency):

```bash
npm install
```

This will install Supabase CLI locally in the project. You'll use `npx supabase` to run commands.

Verify installation:

```bash
npx supabase --version
```

**Note:** We use `npx supabase` instead of `supabase` because the CLI is installed as a dev dependency, not globally. This works the same on macOS and Windows!

## Step 2: Initialize Supabase in Your Project

Initialize Supabase in your project root:

```bash
npx supabase init
```

This creates a `supabase/` folder with configuration files. You don't need to modify these files for basic usage.

## Step 3: Start Local Supabase

Start the local Supabase stack:

```bash
npx supabase start
```

This command will:
- Download and start Docker containers for PostgreSQL, PostgREST, and other Supabase services
- Create the database and set up the necessary infrastructure
- Display connection information including URLs and API keys

**First-time setup may take a few minutes** as Docker downloads the required images.

## Step 4: Get Your Connection Credentials

After `npx supabase start` completes, run:

```bash
npx supabase status
```

This displays:
- **API URL**: `http://localhost:54321` (this is your `SUPABASE_URL`)
- **anon key**: Your `SUPABASE_ANON_KEY`
- **service_role key**: Your service role key (for admin operations)
- **DB URL**: PostgreSQL connection string
- **Studio URL**: `http://localhost:54323` (Supabase Studio UI)

## Step 5: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
# PostgreSQL Connection (for raw SQL queries using pg package)
DB_HOST=localhost
DB_PORT=54322
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres

# Supabase Connection (get these from 'supabase status')
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key-from-supabase-status
```

Replace `your-anon-key-from-supabase-status` with the actual anon key from `npx supabase status`.

## Step 6: Start Server

```bash
npm run dev
```

The server will:
- Connect to your local PostgreSQL database
- Automatically create tables and insert sample data
- Start listening on port 8000 (or your configured PORT)

## Step 7: Access Supabase Studio (Optional)

Open your browser and navigate to:

```
http://localhost:54323
```

This gives you a visual interface to:
- View and manage your database tables
- Run SQL queries
- View table data
- Manage database schema

## Working with the Exercises

1. Each controller file contains raw SQL queries
2. Your task is to convert these to Supabase query language
3. Modify the controllers to use Supabase client instead of raw SQL
4. Test your changes using the API endpoints

### Example: Converting Exercise 1

**Before (Raw SQL):**
```javascript
const result = await pool.query(
  "SELECT id, name, email, age FROM users WHERE status = $1 ORDER BY name ASC",
  ["active"]
);
```

**After (Supabase):**
```javascript
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const { data, error } = await supabase
  .from('users')
  .select('id, name, email, age')
  .eq('status', 'active')
  .order('name', { ascending: true });
```

## Useful Commands

All commands use `npx supabase` instead of `supabase`:

### Stop Supabase
```bash
npx supabase stop
```

### Restart Supabase
```bash
npx supabase restart
```

### Reset Database (clears all data)
```bash
npx supabase db reset
```

### View Logs
```bash
npx supabase logs
```

### Stop and Remove All Containers
```bash
npx supabase stop --no-backup
```

## Troubleshooting

### Docker is not running
- Make sure Docker Desktop is installed and running
- Check system tray/menu bar for Docker icon

### Port already in use
- Stop any services using ports 54321, 54322, or 54323
- Or modify ports in `supabase/config.toml`

### Database connection errors
- Verify Supabase is running: `npx supabase status`
- Check `.env` file has correct credentials
- Ensure database was initialized: `npx supabase db reset`

### "Command not found: supabase"
- Make sure you ran `npm install` to install dependencies
- Use `npx supabase` instead of `supabase` (the CLI is installed locally, not globally)

## Next Steps

1. Read [README.md](./README.md) for Supabase query language basics
2. Start with Exercise 1 in `controllers/users.controller.js`
3. Refer to [official Supabase documentation](https://supabase.com/docs/reference/javascript/introduction) for advanced features

## Notes

- The Supabase CLI manages Docker containers automatically - you don't need Docker Compose knowledge
- All data is stored locally in Docker volumes
- Stopping Supabase (`npx supabase stop`) preserves your data
- Use `npx supabase stop --no-backup` to completely remove containers and data
- **Cross-platform:** Using `npx supabase` works the same on macOS and Windows - no need for different installation methods!

