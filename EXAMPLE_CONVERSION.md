# SQL to Supabase Query Conversion Example

## Example 1: Basic SELECT with WHERE

### Original SQL Query:
```sql
SELECT id, name, email, age 
FROM users 
WHERE status = 'active' 
ORDER BY name ASC;
```

### Using PostgreSQL (pg package):
```javascript
import { getPool } from "../utils/db.js";

const pool = getPool();
const result = await pool.query(
  "SELECT id, name, email, age FROM users WHERE status = $1 ORDER BY name ASC",
  ["active"]
);
const users = result.rows;
```

### Using Supabase:
```javascript
import { getSupabaseClient } from "../utils/db.js";

const supabase = getSupabaseClient();
const { data: users, error } = await supabase
  .from('users')
  .select('id, name, email, age')
  .eq('status', 'active')
  .order('name', { ascending: true });

if (error) {
  throw error;
}
```

## Complete Controller Example

### Before (SQL):
```javascript
export const getActiveUsers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, age FROM users WHERE status = $1 ORDER BY name ASC",
      ["active"]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      message: "Active users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
```

### After (Supabase):
```javascript
export const getActiveUsers = async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, age')
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data,
      message: "Active users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching active users:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
```

## Key Differences:

1. **Connection**: `getPool()` → `getSupabaseClient()`
2. **Query method**: `.query(sql, params)` → `.from().select().eq().order()`
3. **Response**: `result.rows` → `data` (Supabase returns data directly)
4. **Error handling**: Supabase returns `{ data, error }` instead of throwing

## Common Supabase Methods:

- `.from('table')` - Select table
- `.select('col1, col2')` - Select columns
- `.eq('column', value)` - WHERE column = value
- `.neq('column', value)` - WHERE column != value
- `.gt('column', value)` - WHERE column > value
- `.gte('column', value)` - WHERE column >= value
- `.lt('column', value)` - WHERE column < value
- `.lte('column', value)` - WHERE column <= value
- `.order('column', { ascending: true })` - ORDER BY
- `.limit(count)` - LIMIT
- `.insert({...})` - INSERT
- `.update({...})` - UPDATE
- `.delete()` - DELETE

