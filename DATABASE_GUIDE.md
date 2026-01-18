# Database Management Guide

## Overview

NexHome uses SQLite database located at: `backend/database/nexhome.db`

## Quick Access Methods

### Method 1: Using the Admin Script (Recommended)

I've created a convenient admin script for you. Use it like this:

#### List All Users
```bash
node database-admin.js list-users
```

#### View Specific User
```bash
node database-admin.js view-user admin@nexhome.com
```

#### Change User Password
```bash
node database-admin.js change-password admin@nexhome.com newpassword123
```

#### Delete a User
```bash
node database-admin.js delete-user user@example.com
```

#### Create New User
```bash
node database-admin.js create-user
```
(This will prompt you for user details interactively)

---

### Method 2: Using SQLite Command Line

#### Install SQLite (if not already installed)

**Windows:**
1. Download from: https://www.sqlite.org/download.html
2. Or use Chocolatey: `choco install sqlite`

**Or use online tools:**
- DB Browser for SQLite (GUI): https://sqlitebrowser.org/
- VS Code Extension: "SQLite Viewer"

#### Access Database via Command Line

```bash
# Navigate to database folder
cd backend/database

# Open database
sqlite3 nexhome.db
```

#### Useful SQL Commands

**View all users:**
```sql
SELECT id, email, name, phone, user_type, created_at FROM users;
```

**View specific user:**
```sql
SELECT * FROM users WHERE email = 'admin@nexhome.com';
```

**Change password (you'll need to hash it first - use the admin script instead):**
```sql
-- Note: Passwords are hashed, so use the admin script for this
```

**View user with their properties:**
```sql
SELECT u.email, u.name, u.user_type, COUNT(p.id) as property_count
FROM users u
LEFT JOIN properties p ON u.id = p.seller_id
GROUP BY u.id;
```

**View all properties:**
```sql
SELECT p.id, p.title, p.price, p.city, u.email as seller_email
FROM properties p
JOIN users u ON p.seller_id = u.id;
```

**Exit SQLite:**
```sql
.quit
```

---

### Method 3: Using DB Browser for SQLite (GUI Tool)

1. **Download DB Browser for SQLite:**
   - https://sqlitebrowser.org/
   - Install it

2. **Open Database:**
   - Open DB Browser
   - Click "Open Database"
   - Navigate to: `backend/database/nexhome.db`

3. **Browse Data:**
   - Click "Browse Data" tab
   - Select "users" table from dropdown
   - View and edit data directly

4. **Execute SQL:**
   - Click "Execute SQL" tab
   - Write your SQL queries
   - Click "Run" (F5)

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,           -- Hashed with bcrypt
    name TEXT NOT NULL,
    phone TEXT,
    user_type TEXT NOT NULL,          -- 'buyer' or 'seller'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL,
    listing_type TEXT NOT NULL,       -- 'sale' or 'rent'
    price REAL NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_sqft INTEGER,
    year_built INTEGER,
    parking INTEGER,
    images TEXT,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'active',    -- 'active', 'sold', 'rented', 'inactive'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    UNIQUE(user_id, property_id)
);
```

### Inquiries Table
```sql
CREATE TABLE inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',    -- 'pending', 'responded', 'closed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

---

## Common Tasks

### Reset Admin Password

```bash
node database-admin.js change-password admin@nexhome.com newpassword123
```

### Create Test Users

**Buyer:**
```bash
node database-admin.js create-user
# Enter: buyer@test.com, Test Buyer, 1234567890, buyer, password123
```

**Seller:**
```bash
node database-admin.js create-user
# Enter: seller@test.com, Test Seller, 1234567890, seller, password123
```

### View All Data

```sql
-- Users
SELECT * FROM users;

-- Properties
SELECT * FROM properties;

-- Favorites
SELECT * FROM favorites;

-- Inquiries
SELECT * FROM inquiries;
```

### Backup Database

```bash
# Copy the database file
cp backend/database/nexhome.db backend/database/nexhome.db.backup
```

### Reset Database

```bash
# Delete the database file
rm backend/database/nexhome.db

# Restart the server (it will recreate the database)
npm start
```

---

## Security Notes

⚠️ **Important:**
- Passwords are hashed using bcrypt - you cannot see plain text passwords
- Always use the admin script to change passwords (it handles hashing)
- Never modify the database directly in production
- Make backups before making changes

---

## Troubleshooting

### Database locked error
- Close all connections to the database
- Restart the server
- Make sure no other process is using the database

### Cannot find database
- Check if `backend/database/nexhome.db` exists
- If not, restart the server to create it

### Permission denied
- Check file permissions
- On Windows, make sure you have write access to the folder

---

## Quick Reference

| Task | Command |
|------|---------|
| List users | `node database-admin.js list-users` |
| View user | `node database-admin.js view-user <email>` |
| Change password | `node database-admin.js change-password <email> <password>` |
| Delete user | `node database-admin.js delete-user <email>` |
| Create user | `node database-admin.js create-user` |
| Open SQLite CLI | `sqlite3 backend/database/nexhome.db` |

---

For more help, check the admin script usage:
```bash
node database-admin.js
```

