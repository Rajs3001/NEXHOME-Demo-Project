const { getDb } = require('../config/database');
const ImageService = require('../services/imageService');

/**
 * Property Model
 * Handles all database operations for properties
 */
class Property {
    /**
     * Get all properties with filters
     */
    static async findAll(filters = {}) {
        return new Promise((resolve, reject) => {
            const db = getDb();
            let query = `SELECT p.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone
                         FROM properties p
                         JOIN users u ON p.seller_id = u.id
                         WHERE 1=1`;
            const params = [];

            if (filters.status) {
                query += ' AND p.status = ?';
                params.push(filters.status);
            }

            if (filters.listing_type) {
                query += ' AND p.listing_type = ?';
                params.push(filters.listing_type);
            }

            if (filters.city) {
                query += ' AND p.city LIKE ?';
                params.push(`%${filters.city}%`);
            }

            if (filters.min_price) {
                query += ' AND p.price >= ?';
                params.push(filters.min_price);
            }

            if (filters.max_price) {
                query += ' AND p.price <= ?';
                params.push(filters.max_price);
            }

            if (filters.bedrooms) {
                query += ' AND p.bedrooms >= ?';
                params.push(filters.bedrooms);
            }

            if (filters.property_type) {
                query += ' AND p.property_type = ?';
                params.push(filters.property_type);
            }

            query += ' ORDER BY p.created_at DESC';
            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(filters.limit);
            }

            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // Process images for each property
                    const properties = rows.map(row => ({
                        ...row,
                        images: ImageService.getImageUrls(row.images)
                    }));
                    resolve(properties);
                }
            });
        });
    }

    /**
     * Find property by ID
     */
    static async findById(id) {
        return new Promise((resolve, reject) => {
            const db = getDb();
            db.get(`SELECT p.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone
                    FROM properties p
                    JOIN users u ON p.seller_id = u.id
                    WHERE p.id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(null);
                } else {
                    resolve({
                        ...row,
                        images: ImageService.getImageUrls(row.images)
                    });
                }
            });
        });
    }

    /**
     * Create new property
     */
    static async create(propertyData) {
        return new Promise((resolve, reject) => {
            const db = getDb();
            const {
                seller_id, title, description, property_type, listing_type, price,
                address, city, state, zip_code, bedrooms, bathrooms, area_sqft,
                year_built, parking, images, latitude, longitude
            } = propertyData;

            const imageString = ImageService.saveImageString(images);

            db.run(`INSERT INTO properties 
                    (seller_id, title, description, property_type, listing_type, price, address, city, state, zip_code,
                     bedrooms, bathrooms, area_sqft, year_built, parking, images, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [seller_id, title, description || null, property_type, listing_type, price, address, city, state,
                 zip_code || null, bedrooms || null, bathrooms || null, area_sqft || null, year_built || null,
                 parking || 0, imageString, latitude || null, longitude || null],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    /**
     * Update property
     */
    static async update(id, updates) {
        return new Promise((resolve, reject) => {
            const db = getDb();
            
            // Handle images if present
            if (updates.images) {
                updates.images = ImageService.saveImageString(updates.images);
            }

            const fields = [];
            const values = [];

            Object.keys(updates).forEach(key => {
                if (['title', 'description', 'property_type', 'listing_type', 'price', 'address', 'city', 'state',
                     'zip_code', 'bedrooms', 'bathrooms', 'area_sqft', 'year_built', 'parking', 'images',
                     'latitude', 'longitude', 'status'].includes(key)) {
                    fields.push(`${key} = ?`);
                    values.push(updates[key]);
                }
            });

            if (fields.length === 0) {
                resolve(false);
                return;
            }

            values.push(id);
            db.run(`UPDATE properties SET ${fields.join(', ')} WHERE id = ?`, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    /**
     * Delete property (soft delete - set status to inactive)
     */
    static async delete(id) {
        return new Promise((resolve, reject) => {
            const db = getDb();
            db.run('UPDATE properties SET status = ? WHERE id = ?', ['inactive', id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    /**
     * Get properties by seller
     */
    static async findBySeller(sellerId) {
        return new Promise((resolve, reject) => {
            const db = getDb();
            db.all('SELECT * FROM properties WHERE seller_id = ? ORDER BY created_at DESC', 
                [sellerId], 
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const properties = rows.map(row => ({
                            ...row,
                            images: ImageService.getImageUrls(row.images)
                        }));
                        resolve(properties);
                    }
                }
            );
        });
    }
}

module.exports = Property;

