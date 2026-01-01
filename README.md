# Supabase Query Language Practice

This project contains exercises to help you convert raw PostgreSQL queries to Supabase query language.

## Official Documentation

**📚 [Supabase JavaScript Client Documentation](https://supabase.com/docs/reference/javascript/introduction)**

Refer to the official documentation for comprehensive details on all Supabase methods and advanced features.

## Quick Start

1. Follow the setup instructions in [SETUP.md](./SETUP.md)
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`
4. Begin converting the raw SQL queries in the controllers to Supabase queries

## Basic Supabase Query Language

### Core Methods

#### `.from(tableName)`
Specifies which table to query.

```javascript
supabase.from('users')
```

#### `.select(columns)`
Selects columns to retrieve. Use `*` for all columns, or specify column names.

```javascript
.select('*')
.select('id, name, email')
.select('id, name, email, posts(*)')  // Nested select for JOINs
```

#### `.insert(data)`
Inserts new records.

```javascript
.insert({ name: 'John', email: 'john@example.com' })
```

#### `.update(data)`
Updates existing records.

```javascript
.update({ name: 'Jane', age: 30 })
```

#### `.delete()`
Deletes records.

```javascript
.delete()
```

### Filter Methods

#### `.eq(column, value)`
Equal to (`=`)

```javascript
.eq('status', 'active')
```

#### `.neq(column, value)`
Not equal to (`!=`)

```javascript
.neq('status', 'inactive')
```

#### `.gt(column, value)`
Greater than (`>`)

```javascript
.gt('age', 18)
```

#### `.gte(column, value)`
Greater than or equal (`>=`)

```javascript
.gte('age', 18)
```

#### `.lt(column, value)`
Less than (`<`)

```javascript
.lt('age', 65)
```

#### `.lte(column, value)`
Less than or equal (`<=`)

```javascript
.lte('age', 65)
```

#### `.like(column, pattern)`
Case-sensitive pattern matching (`LIKE`)

```javascript
.like('title', '%nodejs%')
```

#### `.ilike(column, pattern)`
Case-insensitive pattern matching (`ILIKE`)

```javascript
.ilike('title', '%nodejs%')
```

#### `.in(column, array)`
Matches any value in array (`IN`)

```javascript
.in('id', [1, 2, 3])
```

#### `.or(conditions)`
OR condition

```javascript
.or('title.ilike.%search%,content.ilike.%search%')
```

### Query Modifiers

#### `.order(column, options)`
Sorts results.

```javascript
.order('name', { ascending: true })
.order('created_at', { ascending: false })
```

#### `.limit(count)`
Limits number of results.

```javascript
.limit(10)
```

#### `.range(from, to)`
Pagination (0-indexed).

```javascript
.range(0, 9)  // First 10 records
```

#### `.single()`
Returns a single record (throws error if 0 or multiple records).

```javascript
.single()
```

#### `.maybeSingle()`
Returns a single record or null (doesn't throw if 0 records).

```javascript
.maybeSingle()
```

### JOINs (Nested Selects)

Supabase uses nested `.select()` syntax for JOINs:

```javascript
// Single JOIN
.select('id, title, users(name, email)')

// Multiple nested relations
.select(`
  id,
  title,
  users(id, name, email),
  comments(id, content, users(name))
`)
```

### Complete Query Examples

#### Basic SELECT with WHERE

**SQL:**
```sql
SELECT id, name, email FROM users WHERE status = 'active';
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('users')
  .select('id, name, email')
  .eq('status', 'active')
```

#### INSERT with RETURNING

**SQL:**
```sql
INSERT INTO users (name, email) VALUES ('John', 'john@example.com') RETURNING *;
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('users')
  .insert({ name: 'John', email: 'john@example.com' })
  .select()
```

#### UPDATE with WHERE

**SQL:**
```sql
UPDATE users SET name = 'Jane' WHERE id = 1 RETURNING *;
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', 1)
  .select()
```

#### DELETE

**SQL:**
```sql
DELETE FROM users WHERE id = 1;
```

**Supabase:**
```javascript
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', 1)
```

#### Range Filter

**SQL:**
```sql
SELECT * FROM users WHERE age >= 18 AND age <= 65;
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .gte('age', 18)
  .lte('age', 65)
```

#### Text Search

**SQL:**
```sql
SELECT * FROM posts WHERE title ILIKE '%nodejs%' OR content ILIKE '%nodejs%';
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .or('title.ilike.%nodejs%,content.ilike.%nodejs%')
```

#### JOIN Query

**SQL:**
```sql
SELECT p.*, u.name as author_name 
FROM posts p 
INNER JOIN users u ON p.user_id = u.id;
```

**Supabase:**
```javascript
const { data, error } = await supabase
  .from('posts')
  .select('*, users(name)')
```

## SQL to Supabase Comparison Table

| SQL Operator | Supabase Method |
|-------------|-----------------|
| `WHERE column = value` | `.eq('column', value)` |
| `WHERE column != value` | `.neq('column', value)` |
| `WHERE column > value` | `.gt('column', value)` |
| `WHERE column >= value` | `.gte('column', value)` |
| `WHERE column < value` | `.lt('column', value)` |
| `WHERE column <= value` | `.lte('column', value)` |
| `WHERE column LIKE pattern` | `.like('column', pattern)` |
| `WHERE column ILIKE pattern` | `.ilike('column', pattern)` |
| `WHERE column IN (a, b, c)` | `.in('column', [a, b, c])` |
| `ORDER BY column ASC` | `.order('column', { ascending: true })` |
| `ORDER BY column DESC` | `.order('column', { ascending: false })` |
| `LIMIT n` | `.limit(n)` |
| `OFFSET m LIMIT n` | `.range(m, m + n - 1)` |
| `INNER JOIN` | Nested `.select('table(columns)')` |
| `LEFT JOIN` | Nested `.select('table(columns)')` |

## Exercises

This project contains 10 progressive exercises:

1. **Exercise 1-3** (`controllers/users.controller.js`): Basic SELECT, single record, INSERT
2. **Exercise 4-5** (`controllers/posts.controller.js`): UPDATE, DELETE
3. **Exercise 6-7** (`controllers/search.controller.js`): Range filters, text search
4. **Exercise 8-10** (`controllers/relations.controller.js`): JOINs and complex nested queries

Each controller file contains raw SQL queries that you need to convert to Supabase query language.

## Important Notes

- Always handle errors: Check `error` object in the response
- Use `.select()` after `.insert()` or `.update()` to get the returned data
- Use `.single()` when expecting exactly one record
- For advanced features, refer to the [official documentation](https://supabase.com/docs/reference/javascript/introduction)

