/**
 * NexHome Database Admin Tool
 * Use this script to view and manage users in the database
 * 
 * Usage:
 *   node database-admin.js list-users          - List all users
 *   node database-admin.js view-user <email>   - View specific user
 *   node database-admin.js change-password <email> <newPassword> - Change user password
 *   node database-admin.js delete-user <email> - Delete a user
 *   node database-admin.js create-user        - Create a new user interactively
 */

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const readline = require('readline');

const dbPath = path.join(__dirname, 'backend', 'database', 'nexhome.db');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

// List all users
async function listUsers() {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.all('SELECT id, email, name, phone, user_type, created_at FROM users ORDER BY created_at DESC', 
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
                db.close();
            }
        );
    });
}

// View specific user
async function viewUser(email) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.get('SELECT id, email, name, phone, user_type, created_at FROM users WHERE email = ?', 
            [email], 
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
                db.close();
            }
        );
    });
}

// Change user password
async function changePassword(email, newPassword) {
    const db = await openDatabase();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return new Promise((resolve, reject) => {
        db.run('UPDATE users SET password = ? WHERE email = ?', 
            [hashedPassword, email], 
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes === 0) {
                        reject(new Error('User not found'));
                    } else {
                        resolve({ success: true, message: 'Password updated successfully' });
                    }
                }
                db.close();
            }
        );
    });
}

// Delete user
async function deleteUser(email) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE email = ?', 
            [email], 
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes === 0) {
                        reject(new Error('User not found'));
                    } else {
                        resolve({ success: true, message: 'User deleted successfully' });
                    }
                }
                db.close();
            }
        );
    });
}

// Create new user
async function createUser() {
    const email = await question('Email: ');
    const name = await question('Name: ');
    const phone = await question('Phone (optional): ') || null;
    const userType = await question('User Type (buyer/seller): ');
    const password = await question('Password: ');
    
    const db = await openDatabase();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (email, password, name, phone, user_type) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, name, phone, userType],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        reject(new Error('Email already exists'));
                    } else {
                        reject(err);
                    }
                } else {
                    resolve({ success: true, message: 'User created successfully', userId: this.lastID });
                }
                db.close();
            }
        );
    });
}

// Main function
async function main() {
    const command = process.argv[2];
    
    try {
        switch (command) {
            case 'list-users':
                const users = await listUsers();
                console.log('\n=== All Users ===\n');
                if (users.length === 0) {
                    console.log('No users found.');
                } else {
                    console.table(users);
                    console.log(`\nTotal: ${users.length} users\n`);
                }
                break;
                
            case 'view-user':
                const email = process.argv[3];
                if (!email) {
                    console.error('Error: Email required');
                    console.log('Usage: node database-admin.js view-user <email>');
                    process.exit(1);
                }
                const user = await viewUser(email);
                if (user) {
                    console.log('\n=== User Details ===\n');
                    console.log(`ID: ${user.id}`);
                    console.log(`Email: ${user.email}`);
                    console.log(`Name: ${user.name}`);
                    console.log(`Phone: ${user.phone || 'N/A'}`);
                    console.log(`Type: ${user.user_type}`);
                    console.log(`Created: ${user.created_at}\n`);
                } else {
                    console.log('User not found.\n');
                }
                break;
                
            case 'change-password':
                const userEmail = process.argv[3];
                const newPass = process.argv[4];
                if (!userEmail || !newPass) {
                    console.error('Error: Email and password required');
                    console.log('Usage: node database-admin.js change-password <email> <newPassword>');
                    process.exit(1);
                }
                const result = await changePassword(userEmail, newPass);
                console.log(result.message);
                break;
                
            case 'delete-user':
                const delEmail = process.argv[3];
                if (!delEmail) {
                    console.error('Error: Email required');
                    console.log('Usage: node database-admin.js delete-user <email>');
                    process.exit(1);
                }
                const delResult = await deleteUser(delEmail);
                console.log(delResult.message);
                break;
                
            case 'create-user':
                const createResult = await createUser();
                console.log(createResult.message);
                rl.close();
                break;
                
            default:
                console.log(`
NexHome Database Admin Tool
============================

Usage:
  node database-admin.js <command> [options]

Commands:
  list-users                          List all users
  view-user <email>                   View user details
  change-password <email> <password>  Change user password
  delete-user <email>                 Delete a user
  create-user                         Create new user (interactive)

Examples:
  node database-admin.js list-users
  node database-admin.js view-user admin@nexhome.com
  node database-admin.js change-password admin@nexhome.com newpass123
  node database-admin.js delete-user olduser@example.com
  node database-admin.js create-user
                `);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
    
    if (command !== 'create-user') {
        rl.close();
    }
}

main();

