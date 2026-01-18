const { getDb } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Database Initialization
 * Creates tables and seeds initial data
 */
async function createTables() {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.serialize(() => {
            // Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT,
                user_type TEXT NOT NULL CHECK(user_type IN ('buyer', 'seller', 'admin')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) reject(err);
            });

            // Properties table
            db.run(`CREATE TABLE IF NOT EXISTS properties (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                seller_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                property_type TEXT NOT NULL,
                listing_type TEXT NOT NULL CHECK(listing_type IN ('sale', 'rent')),
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
                status TEXT DEFAULT 'active' CHECK(status IN ('active', 'sold', 'rented', 'inactive')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (seller_id) REFERENCES users(id)
            )`, (err) => {
                if (err) reject(err);
            });

            // Favorites table
            db.run(`CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                property_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (property_id) REFERENCES properties(id),
                UNIQUE(user_id, property_id)
            )`, (err) => {
                if (err) reject(err);
            });

            // Inquiries table
            db.run(`CREATE TABLE IF NOT EXISTS inquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                property_id INTEGER NOT NULL,
                buyer_id INTEGER NOT NULL,
                seller_id INTEGER NOT NULL,
                message TEXT,
                status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'responded', 'closed')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (property_id) REFERENCES properties(id),
                FOREIGN KEY (buyer_id) REFERENCES users(id),
                FOREIGN KEY (seller_id) REFERENCES users(id)
            )`, (err) => {
                if (err) reject(err);
            });

            // Create default admin account
            const defaultPassword = bcrypt.hashSync('admin123', 10);
            db.run(`INSERT OR IGNORE INTO users (email, password, name, user_type) 
                    VALUES (?, ?, ?, ?)`, 
                    ['admin@nexhome.com', defaultPassword, 'Admin User', 'seller'],
                    (err) => {
                        if (err) console.error('Error creating default user:', err);
                    });

            // Insert sample properties
            insertSampleProperties().then(() => {
                resolve();
            }).catch(reject);
        });
    });
}

function insertSampleProperties() {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.get("SELECT id FROM users WHERE email = 'admin@nexhome.com'", (err, user) => {
            if (err) {
                reject(err);
                return;
            }
            if (!user) {
                resolve();
                return;
            }

            const sampleProperties = [
                {
                    seller_id: user.id,
                    title: 'Luxury Penthouse with City Views',
                    description: 'Stunning penthouse with floor-to-ceiling windows, panoramic city views, gourmet kitchen, and private terrace.',
                    property_type: 'Condo',
                    listing_type: 'sale',
                    price: 1495000,
                    address: '123 Skyline Dr',
                    city: 'Manhattan',
                    state: 'NY',
                    zip_code: '10001',
                    bedrooms: 3,
                    bathrooms: 2,
                    area_sqft: 1840,
                    year_built: 2015,
                    parking: 2,
                    images: 'https://placehold.co/800x600/006aff/ffffff?text=Luxury+Penthouse',
                    latitude: 40.7489,
                    longitude: -73.9680
                },
                {
                    seller_id: user.id,
                    title: 'Modern Loft in Brooklyn',
                    description: 'Beautiful modern loft with high ceilings, exposed brick, and contemporary finishes.',
                    property_type: 'Condo',
                    listing_type: 'sale',
                    price: 980000,
                    address: '45 Broad St #12B',
                    city: 'Brooklyn',
                    state: 'NY',
                    zip_code: '11201',
                    bedrooms: 2,
                    bathrooms: 2,
                    area_sqft: 1200,
                    year_built: 2018,
                    parking: 1,
                    images: 'https://placehold.co/800x600/00adbb/ffffff?text=Modern+Loft',
                    latitude: 40.6943,
                    longitude: -73.9867
                }
            ];

            const stmt = db.prepare(`INSERT OR IGNORE INTO properties 
                (seller_id, title, description, property_type, listing_type, price, address, city, state, zip_code, 
                 bedrooms, bathrooms, area_sqft, year_built, parking, images, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            sampleProperties.forEach(prop => {
                stmt.run([
                    prop.seller_id, prop.title, prop.description, prop.property_type, prop.listing_type,
                    prop.price, prop.address, prop.city, prop.state, prop.zip_code,
                    prop.bedrooms, prop.bathrooms, prop.area_sqft, prop.year_built, prop.parking,
                    prop.images, prop.latitude, prop.longitude
                ]);
            });

            stmt.finalize((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

module.exports = { createTables };

