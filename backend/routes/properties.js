const express = require('express');
const { getDb } = require('../database/db');
const { authenticateToken, requireSeller } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get all properties (with filters)
router.get('/', (req, res) => {
    const db = getDb();
    const { listing_type, city, min_price, max_price, bedrooms, property_type, status = 'active' } = req.query;

    let query = `SELECT p.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone
                 FROM properties p
                 JOIN users u ON p.seller_id = u.id
                 WHERE p.status = ?`;
    const params = [status];

    if (listing_type) {
        query += ' AND p.listing_type = ?';
        params.push(listing_type);
    }
    if (city) {
        query += ' AND p.city LIKE ?';
        params.push(`%${city}%`);
    }
    if (min_price) {
        query += ' AND p.price >= ?';
        params.push(min_price);
    }
    if (max_price) {
        query += ' AND p.price <= ?';
        params.push(max_price);
    }
    if (bedrooms) {
        query += ' AND p.bedrooms >= ?';
        params.push(bedrooms);
    }
    if (property_type) {
        query += ' AND p.property_type = ?';
        params.push(property_type);
    }

    query += ' ORDER BY p.created_at DESC';

    db.all(query, params, (err, properties) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ properties });
    });
});

// Get single property
router.get('/:id', (req, res) => {
    const db = getDb();
    db.get(`SELECT p.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone
            FROM properties p
            JOIN users u ON p.seller_id = u.id
            WHERE p.id = ?`, [req.params.id], (err, property) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.json({ property });
    });
});

// Create property (seller only)
router.post('/', authenticateToken, requireSeller, [
    body('title').trim().notEmpty(),
    body('property_type').notEmpty(),
    body('listing_type').isIn(['sale', 'rent']),
    body('price').isFloat({ min: 0 }),
    body('address').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('state').trim().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const db = getDb();
    const {
        title, description, property_type, listing_type, price, address, city, state, zip_code,
        bedrooms, bathrooms, area_sqft, year_built, parking, images, latitude, longitude
    } = req.body;

    db.run(`INSERT INTO properties 
            (seller_id, title, description, property_type, listing_type, price, address, city, state, zip_code,
             bedrooms, bathrooms, area_sqft, year_built, parking, images, latitude, longitude)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, title, description || null, property_type, listing_type, price, address, city, state,
         zip_code || null, bedrooms || null, bathrooms || null, area_sqft || null, year_built || null,
         parking || 0, images || null, latitude || null, longitude || null],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create property' });
            }
            res.status(201).json({
                message: 'Property created successfully',
                property_id: this.lastID
            });
        }
    );
});

// Update property (seller only, own properties)
router.put('/:id', authenticateToken, requireSeller, (req, res) => {
    const db = getDb();
    const propertyId = req.params.id;

    // Check ownership
    db.get('SELECT seller_id FROM properties WHERE id = ?', [propertyId], (err, property) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        if (property.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to update this property' });
        }

        const fields = [];
        const values = [];

        Object.keys(req.body).forEach(key => {
            if (['title', 'description', 'property_type', 'listing_type', 'price', 'address', 'city', 'state',
                 'zip_code', 'bedrooms', 'bathrooms', 'area_sqft', 'year_built', 'parking', 'images',
                 'latitude', 'longitude', 'status'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(req.body[key]);
            }
        });

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        values.push(propertyId);
        db.run(`UPDATE properties SET ${fields.join(', ')} WHERE id = ?`, values, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update property' });
            }
            res.json({ message: 'Property updated successfully' });
        });
    });
});

// Delete property (seller only, own properties)
router.delete('/:id', authenticateToken, requireSeller, (req, res) => {
    const db = getDb();
    const propertyId = req.params.id;

    db.get('SELECT seller_id FROM properties WHERE id = ?', [propertyId], (err, property) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        if (property.seller_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this property' });
        }

        db.run('UPDATE properties SET status = ? WHERE id = ?', ['inactive', propertyId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete property' });
            }
            res.json({ message: 'Property deleted successfully' });
        });
    });
});

// Get seller's properties
router.get('/seller/my-properties', authenticateToken, requireSeller, (req, res) => {
    const db = getDb();
    db.all('SELECT * FROM properties WHERE seller_id = ? ORDER BY created_at DESC', [req.user.id], (err, properties) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ properties });
    });
});

module.exports = router;

